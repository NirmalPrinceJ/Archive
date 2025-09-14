import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './env.js';
import { getAuthUrl, exchangeCode, listDriveFiles, fetchDriveFileContent, uploadDriveFile, browseDrive, getFileMeta } from './google.js';
import { listLocalFiles, readJsonSafe } from './local.js';
import { mergeArrays } from './normalize.js';
import path from 'path';
import nodemailer from 'nodemailer';
import { createDeckFromData, parseAccountsFromFirstTable } from './slides.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

// OAuth start
app.get('/auth/google', (_req, res) => {
  try {
    const url = getAuthUrl();
    res.redirect(url);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Auth URL error' });
  }
});

// OAuth callback
app.get(env.GOOGLE_REDIRECT_PATH, async (req, res) => {
  try {
    const { code } = req.query as { code?: string };
    if (!code) return res.status(400).send('Missing code');
    await exchangeCode(code);
    res.send('<h1>Authentication complete</h1><p>You can close this tab and return to the app.</p>');
  } catch (e: any) {
    res.status(500).send('OAuth failed: ' + (e?.message || ''));
  }
});

// Local loader
app.get('/api/local', (req, res) => {
  try {
    const dir = (req.query.folder as string) || env.LOCAL_DATA_DIR;
    const pattern = (req.query.pattern as string) || env.LOCAL_GLOB;
    const files = listLocalFiles(dir, pattern);
    res.json({ files: files.map(f => ({ name: f.name })) });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Local list error' });
  }
});

// Drive list
app.get('/api/drive/list', async (req, res) => {
  try {
    const folderId = (req.query.folderId as string) || env.DRIVE_FOLDER_ID;
    if (!folderId) return res.status(400).json({ error: 'Missing folderId' });
    const patt = (req.query.pattern as string) || '*.json';
    const regex = new RegExp('^' + patt.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
    const files = await listDriveFiles({ folderId, pattern: regex });
    res.json({ files });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Drive list error' });
  }
});

// Normalized data endpoint
app.get('/api/data/normalized', async (req, res) => {
  try {
    const source = (req.query.source as string) || 'local';
    const max = Number(req.query.max || 100);
    let payloads: unknown[] = [];

    if (source === 'local') {
      const dir = (req.query.folder as string) || env.LOCAL_DATA_DIR;
      const pattern = (req.query.pattern as string) || env.LOCAL_GLOB;
      const files = listLocalFiles(dir, pattern).slice(0, max);
      for (const f of files) payloads.push(readJsonSafe(f.path));
    } else if (source === 'drive') {
      const folderId = (req.query.folderId as string) || env.DRIVE_FOLDER_ID;
      if (!folderId) return res.status(400).json({ error: 'Missing folderId' });
      const patt = (req.query.pattern as string) || '*.json';
      const regex = new RegExp('^' + patt.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
      const files = await listDriveFiles({ folderId, pattern: regex, max });
      for (const f of files) {
        const raw = await fetchDriveFileContent(String(f.id));
        try { payloads.push(JSON.parse(raw)); } catch { /* ignore bad JSON */ }
      }
    } else {
      return res.status(400).json({ error: 'Unknown source' });
    }

    const combined = mergeArrays(payloads);
    res.json({ source, count: combined.length, accounts: combined });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Normalization error' });
  }
});

// Upload a file to Google Drive
app.post('/api/drive/upload', async (req, res) => {
  try {
    const { name, mimeType, contentBase64, folderId } = req.body || {};
    if (!name || !mimeType || !contentBase64) return res.status(400).json({ error: 'name, mimeType, contentBase64 required' });
    const buf = Buffer.from(String(contentBase64).split(',').pop(), 'base64');
    const file = await uploadDriveFile({ name, mimeType, data: buf, folderId });
    res.json({ ok: true, file });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Drive upload error' });
  }
});

// Convenience: export current JSON (accounts/tasks) to Drive
app.post('/api/drive/export-json', async (req, res) => {
  try {
    const { accounts = [], tasks = [], folderId, name } = req.body || {};
    const payload = JSON.stringify({ accounts, tasks, exportedAt: new Date().toISOString() }, null, 2);
    const fileName = name || `dashboard_export_${Date.now()}.json`;
    const file = await uploadDriveFile({ name: fileName, mimeType: 'application/json', data: Buffer.from(payload, 'utf8'), folderId });
    res.json({ ok: true, file });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Drive export error' });
  }
});

// Drive browse (folders/files)
app.get('/api/drive/browse', async (req, res) => {
  try {
    const folderId = (req.query.folderId as string) || 'root';
    const type = (req.query.type as string) as 'folders'|'files'|'all' || 'folders';
    const q = (req.query.q as string) || '';
    const pageToken = (req.query.pageToken as string) || undefined;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
    const out = await browseDrive({ folderId, type, q, pageToken, pageSize });
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Drive browse error' });
  }
});

// Drive get file meta
app.get('/api/drive/file', async (req, res) => {
  try {
    const id = String(req.query.id||'');
    if (!id) return res.status(400).json({ error: 'id required' });
    const meta = await getFileMeta(id);
    res.json({ file: meta });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Drive file error' });
  }
});

// Slack: post a message
app.post('/api/slack/post', async (req, res) => {
  try {
    const token = process.env.SLACK_BOT_TOKEN || '';
    const channel = (req.body && req.body.channel) || process.env.SLACK_DEFAULT_CHANNEL || '';
    const text = (req.body && req.body.text) || '';
    if (!token) return res.status(400).json({ error: 'Missing SLACK_BOT_TOKEN' });
    if (!channel) return res.status(400).json({ error: 'Missing channel' });
    if (!text) return res.status(400).json({ error: 'Missing text' });
    const resp = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, text })
    });
    const data = await resp.json();
    if (!data.ok) return res.status(500).json({ error: data.error || 'Slack error' });
    res.json({ ok: true, ts: data.ts });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Slack post error' });
  }
});

// Email: send using SMTP via nodemailer
app.post('/api/email/send', async (req, res) => {
  try {
    const host = process.env.SMTP_HOST || '';
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';
    if (!host || !user || !pass) return res.status(400).json({ error: 'Missing SMTP config' });
    const from = (req.body && req.body.from) || process.env.EMAIL_FROM || user;
    const to = (req.body && req.body.to) || process.env.EMAIL_TO_DEFAULT || user;
    const subject = (req.body && req.body.subject) || 'CSM Dashboard Notification';
    const html = (req.body && req.body.html) || '<p>Hello from CSM Dashboard</p>';
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    const info = await transporter.sendMail({ from, to, subject, html });
    res.json({ ok: true, id: info.messageId });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Email send error' });
  }
});

// Slides: export deck from current data
app.post('/api/slides/export', async (req, res) => {
  try {
    const { title, accounts = [], tasks = [], folderId, templateId } = req.body || {};
    const out = await createDeckFromData({ title, accounts, tasks, folderId, templateId });
    res.json({ ok: true, ...out });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Slides export error' });
  }
});

// Slides: import accounts from first table in a deck
app.get('/api/slides/import', async (req, res) => {
  try {
    const presentationId = String(req.query.presentationId || '');
    if (!presentationId) return res.status(400).json({ error: 'presentationId required' });
    const rows = await parseAccountsFromFirstTable(presentationId);
    res.json({ ok: true, accounts: rows });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Slides import error' });
  }
});

// Serve static built web (optional when deployed together)
app.use('/', express.static(path.resolve(process.cwd(), '../web/dist')));

app.listen(env.PORT, () => {
  console.log(`[server] listening on :${env.PORT}`);
});

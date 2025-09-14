import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { env } from './env.js';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const TOKEN_PATH = path.join(DATA_DIR, 'token.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getOAuth2Client() {
  const redirectUri = new URL(env.GOOGLE_REDIRECT_PATH, env.BASE_URL).toString();
  return new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, redirectUri);
}

export function getAuthUrl() {
  const oAuth2Client = getOAuth2Client();
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: env.GOOGLE_SCOPES,
    prompt: 'consent'
  });
}

export async function exchangeCode(code: string) {
  const oAuth2Client = getOAuth2Client();
  const { tokens } = await oAuth2Client.getToken(code);
  ensureDataDir();
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

export function loadSavedClient() {
  try {
    const raw = fs.readFileSync(TOKEN_PATH, 'utf8');
    const tokens = JSON.parse(raw);
    const oAuth2Client = getOAuth2Client();
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
  } catch {
    return null;
  }
}

export async function listDriveFiles(params: { folderId: string; pattern?: RegExp; max?: number }) {
  const client = loadSavedClient();
  if (!client) throw new Error('Not authenticated. Visit /auth/google to connect.');
  const drive = google.drive({ version: 'v3', auth: client });
  const q = `'${params.folderId}' in parents and trashed = false`;
  const res = await drive.files.list({ q, fields: 'files(id,name,mimeType,modifiedTime,webViewLink)', pageSize: params.max || 1000 });
  let files = res.data.files || [];
  if (params.pattern) files = files.filter(f => params.pattern!.test(f.name || ''));
  return files;
}

export async function fetchDriveFileContent(fileId: string) {
  const client = loadSavedClient();
  if (!client) throw new Error('Not authenticated. Visit /auth/google to connect.');
  const drive = google.drive({ version: 'v3', auth: client });
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
  const chunks: Buffer[] = [];
  return new Promise<string>((resolve, reject) => {
    res.data
      .on('data', d => chunks.push(Buffer.from(d)))
      .on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      .on('error', reject);
  });
}

export async function uploadDriveFile(params: { name: string; mimeType: string; data: Buffer; folderId?: string }) {
  const client = loadSavedClient();
  if (!client) throw new Error('Not authenticated. Visit /auth/google to connect.');
  const drive = google.drive({ version: 'v3', auth: client });
  const requestBody: any = { name: params.name, mimeType: params.mimeType };
  if (params.folderId || env.DRIVE_FOLDER_ID) requestBody.parents = [params.folderId || env.DRIVE_FOLDER_ID];
  const res = await drive.files.create({
    requestBody,
    media: { mimeType: params.mimeType, body: Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data) as any },
    fields: 'id,name,webViewLink,webContentLink'
  });
  return res.data;
}

export async function browseDrive(params: { folderId?: string; type?: 'folders'|'files'|'all'; q?: string; pageToken?: string; pageSize?: number }) {
  const client = loadSavedClient();
  if (!client) throw new Error('Not authenticated. Visit /auth/google to connect.');
  const drive = google.drive({ version: 'v3', auth: client });
  const folderId = params.folderId || 'root';
  const type = params.type || 'folders';
  const mFolder = "mimeType = 'application/vnd.google-apps.folder'";
  const mFileNotFolder = "mimeType != 'application/vnd.google-apps.folder'";
  const typeFilter = type === 'folders' ? mFolder : type === 'files' ? mFileNotFolder : '(mimeType != null)';
  const qParts = [
    `'${folderId}' in parents`,
    'trashed = false',
    typeFilter
  ];
  if (params.q) {
    const safe = params.q.replace(/'/g, "\'");
    qParts.push(`name contains '${safe}'`);
  }
  const q = qParts.join(' and ');
  const res = await drive.files.list({
    q,
    fields: 'nextPageToken, files(id,name,mimeType,modifiedTime,iconLink,webViewLink)',
    pageSize: Math.min(params.pageSize || 100, 1000),
    pageToken: params.pageToken
  });
  return { files: res.data.files || [], nextPageToken: res.data.nextPageToken };
}

export async function getFileMeta(id: string) {
  const client = loadSavedClient();
  if (!client) throw new Error('Not authenticated. Visit /auth/google to connect.');
  const drive = google.drive({ version: 'v3', auth: client });
  const res = await drive.files.get({ fileId: id, fields: 'id,name,mimeType,parents,webViewLink' });
  return res.data;
}

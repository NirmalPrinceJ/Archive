/**
 * Google Apps Script backend to serve JSON from a Google Sheet
 * and accept updates from the dashboard.
 *
 * How to use:
 * 1) Open script.google.com, create a new project.
 * 2) Paste this code, set SHEET_ID and SHEET_NAME below.
 * 3) Deploy → New deployment → Type: Web app → Execute as: Me → Who has access: Anyone with the link.
 * 4) Copy the deployment URL and set it in SHEETS_WEBAPP_URL in your Dashboard.html.
 */

// Sheet configuration. You can set SHEET_ID here or let the Web App
// create and store it via ?what=bootstrap. Stored in Script Properties.
const PLACEHOLDER_SHEET_ID = 'REPLACE_WITH_SHEET_ID';
const SHEET_NAME = 'Accounts';

function _getStoredSheetId() {
  const prop = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  return prop || PLACEHOLDER_SHEET_ID;
}

function _setStoredSheetId(id) {
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', String(id));
}

function _getSheet() {
  const id = _getStoredSheetId();
  if (!id || id === PLACEHOLDER_SHEET_ID) throw new Error('SHEET_ID not configured. Call ?what=bootstrap or POST { action: "setSheetId", sheetId }');
  const ss = SpreadsheetApp.openById(id);
  const sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('Sheet not found: ' + SHEET_NAME);
  return sh;
}

function _rowsToObjects(values) {
  if (!values || values.length < 2) return [];
  const headers = values[0].map(h => String(h || '').trim());
  const rows = [];
  for (let r = 1; r < values.length; r++) {
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = values[r][c];
    }
    rows.push(obj);
  }
  return rows;
}

function _objectsTo2D(headers, objects) {
  const out = [headers];
  for (const o of objects) {
    out.push(headers.map(h => o[h] ?? ''));
  }
  return out;
}

function doGet(e) {
  try {
    const what = (e && e.parameter && e.parameter.what) || '';

    if (what === 'bootstrap') {
      const ss = SpreadsheetApp.create('CSM Dashboard Data ' + new Date().toISOString().slice(0,10));
      _setStoredSheetId(ss.getId());
      const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
      const headers = _defaultHeaders();
      const matrix = _objectsTo2D(headers, _defaultSeed());
      sh.clear();
      sh.getRange(1,1,matrix.length, headers.length).setValues(matrix);
      return _json({ ok: true, created: true, sheetId: ss.getId(), url: ss.getUrl(), sheetName: SHEET_NAME });
    }

    if (what === 'seed') {
      const sh = _getSheet();
      const headers = _defaultHeaders();
      const matrix = _objectsTo2D(headers, _defaultSeed());
      sh.clear();
      sh.getRange(1,1,matrix.length, headers.length).setValues(matrix);
      const values = sh.getDataRange().getValues();
      const data = _rowsToObjects(values);
      return _json({ ok: true, seeded: true, accounts: data });
    }

    const sh = _getSheet();
    const values = sh.getDataRange().getValues();
    const data = _rowsToObjects(values);
    return _json({ accounts: data });
  } catch (err) {
    return _json({ error: String(err) }, 500);
  }
}

function doPost(e) {
  try {
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};

    if (body && body.action === 'setSheetId' && body.sheetId) {
      _setStoredSheetId(String(body.sheetId));
      return _json({ ok: true, saved: true, sheetId: String(body.sheetId) });
    }

    const accounts = Array.isArray(body.accounts) ? body.accounts : [];

    if (!accounts.length) return _json({ ok: true, message: 'No data provided' });

    const sh = _getSheet();
    // Determine headers to write
    const existing = sh.getDataRange().getValues();
    const headers = existing.length ? existing[0].map(h => String(h || '').trim()) : Object.keys(accounts[0]);
    if (!existing.length) {
      sh.getRange(1,1,1,headers.length).setValues([headers]);
    }

    // Replace all data below header (idempotent save)
    sh.getRange(2,1,Math.max(0, sh.getLastRow()-1), Math.max(1, sh.getLastColumn())).clearContent();
    const matrix = _objectsTo2D(headers, accounts);
    if (matrix.length > 1) sh.getRange(1,1,matrix.length, headers.length).setValues(matrix);

    return _json({ ok: true, rows: accounts.length });
  } catch (err) {
    return _json({ error: String(err) }, 500);
  }
}

function _json(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  // CORS
  const resp = HtmlService.createHtmlOutput('')
    .addMetaTag('Access-Control-Allow-Origin', '*')
    .addMetaTag('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addMetaTag('Access-Control-Allow-Headers', 'Content-Type');
  // Apps Script cannot directly set status with TextOutput. Return body only.
  return output;
}

function _defaultHeaders() {
  return ['account','adoption','css','expertise','vcoresProd','vcoresPre','envs','renewal','risk'];
}

function _defaultSeed() {
  return [
    { account:'Birkenstock', adoption:82, css:8.1, expertise:4, vcoresProd:10.2, vcoresPre:18.8, envs:5, renewal:'2026-03-15', risk:'Green' },
    { account:'CSL Seqirus', adoption:74, css:7.8, expertise:3, vcoresProd:14.0, vcoresPre:20.0, envs:4, renewal:'2025-12-01', risk:'Amber' },
    { account:'Gard', adoption:68, css:8.3, expertise:5, vcoresProd:19.9, vcoresPre:50.6, envs:7, renewal:'2026-06-30', risk:'Green' },
    { account:'Wates', adoption:49, css:7.5, expertise:2, vcoresProd:12.0, vcoresPre:22.5, envs:3, renewal:'2025-11-15', risk:'Red' }
  ];
}

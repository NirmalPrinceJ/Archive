/**
 * Google Apps Script backend for Dashboard
 * Handles accounts and tasks data through a Google Sheet
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Accounts',
  TASKS_SHEET_NAME: 'Tasks',
  REQUIRED_FIELDS: ['account', 'adoption', 'css', 'expertise']
};

// Helper Functions
function getSheet(sheetName) {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) {
    throw new Error('Sheet ID not configured. Please run setup first.');
  }
  
  const ss = SpreadsheetApp.openById(id);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  return sheet;
}

/**
 * Converts a 2D array of sheet values into an array of objects.
 * @param {Array<Array<any>>} values The values from the sheet.
 * @returns {Array<Object>} An array of row objects.
 */
function rowsToObjects(values) {
  if (!values || values.length < 2) return [];
  var headers = values[0].map(function(h) { return String(h || '').trim(); });
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      obj[headers[c]] = values[r][c];
    }
    rows.push(obj);
  }
  return rows;
}

/**
 * Converts an array of objects into a 2D array for writing to a sheet.
 * @param {Array<string>} headers The header row.
 * @param {Array<Object>} objects The array of row objects.
 * @returns {Array<Array<any>>} A 2D array of values.
 */
function _objectsTo2D(headers, objects) {
  var out = [headers];
  for (var i = 0; i < objects.length; i++) {
    var o = objects[i];
    var row = headers.map(function(h) {
      return o[h] !== undefined && o[h] !== null ? o[h] : '';
    });
    out.push(row);
  }
  return out;
}

/**
 * Handles HTTP GET requests.
 * @param {Object} e The event parameter from the web app request.
 * @returns {ContentService.TextOutput} The JSON or JSONP response.
 */
function doGet(e) {
  try {
    var what = (e && e.parameter && e.parameter.what) || '';

    if (what === 'bootstrap') {
      var ss = SpreadsheetApp.create('CSM Dashboard Data ' + new Date().toISOString().slice(0,10));
      _setStoredSheetId(ss.getId());
      var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
      var headers = _defaultHeaders();
      var matrix = _objectsTo2D(headers, _defaultSeed());
      sh.clear();
      sh.getRange(1, 1, matrix.length, headers.length).setValues(matrix);
      return _json({ ok: true, created: true, sheetId: ss.getId(), url: ss.getUrl(), sheetName: SHEET_NAME }, e);
    }

    if (what === 'seed') {
      var sh = _getSheet();
      var headers = _defaultHeaders();
      var matrix = _objectsTo2D(headers, _defaultSeed());
      sh.clear();
      sh.getRange(1, 1, matrix.length, headers.length).setValues(matrix);
      var values = sh.getDataRange().getValues();
      var data = _rowsToObjects(values);
      return _json({ ok: true, seeded: true, accounts: data }, e);
    }

    var sh = _getSheet();
    var values = sh.getDataRange().getValues();
    var data = _rowsToObjects(values);
    return _json({ accounts: data }, e);
  } catch (err) {
    return _json({ error: String(err.message || err) }, e);
  }
}

/**
 * Handles HTTP POST requests.
 * @param {Object} e The event parameter from the web app request.
 * @returns {ContentService.TextOutput} The JSON response.
 */
function doPost(e) {
  try {
    var body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};

    if (body && body.action === 'setSheetId' && body.sheetId) {
      _setStoredSheetId(String(body.sheetId));
      return _json({ ok: true, saved: true, sheetId: String(body.sheetId) }, e);
    }

    var accounts = Array.isArray(body.accounts) ? body.accounts : [];

    if (accounts.length === 0) {
      return _json({ ok: true, message: 'No data provided' }, e);
    }

    var sh = _getSheet();
    var existing = sh.getDataRange().getValues();
    var headers = existing.length > 0 ? existing[0].map(function(h) { return String(h || '').trim(); }) : Object.keys(accounts[0]);
    
    if (existing.length === 0) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // Clear existing data (but not headers)
    if (sh.getLastRow() > 1) {
      sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
    }
    
    var matrix = _objectsTo2D(headers, accounts);
    // Write new data (don't re-write headers)
    if (matrix.length > 1) {
      sh.getRange(2, 1, matrix.length - 1, headers.length).setValues(matrix.slice(1));
    }

    return _json({ ok: true, rows: accounts.length }, e);
  } catch (err) {
    return _json({ error: String(err.message || err) }, e);
  }
}

/**
 * Creates a JSON or JSONP response.
 * @param {Object} obj The object to serialize.
 * @param {Object} e The event parameter, used to check for a 'callback' for JSONP.
 * @returns {ContentService.TextOutput} The response.
 */
function _json(obj, e) {
  var content = JSON.stringify(obj);
  var mimeType = ContentService.MimeType.JSON;
  
  if (e && e.parameter && e.parameter.callback) {
    content = e.parameter.callback + '(' + content + ')';
    mimeType = ContentService.MimeType.JAVASCRIPT;
  }
  
  return ContentService.createTextOutput(content).setMimeType(mimeType);
}

/**
 * Returns the default headers for a new sheet.
 * @returns {Array<string>}
 */
function _defaultHeaders() {
  return ['account','adoption','css','expertise','vcoresProd','vcoresPre','envs','renewal','risk'];
}

/**
 * Returns default seed data for a new sheet.
 * @returns {Array<Object>}
 */
function _defaultSeed() {
  return [
    { account:'Birkenstock', adoption:82, css:8.1, expertise:4, vcoresProd:10.2, vcoresPre:18.8, envs:5, renewal:'2026-03-15', risk:'Green' },
    { account:'CSL Seqirus', adoption:74, css:7.8, expertise:3, vcoresProd:14.0, vcoresPre:20.0, envs:4, renewal:'2025-12-01', risk:'Amber' },
    { account:'Gard', adoption:68, css:8.3, expertise:5, vcoresProd:19.9, vcoresPre:50.6, envs:7, renewal:'2026-06-30', risk:'Green' },
    { account:'Wates', adoption:49, css:7.5, expertise:2, vcoresProd:12.0, vcoresPre:22.5, envs:3, renewal:'2025-11-15', risk:'Red' }
  ];
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
    var what = (e && e.parameter && e.parameter.what) || '';

    if (what === 'bootstrap') {
      var ss = SpreadsheetApp.create('CSM Dashboard Data ' + new Date().toISOString().slice(0,10));
      _setStoredSheetId(ss.getId());
      var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
      var headers = _defaultHeaders();
      var matrix = _objectsTo2D(headers, _defaultSeed());
      sh.clear();
      sh.getRange(1,1,matrix.length, headers.length).setValues(matrix);
      return _json({ ok: true, created: true, sheetId: ss.getId(), url: ss.getUrl(), sheetName: SHEET_NAME }, e);
    }

    if (what === 'seed') {
      var sh = _getSheet();
      var headers = _defaultHeaders();
      var matrix = _objectsTo2D(headers, _defaultSeed());
      sh.clear();
      sh.getRange(1,1,matrix.length, headers.length).setValues(matrix);
      var values = sh.getDataRange().getValues();
      var data = _rowsToObjects(values);
      return _json({ ok: true, seeded: true, accounts: data }, e);
    }

    var sh = _getSheet();
    var values = sh.getDataRange().getValues();
    var data = _rowsToObjects(values);
    return _json({ accounts: data }, e);
  } catch (err) {
    return _json({ error: String(err.message || err) }, e);
  }
}

function doPost(e) {
  try {
    var body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};

    if (body && body.action === 'setSheetId' && body.sheetId) {
      _setStoredSheetId(String(body.sheetId));
      return _json({ ok: true, saved: true, sheetId: String(body.sheetId) }, e);
    }

    var accounts = Array.isArray(body.accounts) ? body.accounts : [];

    if (!accounts.length) return _json({ ok: true, message: 'No data provided' }, e);

    var sh = _getSheet();
    var existing = sh.getDataRange().getValues();
    var headers = existing.length > 0 ? existing[0].map(function(h) { return String(h || '').trim(); }) : Object.keys(accounts[0]);
    
    if (existing.length === 0) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    if (sh.getLastRow() > 1) {
      sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
    }
    
    var matrix = _objectsTo2D(headers, accounts);
    if (matrix.length > 1) {
      sh.getRange(2, 1, matrix.length - 1, headers.length).setValues(matrix.slice(1));
    }

    return _json({ ok: true, rows: accounts.length }, e);
  } catch (err) {
    return _json({ error: String(err.message || err) }, e);
  }
}

function _json(obj, e) {
  var content = JSON.stringify(obj);
  var mimeType = ContentService.MimeType.JSON;
  
  if (e && e.parameter && e.parameter.callback) {
    content = e.parameter.callback + '(' + content + ')';
    mimeType = ContentService.MimeType.JAVASCRIPT;
  }
  
  return ContentService.createTextOutput(content).setMimeType(mimeType);
}

function doPost(e) {
  try {
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};

    if (body && body.action === 'setSheetId' && body.sheetId) {
      _setStoredSheetId(String(body.sheetId));
      return _json({ ok: true, saved: true, sheetId: String(body.sheetId) }, e);
    }

    const accounts = Array.isArray(body.accounts) ? body.accounts : [];

    if (!accounts.length) return _json({ ok: true, message: 'No data provided' }, e);

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

    return _json({ ok: true, rows: accounts.length }, e);
  } catch (err) {
    return _json({ error: String(err) }, e);
  }
}

function _json(obj, e) {
  var output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);

  // Support JSONP for cross-domain GET requests
  if (e && e.parameter && e.parameter.callback) {
    output.setMimeType(ContentService.MimeType.JAVASCRIPT);
    output.setContent(e.parameter.callback + '(' + JSON.stringify(obj) + ')');
  }
  
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

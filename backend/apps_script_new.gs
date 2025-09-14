/**
 * CSM Dashboard API Handlers
 * ES5 compatible implementation for Google Apps Script runtime
 */

// Configuration
var CONFIG = {
  SHEETS: {
    ACCOUNTS: 'Accounts',
    TASKS: 'Tasks'
  }
};

/**
 * Handle GET requests
 * @param {Object} e - Event object from Apps Script
 * @return {Object} JSON response
 */
function doGet(e) {
  try {
    var params = e.parameter;
    var api = params.api;
    var response;

    if (!api) {
      throw new Error('API endpoint not specified');
    }

    switch (api.toLowerCase()) {
      case 'accounts':
        response = getAccounts();
        break;
      case 'tasks':
        response = getTasks();
        break;
      default:
        throw new Error('Invalid API endpoint: ' + api);
    }

    return createJsonResponse(response);
  } catch (error) {
    return createJsonResponse({ error: error.message }, 400);
  }
}

/**
 * Handle POST requests
 * @param {Object} e - Event object from Apps Script
 * @return {Object} JSON response
 */
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error('No data provided');
    }

    var params = e.parameter;
    var api = params.api;
    var data = JSON.parse(e.postData.contents);
    var response;

    if (!api) {
      throw new Error('API endpoint not specified');
    }

    switch (api.toLowerCase()) {
      case 'accounts':
        response = updateAccounts(data);
        break;
      case 'tasks':
        response = updateTasks(data);
        break;
      default:
        throw new Error('Invalid API endpoint: ' + api);
    }

    return createJsonResponse(response);
  } catch (error) {
    return createJsonResponse({ error: error.message }, 400);
  }
}

/**
 * Get accounts data from sheet
 * @return {Object[]} Array of account objects
 */
function getAccounts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.ACCOUNTS);
  if (!sheet) {
    throw new Error('Accounts sheet not found');
  }

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var accounts = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var account = {};
    
    for (var j = 0; j < headers.length; j++) {
      account[headers[j]] = row[j];
    }
    
    accounts.push(account);
  }

  return accounts;
}

/**
 * Get tasks data from sheet
 * @return {Object[]} Array of task objects
 */
function getTasks() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.TASKS);
  if (!sheet) {
    throw new Error('Tasks sheet not found');
  }

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var tasks = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var task = {};
    
    for (var j = 0; j < headers.length; j++) {
      task[headers[j]] = row[j];
    }
    
    tasks.push(task);
  }

  return tasks;
}

/**
 * Update accounts data
 * @param {Object[]} accounts - Array of account objects to update
 * @return {Object} Update status
 */
function updateAccounts(accounts) {
  if (!Array.isArray(accounts)) {
    throw new Error('Invalid accounts data format');
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.ACCOUNTS);
  if (!sheet) {
    throw new Error('Accounts sheet not found');
  }

  // Get headers
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Prepare data for update
  var data = accounts.map(function(account) {
    return headers.map(function(header) {
      return account[header] || '';
    });
  });

  // Update sheet
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  }

  return { 
    status: 'success',
    message: accounts.length + ' accounts updated'
  };
}

/**
 * Update tasks data
 * @param {Object[]} tasks - Array of task objects to update
 * @return {Object} Update status
 */
function updateTasks(tasks) {
  if (!Array.isArray(tasks)) {
    throw new Error('Invalid tasks data format');
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.TASKS);
  if (!sheet) {
    throw new Error('Tasks sheet not found');
  }

  // Get headers
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Prepare data for update
  var data = tasks.map(function(task) {
    return headers.map(function(header) {
      return task[header] || '';
    });
  });

  // Update sheet
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  }

  return { 
    status: 'success',
    message: tasks.length + ' tasks updated'
  };
}

/**
 * Create JSON response with proper content type
 * @param {Object} data - Response data
 * @param {number} [responseCode=200] - HTTP response code
 * @return {Object} ContentService response
 */
function createJsonResponse(data, responseCode) {
  var response = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  if (responseCode) {
    // Note: Apps Script doesn't support setting response codes directly
    // We include it in the response data for client-side handling
    data.responseCode = responseCode;
  }
  
  return response;
}

var SHEET_CONFIG = {
  ACCOUNTS_SHEET: 'Accounts',
  TASKS_SHEET: 'Tasks',
  REQUIRED_FIELDS: ['account', 'adoption', 'css', 'expertise']
};

/**
 * Gets a sheet by name from the configured spreadsheet
 * @param {string} sheetName - Name of the sheet to get
 * @returns {Sheet} The Google Sheet object
 */
function getSheet(sheetName) {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) {
    throw new Error('Sheet ID not configured. Please run setup first.');
  }
  
  var ss = SpreadsheetApp.openById(id);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  return sheet;
}

/**
 * Converts a 2D array of sheet values into an array of objects
 * @param {Array<Array<any>>} values - The values from the sheet
 * @returns {Array<Object>} An array of row objects
 */
function rowsToObjects(values) {
  if (!values || values.length < 2) {
    return [];
  }
  
  var headers = values[0];
  return values.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(header, index) {
      if (row[index] !== '') {
        obj[header] = row[index];
      }
    });
    return obj;
  });
}

/**
 * Validates that an account object has all required fields
 * @param {Object} account - The account object to validate
 */
function validateAccount(account) {
  var missing = SHEET_CONFIG.REQUIRED_FIELDS.filter(function(field) {
    return !account[field];
  });
  
  if (missing.length > 0) {
    throw new Error('Missing required fields: ' + missing.join(', '));
  }
}

/**
 * Gets all accounts from the sheet
 * @returns {Object} Response object with accounts array or error
 */
function getAccounts() {
  try {
    var sheet = getSheet(SHEET_CONFIG.ACCOUNTS_SHEET);
    var values = sheet.getDataRange().getValues();
    return { accounts: rowsToObjects(values) };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Gets all tasks from the sheet
 * @returns {Object} Response object with tasks array or error
 */
function getTasks() {
  try {
    var sheet = getSheet(SHEET_CONFIG.TASKS_SHEET);
    var values = sheet.getDataRange().getValues();
    return { tasks: rowsToObjects(values) };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Saves accounts to the sheet
 * @param {Array<Object>} accounts - Array of account objects to save
 * @returns {Object} Response object indicating success or error
 */
function saveAccounts(accounts) {
  try {
    if (!Array.isArray(accounts)) {
      throw new Error('Invalid accounts data format');
    }
    
    accounts.forEach(validateAccount);
    
    var sheet = getSheet(SHEET_CONFIG.ACCOUNTS_SHEET);
    var headers = Object.keys(accounts[0]);
    
    var values = [headers].concat(accounts.map(function(account) {
      return headers.map(function(h) {
        return account[h] || '';
      });
    }));
    
    sheet.getDataRange().clear();
    sheet.getRange(1, 1, values.length, values[0].length).setValues(values);
    
    return { success: true, message: 'Accounts updated successfully' };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Handles GET requests to the Web App
 * @param {Object} e - The event object
 * @returns {TextOutput} JSON response
 */
function doGet(e) {
  try {
    var api = e.parameter.api;
    var result;
    
    switch (api) {
      case 'accounts':
        result = getAccounts();
        break;
      case 'tasks':
        result = getTasks();
        break;
      default:
        result = { error: 'Invalid API endpoint' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles POST requests to the Web App
 * @param {Object} e - The event object
 * @returns {TextOutput} JSON response
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var result;
    
    if (data.accounts) {
      result = saveAccounts(data.accounts);
    } else {
      result = { error: 'Invalid request body' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
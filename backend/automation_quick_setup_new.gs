/**
 * CSM Dashboard Automation – Quick Setup Script
 * ES5 compatible implementation for Google Apps Script runtime
 */

var SETUP_CONFIG = {
  FOLDER_NAME: 'CSM-WORKSPACE',
  ACCOUNTS_SHEET: 'Accounts',
  TASKS_SHEET: 'Tasks',
  DEFAULT_ACCOUNTS: [{
    account: 'Example Corp',
    adoption: 75,
    css: 'Green',
    expertise: 'Advanced',
    vcoresProd: 100,
    vcoresPre: 20,
    envs: 'Prod, Pre-Prod',
    renewal: '2025-12-31',
    risk: 'Low'
  }]
};

/**
 * Quick setup function to initialize the dashboard environment
 * @returns {Object} Setup result with success status and details
 */
function quickSetupCSMDashboard() {
  try {
    // Create or get the main folder
    var folder = getOrCreateFolder(SETUP_CONFIG.FOLDER_NAME);
    
    // Create new spreadsheet
    var ss = SpreadsheetApp.create('CSM-WORKSPACE-DATA');
    if (!ss) {
      throw new Error('Failed to create spreadsheet');
    }
    
    var file = DriveApp.getFileById(ss.getId());
    file.moveTo(folder);
    
    // Set up Accounts sheet
    var accountsSheet = ss.getSheets()[0];
    if (!accountsSheet) {
      accountsSheet = ss.insertSheet(SETUP_CONFIG.ACCOUNTS_SHEET);
    } else {
      accountsSheet.setName(SETUP_CONFIG.ACCOUNTS_SHEET);
    }
    setupAccountsSheet(accountsSheet);
    
    // Set up Tasks sheet
    var existingTasksSheet = ss.getSheetByName(SETUP_CONFIG.TASKS_SHEET);
    if (existingTasksSheet) {
      ss.deleteSheet(existingTasksSheet);
    }
    var tasksSheet = ss.insertSheet(SETUP_CONFIG.TASKS_SHEET);
    setupTasksSheet(tasksSheet);
    
    // Store Sheet ID in Script Properties
    PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
    
    return {
      success: true,
      message: 'Setup completed successfully',
      sheetId: ss.getId(),
      sheetUrl: ss.getUrl(),
      folderId: folder.getId(),
      folderUrl: folder.getUrl()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Gets or creates a folder in Google Drive
 * @param {string} folderName - Name of the folder
 * @returns {Folder} The Google Drive folder
 */
function getOrCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

/**
 * Sets up the Accounts sheet with headers and sample data
 * @param {Sheet} sheet - The Google Sheet to set up
 */
function setupAccountsSheet(sheet) {
  if (!sheet) {
    throw new Error('Sheet object is undefined in setupAccountsSheet');
  }

  var headers = [
    'account',
    'adoption',
    'css',
    'expertise',
    'vcoresProd',
    'vcoresPre',
    'envs',
    'renewal',
    'risk'
  ];
  
  try {
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground('#f3f3f3');
    headerRange.setFontWeight('bold');
  
    // Add sample data
    var data = SETUP_CONFIG.DEFAULT_ACCOUNTS.map(function(account) {
      return headers.map(function(header) {
        return account[header] || '';
      });
    });
    
    if (data.length > 0) {
      sheet.getRange(2, 1, data.length, headers.length).setValues(data);
    }
    
    sheet.autoResizeColumns(1, headers.length);
  } catch (error) {
    throw new Error('Failed to setup Accounts sheet: ' + error.message);
  }
}

/**
 * Sets up the Tasks sheet with headers
 * @param {Sheet} sheet - The Google Sheet to set up
 */
function setupTasksSheet(sheet) {
  if (!sheet) {
    throw new Error('Sheet object is undefined in setupTasksSheet');
  }

  var headers = [
    'account',
    'task',
    'dueDate',
    'status',
    'assignee',
    'priority'
  ];
  
  try {
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground('#f3f3f3');
    headerRange.setFontWeight('bold');
    
    sheet.autoResizeColumns(1, headers.length);
  } catch (error) {
    throw new Error('Failed to setup Tasks sheet: ' + error.message);
  }
}
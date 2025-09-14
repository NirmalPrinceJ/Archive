/**
 * Enhanced CSM Dashboard Automation System with Agentforce Design
 * 
 * Deploy Instructions:
 * 1. Copy this code to your Code.gs file
 * 2. Run setupAndFix() function first
 * 3. Deploy as Web App: Deploy > New deployment > Web app
 * 4. Run getUrls() to get your dashboard links
 */

// ==================== CONFIGURATION ====================
var CONFIG = {
  ACCOUNTS_SHEET_ID: '1RjTmw42ayvyM5NHIBPqHivaM1evZRWoCM3XLNXQ4JZA',
  TASKS_SHEET_ID: '1xYrb-0un2Ti6MVx-4tF9exsCF8Yicql65zaJqxrxgG4',
  METRICS_SHEET_ID: '1u7N9b3lzqbgBYBvQRQ3zMEvpMH3ztgkU7q2iUea0c_4',
  TIMELINE_SHEET_ID: '1Apw1O7swaBQcq3NLwyotDVISNV7sQWtXdbdLJ4kbZgM',
  DASHBOARD_FOLDER_ID: '1Rk8vRqeihJCqF5uV8pJzRiDVcakIws94',
  QBR_SLIDES_FOLDER_ID: '1wxQ6f5qYWxx6t7VvvINRTfWbzZNf_r-B',
  RESOURCES_FOLDER_ID: '',
  MEETING_SUMMARIES_SHEET_ID: '',
  CALENDAR_ID: '',
  NOTIFICATION_EMAIL: 'nirmpapri@gmail.com',
  SLACK_WEBHOOK_URL: ''
};

// ==================== ENHANCED CSS STYLES ====================
function getEnhancedStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    :root {
        --primary-blue: #0176d3;
        --secondary-blue: #1589ee;
        --light-blue: #4fb5f7;
        --purple: #8b5fd6;
        --light-purple: #b8a5e8;
        --gradient-primary: linear-gradient(135deg, #0176d3 0%, #8b5fd6 100%);
        --gradient-secondary: linear-gradient(135deg, #1589ee 0%, #b8a5e8 100%);
        --gradient-subtle: linear-gradient(135deg, #f4f7ff 0%, #faf8ff 100%);
        --text-primary: #181818;
        --text-secondary: #5c5c5c;
        --text-muted: #747474;
        --background: #ffffff;
        --surface: #fafbfc;
        --border: #e5e7eb;
        --success: #28a745;
        --warning: #ffc107;
        --danger: #dc3545;
        --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
        --shadow-md: 0 4px 12px rgba(0,0,0,0.05);
        --shadow-lg: 0 8px 24px rgba(0,0,0,0.1);
        --radius-sm: 6px;
        --radius-md: 12px;
        --radius-lg: 16px;
    }
    
    body {
        font-family: 'Salesforce Sans', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif;
        line-height: 1.6;
        color: var(--text-primary);
        background: var(--background);
        overflow-x: hidden;
    }
    
    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 24px;
    }
    
    .header {
        background: var(--gradient-primary);
        padding: 32px 0;
        border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        margin-bottom: 32px;
        box-shadow: var(--shadow-lg);
    }
    
    .header h1 {
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header .subtitle {
        color: rgba(255,255,255,0.9);
        font-size: 1.125rem;
        font-weight: 400;
    }
    
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: var(--radius-md);
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;
        cursor: pointer;
        border: none;
        font-size: 14px;
    }
    
    .btn-primary {
        background: var(--gradient-primary);
        color: white;
        box-shadow: var(--shadow-md);
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(1,118,211,0.3);
    }
    
    .btn-secondary {
        background: rgba(255,255,255,0.2);
        color: white;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.3);
    }
    
    .btn-secondary:hover {
        background: rgba(255,255,255,0.3);
        transform: translateY(-1px);
    }
    
    .card {
        background: var(--background);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border);
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
    }
    
    .card-header {
        padding: 24px;
        border-bottom: 1px solid var(--border);
        background: var(--gradient-subtle);
    }
    
    .card-body {
        padding: 24px;
    }
    
    .card-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;
    }
    
    .grid {
        display: grid;
        gap: 24px;
    }
    
    .grid-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }
    
    @media (max-width: 1024px) {
        .grid-4 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 640px) {
        .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
        .container { padding: 0 16px; }
        .header h1 { font-size: 2rem; }
    }
    
    .kpi-card {
        text-align: center;
        padding: 32px 24px;
        position: relative;
        overflow: hidden;
    }
    
    .kpi-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--gradient-primary);
    }
    
    .kpi-value {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary-blue);
        margin-bottom: 8px;
        line-height: 1;
    }
    
    .kpi-label {
        font-size: 0.875rem;
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .kpi-delta {
        margin-top: 12px;
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .kpi-delta.positive { color: var(--success); }
    .kpi-delta.negative { color: var(--danger); }
    .kpi-delta.neutral { color: var(--text-muted); }
    
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .status-healthy {
        background: rgba(40, 167, 69, 0.1);
        color: var(--success);
        border: 1px solid rgba(40, 167, 69, 0.2);
    }
    
    .status-warning {
        background: rgba(255, 193, 7, 0.1);
        color: #e0a800;
        border: 1px solid rgba(255, 193, 7, 0.2);
    }
    
    .status-danger {
        background: rgba(220, 53, 69, 0.1);
        color: var(--danger);
        border: 1px solid rgba(220, 53, 69, 0.2);
    }
    
    .quick-links {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 32px;
    }
    
    .link-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--gradient-subtle);
        border: 1px solid var(--border);
        border-radius: 999px;
        text-decoration: none;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .link-chip:hover {
        background: var(--gradient-secondary);
        color: white;
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
    }
    
    .chart-container {
        position: relative;
        width: 100%;
        height: 320px;
        margin: 24px 0;
    }
    
    .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 24px;
        position: relative;
        padding-bottom: 12px;
    }
    
    .section-title::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 60px;
        height: 3px;
        background: var(--gradient-primary);
        border-radius: 999px;
    }
    
    .dropdown {
        position: relative;
        display: inline-block;
    }
    
    .dropdown-content {
        display: none;
        position: absolute;
        right: 0;
        background-color: white;
        min-width: 200px;
        box-shadow: var(--shadow-lg);
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        z-index: 1000;
        overflow: hidden;
        margin-top: 8px;
    }
    
    .dropdown.active .dropdown-content {
        display: block;
    }
    
    .dropdown-item {
        color: var(--text-primary);
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        transition: background-color 0.2s ease;
        border-bottom: 1px solid var(--border);
    }
    
    .dropdown-item:last-child {
        border-bottom: none;
    }
    
    .dropdown-item:hover {
        background-color: var(--surface);
        color: var(--primary-blue);
    }
    
    .ai-shortcuts {
        background: var(--gradient-subtle);
        border-radius: var(--radius-lg);
        padding: 32px;
        margin-top: 40px;
    }
    
    .ai-prompt {
        background: white;
        border-radius: var(--radius-md);
        padding: 20px;
        margin-bottom: 16px;
        border-left: 4px solid var(--primary-blue);
        box-shadow: var(--shadow-sm);
    }
    
    .ai-prompt:last-child {
        margin-bottom: 0;
    }
    
    .ai-prompt strong {
        color: var(--primary-blue);
        display: block;
        margin-bottom: 8px;
    }
  `;
}

// ==================== MAIN ENTRY POINTS ====================

function doGet(e) {
  try {
    Logger.log('GET request received with parameters: ' + JSON.stringify(e.parameter));
    
    if (e.parameter.api) {
      return handleApiRequest(e.parameter.api);
    }
    
    var account = e.parameter.account;
    if (!account) {
      return serveMainDashboardHTML();
    }
    
    switch(account.toLowerCase()) {
      case 'birkenstock':
        return HtmlService.createHtmlOutput(getEnhancedBirkenstockHTML())
          .setTitle('Birkenstock Dashboard')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      case 'csl':
        return HtmlService.createHtmlOutput(getEnhancedCSLSeqirusHTML())
          .setTitle('CSL Seqirus Dashboard')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      case 'gard':
        return HtmlService.createHtmlOutput(getEnhancedGardHTML())
          .setTitle('Gard Dashboard')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      case 'wates':
        return HtmlService.createHtmlOutput(getEnhancedWatesHTML())
          .setTitle('Wates Dashboard')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      default:
        throw new Error('Unknown account: ' + account);
    }
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createEnhancedErrorPage('Error', error.message);
  }
}

// Serve the rich Dashboard.html (from Drive Dashboard folder) as default page
function serveMainDashboardHTML() {
  var cfg = getConfig();
  var scriptUrl = ScriptApp.getService().getUrl();
  try {
    if (cfg.DASHBOARD_FOLDER_ID) {
      var folder = DriveApp.getFolderById(cfg.DASHBOARD_FOLDER_ID);
      var files = folder.getFilesByName('Dashboard.html');
      if (files.hasNext()) {
        var html = files.next().getBlob().getDataAsString();
        var patched = patchDashboardContent(html, cfg, scriptUrl);
        return HtmlService.createHtmlOutput(patched)
          .setTitle('CSM Dashboard')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }
    }
  } catch (e) {
    Logger.log('serveMainDashboardHTML fallback: ' + e);
  }
  // Fallback: lightweight enhanced overview
  return HtmlService.createHtmlOutput(getEnhancedDashboardHTML())
    .setTitle('CSM Dashboard Portal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function patchDashboardContent(html, cfg, scriptUrl) {
  try {
    // Replace placeholder Apps Script URL
    html = html.replace(/https:\/\/script\.google\.com\/macros\/s\/REPLACE_WITH_DEPLOYMENT_ID\/exec/g, scriptUrl);
    // If SHEETS_WEBAPP_URL constant appears, replace the whole assignment
    html = html.replace(/const\s+SHEETS_WEBAPP_URL\s*=\s*'[^']*';/g, "const SHEETS_WEBAPP_URL = '" + scriptUrl + "';");
    // Default embed to Accounts sheet
    var accountsLink = 'https://docs.google.com/spreadsheets/d/' + cfg.ACCOUNTS_SHEET_ID + '/edit';
    html = html.replace(/const\s+SHEET_URL\s*=\s*'[^']*';/g, "const SHEET_URL = '" + accountsLink + "';");
    // Inject a small bootstrap to persist runtime URLs
    var boot = "<script>(function(){try{localStorage.setItem('sheets.webapp.url','" + scriptUrl + "');localStorage.setItem('sheets.embed.url','" + accountsLink + "');}catch(e){}})();</script>";
    html = html.replace(/<\/(head)>/i, boot + '</$1>');
  } catch (e) { Logger.log('patchDashboardContent error: ' + e); }
  return html;
}

// ==================== ENHANCED DASHBOARD HTML ====================

function getEnhancedDashboardHTML() {
  var config = getConfig();
  var scriptUrl = ScriptApp.getService().getUrl();
  
  return '<!DOCTYPE html>\
<html lang="en">\
<head>\
    <meta charset="UTF-8">\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\
    <title>Enhanced CSM Dashboards - Overview</title>\
    <link rel="icon" type="image/x-icon" href="https://www.salesforce.com/favicon.ico">\
    <style>' + getEnhancedStyles() + '</style>\
</head>\
<body>\
    <div class="header">\
        <div class="container">\
            <div style="display: flex; justify-content: space-between; align-items: center;">\
                <div>\
                    <h1>Enhanced CSM Dashboards</h1>\
                    <p class="subtitle">Unified view of all accounts, resources, and strategic insights.</p>\
                </div>\
                <div style="display: flex; gap: 12px; align-items: center;">\
                    <div class="dropdown">\
                        <button class="btn btn-secondary" id="integrationsBtn">\
                            Integrations\
                        </button>\
                        <div class="dropdown-content" id="integrationsDropdown">\
                            <a href="https://docs.google.com/spreadsheets/d/' + config.ACCOUNTS_SHEET_ID + '/edit" target="_blank" class="dropdown-item">Accounts Sheet</a>\
                            <a href="https://docs.google.com/spreadsheets/d/' + config.TASKS_SHEET_ID + '/edit" target="_blank" class="dropdown-item">Tasks Sheet</a>\
                            <a href="' + scriptUrl + '?api=health" target="_blank" class="dropdown-item">Health Check</a>\
                        </div>\
                    </div>\
                    <button class="btn btn-secondary" id="darkToggle">Theme</button>\
                </div>\
            </div>\
        </div>\
    </div>\
\
    <div class="container">\
        <section style="margin-bottom: 40px;">\
            <h2 class="section-title">Account Dashboards</h2>\
            <div class="grid grid-4">\
                <a href="' + scriptUrl + '?account=birkenstock" class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value" style="font-size: 1.5rem; color: var(--success);">8.1</div>\
                            <div class="kpi-label">Birkenstock</div>\
                            <div class="kpi-delta neutral" style="margin-top: 8px;">Renewal: Mar 2026</div>\
                            <div class="status-badge status-healthy" style="margin-top: 12px;">\
                                <span>●</span> Healthy\
                            </div>\
                        </div>\
                    </div>\
                </a>\
                \
                <a href="' + scriptUrl + '?account=csl" class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value" style="font-size: 1.5rem; color: var(--warning);">7.6</div>\
                            <div class="kpi-label">CSL Seqirus</div>\
                            <div class="kpi-delta neutral" style="margin-top: 8px;">Renewal: Sep 2026</div>\
                            <div class="status-badge status-warning" style="margin-top: 12px;">\
                                <span>●</span> Monitor\
                            </div>\
                        </div>\
                    </div>\
                </a>\
                \
                <a href="' + scriptUrl + '?account=gard" class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value" style="font-size: 1.5rem; color: var(--danger);">7.8</div>\
                            <div class="kpi-label">Gard</div>\
                            <div class="kpi-delta negative" style="margin-top: 8px;">Renewal: Dec 2026</div>\
                            <div class="status-badge status-danger" style="margin-top: 12px;">\
                                <span>●</span> Risk\
                            </div>\
                        </div>\
                    </div>\
                </a>\
                \
                <a href="' + scriptUrl + '?account=wates" class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value" style="font-size: 1.5rem; color: var(--warning);">7.5</div>\
                            <div class="kpi-label">Wates</div>\
                            <div class="kpi-delta neutral" style="margin-top: 8px;">Renewal: Nov 2025</div>\
                            <div class="status-badge status-warning" style="margin-top: 12px;">\
                                <span>●</span> Monitor\
                            </div>\
                        </div>\
                    </div>\
                </a>\
            </div>\
        </section>\
\
        <section style="margin-bottom: 40px;">\
            <h2 class="section-title">System Overview</h2>\
            <div class="grid grid-3">\
                <div class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value" style="color: var(--success);">4</div>\
                            <div class="kpi-label">Active Accounts</div>\
                            <div class="kpi-delta positive">+2 this quarter</div>\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value" style="color: var(--primary-blue);">7.75</div>\
                            <div class="kpi-label">Average CSS</div>\
                            <div class="kpi-delta neutral">+0.1 vs last month</div>\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value" style="color: var(--purple);">12</div>\
                            <div class="kpi-label">Open Tasks</div>\
                            <div class="kpi-delta negative">3 high priority</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </section>\
\
        <section>\
            <h2 class="section-title">API Endpoints & Resources</h2>\
            <div class="card">\
                <div class="card-body">\
                    <div class="grid grid-2">\
                        <div>\
                            <h3 style="font-weight: 600; margin-bottom: 16px; color: var(--text-primary);">Available APIs</h3>\
                            <div>\
                                <div style="margin-bottom: 12px;">\
                                    <a href="' + scriptUrl + '?api=accounts" target="_blank" class="link-chip">\
                                        Accounts API\
                                    </a>\
                                </div>\
                                <div style="margin-bottom: 12px;">\
                                    <a href="' + scriptUrl + '?api=tasks" target="_blank" class="link-chip">\
                                        Tasks API\
                                    </a>\
                                </div>\
                                <div style="margin-bottom: 12px;">\
                                    <a href="' + scriptUrl + '?api=metrics" target="_blank" class="link-chip">\
                                        Metrics API\
                                    </a>\
                                </div>\
                                <div style="margin-bottom: 12px;">\
                                    <a href="' + scriptUrl + '?api=timeline" target="_blank" class="link-chip">\
                                        Timeline API\
                                    </a>\
                                </div>\
                            </div>\
                        </div>\
                        <div>\
                            <h3 style="font-weight: 600; margin-bottom: 16px; color: var(--text-primary);">Quick Actions</h3>\
                            <div>\
                                <div style="margin-bottom: 12px;">\
                                    <a href="' + scriptUrl + '?api=health" target="_blank" class="link-chip">\
                                        System Health\
                                    </a>\
                                </div>\
                                <div style="margin-bottom: 12px;">\
                                    <a href="https://salesforce.okta.com/" target="_blank" class="link-chip">\
                                        Okta Dashboard\
                                    </a>\
                                </div>\
                                <div style="margin-bottom: 12px;">\
                                    <a href="https://orgcs.lightning.force.com/lightning/n/CSM_Workspace" target="_blank" class="link-chip">\
                                        CSM Workspace\
                                    </a>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </section>\
    </div>\
\
    <script>\
        var integrationsBtn = document.getElementById("integrationsBtn");\
        var integrationsDropdown = document.getElementById("integrationsDropdown");\
        \
        integrationsBtn.addEventListener("click", function(e) {\
            e.stopPropagation();\
            document.querySelector(".dropdown").classList.toggle("active");\
        });\
\
        document.addEventListener("click", function() {\
            document.querySelector(".dropdown").classList.remove("active");\
        });\
\
        document.querySelectorAll(".card").forEach(function(card, index) {\
            card.addEventListener("click", function() {\
                if (this.href) {\
                    this.style.opacity = "0.6";\
                }\
            });\
        });\
    </script>\
</body>\
</html>';
}

// ==================== ENHANCED ACCOUNT DASHBOARD GENERATOR ====================

function generateEnhancedDashboardHTML(accountName, data) {
  var cssScoreCurrent = data.css.data[data.css.data.length - 1] || 7.5;
  var cssScorePrevious = data.css.data[data.css.data.length - 2] || cssScoreCurrent;
  var cssDelta = cssScoreCurrent - cssScorePrevious;
  var deltaText = cssDelta >= 0 ? '+' + cssDelta.toFixed(1) : cssDelta.toFixed(1);
  var deltaClass = cssDelta > 0 ? 'positive' : cssDelta < 0 ? 'negative' : 'neutral';
  
  var scriptUrl = ScriptApp.getService().getUrl();
  
  return '<!DOCTYPE html>\
<html lang="en">\
<head>\
    <meta charset="UTF-8">\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\
    <title>' + accountName + ' - Enhanced Account Dashboard</title>\
    <link rel="icon" type="image/x-icon" href="https://www.salesforce.com/favicon.ico">\
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\
    <style>' + getEnhancedStyles() + '</style>\
</head>\
<body>\
    <div class="header">\
        <div class="container">\
            <div style="display: flex; justify-content: space-between; align-items: center;">\
                <div>\
                    <h1>' + accountName + '</h1>\
                    <p class="subtitle">Interactive account dashboard with real-time insights and analytics</p>\
                </div>\
                <div style="display: flex; gap: 12px; align-items: center;">\
                    <a href="' + scriptUrl + '" class="btn btn-secondary">Back to Portal</a>\
                    <button class="btn btn-secondary" id="darkToggle">Theme</button>\
                </div>\
            </div>\
        </div>\
    </div>\
\
    <div class="container">\
        <section style="margin-bottom: 32px;">\
            <div class="quick-links">\
                <a href="https://salesforce.okta.com/" target="_blank" class="link-chip">Okta Dashboard</a>\
                <a href="https://sites.google.com/salesforce.com/agentspov/home" target="_blank" class="link-chip">Agentic POV Site</a>\
                <a href="https://orgcs.lightning.force.com/" target="_blank" class="link-chip">OrgCS</a>\
                <a href="https://prod-uswest-c.online.tableau.com/" target="_blank" class="link-chip">P360 Dashboard</a>\
                <a href="https://prod-uswest-c.online.tableau.com/" target="_blank" class="link-chip">CSS Reports</a>\
                <a href="https://orgcs.lightning.force.com/lightning/n/CSM_Workspace" target="_blank" class="link-chip">CSM Workspace</a>\
                <a href="https://docs.google.com/presentation/" target="_blank" class="link-chip">Latest QBR</a>\
                <a href="https://drive.google.com/" target="_blank" class="link-chip">Resources</a>\
            </div>\
        </section>\
\
        <section style="margin-bottom: 40px;">\
            <h2 class="section-title">Key Performance Indicators</h2>\
            <div class="grid grid-3">\
                <div class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value" id="renewalCountdown">--</div>\
                            <div class="kpi-label">Days to Renewal</div>\
                            <div class="kpi-delta neutral">' + data.renewal + '</div>\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value">' + cssScoreCurrent + '</div>\
                            <div class="kpi-label">CSS Overall Score</div>\
                            <div class="kpi-delta ' + deltaClass + '">Δ ' + deltaText + ' vs previous</div>\
                        </div>\
                    </div>\
                </div>\
                \
                <div class="card">\
                    <div class="card-body">\
                        <div class="kpi-card">\
                            <div class="kpi-value" style="font-size: 2rem;">Premier</div>\
                            <div class="kpi-label">Support Plan</div>\
                            <div class="kpi-delta neutral">Active Success Plan</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </section>\
\
        <section style="margin-bottom: 40px;">\
            <div class="grid grid-3">\
                <div class="card">\
                    <div class="card-header">\
                        <h3 class="card-title">Account Information</h3>\
                    </div>\
                    <div class="card-body">\
                        <div style="display: grid; gap: 16px;">\
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">\
                                <span style="font-weight: 600; color: var(--text-secondary);">CSM</span>\
                                <span style="color: var(--text-primary); font-weight: 500;">' + data.accountInfo.csm + '</span>\
                            </div>\
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">\
                                <span style="font-weight: 600; color: var(--text-secondary);">Role</span>\
                                <span style="color: var(--text-primary); font-weight: 500;">' + data.accountInfo.role + '</span>\
                            </div>\
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">\
                                <span style="font-weight: 600; color: var(--text-secondary);">Organizations</span>\
                                <span style="color: var(--text-primary); font-weight: 500;">' + data.accountInfo.orgs + '</span>\
                            </div>\
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">\
                                <span style="font-weight: 600; color: var(--text-secondary);">Renewal Date</span>\
                                <span style="color: var(--text-primary); font-weight: 500;">' + data.accountInfo.renewalDate + '</span>\
                            </div>\
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">\
                                <span style="font-weight: 600; color: var(--text-secondary);">Time Allocation</span>\
                                <span style="color: var(--text-primary); font-weight: 500;">' + data.accountInfo.allocation + '</span>\
                            </div>\
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">\
                                <span style="font-weight: 600; color: var(--text-secondary);">Account Executive</span>\
                                <span style="color: var(--text-primary); font-weight: 500;">' + data.accountInfo.ae + '</span>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
\
                <div class="card">\
                    <div class="card-header">\
                        <h3 class="card-title">Current Focus Areas</h3>\
                    </div>\
                    <div class="card-body">\
                        ' + data.focusAreas.map(function(area, index) {
                            return '<div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 0;">\
                                        <div style="width: 20px; height: 20px; background: var(--gradient-primary); border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">' + (index + 1) + '</div>\
                                        <div>' + area + '</div>\
                                    </div>';
                        }).join('') + '\
                    </div>\
                </div>\
\
                <div class="card">\
                    <div class="card-header">\
                        <h3 class="card-title">Latest Cadence</h3>\
                    </div>\
                    <div class="card-body">\
                        <div style="margin-bottom: 16px;">\
                            <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 8px;">Last Meeting: ' + data.latestCadence.lastMeeting + '</div>\
                            <div style="font-weight: 600; margin-bottom: 12px;">Key Points:</div>\
                            <ul style="padding-left: 20px; margin-bottom: 16px;">' +
                                data.latestCadence.keyPoints.map(function(point) {
                                    return '<li style="margin-bottom: 4px;">' + point + '</li>';
                                }).join('') +
                            '</ul>\
                            <div style="padding: 12px; background: var(--gradient-subtle); border-radius: var(--radius-md); border-left: 4px solid var(--primary-blue);">\
                                <div style="font-weight: 600; font-size: 0.875rem;">' + data.latestCadence.status + '</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </section>\
\
        <section style="margin-bottom: 40px;">\
            <h2 class="section-title">Recent Activity Timeline</h2>\
            <div class="grid grid-3">' +
                data.timeline.map(function(item) {
                    return '<div class="card">\
                                <div class="card-body">\
                                    <div style="border-left: none; padding-left: 0;">\
                                        <div style="color: var(--primary-blue); font-weight: 600; font-size: 0.875rem; margin-bottom: 4px;">' + item.date + '</div>\
                                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">' + item.title + '</div>\
                                        <div style="color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5;">' + item.note + '</div>\
                                    </div>\
                                </div>\
                            </div>';
                }).join('') +
            '</div>\
        </section>\
\
        <section style="margin-bottom: 40px;">\
            <h2 class="section-title">Analytics & Trends</h2>\
            <div class="grid grid-2">\
                <div class="card">\
                    <div class="card-header">\
                        <h3 class="card-title">CSS Trend Analysis</h3>\
                    </div>\
                    <div class="card-body">\
                        <div class="chart-container">\
                            <canvas id="cssTrend"></canvas>\
                        </div>\
                    </div>\
                </div>\
\
                <div class="card">\
                    <div class="card-header">\
                        <h3 class="card-title">vCore Usage Distribution</h3>\
                    </div>\
                    <div class="card-body">\
                        <div class="chart-container">\
                            <canvas id="vcores"></canvas>\
                        </div>\
                    </div>\
                </div>\
\
                <div class="card">\
                    <div class="card-header">\
                        <h3 class="card-title">API Landscape Overview</h3>\
                    </div>\
                    <div class="card-body">\
                        <div class="chart-container">\
                            <canvas id="apiLandscape"></canvas>\
                        </div>\
                    </div>\
                </div>\
\
                <div class="card">\
                    <div class="card-header">\
                        <h3 class="card-title">Product Adoption Matrix</h3>\
                    </div>\
                    <div class="card-body">\
                        <div class="chart-container">\
                            <canvas id="productAdoption"></canvas>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </section>\
\
        <section class="ai-shortcuts">\
            <h3>AI-Powered Insights & Shortcuts</h3>\
            <p style="color: var(--text-secondary); margin-bottom: 24px;">Copy these prompts into your preferred AI assistant along with this dashboard and account resources for deeper analysis.</p>\
            \
            <div class="ai-prompt">\
                <strong>Portfolio Health Analysis</strong>\
                "Analyze the CSS trend, vCore usage patterns, and API adoption metrics for ' + accountName + '. Identify potential risks, growth opportunities, and provide 3 specific recommendations for the next quarter based on the data trends."\
            </div>\
            \
            <div class="ai-prompt">\
                <strong>Executive QBR Preparation</strong>\
                "Create a comprehensive 5-slide executive summary for ' + accountName + ' quarterly business review covering: current health status, key achievements, challenges, strategic opportunities, and recommended next steps with specific success metrics."\
            </div>\
            \
            <div class="ai-prompt">\
                <strong>Predictive Success Planning</strong>\
                "Based on ' + accountName + ' current trajectory, usage patterns, and engagement metrics, predict potential renewal risks and recommend a 90-day action plan to ensure continued success and identify expansion opportunities."\
            </div>\
        </section>\
    </div>\
\
    <script>\
        var CONFIG = ' + JSON.stringify(data) + ';\
\
        function daysUntil(dateStr) {\
            var target = new Date(dateStr);\
            var now = new Date();\
            var diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));\
            return Math.max(diff, 0);\
        }\
        document.getElementById("renewalCountdown").textContent = daysUntil(CONFIG.renewal);\
\
        var chartOptions = {\
            responsive: true,\
            maintainAspectRatio: false,\
            plugins: {\
                legend: {\
                    position: "bottom",\
                    labels: {\
                        padding: 20,\
                        usePointStyle: true,\
                        font: { size: 12, family: "Inter" }\
                    }\
                }\
            },\
            scales: {\
                y: { \
                    beginAtZero: true,\
                    grid: { color: "rgba(0,0,0,0.05)" },\
                    ticks: { font: { family: "Inter" } }\
                },\
                x: {\
                    grid: { color: "rgba(0,0,0,0.05)" },\
                    ticks: { font: { family: "Inter" } }\
                }\
            }\
        };\
\
        new Chart(document.getElementById("cssTrend").getContext("2d"), {\
            type: "line",\
            data: {\
                labels: CONFIG.css.labels,\
                datasets: [{\
                    label: "CSS Score",\
                    data: CONFIG.css.data,\
                    borderColor: "#0176d3",\
                    backgroundColor: "rgba(1,118,211,0.1)",\
                    fill: true,\
                    tension: 0.4,\
                    pointBackgroundColor: "#0176d3",\
                    pointBorderColor: "#ffffff",\
                    pointBorderWidth: 2,\
                    pointRadius: 6\
                }]\
            },\
            options: {\
                responsive: true,\
                maintainAspectRatio: false,\
                plugins: chartOptions.plugins,\
                scales: {\
                    y: { beginAtZero: true, min: 6, max: 9, grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { family: "Inter" } } },\
                    x: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { family: "Inter" } } }\
                }\
            }\
        });\
\
        new Chart(document.getElementById("vcores").getContext("2d"), {\
            type: "bar",\
            data: {\
                labels: ["CH 1.0 Prod", "CH 1.0 Pre-Prod", "CH 2.0 Prod", "CH 2.0 Pre-Prod"],\
                datasets: [{\
                    label: "vCores Used",\
                    data: CONFIG.vcores,\
                    backgroundColor: ["#0176d3", "#1589ee", "#4fb5f7", "#8b5fd6"],\
                    borderRadius: 8,\
                    borderSkipped: false\
                }]\
            },\
            options: chartOptions\
        });\
\
        new Chart(document.getElementById("apiLandscape").getContext("2d"), {\
            type: "doughnut",\
            data: {\
                labels: ["Production APIs", "Pre-Production APIs"],\
                datasets: [{\
                    data: CONFIG.api_counts,\
                    backgroundColor: ["#0176d3", "#8b5fd6"],\
                    borderWidth: 0,\
                    cutout: "60%"\
                }]\
            },\
            options: {\
                responsive: true,\
                maintainAspectRatio: false,\
                plugins: chartOptions.plugins\
            }\
        });\
\
        new Chart(document.getElementById("productAdoption").getContext("2d"), {\
            type: "radar",\
            data: {\
                labels: CONFIG.product_adoption.categories,\
                datasets: [{\
                    label: "Adoption Level",\
                    data: CONFIG.product_adoption.scores,\
                    backgroundColor: "rgba(1,118,211,0.2)",\
                    borderColor: "#0176d3",\
                    pointBackgroundColor: "#0176d3",\
                    pointBorderColor: "#ffffff",\
                    pointBorderWidth: 2,\
                    pointRadius: 6\
                }]\
            },\
            options: {\
                responsive: true,\
                maintainAspectRatio: false,\
                scales: {\
                    r: {\
                        angleLines: { display: true, color: "rgba(0,0,0,0.1)" },\
                        grid: { color: "rgba(0,0,0,0.1)" },\
                        pointLabels: { font: { family: "Inter", size: 11 } },\
                        suggestedMin: 0,\
                        suggestedMax: 100,\
                        ticks: { display: false }\
                    }\
                },\
                plugins: {\
                    legend: {\
                        position: "bottom",\
                        labels: { font: { family: "Inter" } }\
                    }\
                }\
            }\
        });\
    </script>\
</body>\
</html>';
}

// ==================== ENHANCED ACCOUNT-SPECIFIC DASHBOARDS ====================

function getEnhancedBirkenstockHTML() {
  try {
    var accounts = loadAccountsFromSheets();
    var accountData = accounts['Birkenstock'] || getDefaultAccountData('Birkenstock');
    
    return generateEnhancedDashboardHTML('Birkenstock', {
      renewal: accountData.renewalDate || '2026-03-15',
      css: {
        labels: ['Q4-24', 'Q1-25', 'Q2-25', 'Q3-25'],
        data: accountData.cssTrend ? accountData.cssTrend.data : [8.0, 7.9, 8.2, 8.1]
      },
      vcores: [accountData.vcoreProd || 10.2, accountData.vcorePreProd || 18.8, 0.0, 0.0],
      api_counts: [accountData.apiProd || 72, accountData.apiPreProd || 140],
      product_adoption: {
        categories: ['API Development', 'Monitoring', 'Security', 'Testing', 'Documentation'],
        scores: accountData.productAdoption ? 
          [accountData.productAdoption.apiDev, accountData.productAdoption.monitoring, accountData.productAdoption.security, accountData.productAdoption.testing, accountData.productAdoption.documentation] :
          [80, 75, 85, 70, 80]
      },
      timeline: [
        {date: '2025-09-03', title: 'Quarterly Review', note: 'Expansion opportunities validated; API ROI demo planned.'},
        {date: '2025-08-19', title: 'Sandbox Cleanup', note: 'Retired deprecated runtimes; reduced noise.'},
        {date: '2025-08-05', title: 'Stakeholder Map', note: 'Aligned AE, CSM, Architect on plan.'}
      ],
      accountInfo: {
        csm: 'Primary CSM',
        role: 'Lead CSM',
        orgs: accountData.orgCount || 2,
        renewalDate: '15-Mar-2026',
        allocation: (accountData.allocation || 30) + '%',
        ae: 'EMEA Central'
      },
      focusAreas: [
        'API ROI demonstration planning',
        'Sandbox environment optimization',
        'Expansion opportunity validation'
      ],
      latestCadence: {
        lastMeeting: 'Sep 3, 2025',
        keyPoints: [
          'API ROI demo planning in progress',
          'Sandbox cleanup completed',
          'Stakeholder alignment achieved'
        ],
        status: 'Growth Focus: Positive CSS trend and expansion opportunities'
      }
    });
  } catch (error) {
    Logger.log('Error generating Birkenstock dashboard: ' + error.toString());
    return createEnhancedErrorPage('Dashboard Error', 'Failed to load Birkenstock dashboard');
  }
}

function getEnhancedCSLSeqirusHTML() {
  try {
    var accounts = loadAccountsFromSheets();
    var accountData = accounts['CSL Seqirus'] || getDefaultAccountData('CSL Seqirus');
    
    return generateEnhancedDashboardHTML('CSL Seqirus', {
      renewal: accountData.renewalDate || '2026-09-01',
      css: {
        labels: ['Q4-24', 'Q1-25', 'Q2-25', 'Q3-25'],
        data: accountData.cssTrend ? accountData.cssTrend.data : [7.6, 7.7, 7.5, 7.6]
      },
      vcores: [accountData.vcoreProd || 14.0, accountData.vcorePreProd || 20.0, 0.0, 0.0],
      api_counts: [accountData.apiProd || 61, accountData.apiPreProd || 122],
      product_adoption: {
        categories: ['API Development', 'Monitoring', 'Security', 'Testing', 'Documentation'],
        scores: accountData.productAdoption ? 
          [accountData.productAdoption.apiDev, accountData.productAdoption.monitoring, accountData.productAdoption.security, accountData.productAdoption.testing, accountData.productAdoption.documentation] :
          [75, 80, 85, 60, 70]
      },
      timeline: [
        {date: '2025-09-02', title: 'Implementation Checkpoint', note: 'Adoption plateau discussed; pilot on AI+MuleSoft proposed.'},
        {date: '2025-08-21', title: 'Risk Review', note: 'No critical risks; monitor support tickets.'},
        {date: '2025-08-07', title: 'Training Session', note: 'Onboarded new team members to governance.'}
      ],
      accountInfo: {
        csm: 'Primary CSM',
        role: 'Lead CSM',
        orgs: accountData.orgCount || 2,
        renewalDate: '1-Sep-2026',
        allocation: (accountData.allocation || 25) + '%',
        ae: 'APAC'
      },
      focusAreas: [
        'API integration optimization',
        'Monitoring adoption metrics',
        'Performance optimization'
      ],
      latestCadence: {
        lastMeeting: 'Sep 8, 2025',
        keyPoints: [
          'API integration review completed',
          'Adoption metrics stable',
          'Performance improvements planned'
        ],
        status: 'Stable: Consistent CSS score with monitoring focus'
      }
    });
  } catch (error) {
    Logger.log('Error generating CSL Seqirus dashboard: ' + error.toString());
    return createEnhancedErrorPage('Dashboard Error', 'Failed to load CSL Seqirus dashboard');
  }
}

function getEnhancedGardHTML() {
  try {
    var accounts = loadAccountsFromSheets();
    var accountData = accounts['Gard'] || getDefaultAccountData('Gard');
    
    return generateEnhancedDashboardHTML('Gard', {
      renewal: accountData.renewalDate || '2026-12-19',
      css: {
        labels: ['Q4-24', 'Q1-25', 'Q2-25', 'Q3-25'],
        data: accountData.cssTrend ? accountData.cssTrend.data : [8.3, 8.1, 8.0, 7.8]
      },
      vcores: [accountData.vcoreProd || 19.9, accountData.vcorePreProd || 50.6, 0.0, 0.0],
      api_counts: [accountData.apiProd || 79, accountData.apiPreProd || 279],
      product_adoption: {
        categories: ['API Development', 'Monitoring', 'Security', 'Testing', 'Documentation'],
        scores: accountData.productAdoption ? 
          [accountData.productAdoption.apiDev, accountData.productAdoption.monitoring, accountData.productAdoption.security, accountData.productAdoption.testing, accountData.productAdoption.documentation] :
          [85, 70, 90, 65, 75]
      },
      timeline: [
        {date: '2025-09-01', title: 'Platform Utilization Analysis', note: 'Identified decline and action areas.'},
        {date: '2025-08-23', title: 'Reuse Analysis', note: '279 pre-prod APIs and 79 prod APIs; reuse map shared.'},
        {date: '2025-08-13', title: 'Exec Check-in', note: 'Spoke with leadership to align on adoption.'}
      ],
      accountInfo: {
        csm: 'Karim Riffi Tonning',
        role: 'Backup CSM',
        orgs: accountData.orgCount || 1,
        renewalDate: '19-Dec-2026',
        allocation: (accountData.allocation || 20) + '%',
        ae: 'EMEA North'
      },
      focusAreas: [
        'Declining utilization recovery',
        'Whitespaces document preparation',
        'RAW workshop coordination'
      ],
      latestCadence: {
        lastMeeting: 'Sep 5, 2025',
        keyPoints: [
          'API analysis and adoption workshop planned',
          'Need structured plan for past engagements',
          'Follow-up on API analyzer results pending'
        ],
        status: 'Risk Alert: Declining platform usage requires immediate attention'
      }
    });
  } catch (error) {
    Logger.log('Error generating Gard dashboard: ' + error.toString());
    return createEnhancedErrorPage('Dashboard Error', 'Failed to load Gard dashboard');
  }
}

function getEnhancedWatesHTML() {
  try {
    var accounts = loadAccountsFromSheets();
    var accountData = accounts['Wates'] || getDefaultAccountData('Wates');
    
    return generateEnhancedDashboardHTML('Wates', {
      renewal: accountData.renewalDate || '2025-11-15',
      css: {
        labels: ['Q4-24', 'Q1-25', 'Q2-25', 'Q3-25'],
        data: accountData.cssTrend ? accountData.cssTrend.data : [7.8, 7.6, 7.4, 7.5]
      },
      vcores: [accountData.vcoreProd || 12.0, accountData.vcorePreProd || 22.5, 0.0, 0.0],
      api_counts: [accountData.apiProd || 45, accountData.apiPreProd || 89],
      product_adoption: {
        categories: ['API Development', 'Monitoring', 'Security', 'Testing', 'Documentation'],
        scores: accountData.productAdoption ? 
          [accountData.productAdoption.apiDev, accountData.productAdoption.monitoring, accountData.productAdoption.security, accountData.productAdoption.testing, accountData.productAdoption.documentation] :
          [65, 60, 75, 55, 65]
      },
      timeline: [
        {date: '2025-09-04', title: 'Renewal Planning', note: 'Strategy alignment for renewal discussions.'},
        {date: '2025-08-20', title: 'Performance Review', note: 'Identified areas for improvement.'},
        {date: '2025-08-01', title: 'Technical Assessment', note: 'Platform usage analysis completed.'}
      ],
      accountInfo: {
        csm: 'Primary CSM',
        role: 'Lead CSM',
        orgs: accountData.orgCount || 3,
        renewalDate: '15-Nov-2025',
        allocation: (accountData.allocation || 35) + '%',
        ae: 'EMEA Central'
      },
      focusAreas: [
        'Platform adoption improvement',
        'Renewal strategy alignment',
        'Technical optimization'
      ],
      latestCadence: {
        lastMeeting: 'Sep 4, 2025',
        keyPoints: [
          'Renewal planning initiated',
          'Performance metrics reviewed',
          'Strategic alignment confirmed'
        ],
        status: 'Focus: Renewal preparation and platform optimization'
      }
    });
  } catch (error) {
    Logger.log('Error generating Wates dashboard: ' + error.toString());
    return createEnhancedErrorPage('Dashboard Error', 'Failed to load Wates dashboard');
  }
}

// ==================== API ENDPOINTS ====================

function handleApiRequest(apiType) {
  try {
    switch(apiType.toLowerCase()) {
      case 'accounts':
        return getAccountsApi();
      case 'tasks':
        return getTasksApi();
      case 'save':
        return getSaveApi();
      case 'metrics':
        return getMetricsApi();
      case 'timeline':
        return getTimelineApi();
      case 'health':
        return getHealthApi();
      case 'update':
        return getUpdateApi();
      case 'updatee':
        return getUpdateApi();
      default:
        throw new Error('Unknown API endpoint: ' + apiType);
    }
  } catch (error) {
    Logger.log('API Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getAccountsApi() {
  try {
    var config = getConfig();
    var sheet = SpreadsheetApp.openById(config.ACCOUNTS_SHEET_ID).getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var accounts = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0]) {
        accounts.push({
          account: row[0] || '',
          renewalDate: row[1] || '',
          cssScore: parseFloat(row[2]) || 0,
          cssPrevious: parseFloat(row[3]) || 0,
          supportPlan: row[4] || '',
          owner: row[5] || '',
          allocation: parseInt(row[6]) || 0,
          region: row[7] || '',
          orgCount: parseInt(row[8]) || 0,
          vcoreProd: parseFloat(row[9]) || 0,
          vcorePreProd: parseFloat(row[10]) || 0,
          apiProd: parseInt(row[11]) || 0,
          apiPreProd: parseInt(row[12]) || 0,
          focusAreas: row[13] || '',
          riskLevel: row[14] || 'medium'
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(accounts)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in getAccountsApi: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Failed to load accounts data',
      details: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getTasksApi() {
  try {
    var config = getConfig();
    var sheet = SpreadsheetApp.openById(config.TASKS_SHEET_ID).getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var tasks = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0]) {
        tasks.push({
          id: row[0] || '',
          title: row[1] || '',
          account: row[2] || '',
          dueDate: formatDate(row[3]),
          priority: row[4] || 'Medium',
          assignee: row[5] || '',
          status: row[6] || 'open',
          type: row[7] || 'manual',
          completed: row[9] === true || row[9] === 'TRUE' || row[9] === 'true',
          createdDate: formatDate(row[10])
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(tasks)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in getTasksApi: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Failed to load tasks data',
      details: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getMetricsApi() {
  try {
    var config = getConfig();
    var sheet = SpreadsheetApp.openById(config.METRICS_SHEET_ID).getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var metrics = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0]) {
        metrics.push({
          date: formatDate(row[0]),
          account: row[1] || '',
          apiCalls: parseInt(row[2]) || 0,
          responseTime: parseFloat(row[3]) || 0,
          errorRate: parseFloat(row[4]) || 0,
          activeUsers: parseInt(row[5]) || 0,
          satisfactionScore: parseFloat(row[8]) || 0
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(metrics)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in getMetricsApi: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Failed to load metrics data',
      details: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getTimelineApi() {
  try {
    var config = getConfig();
    var sheet = SpreadsheetApp.openById(config.TIMELINE_SHEET_ID).getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var timeline = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0]) {
        timeline.push({
          date: formatDate(row[0]),
          account: row[1] || '',
          eventType: row[2] || '',
          description: row[3] || '',
          status: row[4] || '',
          impactLevel: row[5] || 'Medium'
        });
      }
    }
    
    timeline.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    
    return ContentService.createTextOutput(JSON.stringify(timeline)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in getTimelineApi: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Failed to load timeline data',
      details: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ================ SAVE/UPSERT ENDPOINTS + CALENDAR (NEW) ================

function getSaveApi() {
  return ContentService.createTextOutput(JSON.stringify({
    ok: false,
    message: 'Use POST with ?api=save and JSON body {accounts:[...], tasks:[...]}'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var api = (e.parameter && (e.parameter.api || e.parameter.path)) || '';
    var body = {};
    if (e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch(err) { body = {}; }
    }
    if (String(api).toLowerCase() === 'save') {
      var res = {};
      if (Array.isArray(body.accounts)) res.accounts = upsertAccounts(body.accounts);
      if (Array.isArray(body.tasks))    res.tasks    = upsertTasks(body.tasks);
      return ContentService.createTextOutput(JSON.stringify({ ok:true, result: res, at: new Date().toISOString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (String(api).toLowerCase() === 'addtask') {
      var t = body.task || body;
      var ok = appendSingleTask(t);
      return ContentService.createTextOutput(JSON.stringify({ ok: !!ok })).setMimeType(ContentService.MimeType.JSON);
    }
    if (String(api).toLowerCase() === 'updateaccount') {
      var a = body.account || body;
      var stats = upsertAccounts([a]);
      return ContentService.createTextOutput(JSON.stringify({ ok:true, result: stats })).setMimeType(ContentService.MimeType.JSON);
    }
    if (String(api).toLowerCase() === 'addmeeting' || String(api).toLowerCase() === 'meeting') {
      var out = addMeetingFromApi(body);
      return ContentService.createTextOutput(JSON.stringify({ ok:true, result: out })).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok:false, error:'Unknown POST api' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok:false, error:String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function upsertAccounts(list) {
  var cfg = getConfig();
  var sh = SpreadsheetApp.openById(cfg.ACCOUNTS_SHEET_ID).getActiveSheet();
  var rng = sh.getDataRange();
  var values = rng.getValues();
  if (values.length === 0) return { inserted:0, updated:0 };
  var headers = values[0];
  var nameIdx    = headers.indexOf('Account Name');
  var renewIdx   = headers.indexOf('Renewal Date');
  var cssIdx     = headers.indexOf('CSS Score');
  var envsIdx    = headers.indexOf('Org Count');
  var vprodIdx   = headers.indexOf('vCore Prod');
  var vpreIdx    = headers.indexOf('vCore Pre-Prod');
  var riskIdx    = headers.indexOf('Risk Level');
  if (nameIdx < 0) nameIdx = 0;
  var map = {};
  for (var r=1;r<values.length;r++) { var nm = String(values[r][nameIdx]||'').trim(); if (nm) map[nm]=r; }
  var inserted=0, updated=0;
  list.forEach(function(a){
    var name = a.account || a.name || a['Account Name']; if (!name) return;
    var r = (name in map)? map[name] : -1;
    if (r<0) { var row = new Array(headers.length).fill(''); row[nameIdx]=name; values.push(row); r = values.length-1; inserted++; }
    else { updated++; }
    if (renewIdx>=0 && (a.renewal||a.renewalDate)) values[r][renewIdx] = new Date(a.renewal||a.renewalDate);
    if (cssIdx>=0 && a.css!=null) values[r][cssIdx] = Number(a.css);
    if (envsIdx>=0 && a.envs!=null) values[r][envsIdx] = Number(a.envs);
    if (vprodIdx>=0 && a.vcoresProd!=null) values[r][vprodIdx] = Number(a.vcoresProd);
    if (vpreIdx>=0 && a.vcoresPre!=null) values[r][vpreIdx] = Number(a.vcoresPre);
    if (riskIdx>=0 && a.risk!=null) values[r][riskIdx] = String(a.risk).toLowerCase();
  });
  sh.clearContents();
  sh.getRange(1,1,values.length, headers.length).setValues(values);
  return { inserted: inserted, updated: updated };
}

function upsertTasks(list) {
  var cfg = getConfig();
  var sh = SpreadsheetApp.openById(cfg.TASKS_SHEET_ID).getActiveSheet();
  var values = sh.getDataRange().getValues();
  if (!values.length) return { inserted:0, updated:0 };
  var headers = values[0];
  var idIdx   = headers.indexOf('Task ID');
  var titleIdx= headers.indexOf('Title');
  var acctIdx = headers.indexOf('Account');
  var dueIdx  = headers.indexOf('Due Date');
  var priIdx  = headers.indexOf('Priority');
  var asgIdx  = headers.indexOf('Assignee');
  var stIdx   = headers.indexOf('Status');
  var doneIdx = headers.indexOf('Completed');
  var createdIdx = headers.indexOf('Created Date');
  var descIdx = headers.indexOf('Description');
  var map = {};
  for (var r=1;r<values.length;r++) { var id = String(values[r][idIdx]||'').trim(); if (id) map[id]=r; }
  var inserted=0, updated=0;
  list.forEach(function(t){
    var id = t.id || t.TaskID || '';
    var r = id && (id in map) ? map[id] : -1;
    if (r<0) { id = id || ('task_' + Utilities.getUuid().slice(0,8)); var row = new Array(headers.length).fill(''); if (idIdx>=0) row[idIdx]=id; values.push(row); r=values.length-1; inserted++; }
    else { updated++; }
    if (titleIdx>=0) values[r][titleIdx] = t.title||'';
    if (acctIdx>=0)  values[r][acctIdx]  = t.account||t.accountId||'';
    if (dueIdx>=0)   values[r][dueIdx]   = t.dueDate? new Date(t.dueDate):'';
    if (priIdx>=0)   values[r][priIdx]   = t.priority||'';
    if (asgIdx>=0)   values[r][asgIdx]   = t.assignee||'';
    if (stIdx>=0)    values[r][stIdx]    = t.status||'open';
    if (doneIdx>=0)  values[r][doneIdx]  = !!(t.done||t.completed);
    if (createdIdx>=0 && !values[r][createdIdx]) values[r][createdIdx] = new Date();
    if (descIdx>=0)  values[r][descIdx]  = t.notes||t.description||'';
    try { if (t.dueDate) createCalendarEventForTask(values[r][titleIdx]||'', values[r][acctIdx]||'', values[r][dueIdx]); } catch(e) {}
  });
  sh.clearContents();
  sh.getRange(1,1,values.length, headers.length).setValues(values);
  return { inserted: inserted, updated: updated };
}

function appendSingleTask(t){
  return upsertTasks([t]).inserted>0 || upsertTasks([t]).updated>0;
}

function createCalendarEventForTask(title, account, dueDate){
  try {
    var cfg = getConfig();
    var cal = cfg.CALENDAR_ID ? CalendarApp.getCalendarById(cfg.CALENDAR_ID) : CalendarApp.getDefaultCalendar();
    if (!(dueDate instanceof Date)) dueDate = new Date(dueDate);
    var start = new Date(dueDate); start.setHours(10,0,0,0);
    var end = new Date(start); end.setMinutes(start.getMinutes()+30);
    cal.createEvent('Task: ' + title + (account? (' — ' + account):''), start, end);
  } catch (e) { Logger.log('Calendar error: ' + e); }
}

function getHealthApi() {
  try {
    var config = getConfig();
    var health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      sheets: {
        accounts: testSheetAccess(config.ACCOUNTS_SHEET_ID),
        tasks: testSheetAccess(config.TASKS_SHEET_ID),
        metrics: testSheetAccess(config.METRICS_SHEET_ID),
        timeline: testSheetAccess(config.TIMELINE_SHEET_ID)
      },
      folders: {
        dashboards: testFolderAccess(config.DASHBOARD_FOLDER_ID),
        qbr: testFolderAccess(config.QBR_SLIDES_FOLDER_ID),
        resources: testFolderAccess(config.RESOURCES_FOLDER_ID)
      },
      user: Session.getActiveUser().getEmail(),
      version: '3.0.0-enhanced'
    };
    
    return ContentService.createTextOutput(JSON.stringify(health)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in getHealthApi: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== HELPER FUNCTIONS ====================

function formatDate(dateValue) {
  if (!dateValue) return '';
  try {
    if (dateValue instanceof Date) {
      return dateValue.toISOString().slice(0, 10);
    }
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toISOString().slice(0, 10);
    }
    return String(dateValue).slice(0, 10);
  } catch (e) {
    return '';
  }
}

function testSheetAccess(sheetId) {
  try {
    if (!sheetId) return 'not configured';
    SpreadsheetApp.openById(sheetId);
    return 'accessible';
  } catch (e) {
    return 'error: ' + e.message;
  }
}

function testFolderAccess(folderId) {
  try {
    if (!folderId) return 'not configured';
    DriveApp.getFolderById(folderId);
    return 'accessible';
  } catch (e) {
    return 'error: ' + e.message;
  }
}

function createEnhancedErrorPage(title, message) {
  var serviceUrl = ScriptApp.getService().getUrl() || '#';
  return HtmlService.createHtmlOutput('\
    <!DOCTYPE html>\
    <html>\
    <head>\
      <title>Error - ' + title + '</title>\
      <style>' + getEnhancedStyles() + '</style>\
    </head>\
    <body style="background: var(--gradient-subtle); min-height: 100vh; display: flex; align-items: center; justify-content: center;">\
      <div class="card" style="max-width: 500px; text-align: center; margin: 20px;">\
        <div class="card-body" style="padding: 40px;">\
          <div style="font-size: 4rem; margin-bottom: 24px;">⚠️</div>\
          <h1 style="color: var(--text-primary); margin-bottom: 16px; font-size: 1.5rem;">' + title + '</h1>\
          <p style="color: var(--text-secondary); margin-bottom: 32px; line-height: 1.6;">' + message + '</p>\
          <a href="' + serviceUrl + '" class="btn btn-primary">Back to Portal</a>\
        </div>\
      </div>\
    </body>\
    </html>\
  ').setTitle('Error - ' + title);
}

// ==================== CONFIGURATION AND SETUP ====================

function getConfig() {
  var props = PropertiesService.getScriptProperties();
  var storedConfig = props.getProperties();
  
  return {
    ACCOUNTS_SHEET_ID: storedConfig.ACCOUNTS_SHEET_ID || CONFIG.ACCOUNTS_SHEET_ID,
    TASKS_SHEET_ID: storedConfig.TASKS_SHEET_ID || CONFIG.TASKS_SHEET_ID,
    METRICS_SHEET_ID: storedConfig.METRICS_SHEET_ID || CONFIG.METRICS_SHEET_ID,
    TIMELINE_SHEET_ID: storedConfig.TIMELINE_SHEET_ID || CONFIG.TIMELINE_SHEET_ID,
    DASHBOARD_FOLDER_ID: storedConfig.DASHBOARD_FOLDER_ID || CONFIG.DASHBOARD_FOLDER_ID,
    QBR_SLIDES_FOLDER_ID: storedConfig.QBR_SLIDES_FOLDER_ID || CONFIG.QBR_SLIDES_FOLDER_ID,
    RESOURCES_FOLDER_ID: storedConfig.RESOURCES_FOLDER_ID || CONFIG.RESOURCES_FOLDER_ID,
    MEETING_SUMMARIES_SHEET_ID: storedConfig.MEETING_SUMMARIES_SHEET_ID || CONFIG.MEETING_SUMMARIES_SHEET_ID,
    CALENDAR_ID: storedConfig.CALENDAR_ID || CONFIG.CALENDAR_ID,
    NOTIFICATION_EMAIL: storedConfig.NOTIFICATION_EMAIL || CONFIG.NOTIFICATION_EMAIL,
    SLACK_WEBHOOK_URL: CONFIG.SLACK_WEBHOOK_URL
  };
}

function loadAccountsFromSheets() {
  var config = getConfig();
  try {
    if (!config || !config.ACCOUNTS_SHEET_ID) {
      Logger.log('No accounts sheet configured, using default data');
      return {};
    }
    var sheet = SpreadsheetApp.openById(config.ACCOUNTS_SHEET_ID).getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var accounts = {};
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0]) {
        accounts[row[0]] = {
          name: row[0],
          renewalDate: row[1],
          cssScore: parseFloat(row[2]) || 7.5,
          cssPrevious: parseFloat(row[3]) || parseFloat(row[2]) || 7.5,
          supportPlan: row[4] || 'Premier',
          owner: row[5] || 'Owner',
          allocation: parseInt(row[6]) || 25,
          region: row[7] || 'Region',
          orgCount: parseInt(row[8]) || 1,
          vcoreProd: parseFloat(row[9]) || 0,
          vcorePreProd: parseFloat(row[10]) || 0,
          apiProd: parseInt(row[11]) || 0,
          apiPreProd: parseInt(row[12]) || 0,
          focusAreas: row[13] ? row[13].split(',').map(function(s) { return s.trim(); }) : ['General'],
          riskLevel: row[14] || 'medium',
          cssTrend: {
            labels: ['Q4-24', 'Q1-25', 'Q2-25', 'Q3-25'],
            data: [
              parseFloat(row[15]) || 7.5,
              parseFloat(row[16]) || 7.5,
              parseFloat(row[17]) || 7.5,
              parseFloat(row[18]) || 7.5
            ]
          },
          productAdoption: {
            apiDev: parseInt(row[19]) || 70,
            monitoring: parseInt(row[20]) || 70,
            security: parseInt(row[21]) || 80,
            testing: parseInt(row[22]) || 60,
            documentation: parseInt(row[23]) || 70
          },
          lastUpdate: new Date()
        };
      }
    }
    return accounts;
  } catch (e) {
    Logger.log('Error loading accounts: ' + e.toString());
    return {};
  }
}

function getDefaultAccountData(accountName) {
  var defaults = {
    'Birkenstock': {
      renewalDate: '2026-03-15',
      cssScore: 8.1,
      vcoreProd: 10.2,
      vcorePreProd: 18.8,
      apiProd: 72,
      apiPreProd: 140,
      orgCount: 2,
      allocation: 30
    },
    'CSL Seqirus': {
      renewalDate: '2026-09-01',
      cssScore: 7.6,
      vcoreProd: 14.0,
      vcorePreProd: 20.0,
      apiProd: 61,
      apiPreProd: 122,
      orgCount: 2,
      allocation: 25
    },
    'Gard': {
      renewalDate: '2026-12-19',
      cssScore: 7.8,
      vcoreProd: 19.9,
      vcorePreProd: 50.6,
      apiProd: 79,
      apiPreProd: 279,
      orgCount: 1,
      allocation: 20
    },
    'Wates': {
      renewalDate: '2025-11-15',
      cssScore: 7.5,
      vcoreProd: 12.0,
      vcorePreProd: 22.5,
      apiProd: 45,
      apiPreProd: 89,
      orgCount: 3,
      allocation: 35
    }
  };
  
  return defaults[accountName] || {
    renewalDate: '2026-01-01',
    cssScore: 7.5,
    vcoreProd: 10.0,
    vcorePreProd: 20.0,
    apiProd: 50,
    apiPreProd: 100,
    orgCount: 1,
    allocation: 25
  };
}

// ==================== SETUP FUNCTIONS ====================

function setupAndFix() {
  console.log('=== ENHANCED CSM DASHBOARD SETUP ===');
  try {
    console.log('Step 1: Testing permissions...');
    if (!testBasicPermissions()) return;
    
    console.log('Step 2: Setting up sheets...');
    var sheetIds = setupSheets();
    
    console.log('Step 3: Setting up folders...');
    var folderIds = setupFolders();
    
    console.log('Step 4: Updating configuration...');
    updateConfig(sheetIds, folderIds);
    
    console.log('Step 5: Adding sample data...');
    createMockAccounts();
    
    console.log('Step 6: Testing system...');
    if (testSystem()) {
      console.log('ENHANCED SETUP COMPLETED SUCCESSFULLY!');
      console.log('Features: Agentforce design, enhanced analytics, AI shortcuts');
      console.log('Responsive design with interactive elements');
      console.log('\nNext Steps:');
      console.log('1. Deploy as Web app');
      console.log('2. Execute as: Me, Access: Anyone with the link');
      console.log('3. Run getUrls() for dashboard links');
    }
  } catch (error) {
    console.log('Setup failed:', error.message);
    console.log('Try running this function again');
  }
}

function testBasicPermissions() {
  try {
    DriveApp.getRootFolder();
    console.log('Drive access granted');
    var testSheet = SpreadsheetApp.create('CSM_Test_Sheet');
    DriveApp.getFileById(testSheet.getId()).setTrashed(true);
    console.log('Sheets access granted');
    var userEmail = Session.getActiveUser().getEmail();
    console.log('Gmail access granted:', userEmail);
    return true;
  } catch (error) {
    console.log('Permission error:', error.message);
    console.log('SOLUTION: Run again and allow permissions when prompted.');
    return false;
  }
}

function setupSheets() {
  var sheetIds = {};
  try {
    sheetIds.accounts = (CONFIG.ACCOUNTS_SHEET_ID && tryOpen(CONFIG.ACCOUNTS_SHEET_ID)) || createAccountsSheet();
    sheetIds.tasks = (CONFIG.TASKS_SHEET_ID && tryOpen(CONFIG.TASKS_SHEET_ID)) || createTasksSheet();
    sheetIds.metrics = createMetricsSheet();
    sheetIds.timeline = createTimelineSheet();
    return sheetIds;
  } catch (error) {
    console.log('Error setting up sheets:', error.message);
    throw error;
  }
}

function tryOpen(sheetId) {
  try {
    SpreadsheetApp.openById(sheetId);
    console.log('Using existing sheet ' + sheetId);
    return sheetId;
  } catch (e) {
    return null;
  }
}

function createAccountsSheet() {
  var ss = SpreadsheetApp.create('CSM Dashboard - Accounts');
  var sheet = ss.getActiveSheet();
  sheet.setName('Accounts');
  var headers = [
    'Account Name', 'Renewal Date', 'CSS Score', 'CSS Previous', 'Support Plan',
    'Owner', 'Allocation %', 'Region', 'Org Count', 'vCore Prod', 'vCore Pre-Prod',
    'API Prod', 'API Pre-Prod', 'Focus Areas', 'Risk Level', 'Q4-24 CSS', 'Q1-25 CSS',
    'Q2-25 CSS', 'Q3-25 CSS', 'API Dev Score', 'Monitoring Score', 'Security Score',
    'Testing Score', 'Documentation Score'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285F4').setFontColor('white');
  sheet.setFrozenRows(1);
  console.log('Accounts sheet created:', ss.getId());
  return ss.getId();
}

function createTasksSheet() {
  var ss = SpreadsheetApp.create('CSM Dashboard - Tasks');
  var sheet = ss.getActiveSheet();
  sheet.setName('Tasks');
  var headers = [
    'Task ID', 'Title', 'Account', 'Due Date', 'Priority', 'Assignee', 'Status',
    'Type', 'Trigger', 'Completed', 'Created Date', 'Completed Date', 'Description',
    'Tags', 'Source', 'Created By'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#34A853').setFontColor('white');
  sheet.setFrozenRows(1);
  console.log('Tasks sheet created:', ss.getId());
  return ss.getId();
}

function createMetricsSheet() {
  var ss = SpreadsheetApp.create('CSM Dashboard - Metrics');
  var sheet = ss.getActiveSheet();
  sheet.setName('Metrics');
  
  var headers = [
    'Date', 'Account', 'API Calls', 'Response Time', 'Error Rate', 
    'Active Users', 'Feature Usage', 'Support Tickets', 'Satisfaction Score'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285F4').setFontColor('white');
  
  createMockMetrics(sheet);
  
  console.log('Metrics sheet created:', ss.getId());
  return ss.getId();
}

function createMockMetrics(sheet) {
  var accounts = ['Birkenstock', 'CSL Seqirus', 'Gard', 'Wates'];
  var mockData = [];
  var today = new Date();
  
  for (var i = 0; i < 30; i++) {
    var date = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
    
    for (var j = 0; j < accounts.length; j++) {
      mockData.push([
        date,
        accounts[j],
        Math.floor(10000 + Math.random() * 90000),
        Math.round((50 + Math.random() * 200) * 10) / 10,
        Math.round((0.1 + Math.random() * 1.9) * 100) / 100,
        Math.floor(50 + Math.random() * 150),
        Math.floor(60 + Math.random() * 40),
        Math.floor(1 + Math.random() * 10),
        Math.round((7 + Math.random() * 2) * 10) / 10
      ]);
    }
  }
  
  sheet.getRange(2, 1, mockData.length, mockData[0].length).setValues(mockData);
  console.log('Added mock metrics for', accounts.length, 'accounts over 30 days');
}

function createTimelineSheet() {
  var ss = SpreadsheetApp.create('CSM Dashboard - Timeline');
  var sheet = ss.getActiveSheet();
  sheet.setName('Timeline');
  
  var headers = [
    'Date', 'Account', 'Event Type', 'Description', 'Status', 
    'Impact Level', 'Related Area', 'Follow-up Required', 'Owner'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285F4').setFontColor('white');
  
  createMockTimeline(sheet);
  
  console.log('Timeline sheet created:', ss.getId());
  return ss.getId();
}

function createMeetingSummariesSheet() {
  var ss = SpreadsheetApp.create('CSM Dashboard - Meeting Summaries');
  var acc = ss.getActiveSheet();
  acc.setName('Account_Meetings');
  var accHeaders = ['Date','Account Name','Attendees','Summary','Decisions','Action Items','Owner','Due Date','Status','Resource Link'];
  acc.getRange(1,1,1,accHeaders.length).setValues([accHeaders]);
  acc.setFrozenRows(1);
  var team = ss.insertSheet('Team_Meetings');
  var teamHeaders = ['Date','Team','Attendees','Summary','Decisions','Action Items','Owner','Due Date','Status','Resource Link'];
  team.getRange(1,1,1,teamHeaders.length).setValues([teamHeaders]);
  team.setFrozenRows(1);
  return ss.getId();
}

function addAccountMeetingSummary(row){
  var cfg = getConfig();
  if (!cfg.MEETING_SUMMARIES_SHEET_ID) cfg.MEETING_SUMMARIES_SHEET_ID = createMeetingSummariesSheet();
  var ss = SpreadsheetApp.openById(cfg.MEETING_SUMMARIES_SHEET_ID);
  var sh = ss.getSheetByName('Account_Meetings') || ss.getActiveSheet();
  sh.appendRow([
    new Date(), row.account||'', row.attendees||'', row.summary||'', row.decisions||'', row.actions||'', row.owner||'', row.dueDate? new Date(row.dueDate):'', row.status||'open', row.link||''
  ]);
}

function addTeamMeetingSummary(row){
  var cfg = getConfig();
  if (!cfg.MEETING_SUMMARIES_SHEET_ID) cfg.MEETING_SUMMARIES_SHEET_ID = createMeetingSummariesSheet();
  var ss = SpreadsheetApp.openById(cfg.MEETING_SUMMARIES_SHEET_ID);
  var sh = ss.getSheetByName('Team_Meetings') || ss.getActiveSheet();
  sh.appendRow([
    new Date(), row.team||'', row.attendees||'', row.summary||'', row.decisions||'', row.actions||'', row.owner||'', row.dueDate? new Date(row.dueDate):'', row.status||'open', row.link||''
  ]);
}

function createMockTimeline(sheet) {
  var accounts = ['Birkenstock', 'CSL Seqirus', 'Gard', 'Wates'];
  var eventTypes = ['Meeting', 'Milestone', 'Review', 'Training', 'Technical Support', 'Success Plan Update'];
  var areas = ['Platform Usage', 'Security', 'Performance', 'Integration', 'Training', 'Strategy'];
  var mockData = [];
  var today = new Date();
  
  for (var i = 0; i < accounts.length; i++) {
    for (var j = 0; j < 5; j++) {
      var pastDate = new Date(today.getTime() - ((30 - j * 5) * 24 * 60 * 60 * 1000));
      mockData.push(createTimelineEvent(accounts[i], pastDate, eventTypes, areas));
    }
  }
  
  sheet.getRange(2, 1, mockData.length, mockData[0].length).setValues(mockData);
  console.log('Added mock timeline events for', accounts.length, 'accounts');
}

// ============== RESOURCES LIVE UPDATE (scan + index + light updates) ==============

function runDailyIngestionTask(){
  try { scanResourcesAndUpdate(); } catch(e){ Logger.log('Resources scan failed: '+e); }
  try { runFullDashboardAutomation && runFullDashboardAutomation(); } catch(e){ Logger.log('Automation failed: '+e); }
}

function scanResourcesAndUpdate(){
  var cfg = getConfig();
  if (!cfg.RESOURCES_FOLDER_ID) return;
  var folder = DriveApp.getFolderById(cfg.RESOURCES_FOLDER_ID);
  var files = folder.getFiles();
  var index = [];
  while (files.hasNext()){
    var f = files.next();
    index.push({ name:f.getName(), url:f.getUrl(), type:f.getMimeType(), updated:f.getLastUpdated() });
  }
  // Store index into Meeting Summaries file (Resources Index sheet)
  var ssId = cfg.MEETING_SUMMARIES_SHEET_ID || createMeetingSummariesSheet();
  var ss = SpreadsheetApp.openById(ssId);
  var sh = ss.getSheetByName('Resources_Index') || ss.insertSheet('Resources_Index');
  sh.clear();
  var headers = ['Name','Type','URL','Last Updated'];
  sh.getRange(1,1,1,headers.length).setValues([headers]);
  if (index.length){
    sh.getRange(2,1,index.length,headers.length).setValues(index.map(function(it){ return [it.name, it.type, it.url, it.updated]; }));
  }
  // Light heuristic updates: if file name contains account + 'CSS', try to read first sheet A2 as latest CSS
  var accounts = loadAccountsFromSheets();
  Object.keys(accounts).forEach(function(name){
    var cssFile = index.find(function(it){ return it.name.toLowerCase().includes('css') && it.name.toLowerCase().includes(name.toLowerCase()); });
    if (cssFile && cssFile.type === MimeType.GOOGLE_SHEETS){
      try {
        var id = cssFile.url.match(/\/d\/([a-zA-Z0-9-_]+)/); id = id && id[1];
        if (id){
          var v = SpreadsheetApp.openById(id).getSheets()[0].getRange('A2').getValue();
          if (v && !isNaN(v)) upsertAccounts([{ account:name, css: Number(v) }]);
        }
      } catch(e){ Logger.log('CSS parse failed for '+cssFile.name+': '+e); }
    }
  });
}

// ============== AUTOMATION & UPDATE API (NEW) ==============

function loadTasksFromSheets() {
  var cfg = getConfig();
  var sh = SpreadsheetApp.openById(cfg.TASKS_SHEET_ID).getActiveSheet();
  var values = sh.getDataRange().getValues();
  var tasks = [];
  for (var i=1;i<values.length;i++){
    var r = values[i]; if (!r[0] && !r[1]) continue;
    tasks.push({ id:r[0], title:r[1], account:r[2], dueDate:r[3], priority:r[4], assignee:r[5], status:r[6], completed:r[9]===true });
  }
  return tasks;
}

function ensureTask(account, title, dueISO, priority, status, type, trigger) {
  var cfg = getConfig();
  var sh = SpreadsheetApp.openById(cfg.TASKS_SHEET_ID).getActiveSheet();
  var values = sh.getDataRange().getValues();
  var headers = values[0];
  var titleIdx = headers.indexOf('Title');
  var acctIdx = headers.indexOf('Account');
  var statusIdx = headers.indexOf('Status');
  for (var r=1;r<values.length;r++) {
    var same = (String(values[r][titleIdx]||'')===title) && (String(values[r][acctIdx]||'')===account) && String(values[r][statusIdx]||'open').toLowerCase()!=='done';
    if (same) return false;
  }
  var id = 'task_' + Utilities.getUuid().slice(0,8);
  var idIdx = headers.indexOf('Task ID');
  var dueIdx = headers.indexOf('Due Date');
  var priIdx = headers.indexOf('Priority');
  var asgIdx = headers.indexOf('Assignee');
  var typeIdx = headers.indexOf('Type');
  var trigIdx = headers.indexOf('Trigger');
  var createdIdx = headers.indexOf('Created Date');
  var row = new Array(headers.length).fill('');
  if (idIdx>=0) row[idIdx]=id; if (titleIdx>=0) row[titleIdx]=title; if (acctIdx>=0) row[acctIdx]=account;
  if (dueIdx>=0) row[dueIdx]= new Date(dueISO); if (priIdx>=0) row[priIdx]=priority||'High';
  if (asgIdx>=0) row[asgIdx]=Session.getActiveUser().getEmail(); if (statusIdx>=0) row[statusIdx]=status||'open';
  if (typeIdx>=0) row[typeIdx]=type||'auto'; if (trigIdx>=0) row[trigIdx]=trigger||'';
  if (createdIdx>=0) row[createdIdx]= new Date();
  sh.appendRow(row);
  return true;
}

function appendTimeline(account, eventType, description){
  var cfg = getConfig();
  var sh = SpreadsheetApp.openById(cfg.TIMELINE_SHEET_ID).getActiveSheet();
  sh.appendRow([new Date(), account, eventType, description, 'open', 'Medium', 'Automation', false, Session.getActiveUser().getEmail()]);
}

function runFullDashboardAutomation(){
  var accs = loadAccountsFromSheets();
  var now = new Date();
  var created = [];
  Object.keys(accs).forEach(function(name){
    var a = accs[name];
    var renewalDays = daysUntil(a.renewalDate);
    var cssDrop = Number(a.cssScore) - Number(a.cssPrevious || a.cssScore);
    var risk = String(a.riskLevel||'').toLowerCase();
    if (renewalDays >= 0 && renewalDays <= 90) {
      var t1='Renewal prep: schedule executive call'; var d1= toISO(addDays(now, Math.min(30, Math.max(7, renewalDays-30))));
      if (ensureTask(name, t1, d1, 'High', 'open', 'auto-renewal', '90_days_before')) { appendTimeline(name, 'Renewal', 'Auto-created renewal prep'); created.push({account:name,title:t1}); }
    }
    if (cssDrop < -0.5) {
      var t2='CSS recovery plan: analyze decline and respond'; var d2= toISO(addDays(now, 10));
      if (ensureTask(name, t2, d2, 'High', 'open', 'auto-css', 'css_drop')) { appendTimeline(name, 'CSS', 'Auto CSS recovery'); created.push({account:name,title:t2}); }
    }
    if (risk==='high' || risk==='red') {
      var t3='Risk mitigation workshop'; var d3= toISO(addDays(now, 7));
      if (ensureTask(name, t3, d3, 'Critical', 'open', 'auto-risk', 'high_risk')) { appendTimeline(name, 'Risk', 'Auto risk mitigation'); created.push({account:name,title:t3}); }
    }
  });
  return { ok:true, created: created };
}

function getUpdateApi(){
  var result = {};
  try { scanResourcesAndUpdate(); result.resources=true; } catch(e){ result.resources=String(e); }
  try { result.automation = runFullDashboardAutomation(); } catch(e){ result.automation=String(e); }
  return ContentService.createTextOutput(JSON.stringify({ ok:true, result: result, at: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createTimelineEvent(account, date, eventTypes, areas) {
  var eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  var area = areas[Math.floor(Math.random() * areas.length)];
  var status = date < new Date() ? 'Completed' : 'Scheduled';
  
  return [
    date,
    account,
    eventType,
    eventType + ' - ' + area,
    status,
    ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    area,
    Math.random() > 0.7,
    Session.getActiveUser().getEmail()
  ];
}

function setupFolders() {
  var folderIds = {};
  try {
    if (CONFIG.DASHBOARD_FOLDER_ID && folderExists(CONFIG.DASHBOARD_FOLDER_ID)) {
      console.log('Using existing dashboard folder');
      folderIds.dashboards = CONFIG.DASHBOARD_FOLDER_ID;
    } else {
      console.log('Creating dashboard folder...');
      folderIds.dashboards = DriveApp.createFolder('CSM Dashboards').getId();
    }
    // QBR slides folder
    folderIds.qbr = DriveApp.createFolder('QBR Slides').getId();
    // Resources folder (for live updates)
    folderIds.resources = DriveApp.createFolder('CSM Resources').getId();
    console.log('Folders created/verified');
    return folderIds;
  } catch (error) {
    console.log('Error setting up folders:', error.message);
    throw error;
  }
}

function folderExists(folderId) {
  try {
    DriveApp.getFolderById(folderId);
    return true;
  } catch(e) {
    return false;
  }
}

function updateConfig(sheetIds, folderIds) {
  var userEmail = Session.getActiveUser().getEmail();
  console.log('Update your CONFIG object with these values:');
  console.log('\nACCOUNTS_SHEET_ID: "' + sheetIds.accounts + '",');
  console.log('TASKS_SHEET_ID: "' + sheetIds.tasks + '",');
  console.log('METRICS_SHEET_ID: "' + sheetIds.metrics + '",');
  console.log('TIMELINE_SHEET_ID: "' + sheetIds.timeline + '",');
  console.log('DASHBOARD_FOLDER_ID: "' + folderIds.dashboards + '",');
  console.log('QBR_SLIDES_FOLDER_ID: "' + folderIds.qbr + '",');
  if (folderIds.resources) console.log('RESOURCES_FOLDER_ID: "' + folderIds.resources + '",');
  console.log('NOTIFICATION_EMAIL: "' + userEmail + '",\n');

  var props = PropertiesService.getScriptProperties();
  props.setProperties({
    'ACCOUNTS_SHEET_ID': sheetIds.accounts,
    'TASKS_SHEET_ID': sheetIds.tasks,
    'METRICS_SHEET_ID': sheetIds.metrics,
    'TIMELINE_SHEET_ID': sheetIds.timeline,
    'DASHBOARD_FOLDER_ID': folderIds.dashboards,
    'QBR_SLIDES_FOLDER_ID': folderIds.qbr,
    'RESOURCES_FOLDER_ID': folderIds.resources || '',
    'NOTIFICATION_EMAIL': userEmail
  });
  console.log('Configuration updated');
}

function createMockAccounts() {
  var config = getConfig();
  try {
    var sheet = SpreadsheetApp.openById(config.ACCOUNTS_SHEET_ID).getActiveSheet();
    
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var range = sheet.getRange(2, 1, Math.max(lastRow - 1, 1), sheet.getLastColumn());
      range.clearContent();
    }
    
    var mockAccounts = [
      createAccountRow('Birkenstock', '2026-03-15', 8.1, 'Premier', 'EMEA Central', 'High Growth'),
      createAccountRow('CSL Seqirus', '2026-09-01', 7.6, 'Premier', 'APAC', 'Strategic'),
      createAccountRow('Gard', '2026-12-19', 7.8, 'Signature', 'EMEA North', 'At Risk'),
      createAccountRow('Wates', '2025-11-15', 7.5, 'Premier', 'EMEA UK', 'Expansion')
    ];
    
    for (var i = 0; i < mockAccounts.length; i++) {
      sheet.appendRow(mockAccounts[i]);
    }
    
    console.log('Created ' + mockAccounts.length + ' mock accounts');
    
    return {
      success: true,
      accountCount: mockAccounts.length,
      accounts: mockAccounts.map(function(a) { return a[0]; })
    };
    
  } catch (error) {
    console.error('Error creating mock accounts:', error);
    throw error;
  }
}

function createAccountRow(name, renewalDate, cssScore, plan, region, status) {
  var cssTrend = generateCssTrend(cssScore);
  var adoption = generateAdoptionScores();
  
  return [
    name,
    new Date(renewalDate),
    cssScore,
    cssTrend[2],
    plan,
    Session.getActiveUser().getEmail(),
    Math.floor(15 + Math.random() * 30) + 15,
    region,
    Math.floor(1 + Math.random() * 4),
    Math.floor(10 + Math.random() * 50),
    Math.floor(15 + Math.random() * 60),
    Math.floor(30 + Math.random() * 200),
    Math.floor(50 + Math.random() * 400),
    generateFocusAreas(status),
    mapStatusToRisk(status),
    cssTrend[0],
    cssTrend[1],
    cssTrend[2],
    cssTrend[3],
    adoption.apiDev,
    adoption.monitoring,
    adoption.security,
    adoption.testing,
    adoption.documentation
  ];
}

function generateCssTrend(currentScore) {
  var trend = [];
  var baseScore = currentScore - 0.6;
  for (var i = 0; i < 4; i++) {
    baseScore += (0.1 + Math.random() * 0.2);
    trend.push(Math.round(baseScore * 10) / 10);
  }
  trend[3] = currentScore;
  return trend;
}

function generateAdoptionScores() {
  var base = 60 + Math.random() * 30;
  return {
    apiDev: Math.floor(base + Math.random() * 20),
    monitoring: Math.floor(base + Math.random() * 25),
    security: Math.floor(base + Math.random() * 30),
    testing: Math.floor(base - 10 + Math.random() * 25),
    documentation: Math.floor(base - 5 + Math.random() * 20)
  };
}

function generateFocusAreas(status) {
  var areas = {
    'High Growth': 'API expansion planning, Performance optimization, Team scaling',
    'Strategic': 'Security compliance, Architecture review, Integration strategy',
    'At Risk': 'Utilization recovery, Stakeholder engagement, Risk mitigation',
    'Expansion': 'New feature adoption, Use case expansion, Value demonstration'
  };
  return areas[status] || 'Platform optimization, Best practices, User enablement';
}

function mapStatusToRisk(status) {
  var riskMap = {
    'High Growth': 'low',
    'Strategic': 'low',
    'At Risk': 'high',
    'Expansion': 'medium'
  };
  return riskMap[status] || 'medium';
}

function testSystem() {
  try {
    console.log('Testing enhanced system functionality...');
    
    var config = getConfig();
    
    var accountsSheet = SpreadsheetApp.openById(config.ACCOUNTS_SHEET_ID).getActiveSheet();
    var tasksSheet = SpreadsheetApp.openById(config.TASKS_SHEET_ID).getActiveSheet();
    console.log('Sheet access verified');

    var dashboardFolder = DriveApp.getFolderById(config.DASHBOARD_FOLDER_ID);
    var qbrFolder = DriveApp.getFolderById(config.QBR_SLIDES_FOLDER_ID);
    console.log('Folder access verified');

    var accounts = loadAccountsFromSheets();
    console.log('Data loading verified');
    console.log('Found ' + Object.keys(accounts).length + ' accounts');

    var testHtml = getEnhancedBirkenstockHTML();
    if (!testHtml || !testHtml.includes('<!DOCTYPE html>')) {
      throw new Error('Enhanced dashboard HTML generation failed');
    }
    console.log('Enhanced dashboard generation verified');

    var healthCheck = getHealthApi();
    console.log('API endpoints verified');

    return true;
  } catch (error) {
    console.log('Enhanced system test failed:', error.message);
    throw error;
  }
}

function getUrls() {
  var config = getConfig();
  try {
    var scriptUrl = ScriptApp.getService().getUrl();
    if (!scriptUrl) {
      console.log('Web app not deployed yet. Please deploy first.');
      return;
    }
    
    var dashboardUrls = {
      "Enhanced Portal": scriptUrl,
      "Birkenstock Dashboard": scriptUrl + "?account=birkenstock",
      "CSL Seqirus Dashboard": scriptUrl + "?account=csl", 
      "Gard Dashboard": scriptUrl + "?account=gard",
      "Wates Dashboard": scriptUrl + "?account=wates",
      "Accounts API": scriptUrl + "?api=accounts",
      "Tasks API": scriptUrl + "?api=tasks",
      "Metrics API": scriptUrl + "?api=metrics",
      "Timeline API": scriptUrl + "?api=timeline",
      "Health Check": scriptUrl + "?api=health"
    };
    
    console.log("=== ENHANCED CSM DASHBOARD URLS ===");
    console.log("Agentforce Design | Responsive | AI-Powered\n");
    
    for (var name in dashboardUrls) {
      console.log(name + ": " + dashboardUrls[name]);
    }
    
    console.log("\nFeatures:");
    console.log("• Agentforce color palette and design system");
    console.log("• Enhanced charts with Chart.js");
    console.log("• Responsive layout with interactive elements");
    console.log("• AI-powered insights and shortcuts");
    console.log("• Real-time data integration");
    console.log("• Professional animations and transitions");
    
    return dashboardUrls;
  } catch (error) {
    console.error("Error getting URLs:", error);
    throw error;
  }
}

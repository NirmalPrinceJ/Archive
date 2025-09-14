Google Sheets JSON Backend (Google Apps Script)

Overview
- The dashboard fetches real-time data from a Google Apps Script Web App that reads a Google Sheet and returns JSON.
- You can choose between two backends:
  - Option A (legacy): `backend/apps_script.gs` with `?what=load|seed|bootstrap` and POST save.
  - Option B (portal): `backend/automation_quick_setup.gs` with `?api=accounts` and `?api=tasks`, plus a hosted portal.

Steps (Option A: legacy)
- Create a Google Sheet with a first row of headers matching your columns, for example:
  - account, adoption, css, expertise, vcoresProd, vcoresPre, envs, renewal, risk
- Open script.google.com → New project.
- Paste the contents of `backend/apps_script.gs`.
- Deploy → New deployment → Type: Web app → Execute as: Me → Who has access: Anyone with the link.
- Copy the deployment URL and set it in `SHEETS_WEBAPP_URL` (Integrations → Google Sheets) in `Dashboard.html`.

Steps (Option B: portal)
- Create a new Apps Script project and paste your automation code based on `backend/automation_quick_setup.gs` (use your full version).
- Run `quickSetupCSMDashboard()` once, copy config to your Configuration.gs as instructed, then deploy as Web App.
- In `Dashboard.html`, paste the Web App URL into Integrations → Google Sheets (Web App URL). The dashboard will auto-call `?api=accounts` and `?api=tasks` on refresh.

Create and preload automatically (no manual Sheet needed)
- After deploying the Web App, open this URL in the browser:
  `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?what=bootstrap`
- This creates a new spreadsheet, seeds it with default accounts, and stores the new `SHEET_ID` in Script Properties. The JSON response includes the Sheet URL.

Seed again anytime
- `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?what=seed` overwrites the current sheet with the default seed data from the script.

Preload via CSV (manual alternative)
- Import `data/accounts_seed.csv` into a Google Sheet (File → Import → Upload → Insert new sheet or Replace data).

cURL (optional)
- You can POST directly to the Web App:
  curl -X POST -H "Content-Type: application/json" \
    -d @data/accounts_seed.json \
    "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"

Response format
- The `doGet` endpoint responds with:
  { "accounts": [ { "account": "Acme", "adoption": 75, ... } ] }

POST save
- The `doPost` endpoint accepts a JSON body with `accounts` to overwrite the sheet data below the header row.

Local setup
- Open `Dashboard.html` in a browser. Click “Refresh Data” to fetch the latest rows.
- Search, sort (click headers), and filter (chips) are all client-side.

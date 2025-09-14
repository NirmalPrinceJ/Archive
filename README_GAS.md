Google Sheets JSON Backend (Google Apps Script)

Overview
- The dashboard fetches real-time data from a Google Apps Script Web App that reads a Google Sheet and returns JSON.
- Use `backend/apps_script.gs` as the backend. Deploy it and paste the deployment URL into `SHEETS_WEBAPP_URL` in `Dashboard.html`.

Steps
- Create a Google Sheet with a first row of headers matching your columns, for example:
  - account, adoption, css, expertise, vcoresProd, vcoresPre, envs, renewal, risk
- Open script.google.com → New project.
- Paste the contents of `backend/apps_script.gs`.
- Deploy → New deployment → Type: Web app → Execute as: Me → Who has access: Anyone with the link.
- Copy the deployment URL and set it in `SHEETS_WEBAPP_URL` in `Dashboard.html`.

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

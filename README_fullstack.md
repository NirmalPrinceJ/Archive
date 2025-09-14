Full-Stack TypeScript App: Google Drive + Local Loader

Overview
- Server (Express + TypeScript): routes for Google Drive OAuth and Local file loading, normalized JSON output, .env-driven, file-cached tokens, CORS, helpful logs.
- Web (React + Vite + Tailwind + Chart.js): dashboard with source toggle (Drive|Local), folder/pattern inputs, search/sort/filter table, charts.
- Build script (`scripts/build-data.ts`) prebuilds combined JSON under `web/public/data/combined.json` from local `data/` JSON files.

Repo Layout
- `server/`: Express API in TypeScript
- `web/`: React + Vite + Tailwind app
- `scripts/`: utility scripts
- `data/`: example local JSON (see `data/accounts_seed.json`)

Setup
1) Copy `.env.example` → `.env` and fill values.
   - `PORT`, `BASE_URL`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (see below for GCP setup)
   - optional: `DRIVE_FOLDER_ID`, `LOCAL_DATA_DIR`, `LOCAL_GLOB`
   - optional integrations:
     - Slack: `SLACK_BOT_TOKEN`, `SLACK_DEFAULT_CHANNEL`
     - Email (SMTP): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_TO_DEFAULT`
     - For Slides export/import add scope `https://www.googleapis.com/auth/presentations` to `GOOGLE_SCOPES`
2) Install deps (run in each folder):
   - `cd server && npm install`
   - `cd web && npm install`
3) First run (two shells):
   - Orchestrated (one command): `npm install && npm run dev` (root)
     - Starts server on :4000 and web on :5173 with proxy
   - Manual (two shells):
     - `cd server && npm install && npm run dev`
     - `cd web && npm install && npm run dev`
   - Open http://localhost:5173

Google Cloud OAuth Setup (Drive API)
1) In Google Cloud Console, create a new project.
2) APIs & Services → OAuth consent screen: configure Internal or External; add test users if External.
3) Credentials → Create Credentials → OAuth client ID → Web application.
   - Authorized redirect URI: `http://localhost:4000/auth/google/callback`
4) Enable APIs → Enable Google Drive API.
5) Copy `Client ID` and `Client Secret` into `.env`.
6) Add scopes as needed:
   - Read Drive JSON only: `https://www.googleapis.com/auth/drive.readonly`
   - Write exports: add `https://www.googleapis.com/auth/drive.file`
   - Slides: add `https://www.googleapis.com/auth/presentations`
6) For Drive uploads (write), set `GOOGLE_SCOPES` to include `https://www.googleapis.com/auth/drive.file` (the default is read-only).

Drive Auth Flow
- From the web app, click “Connect Google” (links to `/auth/google`).
- Complete Google consent → “Authentication complete” page → Return to app.
- Server stores tokens under `server/.data/token.json`.

Local Data
- Place `.json` files under `web/public/data/` (or set `LOCAL_DATA_DIR` to another folder). Example provided: `data/accounts_seed.json`.
- Build precombined file: `npm run build-data` (see below) or run script directly:
  - `npx ts-node scripts/build-data.ts data`

Development Scripts
- Server:
  - `npm run dev` (ts-node-dev)
  - `npm run build` → `npm start`
- Web:
  - `npm run dev` (Vite + proxy to `:4000` for `/api` and `/auth`)
  - `npm run build` → `npm run preview`

Production
- Build both:
  - Orchestrated: `npm run build` (root)
  - Manual: `cd server && npm run build` and `cd web && npm run build`
- Serve:
  - `npm start` (root) runs `node server/dist/index.js` and serves `web/dist` statics.

API Summary
- `GET /health` → `{ ok: true }`
- `GET /auth/google` → redirect to Google consent
- `GET /auth/google/callback` → store tokens
- `GET /api/local?folder=../web/public/data&pattern=*.json` → list local files
- `GET /api/drive/list?folderId=...&pattern=*.json` → list Drive files
- `GET /api/data/normalized?source=local|drive&folder=...&pattern=*.json&folderId=...` → combined normalized accounts
- `POST /api/drive/upload` → upload a file to Drive `{ name, mimeType, contentBase64, folderId? }`
- `POST /api/drive/export-json` → upload combined `{accounts,tasks}` as a JSON to Drive `{ folderId?, name? }`
- `GET /api/drive/browse?folderId=root&type=folders|files|all&q=...&pageToken=...` → browse Drive
- `GET /api/drive/file?id=...` → file metadata
- `POST /api/slack/post` → send a Slack message `{ channel, text }`
- `POST /api/email/send` → send an email `{ to?, from?, subject?, html }`
- `POST /api/slides/export` → build a Slides deck from data `{ title?, accounts, tasks?, folderId?, templateId? }`
- `GET /api/slides/import?presentationId=...` → parse accounts from first table

NPM Helpers (root, optional)
- You can add root-level scripts to orchestrate both; e.g., with `concurrently`.

Sample Screenshots
- Add screenshots to `web/public/screenshots/` and reference them in your docs or README.

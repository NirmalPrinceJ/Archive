# AI Assistant Instructions for Dashboard Project

## Project Overview
This is a full-stack TypeScript application that provides a dashboard interface for data from either Google Drive or local files. The project consists of three main components:

1. **Express Server** (`/server`): Handles Google Drive OAuth and local file loading
2. **React Frontend** (`/web`): Dashboard UI with data visualization
3. **Google Apps Script Backend** (`/backend`): Alternative data source via Google Sheets

## Key Architecture Patterns

### Data Flow
- Data can be sourced from:
  - Google Drive (JSON files) via OAuth
  - Local files (JSON/CSV) via direct file system access
  - Google Sheets (via Apps Script Web App)
- All data is normalized to a common JSON structure before reaching the frontend

### State Management
- Token storage: `server/.data/token.json` for Google OAuth credentials
- Environment config: `.env` file (copy from `.env.example`)
- Data caching: Pre-built combined JSON at `web/public/data/combined.json`

## Development Workflows

### Local Development Setup
```bash
# Server (Terminal 1)
cd server && npm install && npm run dev

# Web (Terminal 2)
cd web && npm install && npm run dev
```
Access the app at http://localhost:5173

### Build Process
- Use `scripts/build-data.ts` to pre-build combined JSON data
- Web app builds with Vite
- Server uses TypeScript compilation

## Project-Specific Conventions

### API Endpoints
- OAuth: `/auth/google` - Initiates Google auth flow
- Local Files: `/api/local` - Lists/loads local JSON files
- Google Drive: `/api/drive` - Lists/loads Drive files

### Data Structure
Reference `data/accounts_seed.json` for the expected data schema:
- Required fields: account, adoption, css, expertise
- Optional fields: vcoresProd, vcoresPre, envs, renewal, risk

## Integration Points

### Google Cloud Setup
1. Create project in Google Cloud Console
2. Enable Drive API
3. Configure OAuth consent screen
4. Create OAuth credentials
5. Add redirect URI: `http://localhost:4000/auth/google/callback`

### Google Apps Script Integration
- Deploy script from `backend/automation_quick_setup.gs` as Web App
- Set Web App URL in dashboard configuration
- Endpoints: `?api=accounts` and `?api=tasks`

## Common Tasks

### Adding New Data Sources
1. Create normalizer in `server/src/normalize.ts`
2. Add route handler in `server/src/index.ts`
3. Update frontend data fetching in `web/src/ui/App.tsx`

### Modifying Dashboard Views
- Charts: Update `web/src/ui/components/Charts.tsx`
- Table: Modify `web/src/ui/components/Table.tsx`
- Filters: Adjust `web/src/ui/components/Filters.tsx`
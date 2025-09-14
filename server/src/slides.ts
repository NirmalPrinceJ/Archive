import { google } from 'googleapis';
import { loadSavedClient } from './google.js';

export async function createDeckFromData(params: { title?: string; accounts: any[]; tasks?: any[]; folderId?: string; templateId?: string }) {
  const client = loadSavedClient();
  if (!client) throw new Error('Not authenticated. Visit /auth/google to connect.');

  const slides = google.slides({ version: 'v1', auth: client });
  const drive = google.drive({ version: 'v3', auth: client });

  let presentationId: string;
  if (params.templateId) {
    const copy = await drive.files.copy({ fileId: params.templateId, requestBody: { name: params.title || 'CSM Dashboard Deck' } });
    presentationId = String(copy.data.id);
  } else {
    const pres = await slides.presentations.create({ requestBody: { title: params.title || 'CSM Dashboard Deck' } });
    presentationId = String(pres.data.presentationId);
  }

  // Build requests: add a title slide and a table slide
  const title = params.title || 'CSM Dashboard';
  const requests: any[] = [];
  // Title slide
  requests.push({ createSlide: { slideLayoutReference: { predefinedLayout: 'TITLE' } } });
  requests.push({ insertText: { objectId: 'title', text: title } });

  // Accounts table on a new slide
  const tableRows: string[][] = [];
  const headers = ['Account','Adoption %','CSS','Expertise','vCores Prod','vCores Pre','Envs','Renewal','Risk'];
  tableRows.push(headers);
  (params.accounts || []).slice(0, 20).forEach((a:any)=>{
    tableRows.push([
      String(a.account||a.name||''), String(a.adoption??a.adoptionPct??''), String(a.css??a.cssScore??''), String(a.expertise??a.technicalExpertise??''),
      String(a.vcoresProd??''), String(a.vcoresPre??a.vcoresPreProd??''), String(a.envs??(Array.isArray(a.environments)?a.environments.length: a.environments||'')),
      String(a.renewal||a.renewalDate||''), String(a.risk||a.renewalRisk||'')
    ]);
  });

  // Create slide and table
  const slideObjectId = 'accountsSlide';
  const tableObjectId = 'accountsTable';
  requests.push({ createSlide: { objectId: slideObjectId, slideLayoutReference: { predefinedLayout: 'BLANK' } } });
  requests.push({ createTable: { objectId: tableObjectId, elementProperties: { pageObjectId: slideObjectId, size: { width: { magnitude: 6400000, unit: 'EMU' }, height: { magnitude: 3600000, unit: 'EMU' } }, transform: { scaleX: 1, scaleY: 1, translateX: 304800, translateY: 304800, unit: 'EMU' } }, rows: tableRows.length, columns: headers.length } });
  // Fill table cells
  for (let r = 0; r < tableRows.length; r++) {
    for (let c = 0; c < headers.length; c++) {
      const cellLocation = { tableObjectId, rowIndex: r, columnIndex: c }; 
      requests.push({ insertText: { objectId: tableObjectId, cellLocation, text: String(tableRows[r][c]) } });
    }
  }

  await slides.presentations.batchUpdate({ presentationId, requestBody: { requests } });

  return { presentationId, url: `https://docs.google.com/presentation/d/${presentationId}/edit` };
}

export async function parseAccountsFromFirstTable(presentationId: string) {
  const client = loadSavedClient();
  if (!client) throw new Error('Not authenticated. Visit /auth/google to connect.');
  const slides = google.slides({ version: 'v1', auth: client });
  const pres = await slides.presentations.get({ presentationId });
  const slidesPages = pres.data.slides || [];
  for (const page of slidesPages) {
    const elements = page.pageElements || [];
    for (const el of elements) {
      if (el.table && el.table.tableRows && el.table.tableRows.length > 1) {
        const rows = el.table.tableRows;
        const headers = (rows[0].tableCells||[]).map((cell:any)=>collectText(cell));
        const out: any[] = [];
        for (let r=1; r<rows.length; r++) {
          const cells = rows[r].tableCells || [];
          const obj: any = {};
          for (let c=0; c<headers.length; c++) obj[headers[c]] = collectText(cells[c]);
          out.push(mapSlideRow(obj));
        }
        return out;
      }
    }
  }
  return [];
}

function collectText(cell: any): string {
  const content = (cell?.text?.textElements || []) as any[];
  return content.map(te=>te?.textRun?.content || '').join('').trim();
}

function mapSlideRow(r: any){
  return {
    account: r['Account']||'', adoption: Number(r['Adoption %']||0), css: Number(r['CSS']||0), expertise: Number(r['Expertise']||0),
    vcoresProd: Number(r['vCores Prod']||0), vcoresPre: Number(r['vCores Pre']||0), envs: Number(r['Envs']||0), renewal: r['Renewal']||'', risk: r['Risk']||'Green'
  };
}


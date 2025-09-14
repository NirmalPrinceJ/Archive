import React, { useEffect, useMemo, useState } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type Account = {
  account: string;
  adoption: number;
  css: number;
  expertise: number;
  vcoresProd: number;
  vcoresPre: number;
  envs: number;
  renewal: string;
  risk: string;
}

const riskColors: Record<string, string> = { Red: '#EF4444', Amber: '#F59E0B', Green: '#10B981' };

export default function App() {
  const [source, setSource] = useState<'local'|'drive'>(() => (localStorage.getItem('src') as any) || 'local');
  const [folderId, setFolderId] = useState<string>('');
  const [folder, setFolder] = useState<string>('../web/public/data');
  const [pattern, setPattern] = useState<string>('*.json');
  const [query, setQuery] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sort, setSort] = useState<{key: keyof Account, dir: 'asc'|'desc'}>({ key: 'account', dir: 'asc' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');
  const [rows, setRows] = useState<Account[]>([]);
  // Apps Script Web App URL (for Bootstrap Sheet). You can paste at runtime.
  const [sheetsUrl, setSheetsUrl] = useState<string>('');

  useEffect(()=>{ localStorage.setItem('src', source); }, [source]);

  async function load() {
    setLoading(true); setErr('');
    try {
      const params = new URLSearchParams();
      params.set('source', source);
      if (source === 'local') { params.set('folder', folder); params.set('pattern', pattern); }
      else { params.set('folderId', folderId); params.set('pattern', pattern); }
      const res = await fetch(`/api/data/normalized?${params.toString()}`);
      if (!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      setRows(Array.isArray(data.accounts)?data.accounts:[]);
    } catch (e:any) { setErr(e?.message||'Failed'); }
    finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    let r = rows.filter(x => riskFilter==='all' || (x.risk||'').toLowerCase()===riskFilter);
    if (q) r = r.filter(x => Object.values(x).some(v => String(v).toLowerCase().includes(q)));
    const dir = sort.dir==='asc'?1:-1; const key = sort.key;
    r.sort((a,b)=>{
      const va = (a as any)[key]; const vb = (b as any)[key];
      const na = Number(va), nb = Number(vb); if (Number.isFinite(na)&&Number.isFinite(nb)) return (na-nb)*dir;
      return String(va).localeCompare(String(vb))*dir;
    });
    return r;
  }, [rows, query, riskFilter, sort]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">CSM Dashboard</h1>
          <p className="text-slate-500">Drive or Local JSON → normalized → charts + table</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</button>
          <a className="px-3 py-2 rounded border" href="/health" target="_blank" rel="noreferrer">Server</a>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded border bg-white">
          <div className="font-semibold mb-2">Source</div>
          <div className="flex flex-wrap gap-2 items-center">
            <select value={source} onChange={e=>setSource(e.target.value as any)} className="border rounded px-2 py-1">
              <option value="local">Local</option>
              <option value="drive">Drive</option>
            </select>
            {source==='local' ? (
              <>
                <input placeholder="Local folder" value={folder} onChange={e=>setFolder(e.target.value)} className="border rounded px-2 py-1 w-48" />
                <input placeholder="Pattern" value={pattern} onChange={e=>setPattern(e.target.value)} className="border rounded px-2 py-1 w-40" />
              </>
            ) : (
              <>
                <input placeholder="Drive folderId" value={folderId} onChange={e=>setFolderId(e.target.value)} className="border rounded px-2 py-1 w-64" />
                <input placeholder="Pattern" value={pattern} onChange={e=>setPattern(e.target.value)} className="border rounded px-2 py-1 w-40" />
                <a className="underline" href="/auth/google">Connect Google</a>
              </>
            )}
          </div>
        </div>
        <div className="p-4 rounded border bg-white">
          <div className="font-semibold mb-2">Search & Filter</div>
          <div className="flex flex-wrap gap-2 items-center">
            <input placeholder="Search…" value={query} onChange={e=>setQuery(e.target.value)} className="border rounded px-2 py-1 w-56" />
            <div className="flex gap-2 items-center">
              {['all','green','amber','red'].map(r => (
                <button key={r} onClick={()=>setRiskFilter(r)} className={`px-3 py-1 rounded border ${riskFilter===r?'bg-slate-800 text-white':''}`}>{r}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 rounded border bg-white md:col-span-2">
          <div className="font-semibold mb-2">Google Sheets (Apps Script)</div>
          <div className="flex flex-wrap gap-2 items-center">
            <input placeholder="SHEETS_WEBAPP_URL" value={sheetsUrl} onChange={e=>setSheetsUrl(e.target.value)} className="border rounded px-2 py-1 w-96" />
            <button className="px-3 py-2 rounded border" onClick={async()=>{
              if(!sheetsUrl){ alert('Set SHEETS_WEBAPP_URL'); return; }
              try {
                const url = new URL(sheetsUrl); url.searchParams.set('what','bootstrap');
                const res = await fetch(url.toString());
                const data = await res.json();
                if(data?.url){ window.open(data.url, '_blank'); }
                alert('Bootstrap complete');
              } catch (e:any){ alert('Bootstrap failed: '+(e?.message||'')); }
            }}>🧰 Bootstrap Sheet</button>
            <button className="px-3 py-2 rounded border" onClick={async()=>{
              if(!sheetsUrl){ alert('Set SHEETS_WEBAPP_URL'); return; }
              try {
                const url = new URL(sheetsUrl); url.searchParams.set('what','seed');
                const res = await fetch(url.toString());
                await res.json();
                alert('Seeded default data');
              } catch (e:any){ alert('Seed failed: '+(e?.message||'')); }
            }}>🌱 Seed Default Data</button>
          </div>
        </div>
      </section>

      {err && <div className="p-3 rounded border border-red-300 bg-red-50 text-red-800 mb-4">{err}</div>}

      <section className="p-4 rounded border bg-white mb-6 overflow-auto">
        <div className="font-semibold mb-2">Account Overview</div>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              {['account','adoption','css','expertise','vcoresProd','vcoresPre','envs','renewal','risk'].map((k)=>{
                const key = k as keyof Account;
                return (
                  <th key={k} className="px-3 py-2 text-left cursor-pointer" onClick={()=> setSort(s=> s.key===key?({key,dir:s.dir==='asc'?'desc':'asc'}):({key,dir:'asc'}))}>
                    {k}{sort.key===key? (sort.dir==='asc'?' ↑':' ↓'):''}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a,i)=> (
              <tr key={i} className={a.risk==='Red'? 'bg-red-50': ''}>
                <td className="px-3 py-2 font-semibold">{a.account}</td>
                <td className="px-3 py-2">{a.adoption}</td>
                <td className="px-3 py-2">{a.css}</td>
                <td className="px-3 py-2">{a.expertise}</td>
                <td className="px-3 py-2">{a.vcoresProd}</td>
                <td className="px-3 py-2">{a.vcoresPre}</td>
                <td className="px-3 py-2">{a.envs}</td>
                <td className="px-3 py-2">{a.renewal}</td>
                <td className="px-3 py-2">{a.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Charts accounts={filtered} />
    </div>
  );
}

function Charts({ accounts }: { accounts: Account[] }){
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvas2Ref = React.useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    if (!canvasRef.current || !canvas2Ref.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    const ctx2 = canvas2Ref.current.getContext('2d')!;
    const bar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: accounts.map(a=>a.account),
        datasets: [
          { label:'Prod', data: accounts.map(a=>a.vcoresProd), backgroundColor:'#3B82F6' },
          { label:'Pre', data: accounts.map(a=>a.vcoresPre), backgroundColor:'#F59E0B' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
    const line = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: accounts.map(a=>a.account),
        datasets: [
          { label:'Adoption %', data: accounts.map(a=>a.adoption), borderColor:'#10B981', backgroundColor:'rgba(16,185,129,.15)', fill: true }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
    return ()=>{ bar.destroy(); line.destroy(); };
  }, [accounts]);

  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="h-72 p-4 rounded border bg-white"><canvas ref={canvasRef}/></div>
      <div className="h-72 p-4 rounded border bg-white"><canvas ref={canvas2Ref}/></div>
    </section>
  );
}

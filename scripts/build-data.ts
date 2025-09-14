#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

const SRC_DIR = process.argv[2] || path.resolve(process.cwd(), 'data');
const OUT = path.resolve(process.cwd(), 'web/public/data/combined.json');

function readJsonSafe(p: string): unknown {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function normalizeOne(r: any){
  const num = (v:any, d=0)=>{ const n=Number(v); return Number.isFinite(n)?n:d; };
  return {
    account: String((r?.account ?? r?.name ?? '')), adoption: num(r?.adoption ?? r?.adoptionPct, 0), css: num(r?.css ?? r?.cssScore, 0),
    expertise: num(r?.expertise ?? r?.technicalExpertise, 0), vcoresProd: num(r?.vcoresProd ?? r?.Prod, 0), vcoresPre: num(r?.vcoresPre ?? r?.vcoresPreProd ?? r?.PreProd, 0),
    envs: num(r?.envs ?? r?.environmentsCount ?? r?.Environments, 0), renewal: String(r?.renewal ?? r?.renewalDate ?? ''), risk: String(r?.risk ?? r?.renewalRisk ?? 'Green')
  };
}

function normalizeMany(data: unknown){
  if(Array.isArray(data)) return data.map(normalizeOne);
  return [];
}

function main(){
  if(!fs.existsSync(SRC_DIR)){
    console.error(`[build-data] Source dir not found: ${SRC_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(SRC_DIR).filter(f=>f.endsWith('.json'));
  const all: any[] = [];
  for(const f of files){
    const data = readJsonSafe(path.join(SRC_DIR, f));
    all.push(...normalizeMany(data));
  }
  const outDir = path.dirname(OUT); if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive:true });
  fs.writeFileSync(OUT, JSON.stringify({ accounts: all, count: all.length }, null, 2));
  console.log(`[build-data] Wrote ${OUT} (${all.length} accounts)`);
}

main();


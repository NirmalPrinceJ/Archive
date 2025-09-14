import fs from 'fs';
import path from 'path';
import { Minimatch } from 'minimatch';

export function listLocalFiles(dir: string, pattern: string) {
  const abs = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(abs)) return [];
  const mm = new Minimatch(pattern);
  return fs.readdirSync(abs)
    .filter(f => mm.match(f))
    .map(f => ({ name: f, path: path.join(abs, f) }));
}

export function readJsonSafe(filePath: string): unknown {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}


export type RawAccount = Record<string, unknown>;

export type Account = {
  account: string;
  adoption: number;
  css: number;
  expertise: number;
  vcoresProd: number;
  vcoresPre: number;
  envs: number;
  renewal: string;
  risk: string;
};

const asNum = (v: unknown, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

export function normalizeOne(r: RawAccount): Account {
  return {
    account: String((r['account'] ?? r['name'] ?? r['Account'] ?? '') || ''),
    adoption: asNum(r['adoption'] ?? r['adoptionPct'] ?? r['Adoption'] ?? 0),
    css: asNum(r['css'] ?? r['cssScore'] ?? r['CSS'] ?? 0),
    expertise: asNum(r['expertise'] ?? r['technicalExpertise'] ?? r['Expertise'] ?? 0),
    vcoresProd: asNum(r['vcoresProd'] ?? r['Prod'] ?? 0),
    vcoresPre: asNum(r['vcoresPre'] ?? r['vcoresPreProd'] ?? r['PreProd'] ?? 0),
    envs: asNum(r['envs'] ?? r['environmentsCount'] ?? r['Environments'] ?? 0),
    renewal: String((r['renewal'] ?? r['renewalDate'] ?? r['Renewal'] ?? '') || ''),
    risk: String((r['risk'] ?? r['renewalRisk'] ?? r['Risk'] ?? 'Green') || 'Green')
  };
}

export function normalizeMany(data: unknown): Account[] {
  if (Array.isArray(data)) return data.map(v => normalizeOne((v || {}) as RawAccount));
  return [];
}

export function mergeArrays(arrays: unknown[]): Account[] {
  const out: Account[] = [];
  for (const a of arrays) {
    out.push(...normalizeMany(a));
  }
  return out;
}


import { units } from '../../data/units';

function norm(s: string) {
  const nfd = s.normalize('NFD').toLowerCase();
  try {
    return nfd.replace(/\p{Diacritic}/gu, '');
  } catch {
    return nfd.replace(/[\u0300-\u036f]/g, '');
  }
}

export interface SearchItem {
  id: string;
  label: string;
  score: number;
}

export function searchUnits(query: string): SearchItem[] {
  const q = norm(query.trim());
  if (!q) return [];
  const res: SearchItem[] = [];
  for (const u of units) {
    const text = [u.name, u.symbol, ...(u.aliases || [])].map(norm).join(' ');
    const idx = text.indexOf(q);
    if (idx >= 0) {
      // simple scoring: earlier match and shorter distance is better
      const score = 1000 - idx - Math.abs((text.length - q.length));
      res.push({ id: u.id, label: `${u.name} (${u.symbol})`, score });
    }
  }
  return res.sort((a, b) => b.score - a.score).slice(0, 20);
}

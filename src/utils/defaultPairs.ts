import { categories } from '../data/units';
import type { Category } from '../domain/conversion/types';

export const defaultPairs: Record<string, [string, string]> = {
  length: ['m', 'ft'],
  mass: ['kg', 'lb'],
  temperature: ['degC', 'degF'],
  volume: ['L', 'gal_us'],
  area: ['m2', 'ft2'],
  speed: ['m_s', 'mph'],
  time: ['s', 'min'],
  pressure: ['Pa', 'psi'],
  energy: ['J', 'kWh'],
  power: ['W', 'kW'],
  data: ['MB', 'MiB'],
  angle: ['deg', 'rad'],
  frequency: ['Hz', 'kHz'],
  fuel_efficiency: ['L_100km', 'gal_100mi_us'],
  force: ['N', 'lbf'],
  torque: ['N_m', 'lbf_ft'],
  density: ['kg_m3', 'g_cm3'],
  flow: ['m3_s', 'L_min'],
  electric: ['V', 'kV'],
  acceleration: ['m_s2', 'g0'],
  luminance: ['cd_m2', 'ftL'],
};

export function getDefaultPairForCategory(id: Category['id']): [string, string] {
  if (defaultPairs[id]) return defaultPairs[id];
  const cat = categories.find(c => c.id === id);
  if (cat) return [cat.baseUnitId, cat.baseUnitId];
  return ['m','ft'];
}


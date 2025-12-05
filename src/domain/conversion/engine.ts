// Domain conversion engine with high-precision decimal math.
// Uses decimal.js-light at runtime; types are loose here to avoid hard requirement during scaffolding.

import type { FormatOptions, RoundingMode } from './types';
import { getUnitById, getUnitsByCategory } from '../../data/units';

// Lazy import pattern to decouple when module is loaded in environments before deps are installed.
let DecimalLib: any;
const DECIMAL_INPUT_RE = /^[+-]?(?:\d+|\d*\.\d+|\d+\.?)(?:e[+-]?\d+)?$/i;

class SmallDecimal {
  private n: number;
  constructor(v: any) {
    this.n = typeof v === 'number' ? v : Number(v);
  }
  plus(v: any) { return new SmallDecimal(this.n + Number(v instanceof SmallDecimal ? v.n : v)); }
  times(v: any) { return new SmallDecimal(this.n * Number(v instanceof SmallDecimal ? v.n : v)); }
  div(v: any) { return new SmallDecimal(this.n / Number(v instanceof SmallDecimal ? v.n : v)); }
  minus(v: any) { return new SmallDecimal(this.n - Number(v instanceof SmallDecimal ? v.n : v)); }
  abs() { return new SmallDecimal(Math.abs(this.n)); }
  toString() { return String(this.n); }
  toFixed(d: number) { return this.n.toFixed(d); }
  toExponential(d: number) { return this.n.toExponential(d); }
  toDecimalPlaces(d: number) { return new SmallDecimal(Number(this.n.toFixed(d))); }
  greaterThanOrEqualTo(v: any) { return this.n >= Number(v instanceof SmallDecimal ? v.n : v); }
}

function ensureDecimalLib() {
  if (DecimalLib === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      DecimalLib = require('decimal.js-light');
      DecimalLib.set({ precision: 34 });
    } catch {
      DecimalLib = null; // unavailable, fallback to SmallDecimal
    }
  }
}

function makeDecimalInstance(v: any) {
  ensureDecimalLib();
  return DecimalLib ? new DecimalLib(v) : new SmallDecimal(v);
}

function sanitizeNumericInput(value: any): string | number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Invalid number');
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const cleaned = trimmed.replace(/,/g, '');
    if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned === '-.' || cleaned === '+') return 0;
    if (!DECIMAL_INPUT_RE.test(cleaned)) throw new Error('Invalid number');
    return cleaned;
  }
  if (typeof value === 'object' && typeof (value as any).toString === 'function') {
    return sanitizeNumericInput((value as any).toString());
  }
  throw new Error('Invalid number');
}

function toDecimal(value: any) {
  try {
    return makeDecimalInstance(sanitizeNumericInput(value));
  } catch {
    return makeDecimalInstance(0);
  }
}

function applyRounding(d: any, mode: RoundingMode, decimals: number): any {
  const decimalsSafe = Math.max(0, Math.min(12, Number.isFinite(decimals) ? decimals : 0));
  const rmMap: Record<RoundingMode, number> = {
    halfUp: 4, // Decimal.ROUND_HALF_UP
    floor: 3, // Decimal.ROUND_FLOOR
    ceil: 2, // Decimal.ROUND_CEIL
    bankers: 6, // Decimal.ROUND_HALF_EVEN
  };
  if (DecimalLib) {
    const original = DecimalLib.rounding;
    DecimalLib.set({ rounding: rmMap[mode] });
    // Support both decimal.js-light's toDP and potential toDecimalPlaces alias
    const res = typeof d.toDecimalPlaces === 'function' ? d.toDecimalPlaces(decimalsSafe) :
      typeof d.toDP === 'function' ? d.toDP(decimalsSafe) : d; // fallback to unchanged
    DecimalLib.set({ rounding: original });
    return res;
  }
  // Fallback: SmallDecimal ignores mode and uses standard toFixed rounding
  return d.toDecimalPlaces(decimalsSafe);
}

export function convertRaw(value: string | number, fromUnitId: string, toUnitId: string): any {
  const from = getUnitById(fromUnitId);
  const to = getUnitById(toUnitId);
  if (!from || !to) throw new Error('Unknown unit');
  if (from.categoryId !== to.categoryId) throw new Error('Category mismatch');

  const v = toDecimal(value);
  // To base: (x + offset_u) * factor_u
  const offsetFrom = from.offset ?? 0;
  const valueBase = v.plus(offsetFrom).times(from.factor);
  // From base to target: (valueBase / factor_v) - offset_v
  const offsetTo = to.offset ?? 0;
  const valueOut = valueBase.div(to.factor).minus(offsetTo);
  return valueOut;
}

export function convert(value: string | number, fromUnitId: string, toUnitId: string, fmt?: FormatOptions): string {
  const result = convertRaw(value, fromUnitId, toUnitId);
  return formatDecimal(result, fmt);
}

export function formatDecimal(d: any, fmt: FormatOptions = {}): string {
  const {
    decimals = 6,
    roundingMode = 'halfUp',
    useGrouping = true,
    locale,
    scientificThreshold = 1e12,
  } = fmt;

  const decimalsSafe = Math.max(0, Math.min(12, Number.isFinite(decimals as any) ? Number(decimals) : 6));
  const safeDecimal = toDecimal(d);
  const abs = safeDecimal.abs();
  const toRound = applyRounding(safeDecimal, roundingMode, decimalsSafe);
  // Cross-library safe greater-or-equal check
  const useSci = (typeof (abs as any).greaterThanOrEqualTo === 'function')
    ? (abs as any).greaterThanOrEqualTo(scientificThreshold)
    : (typeof (abs as any).cmp === 'function')
      ? ((abs as any).cmp(scientificThreshold) >= 0)
      : (Number(abs.toString()) >= scientificThreshold);

  if (useSci) {
    // Scientific format string
    return toRound.toExponential(decimals);
  }

  const num = Number(toRound.toString());
  try {
    return new Intl.NumberFormat(locale, {
      useGrouping,
      minimumFractionDigits: decimalsSafe,
      maximumFractionDigits: decimalsSafe,
    }).format(num);
  } catch {
    return toRound.toFixed(decimalsSafe);
  }
}

export function multiConvert(
  value: string | number,
  fromUnitId: string,
  categoryId: string,
  fmt?: FormatOptions
): { unitId: string; value: string }[] {
  const units = getUnitsByCategory(categoryId as any);
  return units.map(u => ({ unitId: u.id, value: convert(value, fromUnitId, u.id, fmt) }));
}

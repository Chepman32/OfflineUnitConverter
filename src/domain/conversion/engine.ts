// Domain conversion engine with high-precision decimal math.
// Uses decimal.js-light at runtime; types are loose here to avoid hard requirement during scaffolding.

import type { FormatOptions, RoundingMode } from './types';
import { getUnitById, getUnitsByCategory } from '../../data/units';

// Lazy import pattern to decouple when module is loaded in environments before deps are installed.
let DecimalLib: any;
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

function Decimal(value: any) {
  if (DecimalLib === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      DecimalLib = require('decimal.js-light');
      DecimalLib.set({ precision: 34 });
    } catch {
      DecimalLib = null; // unavailable, fallback to SmallDecimal
    }
  }
  return DecimalLib ? new DecimalLib(value) : new SmallDecimal(value);
}

function applyRounding(d: any, mode: RoundingMode, decimals: number): any {
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
    const res = typeof d.toDecimalPlaces === 'function' ? d.toDecimalPlaces(decimals) :
      typeof d.toDP === 'function' ? d.toDP(decimals) : d; // fallback to unchanged
    DecimalLib.set({ rounding: original });
    return res;
  }
  // Fallback: SmallDecimal ignores mode and uses standard toFixed rounding
  return d.toDecimalPlaces(decimals);
}

export function convertRaw(value: string | number, fromUnitId: string, toUnitId: string): any {
  const from = getUnitById(fromUnitId);
  const to = getUnitById(toUnitId);
  if (!from || !to) throw new Error('Unknown unit');
  if (from.categoryId !== to.categoryId) throw new Error('Category mismatch');

  const v = Decimal(value);
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

  const abs = Decimal(0).plus(d).abs();
  const toRound = applyRounding(d, roundingMode, decimals);
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
      minimumFractionDigits: Math.max(0, Math.min(decimals, 12)),
      maximumFractionDigits: Math.max(0, Math.min(decimals, 12)),
    }).format(num);
  } catch {
    return toRound.toFixed(decimals);
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

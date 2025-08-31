export type CategoryId =
  | 'length'
  | 'mass'
  | 'temperature'
  | 'volume'
  | 'area'
  | 'speed'
  | 'time'
  | 'pressure'
  | 'energy'
  | 'power'
  | 'data'
  | 'angle'
  | 'frequency'
  | 'fuel_efficiency'
  | 'force'
  | 'torque'
  | 'density'
  | 'flow'
  | 'luminance'
  | 'electric'
  | 'acceleration';

export interface Category {
  id: CategoryId;
  name: string;
  baseUnitId: string;
  description?: string;
}

export interface UnitDef {
  id: string;
  categoryId: CategoryId;
  name: string;
  symbol: string;
  aliases?: string[];
  factor: number; // multiplicative factor relative to base unit
  offset?: number; // additive offset applied before factor when going to base
  notes?: string;
}

export interface CustomUnit extends Omit<UnitDef, 'id'> {
  id: string; // separate namespace from built-ins but same shape
  createdAt: number;
  updatedAt: number;
  userNote?: string;
}

export interface FavoritePair {
  id: string;
  fromUnitId: string;
  toUnitId: string;
  label?: string;
  colorTag?: string;
  precision?: number;
  lastUsedAt?: number;
}

export interface HistoryItem {
  id: string;
  inputValue: string; // store as string to preserve intent/formatting
  fromUnitId: string;
  toUnitId: string;
  resultValue: string; // formatted result snapshot
  createdAt: number;
  copied?: boolean;
  starred?: boolean;
}

export type RoundingMode = 'halfUp' | 'floor' | 'ceil' | 'bankers';

export interface FormatOptions {
  decimals?: number;
  roundingMode?: RoundingMode;
  useGrouping?: boolean;
  locale?: string;
  scientificThreshold?: number; // abs(value) >= threshold => use scientific
}


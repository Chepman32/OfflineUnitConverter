import type { Category, UnitDef } from '../domain/conversion/types';

export const categories: Category[] = [
  { id: 'length', name: 'Length', baseUnitId: 'm' },
  { id: 'mass', name: 'Mass', baseUnitId: 'kg' },
  { id: 'temperature', name: 'Temperature', baseUnitId: 'K' },
  { id: 'volume', name: 'Volume', baseUnitId: 'm3', description: 'Cubic meter' },
  { id: 'area', name: 'Area', baseUnitId: 'm2' },
  { id: 'speed', name: 'Speed', baseUnitId: 'm_s' },
  { id: 'time', name: 'Time', baseUnitId: 's' },
  { id: 'pressure', name: 'Pressure', baseUnitId: 'Pa' },
  { id: 'energy', name: 'Energy', baseUnitId: 'J' },
  { id: 'power', name: 'Power', baseUnitId: 'W' },
  { id: 'data', name: 'Data', baseUnitId: 'byte' },
  { id: 'angle', name: 'Angle', baseUnitId: 'rad' },
  { id: 'frequency', name: 'Frequency', baseUnitId: 'Hz' },
  { id: 'fuel_efficiency', name: 'Fuel Efficiency', baseUnitId: 'L_100km' },
  { id: 'force', name: 'Force', baseUnitId: 'N' },
  { id: 'torque', name: 'Torque', baseUnitId: 'N_m' },
  { id: 'density', name: 'Density', baseUnitId: 'kg_m3' },
  { id: 'flow', name: 'Flow', baseUnitId: 'm3_s' },
  { id: 'luminance', name: 'Luminance/Illuminance', baseUnitId: 'cd_m2' },
  { id: 'electric', name: 'Electric', baseUnitId: 'V' },
  { id: 'acceleration', name: 'Acceleration', baseUnitId: 'm_s2' },
];

// Minimal starter set for core categories to validate engine. Expand over time.
export const units: UnitDef[] = [
  // Length (base: meter)
  { id: 'm', categoryId: 'length', name: 'Meter', symbol: 'm', factor: 1 },
  { id: 'km', categoryId: 'length', name: 'Kilometer', symbol: 'km', factor: 1000 },
  { id: 'cm', categoryId: 'length', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
  { id: 'mm', categoryId: 'length', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
  { id: 'mi', categoryId: 'length', name: 'Mile', symbol: 'mi', factor: 1609.344 },
  { id: 'yd', categoryId: 'length', name: 'Yard', symbol: 'yd', factor: 0.9144 },
  { id: 'ft', categoryId: 'length', name: 'Foot', symbol: 'ft', factor: 0.3048, aliases: ['feet'] },
  { id: 'in', categoryId: 'length', name: 'Inch', symbol: 'in', factor: 0.0254 },

  // Mass (base: kilogram)
  { id: 'kg', categoryId: 'mass', name: 'Kilogram', symbol: 'kg', factor: 1 },
  { id: 'g', categoryId: 'mass', name: 'Gram', symbol: 'g', factor: 0.001 },
  { id: 'mg', categoryId: 'mass', name: 'Milligram', symbol: 'mg', factor: 0.000001 },
  { id: 'lb', categoryId: 'mass', name: 'Pound', symbol: 'lb', factor: 0.45359237 },
  { id: 'oz', categoryId: 'mass', name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },

  // Temperature (base: Kelvin). factor applies to (value + offset)
  { id: 'K', categoryId: 'temperature', name: 'Kelvin', symbol: 'K', factor: 1, offset: 0 },
  { id: 'C', categoryId: 'temperature', name: 'Celsius', symbol: '°C', factor: 1, offset: 273.15 },
  { id: 'F', categoryId: 'temperature', name: 'Fahrenheit', symbol: '°F', factor: 5 / 9, offset: 459.67 },
  { id: 'R', categoryId: 'temperature', name: 'Rankine', symbol: '°R', factor: 5 / 9, offset: 0 },

  // Volume (base: m3)
  { id: 'm3', categoryId: 'volume', name: 'Cubic meter', symbol: 'm³', factor: 1 },
  { id: 'L', categoryId: 'volume', name: 'Liter', symbol: 'L', factor: 0.001 },
  { id: 'mL', categoryId: 'volume', name: 'Milliliter', symbol: 'mL', factor: 0.000001 },
  { id: 'ft3', categoryId: 'volume', name: 'Cubic foot', symbol: 'ft³', factor: 0.028316846592 },
  { id: 'in3', categoryId: 'volume', name: 'Cubic inch', symbol: 'in³', factor: 0.000016387064 },
  { id: 'gal_us', categoryId: 'volume', name: 'Gallon (US)', symbol: 'gal (US)', factor: 0.003785411784 },
  { id: 'gal_uk', categoryId: 'volume', name: 'Gallon (UK)', symbol: 'gal (UK)', factor: 0.00454609 },

  // Time (base: second)
  { id: 's', categoryId: 'time', name: 'Second', symbol: 's', factor: 1 },
  { id: 'ms', categoryId: 'time', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
  { id: 'min', categoryId: 'time', name: 'Minute', symbol: 'min', factor: 60 },
  { id: 'h', categoryId: 'time', name: 'Hour', symbol: 'h', factor: 3600 },
  { id: 'day', categoryId: 'time', name: 'Day', symbol: 'd', factor: 86400 },

  // Speed (base: m/s)
  { id: 'm_s', categoryId: 'speed', name: 'Meter per second', symbol: 'm/s', factor: 1 },
  { id: 'km_h', categoryId: 'speed', name: 'Kilometer per hour', symbol: 'km/h', factor: 1000 / 3600 },
  { id: 'mph', categoryId: 'speed', name: 'Mile per hour', symbol: 'mph', factor: 1609.344 / 3600 },
  { id: 'kn', categoryId: 'speed', name: 'Knot', symbol: 'kn', factor: 1852 / 3600 },

  // Pressure (base: Pa)
  { id: 'Pa', categoryId: 'pressure', name: 'Pascal', symbol: 'Pa', factor: 1 },
  { id: 'kPa', categoryId: 'pressure', name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
  { id: 'bar', categoryId: 'pressure', name: 'Bar', symbol: 'bar', factor: 100000 },
  { id: 'atm', categoryId: 'pressure', name: 'Atmosphere', symbol: 'atm', factor: 101325 },
  { id: 'psi', categoryId: 'pressure', name: 'Pounds per square inch', symbol: 'psi', factor: 6894.757293168 },

  // Energy (base: J)
  { id: 'J', categoryId: 'energy', name: 'Joule', symbol: 'J', factor: 1 },
  { id: 'kJ', categoryId: 'energy', name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
  { id: 'Wh', categoryId: 'energy', name: 'Watt-hour', symbol: 'Wh', factor: 3600 },
  { id: 'kWh', categoryId: 'energy', name: 'Kilowatt-hour', symbol: 'kWh', factor: 3600 * 1000 },
  { id: 'cal', categoryId: 'energy', name: 'Calorie', symbol: 'cal', factor: 4.184 },
  { id: 'kcal', categoryId: 'energy', name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },

  // Power (base: W)
  { id: 'W', categoryId: 'power', name: 'Watt', symbol: 'W', factor: 1 },
  { id: 'kW', categoryId: 'power', name: 'Kilowatt', symbol: 'kW', factor: 1000 },
  { id: 'hp', categoryId: 'power', name: 'Horsepower (mechanical)', symbol: 'hp', factor: 745.6998715822702 },

  // Data (base: byte)
  { id: 'byte', categoryId: 'data', name: 'Byte', symbol: 'B', factor: 1 },
  { id: 'bit', categoryId: 'data', name: 'Bit', symbol: 'b', factor: 1 / 8 },
  { id: 'KB', categoryId: 'data', name: 'Kilobyte (SI)', symbol: 'kB', factor: 1000 },
  { id: 'MB', categoryId: 'data', name: 'Megabyte (SI)', symbol: 'MB', factor: 1000 ** 2 },
  { id: 'GB', categoryId: 'data', name: 'Gigabyte (SI)', symbol: 'GB', factor: 1000 ** 3 },
  { id: 'KiB', categoryId: 'data', name: 'Kibibyte (binary)', symbol: 'KiB', factor: 1024 },
  { id: 'MiB', categoryId: 'data', name: 'Mebibyte (binary)', symbol: 'MiB', factor: 1024 ** 2 },
  { id: 'GiB', categoryId: 'data', name: 'Gibibyte (binary)', symbol: 'GiB', factor: 1024 ** 3 },

  // Area (base: m2)
  { id: 'm2', categoryId: 'area', name: 'Square meter', symbol: 'm²', factor: 1 },
  { id: 'km2', categoryId: 'area', name: 'Square kilometer', symbol: 'km²', factor: 1_000_000 },
  { id: 'cm2', categoryId: 'area', name: 'Square centimeter', symbol: 'cm²', factor: 0.0001 },
  { id: 'mm2', categoryId: 'area', name: 'Square millimeter', symbol: 'mm²', factor: 0.000001 },
  { id: 'in2', categoryId: 'area', name: 'Square inch', symbol: 'in²', factor: 0.00064516 },
  { id: 'ft2', categoryId: 'area', name: 'Square foot', symbol: 'ft²', factor: 0.09290304 },
  { id: 'yd2', categoryId: 'area', name: 'Square yard', symbol: 'yd²', factor: 0.83612736 },
  { id: 'acre', categoryId: 'area', name: 'Acre', symbol: 'acre', factor: 4046.8564224 },
  { id: 'hectare', categoryId: 'area', name: 'Hectare', symbol: 'ha', factor: 10_000 },

  // Angle (base: rad)
  { id: 'rad', categoryId: 'angle', name: 'Radian', symbol: 'rad', factor: 1 },
  { id: 'deg', categoryId: 'angle', name: 'Degree', symbol: '°', factor: Math.PI / 180 },
  { id: 'grad', categoryId: 'angle', name: 'Gradian', symbol: 'gon', factor: Math.PI / 200 },

  // Frequency (base: Hz)
  { id: 'Hz', categoryId: 'frequency', name: 'Hertz', symbol: 'Hz', factor: 1 },
  { id: 'kHz', categoryId: 'frequency', name: 'Kilohertz', symbol: 'kHz', factor: 1000 },
  { id: 'MHz', categoryId: 'frequency', name: 'Megahertz', symbol: 'MHz', factor: 1_000_000 },
  { id: 'GHz', categoryId: 'frequency', name: 'Gigahertz', symbol: 'GHz', factor: 1_000_000_000 },

  // Force (base: N)
  { id: 'N', categoryId: 'force', name: 'Newton', symbol: 'N', factor: 1 },
  { id: 'kN', categoryId: 'force', name: 'Kilonewton', symbol: 'kN', factor: 1000 },
  { id: 'lbf', categoryId: 'force', name: 'Pound-force', symbol: 'lbf', factor: 4.4482216152605 },
  { id: 'dyn', categoryId: 'force', name: 'Dyne', symbol: 'dyn', factor: 1e-5 },

  // Torque (base: N_m)
  { id: 'N_m', categoryId: 'torque', name: 'Newton meter', symbol: 'N·m', factor: 1 },
  { id: 'lbf_ft', categoryId: 'torque', name: 'Pound-foot', symbol: 'lbf·ft', factor: 1.3558179483314004 },

  // Acceleration (base: m/s2)
  { id: 'm_s2', categoryId: 'acceleration', name: 'Meter per second squared', symbol: 'm/s²', factor: 1 },
  { id: 'g0', categoryId: 'acceleration', name: 'Standard gravity', symbol: 'g', factor: 9.80665 },

  // Density (base: kg/m3)
  { id: 'kg_m3', categoryId: 'density', name: 'Kilogram per cubic meter', symbol: 'kg/m³', factor: 1 },
  { id: 'g_cm3', categoryId: 'density', name: 'Gram per cubic centimeter', symbol: 'g/cm³', factor: 1000 },
  { id: 'lb_ft3', categoryId: 'density', name: 'Pound per cubic foot', symbol: 'lb/ft³', factor: 16.018463 },
  { id: 'lb_in3', categoryId: 'density', name: 'Pound per cubic inch', symbol: 'lb/in³', factor: 27679.90471 },

  // Flow (base: m3/s)
  { id: 'm3_s', categoryId: 'flow', name: 'Cubic meter per second', symbol: 'm³/s', factor: 1 },
  { id: 'L_s', categoryId: 'flow', name: 'Liter per second', symbol: 'L/s', factor: 0.001 },
  { id: 'L_min', categoryId: 'flow', name: 'Liter per minute', symbol: 'L/min', factor: 0.001 / 60 },
  { id: 'gpm_us', categoryId: 'flow', name: 'Gallon per minute (US)', symbol: 'gpm (US)', factor: 0.003785411784 / 60 },
  { id: 'cfm', categoryId: 'flow', name: 'Cubic feet per minute', symbol: 'cfm', factor: 0.028316846592 / 60 },

  // Electric (Voltage only for now)
  { id: 'V', categoryId: 'electric', name: 'Volt', symbol: 'V', factor: 1 },
  { id: 'mV', categoryId: 'electric', name: 'Millivolt', symbol: 'mV', factor: 0.001 },
  { id: 'kV', categoryId: 'electric', name: 'Kilovolt', symbol: 'kV', factor: 1000 },
  // Electric current (using the same 'electric' category for simplicity)
  { id: 'A', categoryId: 'electric', name: 'Ampere', symbol: 'A', factor: 1 },
  { id: 'mA', categoryId: 'electric', name: 'Milliampere', symbol: 'mA', factor: 0.001 },
  // Resistance (still linear, same category grouping)
  { id: 'ohm', categoryId: 'electric', name: 'Ohm', symbol: 'Ω', factor: 1 },
  { id: 'kOhm', categoryId: 'electric', name: 'Kiloohm', symbol: 'kΩ', factor: 1000 },

  // Luminance (base: cd/m2)
  { id: 'cd_m2', categoryId: 'luminance', name: 'Candela per square meter', symbol: 'cd/m²', factor: 1, aliases: ['nit'] },
  { id: 'nit', categoryId: 'luminance', name: 'Nit', symbol: 'nt', factor: 1 },
  { id: 'ftL', categoryId: 'luminance', name: 'Foot-lambert', symbol: 'ft-L', factor: 3.4262591 },
];

export function getCategoryById(id: Category['id']): Category | undefined {
  return categories.find(c => c.id === id);
}

export function getUnitById(id: string): UnitDef | undefined {
  return units.find(u => u.id === id);
}

export function getUnitsByCategory(categoryId: Category['id']): UnitDef[] {
  return units.filter(u => u.categoryId === categoryId);
}

// Smart token lookup for Smart Paste and search helpers
function normToken(s: string) {
  const nfd = s.normalize('NFD').toLowerCase();
  try {
    return nfd.replace(/\p{Diacritic}/gu, '');
  } catch {
    return nfd.replace(/[\u0300-\u036f]/g, '');
  }
}

export function findUnitByToken(token: string): UnitDef | undefined {
  const t = normToken(token.trim());
  if (!t) return undefined;
  return units.find(u => {
    if (normToken(u.id) === t) return true;
    if (normToken(u.symbol) === t) return true;
    return (u.aliases || []).some(a => normToken(a) === t);
  });
}

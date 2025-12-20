import type { Category, UnitDef } from '../domain/conversion/types';

export const categories: Category[] = [
  { id: 'acceleration', name: 'Acceleration', baseUnitId: 'm_s2' },
  { id: 'angle', name: 'Angle', baseUnitId: 'rad' },
  { id: 'area', name: 'Area', baseUnitId: 'm2' },
  { id: 'capacitance', name: 'Capacitance', baseUnitId: 'F' },
  { id: 'conductance', name: 'Conductance', baseUnitId: 'S' },
  { id: 'data', name: 'Data', baseUnitId: 'byte' },
  { id: 'density', name: 'Density', baseUnitId: 'kg_m3' },
  { id: 'electric', name: 'Electric', baseUnitId: 'V' },
  { id: 'charge', name: 'Electric Charge', baseUnitId: 'C' },
  { id: 'energy', name: 'Energy', baseUnitId: 'J' },
  { id: 'flow', name: 'Flow', baseUnitId: 'm3_s' },
  { id: 'force', name: 'Force', baseUnitId: 'N' },
  { id: 'frequency', name: 'Frequency', baseUnitId: 'Hz' },
  { id: 'fuel_efficiency', name: 'Fuel Efficiency', baseUnitId: 'L_100km' },
  { id: 'illuminance', name: 'Illuminance', baseUnitId: 'lx' },
  { id: 'inductance', name: 'Inductance', baseUnitId: 'H' },
  { id: 'length', name: 'Length', baseUnitId: 'm' },
  { id: 'luminance', name: 'Luminance/Illuminance', baseUnitId: 'cd_m2' },
  { id: 'luminous_flux', name: 'Luminous Flux', baseUnitId: 'lm' },
  { id: 'luminous_intensity', name: 'Luminous Intensity', baseUnitId: 'cd' },
  { id: 'mass', name: 'Mass', baseUnitId: 'kg' },
  { id: 'power', name: 'Power', baseUnitId: 'W' },
  { id: 'pressure', name: 'Pressure', baseUnitId: 'Pa' },
  { id: 'ratio', name: 'Ratio', baseUnitId: 'ratio' },
  { id: 'speed', name: 'Speed', baseUnitId: 'm_s' },
  { id: 'temperature', name: 'Temperature', baseUnitId: 'K' },
  { id: 'time', name: 'Time', baseUnitId: 's' },
  { id: 'torque', name: 'Torque', baseUnitId: 'N_m' },
  { id: 'volume', name: 'Volume', baseUnitId: 'm3', description: 'Cubic meter' },
];

export const units: UnitDef[] = [
  // Acceleration (base: m/s²)
  { id: 'm_s2', categoryId: 'acceleration', name: 'Meter per second squared', symbol: 'm/s²', factor: 1 },
  { id: 'g0', categoryId: 'acceleration', name: 'Standard gravity', symbol: 'g', factor: 9.80665 },

  // Angle (base: rad)
  { id: 'deg', categoryId: 'angle', name: 'Degree', symbol: '°', factor: Math.PI / 180 },
  { id: 'grad', categoryId: 'angle', name: 'Gradian', symbol: 'gon', factor: Math.PI / 200 },
  { id: 'rad', categoryId: 'angle', name: 'Radian', symbol: 'rad', factor: 1 },
  { id: 'rev', categoryId: 'angle', name: 'Revolution', symbol: 'rev', factor: 2 * Math.PI },

  // Area (base: m²)
  { id: 'acre', categoryId: 'area', name: 'Acre', symbol: 'acre', factor: 4046.8564224 },
  { id: 'hectare', categoryId: 'area', name: 'Hectare', symbol: 'ha', factor: 10_000 },
  { id: 'cm2', categoryId: 'area', name: 'Square centimeter', symbol: 'cm²', factor: 0.0001 },
  { id: 'ft2', categoryId: 'area', name: 'Square foot', symbol: 'ft²', factor: 0.09290304 },
  { id: 'in2', categoryId: 'area', name: 'Square inch', symbol: 'in²', factor: 0.00064516 },
  { id: 'km2', categoryId: 'area', name: 'Square kilometer', symbol: 'km²', factor: 1_000_000 },
  { id: 'm2', categoryId: 'area', name: 'Square meter', symbol: 'm²', factor: 1 },
  { id: 'mm2', categoryId: 'area', name: 'Square millimeter', symbol: 'mm²', factor: 0.000001 },
  { id: 'yd2', categoryId: 'area', name: 'Square yard', symbol: 'yd²', factor: 0.83612736 },

  // Capacitance (base: F)
  { id: 'F', categoryId: 'capacitance', name: 'Farad', symbol: 'F', factor: 1 },

  // Conductance (base: S)
  { id: 'S', categoryId: 'conductance', name: 'Siemens', symbol: 'S', factor: 1 },

  // Data (base: byte)
  { id: 'bit', categoryId: 'data', name: 'Bit', symbol: 'b', factor: 1 / 8 },
  { id: 'byte', categoryId: 'data', name: 'Byte', symbol: 'B', factor: 1 },
  { id: 'GB', categoryId: 'data', name: 'Gigabyte (SI)', symbol: 'GB', factor: 1000 ** 3 },
  { id: 'GiB', categoryId: 'data', name: 'Gibibyte (binary)', symbol: 'GiB', factor: 1024 ** 3 },
  { id: 'KiB', categoryId: 'data', name: 'Kibibyte (binary)', symbol: 'KiB', factor: 1024 },
  { id: 'KB', categoryId: 'data', name: 'Kilobyte (SI)', symbol: 'kB', factor: 1000 },
  { id: 'MB', categoryId: 'data', name: 'Megabyte (SI)', symbol: 'MB', factor: 1000 ** 2 },
  { id: 'MiB', categoryId: 'data', name: 'Mebibyte (binary)', symbol: 'MiB', factor: 1024 ** 2 },

  // Density (base: kg/m³)
  { id: 'g_cm3', categoryId: 'density', name: 'Gram per cubic centimeter', symbol: 'g/cm³', factor: 1000 },
  { id: 'kg_m3', categoryId: 'density', name: 'Kilogram per cubic meter', symbol: 'kg/m³', factor: 1 },
  { id: 'lb_ft3', categoryId: 'density', name: 'Pound per cubic foot', symbol: 'lb/ft³', factor: 16.018463 },
  { id: 'lb_in3', categoryId: 'density', name: 'Pound per cubic inch', symbol: 'lb/in³', factor: 27679.90471 },

  // Electric (base: V)
  { id: 'A', categoryId: 'electric', name: 'Ampere', symbol: 'A', factor: 1 },
  { id: 'kOhm', categoryId: 'electric', name: 'Kiloohm', symbol: 'kΩ', factor: 1000 },
  { id: 'kV', categoryId: 'electric', name: 'Kilovolt', symbol: 'kV', factor: 1000 },
  { id: 'mA', categoryId: 'electric', name: 'Milliampere', symbol: 'mA', factor: 0.001 },
  { id: 'mV', categoryId: 'electric', name: 'Millivolt', symbol: 'mV', factor: 0.001 },
  { id: 'ohm', categoryId: 'electric', name: 'Ohm', symbol: 'Ω', factor: 1 },
  { id: 'V', categoryId: 'electric', name: 'Volt', symbol: 'V', factor: 1 },

  // Electric Charge (base: C)
  { id: 'C', categoryId: 'charge', name: 'Coulomb', symbol: 'C', factor: 1 },

  // Energy (base: J)
  { id: 'BTU', categoryId: 'energy', name: 'British thermal unit', symbol: 'BTU', factor: 1055.06 },
  { id: 'cal', categoryId: 'energy', name: 'Calorie', symbol: 'cal', factor: 4.184 },
  { id: 'J', categoryId: 'energy', name: 'Joule', symbol: 'J', factor: 1 },
  { id: 'kcal', categoryId: 'energy', name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
  { id: 'kJ', categoryId: 'energy', name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
  { id: 'kWh', categoryId: 'energy', name: 'Kilowatt-hour', symbol: 'kWh', factor: 3600 * 1000 },
  { id: 'Wh', categoryId: 'energy', name: 'Watt-hour', symbol: 'Wh', factor: 3600 },

  // Flow (base: m³/s)
  { id: 'cfm', categoryId: 'flow', name: 'Cubic feet per minute', symbol: 'cfm', factor: 0.028316846592 / 60 },
  { id: 'm3_s', categoryId: 'flow', name: 'Cubic meter per second', symbol: 'm³/s', factor: 1 },
  { id: 'gpm_us', categoryId: 'flow', name: 'Gallon per minute (US)', symbol: 'gpm (US)', factor: 0.003785411784 / 60 },
  { id: 'L_min', categoryId: 'flow', name: 'Liter per minute', symbol: 'L/min', factor: 0.001 / 60 },
  { id: 'L_s', categoryId: 'flow', name: 'Liter per second', symbol: 'L/s', factor: 0.001 },

  // Force (base: N)
  { id: 'dyn', categoryId: 'force', name: 'Dyne', symbol: 'dyn', factor: 1e-5 },
  { id: 'kN', categoryId: 'force', name: 'Kilonewton', symbol: 'kN', factor: 1000 },
  { id: 'N', categoryId: 'force', name: 'Newton', symbol: 'N', factor: 1 },
  { id: 'lbf', categoryId: 'force', name: 'Pound-force', symbol: 'lbf', factor: 4.4482216152605 },

  // Frequency (base: Hz)
  { id: 'GHz', categoryId: 'frequency', name: 'Gigahertz', symbol: 'GHz', factor: 1_000_000_000 },
  { id: 'Hz', categoryId: 'frequency', name: 'Hertz', symbol: 'Hz', factor: 1 },
  { id: 'kHz', categoryId: 'frequency', name: 'Kilohertz', symbol: 'kHz', factor: 1000 },
  { id: 'MHz', categoryId: 'frequency', name: 'Megahertz', symbol: 'MHz', factor: 1_000_000 },

  // Fuel Efficiency (base: L/100km)
  { id: 'gal_100mi_uk', categoryId: 'fuel_efficiency', name: 'Gallons (UK) per 100 mi', symbol: 'gal/100mi (UK)', factor: 2.824809363 },
  { id: 'gal_100mi_us', categoryId: 'fuel_efficiency', name: 'Gallons (US) per 100 mi', symbol: 'gal/100mi', factor: 2.352145833 },
  { id: 'L_100km', categoryId: 'fuel_efficiency', name: 'Liters per 100 km', symbol: 'L/100km', factor: 1 },
  { id: 'L_10km', categoryId: 'fuel_efficiency', name: 'Liters per 10 km', symbol: 'L/10km', factor: 0.1 },

  // Illuminance (base: lx)
  { id: 'lx', categoryId: 'illuminance', name: 'Lux', symbol: 'lx', factor: 1 },

  // Inductance (base: H)
  { id: 'H', categoryId: 'inductance', name: 'Henry', symbol: 'H', factor: 1 },

  // Length (base: m)
  { id: 'AU', categoryId: 'length', name: 'Astronomical unit', symbol: 'AU', factor: 1.495978707e11 },
  { id: 'cm', categoryId: 'length', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
  { id: 'ft', categoryId: 'length', name: 'Foot', symbol: 'ft', factor: 0.3048, aliases: ['feet'] },
  { id: 'in', categoryId: 'length', name: 'Inch', symbol: 'in', factor: 0.0254 },
  { id: 'km', categoryId: 'length', name: 'Kilometer', symbol: 'km', factor: 1000 },
  { id: 'ly', categoryId: 'length', name: 'Light-year', symbol: 'ly', factor: 9.4607304725808e15 },
  { id: 'm', categoryId: 'length', name: 'Meter', symbol: 'm', factor: 1 },
  { id: 'mi', categoryId: 'length', name: 'Mile', symbol: 'mi', factor: 1609.344 },
  { id: 'mm', categoryId: 'length', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
  { id: 'nmi', categoryId: 'length', name: 'Nautical mile', symbol: 'nmi', factor: 1852 },
  { id: 'pc', categoryId: 'length', name: 'Parsec', symbol: 'pc', factor: 3.0856775814913673e16 },
  { id: 'yd', categoryId: 'length', name: 'Yard', symbol: 'yd', factor: 0.9144 },

  // Luminance (base: cd/m²)
  { id: 'cd_m2', categoryId: 'luminance', name: 'Candela per square meter', symbol: 'cd/m²', factor: 1, aliases: ['nit'] },
  { id: 'ftL', categoryId: 'luminance', name: 'Foot-lambert', symbol: 'ft-L', factor: 3.4262591 },
  { id: 'nit', categoryId: 'luminance', name: 'Nit', symbol: 'nt', factor: 1 },

  // Luminous Flux (base: lm)
  { id: 'lm', categoryId: 'luminous_flux', name: 'Lumen', symbol: 'lm', factor: 1 },

  // Luminous Intensity (base: cd)
  { id: 'cd', categoryId: 'luminous_intensity', name: 'Candela', symbol: 'cd', factor: 1 },

  // Mass (base: kg)
  { id: 'ct', categoryId: 'mass', name: 'Carat', symbol: 'ct', factor: 0.0002 },
  { id: 'g', categoryId: 'mass', name: 'Gram', symbol: 'g', factor: 0.001 },
  { id: 'kg', categoryId: 'mass', name: 'Kilogram', symbol: 'kg', factor: 1 },
  { id: 't', categoryId: 'mass', name: 'Metric ton', symbol: 't', factor: 1000 },
  { id: 'mg', categoryId: 'mass', name: 'Milligram', symbol: 'mg', factor: 0.000001 },
  { id: 'oz', categoryId: 'mass', name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
  { id: 'lb', categoryId: 'mass', name: 'Pound', symbol: 'lb', factor: 0.45359237 },
  { id: 'st', categoryId: 'mass', name: 'Stone', symbol: 'st', factor: 6.35029318 },

  // Power (base: W)
  { id: 'hp', categoryId: 'power', name: 'Horsepower (mechanical)', symbol: 'hp', factor: 745.6998715822702 },
  { id: 'kW', categoryId: 'power', name: 'Kilowatt', symbol: 'kW', factor: 1000 },
  { id: 'W', categoryId: 'power', name: 'Watt', symbol: 'W', factor: 1 },

  // Pressure (base: Pa)
  { id: 'atm', categoryId: 'pressure', name: 'Atmosphere', symbol: 'atm', factor: 101325 },
  { id: 'bar', categoryId: 'pressure', name: 'Bar', symbol: 'bar', factor: 100000 },
  { id: 'kPa', categoryId: 'pressure', name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
  { id: 'mmHg', categoryId: 'pressure', name: 'Millimeter of mercury', symbol: 'mmHg', factor: 133.322 },
  { id: 'Pa', categoryId: 'pressure', name: 'Pascal', symbol: 'Pa', factor: 1 },
  { id: 'psi', categoryId: 'pressure', name: 'Pounds per square inch', symbol: 'psi', factor: 6894.757293168 },

  // Ratio (base: ratio = 1)
  { id: 'ppm', categoryId: 'ratio', name: 'Parts per million', symbol: 'ppm', factor: 0.000001 },
  { id: 'percent', categoryId: 'ratio', name: 'Percent', symbol: '%', factor: 0.01 },
  { id: 'permille', categoryId: 'ratio', name: 'Permille', symbol: '‰', factor: 0.001 },
  { id: 'ratio', categoryId: 'ratio', name: 'Ratio (1:1)', symbol: '', factor: 1 },

  // Speed (base: m/s)
  { id: 'km_h', categoryId: 'speed', name: 'Kilometer per hour', symbol: 'km/h', factor: 1000 / 3600 },
  { id: 'kn', categoryId: 'speed', name: 'Knot', symbol: 'kn', factor: 1852 / 3600 },
  { id: 'm_s', categoryId: 'speed', name: 'Meter per second', symbol: 'm/s', factor: 1 },
  { id: 'mph', categoryId: 'speed', name: 'Mile per hour', symbol: 'mph', factor: 1609.344 / 3600 },

  // Temperature (base: K)
  { id: 'degC', categoryId: 'temperature', name: 'Celsius', symbol: '°C', factor: 1, offset: 273.15 },
  { id: 'degF', categoryId: 'temperature', name: 'Fahrenheit', symbol: '°F', factor: 5 / 9, offset: 459.67 },
  { id: 'K', categoryId: 'temperature', name: 'Kelvin', symbol: 'K', factor: 1, offset: 0 },
  { id: 'R', categoryId: 'temperature', name: 'Rankine', symbol: '°R', factor: 5 / 9, offset: 0 },

  // Time (base: s)
  { id: 'day', categoryId: 'time', name: 'Day', symbol: 'd', factor: 86400 },
  { id: 'h', categoryId: 'time', name: 'Hour', symbol: 'h', factor: 3600 },
  { id: 'us', categoryId: 'time', name: 'Microsecond', symbol: 'µs', factor: 0.000001 },
  { id: 'ms', categoryId: 'time', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
  { id: 'min', categoryId: 'time', name: 'Minute', symbol: 'min', factor: 60 },
  { id: 'month', categoryId: 'time', name: 'Month (30.44 days)', symbol: 'mo', factor: 2628000 },
  { id: 's', categoryId: 'time', name: 'Second', symbol: 's', factor: 1 },
  { id: 'week', categoryId: 'time', name: 'Week', symbol: 'wk', factor: 604800 },
  { id: 'year', categoryId: 'time', name: 'Year (365 days)', symbol: 'yr', factor: 31536000 },

  // Torque (base: N·m)
  { id: 'N_m', categoryId: 'torque', name: 'Newton meter', symbol: 'N·m', factor: 1 },
  { id: 'lbf_ft', categoryId: 'torque', name: 'Pound-foot', symbol: 'lbf·ft', factor: 1.3558179483314004 },

  // Volume (base: m³)
  { id: 'cm3', categoryId: 'volume', name: 'Cubic centimeter', symbol: 'cm³', factor: 0.000001 },
  { id: 'ft3', categoryId: 'volume', name: 'Cubic foot', symbol: 'ft³', factor: 0.028316846592 },
  { id: 'in3', categoryId: 'volume', name: 'Cubic inch', symbol: 'in³', factor: 0.000016387064 },
  { id: 'm3', categoryId: 'volume', name: 'Cubic meter', symbol: 'm³', factor: 1 },
  { id: 'gal_uk', categoryId: 'volume', name: 'Gallon (UK)', symbol: 'gal (UK)', factor: 0.00454609 },
  { id: 'gal_us', categoryId: 'volume', name: 'Gallon (US)', symbol: 'gal (US)', factor: 0.003785411784 },
  { id: 'L', categoryId: 'volume', name: 'Liter', symbol: 'L', factor: 0.001 },
  { id: 'mL', categoryId: 'volume', name: 'Milliliter', symbol: 'mL', factor: 0.000001 },
  { id: 'pt_us', categoryId: 'volume', name: 'Pint (US)', symbol: 'pt (US)', factor: 0.000473176473 },
  { id: 'tbsp', categoryId: 'volume', name: 'Tablespoon', symbol: 'tbsp', factor: 0.00001478676478125 },
  { id: 'tsp', categoryId: 'volume', name: 'Teaspoon', symbol: 'tsp', factor: 0.00000492892159375 },
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

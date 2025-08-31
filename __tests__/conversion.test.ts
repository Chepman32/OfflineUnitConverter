/**
 * @format
 */
import { convert } from '../src/domain/conversion/engine';

describe('conversion engine', () => {
  it('converts meters to feet', () => {
    const out = convert('1', 'm', 'ft', { decimals: 6 });
    expect(out).toBe('3.280840');
  });
  it('converts celsius to fahrenheit via kelvin base', () => {
    // 0°C -> 32°F
    const out = convert('0', 'C', 'F', { decimals: 2 });
    expect(out).toBe('32.00');
  });
  it('converts SI vs binary data units', () => {
    const out1 = convert('1', 'MB', 'MiB', { decimals: 4 }); // 1,000,000 / 1,048,576 ≈ 0.9537
    expect(out1).toBe('0.9537');
    const out2 = convert('1024', 'KiB', 'MiB', { decimals: 2 });
    expect(out2).toBe('1.00');
  });
  it('converts density and flow correctly', () => {
    const d = convert('1', 'g_cm3', 'kg_m3', { decimals: 0, useGrouping: false });
    expect(d).toBe('1000');
    const f = convert('10', 'L_min', 'm3_s', { decimals: 4, useGrouping: false });
    expect(f).toBe('0.0002');
  });
});

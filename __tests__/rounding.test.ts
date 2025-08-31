/**
 * @format
 */
import { convert, formatDecimal } from '../src/domain/conversion/engine';

describe('rounding and formatting', () => {
  it('bankers rounding at .5 goes to even', () => {
    const a = convert('2.5', 'm', 'm', { decimals: 0, roundingMode: 'bankers', useGrouping: false });
    const b = convert('3.5', 'm', 'm', { decimals: 0, roundingMode: 'bankers', useGrouping: false });
    expect(a).toBe('2');
    expect(b).toBe('4');
  });

  it('formats large numbers in scientific when threshold reached', () => {
    const s = formatDecimal('1e15' as any, { decimals: 2, scientificThreshold: 1e12 });
    expect(s.toLowerCase()).toContain('e+');
  });
});


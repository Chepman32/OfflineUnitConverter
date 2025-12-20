/**
 * @format
 */
import { searchUnits } from '../src/domain/conversion/search';

describe('searchUnits', () => {
  it('finds units by name, symbol, alias', () => {
    const res1 = searchUnits('meter');
    expect(res1.find(r => r.id === 'm')).toBeTruthy();
    const res2 = searchUnits('°c');
    expect(res2.find(r => r.id === 'degC')).toBeTruthy();
    const res3 = searchUnits('feet');
    expect(res3.find(r => r.id === 'ft')).toBeTruthy();
  });
});


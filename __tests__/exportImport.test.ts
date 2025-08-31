/**
 * @format
 */
import { exportData, importData } from '../src/services/exportImport';

describe('export/import bundle', () => {
  it('exports and imports with version header', () => {
    const json = exportData({ settings: { foo: 'bar' } as any, favorites: [], history: [], customUnits: {} });
    const parsed = importData(json);
    expect(parsed.version).toBe(1);
    expect(typeof parsed.exportedAt).toBe('number');
    expect(parsed.settings).toBeTruthy();
  });

  it('rejects invalid format', () => {
    const bad = JSON.stringify({ version: 2 });
    expect(() => importData(bad)).toThrow();
  });
});


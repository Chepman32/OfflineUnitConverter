// Export/Import user data as JSON. Uses zod if available, otherwise minimal checks.

export interface ExportBundle {
  version: 1;
  exportedAt: number;
  settings?: unknown;
  favorites?: unknown;
  history?: unknown;
  customUnits?: unknown;
}

export function exportData(data: Omit<ExportBundle, 'version' | 'exportedAt'>): string {
  const bundle: ExportBundle = {
    version: 1,
    exportedAt: Date.now(),
    ...data,
  } as ExportBundle;
  return JSON.stringify(bundle, null, 2);
}

export function importData(json: string): ExportBundle {
  const obj = JSON.parse(json);
  // Try validate with zod if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const zod = require('zod') as typeof import('zod');
    const Bundle = zod.object({
      version: zod.literal(1),
      exportedAt: zod.number(),
      settings: zod.unknown().optional(),
      favorites: zod.unknown().optional(),
      history: zod.unknown().optional(),
      customUnits: zod.unknown().optional(),
    });
    return Bundle.parse(obj);
  } catch {
    if (obj && obj.version === 1 && typeof obj.exportedAt === 'number') return obj as ExportBundle;
    throw new Error('Invalid import format');
  }
}


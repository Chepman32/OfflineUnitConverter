// MMKV wrapper placeholder. Wire to react-native-mmkv in app init.
// This module isolates persistence so we can swap implementations if needed.

export interface KV {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
}

let store: Record<string, string> = {};

export const MemoryKV: KV = {
  getString: (k: string) => store[k],
  set: (k: string, v: string) => {
    store[k] = v;
  },
  delete: (k: string) => {
    delete store[k];
  },
};

function createMMKVOrMemory(): KV {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv');
    const mmkv = new MMKV();
    return {
      getString: (key) => mmkv.getString(key) ?? undefined,
      set: (key, value) => mmkv.set(key, value),
      delete: (key) => mmkv.delete(key),
    };
  } catch {
    return MemoryKV;
  }
}

export const kv: KV = createMMKVOrMemory();

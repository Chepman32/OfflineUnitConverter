// Entitlements persistence: MMKV for fast reads, Keychain for durability across reinstalls.
import { kv } from '../store/storage/mmkv';

const KEY_PRO = 'iap.entitlements.pro';

type KeychainModule = typeof import('react-native-keychain');

function getKeychain(): KeychainModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-keychain');
  } catch {
    return null;
  }
}

export function getProCached(): boolean {
  const v = kv.getString(KEY_PRO);
  if (v == null) return false;
  try { return JSON.parse(v) === true; } catch { return v === 'true'; }
}

export async function hydrateProFromKeychain(): Promise<boolean> {
  const Keychain = getKeychain();
  if (!Keychain) return getProCached();
  try {
    const res = await Keychain.getGenericPassword({ service: KEY_PRO });
    if (res && res.password) {
      const val = res.password === 'true' || res.password === '1';
      kv.set(KEY_PRO, JSON.stringify(val));
      return val;
    }
  } catch {}
  return getProCached();
}

export async function setProEntitlement(enabled: boolean) {
  kv.set(KEY_PRO, JSON.stringify(enabled));
  const Keychain = getKeychain();
  if (!Keychain) return;
  try {
    await Keychain.setGenericPassword('pro', enabled ? 'true' : 'false', { service: KEY_PRO });
  } catch {}
}


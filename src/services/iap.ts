// IAP service with safe fallbacks for offline / dev without react-native-iap installed.

export type ProductId = 'offlineunit_pro' | 'tip_small' | 'tip_medium' | 'tip_large';

export interface PurchaseResult { productId: ProductId; transactionDate: number; transactionId: string; }

function getIap() {
  try {
    // Allow forcing mock via env for dev
    // @ts-ignore
    if (typeof process !== 'undefined' && process?.env?.IAP_MOCK === '1') return null;
  } catch {}
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-iap');
  } catch {
    return null;
  }
}

export async function getProducts(ids: ProductId[]): Promise<{ productId: ProductId; price: string }[]> {
  const iap = getIap();
  if (!iap) return ids.map(id => ({ productId: id, price: '$0.00' }));
  const products = await iap.getProducts({ skus: ids });
  return products.map((p: any) => ({ productId: p.productId, price: p.localizedPrice }));
}

export async function requestPurchase(id: ProductId): Promise<PurchaseResult> {
  const iap = getIap();
  if (!iap) return { productId: id, transactionDate: Date.now(), transactionId: `dev-${Date.now()}` };
  const res = await iap.requestPurchase({ skus: [id] });
  const first = Array.isArray(res) ? res[0] : res;
  return { productId: id, transactionDate: Number(first.transactionDate) || Date.now(), transactionId: first.transactionId };
}

export async function restorePurchases(): Promise<PurchaseResult[]> {
  const iap = getIap();
  if (!iap) return [];
  const res = await iap.getAvailablePurchases();
  return res.map((r: any) => ({ productId: r.productId, transactionDate: Number(r.transactionDate) || Date.now(), transactionId: r.transactionId }));
}

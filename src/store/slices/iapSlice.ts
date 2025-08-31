import type { StateCreator } from 'zustand';
import { getProCached, setProEntitlement } from '../../services/entitlements';

export interface IAPState {
  pro: boolean;
  setPro: (v: boolean) => void;
}

export const createIAPSlice: StateCreator<IAPState, [], [], IAPState> = (set) => ({
  pro: getProCached(),
  setPro: (v) => { set({ pro: v }); setProEntitlement(v).catch(() => {}); },
});

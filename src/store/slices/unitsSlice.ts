import type { StateCreator } from 'zustand';
import type { CustomUnit } from '../../domain/conversion/types';

const FREE_CUSTOM_CAP = 10;

export interface UnitsState {
  customUnits: Record<string, CustomUnit[]>; // key: categoryId
  recentsUnits: string[]; // unit ids
  recentsCategories: string[]; // category ids
  addCustomUnit: (u: CustomUnit) => void;
  removeCustomUnit: (categoryId: string, id: string) => void;
  addRecentUnit: (unitId: string) => void;
  addRecentCategory: (categoryId: string) => void;
}

export const createUnitsSlice: StateCreator<UnitsState, [], [], UnitsState> = (set) => ({
  customUnits: {},
  recentsUnits: [],
  recentsCategories: [],
  addCustomUnit: (u) => set((state) => {
    const arr = state.customUnits[u.categoryId] ?? [];
    const isPro = (state as any).pro as boolean;
    if (!isPro && arr.length >= FREE_CUSTOM_CAP) return {} as any;
    return { customUnits: { ...state.customUnits, [u.categoryId]: [...arr, u] } };
  }),
  removeCustomUnit: (categoryId, id) => set((state) => {
    const arr = state.customUnits[categoryId] ?? [];
    return { customUnits: { ...state.customUnits, [categoryId]: arr.filter(u => u.id !== id) } };
  }),
  addRecentUnit: (unitId) => set((state) => {
    const list = [unitId, ...state.recentsUnits.filter(u => u !== unitId)];
    return { recentsUnits: list.slice(0, 12) };
  }),
  addRecentCategory: (categoryId) => set((state) => {
    const list = [categoryId, ...state.recentsCategories.filter(c => c !== categoryId)];
    return { recentsCategories: list.slice(0, 8) };
  }),
});

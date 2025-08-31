import type { StateCreator } from 'zustand';
import type { HistoryItem } from '../../domain/conversion/types';

const FREE_CAP = 500; // can expand when Pro entitlement is true

export interface HistoryState {
  history: HistoryItem[];
  addHistory: (h: HistoryItem, isPro: boolean) => void;
  clearHistory: () => void;
}

export const createHistorySlice: StateCreator<HistoryState, [], [], HistoryState> = (set) => ({
  history: [],
  addHistory: (h, isPro) => set((state) => {
    const list = [h, ...state.history];
    return { history: isPro ? list : list.slice(0, FREE_CAP) };
  }),
  clearHistory: () => set({ history: [] }),
});


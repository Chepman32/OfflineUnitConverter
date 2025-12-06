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
    const last = state.history[0];
    const isDuplicate =
      last &&
      last.inputValue === h.inputValue &&
      last.fromUnitId === h.fromUnitId &&
      last.toUnitId === h.toUnitId &&
      last.resultValue === h.resultValue;

    if (isDuplicate) {
      // Refresh timestamp for the most recent identical entry instead of adding a new row
      const next = [{ ...last, createdAt: h.createdAt }, ...state.history.slice(1)];
      return { history: next };
    }

    const list = [h, ...state.history];
    return { history: isPro ? list : list.slice(0, FREE_CAP) };
  }),
  clearHistory: () => set({ history: [] }),
});

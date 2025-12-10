import type { StateCreator } from 'zustand';
import type { HistoryItem } from '../../domain/conversion/types';

export interface HistoryState {
  history: HistoryItem[];
  addHistory: (h: HistoryItem) => void;
  clearHistory: () => void;
}

export const createHistorySlice: StateCreator<HistoryState, [], [], HistoryState> = (set) => ({
  history: [],
  addHistory: (h) => set((state) => {
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

    return { history: [h, ...state.history] };
  }),
  clearHistory: () => set({ history: [] }),
});

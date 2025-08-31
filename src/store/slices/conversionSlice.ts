import type { StateCreator } from 'zustand';
import type { CategoryId } from '../../domain/conversion/types';
import { convert } from '../../domain/conversion/engine';

export interface ConversionState {
  categoryId: CategoryId;
  fromUnitId: string;
  toUnitId: string;
  input: string;
  result: string;
  setCategory: (id: CategoryId) => void;
  setFrom: (unitId: string) => void;
  setTo: (unitId: string) => void;
  swap: () => void;
  setInput: (value: string) => void;
  setPair: (fromUnitId: string, toUnitId: string) => void;
}

export const createConversionSlice: StateCreator<ConversionState, [], [], ConversionState> = (set, get) => ({
  categoryId: 'length',
  fromUnitId: 'm',
  toUnitId: 'ft',
  input: '1',
  result: convert('1', 'm', 'ft'),
  setCategory: (id) => set({ categoryId: id }),
  setFrom: (unitId) => set((state) => {
    let res = state.result;
    try { res = convert(state.input, unitId, state.toUnitId); } catch {}
    return { fromUnitId: unitId, result: res } as any;
  }),
  setTo: (unitId) => set((state) => {
    let res = state.result;
    try { res = convert(state.input, state.fromUnitId, unitId); } catch {}
    return { toUnitId: unitId, result: res } as any;
  }),
  swap: () => {
    const { fromUnitId, toUnitId, input } = get();
    set({ fromUnitId: toUnitId, toUnitId: fromUnitId, result: convert(input, toUnitId, fromUnitId) });
  },
  setInput: (value: string) => set({ input: value, result: convert(value, get().fromUnitId, get().toUnitId) }),
  setPair: (fromUnitId: string, toUnitId: string) => set((state) => ({
    fromUnitId,
    toUnitId,
    result: convert(state.input, fromUnitId, toUnitId),
  })),
});

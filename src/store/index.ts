import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { kv } from './storage/mmkv';
import type { ConversionState } from './slices/conversionSlice';
import { createConversionSlice } from './slices/conversionSlice';
import type { SettingsState } from './slices/settingsSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import type { UnitsState } from './slices/unitsSlice';
import { createUnitsSlice } from './slices/unitsSlice';
import type { FavoritesState } from './slices/favoritesSlice';
import { createFavoritesSlice } from './slices/favoritesSlice';
import type { HistoryState } from './slices/historySlice';
import { createHistorySlice } from './slices/historySlice';

export type AppState = ConversionState & SettingsState & UnitsState & FavoritesState & HistoryState;

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createConversionSlice(...a),
        ...createSettingsSlice(...a),
        ...createUnitsSlice(...a),
        ...createFavoritesSlice(...a),
        ...createHistorySlice(...a),
      })),
      {
        name: 'ouc_store',
        storage: createJSONStorage(() => ({
          getItem: (name: string) => kv.getString(name) ?? null,
          setItem: (name: string, value: string) => kv.set(name, value),
          removeItem: (name: string) => kv.delete(name),
        })),
        partialize: (state: AppState) => ({
          // Persist user data + settings; skip ephemeral results
          theme: state.theme,
          roundingMode: state.roundingMode,
          decimalsGlobal: state.decimalsGlobal,
          reduceMotion: state.reduceMotion,
          haptics: state.haptics,
          formatting: state.formatting,
          copyMode: state.copyMode,
          language: state.language,
          onboardingSeen: state.onboardingSeen,
          customUnits: state.customUnits,
          favorites: state.favorites,
          history: state.history,
        }),
      }
    ),
    { name: 'Metryvo' }
  )
);

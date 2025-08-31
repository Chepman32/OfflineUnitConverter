import type { StateCreator } from 'zustand';
import type { FormatOptions, RoundingMode } from '../../domain/conversion/types';
import { setLanguage as i18nSetLanguage } from '../../i18n';

export type ThemeMode = 'system' | 'light' | 'dark' | 'oled';

export interface SettingsState {
  theme: ThemeMode;
  roundingMode: RoundingMode;
  decimalsGlobal: number;
  reduceMotion: boolean;
  haptics: boolean;
  formatting: Pick<FormatOptions, 'useGrouping' | 'locale' | 'scientificThreshold'>;
  copyMode: 'value' | 'value_unit' | 'expression';
  language?: string;
  onboardingSeen: boolean;
  setTheme: (t: ThemeMode) => void;
  setRoundingMode: (m: RoundingMode) => void;
  setDecimals: (n: number) => void;
  setReduceMotion: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  setUseGrouping: (v: boolean) => void;
  setLocale: (locale?: string) => void;
  setScientificThreshold: (n: number) => void;
  setCopyMode: (m: 'value' | 'value_unit' | 'expression') => void;
  setLanguage: (lng?: string) => void;
  setOnboardingSeen: (v: boolean) => void;
}

export const createSettingsSlice: StateCreator<SettingsState, [], [], SettingsState> = (set) => ({
  theme: 'system',
  roundingMode: 'halfUp',
  decimalsGlobal: 6,
  reduceMotion: false,
  haptics: true,
  formatting: { useGrouping: true, locale: undefined, scientificThreshold: 1e12 },
  copyMode: 'value',
  language: 'en',
  onboardingSeen: false,
  setTheme: (t) => set({ theme: t }),
  setRoundingMode: (m) => set({ roundingMode: m }),
  setDecimals: (n) => set({ decimalsGlobal: Math.max(0, Math.min(12, n)) }),
  setReduceMotion: (v) => set({ reduceMotion: v }),
  setHaptics: (v) => set({ haptics: v }),
  setUseGrouping: (v) => set((s) => ({ formatting: { ...s.formatting, useGrouping: v } })),
  setLocale: (locale) => set((s) => ({ formatting: { ...s.formatting, locale } })),
  setScientificThreshold: (n) => set((s) => ({ formatting: { ...s.formatting, scientificThreshold: n } })),
  setCopyMode: (m) => set({ copyMode: m }),
  setLanguage: (lng) => { i18nSetLanguage(lng); set({ language: lng }); },
  setOnboardingSeen: (v) => set({ onboardingSeen: v }),
});

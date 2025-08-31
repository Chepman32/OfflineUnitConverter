import { useAppStore } from './index';
import { exportData, importData } from '../services/exportImport';

export function exportAll(): string {
  const state = useAppStore.getState();
  return exportData({
    settings: {
      theme: state.theme,
      roundingMode: state.roundingMode,
      decimalsGlobal: state.decimalsGlobal,
      reduceMotion: state.reduceMotion,
      haptics: state.haptics,
      formatting: state.formatting,
      copyMode: state.copyMode,
      language: state.language,
    },
    favorites: state.favorites,
    history: state.history,
    customUnits: state.customUnits,
  });
}

export function importAll(json: string) {
  const bundle = importData(json);
  const set = useAppStore.setState;
  set((s) => {
    // settings
    const settings: any = bundle.settings || {};
    if (settings.theme) (s as any).theme = settings.theme;
    if (settings.roundingMode) (s as any).roundingMode = settings.roundingMode;
    if (typeof settings.decimalsGlobal === 'number') (s as any).decimalsGlobal = settings.decimalsGlobal;
    if (typeof settings.reduceMotion === 'boolean') (s as any).reduceMotion = settings.reduceMotion;
    if (typeof settings.haptics === 'boolean') (s as any).haptics = settings.haptics;
    if (settings.formatting) (s as any).formatting = settings.formatting;
    if (settings.copyMode) (s as any).copyMode = settings.copyMode;
    if (settings.language) (s as any).language = settings.language;
    // data
    if (Array.isArray(bundle.favorites)) (s as any).favorites = bundle.favorites as any;
    if (Array.isArray(bundle.history)) (s as any).history = bundle.history as any;
    if (bundle.customUnits && typeof bundle.customUnits === 'object') (s as any).customUnits = bundle.customUnits as any;
  });
}

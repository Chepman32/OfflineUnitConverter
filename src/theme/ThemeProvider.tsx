import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import type { ThemeTokens } from './tokens';
import { light, dark, oled } from './tokens';

const ThemeCtx = createContext<ThemeTokens>(light);
export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ mode, children }: { mode?: 'system'|'light'|'dark'|'oled'; children: React.ReactNode }) {
  const system = useColorScheme();
  const effective = mode === 'system' || !mode ? (system ?? 'light') : mode;
  const tokens = useMemo(() => (effective === 'dark' ? dark : effective === 'oled' ? oled : light), [effective]);
  return <ThemeCtx.Provider value={tokens}>{children}</ThemeCtx.Provider>;
}


import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import type { ThemeTokens } from './tokens';
import { light, dark, solar, mono } from './tokens';

const ThemeCtx = createContext<ThemeTokens>(light);
export const useTheme = () => useContext(ThemeCtx);

const themeMap: Record<string, ThemeTokens> = {
  light,
  dark,
  solar,
  mono,
};

export function ThemeProvider({
  mode,
  children,
}: {
  mode?: 'system' | 'light' | 'dark' | 'solar' | 'mono';
  children: React.ReactNode;
}) {
  const system = useColorScheme();
  const effective = mode === 'system' || !mode ? system ?? 'light' : mode;
  const tokens = useMemo(() => themeMap[effective] ?? light, [effective]);
  return <ThemeCtx.Provider value={tokens}>{children}</ThemeCtx.Provider>;
}

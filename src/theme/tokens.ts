export type ThemeMode = 'light' | 'dark' | 'oled';

export interface ThemeTokens {
  surface: string;
  surfaceElevated: string;
  onSurface: string;
  accent: string;
}

export const light: ThemeTokens = {
  surface: '#FFFFFF',
  surfaceElevated: '#F6F7FA',
  onSurface: '#1C1C1E',
  accent: '#4F9EF8',
};

export const dark: ThemeTokens = {
  surface: '#0E0F12',
  surfaceElevated: '#16181C',
  onSurface: '#EDEDED',
  accent: '#4F9EF8',
};

export const oled: ThemeTokens = {
  surface: '#000000',
  surfaceElevated: '#0A0A0A',
  onSurface: '#F6F6F6',
  accent: '#4F9EF8',
};


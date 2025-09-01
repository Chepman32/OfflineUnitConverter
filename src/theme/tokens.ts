export type ThemeMode = 'light' | 'dark' | 'oled';

export interface ThemeTokens {
  surface: string;
  surfaceElevated: string;
  onSurface: string;
  onSurfaceSecondary: string;
  onSurfaceMuted: string;
  accent: string;
  border: string;
  inputBackground: string;
  inputBorder: string;
}

export const light: ThemeTokens = {
  surface: '#FFFFFF',
  surfaceElevated: '#F6F7FA',
  onSurface: '#1C1C1E',
  onSurfaceSecondary: '#666666',
  onSurfaceMuted: '#888888',
  accent: '#4F9EF8',
  border: '#E5E5E7',
  inputBackground: '#FFFFFF',
  inputBorder: '#DDDDDD',
};

export const dark: ThemeTokens = {
  surface: '#0E0F12',
  surfaceElevated: '#16181C',
  onSurface: '#EDEDED',
  onSurfaceSecondary: '#BBBBBB',
  onSurfaceMuted: '#999999',
  accent: '#4F9EF8',
  border: '#2A2D32',
  inputBackground: '#16181C',
  inputBorder: '#3A3D42',
};

export const oled: ThemeTokens = {
  surface: '#000000',
  surfaceElevated: '#0A0A0A',
  onSurface: '#F6F6F6',
  onSurfaceSecondary: '#CCCCCC',
  onSurfaceMuted: '#AAAAAA',
  accent: '#4F9EF8',
  border: '#1A1A1A',
  inputBackground: '#0A0A0A',
  inputBorder: '#2A2A2A',
};


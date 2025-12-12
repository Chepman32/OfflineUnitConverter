export type ThemeMode = 'light' | 'dark' | 'solar' | 'mono';

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
  surface: '#000000',
  surfaceElevated: '#000000',
  onSurface: '#FFFFFF',
  onSurfaceSecondary: '#A0A0A0',
  onSurfaceMuted: '#707070',
  accent: '#4F9EF8',
  border: '#222222',
  inputBackground: '#000000',
  inputBorder: '#333333',
};

export const solar: ThemeTokens = {
  surface: '#FFF9E6',
  surfaceElevated: '#FFF3CC',
  onSurface: '#5C4813',
  onSurfaceSecondary: '#8B7355',
  onSurfaceMuted: '#A89070',
  accent: '#E6A817',
  border: '#E8DFC0',
  inputBackground: '#FFFDF5',
  inputBorder: '#D4C9A8',
};

export const mono: ThemeTokens = {
  surface: '#D8D8D8',
  surfaceElevated: '#C8C8C8',
  onSurface: '#1A1A1A',
  onSurfaceSecondary: '#4A4A4A',
  onSurfaceMuted: '#6A6A6A',
  accent: '#505050',
  border: '#A0A0A0',
  inputBackground: '#E5E5E5',
  inputBorder: '#909090',
};

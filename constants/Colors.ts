// Theme palettes — dark is the original NestIQ look, light is its counterpart.
// Brand colors (primary / error / warning) stay constant across themes.

const brand = {
  primary: '#3B6FF0',
  primaryDark: '#2952C8',
  error: '#E24B4A',
  warning: '#EF9F27',
} as const;

export type Palette = {
  primary: string;
  primaryDark: string;
  error: string;
  warning: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
};

const dark: Palette = {
  ...brand,
  background: '#0A0A0A',
  surface: '#1A1A1A',
  surfaceAlt: '#242424',
  border: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#8A8A8A',
  textMuted: '#555555',
};

const light: Palette = {
  ...brand,
  background: '#F4F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF0F5',
  border: '#E2E6EC',
  text: '#11141C',
  textSecondary: '#6E7480',
  textMuted: '#A6ABB5',
};

export const Colors: Record<Scheme, Palette> = { light, dark };

export type Scheme = 'light' | 'dark';
export type ColorKey = keyof Palette;

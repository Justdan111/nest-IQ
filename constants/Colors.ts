// Theme palettes — dark is the original NestIQ look, light is its counterpart.
// Brand colors (primary / error / warning) stay constant across themes.

const brand = {
  primary: '#3B6FF0',
  primaryDark: '#2952C8',
  error: '#E24B4A',
  warning: '#EF9F27',
} as const;

const dark = {
  ...brand,
  background: '#0A0A0A',
  surface: '#1A1A1A',
  surfaceAlt: '#242424',
  border: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#8A8A8A',
  textMuted: '#555555',
} as const;

const light = {
  ...brand,
  background: '#F4F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF0F5',
  border: '#E2E6EC',
  text: '#11141C',
  textSecondary: '#6E7480',
  textMuted: '#A6ABB5',
} as const;

export const Colors = { light, dark } as const;

export type Scheme = keyof typeof Colors;
export type Palette = typeof dark;
export type ColorKey = keyof Palette;

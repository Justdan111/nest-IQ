export const Colors = {
  primary: '#3B6FF0',
  primaryDark: '#2952C8',
  background: '#0A0A0A',
  surface: '#1A1A1A',
  surfaceAlt: '#242424',
  border: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A8A8A',
  textMuted: '#555555',
  success: '#3B6FF0',
  error: '#E24B4A',
  warning: '#EF9F27',
} as const;

export type ColorKey = keyof typeof Colors;

import { useColorScheme } from 'nativewind';
import { Colors, type Palette, type Scheme } from '@/constants/Colors';

type ThemeValue = {
  /** Resolved scheme — never undefined (falls back to 'dark'). */
  scheme: Scheme;
  isDark: boolean;
  /** Active color palette for use in JS (icon colors, charts, native props). */
  colors: Palette;
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
  toggleColorScheme: () => void;
};

/**
 * App theme hook. Wraps NativeWind's color scheme so screens get a fully
 * resolved palette plus toggle helpers. NativeWind keeps the `dark` class /
 * CSS variables in sync for className-based styling automatically.
 */
export function useTheme(): ThemeValue {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  const scheme: Scheme = colorScheme === 'light' ? 'light' : 'dark';

  return {
    scheme,
    isDark: scheme === 'dark',
    colors: Colors[scheme],
    setColorScheme,
    toggleColorScheme,
  };
}

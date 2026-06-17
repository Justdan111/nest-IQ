import { Platform, Vibration } from 'react-native';

type Style = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

// Try to load expo-haptics dynamically so we get real haptic feedback when
// it's installed and gracefully fall back to RN's Vibration API otherwise.
// Adding expo-haptics: `npx expo install expo-haptics` (no other code change
// is required — every call site goes through this util).
type ExpoHapticsModule = {
  impactAsync: (style: number) => Promise<void>;
  notificationAsync: (type: number) => Promise<void>;
  selectionAsync: () => Promise<void>;
  ImpactFeedbackStyle: { Light: number; Medium: number; Heavy: number };
  NotificationFeedbackType: { Success: number; Warning: number; Error: number };
};

let mod: ExpoHapticsModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  mod = require('expo-haptics') as ExpoHapticsModule;
} catch {
  mod = null;
}

/**
 * Fire a haptic pulse. Safe to call on any platform; web is a no-op, and
 * physical-feedback-less environments (simulators, low-end Androids) degrade
 * to a short vibration.
 */
export function haptic(style: Style = 'light') {
  if (Platform.OS === 'web') return;

  if (mod) {
    try {
      if (style === 'selection') {
        mod.selectionAsync();
        return;
      }
      if (style === 'success' || style === 'warning' || style === 'error') {
        const map = {
          success: mod.NotificationFeedbackType.Success,
          warning: mod.NotificationFeedbackType.Warning,
          error: mod.NotificationFeedbackType.Error,
        } as const;
        mod.notificationAsync(map[style]);
        return;
      }
      const impactMap = {
        light: mod.ImpactFeedbackStyle.Light,
        medium: mod.ImpactFeedbackStyle.Medium,
        heavy: mod.ImpactFeedbackStyle.Heavy,
      } as const;
      mod.impactAsync(impactMap[style]);
      return;
    } catch {
      // fall through to Vibration
    }
  }

  // Vibration fallback — duration loosely matches the haptic style.
  const ms = style === 'heavy' || style === 'error' ? 25 : style === 'medium' || style === 'warning' ? 18 : 10;
  Vibration.vibrate(ms);
}

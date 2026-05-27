import type { Device } from '@/types';

/**
 * Map a device to the screen that should open when its card is tapped.
 * Returns `null` for types that don't yet have a dedicated control screen
 * (caller should skip wiring `onPress` in that case so the card stays a
 * simple toggle).
 */
export function controlRouteForDevice(device: Device): string | null {
  switch (device.type) {
    case 'ac':
      return '/devices/control/ac';
    case 'light':
      return '/devices/control/light';
    default:
      return null;
  }
}

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { Scene } from '@/types';

// Foreground delivery: show the banner + play sound even when the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ANDROID_CHANNEL = 'scenes';

let ensureAndroidChannelPromise: Promise<void> | null = null;
function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return Promise.resolve();
  if (!ensureAndroidChannelPromise) {
    ensureAndroidChannelPromise = Notifications.setNotificationChannelAsync(
      ANDROID_CHANNEL,
      {
        name: 'Scene schedules',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
      },
    ).then(() => undefined);
  }
  return ensureAndroidChannelPromise;
}

/** Request notification permission. Safe to call repeatedly. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const res = await Notifications.requestPermissionsAsync();
  return res.granted;
}

/** Cancel one or more previously-scheduled notification ids. Best-effort. */
export async function cancelSceneNotifications(ids?: string[]): Promise<void> {
  if (!ids?.length) return;
  await Promise.all(
    ids.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined),
    ),
  );
}

/**
 * Schedule a scene. Returns the new notification ids; the caller is
 * responsible for storing them on the scene so they can later be cancelled.
 * No-op if the scene has no trigger or no permission was granted.
 */
export async function scheduleScene(scene: Scene): Promise<string[]> {
  if (!scene.trigger) return [];
  const ok = await ensureNotificationPermission();
  if (!ok) return [];
  await ensureAndroidChannel();

  const { hour, minute, weekdays } = scene.trigger;
  const body = `${scene.name} is running.`;

  if (weekdays.length === 0) {
    // One-off: schedule the next occurrence today, otherwise tomorrow.
    const now = new Date();
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: scene.name,
        body,
        data: { sceneId: scene.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: next,
        channelId: ANDROID_CHANNEL,
      },
    });
    return [id];
  }

  // Recurring: one weekly trigger per selected weekday. expo-notifications uses
  // 1=Sunday..7=Saturday whereas JS Date uses 0=Sunday..6=Saturday — convert.
  const ids = await Promise.all(
    weekdays.map((d) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: scene.name,
          body,
          data: { sceneId: scene.id, weekday: d },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: d + 1,
          hour,
          minute,
          channelId: ANDROID_CHANNEL,
        },
      }),
    ),
  );
  return ids;
}

/** Wipe every scheduled notification. Used on app startup to start clean. */
export async function cancelAllSceneNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

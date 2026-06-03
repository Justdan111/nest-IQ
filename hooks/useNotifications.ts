import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as Notifications from 'expo-notifications';
import type { AppNotification } from '@/types';

type NewNotification = Omit<AppNotification, 'id' | 'receivedAt' | 'read'> & {
  id?: string;
  receivedAt?: number;
  read?: boolean;
};

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: NewNotification) => AppNotification;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

// Two onboarding-style entries so the screen renders something on first launch
// before any scene has fired.
const SEED: AppNotification[] = [
  {
    id: 'n-seed-2',
    title: 'Welcome to NestIQ',
    message: 'Your smart home is ready. Add devices to get started.',
    receivedAt: Date.now() - 2 * 60 * 60 * 1000,
    read: false,
    icon: 'home',
  },
  {
    id: 'n-seed-1',
    title: 'Scenes scheduled',
    message: 'Your default scenes will fire at their scheduled times.',
    receivedAt: Date.now() - 30 * 60 * 1000,
    read: false,
    icon: 'flash',
  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED);

  const addNotification = useCallback((n: NewNotification) => {
    const created: AppNotification = {
      id: n.id ?? `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: n.title,
      message: n.message,
      receivedAt: n.receivedAt ?? Date.now(),
      read: n.read ?? false,
      sceneId: n.sceneId,
      icon: n.icon,
    };
    setNotifications((prev) => [created, ...prev]);
    return created;
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Bridge: every notification expo-notifications delivers (foreground or
  // background tap) gets added to the in-app inbox. The scheduler attaches
  // `data.sceneId` so we can recover the source scene later.
  useEffect(() => {
    const received = Notifications.addNotificationReceivedListener((event) => {
      const c = event.request.content;
      const data = (c.data ?? {}) as { sceneId?: string };
      addNotification({
        title: c.title ?? 'Notification',
        message: c.body ?? '',
        sceneId: data.sceneId,
        icon: data.sceneId ? 'flash' : 'notifications',
      });
    });
    const responded = Notifications.addNotificationResponseReceivedListener(
      (event) => {
        const c = event.notification.request.content;
        const data = (c.data ?? {}) as { sceneId?: string };
        addNotification({
          title: c.title ?? 'Notification',
          message: c.body ?? '',
          sceneId: data.sceneId,
          icon: data.sceneId ? 'flash' : 'notifications',
        });
      },
    );
    return () => {
      received.remove();
      responded.remove();
    };
  }, [addNotification]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markRead,
      markAllRead,
      remove,
      clearAll,
    }),
    [notifications, unreadCount, addNotification, markRead, markAllRead, remove, clearAll],
  );

  return createElement(NotificationsContext.Provider, { value }, children);
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error('useNotifications must be used within a NotificationsProvider');
  return ctx;
}

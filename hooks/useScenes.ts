import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { SCENES, SUGGESTED_SCENES } from '@/constants/Scenes';
import type { Scene } from '@/types';
import {
  cancelAllSceneNotifications,
  cancelSceneNotifications,
  scheduleScene,
} from '@/services/sceneScheduler';

type NewScene = Omit<Scene, 'id'> & { id?: string };

type ScenesContextValue = {
  scenes: Scene[];
  suggested: typeof SUGGESTED_SCENES;
  /** Append a scene. Returns the scene with its resolved id. */
  addScene: (scene: NewScene) => Scene;
  /** Patch fields on an existing scene. No-op if id is unknown. */
  updateScene: (id: string, patch: Partial<Omit<Scene, 'id'>>) => void;
  /** Remove a scene by id. */
  deleteScene: (id: string) => void;
};

const ScenesContext = createContext<ScenesContextValue | null>(null);

export function ScenesProvider({ children }: { children: ReactNode }) {
  const [scenes, setScenes] = useState<Scene[]>(SCENES);

  // Track the live scenes list inside async callbacks without re-creating
  // them every render (which would cancel-and-reschedule on every state tick).
  const scenesRef = useRef(scenes);
  useEffect(() => {
    scenesRef.current = scenes;
  }, [scenes]);

  // On mount: clear any notifications scheduled by a prior session (our state
  // is in-memory so prior ids are unrecoverable), then schedule the current
  // seed/scene set fresh.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await cancelAllSceneNotifications();
      const updated = await Promise.all(
        scenesRef.current.map(async (s) => ({
          ...s,
          notificationIds: await scheduleScene(s),
        })),
      );
      if (!cancelled) setScenes(updated);
    })();
    return () => {
      cancelled = true;
    };
    // Intentional: run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addScene = useCallback((scene: NewScene) => {
    const created: Scene = { ...scene, id: scene.id ?? `s-${Date.now()}` };
    setScenes((prev) => [...prev, created]);
    // Schedule asynchronously and persist the returned ids onto the scene so
    // we can cancel later.
    scheduleScene(created).then((notificationIds) => {
      if (notificationIds.length === 0) return;
      setScenes((prev) =>
        prev.map((s) =>
          s.id === created.id ? { ...s, notificationIds } : s,
        ),
      );
    });
    return created;
  }, []);

  const updateScene = useCallback(
    (id: string, patch: Partial<Omit<Scene, 'id'>>) => {
      const existing = scenesRef.current.find((s) => s.id === id);
      if (!existing) return;
      const next: Scene = { ...existing, ...patch };
      setScenes((prev) => prev.map((s) => (s.id === id ? next : s)));
      // Reschedule: cancel old notifications, then schedule the new trigger.
      (async () => {
        await cancelSceneNotifications(existing.notificationIds);
        const notificationIds = await scheduleScene(next);
        setScenes((prev) =>
          prev.map((s) => (s.id === id ? { ...s, notificationIds } : s)),
        );
      })();
    },
    [],
  );

  const deleteScene = useCallback((id: string) => {
    const existing = scenesRef.current.find((s) => s.id === id);
    setScenes((prev) => prev.filter((s) => s.id !== id));
    if (existing) cancelSceneNotifications(existing.notificationIds);
  }, []);

  const value = useMemo<ScenesContextValue>(
    () => ({
      scenes,
      suggested: SUGGESTED_SCENES,
      addScene,
      updateScene,
      deleteScene,
    }),
    [scenes, addScene, updateScene, deleteScene],
  );

  return createElement(ScenesContext.Provider, { value }, children);
}

export function useScenes() {
  const ctx = useContext(ScenesContext);
  if (!ctx) throw new Error('useScenes must be used within a ScenesProvider');
  return ctx;
}

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SCENES, SUGGESTED_SCENES } from '@/constants/Scenes';
import type { Scene } from '@/types';

type NewScene = Omit<Scene, 'id'> & { id?: string };

type ScenesContextValue = {
  scenes: Scene[];
  suggested: typeof SUGGESTED_SCENES;
  /** Append a scene. Returns the scene with its resolved id. */
  addScene: (scene: NewScene) => Scene;
};

const ScenesContext = createContext<ScenesContextValue | null>(null);

export function ScenesProvider({ children }: { children: ReactNode }) {
  const [scenes, setScenes] = useState<Scene[]>(SCENES);

  const addScene = useCallback((scene: NewScene) => {
    const created: Scene = { ...scene, id: scene.id ?? `s-${Date.now()}` };
    setScenes((prev) => [...prev, created]);
    return created;
  }, []);

  const value = useMemo<ScenesContextValue>(
    () => ({ scenes, suggested: SUGGESTED_SCENES, addScene }),
    [scenes, addScene],
  );

  return createElement(ScenesContext.Provider, { value }, children);
}

export function useScenes() {
  const ctx = useContext(ScenesContext);
  if (!ctx) throw new Error('useScenes must be used within a ScenesProvider');
  return ctx;
}

import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@/types';

const DEFAULT_USER: User = {
  id: 'u1',
  name: 'Alex',
  email: 'alex@nestiq.app',
  homeName: 'My Home',
  address: '742 Evergreen Terrace',
};

type AppStateContextValue = {
  user: User;
  setUser: (u: User) => void;
  awayMode: boolean;
  setAwayMode: (b: boolean) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [awayMode, setAwayMode] = useState(false);

  const value = useMemo<AppStateContextValue>(
    () => ({ user, setUser, awayMode, setAwayMode }),
    [user, awayMode],
  );

  return createElement(AppStateContext.Provider, { value }, children);
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
}

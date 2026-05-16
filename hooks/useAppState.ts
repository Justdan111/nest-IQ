import { useState } from 'react';
import type { User } from '@/types';

const DEFAULT_USER: User = {
  id: 'u1',
  name: 'Alex',
  email: 'alex@nestiq.app',
  homeName: 'My Home',
  address: '742 Evergreen Terrace',
};

export function useAppState() {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [awayMode, setAwayMode] = useState(false);

  return {
    user,
    setUser,
    awayMode,
    setAwayMode,
  };
}

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ROOMS } from '@/constants/Rooms';
import type { Room } from '@/types';

type NewRoom = Omit<Room, 'id'> & { id?: string };

type RoomsContextValue = {
  rooms: Room[];
  /** Append a room. Returns the room with its resolved id. */
  addRoom: (room: NewRoom) => Room;
};

const RoomsContext = createContext<RoomsContextValue | null>(null);

export function RoomsProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(ROOMS);

  const addRoom = useCallback((room: NewRoom) => {
    const created: Room = { ...room, id: room.id ?? `r-${Date.now()}` };
    setRooms((prev) => [...prev, created]);
    return created;
  }, []);

  const value = useMemo<RoomsContextValue>(
    () => ({ rooms, addRoom }),
    [rooms, addRoom],
  );

  return createElement(RoomsContext.Provider, { value }, children);
}

export function useRooms() {
  const ctx = useContext(RoomsContext);
  if (!ctx) throw new Error('useRooms must be used within a RoomsProvider');
  return ctx;
}

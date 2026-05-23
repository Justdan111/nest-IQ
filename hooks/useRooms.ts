import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CATEGORIES, ROOMS } from '@/constants/Rooms';
import type { Category, Room, RoomMedia } from '@/types';

type NewRoom = Omit<Room, 'id'> & { id?: string };

type RoomsContextValue = {
  rooms: Room[];
  categories: Category[];
  /** Append a room. Returns the room with its resolved id. */
  addRoom: (room: NewRoom) => Room;
  /** Append a category by name. Returns the category with its resolved id. */
  addCategory: (name: string) => Category;
  /** Append uploaded media (camera roll / camera) to a room's gallery. */
  addRoomMedia: (roomId: string, media: RoomMedia[]) => void;
};

const RoomsContext = createContext<RoomsContextValue | null>(null);

const CATEGORY_PALETTES = [
  { tintColor: '#E8FDF1', blobColor: '#D2F7E6' },
  { tintColor: '#F0EDF8', blobColor: '#DDD5EF' },
  { tintColor: '#FDE8F4', blobColor: '#F7D2E5' },
  { tintColor: '#E8F8FD', blobColor: '#D2EDF7' },
];

export function RoomsProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  const addRoom = useCallback((room: NewRoom) => {
    const created: Room = { ...room, id: room.id ?? `r-${Date.now()}` };
    setRooms((prev) => [...prev, created]);
    return created;
  }, []);

  const addCategory = useCallback((name: string) => {
    const id = `c-${Date.now()}`;
    setCategories((prev) => {
      const palette = CATEGORY_PALETTES[prev.length % CATEGORY_PALETTES.length];
      const created: Category = { id, name, image: null, ...palette };
      return [...prev, created];
    });
    // Re-derive the created category from the closure — palette pick is
    // deterministic on length so this matches what we just stored.
    const palette = CATEGORY_PALETTES[categories.length % CATEGORY_PALETTES.length];
    return { id, name, image: null, ...palette };
  }, [categories.length]);

  const addRoomMedia = useCallback((roomId: string, media: RoomMedia[]) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, media: [...(r.media ?? []), ...media] } : r,
      ),
    );
  }, []);

  const value = useMemo<RoomsContextValue>(
    () => ({ rooms, categories, addRoom, addCategory, addRoomMedia }),
    [rooms, categories, addRoom, addCategory, addRoomMedia],
  );

  return createElement(RoomsContext.Provider, { value }, children);
}

export function useRooms() {
  const ctx = useContext(RoomsContext);
  if (!ctx) throw new Error('useRooms must be used within a RoomsProvider');
  return ctx;
}

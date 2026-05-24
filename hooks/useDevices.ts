import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEVICES } from '@/constants/Devices';
import type { Device } from '@/types';

type DevicesContextValue = {
  devices: Device[];
  toggleDevice: (id: string) => void;
  devicesByRoom: Record<string, Device[]>;
  activeCount: number;
  /** Repoint every device in `oldName` to `newName` (called when a room is renamed). */
  renameRoomDevices: (oldName: string, newName: string) => void;
  /** Drop every device tied to `roomName` (called when a room is deleted). */
  removeRoomDevices: (roomName: string) => void;
};

const DevicesContext = createContext<DevicesContextValue | null>(null);

export function DevicesProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(DEVICES);

  const toggleDevice = useCallback((id: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              isOn: !d.isOn,
              status: !d.isOn ? 'Connected' : 'Disconnected',
            }
          : d,
      ),
    );
  }, []);

  const renameRoomDevices = useCallback((oldName: string, newName: string) => {
    if (oldName === newName) return;
    setDevices((prev) =>
      prev.map((d) => (d.room === oldName ? { ...d, room: newName } : d)),
    );
  }, []);

  const removeRoomDevices = useCallback((roomName: string) => {
    setDevices((prev) => prev.filter((d) => d.room !== roomName));
  }, []);

  const devicesByRoom = useMemo(() => {
    const grouped: Record<string, Device[]> = {};
    for (const d of devices) {
      grouped[d.room] = grouped[d.room] || [];
      grouped[d.room].push(d);
    }
    return grouped;
  }, [devices]);

  const activeCount = useMemo(
    () => devices.filter((d) => d.isOn).length,
    [devices],
  );

  const value = useMemo<DevicesContextValue>(
    () => ({
      devices,
      toggleDevice,
      devicesByRoom,
      activeCount,
      renameRoomDevices,
      removeRoomDevices,
    }),
    [
      devices,
      toggleDevice,
      devicesByRoom,
      activeCount,
      renameRoomDevices,
      removeRoomDevices,
    ],
  );

  return createElement(DevicesContext.Provider, { value }, children);
}

export function useDevices() {
  const ctx = useContext(DevicesContext);
  if (!ctx) throw new Error('useDevices must be used within a DevicesProvider');
  return ctx;
}

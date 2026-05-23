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
    () => ({ devices, toggleDevice, devicesByRoom, activeCount }),
    [devices, toggleDevice, devicesByRoom, activeCount],
  );

  return createElement(DevicesContext.Provider, { value }, children);
}

export function useDevices() {
  const ctx = useContext(DevicesContext);
  if (!ctx) throw new Error('useDevices must be used within a DevicesProvider');
  return ctx;
}

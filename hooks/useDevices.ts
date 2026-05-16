import { useCallback, useMemo, useState } from 'react';
import { DEVICES } from '@/constants/Devices';
import type { Device } from '@/types';

export function useDevices() {
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

  return { devices, toggleDevice, devicesByRoom, activeCount };
}

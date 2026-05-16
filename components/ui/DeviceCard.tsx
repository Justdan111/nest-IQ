import { Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Device } from '@/types';

type Props = {
  device: Device;
  onToggle: (id: string) => void;
  onPress?: (device: Device) => void;
};

export function DeviceCard({ device, onToggle, onPress }: Props) {
  const active = device.isOn;

  return (
    <Pressable
      onPress={() => onPress?.(device)}
      className={`${active ? 'bg-[#3B6FF0]' : 'bg-[#1A1A1A]'} rounded-2xl p-4 flex-1`}
    >
      <View className="flex-row items-start justify-between mb-6">
        <View
          className={`w-11 h-11 rounded-full items-center justify-center ${active ? 'bg-white/20' : 'bg-[#242424]'}`}
        >
          <Ionicons
            name={device.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color="#fff"
          />
        </View>
        <Switch
          value={device.isOn}
          onValueChange={() => onToggle(device.id)}
          trackColor={{ true: '#1A1A1A', false: '#2A2A2A' }}
          thumbColor={device.isOn ? '#FFFFFF' : '#8A8A8A'}
          ios_backgroundColor={active ? '#1A1A1A' : '#2A2A2A'}
          style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
        />
      </View>
      <Text className="text-white font-semibold text-base">{device.name}</Text>
      <Text className={`text-xs mt-1 ${active ? 'text-white/80' : 'text-[#8A8A8A]'}`}>
        {device.status}
      </Text>
    </Pressable>
  );
}

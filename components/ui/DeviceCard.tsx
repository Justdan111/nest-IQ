import { Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Device } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { haptic } from '@/utils/haptics';

type Props = {
  device: Device;
  onToggle: (id: string) => void;
  onPress?: (device: Device) => void;
};

export function DeviceCard({ device, onToggle, onPress }: Props) {
  const { colors } = useTheme();
  const active = device.isOn;
  const iconColor = active ? colors.primary : colors.text;

  return (
    <Pressable
      onPress={() => onPress?.(device)}
      className={`${active ? 'bg-primary' : 'bg-surface'} rounded-2xl p-4 flex-1`}
    >
      <View className="flex-row items-start justify-between mb-6">
        <View
          className={`w-11 h-11 rounded-full items-center justify-center ${active ? 'bg-white' : 'bg-surfaceAlt'}`}
        >
          <Ionicons
            name={device.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color={iconColor}
          />
        </View>
        <Switch
          value={device.isOn}
          onValueChange={() => {
            haptic('selection');
            onToggle(device.id);
          }}
          trackColor={{ true: 'rgba(255,255,255,0.25)', false: colors.surfaceAlt }}
          thumbColor={device.isOn ? '#FFFFFF' : colors.textSecondary}
          ios_backgroundColor={active ? 'rgba(255,255,255,0.25)' : colors.surfaceAlt}
          style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
        />
      </View>
      <Text className={`font-semibold text-base ${active ? 'text-white' : 'text-text'}`}>
        {device.name}
      </Text>
      <Text className={`text-xs mt-1 ${active ? 'text-white/80' : 'text-textSecondary'}`}>
        {device.status}
      </Text>
    </Pressable>
  );
}

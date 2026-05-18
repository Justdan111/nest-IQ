import { Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import type { Device } from '@/types';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  device: Device;
  onToggle: (id: string) => void;
  onPress?: (device: Device) => void;
};

export function DeviceToggleRow({ device, onToggle, onPress }: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    scale.value = withSpring(device.isOn ? 1 : 0.98, { damping: 14 });
  }, [device.isOn, scale]);

  const active = device.isOn;
  const iconColor = active ? '#fff' : colors.text;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => onPress?.(device)}
        className={`${active ? 'bg-primary' : 'bg-surface'} rounded-2xl p-4 flex-row items-center`}
      >
        <View
          className={`w-11 h-11 rounded-full items-center justify-center ${active ? 'bg-white/20' : 'bg-surfaceAlt'}`}
        >
          <Ionicons
            name={device.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color={iconColor}
          />
        </View>
        <View className="flex-1 ml-3">
          <Text className={`font-semibold text-base ${active ? 'text-white' : 'text-text'}`}>
            {device.name}
          </Text>
          <Text className={`text-xs ${active ? 'text-white/80' : 'text-textSecondary'}`}>
            {device.status}
          </Text>
        </View>
        <Switch
          value={device.isOn}
          onValueChange={() => onToggle(device.id)}
          trackColor={{ true: 'rgba(255,255,255,0.25)', false: colors.surfaceAlt }}
          thumbColor={device.isOn ? '#FFFFFF' : colors.textSecondary}
          ios_backgroundColor={active ? 'rgba(255,255,255,0.25)' : colors.surfaceAlt}
        />
      </Pressable>
    </Animated.View>
  );
}

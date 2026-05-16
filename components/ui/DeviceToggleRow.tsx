import { Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import type { Device } from '@/types';

type Props = {
  device: Device;
  onToggle: (id: string) => void;
  onPress?: (device: Device) => void;
};

export function DeviceToggleRow({ device, onToggle, onPress }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    scale.value = withSpring(device.isOn ? 1 : 0.98, { damping: 14 });
  }, [device.isOn, scale]);

  const active = device.isOn;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => onPress?.(device)}
        className={`${active ? 'bg-[#3B6FF0]' : 'bg-[#1A1A1A]'} rounded-2xl p-4 flex-row items-center`}
      >
        <View
          className={`w-11 h-11 rounded-full items-center justify-center ${active ? 'bg-white/20' : 'bg-[#242424]'}`}
        >
          <Ionicons
            name={device.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color="#fff"
          />
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-white font-semibold text-base">{device.name}</Text>
          <Text className={`text-xs ${active ? 'text-white/80' : 'text-[#8A8A8A]'}`}>
            {device.status}
          </Text>
        </View>
        <Switch
          value={device.isOn}
          onValueChange={() => onToggle(device.id)}
          trackColor={{ true: '#1A1A1A', false: '#2A2A2A' }}
          thumbColor={device.isOn ? '#FFFFFF' : '#8A8A8A'}
          ios_backgroundColor={active ? '#1A1A1A' : '#2A2A2A'}
        />
      </Pressable>
    </Animated.View>
  );
}

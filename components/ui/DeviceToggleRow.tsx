import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import type { Device } from '@/types';

type Props = {
  device: Device;
  onToggle: (id: string) => void;
  onPress?: (device: Device) => void;
};

/**
 * Wide device row: name + status on the left, labeled On/Off pill toggle on
 * the right. No leading icon — the row is intentionally minimal to match the
 * mockup. Active state recolors the row to primary blue.
 */
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
        className={`${active ? 'bg-primary' : 'bg-surface'} rounded-2xl p-5 flex-row items-center`}
      >
        <View className="flex-1">
          <Text className={`font-semibold text-base ${active ? 'text-white' : 'text-text'}`}>
            {device.name}
          </Text>
          <Text className={`text-xs mt-1 ${active ? 'text-white/80' : 'text-textSecondary'}`}>
            {device.status}
          </Text>
        </View>
        <LabeledToggle value={device.isOn} onPress={() => onToggle(device.id)} />
      </Pressable>
    </Animated.View>
  );
}

export function LabeledToggle({ value, onPress }: { value: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 64,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.28)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: value ? 'flex-end' : 'flex-start',
        paddingHorizontal: 4,
      }}
    >
      {value ? (
        <Text className="text-white text-[11px] font-semibold mr-1">On</Text>
      ) : null}
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          backgroundColor: '#FFFFFF',
        }}
      />
      {!value ? (
        <Text className="text-white text-[11px] font-semibold ml-1">Off</Text>
      ) : null}
    </Pressable>
  );
}

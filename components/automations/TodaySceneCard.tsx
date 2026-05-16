import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Scene } from '@/types';

type Props = {
  scene: Scene;
  onPress?: (s: Scene) => void;
};

export function TodaySceneCard({ scene, onPress }: Props) {
  const isDark = scene.color === '#1A1A1A';
  return (
    <Pressable
      onPress={() => onPress?.(scene)}
      className="flex-1 rounded-2xl p-4"
      style={{ backgroundColor: scene.color, minHeight: 150 }}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-[#242424]' : 'bg-white/20'}`}
      >
        <Ionicons
          name={scene.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color="#fff"
        />
      </View>
      <View className="mt-auto">
        <Text className="text-white font-semibold text-base">{scene.name}</Text>
        <Text className="text-white/80 text-xs mt-1">
          {scene.time} {scene.repeat}
        </Text>
      </View>
    </Pressable>
  );
}

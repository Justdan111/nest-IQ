import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Scene } from '@/types';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  scene: Scene;
  onPress?: (scene: Scene) => void;
};

export function SceneCard({ scene, onPress }: Props) {
  const { colors } = useTheme();
  // Scenes flagged "#1A1A1A" are neutral cards — they follow the theme surface.
  const neutral = scene.color === '#1A1A1A';
  const bg = neutral ? colors.surface : scene.color;
  const fg = neutral ? colors.text : '#fff';
  const fgMuted = neutral ? colors.textSecondary : 'rgba(255,255,255,0.8)';
  const iconBg = neutral ? colors.surfaceAlt : 'rgba(255,255,255,0.2)';

  return (
    <Pressable
      onPress={() => onPress?.(scene)}
      className="flex-1 rounded-2xl p-4"
      style={{ backgroundColor: bg, minHeight: 140 }}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons
          name={scene.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={fg}
        />
      </View>
      <View className="mt-auto">
        <Text className="font-semibold text-base mt-6" style={{ color: fg }}>
          {scene.name}
        </Text>
        <Text className="text-xs mt-1" style={{ color: fgMuted }}>
          {scene.time} {scene.repeat}
        </Text>
      </View>
    </Pressable>
  );
}

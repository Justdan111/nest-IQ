import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  onPress?: () => void;
};

export function SceneRow({ name, icon, description, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface rounded-2xl p-4 flex-row items-center mb-3"
    >
      <View className="w-11 h-11 rounded-full bg-surfaceAlt items-center justify-center">
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-text font-semibold text-base">{name}</Text>
        <Text className="text-textSecondary text-xs mt-0.5">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

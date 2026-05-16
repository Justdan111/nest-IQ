import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  onPress?: () => void;
};

export function SceneRow({ name, icon, description, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[#1A1A1A] rounded-2xl p-4 flex-row items-center mb-3"
    >
      <View className="w-11 h-11 rounded-full bg-[#242424] items-center justify-center">
        <Ionicons name={icon} size={22} color="#3B6FF0" />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-white font-semibold text-base">{name}</Text>
        <Text className="text-[#8A8A8A] text-xs mt-0.5">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8A8A8A" />
    </Pressable>
  );
}

import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSidebar } from '@/components/ui/Sidebar';

type Props = {
  name: string;
  onMenu?: () => void;
  onBell?: () => void;
};

export function HomeHeader({ name, onMenu, onBell }: Props) {
  const { open } = useSidebar();
  return (
    <View className="px-5 pt-2">
      <View className="flex-row items-center justify-between mb-5">
        <Pressable onPress={onMenu ?? open} hitSlop={10}>
          <Ionicons name="menu" size={26} color="#fff" />
        </Pressable>
        <Pressable onPress={onBell} hitSlop={10}>
          <View>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E24B4A]" />
          </View>
        </Pressable>
      </View>
      <View className="flex-row items-center mb-6">
        <View className="w-12 h-12 rounded-full bg-[#3B6FF0] items-center justify-center">
          <Text className="text-white font-semibold text-lg">
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="ml-3">
          <Text className="text-white font-semibold text-xl">Hi, {name}</Text>
          <Text className="text-[#8A8A8A] text-sm">Welcome back to your smart Home.</Text>
        </View>
      </View>
    </View>
  );
}

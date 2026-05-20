import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSidebar } from '@/components/ui/Sidebar';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  name: string;
  onMenu?: () => void;
  onBell?: () => void;
};

export function HomeHeader({ name, onMenu, onBell }: Props) {
  const { open } = useSidebar();
  const { colors } = useTheme();
  return (
    <View className="px-5 pt-2">
      <View className="flex-row items-center justify-between mb-5">
        <Pressable onPress={onMenu ?? open} hitSlop={10}>
          <Ionicons name="menu" size={26} color={colors.text} />
        </Pressable>
        <Pressable onPress={onBell} hitSlop={10}>
          <View className="w-10 h-10 rounded-full bg-surface items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            <View className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-error" />
          </View>
        </Pressable>
      </View>
      <View className="flex-row items-center mb-6">
        <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
          <Text className="text-white font-semibold text-lg">
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="ml-3">
          <Text className="text-text font-semibold text-xl">Hi, {name}</Text>
          <Text className="text-textSecondary text-sm">
            Welcome back to your smart Home.
          </Text>
        </View>
      </View>
    </View>
  );
}

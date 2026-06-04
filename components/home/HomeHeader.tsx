import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSidebar } from '@/components/ui/Sidebar';
import { Avatar } from '@/components/ui/Avatar';
import { useAppState } from '@/hooks/useAppState';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';

type Props = {
  name: string;
  onMenu?: () => void;
  onBell?: () => void;
};

export function HomeHeader({ name, onMenu, onBell }: Props) {
  const router = useRouter();
  const { open } = useSidebar();
  const { colors } = useTheme();
  const { user } = useAppState();
  const { unreadCount } = useNotifications();
  const goNotifications = onBell ?? (() => router.push('/notifications'));
  return (
    <View className="px-5 pt-2">
      <View className="flex-row items-center justify-between mb-5">
        <Pressable onPress={onMenu ?? open} hitSlop={10}>
          <Ionicons name="menu" size={26} color={colors.text} />
        </Pressable>
        <Pressable onPress={goNotifications} hitSlop={10}>
          <View className="w-10 h-10 rounded-full bg-surface items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            {unreadCount > 0 ? (
              <View className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-error" />
            ) : null}
          </View>
        </Pressable>
      </View>
      <View className="flex-row items-center mb-6">
        <Avatar uri={user.avatar} name={name} size={48} />
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

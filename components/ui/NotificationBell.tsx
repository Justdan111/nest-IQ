import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';

type Props = {
  /** Set true to render the bell inside a surface circle (matches the
   * Automations / Camera / Statistic headers). Defaults to plain icon. */
  bubble?: boolean;
  /** Icon size override. */
  size?: number;
};

/**
 * Single source of truth for the header bell. Routes to /notifications and
 * shows a red dot when the inbox has unread items.
 */
export function NotificationBell({ bubble = false, size = 24 }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();

  const onPress = () => router.push('/notifications');

  if (bubble) {
    return (
      <Pressable onPress={onPress} hitSlop={10}>
        <View className="w-9 h-9 rounded-full bg-surface items-center justify-center">
          <Ionicons
            name="notifications-outline"
            size={size === 24 ? 20 : size}
            color={colors.text}
          />
          {unreadCount > 0 ? (
            <View
              className="absolute top-1 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.error }}
            />
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <View>
        <Ionicons
          name="notifications-outline"
          size={size}
          color={colors.text}
        />
        {unreadCount > 0 ? (
          <View
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.error }}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

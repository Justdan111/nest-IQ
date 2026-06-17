import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { EmptyState } from '@/components/ui/EmptyState';
import type { AppNotification } from '@/types';

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { notifications, unreadCount, markAllRead, markRead, remove, clearAll } =
    useNotifications();

  const askClearAll = () => {
    if (notifications.length === 0) return;
    Alert.alert(
      'Clear all notifications?',
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearAll },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <View className="flex-row items-center">
            <Text className="text-text font-semibold text-lg">Notifications</Text>
            {unreadCount > 0 ? (
              <View
                className="ml-2 px-2 py-0.5 rounded-full"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white text-xs font-semibold">
                  {unreadCount}
                </Text>
              </View>
            ) : null}
          </View>
          <Pressable
            onPress={askClearAll}
            hitSlop={10}
            disabled={notifications.length === 0}
            style={{ opacity: notifications.length === 0 ? 0.4 : 1 }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.text} />
          </Pressable>
        </View>
      </SafeAreaView>

      {notifications.length === 0 ? (
        <EmptyState
          variant="page"
          icon="notifications-off-outline"
          title="You're all caught up"
          message="New activity from your scenes and devices will show up here."
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        >
          {unreadCount > 0 ? (
            <Pressable
              onPress={markAllRead}
              hitSlop={6}
              className="self-end mb-3 mt-1"
            >
              <Text className="text-primary text-sm font-medium">
                Mark all as read
              </Text>
            </Pressable>
          ) : null}
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onPress={() => markRead(n.id)}
              onDismiss={() => remove(n.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function NotificationRow({
  notification,
  onPress,
  onDismiss,
}: {
  notification: AppNotification;
  onPress: () => void;
  onDismiss: () => void;
}) {
  const { colors } = useTheme();
  const { read, title, message, receivedAt, icon } = notification;
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface rounded-2xl p-4 flex-row mb-3"
    >
      <View
        className="w-11 h-11 rounded-full items-center justify-center"
        style={{ backgroundColor: read ? colors.surfaceAlt : `${colors.primary}26` }}
      >
        <Ionicons
          name={(icon as keyof typeof Ionicons.glyphMap) ?? 'notifications'}
          size={20}
          color={read ? colors.textSecondary : colors.primary}
        />
      </View>
      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text
            className={`flex-1 text-base ${read ? 'text-text' : 'text-text font-semibold'}`}
            numberOfLines={1}
          >
            {title}
          </Text>
          {!read ? (
            <View
              className="w-2 h-2 rounded-full ml-2"
              style={{ backgroundColor: colors.primary }}
            />
          ) : null}
        </View>
        <Text className="text-textSecondary text-sm mt-1" numberOfLines={2}>
          {message}
        </Text>
        <Text className="text-textMuted text-xs mt-1">{timeAgo(receivedAt)}</Text>
      </View>
      <Pressable onPress={onDismiss} hitSlop={8} className="ml-2 self-start">
        <Ionicons name="close" size={18} color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

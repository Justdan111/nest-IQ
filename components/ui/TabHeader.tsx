import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSidebar } from '@/components/ui/Sidebar';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  title: string;
  /** Bell style. Matches the existing screens: Automations/Camera used the
   * surface-bubble bell, Device/Statistic used the plain icon. */
  bellBubble?: boolean;
};

/**
 * Shared header for every main tab screen. Mounted at the layout level via
 * each `Tabs.Screen`'s `header` option so screens don't need to duplicate it.
 * Left = sidebar trigger, center = title, right = NotificationBell that
 * routes to `/notifications`.
 */
export function TabHeader({ title, bellBubble = false }: Props) {
  const { open } = useSidebar();
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable onPress={open} hitSlop={10}>
          <Ionicons name="menu" size={26} color={colors.text} />
        </Pressable>
        <Text className="text-text font-semibold text-lg">{title}</Text>
        <NotificationBell bubble={bellBubble} />
      </View>
    </SafeAreaView>
  );
}

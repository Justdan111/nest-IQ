import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Dimensions, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import { useTheme } from '@/hooks/useTheme';
import { initials } from '@/utils/initials';

const { width } = Dimensions.get('window');
const PANEL_WIDTH = Math.min(width * 0.82, 340);

type SidebarContextValue = {
  open: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within a SidebarProvider');
  return ctx;
}

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Door Security', icon: 'shield-checkmark', route: '/security' },
  { label: 'Cars', icon: 'car-sport' },
  { label: 'Setting', icon: 'settings-sharp', route: '/settings' },
  { label: 'Users', icon: 'people' },
  { label: 'Push Notification', icon: 'notifications', route: '/settings' },
  { label: 'Support', icon: 'help-buoy' },
];

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAppState();
  const { colors } = useTheme();
  const [rendered, setRendered] = useState(false);
  const progress = useSharedValue(0);

  const open = useCallback(() => {
    setRendered(true);
    progress.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const close = useCallback(() => {
    progress.value = withTiming(
      0,
      { duration: 240, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(setRendered)(false);
      },
    );
  }, [progress]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.6,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-PANEL_WIDTH, 0]) },
    ],
  }));

  const go = (route?: string) => {
    close();
    if (route) router.push(route as never);
    else Alert.alert('Coming soon', 'This section is not available yet.');
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}

      {rendered && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Animated.View
            style={[
              { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' },
              backdropStyle,
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={close} />
          </Animated.View>

          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: PANEL_WIDTH,
                backgroundColor: colors.background,
              },
              panelStyle,
            ]}
          >
            <SafeAreaView edges={['top', 'bottom']} className="flex-1 px-6">
              <Pressable
                onPress={close}
                hitSlop={10}
                className="w-9 h-9 rounded-full bg-surface items-center justify-center mt-2"
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>

              {/* Profile block */}
              <View className="mt-6 mb-8">
                <View className="flex-row items-center">
                  <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
                    <Text className="text-white font-bold text-xl">
                      {initials(user.name)}
                    </Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-text font-bold text-lg" numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text className="text-textSecondary text-sm" numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => go('/profile')}
                  className="self-start bg-surface rounded-lg px-4 py-1.5 mt-3"
                >
                  <Text className="text-text text-sm font-medium">Edit</Text>
                </Pressable>
              </View>

              {/* Menu */}
              <View>
                {MENU_ITEMS.map((item, i) => (
                  <Pressable
                    key={item.label}
                    onPress={() => go(item.route)}
                    className={`flex-row items-center py-4 ${i < MENU_ITEMS.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <View className="w-9 h-9 rounded-full bg-primary items-center justify-center">
                      <Ionicons name={item.icon} size={18} color="#fff" />
                    </View>
                    <Text className="text-text text-base font-medium ml-4">
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View className="flex-1" />

              <Pressable
                onPress={() => go('/(auth)/welcome')}
                className="flex-row items-center py-4"
              >
                <Ionicons name="log-out-outline" size={24} color={colors.text} />
                <Text className="text-text text-base font-medium ml-3">Logout</Text>
              </Pressable>
            </SafeAreaView>
          </Animated.View>
        </View>
      )}
    </SidebarContext.Provider>
  );
}

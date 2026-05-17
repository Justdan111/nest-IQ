import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
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

const { width } = Dimensions.get('window');
const PANEL_WIDTH = Math.min(width * 0.78, 320);

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
  { label: 'Home', icon: 'home', route: '/(tabs)' },
  { label: 'Devices', icon: 'hardware-chip-outline', route: '/(tabs)/device' },
  { label: 'Statistics', icon: 'stats-chart', route: '/(tabs)/statistic' },
  { label: 'Automations', icon: 'layers-outline', route: '/(tabs)/automations' },
  { label: 'Camera', icon: 'videocam', route: '/(tabs)/camera' },
];

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAppState();
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
                backgroundColor: '#1A1A1A',
              },
              panelStyle,
            ]}
          >
            <SafeAreaView edges={['top', 'bottom']} className="flex-1 px-5">
              <View className="flex-row items-center justify-between pt-2 mb-8">
                <Text className="text-white font-semibold text-lg">Menu</Text>
                <Pressable onPress={close} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </View>

              <View className="flex-row items-center mb-8">
                <View className="w-14 h-14 rounded-full bg-[#3B6FF0] items-center justify-center">
                  <Text className="text-white font-semibold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-white font-semibold text-base">{user.name}</Text>
                  <Text className="text-[#8A8A8A] text-sm" numberOfLines={1}>
                    {user.email}
                  </Text>
                </View>
              </View>

              <View className="gap-1">
                {MENU_ITEMS.map((item) => (
                  <Pressable
                    key={item.label}
                    onPress={() => go(item.route)}
                    className="flex-row items-center py-3.5"
                  >
                    <Ionicons name={item.icon} size={22} color="#8A8A8A" />
                    <Text className="text-white text-base ml-4">{item.label}</Text>
                  </Pressable>
                ))}
              </View>

              <View className="h-px bg-[#2A2A2A] my-4" />

              <Pressable
                onPress={() => go('/(auth)/welcome')}
                className="flex-row items-center py-3.5"
              >
                <Ionicons name="log-out-outline" size={22} color="#E24B4A" />
                <Text className="text-[#E24B4A] text-base ml-4">Log Out</Text>
              </Pressable>
            </SafeAreaView>
          </Animated.View>
        </View>
      )}
    </SidebarContext.Provider>
  );
}
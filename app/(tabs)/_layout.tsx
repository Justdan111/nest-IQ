import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SidebarProvider } from '@/components/ui/Sidebar';
import { TabHeader } from '@/components/ui/TabHeader';
import { useTheme } from '@/hooks/useTheme';

type IconName = keyof typeof Ionicons.glyphMap;

// Per-route icon mapping. Keep in sync with the screen names below.
const ROUTE_ICONS: Record<string, IconName> = {
  index: 'home-outline',
  device: 'radio-outline',
  statistic: 'bar-chart-outline',
  automations: 'timer-outline',
  camera: 'videocam-outline',
};

/**
 * Custom bottom tab bar: Home sits in its own rounded pill, the remaining
 * four routes share one connected pill to the right. Active tabs just tint
 * the icon primary — no background highlight — per the design.
 */
function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const navigateTo = (
    routeName: string,
    routeKey: string,
    isFocused: boolean,
  ) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName as never);
    }
  };

  const homeRoute = state.routes[0];
  const homeFocused = state.index === 0;
  const otherRoutes = state.routes.slice(1);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 10,
        flexDirection: 'row',
        gap: 12,
      }}
    >
      <Pressable
        onPress={() => navigateTo(homeRoute.name, homeRoute.key, homeFocused)}
        accessibilityRole="button"
        accessibilityState={homeFocused ? { selected: true } : {}}
        className="bg-surface rounded-2xl items-center justify-center"
        style={{ width: 80, height: 64 }}
      >
        <Ionicons
          name={ROUTE_ICONS[homeRoute.name] ?? 'home-outline'}
          size={26}
          color={homeFocused ? colors.primary : colors.textSecondary}
        />
      </Pressable>

      <View
        className="bg-surface rounded-2xl flex-row flex-1"
        style={{ height: 64 }}
      >
        {otherRoutes.map((route, i) => {
          const index = i + 1;
          const focused = state.index === index;
          return (
            <Pressable
              key={route.key}
              onPress={() => navigateTo(route.name, route.key, focused)}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              className="flex-1 items-center justify-center"
            >
              <Ionicons
                name={ROUTE_ICONS[route.name] ?? 'ellipse-outline'}
                size={26}
                color={focused ? colors.primary : colors.textSecondary}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <SidebarProvider>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen
          name="device"
          options={{
            headerShown: true,
            header: () => <TabHeader title="Device" />,
          }}
        />
        <Tabs.Screen
          name="statistic"
          options={{
            headerShown: true,
            header: () => <TabHeader title="Statistic" />,
          }}
        />
        <Tabs.Screen
          name="automations"
          options={{
            headerShown: true,
            header: () => <TabHeader title="Automations" bellBubble />,
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            headerShown: true,
            header: () => <TabHeader title="Real Time" bellBubble />,
          }}
        />
      </Tabs>
    </SidebarProvider>
  );
}

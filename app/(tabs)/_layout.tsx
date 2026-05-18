import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { SidebarProvider } from '@/components/ui/Sidebar';
import { useTheme } from '@/hooks/useTheme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  name,
  focused,
  inactiveColor,
}: {
  name: IconName;
  focused: boolean;
  inactiveColor: string;
}) {
  return (
    <View
      className={`w-12 h-12 rounded-full items-center justify-center ${focused ? 'bg-primary' : ''}`}
    >
      <Ionicons name={name} size={22} color={focused ? '#fff' : inactiveColor} />
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <SidebarProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 0,
            height: 78,
            paddingTop: 10,
            paddingBottom: 18,
            position: 'absolute',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="home" focused={focused} inactiveColor={colors.textSecondary} />
            ),
          }}
        />
        <Tabs.Screen
          name="device"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="hardware-chip-outline"
                focused={focused}
                inactiveColor={colors.textSecondary}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="statistic"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="stats-chart" focused={focused} inactiveColor={colors.textSecondary} />
            ),
          }}
        />
        <Tabs.Screen
          name="automations"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="layers-outline"
                focused={focused}
                inactiveColor={colors.textSecondary}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="videocam" focused={focused} inactiveColor={colors.textSecondary} />
            ),
          }}
        />
      </Tabs>
    </SidebarProvider>
  );
}

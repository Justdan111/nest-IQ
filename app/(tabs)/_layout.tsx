import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { SidebarProvider } from '@/components/ui/Sidebar';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <View
      className={`w-12 h-12 rounded-full items-center justify-center ${focused ? 'bg-[#3B6FF0]' : ''}`}
    >
      <Ionicons name={name} size={22} color={focused ? '#fff' : '#8A8A8A'} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <SidebarProvider>
      <Tabs
        screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
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
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="hardware-chip-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="statistic"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="stats-chart" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="automations"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="layers-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="videocam" focused={focused} />,
        }}
      />
      </Tabs>
    </SidebarProvider>
  );
}

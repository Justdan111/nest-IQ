import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSidebar } from '@/components/ui/Sidebar';
import { useTheme } from '@/hooks/useTheme';

const CAMERAS = [
  { id: '1', room: 'Bed Room', floor: '2nd Floor', date: 'Today', time: '10:30 AM', active: true },
  { id: '2', room: 'Living Room', floor: '1st Floor', date: 'Today', time: '10:24 AM' },
  { id: '3', room: 'Front Door', floor: 'Entrance', date: 'Today', time: '09:58 AM' },
  { id: '4', room: 'Garage', floor: 'Ground', date: 'Yesterday', time: '08:14 PM' },
];

export default function CameraScreen() {
  const { open } = useSidebar();
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-2 mb-4">
          <Pressable onPress={open} hitSlop={10}>
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Real Time</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </Pressable>
        </View>

        <View className="mx-5 rounded-2xl overflow-hidden mb-6">
          <View
            style={{ height: 220, backgroundColor: colors.surface }}
            className="items-center justify-center"
          >
            <Ionicons name="videocam" size={48} color="#3B6FF0" />
            <Text className="text-textSecondary text-sm mt-2">Live Feed</Text>

            <View className="absolute top-3 left-3 bg-black/60 rounded-md px-2 py-1">
              <Text className="text-white text-xs">REC ● LIVE</Text>
            </View>
            <View className="absolute top-3 right-3 bg-black/60 rounded-md px-2 py-1">
              <Text className="text-white text-xs">10:32 AM</Text>
            </View>
          </View>
        </View>

        <View className="px-5">
          <SectionHeader title="Cameras" actionLabel="Add New" actionVariant="pill" />
          <View className="gap-3">
            {CAMERAS.map((c) => (
              <Pressable
                key={c.id}
                className={`rounded-2xl p-4 flex-row items-center ${c.active ? 'bg-primary' : 'bg-surface'}`}
              >
                <View
                  className={`w-14 h-14 rounded-xl items-center justify-center ${c.active ? 'bg-white/20' : 'bg-surfaceAlt'}`}
                >
                  <Ionicons
                    name="videocam-outline"
                    size={22}
                    color={c.active ? '#fff' : colors.text}
                  />
                </View>
                <View className="flex-1 ml-3">
                  <Text
                    className={`font-semibold text-base ${c.active ? 'text-white' : 'text-text'}`}
                  >
                    {c.room}
                  </Text>
                  <Text
                    className={`text-xs mt-0.5 ${c.active ? 'text-white/80' : 'text-textSecondary'}`}
                  >
                    {c.floor} • {c.date} • {c.time}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={c.active ? '#fff' : colors.textSecondary}
                />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

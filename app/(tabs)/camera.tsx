import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSidebar } from '@/components/ui/Sidebar';

const CAMERAS = [
  { id: '1', room: 'Bed Room', floor: '2nd Floor', date: 'Today', time: '10:30 AM', active: true },
  { id: '2', room: 'Living Room', floor: '1st Floor', date: 'Today', time: '10:24 AM' },
  { id: '3', room: 'Front Door', floor: 'Entrance', date: 'Today', time: '09:58 AM' },
  { id: '4', room: 'Garage', floor: 'Ground', date: 'Yesterday', time: '08:14 PM' },
];

export default function CameraScreen() {
  const { open } = useSidebar();
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#0A0A0A]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-2 mb-4">
          <Pressable onPress={open} hitSlop={10}>
            <Ionicons name="menu" size={26} color="#fff" />
          </Pressable>
          <Text className="text-white font-semibold text-lg">Real Time</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </Pressable>
        </View>

        <View className="mx-5 rounded-2xl overflow-hidden mb-6">
          <View
            style={{ height: 220, backgroundColor: '#1A1A1A' }}
            className="items-center justify-center"
          >
            <Ionicons name="videocam" size={48} color="#3B6FF0" />
            <Text className="text-[#8A8A8A] text-sm mt-2">Live Feed</Text>

            <View className="absolute top-3 left-3 bg-black/60 rounded-md px-2 py-1">
              <Text className="text-white text-xs">REC ● LIVE</Text>
            </View>
            <View className="absolute top-3 right-3 bg-black/60 rounded-md px-2 py-1">
              <Text className="text-white text-xs">10:32 AM</Text>
            </View>
          </View>
        </View>

        <View className="px-5">
          <SectionHeader title="Cameras" actionLabel="+ Add New" />
          <View className="gap-3">
            {CAMERAS.map((c) => (
              <Pressable
                key={c.id}
                className={`rounded-2xl p-4 flex-row items-center ${c.active ? 'bg-[#3B6FF0]' : 'bg-[#1A1A1A]'}`}
              >
                <View
                  className={`w-14 h-14 rounded-xl items-center justify-center ${c.active ? 'bg-white/20' : 'bg-[#242424]'}`}
                >
                  <Ionicons name="videocam-outline" size={22} color="#fff" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-white font-semibold text-base">{c.room}</Text>
                  <Text
                    className={`text-xs mt-0.5 ${c.active ? 'text-white/80' : 'text-[#8A8A8A]'}`}
                  >
                    {c.floor} • {c.date} • {c.time}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={c.active ? '#fff' : '#8A8A8A'} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

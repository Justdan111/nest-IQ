import { FlatList, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { useDevices } from '@/hooks/useDevices';
import { ROOMS } from '@/constants/Rooms';
import { HomeHeader } from '@/components/home/HomeHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RoomCard } from '@/components/ui/RoomCard';
import { DeviceToggleRow } from '@/components/ui/DeviceToggleRow';

export default function HomeScreen() {
  const { user } = useAppState();
  const { devices, toggleDevice } = useDevices();

  const frequentlyUsed = devices.slice(0, 4);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <HomeHeader name={user.name} />

        <View className="px-5">
          <SectionHeader title="My Rooms" actionLabel="+ Add New" />
          <FlatList
            data={ROOMS}
            keyExtractor={(r) => r.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
            renderItem={({ item }) => <RoomCard room={item} />}
          />
        </View>

        <View className="px-5 mt-4">
          <SectionHeader title="Frequently Used" actionLabel="See All" />
          <View className="gap-3">
            {frequentlyUsed.map((d) => (
              <DeviceToggleRow key={d.id} device={d} onToggle={toggleDevice} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

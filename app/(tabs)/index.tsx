import { FlatList, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { useDevices } from '@/hooks/useDevices';
import { useRooms } from '@/hooks/useRooms';
import { HomeHeader } from '@/components/home/HomeHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { DeviceToggleRow } from '@/components/ui/DeviceToggleRow';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAppState();
  const { devices, toggleDevice } = useDevices();
  const { rooms, categories } = useRooms();

  const frequentlyUsed = devices.slice(0, 4);

  const roomsByCategory = (categoryId: string) =>
    rooms.filter((r) => r.categoryId === categoryId).length;

  const goToRoomsForCategory = (categoryId?: string) =>
    router.push(
      categoryId
        ? { pathname: '/rooms', params: { category: categoryId } }
        : '/rooms',
    );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <HomeHeader name={user.name} />

        <View className="px-5">
          <SectionHeader
            title="My rooms"
            actionLabel="Add New"
            actionVariant="pill"
            onAction={() => goToRoomsForCategory()}
          />
          <FlatList
            data={categories}
            keyExtractor={(c) => c.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
            renderItem={({ item }) => {
              const count = roomsByCategory(item.id);
              return (
                <CategoryCard
                  category={item}
                  subtitle={count === 1 ? '1 room' : `${count} rooms`}
                  onPress={(c) => goToRoomsForCategory(c.id)}
                />
              );
            }}
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

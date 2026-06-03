import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useDevices } from '@/hooks/useDevices';
import { CircularTempSlider } from '@/components/device/CircularTempSlider';
import { DeviceCard } from '@/components/ui/DeviceCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { controlRouteForDevice } from '@/components/device/controlRoute';

export default function DeviceScreen() {
  const router = useRouter();
  const { devices, toggleDevice } = useDevices();

  const acDevices = devices.filter((d) => d.type === 'ac' || d.type === 'light').slice(0, 2);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="items-center mt-6 mb-4">
          <CircularTempSlider size={350} initial={24} />
        </View>

        <View className="px-5 mt-2">
          <SectionHeader
            title="Devices"
            actionLabel="More Details"
            onAction={() => router.push('/devices')}
          />
          <View className="flex-row gap-3 mb-6">
            {acDevices.map((d) => {
              const route = controlRouteForDevice(d);
              return (
                <DeviceCard
                  key={d.id}
                  device={d}
                  onToggle={toggleDevice}
                  onPress={
                    route
                      ? () =>
                          router.push({ pathname: route, params: { id: d.id } })
                      : undefined
                  }
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

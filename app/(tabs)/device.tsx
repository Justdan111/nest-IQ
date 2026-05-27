import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevices } from '@/hooks/useDevices';
import { CircularTempSlider } from '@/components/device/CircularTempSlider';
import { DeviceCard } from '@/components/ui/DeviceCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSidebar } from '@/components/ui/Sidebar';
import { useTheme } from '@/hooks/useTheme';
import { controlRouteForDevice } from '@/components/device/controlRoute';

export default function DeviceScreen() {
  const router = useRouter();
  const { open } = useSidebar();
  const { colors } = useTheme();
  const { devices, toggleDevice } = useDevices();

  const acDevices = devices.filter((d) => d.type === 'ac' || d.type === 'light').slice(0, 2);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-2 mb-3">
          <Pressable onPress={open} hitSlop={10}>
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Device</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </Pressable>
        </View>

        <View className="items-center mt-6 mb-4">
          <CircularTempSlider size={280} initial={24} />
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
    </SafeAreaView>
  );
}

import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevices } from '@/hooks/useDevices';
import { useTheme } from '@/hooks/useTheme';
import { DeviceCard } from '@/components/ui/DeviceCard';
import { DeviceToggleRow } from '@/components/ui/DeviceToggleRow';
import { SectionHeader } from '@/components/ui/SectionHeader';

/**
 * Full inventory of every device in the home. Reached from the Device tab via
 * the "More Details" action, and the launch point for the Add Device flow at
 * /devices/add.
 */
export default function DeviceListScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { devices, toggleDevice } = useDevices();

  const frequentlyUsed = devices.slice(0, 3);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Device List</Text>
          <Pressable hitSlop={10}>
            <View className="w-9 h-9 rounded-full bg-surface items-center justify-center">
              <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 mt-2">
          <SectionHeader
            title="Devices"
            actionLabel="Add New"
            actionVariant="pill"
            onAction={() => router.push('/devices/add')}
          />
          {devices.length === 0 ? (
            <View className="bg-surface rounded-2xl p-8 items-center mt-2">
              <Ionicons
                name="hardware-chip-outline"
                size={28}
                color={colors.textSecondary}
              />
              <Text className="text-textSecondary text-sm mt-2 text-center">
                No devices yet. Tap Add New to get started.
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {devices.map((d) => (
                <View key={d.id} style={{ width: '47%' }}>
                  <DeviceCard device={d} onToggle={toggleDevice} />
                </View>
              ))}
            </View>
          )}
        </View>

        {frequentlyUsed.length > 0 ? (
          <View className="px-5 mt-6">
            <SectionHeader title="Frequently Used" />
            <View className="gap-3">
              {frequentlyUsed.map((d) => (
                <DeviceToggleRow key={d.id} device={d} onToggle={toggleDevice} />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

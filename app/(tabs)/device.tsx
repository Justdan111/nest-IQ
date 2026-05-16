import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevices } from '@/hooks/useDevices';
import { CircularTempSlider } from '@/components/device/CircularTempSlider';
import { DeviceCard } from '@/components/ui/DeviceCard';
import { MoodSelector } from '@/components/device/MoodSelector';
import { Button } from '@/components/ui/Button';

type Mood = 'cool' | 'heat' | 'wind' | 'auto';

export default function DeviceScreen() {
  const { devices, toggleDevice } = useDevices();
  const [mood, setMood] = useState<Mood>('cool');

  const acDevices = devices.filter((d) => d.type === 'ac' || d.type === 'light').slice(0, 2);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#0A0A0A]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-2 mb-3">
          <Pressable hitSlop={10}>
            <Ionicons name="menu" size={26} color="#fff" />
          </Pressable>
          <Text className="text-white font-semibold text-lg">Device</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </Pressable>
        </View>

        <View className="items-center mt-6 mb-4">
          <CircularTempSlider size={280} initial={24} />
        </View>

        <View className="px-5 mt-2">
          <Text className="text-white font-semibold text-lg mb-3">Devices</Text>
          <View className="flex-row gap-3 mb-6">
            {acDevices.map((d) => (
              <DeviceCard key={d.id} device={d} onToggle={toggleDevice} />
            ))}
          </View>

          <Text className="text-white font-semibold text-lg mb-3">Select Mood</Text>
          <MoodSelector selected={mood} onSelect={setMood} />

          <View className="mt-8">
            <Button label="Set Timer" variant="outline" icon="time-outline" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

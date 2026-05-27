import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevices } from '@/hooks/useDevices';
import { useRooms } from '@/hooks/useRooms';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { RoomFilterPills } from '@/components/ui/RoomFilterPill';
import { CircularTempSlider } from '@/components/device/CircularTempSlider';
import { MoodSelector } from '@/components/device/MoodSelector';
import { WheelPicker, range2 } from '@/components/device/WheelPicker';

type Mood = 'cool' | 'heat' | 'wind' | 'auto';
type Period = 'AM' | 'PM';

const HOURS = range2(1, 12);
const MIN_SEC = range2(0, 59);
const PERIODS: Period[] = ['AM', 'PM'];

export default function AcControlScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { devices, toggleDevice } = useDevices();
  const { categories } = useRooms();
  const params = useLocalSearchParams<{ id?: string }>();

  // Default to the AC the user tapped; fall back to the first AC in the system.
  const initial = useMemo(
    () =>
      devices.find((d) => d.id === params.id && d.type === 'ac') ??
      devices.find((d) => d.type === 'ac') ??
      devices[0],
    [devices, params.id],
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    () => categories[0]?.id ?? '',
  );
  const [mood, setMood] = useState<Mood>('cool');

  // Track the device locally so toggling power reflects on the screen even
  // though state lives in the devices context.
  const device = devices.find((d) => d.id === initial?.id) ?? initial;
  const isOn = device?.isOn ?? false;

  // Timer sheet state.
  const [timerOpen, setTimerOpen] = useState(false);
  const [timer, setTimer] = useState({
    hour: 5, // index into HOURS → "06"
    minute: 30,
    second: 0,
    period: 1 as 0 | 1, // 0=AM, 1=PM
  });

  const formattedTimer = `${HOURS[timer.hour]}:${MIN_SEC[timer.minute]}:${MIN_SEC[timer.second]} ${PERIODS[timer.period]}`;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Device List</Text>
          <View className="w-9 h-9 rounded-full bg-surface items-center justify-center">
            <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
          </View>
        </View>
      </SafeAreaView>

      <View className="mb-2">
        <RoomFilterPills
          rooms={categories.map((c) => c.name)}
          selected={
            categories.find((c) => c.id === selectedCategoryId)?.name ?? ''
          }
          onSelect={(name) => {
            const next = categories.find((c) => c.name === name);
            if (next) setSelectedCategoryId(next.id);
          }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="items-center mt-4 mb-2">
          <CircularTempSlider size={280} initial={30} />
        </View>

        <View className="px-5 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text font-semibold text-lg">Select Mood</Text>
            <PowerButton
              isOn={isOn}
              onPress={() => device && toggleDevice(device.id)}
            />
          </View>
          <MoodSelector selected={mood} onSelect={setMood} />

          <View className="mt-8">
            <Button
              label="Set Timer"
              variant="outline"
              icon="time-outline"
              onPress={() => setTimerOpen(true)}
            />
            <Text className="text-textSecondary text-xs mt-3 text-center">
              Timer: {formattedTimer}
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomSheet visible={timerOpen} onClose={() => setTimerOpen(false)}>
        <Text className="text-text font-semibold text-lg mb-4">
          Going to {isOn ? 'Off' : 'On'}
        </Text>

        <View className="flex-row items-center justify-center mb-6">
          <WheelPicker
            values={HOURS}
            selectedIndex={timer.hour}
            onChange={(i) => setTimer((t) => ({ ...t, hour: i }))}
          />
          <Text className="text-text text-3xl font-bold mx-1">:</Text>
          <WheelPicker
            values={MIN_SEC}
            selectedIndex={timer.minute}
            onChange={(i) => setTimer((t) => ({ ...t, minute: i }))}
          />
          <Text className="text-text text-3xl font-bold mx-1">:</Text>
          <WheelPicker
            values={MIN_SEC}
            selectedIndex={timer.second}
            onChange={(i) => setTimer((t) => ({ ...t, second: i }))}
          />
          <WheelPicker
            width={64}
            values={PERIODS}
            selectedIndex={timer.period}
            onChange={(i) => setTimer((t) => ({ ...t, period: i as 0 | 1 }))}
          />
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              label="Cancel"
              variant="outline"
              onPress={() => setTimerOpen(false)}
            />
          </View>
          <View className="flex-1">
            <Button label="Save" onPress={() => setTimerOpen(false)} />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

function PowerButton({
  isOn,
  onPress,
}: {
  isOn: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className={`w-11 h-11 rounded-full items-center justify-center ${isOn ? 'bg-primary' : 'bg-surface border border-border'}`}
    >
      <Ionicons
        name="power"
        size={20}
        color={isOn ? '#FFFFFF' : '#8A8A8A'}
      />
    </Pressable>
  );
}

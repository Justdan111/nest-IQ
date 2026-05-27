import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevices } from '@/hooks/useDevices';
import { useRooms } from '@/hooks/useRooms';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { RoomFilterPills } from '@/components/ui/RoomFilterPill';
import { ColorPicker } from '@/components/device/ColorPicker';
import { ToneGlowToggle } from '@/components/device/ToneGlowToggle';
import { IntensitySlider } from '@/components/device/IntensitySlider';
import { WheelPicker, range2 } from '@/components/device/WheelPicker';

const HOURS = range2(1, 12);
const MIN_SEC = range2(0, 59);
const PERIODS = ['AM', 'PM'] as const;
type Period = (typeof PERIODS)[number];

type TimeValue = { hour: number; minute: number; period: 0 | 1 };
type ScheduleStep = 'main' | 'on' | 'off';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthDates(year: number, month: number) {
  // month is 0-indexed
  const last = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: last }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return {
      day: i + 1,
      label: DAYS_OF_WEEK[date.getDay()],
    };
  });
}

function fmtTime(t: TimeValue) {
  return `${HOURS[t.hour]}:${MIN_SEC[t.minute]} ${PERIODS[t.period]}`;
}

export default function LightControlScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { devices, toggleDevice } = useDevices();
  const { categories } = useRooms();
  const params = useLocalSearchParams<{ id?: string }>();

  const initial = useMemo(
    () =>
      devices.find((d) => d.id === params.id && d.type === 'light') ??
      devices.find((d) => d.type === 'light') ??
      devices[0],
    [devices, params.id],
  );

  const device = devices.find((d) => d.id === initial?.id) ?? initial;
  const isOn = device?.isOn ?? false;

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    () => categories[0]?.id ?? '',
  );
  const [color, setColor] = useState('#EF9F27');
  const [tone, setTone] = useState<'warm' | 'cold'>('warm');
  const [intensity, setIntensity] = useState(35);

  // Color picker sheet.
  const [colorOpen, setColorOpen] = useState(false);
  const [draftColor, setDraftColor] = useState(color);

  // Schedule sheet — multi-day date selection + editable on/off times.
  const today = new Date();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleStep, setScheduleStep] = useState<ScheduleStep>('main');
  const [calMonth, setCalMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selectedDays, setSelectedDays] = useState<number[]>([
    today.getDate(),
  ]);
  const [onTime, setOnTime] = useState<TimeValue>({
    hour: 9, // "10"
    minute: 27,
    period: 1,
  });
  const [offTime, setOffTime] = useState<TimeValue>({
    hour: 6, // "07"
    minute: 30,
    period: 0,
  });

  const monthDates = useMemo(
    () => buildMonthDates(calMonth.year, calMonth.month),
    [calMonth],
  );
  const monthLabel = useMemo(
    () =>
      new Date(calMonth.year, calMonth.month, 1).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    [calMonth],
  );

  const shiftMonth = (delta: number) =>
    setCalMonth(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const toggleDay = (day: number) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const closeSchedule = () => {
    setScheduleOpen(false);
    setScheduleStep('main');
  };

  const roomName =
    categories.find((c) => c.id === selectedCategoryId)?.name ?? '';

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

      <View className="mb-3">
        <RoomFilterPills
          rooms={categories.map((c) => c.name)}
          selected={roomName}
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
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-text font-bold text-2xl">
                {device?.name ?? 'Lamp Light'}
              </Text>
              <Text className="text-textSecondary text-sm">{roomName}</Text>
            </View>
            <Pressable
              onPress={() => device && toggleDevice(device.id)}
              hitSlop={6}
              className={`w-11 h-11 rounded-full items-center justify-center ${isOn ? 'bg-primary' : 'bg-surface border border-border'}`}
            >
              <Ionicons
                name="power"
                size={20}
                color={isOn ? '#FFFFFF' : '#8A8A8A'}
              />
            </Pressable>
          </View>

          {/* Lamp card — full-bleed lamp photo with the color affordance
              floated in the top-left. The photo already lives on a dark
              background so we always use a dark base regardless of theme. */}
          <View
            className="rounded-3xl overflow-hidden mb-6"
            style={{ height: 280, backgroundColor: '#1A1A1A' }}
          >
            <Image
              source={require('@/assets/images/lamplight.jpg')}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
                opacity: isOn ? 1 : 0.35,
              }}
            />
            <View
              style={{ position: 'absolute', top: 0, left: 0, padding: 16 }}
            >
              <Text className="text-white font-semibold text-base">Color</Text>
              <Pressable
                onPress={() => {
                  setDraftColor(color);
                  setColorOpen(true);
                }}
                className="w-10 h-10 rounded-full mt-1.5"
                style={{
                  backgroundColor: color,
                  borderWidth: 2,
                  borderColor: '#1A1A1A',
                }}
              />
            </View>
          </View>

          <Text className="text-text font-semibold text-lg mb-3">Tone Glow</Text>
          <ToneGlowToggle value={tone} onChange={setTone} />

          <View className="flex-row items-center justify-between mt-6 mb-3">
            <Text className="text-text font-semibold text-lg">Intensity</Text>
            <Text className="text-text font-bold text-base">{intensity}%</Text>
          </View>
          <IntensitySlider value={intensity} onChange={setIntensity} />
          <View className="flex-row justify-between mt-2">
            <Text className="text-textSecondary text-xs">Off</Text>
            <Text className="text-textSecondary text-xs">100%</Text>
          </View>

          <View className="mt-8">
            <Button
              label="Set Schedule"
              variant="outline"
              icon="calendar-outline"
              onPress={() => {
                setScheduleStep('main');
                setScheduleOpen(true);
              }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Color picker sheet */}
      <BottomSheet visible={colorOpen} onClose={() => setColorOpen(false)}>
        <Text className="text-text font-semibold text-lg mb-4 text-center">
          Change Color
        </Text>
        <View className="mb-6">
          <ColorPicker selected={draftColor} onSelect={setDraftColor} />
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              label="Cancel"
              variant="outline"
              onPress={() => setColorOpen(false)}
            />
          </View>
          <View className="flex-1">
            <Button
              label="Save"
              onPress={() => {
                setColor(draftColor);
                setColorOpen(false);
              }}
            />
          </View>
        </View>
      </BottomSheet>

      {/* Schedule sheet */}
      <BottomSheet visible={scheduleOpen} onClose={closeSchedule}>
        {scheduleStep === 'main' ? (
          <View>
            <View className="flex-row items-center justify-center mb-5">
              <Pressable
                onPress={closeSchedule}
                hitSlop={10}
                className="absolute left-0"
              >
                <Ionicons name="chevron-back" size={22} color={colors.text} />
              </Pressable>
              <Text className="text-text font-semibold text-lg">
                Set Schedule
              </Text>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-text font-semibold text-lg">
                  {monthLabel}
                </Text>
                <Text className="text-textSecondary text-xs mt-0.5">
                  Select the desired date
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => shiftMonth(-1)}
                  className="w-9 h-9 rounded-xl bg-background items-center justify-center border border-border"
                >
                  <Ionicons
                    name="chevron-back"
                    size={16}
                    color={colors.text}
                  />
                </Pressable>
                <Pressable
                  onPress={() => shiftMonth(1)}
                  className="w-9 h-9 rounded-xl bg-background items-center justify-center border border-border"
                >
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.text}
                  />
                </Pressable>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
              className="mb-5"
            >
              {monthDates.map(({ day, label }) => {
                const active = selectedDays.includes(day);
                return (
                  <Pressable
                    key={day}
                    onPress={() => toggleDay(day)}
                    style={{ width: 60, height: 70 }}
                    className={`rounded-2xl items-center justify-center ${active ? 'bg-primary' : 'bg-background border border-border'}`}
                  >
                    <Text
                      className={`text-lg font-bold ${active ? 'text-white' : 'text-text'}`}
                    >
                      {String(day).padStart(2, '0')}
                    </Text>
                    <Text
                      className={`text-xs mt-0.5 ${active ? 'text-white/80' : 'text-textSecondary'}`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text className="text-textSecondary text-xs mb-2">
              Select the desired time
            </Text>
            <View className="flex-row gap-3 mb-6">
              <TimeField
                label="On Time"
                value={fmtTime(onTime)}
                onPress={() => setScheduleStep('on')}
              />
              <TimeField
                label="Off Time"
                value={fmtTime(offTime)}
                onPress={() => setScheduleStep('off')}
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  label="Cancel"
                  variant="outline"
                  onPress={closeSchedule}
                />
              </View>
              <View className="flex-1">
                <Button label="Save" onPress={closeSchedule} />
              </View>
            </View>
          </View>
        ) : (
          <TimeEditor
            title={scheduleStep === 'on' ? 'On Time' : 'Off Time'}
            value={scheduleStep === 'on' ? onTime : offTime}
            onBack={() => setScheduleStep('main')}
            onSave={(next) => {
              if (scheduleStep === 'on') setOnTime(next);
              else setOffTime(next);
              setScheduleStep('main');
            }}
          />
        )}
      </BottomSheet>
    </View>
  );
}

function TimeField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 bg-background border border-border rounded-2xl px-3 py-3"
    >
      <Text className="text-textSecondary text-xs">{label}</Text>
      <Text className="text-text font-semibold text-base mt-1">{value}</Text>
    </Pressable>
  );
}

function TimeEditor({
  title,
  value,
  onBack,
  onSave,
}: {
  title: string;
  value: TimeValue;
  onBack: () => void;
  onSave: (next: TimeValue) => void;
}) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState(value);

  return (
    <View>
      <View className="flex-row items-center justify-center mb-5">
        <Pressable
          onPress={onBack}
          hitSlop={10}
          className="absolute left-0"
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text className="text-text font-semibold text-lg">{title}</Text>
      </View>

      <View className="flex-row items-center justify-center mb-6">
        <WheelPicker
          values={HOURS}
          selectedIndex={draft.hour}
          onChange={(i) => setDraft((d) => ({ ...d, hour: i }))}
        />
        <Text className="text-text text-3xl font-bold mx-1">:</Text>
        <WheelPicker
          values={MIN_SEC}
          selectedIndex={draft.minute}
          onChange={(i) => setDraft((d) => ({ ...d, minute: i }))}
        />
        <WheelPicker
          width={64}
          values={[...PERIODS]}
          selectedIndex={draft.period}
          onChange={(i) => setDraft((d) => ({ ...d, period: i as 0 | 1 }))}
        />
      </View>

      <Button label="Save" onPress={() => onSave(draft)} />
    </View>
  );
}

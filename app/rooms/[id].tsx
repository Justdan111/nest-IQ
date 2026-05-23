import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevices } from '@/hooks/useDevices';
import { useRooms } from '@/hooks/useRooms';
import { useTheme } from '@/hooks/useTheme';
import { RoomFilterPills } from '@/components/ui/RoomFilterPill';
import { DeviceCard } from '@/components/ui/DeviceCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { SuccessModal } from '@/components/ui/SuccessModal';

type DeviceStep = null | 'pick' | 'success';

const DEVICE_TYPES: {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  fg: string;
  kwh: number;
}[] = [
  { id: 'light', name: 'Lamp Light', icon: 'bulb', bg: '#3A2F12', fg: '#EF9F27', kwh: 2 },
  { id: 'speaker', name: 'Homepod', icon: 'radio', bg: '#0F2F2D', fg: '#3FBF7F', kwh: 2 },
  { id: 'fan', name: 'Ceiling Fan', icon: 'aperture', bg: '#3A1F26', fg: '#C97E8A', kwh: 2 },
  { id: 'ac', name: 'Air Condition', icon: 'snow', bg: '#1F2A4A', fg: '#3B6FF0', kwh: 2 },
];

export default function RoomDetailsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { devices, toggleDevice } = useDevices();
  const { rooms } = useRooms();
  const params = useLocalSearchParams<{ id: string }>();

  const room = rooms.find((r) => r.id === params.id) ?? rooms[0];
  const roomDevices = devices.filter((d) => d.room === room.name);
  const roomNames = rooms.map((r) => r.name);

  const [selectedPill, setSelectedPill] = useState<string>(room.name);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [step, setStep] = useState<DeviceStep>(null);
  const [pickedTypes, setPickedTypes] = useState<string[]>([]);

  const openAdd = () => {
    setPickedTypes([]);
    setStep('pick');
  };
  const togglePick = (id: string) =>
    setPickedTypes((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">{room.name}</Text>
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
        <View className="mb-5 mt-1">
          <RoomFilterPills
            rooms={roomNames}
            selected={selectedPill}
            onSelect={(name) => {
              const target = rooms.find((r) => r.name === name);
              if (target && target.id !== room.id) {
                router.replace(`/rooms/${target.id}`);
              } else {
                setSelectedPill(name);
              }
            }}
          />
        </View>

        <Pressable
          onPress={() => setMediaOpen(true)}
          className="mx-5 rounded-2xl overflow-hidden mb-6"
        >
          <Image
            source={room.image}
            resizeMode="cover"
            style={{ width: '100%', height: 180, backgroundColor: room.tintColor }}
          />
          <View className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-black/50 items-center justify-center">
            <Ionicons name="camera-outline" size={18} color="#fff" />
          </View>
        </Pressable>

        <View className="px-5">
          <SectionHeader
            title="Devices"
            actionLabel="Add New"
            actionVariant="pill"
            onAction={openAdd}
          />

          {roomDevices.length === 0 ? (
            <View className="bg-surface rounded-2xl p-6 items-center">
              <Ionicons
                name="hardware-chip-outline"
                size={28}
                color={colors.textSecondary}
              />
              <Text className="text-textSecondary text-sm mt-2">
                No devices in {room.name} yet.
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {roomDevices.map((d) => (
                <View key={d.id} style={{ width: '47%' }}>
                  <DeviceCard device={d} onToggle={toggleDevice} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomSheet visible={mediaOpen} onClose={() => setMediaOpen(false)}>
        <Text className="text-text font-semibold text-lg mb-4 text-center">
          Room Media
        </Text>
        <View className="gap-3">
          <MediaOption
            icon="images-outline"
            label="View photos & videos"
            onPress={() => setMediaOpen(false)}
          />
          <MediaOption
            icon="add-circle-outline"
            label="Add photo or video"
            onPress={() => setMediaOpen(false)}
          />
          <MediaOption
            icon="videocam-outline"
            label="Live CCTV feed"
            onPress={() => setMediaOpen(false)}
          />
        </View>
      </BottomSheet>

      <BottomSheet visible={step === 'pick'} onClose={() => setStep(null)}>
        <View className="flex-row items-center justify-center mb-5">
          <Pressable
            onPress={() => setStep(null)}
            hitSlop={10}
            className="absolute left-0"
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Add Device</Text>
        </View>
        <View className="gap-3 mb-5">
          {DEVICE_TYPES.map((t) => {
            const active = pickedTypes.includes(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => togglePick(t.id)}
                className="bg-background border border-border rounded-2xl p-3 flex-row items-center"
              >
                <View
                  className="w-11 h-11 rounded-full items-center justify-center"
                  style={{ backgroundColor: t.bg }}
                >
                  <Ionicons name={t.icon} size={20} color={t.fg} />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-text font-semibold text-base">{t.name}</Text>
                  <Text className="text-textSecondary text-xs mt-0.5">
                    {t.kwh} kWh/Hour
                  </Text>
                </View>
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{
                    borderWidth: 2,
                    borderColor: active ? colors.primary : colors.border,
                  }}
                >
                  {active ? (
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
        <Button
          label="Continue"
          onPress={() => setStep('success')}
          disabled={pickedTypes.length === 0}
        />
      </BottomSheet>

      <SuccessModal
        visible={step === 'success'}
        message={
          pickedTypes.length === 1
            ? `1 device added to ${room.name}!`
            : `${pickedTypes.length} devices added to ${room.name}!`
        }
        ctaLabel="Done"
        onClose={() => setStep(null)}
      />
    </View>
  );
}

function MediaOption({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="bg-background border border-border rounded-2xl p-4 flex-row items-center"
    >
      <View className="w-10 h-10 rounded-full bg-primary/15 items-center justify-center">
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text className="text-text font-medium ml-3 flex-1">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

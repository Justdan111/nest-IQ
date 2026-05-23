import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROOMS, ROOM_NAMES } from '@/constants/Rooms';
import { useDevices } from '@/hooks/useDevices';
import { useTheme } from '@/hooks/useTheme';
import { RoomFilterPills } from '@/components/ui/RoomFilterPill';
import { DeviceCard } from '@/components/ui/DeviceCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';

type Step = null | 'type' | 'photos' | 'name' | 'success';

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

const PHOTO_OPTIONS = [
  require('@/assets/images/chair-1.jpg'),
  require('@/assets/images/chair-2.jpg'),
  require('@/assets/images/bed-2.jpg'),
];

export default function DeviceListScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { devices, toggleDevice } = useDevices();
  const params = useLocalSearchParams<{ room?: string }>();

  const [selectedRoom, setSelectedRoom] = useState<string>(
    params.room ?? ROOM_NAMES[0],
  );
  const [step, setStep] = useState<Step>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [roomName, setRoomName] = useState('');

  const room = ROOMS.find((r) => r.name === selectedRoom) ?? ROOMS[0];
  const roomDevices = devices.filter((d) => d.room === selectedRoom);

  const openFlow = () => {
    setSelectedTypes([]);
    setSelectedPhotos([]);
    setRoomName('');
    setStep('type');
  };
  const closeFlow = () => setStep(null);

  const toggleType = (id: string) =>
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  const togglePhoto = (i: number) =>
    setSelectedPhotos((prev) =>
      prev.includes(i) ? prev.filter((p) => p !== i) : [...prev, i],
    );

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
        <View className="mb-5 mt-1">
          <RoomFilterPills
            rooms={ROOM_NAMES}
            selected={selectedRoom}
            onSelect={setSelectedRoom}
          />
        </View>

        <View className="mx-5 rounded-2xl overflow-hidden mb-6">
          <Image
            source={room.image}
            resizeMode="cover"
            style={{ width: '100%', height: 180, backgroundColor: room.tintColor }}
          />
          <Pressable
            className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-black/50 items-center justify-center"
            hitSlop={6}
          >
            <Ionicons name="camera-outline" size={18} color="#fff" />
          </Pressable>
        </View>

        <View className="px-5">
          <SectionHeader
            title="Devices"
            actionLabel="Add New"
            actionVariant="pill"
            onAction={openFlow}
          />

          {roomDevices.length === 0 ? (
            <View className="bg-surface rounded-2xl p-6 items-center">
              <Ionicons name="hardware-chip-outline" size={28} color={colors.textSecondary} />
              <Text className="text-textSecondary text-sm mt-2">
                No devices in {selectedRoom} yet.
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

      <BottomSheet
        visible={step !== null && step !== 'success'}
        onClose={closeFlow}
      >
        {step === 'type' ? (
          <TypeStep
            selected={selectedTypes}
            onToggle={toggleType}
            onBack={closeFlow}
            onContinue={() => setStep('photos')}
          />
        ) : null}
        {step === 'photos' ? (
          <PhotosStep
            selected={selectedPhotos}
            onToggle={togglePhoto}
            onBack={() => setStep('type')}
            onContinue={() => setStep('name')}
          />
        ) : null}
        {step === 'name' ? (
          <NameStep
            value={roomName}
            onChange={setRoomName}
            onBack={() => setStep('photos')}
            onContinue={() => setStep('success')}
            onCancel={closeFlow}
          />
        ) : null}
      </BottomSheet>

      <SuccessModal
        visible={step === 'success'}
        name={roomName.trim() || 'Master Bedroom'}
        onHome={() => {
          closeFlow();
          router.replace('/(tabs)');
        }}
      />
    </View>
  );
}

function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center justify-center mb-5">
      <Pressable onPress={onBack} hitSlop={10} className="absolute left-0">
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>
      <Text className="text-text font-semibold text-lg">{title}</Text>
    </View>
  );
}

function TypeStep({
  selected,
  onToggle,
  onBack,
  onContinue,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <StepHeader title="Add Device" onBack={onBack} />
      <View className="gap-3 mb-5">
        {DEVICE_TYPES.map((t) => {
          const active = selected.includes(t.id);
          return (
            <Pressable
              key={t.id}
              onPress={() => onToggle(t.id)}
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
        onPress={onContinue}
        disabled={selected.length === 0}
      />
    </View>
  );
}

function PhotosStep({
  selected,
  onToggle,
  onBack,
  onContinue,
}: {
  selected: number[];
  onToggle: (i: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <StepHeader title="Add Photos" onBack={onBack} />
      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
        {PHOTO_OPTIONS.map((src, i) => {
          const active = selected.includes(i);
          return (
            <Pressable
              key={i}
              onPress={() => onToggle(i)}
              style={{ width: '47%', aspectRatio: 1 }}
              className="rounded-2xl overflow-hidden"
            >
              <Image
                source={src}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              {active ? (
                <View className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white items-center justify-center">
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
        <View
          style={{
            width: '47%',
            aspectRatio: 1,
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 16,
          }}
          className="bg-background items-center justify-center"
        >
          <Pressable
            hitSlop={6}
            className="items-center justify-center"
            style={{ width: '100%', height: '100%' }}
          >
            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
              <Ionicons name="camera-outline" size={20} color="#fff" />
            </View>
            <Text className="text-text text-xs mt-2">Take New Photo</Text>
          </Pressable>
        </View>
      </View>
      <View className="mt-6">
        <Button
          label="Continue"
          onPress={onContinue}
          disabled={selected.length === 0}
        />
      </View>
    </View>
  );
}

function NameStep({
  value,
  onChange,
  onBack,
  onContinue,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onContinue: () => void;
  onCancel: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <StepHeader title="Device List" onBack={onBack} />
      <Text className="text-textSecondary text-sm mb-2">Room Name</Text>
      <View className="flex-row items-center bg-background border border-primary rounded-xl px-4 mb-6">
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Master Bedroom"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          className="flex-1 text-text py-3 text-base"
        />
        {value ? (
          <Pressable onPress={() => onChange('')} hitSlop={6}>
            <Ionicons name="close" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      <View className="gap-3">
        <Button
          label="Continue"
          onPress={onContinue}
          disabled={value.trim().length === 0}
        />
        <Button label="Cancel" variant="outline" onPress={onCancel} />
      </View>
    </View>
  );
}

const SPARKLES: { size: number; pos: object }[] = [
  { size: 6, pos: { top: 0, left: 40 } },
  { size: 4, pos: { top: 14, right: 6 } },
  { size: 5, pos: { bottom: 8, left: 0 } },
  { size: 7, pos: { bottom: 22, right: 0 } },
  { size: 4, pos: { top: 36, left: 2 } },
  { size: 5, pos: { bottom: 0, right: 36 } },
];

function SuccessModal({
  visible,
  name,
  onHome,
}: {
  visible: boolean;
  name: string;
  onHome: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 bg-black/70 items-center justify-center px-8">
        <View className="w-full bg-surface rounded-3xl p-8 items-center">
          <View
            style={{ width: 120, height: 120 }}
            className="items-center justify-center"
          >
            {SPARKLES.map((s, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  ...s.pos,
                  width: s.size,
                  height: s.size,
                  borderRadius: s.size / 2,
                  backgroundColor: '#3B6FF0',
                }}
              />
            ))}
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
              <View className="w-12 h-12 rounded-xl bg-white items-center justify-center">
                <Ionicons name="checkmark" size={28} color="#3B6FF0" />
              </View>
            </View>
          </View>
          <Text className="text-text text-2xl font-bold mt-6">Congratulation!</Text>
          <Text className="text-textSecondary text-sm mt-2 text-center">
            {name} Added!
          </Text>
          <View className="w-full mt-6">
            <Button label="Home" onPress={onHome} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

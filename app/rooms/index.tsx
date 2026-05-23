import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROOMS, ROOM_NAMES } from '@/constants/Rooms';
import { useDevices } from '@/hooks/useDevices';
import { useTheme } from '@/hooks/useTheme';
import { RoomFilterPills } from '@/components/ui/RoomFilterPill';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { SuccessModal } from '@/components/ui/SuccessModal';
import type { Room } from '@/types';

type Step = null | 'name' | 'photos' | 'devices' | 'success';

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

export default function RoomsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { devices } = useDevices();

  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [selectedPill, setSelectedPill] = useState<string>(ROOM_NAMES[0]);

  const [step, setStep] = useState<Step>(null);
  const [roomName, setRoomName] = useState('');
  const [photos, setPhotos] = useState<number[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const open = () => {
    setRoomName('');
    setPhotos([]);
    setTypes([]);
    setStep('name');
  };
  const close = () => setStep(null);

  const finalize = () => {
    const newRoom: Room = {
      id: `r-${Date.now()}`,
      name: roomName.trim(),
      subtitle: `${types.length} devices`,
      deviceCount: 0,
      totalDevices: types.length,
      image: photos.length > 0 ? PHOTO_OPTIONS[photos[0]] : ROOMS[0].image,
      tintColor: '#E8F0FD',
      blobColor: '#D1E0F8',
    };
    setRooms((prev) => [...prev, newRoom]);
    setStep('success');
  };

  const togglePhoto = (i: number) =>
    setPhotos((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  const toggleType = (id: string) =>
    setTypes((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Room List</Text>
          <View style={{ width: 26 }} />
        </View>
      </SafeAreaView>

      <View className="mb-4 mt-1">
        <RoomFilterPills
          rooms={ROOM_NAMES}
          selected={selectedPill}
          onSelect={setSelectedPill}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 20 }}
      >
        {rooms.map((r) => {
          const inRoom = devices.filter((d) => d.room === r.name);
          const onCount = inRoom.filter((d) => d.isOn).length;
          const totalCount = inRoom.length || r.totalDevices;
          return (
            <RoomListItem
              key={r.id}
              room={r}
              onCount={onCount}
              totalCount={totalCount}
              onPress={() => router.push(`/rooms/${r.id}`)}
            />
          );
        })}
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="px-5 pb-3">
        <Button label="Add new room" variant="outline" onPress={open} />
      </SafeAreaView>

      <BottomSheet
        visible={step !== null && step !== 'success'}
        onClose={close}
      >
        {step === 'name' ? (
          <NameStep
            value={roomName}
            onChange={setRoomName}
            onBack={close}
            onCancel={close}
            onContinue={() => setStep('photos')}
          />
        ) : null}
        {step === 'photos' ? (
          <PhotosStep
            selected={photos}
            onToggle={togglePhoto}
            onBack={() => setStep('name')}
            onContinue={() => setStep('devices')}
          />
        ) : null}
        {step === 'devices' ? (
          <DevicesStep
            selected={types}
            onToggle={toggleType}
            onBack={() => setStep('photos')}
            onContinue={finalize}
          />
        ) : null}
      </BottomSheet>

      <SuccessModal
        visible={step === 'success'}
        message={`${roomName.trim() || 'Master Bedroom'} Added!`}
        onClose={() => {
          close();
          router.replace('/(tabs)');
        }}
      />
    </View>
  );
}

function RoomListItem({
  room,
  onCount,
  totalCount,
  onPress,
}: {
  room: Room;
  onCount: number;
  totalCount: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl overflow-hidden mb-4 bg-surface"
      style={{ height: 200 }}
    >
      <Image
        source={room.image}
        resizeMode="cover"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110 }}
      />
      <View className="absolute bottom-0 left-0 right-0 p-4 flex-row items-end justify-between">
        <View className="flex-1">
          <Text className="text-white font-bold text-base">{room.name}</Text>
          <Text className="text-white/70 text-xs mt-0.5">
            {onCount}/{totalCount || 0} is on
          </Text>
        </View>
        <View className="flex-row gap-2">
          {(['snow-outline', 'list-outline', 'bulb-outline'] as const).map((icon) => (
            <View
              key={icon}
              className="w-8 h-8 rounded-full bg-black/40 items-center justify-center"
            >
              <Ionicons name={icon} size={14} color="#fff" />
            </View>
          ))}
        </View>
      </View>
    </Pressable>
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

function NameStep({
  value,
  onChange,
  onBack,
  onCancel,
  onContinue,
}: {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onCancel: () => void;
  onContinue: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <StepHeader title="Room Name" onBack={onBack} />
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
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </View>
          <Text className="text-text text-xs mt-2">Take New Photo</Text>
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

function DevicesStep({
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

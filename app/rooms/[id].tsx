import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevices } from '@/hooks/useDevices';
import { useRooms } from '@/hooks/useRooms';
import { useTheme } from '@/hooks/useTheme';
import { DeviceCard } from '@/components/ui/DeviceCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { ImageViewer } from '@/components/ui/ImageViewer';
import type { RoomMedia } from '@/types';

type DeviceStep = null | 'pick' | 'success';
type MediaPanel = null | 'menu' | 'upload-source';

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
  const { rooms, addRoomMedia } = useRooms();
  const params = useLocalSearchParams<{ id: string }>();

  const room = rooms.find((r) => r.id === params.id) ?? rooms[0];
  const roomDevices = devices.filter((d) => d.room === room.name);
  const media = room.media ?? [];

  const [mediaPanel, setMediaPanel] = useState<MediaPanel>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const [step, setStep] = useState<DeviceStep>(null);
  const [pickedTypes, setPickedTypes] = useState<string[]>([]);

  const openAdd = () => {
    setPickedTypes([]);
    setStep('pick');
  };
  const togglePick = (id: string) =>
    setPickedTypes((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const handleView = () => {
    setMediaPanel(null);
    if (media.length === 0) {
      // Fall back to showing the room's hero photo as a single item so the
      // viewer always has something to render.
      Alert.alert('No uploaded media', 'Add a photo or video first.');
      return;
    }
    setViewerIndex(0);
    setViewerOpen(true);
  };

  const pickFromLibrary = async () => {
    setMediaPanel(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.8,
      allowsMultipleSelection: true,
    });
    if (result.canceled) return;
    const items: RoomMedia[] = result.assets.map((a) => ({
      uri: a.uri,
      type: a.type === 'video' ? 'video' : 'image',
    }));
    addRoomMedia(room.id, items);
  };

  const captureFromCamera = async () => {
    setMediaPanel(null);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.8,
    });
    if (result.canceled) return;
    const a = result.assets[0];
    addRoomMedia(room.id, [
      { uri: a.uri, type: a.type === 'video' ? 'video' : 'image' },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg" numberOfLines={1}>
            {room.name}
          </Text>
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
        <Pressable
          onPress={() => setMediaPanel('menu')}
          className="mx-5 rounded-2xl overflow-hidden mb-6 mt-2"
        >
          <Image
            source={room.image}
            resizeMode="cover"
            style={{ width: '100%', height: 200 }}
          />
          <View className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-black/50 items-center justify-center">
            <Ionicons name="camera-outline" size={18} color="#fff" />
          </View>
          {media.length > 0 ? (
            <View className="absolute top-3 left-3 bg-black/50 rounded-full px-2.5 py-1 flex-row items-center">
              <Ionicons name="images" size={12} color="#fff" />
              <Text className="text-white text-xs ml-1">{media.length}</Text>
            </View>
          ) : null}
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

      {/* Media menu */}
      <BottomSheet
        visible={mediaPanel === 'menu'}
        onClose={() => setMediaPanel(null)}
      >
        <Text className="text-text font-semibold text-lg mb-4 text-center">
          Room Media
        </Text>
        <View className="gap-3">
          <MediaOption
            icon="images-outline"
            label={
              media.length > 0
                ? `View photos & videos (${media.length})`
                : 'View photos & videos'
            }
            onPress={handleView}
          />
          <MediaOption
            icon="add-circle-outline"
            label="Add photo or video"
            onPress={() => setMediaPanel('upload-source')}
          />
          <MediaOption
            icon="videocam-outline"
            label="Live CCTV feed"
            onPress={() => {
              setMediaPanel(null);
              Alert.alert('Live feed', 'CCTV streaming is not yet connected.');
            }}
          />
        </View>
      </BottomSheet>

      {/* Upload source picker */}
      <BottomSheet
        visible={mediaPanel === 'upload-source'}
        onClose={() => setMediaPanel(null)}
      >
        <View className="flex-row items-center justify-center mb-4">
          <Pressable
            onPress={() => setMediaPanel('menu')}
            hitSlop={10}
            className="absolute left-0"
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Add Media</Text>
        </View>
        <View className="gap-3">
          <MediaOption
            icon="image-outline"
            label="Choose from Library"
            onPress={pickFromLibrary}
          />
          <MediaOption
            icon="camera-outline"
            label="Take Photo or Video"
            onPress={captureFromCamera}
          />
        </View>
      </BottomSheet>

      {/* Add Device flow */}
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

      <ImageViewer
        visible={viewerOpen}
        items={media}
        initialIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
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

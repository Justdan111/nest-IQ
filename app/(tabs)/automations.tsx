import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TodaySceneCard } from '@/components/automations/TodaySceneCard';
import { SceneRow } from '@/components/automations/SceneRow';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { LabeledToggle } from '@/components/ui/DeviceToggleRow';
import { useScenes } from '@/hooks/useScenes';
import { useDevices } from '@/hooks/useDevices';
import { useSidebar } from '@/components/ui/Sidebar';
import { useTheme } from '@/hooks/useTheme';
import type { Device } from '@/types';

type Step =
  | null
  | 'add-scene' // pick suggested or Create New
  | 'create-name' // scene name + schedule yes/no
  | 'add-device' // select devices to include
  | 'confirm-device' // review chosen devices
  | 'success';

type SceneAction = { sceneId: string } | null;

// Tint each device's confirmation-card icon by type so the review grid feels
// "characterized" like the mockup (lock = amber, camera = blue, …).
const TYPE_TINT: Record<NonNullable<Device['type']>, { bg: string; fg: string }> = {
  ac: { bg: '#1F2A4A', fg: '#3B6FF0' },
  light: { bg: '#3A2F12', fg: '#EF9F27' },
  fan: { bg: '#3A1F26', fg: '#C97E8A' },
  speaker: { bg: '#0F2F2D', fg: '#3FBF7F' },
  camera: { bg: '#1F2A4A', fg: '#3B6FF0' },
  lock: { bg: '#3A2F12', fg: '#EF9F27' },
};

// Round-robin colors assigned to user-created scenes for the Today's grid.
const SCENE_PALETTE = ['#1A1A1A', '#3B6FF0', '#C97E8A', '#5A8C95'];

export default function AutomationsScreen() {
  const router = useRouter();
  const { open } = useSidebar();
  const { colors } = useTheme();
  const { scenes, suggested, addScene, updateScene, deleteScene } = useScenes();
  const { devices } = useDevices();

  // Multi-step flow state.
  const [step, setStep] = useState<Step>(null);
  const [sceneName, setSceneName] = useState('');
  const [schedule, setSchedule] = useState<'yes' | 'no' | null>(null);
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  // When set, the multi-step flow saves into this scene instead of creating one.
  const [editingId, setEditingId] = useState<string | null>(null);
  // Action sheet for an existing scene (Edit / Delete).
  const [action, setAction] = useState<SceneAction>(null);
  const actionScene = useMemo(
    () => scenes.find((s) => s.id === action?.sceneId) ?? null,
    [scenes, action],
  );

  const pickedDevices = useMemo(
    () => devices.filter((d) => pickedIds.includes(d.id)),
    [devices, pickedIds],
  );

  const startCreate = () => {
    setEditingId(null);
    setSceneName('');
    setSchedule(null);
    setPickedIds([]);
    setStep('add-scene');
  };

  const startEdit = (id: string) => {
    const scene = scenes.find((s) => s.id === id);
    if (!scene) return;
    setEditingId(id);
    setSceneName(scene.name);
    setSchedule(scene.time === 'Anytime' ? 'no' : 'yes');
    setPickedIds([]);
    setAction(null);
    // Skip the suggested-scene picker on edit — go straight to the name step.
    setStep('create-name');
  };

  const confirmDelete = (id: string) => {
    const scene = scenes.find((s) => s.id === id);
    if (!scene) return;
    setAction(null);
    Alert.alert(
      'Delete scene?',
      `"${scene.name}" will be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteScene(id),
        },
      ],
    );
  };

  const closeAll = () => {
    setStep(null);
    setEditingId(null);
    setSceneName('');
    setSchedule(null);
    setPickedIds([]);
  };

  const pickSuggested = (name: string) => {
    setSceneName(name);
    setStep('create-name');
  };

  const togglePick = (id: string) =>
    setPickedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const confirmScene = () => {
    const name = sceneName.trim() || 'New Scene';
    const time = schedule === 'yes' ? 'Now' : 'Anytime';
    const repeat = schedule === 'yes' ? 'Today' : 'Once';
    if (editingId) {
      updateScene(editingId, { name, time, repeat });
    } else {
      const idx = scenes.length % SCENE_PALETTE.length;
      addScene({
        name,
        time,
        repeat,
        icon: 'flash',
        color: SCENE_PALETTE[idx],
        status: 'Scheduled',
      });
    }
    setStep('success');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-2 mb-6">
          <Pressable onPress={open} hitSlop={10}>
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Automations</Text>
          <Pressable hitSlop={10}>
            <View className="w-9 h-9 rounded-full bg-surface items-center justify-center">
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
            </View>
          </Pressable>
        </View>

        <View className="px-5">
          <SectionHeader
            title="Scenes"
            actionLabel="Add New"
            actionVariant="pill"
            onAction={startCreate}
          />
          {suggested.map((s) => (
            <SceneRow
              key={s.id}
              name={s.name}
              icon={s.icon as keyof typeof Ionicons.glyphMap}
              description={s.description}
              onPress={() => {
                setSceneName(s.name);
                setSchedule(null);
                setPickedIds([]);
                setStep('create-name');
              }}
            />
          ))}
        </View>

        <View className="px-5 mt-6">
          <SectionHeader
            title="Today's Scenes"
            actionLabel="Add New"
            actionVariant="pill"
            onAction={startCreate}
          />
          <FlatList
            data={scenes}
            keyExtractor={(s) => s.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
            renderItem={({ item }) => <TodaySceneCard scene={item} />}
          />
        </View>
      </ScrollView>

      {/* Step 1 — Add a Scene (suggested + Create New) */}
      <BottomSheet visible={step === 'add-scene'} onClose={closeAll}>
        <StepHeader title="Add a Scene" onBack={closeAll} />
        <Text className="text-text font-bold text-lg mb-3">Suggested Scenes</Text>
        {suggested.map((s) => (
          <SceneRow
            key={s.id}
            name={s.name}
            icon={s.icon as keyof typeof Ionicons.glyphMap}
            description={s.description}
            onPress={() => pickSuggested(s.name)}
          />
        ))}
        <View className="mt-2">
          <Button label="Create New" onPress={() => setStep('create-name')} />
        </View>
      </BottomSheet>

      {/* Step 2 — Scene name + schedule yes/no */}
      <BottomSheet visible={step === 'create-name'} onClose={closeAll}>
        <StepHeader title="Add a Scene" onBack={() => setStep('add-scene')} />
        <Text className="text-textSecondary text-sm mb-2">Scene Name</Text>
        <View className="flex-row items-center bg-background border border-primary rounded-xl px-4 mb-5">
          <TextInput
            value={sceneName}
            onChangeText={setSceneName}
            placeholder="Leave Home"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            className="flex-1 text-text py-3 text-base"
          />
          {sceneName ? (
            <Pressable onPress={() => setSceneName('')} hitSlop={6}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
        <Text className="text-textSecondary text-sm mb-3">
          Do you want to schedule this Scene?
        </Text>
        <View className="flex-row gap-3 mb-6">
          {(['no', 'yes'] as const).map((opt) => {
            const active = schedule === opt;
            return (
              <Pressable
                key={opt}
                onPress={() => setSchedule(opt)}
                className="flex-1 py-3.5 rounded-2xl items-center"
                style={{
                  borderWidth: 2,
                  borderColor: active ? colors.primary : colors.border,
                }}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: active ? colors.primary : colors.text }}
                >
                  {opt === 'yes' ? 'Yes' : 'No'}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Button
          label="Continue"
          onPress={() => setStep('add-device')}
          disabled={!sceneName.trim() || !schedule}
        />
      </BottomSheet>

      {/* Step 3 — Pick devices to include in the scene */}
      <BottomSheet visible={step === 'add-device'} onClose={closeAll}>
        <StepHeader title="Add Device" onBack={() => setStep('create-name')} />
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-text font-bold text-lg">Devices</Text>
          <Pressable
            onPress={() => router.push('/devices/add')}
            hitSlop={6}
            className="flex-row items-center bg-background rounded-full pl-1 pr-4 py-1"
          >
            <View className="w-7 h-7 rounded-full bg-primary items-center justify-center mr-2">
              <Ionicons name="add" size={18} color="#fff" />
            </View>
            <Text className="text-text text-sm font-medium">Add New</Text>
          </Pressable>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 380 }}
        >
          <View className="gap-3 mb-4">
            {devices.map((d) => (
              <SceneDeviceRow
                key={d.id}
                device={d}
                selected={pickedIds.includes(d.id)}
                onToggle={() => togglePick(d.id)}
              />
            ))}
          </View>
        </ScrollView>
        <Button
          label="Continue"
          onPress={() => setStep('confirm-device')}
          disabled={pickedIds.length === 0}
        />
      </BottomSheet>

      {/* Step 4 — Review chosen devices and confirm */}
      <BottomSheet visible={step === 'confirm-device'} onClose={closeAll}>
        <StepHeader title="Added Device" onBack={() => setStep('add-device')} />
        <Text className="text-text text-base mb-4">
          You have selected {numberWord(pickedDevices.length)} device
          {pickedDevices.length === 1 ? '' : 's'} to being on!
        </Text>
        <View className="flex-row flex-wrap mb-5" style={{ gap: 12 }}>
          {pickedDevices.map((d) => (
            <ConfirmedDeviceCard key={d.id} device={d} />
          ))}
        </View>
        <Button label="Confirm" onPress={confirmScene} />
      </BottomSheet>

      <SuccessModal
        visible={step === 'success'}
        title="Congratulation!"
        message={
          pickedDevices.length === 1
            ? `${pickedDevices[0].name} added to ${sceneName.trim() || 'scene'}!`
            : `${pickedDevices.length} devices added to ${sceneName.trim() || 'scene'}!`
        }
        ctaLabel="Home"
        onClose={closeAll}
      />
    </SafeAreaView>
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

function SceneDeviceRow({
  device,
  selected,
  onToggle,
}: {
  device: Device;
  selected: boolean;
  onToggle: () => void;
}) {
  // Mirrors the look of DeviceToggleRow but the on/off is the "include in this
  // scene" state, not the device's live power state.
  return (
    <View
      className={`${selected ? 'bg-primary' : 'bg-surface'} rounded-2xl p-5 flex-row items-center`}
    >
      <View className="flex-1">
        <Text
          className={`font-semibold text-base ${selected ? 'text-white' : 'text-text'}`}
        >
          {device.name}
        </Text>
        <Text
          className={`text-xs mt-1 ${selected ? 'text-white/80' : 'text-textSecondary'}`}
        >
          {selected ? 'Always' : device.status}
        </Text>
      </View>
      <LabeledToggle value={selected} onPress={onToggle} />
    </View>
  );
}

function ConfirmedDeviceCard({ device }: { device: Device }) {
  const tint = TYPE_TINT[device.type ?? 'lock'] ?? TYPE_TINT.lock;
  return (
    <View
      className="bg-surface rounded-2xl p-4"
      style={{ width: '47%' }}
    >
      <View
        className="w-11 h-11 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: tint.bg }}
      >
        <Ionicons
          name={device.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={tint.fg}
        />
      </View>
      <Text className="text-text font-bold text-base">{device.name}</Text>
      <Text className="text-textSecondary text-xs mt-1 mb-3">connected</Text>
      <LabeledToggle value onPress={() => {}} />
    </View>
  );
}

function numberWord(n: number): string {
  switch (n) {
    case 1:
      return 'one';
    case 2:
      return 'two';
    case 3:
      return 'three';
    case 4:
      return 'four';
    default:
      return String(n);
  }
}

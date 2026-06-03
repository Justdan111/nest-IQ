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
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TodaySceneCard } from '@/components/automations/TodaySceneCard';
import { SceneRow } from '@/components/automations/SceneRow';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { LabeledToggle } from '@/components/ui/DeviceToggleRow';
import { useScenes } from '@/hooks/useScenes';
import { useDevices } from '@/hooks/useDevices';
import { useTheme } from '@/hooks/useTheme';
import { WheelPicker, range2 } from '@/components/device/WheelPicker';
import {
  formatSceneRepeat,
  formatSceneTime,
} from '@/utils/sceneFormatting';
import type { Device, SceneTrigger } from '@/types';

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

// WheelPicker values for the schedule time row.
const HOURS = range2(1, 12);
const MINUTES = range2(0, 59);
const PERIODS: string[] = ['AM', 'PM'];
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export default function AutomationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { scenes, suggested, addScene, updateScene, deleteScene } = useScenes();
  const { devices } = useDevices();

  // Multi-step flow state.
  const [step, setStep] = useState<Step>(null);
  const [sceneName, setSceneName] = useState('');
  const [schedule, setSchedule] = useState<'yes' | 'no' | null>(null);
  // Time picker state mirrors the WheelPicker shape used elsewhere: hour 1-12
  // (index 0-11), minute 0-59, period 0=AM, 1=PM. Default 7:00 AM everyday.
  const [trigHour, setTrigHour] = useState(6); // index → "07"
  const [trigMinute, setTrigMinute] = useState(0);
  const [trigPeriod, setTrigPeriod] = useState<0 | 1>(0);
  const [trigWeekdays, setTrigWeekdays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
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

  const resetTriggerToDefault = () => {
    setTrigHour(6); // index for "07" in HOURS
    setTrigMinute(0);
    setTrigPeriod(0);
    setTrigWeekdays([0, 1, 2, 3, 4, 5, 6]);
  };

  const startCreate = () => {
    setEditingId(null);
    setSceneName('');
    setSchedule(null);
    setPickedIds([]);
    resetTriggerToDefault();
    setStep('add-scene');
  };

  const startEdit = (id: string) => {
    const scene = scenes.find((s) => s.id === id);
    if (!scene) return;
    setEditingId(id);
    setSceneName(scene.name);
    setPickedIds(scene.deviceIds ?? []);
    if (scene.trigger) {
      const t = scene.trigger;
      const period = t.hour >= 12 ? 1 : 0;
      const h12 = t.hour % 12 === 0 ? 12 : t.hour % 12;
      setTrigHour(h12 - 1);
      setTrigMinute(t.minute);
      setTrigPeriod(period);
      setTrigWeekdays(t.weekdays);
      setSchedule('yes');
    } else {
      resetTriggerToDefault();
      setSchedule('no');
    }
    setAction(null);
    // Edit jumps straight to the name + time step.
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
    resetTriggerToDefault();
  };

  /** Build the structured trigger from the local picker state. */
  const buildTrigger = (): SceneTrigger | undefined => {
    if (schedule !== 'yes') return undefined;
    const h12 = trigHour + 1; // 1-12
    const hour24 =
      trigPeriod === 1
        ? h12 === 12
          ? 12
          : h12 + 12
        : h12 === 12
          ? 0
          : h12;
    return {
      hour: hour24,
      minute: trigMinute,
      weekdays: [...trigWeekdays].sort((a, b) => a - b),
    };
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
    const trigger = buildTrigger();
    const time = trigger ? formatSceneTime(trigger) : 'Anytime';
    const repeat = trigger ? formatSceneRepeat(trigger.weekdays) : 'Once';
    if (editingId) {
      updateScene(editingId, {
        name,
        time,
        repeat,
        trigger,
        deviceIds: pickedIds,
      });
    } else {
      const idx = scenes.length % SCENE_PALETTE.length;
      addScene({
        name,
        time,
        repeat,
        icon: 'flash',
        color: SCENE_PALETTE[idx],
        status: 'Scheduled',
        trigger,
        deviceIds: pickedIds,
      });
    }
    setStep('success');
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
      >
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
            renderItem={({ item }) => (
              <TodaySceneCard
                scene={item}
                onPress={(s) => setAction({ sceneId: s.id })}
              />
            )}
          />
        </View>
      </ScrollView>

      {/* Scene action sheet — Edit / Delete for an existing scene */}
      <BottomSheet visible={action !== null} onClose={() => setAction(null)}>
        <Text className="text-text font-semibold text-lg mb-1 text-center">
          {actionScene?.name ?? 'Scene'}
        </Text>
        <Text className="text-textSecondary text-xs mb-5 text-center">
          {actionScene
            ? `${actionScene.time} ${actionScene.repeat}`
            : ''}
        </Text>
        <View className="gap-3">
          <Pressable
            onPress={() => actionScene && startEdit(actionScene.id)}
            className="bg-background border border-border rounded-2xl p-4 flex-row items-center"
          >
            <View className="w-10 h-10 rounded-full bg-primary/15 items-center justify-center">
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </View>
            <Text className="text-text font-medium ml-3 flex-1">Edit scene</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            onPress={() => actionScene && confirmDelete(actionScene.id)}
            className="bg-background border border-border rounded-2xl p-4 flex-row items-center"
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(226, 75, 74, 0.15)' }}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </View>
            <Text className="text-error font-medium ml-3 flex-1">Delete scene</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>
      </BottomSheet>

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
        <StepHeader
          title={editingId ? 'Edit Scene' : 'Add a Scene'}
          onBack={editingId ? closeAll : () => setStep('add-scene')}
        />
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

        {schedule === 'yes' ? (
          <View className="mb-6">
            <Text className="text-textSecondary text-sm mb-2">Time</Text>
            <View className="flex-row items-center justify-center mb-4">
              <WheelPicker
                values={HOURS}
                selectedIndex={trigHour}
                onChange={setTrigHour}
              />
              <Text className="text-text text-3xl font-bold mx-1">:</Text>
              <WheelPicker
                values={MINUTES}
                selectedIndex={trigMinute}
                onChange={setTrigMinute}
              />
              <WheelPicker
                width={64}
                values={PERIODS}
                selectedIndex={trigPeriod}
                onChange={(i) => setTrigPeriod(i as 0 | 1)}
              />
            </View>
            <Text className="text-textSecondary text-sm mb-2">Repeat</Text>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {WEEKDAY_LABELS.map((label, i) => {
                const active = trigWeekdays.includes(i);
                return (
                  <Pressable
                    key={label}
                    onPress={() =>
                      setTrigWeekdays((prev) =>
                        prev.includes(i)
                          ? prev.filter((d) => d !== i)
                          : [...prev, i],
                      )
                    }
                    className={`px-3 py-2 rounded-full ${active ? 'bg-primary' : 'bg-background border border-border'}`}
                  >
                    <Text
                      className={`text-xs font-semibold ${active ? 'text-white' : 'text-textSecondary'}`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text className="text-textMuted text-xs mt-2">
              No days selected = fire once at the next occurrence.
            </Text>
          </View>
        ) : null}

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
        title={editingId ? 'Saved!' : 'Congratulation!'}
        message={
          editingId
            ? `${sceneName.trim() || 'Scene'} updated.`
            : pickedDevices.length === 1
              ? `${pickedDevices[0].name} added to ${sceneName.trim() || 'scene'}!`
              : `${pickedDevices.length} devices added to ${sceneName.trim() || 'scene'}!`
        }
        ctaLabel={editingId ? 'Done' : 'Home'}
        onClose={closeAll}
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

import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { useTheme } from '@/hooks/useTheme';
import { haptic } from '@/utils/haptics';

type Door = { id: string; name: string; tint: string; locked: boolean };
type Section = { title: string; doors: Door[] };

const INITIAL: Section[] = [
  {
    title: 'Main Doors',
    doors: [
      { id: 'm1', name: 'Front Door', tint: '#F8E7BD', locked: true },
      { id: 'm2', name: 'Side Door', tint: '#F7D2D2', locked: false },
    ],
  },
  {
    title: 'Garage Doors',
    doors: [
      { id: 'g1', name: 'Front Door', tint: '#D1E0F8', locked: true },
      { id: 'g2', name: 'Side Door', tint: '#F7D2D2', locked: false },
    ],
  },
  {
    title: 'Room Doors',
    doors: [
      { id: 'r1', name: "Kid's Room", tint: '#D1E0F8', locked: true },
      { id: 'r2', name: 'Guest Room', tint: '#F7D2D2', locked: false },
      { id: 'r3', name: 'Study Room', tint: '#F8E7BD', locked: false },
      { id: 'r4', name: 'Master Bedroom', tint: '#D1E0F8', locked: true },
    ],
  },
];

export default function SecurityScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { awayMode, setAwayMode } = useAppState();

  const [sections, setSections] = useState<Section[]>(INITIAL);
  const mode = awayMode ? 'away' : 'home';

  const setLock = (doorId: string, locked: boolean) =>
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        doors: s.doors.map((d) => (d.id === doorId ? { ...d, locked } : d)),
      })),
    );

  const setAllLocked = (locked: boolean) =>
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        doors: s.doors.map((d) => ({ ...d, locked })),
      })),
    );

  const selectMode = (next: 'home' | 'away') => {
    haptic(next === 'away' ? 'warning' : 'success');
    setAwayMode(next === 'away');
    // Leaving the house locks everything up.
    if (next === 'away') setAllLocked(true);
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Security</Text>
          <View style={{ width: 26 }} />
        </View>
      </SafeAreaView>

      {/* Home / Away segmented control */}
      <View className="mx-5 mt-1 mb-2 flex-row bg-surface rounded-2xl p-1">
        {(['home', 'away'] as const).map((m) => {
          const active = mode === m;
          return (
            <Pressable
              key={m}
              onPress={() => selectMode(m)}
              className={`flex-1 py-3 rounded-xl items-center ${active ? 'bg-primary' : ''}`}
            >
              <Text
                className={`font-semibold text-base ${active ? 'text-white' : 'text-textSecondary'}`}
              >
                {m === 'home' ? 'Home' : 'Away'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
      >
        {sections.map((section) => (
          <View key={section.title} className="mt-5">
            <Text className="text-text font-bold text-lg mb-2">
              {section.title}
            </Text>
            {section.doors.map((door) => (
              <DoorRow key={door.id} door={door} onSetLock={setLock} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function DoorRow({
  door,
  onSetLock,
}: {
  door: Door;
  onSetLock: (id: string, locked: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center py-3">
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: door.tint }}
      >
        <DoorGlyph />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-text font-semibold text-base">{door.name}</Text>
        <Text className="text-textSecondary text-xs mt-0.5">
          {door.locked ? 'Door Lock' : 'Door Unlock'}
        </Text>
      </View>
      <View className="flex-row gap-2">
        <Pressable
          onPress={() => {
            // Locking is a high-stakes action — give it a firm thunk.
            haptic('heavy');
            onSetLock(door.id, true);
          }}
          className={`w-9 h-9 rounded-full items-center justify-center ${door.locked ? 'bg-primary' : 'bg-surfaceAlt'}`}
        >
          <Ionicons
            name="lock-closed"
            size={16}
            color={door.locked ? '#fff' : colors.textSecondary}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            haptic('medium');
            onSetLock(door.id, false);
          }}
          className={`w-9 h-9 rounded-full items-center justify-center ${!door.locked ? 'bg-primary' : 'bg-surfaceAlt'}`}
        >
          <Ionicons
            name="lock-open"
            size={16}
            color={!door.locked ? '#fff' : colors.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

/** Small door pictogram (outline + handle dot) drawn on the pastel circle. */
function DoorGlyph() {
  return (
    <View
      style={{
        width: 16,
        height: 22,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 2,
      }}
    >
      <View
        style={{
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: '#1A1A1A',
        }}
      />
    </View>
  );
}

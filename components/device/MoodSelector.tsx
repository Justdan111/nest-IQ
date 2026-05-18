import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

type Mood = 'cool' | 'heat' | 'wind' | 'auto';

const MOODS: { id: Mood; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'cool', label: 'Cool', icon: 'snow-outline' },
  { id: 'heat', label: 'Heat', icon: 'flame-outline' },
  { id: 'wind', label: 'Wind', icon: 'leaf-outline' },
  { id: 'auto', label: 'Auto', icon: 'sync-outline' },
];

type Props = {
  selected: Mood;
  onSelect: (m: Mood) => void;
};

export function MoodSelector({ selected, onSelect }: Props) {
  const { colors } = useTheme();
  return (
    <View className="flex-row gap-3">
      {MOODS.map((m) => {
        const active = selected === m.id;
        const fg = active ? '#fff' : colors.text;
        return (
          <Pressable
            key={m.id}
            onPress={() => onSelect(m.id)}
            className={`flex-1 items-center py-4 rounded-2xl ${active ? 'bg-primary' : 'bg-surface'}`}
          >
            <Ionicons name={m.icon} size={22} color={fg} />
            <Text className="text-xs mt-2" style={{ color: fg }}>
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

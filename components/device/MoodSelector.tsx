import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  return (
    <View className="flex-row gap-3">
      {MOODS.map((m) => {
        const active = selected === m.id;
        return (
          <Pressable
            key={m.id}
            onPress={() => onSelect(m.id)}
            className={`flex-1 items-center py-4 rounded-2xl ${active ? 'bg-[#3B6FF0]' : 'bg-[#1A1A1A]'}`}
          >
            <Ionicons name={m.icon} size={22} color="#fff" />
            <Text className="text-white text-xs mt-2">{m.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

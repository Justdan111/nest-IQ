import { Pressable, Text, View } from 'react-native';

type Tone = 'warm' | 'cold';

type Props = {
  value: Tone;
  onChange: (v: Tone) => void;
};

export function ToneGlowToggle({ value, onChange }: Props) {
  return (
    <View className="flex-row bg-[#1A1A1A] rounded-full p-1">
      {(['warm', 'cold'] as Tone[]).map((t) => {
        const active = value === t;
        return (
          <Pressable
            key={t}
            onPress={() => onChange(t)}
            className={`flex-1 py-3 rounded-full items-center ${active ? 'bg-[#3B6FF0]' : ''}`}
          >
            <Text
              className={`text-sm font-semibold ${active ? 'text-white' : 'text-[#8A8A8A]'}`}
            >
              {t === 'warm' ? 'Warm' : 'Cold'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

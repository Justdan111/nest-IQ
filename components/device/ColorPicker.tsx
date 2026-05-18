import { Pressable, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const COLORS = [
  '#3B6FF0',
  '#EF9F27',
  '#E24B4A',
  '#3FBF7F',
  '#C97E8A',
  '#9B6BE2',
  '#FFFFFF',
  '#5C5C5C',
];

type Props = {
  selected: string;
  onSelect: (color: string) => void;
};

export function ColorPicker({ selected, onSelect }: Props) {
  const { colors } = useTheme();
  return (
    <View className="flex-row flex-wrap gap-3 justify-between">
      {COLORS.map((c) => {
        const active = c === selected;
        return (
          <Pressable
            key={c}
            onPress={() => onSelect(c)}
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{
              backgroundColor: c,
              borderWidth: active ? 2 : 0,
              borderColor: colors.text,
            }}
          />
        );
      })}
    </View>
  );
}

import { Pressable, View } from 'react-native';

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
  return (
    <View className="flex-row flex-wrap gap-3 justify-between">
      {COLORS.map((c) => {
        const active = c === selected;
        return (
          <Pressable
            key={c}
            onPress={() => onSelect(c)}
            className={`w-14 h-14 rounded-full items-center justify-center ${active ? 'border-2 border-white' : ''}`}
            style={{ backgroundColor: c }}
          />
        );
      })}
    </View>
  );
}

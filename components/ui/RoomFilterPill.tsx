import { Pressable, Text, ScrollView } from 'react-native';

type Props = {
  rooms: string[];
  selected: string;
  onSelect: (room: string) => void;
};

export function RoomFilterPills({ rooms, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
    >
      {rooms.map((room) => {
        const active = room === selected;
        return (
          <Pressable
            key={room}
            onPress={() => onSelect(room)}
            className={`px-4 py-2 rounded-full ${active ? 'bg-primary' : 'bg-surface border border-border'}`}
          >
            <Text
              className={`text-sm ${active ? 'text-white font-semibold' : 'text-textSecondary'}`}
            >
              {room}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

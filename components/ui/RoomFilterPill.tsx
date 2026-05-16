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
            className={`px-4 py-2 rounded-full ${active ? 'bg-[#3B6FF0]' : 'bg-[#1A1A1A] border border-[#2A2A2A]'}`}
          >
            <Text
              className={`text-sm ${active ? 'text-white font-semibold' : 'text-[#8A8A8A]'}`}
            >
              {room}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

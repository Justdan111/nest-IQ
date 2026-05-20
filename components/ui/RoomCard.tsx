import { Image, Pressable, Text, View } from 'react-native';
import type { Room } from '@/types';

type Props = {
  room: Room;
  onPress?: (room: Room) => void;
};

/**
 * Pastel room card with a lighter "spotlight" blob in the top-right and the
 * room's furniture cut-out floating on top of it. Dark text always wins on
 * the pastel background, so the card looks the same in light and dark mode.
 */
export function RoomCard({ room, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress?.(room)}
      className="flex-1 rounded-2xl overflow-hidden"
      style={{ backgroundColor: room.tintColor, height: 160 }}
    >
      <View
        className="absolute rounded-full"
        style={{
          top: -28,
          right: -28,
          width: 130,
          height: 130,
          backgroundColor: room.blobColor,
        }}
      />
      {room.image ? (
        <Image
          source={room.image}
          resizeMode="contain"
          style={{
            position: 'absolute',
            top: 8,
            right: 4,
            width: 92,
            height: 84,
          }}
        />
      ) : null}
      <View className="absolute bottom-0 left-0 right-0 p-4">
        <Text className="text-[#1A1A1A] font-bold text-base">{room.name}</Text>
        <Text className="text-[#1A1A1A]/60 text-xs mt-0.5">{room.subtitle}</Text>
      </View>
    </Pressable>
  );
}

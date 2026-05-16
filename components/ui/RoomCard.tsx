import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Room } from '@/types';

type Props = {
  room: Room;
  onPress?: (room: Room) => void;
};

export function RoomCard({ room, onPress }: Props) {
  const content = (
    <View
      className="flex-1 justify-end p-4 rounded-2xl overflow-hidden"
      style={{ minHeight: 160, backgroundColor: room.tintColor }}
    >
      <View className="flex-row items-center mb-1">
        <Ionicons name="bed-outline" size={16} color="#1A1A1A" />
        <Text className="ml-1 text-[#1A1A1A]/80 text-xs">
          {room.deviceCount}/{room.totalDevices} Devices
        </Text>
      </View>
      <Text className="text-[#1A1A1A] font-bold text-base">{room.name}</Text>
    </View>
  );

  return (
    <Pressable onPress={() => onPress?.(room)} className="flex-1 rounded-2xl overflow-hidden">
      {room.image ? (
        <ImageBackground source={room.image} className="flex-1" imageStyle={{ borderRadius: 16 }}>
          <View
            className="flex-1 rounded-2xl"
            style={{ backgroundColor: `${room.tintColor}CC` }}
          >
            {content}
          </View>
        </ImageBackground>
      ) : (
        content
      )}
    </Pressable>
  );
}

import { useRef } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RoomMedia } from '@/types';

type Props = {
  visible: boolean;
  items: RoomMedia[];
  initialIndex?: number;
  onClose: () => void;
};

/**
 * Fullscreen, edge-to-edge media viewer. Horizontally pageable across the
 * supplied items; tapping anywhere on the image dismisses. Videos render a
 * placeholder card — full video playback isn't wired (no expo-av in deps).
 */
export function ImageViewer({
  visible,
  items,
  initialIndex = 0,
  onClose,
}: Props) {
  const ref = useRef<FlatList<RoomMedia>>(null);
  const { width, height } = Dimensions.get('window');

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <SafeAreaView
          edges={['top']}
          className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-end px-5"
        >
          <Pressable
            onPress={onClose}
            hitSlop={10}
            className="w-10 h-10 rounded-full bg-white/15 items-center justify-center mt-2"
          >
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>
        </SafeAreaView>

        <FlatList
          ref={ref}
          data={items}
          keyExtractor={(item, i) => `${item.uri}-${i}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={Math.min(initialIndex, Math.max(0, items.length - 1))}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <Pressable
              onPress={onClose}
              style={{ width, height }}
              className="items-center justify-center"
            >
              {item.type === 'video' ? (
                <View className="items-center">
                  <View className="w-20 h-20 rounded-full bg-white/15 items-center justify-center mb-3">
                    <Ionicons name="play" size={32} color="#fff" />
                  </View>
                  <Text className="text-white/80 text-sm">Video preview</Text>
                  <Text className="text-white/40 text-xs mt-1" numberOfLines={1}>
                    {item.uri.split('/').pop()}
                  </Text>
                </View>
              ) : (
                <Image
                  source={{ uri: item.uri }}
                  style={{ width, height }}
                  resizeMode="contain"
                />
              )}
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

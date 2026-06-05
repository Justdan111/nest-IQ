import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
  type ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { RoomMedia } from '@/types';

type Props = {
  visible: boolean;
  items: RoomMedia[];
  initialIndex?: number;
  onClose: () => void;
};

/**
 * Fullscreen, edge-to-edge media viewer. Horizontally pageable across the
 * supplied items. Images render via RN <Image>; videos render via expo-video's
 * <VideoView>, with playback paused for off-screen pages so only the visible
 * video plays at a time.
 */
export function ImageViewer({
  visible,
  items,
  initialIndex = 0,
  onClose,
}: Props) {
  const ref = useRef<FlatList<RoomMedia>>(null);
  const { width, height } = Dimensions.get('window');
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Reset when the modal opens so the index reflects the requested item.
  useEffect(() => {
    if (visible) setActiveIndex(initialIndex);
  }, [visible, initialIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

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
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          renderItem={({ item, index }) => (
            <MediaPage
              media={item}
              isActive={index === activeIndex}
              width={width}
              height={height}
              onTapImage={onClose}
            />
          )}
        />
      </View>
    </Modal>
  );
}

function MediaPage({
  media,
  isActive,
  width,
  height,
  onTapImage,
}: {
  media: RoomMedia;
  isActive: boolean;
  width: number;
  height: number;
  onTapImage: () => void;
}) {
  if (media.type === 'video') {
    return <VideoPage uri={media.uri} isActive={isActive} width={width} height={height} />;
  }
  return (
    <Pressable
      onPress={onTapImage}
      style={{ width, height }}
      className="items-center justify-center"
    >
      <Image
        source={{ uri: media.uri }}
        style={{ width, height }}
        resizeMode="contain"
      />
    </Pressable>
  );
}

function VideoPage({
  uri,
  isActive,
  width,
  height,
}: {
  uri: string;
  isActive: boolean;
  width: number;
  height: number;
}) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
  });

  // Pause off-screen pages so only the visible video plays.
  useEffect(() => {
    if (isActive) player.play();
    else player.pause();
  }, [isActive, player]);

  return (
    <View style={{ width, height }} className="items-center justify-center">
      <VideoView
        player={player}
        style={{ width, height }}
        contentFit="contain"
        allowsFullscreen
        nativeControls
      />
    </View>
  );
}

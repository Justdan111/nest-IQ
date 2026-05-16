import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DotIndicator } from '@/components/onboarding/DotIndicator';
import { SlideItem, type Slide } from '@/components/onboarding/SlideItem';

const { width } = Dimensions.get('window');

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Convenience',
    subtitle:
      'Control every device in your home from the palm of your hand — anywhere, anytime.',
    bg: null,
    bgColor: '#1F2A4A',
  },
  {
    id: '2',
    title: 'Stay informed',
    subtitle:
      'Get real-time updates and alerts about your home, energy, and security.',
    bg: null,
    bgColor: '#3A2530',
  },
  {
    id: '3',
    title: 'Automate',
    subtitle:
      'Build powerful routines that run themselves — wake up, leave, sleep.',
    bg: null,
    bgColor: '#222F22',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  const goNext = () => {
    if (isLast) {
      router.replace('/(auth)/welcome');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const skip = () => router.replace('/(auth)/welcome');

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setIndex(viewableItems[0].index);
      }
    },
  ).current;

  return (
    <View className="flex-1 bg-black">
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item, index: i }) => (
          <SlideItem
            slide={item}
            index={i}
            footer={
              <View className="flex-row items-center justify-between">
                <DotIndicator count={SLIDES.length} activeIndex={index} />
                <Pressable
                  onPress={goNext}
                  className="w-14 h-14 rounded-full bg-[#3B6FF0] items-center justify-center"
                >
                  <Ionicons name="arrow-forward" size={22} color="#fff" />
                </Pressable>
              </View>
            }
          />
        )}
      />
      <SafeAreaView
        edges={['top']}
        className="absolute top-0 left-0 right-0 flex-row justify-end px-5"
      >
        <Pressable onPress={skip} hitSlop={10} className="py-2">
          <Text className="text-white text-base font-medium">Skip</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

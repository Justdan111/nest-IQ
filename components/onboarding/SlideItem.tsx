import { Dimensions, ImageBackground, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  bg: any | null;
  bgColor: string;
};

type Props = {
  slide: Slide;
  index: number;
  footer: React.ReactNode;
};

export function SlideItem({ slide, index, footer }: Props) {
  const Body = (
    <SafeAreaView className="flex-1 justify-end" style={{ width, height }}>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%' }}
      />
      <Animated.View
        key={`s-${index}`}
        entering={FadeInRight.duration(420)}
        className="px-6 pb-10"
      >
        <Text className="text-white font-bold text-4xl mb-3">{slide.title}</Text>
        <Text className="text-white/80 text-base leading-6 mb-8">{slide.subtitle}</Text>
        {footer}
      </Animated.View>
    </SafeAreaView>
  );

  if (slide.bg) {
    return (
      <ImageBackground source={slide.bg} style={{ width, height }} resizeMode="cover">
        {Body}
      </ImageBackground>
    );
  }

  return (
    <View style={{ width, height, backgroundColor: slide.bgColor }}>
      <View className="absolute inset-0 items-center justify-center">
        <View className="flex-row flex-wrap" style={{ width: width * 0.7 }}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              className="w-1/2 p-1"
              style={{ height: width * 0.45 }}
            >
              <View
                className="flex-1 rounded-2xl"
                style={{
                  backgroundColor: ['#3B6FF0', '#EF9F27', '#C97E8A', '#1A1A1A'][i],
                  opacity: 0.85,
                }}
              />
            </View>
          ))}
        </View>
      </View>
      {Body}
    </View>
  );
}

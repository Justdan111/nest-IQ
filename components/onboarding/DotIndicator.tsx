import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

type Props = {
  count: number;
  activeIndex: number;
};

export function DotIndicator({ count, activeIndex }: Props) {
  return (
    <View className="flex-row items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} active={i === activeIndex} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const style = useAnimatedStyle(() => ({
    width: withSpring(active ? 24 : 8, { damping: 14 }),
    opacity: withSpring(active ? 1 : 0.4),
  }));
  return (
    <Animated.View
      style={style}
      className="h-2 rounded-full bg-white"
    />
  );
}

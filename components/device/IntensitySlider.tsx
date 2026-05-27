import { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const TRACK_HEIGHT = 6;
const THUMB_SIZE = 22;

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

/**
 * Custom 0–100 slider used by the Light control screen's intensity row. Built
 * on Reanimated + gesture-handler to avoid pulling in another dependency.
 */
export function IntensitySlider({ value, onChange, min = 0, max = 100 }: Props) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const offset = useSharedValue(0);
  const start = useSharedValue(0);

  const clampOffset = (next: number) => {
    'worklet';
    const usable = Math.max(0, trackWidth - THUMB_SIZE);
    return Math.min(usable, Math.max(0, next));
  };

  // Keep the thumb in sync with externally-controlled value.
  useDerivedValue(() => {
    const usable = Math.max(0, trackWidth - THUMB_SIZE);
    const pct = (value - min) / (max - min);
    offset.value = withTiming(clampOffset(pct * usable), { duration: 80 });
  }, [value, trackWidth, min, max]);

  const reportValue = (next: number) => {
    const usable = Math.max(1, trackWidth - THUMB_SIZE);
    const pct = next / usable;
    onChange(Math.round(min + pct * (max - min)));
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      start.value = offset.value;
    })
    .onUpdate((e) => {
      const next = clampOffset(start.value + e.translationX);
      offset.value = next;
      runOnJS(reportValue)(next);
    });

  const fillStyle = useAnimatedStyle(() => ({
    width: offset.value + THUMB_SIZE / 2,
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      style={{ height: THUMB_SIZE + 8, justifyContent: 'center' }}
    >
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: colors.surfaceAlt,
        }}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: colors.primary,
          },
          fillStyle,
        ]}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: colors.primary,
              borderWidth: 3,
              borderColor: '#FFFFFF',
            },
            thumbStyle,
          ]}
        />
      </GestureDetector>
    </View>
  );
}

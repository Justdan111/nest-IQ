import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size?: number;
  strokeWidth?: number;
  min?: number;
  max?: number;
  initial?: number;
  onChange?: (val: number) => void;
};

export function CircularTempSlider({
  size = 280,
  strokeWidth = 18,
  min = 16,
  max = 40,
  initial = 24,
  onChange,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  const [value, setValue] = useState(initial);
  const angle = useSharedValue(((initial - min) / (max - min)) * Math.PI * 1.5);

  const updateFromAngle = useCallback(
    (a: number) => {
      const pct = a / (Math.PI * 1.5);
      const v = Math.round(min + pct * (max - min));
      const clamped = Math.max(min, Math.min(max, v));
      setValue(clamped);
      onChange?.(clamped);
    },
    [max, min, onChange],
  );

  const pan = Gesture.Pan().onUpdate((e) => {
    'worklet';
    const dx = e.x - cx;
    const dy = e.y - cy;
    let a = Math.atan2(dy, dx) + Math.PI / 2;
    if (a < 0) a += Math.PI * 2;
    if (a > Math.PI * 1.5 && a < Math.PI * 1.75) a = Math.PI * 1.5;
    else if (a >= Math.PI * 1.75) a = 0;
    angle.value = a;
    runOnJS(updateFromAngle)(a);
  });

  const animatedProps = useAnimatedProps(() => {
    const pct = angle.value / (Math.PI * 1.5);
    return {
      strokeDashoffset: circumference * (1 - pct * 0.75),
    };
  });

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <GestureDetector gesture={pan}>
        <Animated.View>
          <Svg width={size} height={size}>
            <G rotation="135" origin={`${cx}, ${cy}`}>
              <Circle
                cx={cx}
                cy={cy}
                r={radius}
                stroke="#1A1A1A"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference * 0.75} ${circumference}`}
                strokeLinecap="round"
              />
              <AnimatedCircle
                cx={cx}
                cy={cy}
                r={radius}
                stroke="#3B6FF0"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference * 0.75} ${circumference}`}
                strokeLinecap="round"
                animatedProps={animatedProps}
              />
            </G>
            <SvgText
              x={cx}
              y={cy - size * 0.18}
              fill="#555555"
              fontSize="11"
              textAnchor="middle"
            >
              20°
            </SvgText>
            <SvgText
              x={cx + size * 0.32}
              y={cy + 4}
              fill="#555555"
              fontSize="11"
              textAnchor="middle"
            >
              30°
            </SvgText>
            <SvgText
              x={cx}
              y={cy + size * 0.22}
              fill="#555555"
              fontSize="11"
              textAnchor="middle"
            >
              40°
            </SvgText>
            <SvgText
              x={cx - size * 0.32}
              y={cy + 4}
              fill="#555555"
              fontSize="11"
              textAnchor="middle"
            >
              00°
            </SvgText>
          </Svg>
        </Animated.View>
      </GestureDetector>
      <View className="absolute items-center">
        <Text className="text-white font-bold" style={{ fontSize: 72 }}>
          {value}°
        </Text>
        <Text className="text-[#8A8A8A] text-sm">Room Temp</Text>
      </View>
    </View>
  );
}

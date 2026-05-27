import { useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const ITEM_HEIGHT = 56;
const VISIBLE_COUNT = 3;

type Props = {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  width?: number;
};

/**
 * Vertical wheel-style picker used by the AC timer and the light schedule
 * on/off time fields. The middle slot is the active value — items above and
 * below dim away. Snap is driven by `snapToInterval` so the picker always
 * lands on an exact row.
 */
export function WheelPicker({ values, selectedIndex, onChange, width = 76 }: Props) {
  const { colors } = useTheme();
  const ref = useRef<FlatList<string>>(null);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    setActiveIndex(selectedIndex);
    ref.current?.scrollToOffset({
      offset: selectedIndex * ITEM_HEIGHT,
      animated: false,
    });
  }, [selectedIndex]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(values.length - 1, i));
    if (clamped !== activeIndex) setActiveIndex(clamped);
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(values.length - 1, i));
    if (clamped !== selectedIndex) onChange(clamped);
  };

  return (
    <View style={{ width, height: ITEM_HEIGHT * VISIBLE_COUNT }}>
      <FlatList
        ref={ref}
        data={values}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        initialScrollIndex={selectedIndex}
        getItemLayout={(_, i) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * i,
          index: i,
        })}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item, index }) => {
          const distance = Math.abs(index - activeIndex);
          const isActive = distance === 0;
          return (
            <View
              style={{
                height: ITEM_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: isActive ? 32 : 22,
                  fontWeight: isActive ? '700' : '400',
                  color: isActive ? colors.text : colors.textMuted,
                  opacity: isActive ? 1 : distance === 1 ? 0.5 : 0.25,
                }}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />
      {/* Divider lines around the centered "active" slot. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: ITEM_HEIGHT,
          height: ITEM_HEIGHT,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.border,
        }}
      />
    </View>
  );
}

/** Two-digit zero-padded numbers from `start` to `end` inclusive. */
export const range2 = (start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) => String(start + i).padStart(2, '0'));

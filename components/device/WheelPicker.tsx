import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
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
 * below dim away. Snap is driven by `snapToInterval`.
 *
 * Value commits on BOTH momentum-end and drag-end so a slow precise drag
 * (which produces no momentum) still registers, and each row is also tappable
 * for a non-scroll way to pick.
 */
export function WheelPicker({ values, selectedIndex, onChange, width = 76 }: Props) {
  const { colors } = useTheme();
  const ref = useRef<FlatList<string>>(null);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  // Tracks the last value we know about so the sync effect below doesn't
  // re-scroll (and fight) the user's own in-progress gesture.
  const lastKnown = useRef(selectedIndex);

  useEffect(() => {
    if (selectedIndex === lastKnown.current) return;
    lastKnown.current = selectedIndex;
    setActiveIndex(selectedIndex);
    ref.current?.scrollToOffset({
      offset: selectedIndex * ITEM_HEIGHT,
      animated: false,
    });
  }, [selectedIndex]);

  const clamp = (i: number) => Math.max(0, Math.min(values.length - 1, i));

  const commit = (offsetY: number) => {
    const i = clamp(Math.round(offsetY / ITEM_HEIGHT));
    setActiveIndex(i);
    if (i !== lastKnown.current) {
      lastKnown.current = i;
      onChange(i);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = clamp(Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT));
    if (i !== activeIndex) setActiveIndex(i);
  };

  const handleDragEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Only commit here when the finger lifted without a fling; otherwise let
    // momentum settle and commit in onMomentumScrollEnd (avoids a double fire).
    const velocity = e.nativeEvent.velocity?.y ?? 0;
    if (Math.abs(velocity) < 0.1) commit(e.nativeEvent.contentOffset.y);
  };

  const selectIndex = (i: number) => {
    ref.current?.scrollToOffset({ offset: i * ITEM_HEIGHT, animated: true });
    setActiveIndex(i);
    if (i !== lastKnown.current) {
      lastKnown.current = i;
      onChange(i);
    }
  };

  return (
    <View style={{ width, height: ITEM_HEIGHT * VISIBLE_COUNT }}>
      <FlatList
        ref={ref}
        data={values}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        disableIntervalMomentum
        decelerationRate="fast"
        nestedScrollEnabled
        initialScrollIndex={selectedIndex}
        getItemLayout={(_, i) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * i,
          index: i,
        })}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollEndDrag={handleDragEnd}
        onMomentumScrollEnd={(e) => commit(e.nativeEvent.contentOffset.y)}
        renderItem={({ item, index }) => {
          const distance = Math.abs(index - activeIndex);
          const isActive = distance === 0;
          return (
            <Pressable
              onPress={() => selectIndex(index)}
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
            </Pressable>
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

import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import type { View as RNView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EnergyBar } from '@/components/statistic/EnergyBar';
import { ConsumptionRow } from '@/components/statistic/ConsumptionRow';
import { useSidebar } from '@/components/ui/Sidebar';
import { useTheme } from '@/hooks/useTheme';

type Period = 'daily' | 'weekly' | 'monthly';

const PERIOD_LABEL: Record<Period, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const PERIOD_DATA: Record<Period, { value: number; label: string; active?: boolean }[]> = {
  daily: [
    { value: 12, label: '12a' },
    { value: 8, label: '4a' },
    { value: 25, label: '8a' },
    { value: 55, label: '12p' },
    { value: 99, label: '4p', active: true },
    { value: 70, label: '8p' },
    { value: 40, label: '11p' },
  ],
  weekly: [
    { value: 60, label: 'Fri' },
    { value: 80, label: 'Sat' },
    { value: 99, label: 'Sun', active: true },
    { value: 55, label: 'Mon' },
    { value: 70, label: 'Tue' },
    { value: 45, label: 'Wed' },
    { value: 65, label: 'Thu' },
  ],
  monthly: [
    { value: 70, label: 'W1' },
    { value: 90, label: 'W2' },
    { value: 99, label: 'W3', active: true },
    { value: 75, label: 'W4' },
  ],
};

const CONSUMPTION = [
  {
    name: 'Ceiling light',
    icon: 'bulb-outline' as const,
    iconColor: '#EF9F27',
    deviceCount: 4,
    kwh: 120,
  },
  {
    name: 'Homepod',
    icon: 'radio' as const,
    iconColor: '#3B6FF0',
    deviceCount: 1,
    kwh: 20,
  },
  {
    name: 'Ceiling Fan',
    icon: 'aperture' as const,
    iconColor: '#3FBF7F',
    deviceCount: 3,
    kwh: 120,
  },
];

export default function StatisticScreen() {
  const { open } = useSidebar();
  const { colors } = useTheme();

  const [period, setPeriod] = useState<Period>('daily');

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-2 mb-6">
          <Pressable onPress={open} hitSlop={10}>
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Statistic</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </Pressable>
        </View>

        <View className="px-5 flex-row gap-3 mb-6">
          <View className="flex-1 bg-surface rounded-2xl p-4 flex-row items-center">
            <View className="w-11 h-11 rounded-full bg-warning/15 items-center justify-center">
              <Ionicons name="cash-outline" size={22} color="#EF9F27" />
            </View>
            <View className="ml-3">
              <Text className="text-text text-lg font-bold">$170.00</Text>
              <Text className="text-textSecondary text-xs">Cost</Text>
            </View>
          </View>
          <View className="flex-1 bg-surface rounded-2xl p-4 flex-row items-center">
            <View className="w-11 h-11 rounded-full bg-primary/15 items-center justify-center">
              <Ionicons name="flash" size={22} color="#3B6FF0" />
            </View>
            <View className="ml-3">
              <Text className="text-text text-lg font-bold">99 kWh</Text>
              <Text className="text-textSecondary text-xs">Usage</Text>
            </View>
          </View>
        </View>

        <View className="px-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text font-semibold text-lg">Activities</Text>
            <PeriodDropdown value={period} onChange={setPeriod} />
          </View>

          <View className="bg-surface rounded-2xl p-4 mb-6">
            <EnergyBar data={PERIOD_DATA[period]} />
          </View>

          <Text className="text-text font-semibold text-lg mb-2">
            Device Power Consumption
          </Text>
          <View>
            {CONSUMPTION.map((c) => (
              <ConsumptionRow key={c.name} {...c} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Compact dropdown anchored under its pill. Measures the pill in window
 * coordinates when opened so the menu lines up no matter what's above it,
 * and uses a transparent Modal so a tap anywhere outside closes it.
 */
function PeriodDropdown({
  value,
  onChange,
}: {
  value: Period;
  onChange: (next: Period) => void;
}) {
  const { colors } = useTheme();
  const anchorRef = useRef<RNView>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ x: number; y: number; w: number } | null>(
    null,
  );

  const openMenu = () => {
    anchorRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y: y + h + 6, w });
      setOpen(true);
    });
  };

  const select = (next: Period) => {
    onChange(next);
    setOpen(false);
  };

  const options: Period[] = ['daily', 'weekly', 'monthly'];

  return (
    <>
      <Pressable
        ref={anchorRef}
        onPress={openMenu}
        hitSlop={6}
        className="flex-row items-center bg-surface rounded-full px-3 py-1.5 border border-border"
      >
        <Text className="text-text text-xs mr-1">{PERIOD_LABEL[value]}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.text} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable className="flex-1" onPress={() => setOpen(false)}>
          {anchor ? (
            <View
              className="absolute bg-surface rounded-2xl py-1.5 border border-border"
              style={{
                top: anchor.y,
                // Right-align the menu under the pill's right edge so it
                // doesn't fall off-screen on smaller devices.
                left: Math.max(12, anchor.x + anchor.w - 140),
                minWidth: 140,
                elevation: 8,
                shadowColor: '#000',
                shadowOpacity: 0.25,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
              }}
            >
              {options.map((opt, i) => {
                const active = opt === value;
                return (
                  <View key={opt}>
                    <Pressable
                      onPress={() => select(opt)}
                      className="flex-row items-center justify-between px-4 py-3"
                    >
                      <Text
                        className="text-base"
                        style={{
                          color: active ? colors.primary : colors.text,
                          fontWeight: active ? '600' : '400',
                        }}
                      >
                        {PERIOD_LABEL[opt]}
                      </Text>
                      {active ? (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={colors.primary}
                        />
                      ) : null}
                    </Pressable>
                    {i < options.length - 1 ? (
                      <View className="h-px bg-border mx-3" />
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
}

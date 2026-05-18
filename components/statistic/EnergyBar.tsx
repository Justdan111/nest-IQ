import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  data: { value: number; label: string; active?: boolean }[];
};

export function EnergyBar({ data }: Props) {
  const { colors } = useTheme();
  const bars = data.map((d) => ({
    value: d.value,
    label: d.label,
    frontColor: d.active ? colors.primary : colors.surfaceAlt,
    topLabelComponent: d.active ? () => null : undefined,
    labelTextStyle: { color: colors.textSecondary, fontSize: 11 },
  }));

  return (
    <View className="bg-transparent">
      <BarChart
        data={bars}
        barWidth={22}
        spacing={18}
        roundedTop
        roundedBottom
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        noOfSections={4}
        maxValue={120}
        yAxisTextStyle={{ color: colors.textMuted, fontSize: 10 }}
        height={180}
        isAnimated
      />
    </View>
  );
}

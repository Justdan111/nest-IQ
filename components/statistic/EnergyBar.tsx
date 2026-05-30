import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  data: { value: number; label: string; active?: boolean }[];
};

export function EnergyBar({ data }: Props) {
  const { colors } = useTheme();
  // Auto-size bars so wider datasets (e.g. 12 months) still fit the card
  // without scrolling. Tuned by eye for the screen widths we support.
  const count = data.length;
  let barWidth = 22;
  let spacing = 18;
  let labelFontSize = 11;
  if (count >= 10) {
    barWidth = 14;
    spacing = 8;
    labelFontSize = 9;
  } else if (count >= 8) {
    barWidth = 18;
    spacing = 12;
    labelFontSize = 10;
  }

  const bars = data.map((d) => ({
    value: d.value,
    label: d.label,
    frontColor: d.active ? colors.primary : colors.surfaceAlt,
    topLabelComponent: d.active ? () => null : undefined,
    labelTextStyle: { color: colors.textSecondary, fontSize: labelFontSize },
  }));

  return (
    <View className="bg-transparent">
      <BarChart
        data={bars}
        barWidth={barWidth}
        spacing={spacing}
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

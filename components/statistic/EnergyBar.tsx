import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

type Props = {
  data: { value: number; label: string; active?: boolean }[];
};

export function EnergyBar({ data }: Props) {
  const bars = data.map((d) => ({
    value: d.value,
    label: d.label,
    frontColor: d.active ? '#3B6FF0' : '#1A1A1A',
    topLabelComponent: d.active ? () => null : undefined,
    labelTextStyle: { color: '#8A8A8A', fontSize: 11 },
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
        yAxisTextStyle={{ color: '#555555', fontSize: 10 }}
        height={180}
        isAnimated
      />
    </View>
  );
}

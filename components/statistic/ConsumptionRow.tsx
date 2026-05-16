import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  name: string;
  icon: keyof typeof import('@expo/vector-icons/Ionicons').default.glyphMap;
  iconColor: string;
  deviceCount: number;
  kwh: number;
};

export function ConsumptionRow({ name, icon, iconColor, deviceCount, kwh }: Props) {
  return (
    <View className="flex-row items-center py-3">
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: `${iconColor}22` }}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-white font-semibold text-base">{name}</Text>
        <Text className="text-[#8A8A8A] text-xs">{deviceCount} Devices</Text>
      </View>
      <Text className="text-white font-semibold">{kwh} kWh</Text>
    </View>
  );
}

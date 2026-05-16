import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EnergyBar } from '@/components/statistic/EnergyBar';
import { ConsumptionRow } from '@/components/statistic/ConsumptionRow';

const WEEK_DATA = [
  { value: 60, label: 'Fri' },
  { value: 80, label: 'Sat' },
  { value: 99, label: 'Sun', active: true },
  { value: 55, label: 'Mon' },
  { value: 70, label: 'Tue' },
  { value: 45, label: 'Wed' },
  { value: 65, label: 'Thu' },
];

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
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#0A0A0A]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-2 mb-6">
          <Pressable hitSlop={10}>
            <Ionicons name="menu" size={26} color="#fff" />
          </Pressable>
          <Text className="text-white font-semibold text-lg">Statistic</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </Pressable>
        </View>

        <View className="px-5 flex-row gap-3 mb-6">
          <View className="flex-1 bg-[#1A1A1A] rounded-2xl p-4 flex-row items-center">
            <View className="w-11 h-11 rounded-full bg-[#EF9F27]/15 items-center justify-center">
              <Ionicons name="cash-outline" size={22} color="#EF9F27" />
            </View>
            <View className="ml-3">
              <Text className="text-white text-lg font-bold">$170.00</Text>
              <Text className="text-[#8A8A8A] text-xs">Cost</Text>
            </View>
          </View>
          <View className="flex-1 bg-[#1A1A1A] rounded-2xl p-4 flex-row items-center">
            <View className="w-11 h-11 rounded-full bg-[#3B6FF0]/15 items-center justify-center">
              <Ionicons name="flash" size={22} color="#3B6FF0" />
            </View>
            <View className="ml-3">
              <Text className="text-white text-lg font-bold">99 kWh</Text>
              <Text className="text-[#8A8A8A] text-xs">Usage</Text>
            </View>
          </View>
        </View>

        <View className="px-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-semibold text-lg">Activities</Text>
            <View className="flex-row items-center bg-[#1A1A1A] rounded-full px-3 py-1.5 border border-[#2A2A2A]">
              <Text className="text-white text-xs mr-1">Daily</Text>
              <Ionicons name="chevron-down" size={14} color="#fff" />
            </View>
          </View>

          <View className="bg-[#1A1A1A] rounded-2xl p-4 mb-6">
            <EnergyBar data={WEEK_DATA} />
          </View>

          <Text className="text-white font-semibold text-lg mb-2">
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

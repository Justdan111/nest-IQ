import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevices } from '@/hooks/useDevices';
import { useRooms } from '@/hooks/useRooms';
import { useTheme } from '@/hooks/useTheme';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { SuccessModal } from '@/components/ui/SuccessModal';

type Mode = 'scan' | 'wifi';
type Step = null | 'name' | 'room' | 'success';

/**
 * Add Device flow. The base screen lets the user pick how they want to
 * pair (scan vs WiFi/BT); Continue triggers a sequence of bottom sheets
 * stacked on top of the photo — Name → Room — followed by the shared
 * SuccessModal.
 */
export default function AddDeviceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addDevice } = useDevices();
  const { rooms } = useRooms();

  const [mode, setMode] = useState<Mode>('scan');
  const [step, setStep] = useState<Step>(null);
  const [name, setName] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const closeSheet = () => setStep(null);
  const selectedRoomName =
    rooms.find((r) => r.id === selectedRoomId)?.name ?? '';

  const submit = () => {
    const trimmed = name.trim() || 'Device';
    addDevice({
      name: trimmed,
      icon: mode === 'scan' ? 'bulb' : 'wifi',
      status: 'Disconnected',
      isOn: false,
      kwhPerHour: 2,
      room: selectedRoomName,
    });
    setStep('success');
  };

  const finish = () => {
    setStep(null);
    // After success, replace so back button doesn't return into the add flow.
    router.replace('/devices');
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Device List</Text>
          <View className="w-9 h-9 rounded-full bg-surface items-center justify-center">
            <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <Text className="text-textSecondary text-base px-5 mb-4">
          Scan code or hold your phone near the device.
        </Text>

        <View className="mx-5 rounded-2xl overflow-hidden mb-6">
          <Image
            source={require('@/assets/images/onboard-3.png')}
            resizeMode="cover"
            style={{ width: '100%', height: 260 }}
          />
        </View>

        <View className="px-5">
          <ModeOption
            active={mode === 'scan'}
            icon="qr-code-outline"
            title="Scan Code"
            subtitle="Look for the code on the device, or its packaging"
            onPress={() => setMode('scan')}
          />
          <View className="h-px bg-border my-3" />
          <ModeOption
            active={mode === 'wifi'}
            icon="phone-portrait-outline"
            title="Connect via WIFI or Bluetooth"
            subtitle="Hold your phone near the device, using NFC phone..."
            onPress={() => setMode('wifi')}
          />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="px-5 pb-3">
        <Button label="Continue" onPress={() => setStep('name')} />
      </SafeAreaView>

      {/* Step 1 — Device Name */}
      <BottomSheet visible={step === 'name'} onClose={closeSheet}>
        <View className="flex-row items-center justify-center mb-5">
          <Pressable
            onPress={closeSheet}
            hitSlop={10}
            className="absolute left-0"
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Device Name</Text>
        </View>

        <Text className="text-textSecondary text-sm mb-2">Device Name</Text>
        <View className="flex-row items-center bg-background border border-primary rounded-xl px-4 mb-5">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Lamp Light"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            className="flex-1 text-text py-3 text-base"
          />
          {name ? (
            <Pressable onPress={() => setName('')} hitSlop={6}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <View className="gap-3">
          <Button
            label="Continue"
            onPress={() => setStep('room')}
            disabled={name.trim().length === 0}
          />
          <Button label="Cancel" variant="outline" onPress={closeSheet} />
        </View>
      </BottomSheet>

      {/* Step 2 — Select Room */}
      <BottomSheet visible={step === 'room'} onClose={closeSheet}>
        <View className="flex-row items-center justify-center mb-5">
          <Pressable
            onPress={() => setStep('name')}
            hitSlop={10}
            className="absolute left-0"
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Select Room</Text>
        </View>

        <View className="flex-row flex-wrap mb-6" style={{ gap: 10 }}>
          {rooms.map((r) => {
            const active = selectedRoomId === r.id;
            return (
              <Pressable
                key={r.id}
                onPress={() => setSelectedRoomId(active ? null : r.id)}
                className={`flex-row items-center pl-4 pr-3 py-2.5 rounded-full ${active ? 'bg-primary' : 'bg-background border border-border'}`}
              >
                <Text
                  className={`text-sm ${active ? 'text-white font-semibold' : 'text-textSecondary'}`}
                >
                  {r.name}
                </Text>
                {active ? (
                  <View className="w-4 h-4 rounded-full bg-white/25 items-center justify-center ml-2">
                    <Ionicons name="close" size={11} color="#fff" />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <Button
          label="Add Now"
          onPress={submit}
          disabled={!selectedRoomId}
        />
      </BottomSheet>

      <SuccessModal
        visible={step === 'success'}
        title="Congratulation!"
        message={`${name.trim() || 'Device'} added to ${selectedRoomName || 'home'}!`}
        ctaLabel="Home"
        onClose={finish}
      />
    </View>
  );
}

function ModeOption({
  active,
  icon,
  title,
  subtitle,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} className="flex-row items-start py-1.5">
      <View
        className="w-12 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: active ? colors.primary : colors.surface }}
      >
        <Ionicons name={icon} size={22} color={active ? '#fff' : colors.text} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-text font-semibold text-base">{title}</Text>
        <Text className="text-textSecondary text-xs mt-1">{subtitle}</Text>
      </View>
    </Pressable>
  );
}

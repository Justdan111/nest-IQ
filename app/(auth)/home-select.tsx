import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

type HomeOption = { id: string; label: string };

const HOME_OPTIONS: HomeOption[] = [
  { id: 'filllo', label: 'Filllo House' },
  { id: 'new', label: 'Create New' },
];

/**
 * Step 2 of post-signup setup — pick an existing associated home or
 * start a new one. Completes the signup flow → into the tabbed app.
 */
export default function HomeSelectScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selected, setSelected] = useState<string>('filllo');

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="bg-primary">
        <View className="flex-row items-center justify-center px-5 py-4">
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="absolute left-5"
          >
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </Pressable>
          <Text className="text-white font-semibold text-lg">Home Setup</Text>
        </View>
      </SafeAreaView>

      <Image
        source={require('@/assets/images/onboard-2.png')}
        resizeMode="cover"
        style={{ width: '100%', height: 220 }}
      />

      <View className="flex-1 px-6 pt-6">
        <Text className="text-text text-center text-base leading-6">
          Looks like you have homes associated with your account. Choose one to
          use with NestIQ.
        </Text>

        <View className="mt-8">
          {HOME_OPTIONS.map((opt, i) => {
            const active = selected === opt.id;
            return (
              <View key={opt.id}>
                <Pressable
                  onPress={() => setSelected(opt.id)}
                  className="flex-row items-center justify-between py-5"
                >
                  <Text
                    className={`text-base ${active ? 'text-text font-medium' : 'text-textSecondary'}`}
                  >
                    {opt.label}
                  </Text>
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{
                      borderWidth: 2,
                      borderColor: active ? colors.primary : colors.border,
                    }}
                  >
                    {active ? (
                      <View
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    ) : null}
                  </View>
                </Pressable>
                {i < HOME_OPTIONS.length - 1 ? (
                  <View className="h-px bg-border" />
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      <SafeAreaView edges={['bottom']} className="px-5 pb-4">
        <Button label="Continue" onPress={() => router.replace('/(tabs)')} />
      </SafeAreaView>
    </View>
  );
}

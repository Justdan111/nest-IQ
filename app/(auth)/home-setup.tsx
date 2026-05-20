import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';

/**
 * Step 1 of post-signup setup — explains what "home setup" means and
 * kicks the user into the home-selection step.
 */
export default function HomeSetupIntroScreen() {
  const router = useRouter();

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
        source={require('@/assets/images/setup.png')}
        resizeMode="cover"
        style={{ width: '100%', height: 240 }}
      />

      <View className="flex-1 px-6 pt-8">
        <Text className="text-text font-semibold text-xl text-center">
          You've set up your account. Now set up your home.
        </Text>
        <Text className="text-textSecondary text-sm text-center mt-3 leading-5">
          Adding a new home to your NestIQ account is the first step in bringing
          your products together in one place.
        </Text>
      </View>

      <SafeAreaView edges={['bottom']} className="px-5 pb-4">
        <Button
          label="Continue"
          onPress={() => router.push('/(auth)/home-select')}
        />
      </SafeAreaView>
    </View>
  );
}

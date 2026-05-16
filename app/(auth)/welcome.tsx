import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A]">
      <View className="flex-1 px-6 pt-6">
        <View className="items-center">
          <Text className="text-3xl font-bold">
            <Text className="text-white">Smart</Text>
            <Text className="text-[#EF9F27]">Home</Text>
          </Text>
          <Text className="text-[#8A8A8A] text-base text-center mt-3 max-w-[80%]">
            Your home is now smarter. Control everything from one place.
          </Text>
        </View>

        <View className="flex-1 items-center justify-center my-6">
          <View
            className="w-72 h-72 rounded-full items-center justify-center"
            style={{ backgroundColor: '#EF9F27' }}
          >
            <View
              className="w-56 h-56 rounded-full items-center justify-center"
              style={{ backgroundColor: '#F4B85B' }}
            >
              <Ionicons name="home" size={120} color="#1A1A1A" />
            </View>
          </View>
        </View>

        <View className="gap-3 mb-6">
          <Button label="Create a account" onPress={() => router.push('/(auth)/sign-up')} />
          <Button
            label="Sign In"
            variant="outline"
            onPress={() => router.push('/(auth)/sign-in')}
          />
          <View className="flex-row justify-center gap-4 mt-4">
            {[
              { name: 'logo-facebook' as const, color: '#1877F2' },
              { name: 'logo-google' as const, color: '#EA4335' },
              { name: 'logo-twitter' as const, color: '#1DA1F2' },
            ].map((s) => (
              <Pressable
                key={s.name}
                className="w-12 h-12 rounded-full bg-[#1A1A1A] items-center justify-center border border-[#2A2A2A]"
              >
                <Ionicons name={s.name} size={22} color={s.color} />
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/images/onboard-2.png')}
      resizeMode="cover"
      className="flex-1"
    >
      {/* Scrim — keeps the branding and CTAs legible over the photo. */}
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.92)']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 pt-10 justify-between">
          <View className="items-center">
            <View className="w-16 h-16 rounded-3xl bg-warning items-center justify-center mb-5">
              <Ionicons name="home" size={32} color="#1A1A1A" />
            </View>
            <Text className="text-4xl font-bold">
              <Text className="text-white">Smart</Text>
              <Text className="text-warning">Home</Text>
            </Text>
            <Text className="text-white/75 text-base text-center mt-3 max-w-[82%]">
              Your home is now smarter. Control everything from one place.
            </Text>
          </View>

          <View className="gap-3 mb-4">
            <Button
              label="Create a account"
              onPress={() => router.push('/(auth)/sign-up')}
            />
            <Pressable
              onPress={() => router.push('/(auth)/sign-in')}
              className="rounded-full py-4 items-center justify-center border border-white/40 bg-white/10"
            >
              <Text className="text-white font-semibold text-base">Sign In</Text>
            </Pressable>
            <View className="flex-row justify-center gap-4 mt-4">
              {[
                { name: 'logo-facebook' as const, color: '#1877F2' },
                { name: 'logo-google' as const, color: '#EA4335' },
                { name: 'logo-twitter' as const, color: '#1DA1F2' },
              ].map((s) => (
                <Pressable
                  key={s.name}
                  className="w-12 h-12 rounded-full bg-white/15 items-center justify-center border border-white/20"
                >
                  <Ionicons name={s.name} size={22} color={s.color} />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

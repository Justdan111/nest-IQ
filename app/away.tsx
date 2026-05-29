import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/Button';

export default function AwayModeScreen() {
  const router = useRouter();
  const { setAwayMode } = useAppState();

  const goHome = () => {
    setAwayMode(false);
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 px-6">
        <Text className="text-text font-bold text-2xl text-center mt-8">
          Have a good day
        </Text>

        <View className="flex-1 items-center justify-center">
          {/* Stylized "leaving home" scene. */}
          <View
            className="rounded-full overflow-hidden items-center justify-center"
            style={{ width: 240, height: 240 }}
          >
            <LinearGradient
              colors={['#BFE3FF', '#EAF6FF']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            {/* Sun */}
            <View
              className="absolute rounded-full"
              style={{ top: 44, right: 64, width: 46, height: 46, backgroundColor: '#FBD24B' }}
            />
            {/* Cloud */}
            <View
              className="absolute rounded-full"
              style={{ top: 60, left: 48, width: 40, height: 22, backgroundColor: '#FFFFFF' }}
            />
            {/* Ground */}
            <View
              className="absolute"
              style={{ bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#9BD18B' }}
            />
            {/* Car */}
            <Ionicons
              name="car-sport"
              size={92}
              color="#E24B4A"
              style={{ marginTop: 70 }}
            />
          </View>
          {/* Lock badge */}
          <View
            className="w-14 h-14 rounded-full bg-primary items-center justify-center"
            style={{ marginTop: -28, borderWidth: 4, borderColor: '#0A0A0A' }}
          >
            <Ionicons name="lock-closed" size={22} color="#fff" />
          </View>

          <Text className="text-textSecondary text-base text-center mt-10 max-w-[85%] leading-6">
            Your home is now secure and conserving energy while you are away.
          </Text>
        </View>

        <View className="gap-3 pb-4">
          <Button label="At Home" onPress={goHome} />
          <Button
            label="Watch CC Camera"
            variant="outline"
            onPress={() => router.replace('/(tabs)/camera')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

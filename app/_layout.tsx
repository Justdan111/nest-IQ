import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts, } from '@expo-google-fonts/poppins';
import { View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { AppStateProvider } from '@/hooks/useAppState';
import { DevicesProvider } from '@/hooks/useDevices';
import { RoomsProvider } from '@/hooks/useRooms';
import { ScenesProvider } from '@/hooks/useScenes';
import { NotificationsProvider } from '@/hooks/useNotifications';

export default function RootLayout() {
  const { colors } = useTheme();
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <AppStateProvider>
          <NotificationsProvider>
            <RoomsProvider>
              <DevicesProvider>
                <ScenesProvider>
                  <StatusBar style="auto" />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: colors.background },
                      animation: 'fade',
                    }}
                  />
                </ScenesProvider>
              </DevicesProvider>
            </RoomsProvider>
          </NotificationsProvider>
        </AppStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, setColorScheme } = useTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Settings</Text>
          <View style={{ width: 26 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
      >
        <SectionLabel>Appearance</SectionLabel>
        <Card>
          <ToggleRow
            icon="moon"
            label="Dark Mode"
            value={isDark}
            onValueChange={(on) => setColorScheme(on ? 'dark' : 'light')}
          />
        </Card>

        <SectionLabel>Notifications</SectionLabel>
        <Card>
          <ToggleRow
            icon="notifications"
            label="Push Notifications"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <Divider />
          <ToggleRow
            icon="mail"
            label="Email Alerts"
            value={emailAlerts}
            onValueChange={setEmailAlerts}
          />
        </Card>

        <SectionLabel>Home</SectionLabel>
        <Card>
          <LinkRow
            icon="shield-checkmark"
            label="Door Security"
            onPress={() => router.push('/security')}
          />
          <Divider />
          <LinkRow
            icon="airplane"
            label="Away Mode"
            onPress={() => router.push('/away')}
          />
        </Card>

        <SectionLabel>About</SectionLabel>
        <Card>
          <LinkRow icon="help-buoy" label="Support" onPress={() => {}} />
          <Divider />
          <View className="flex-row items-center px-4 py-4">
            <IconBubble icon="information-circle" />
            <Text className="text-text text-base font-medium ml-3 flex-1">
              Version
            </Text>
            <Text className="text-textSecondary text-sm">1.0.0</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-textSecondary text-xs font-semibold uppercase mt-6 mb-2 ml-1">
      {children}
    </Text>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View className="bg-surface rounded-2xl overflow-hidden">{children}</View>;
}

function Divider() {
  return <View className="h-px bg-border ml-16" />;
}

function IconBubble({ icon }: { icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View className="w-9 h-9 rounded-full bg-primary/15 items-center justify-center">
      <Ionicons name={icon} size={18} color="#3B6FF0" />
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center px-4 py-4">
      <IconBubble icon={icon} />
      <Text className="text-text text-base font-medium ml-3 flex-1">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.surfaceAlt}
      />
    </View>
  );
}

function LinkRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-4 py-4">
      <IconBubble icon={icon} />
      <Text className="text-text text-base font-medium ml-3 flex-1">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

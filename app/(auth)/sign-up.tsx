import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useTheme } from '@/hooks/useTheme';

export default function SignUpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accept, setAccept] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const submit = () => setShowCongrats(true);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
      </View>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="pt-6">
          <Text className="text-text text-3xl font-bold">Sign Up</Text>
          <Text className="text-textSecondary text-base mt-2">
            Create an account to control your smart home.
          </Text>
        </View>

        <View className="mt-8 gap-4">
          <Field label="Full Name" value={name} onChange={setName} placeholder="Alex Doe" />
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <PhoneField value={phone} onChange={setPhone} />
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPwd}
            rightIcon={
              <Pressable onPress={() => setShowPwd((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            }
          />
        </View>

        <Pressable
          onPress={() => setAccept((v) => !v)}
          className="flex-row items-center mt-6"
        >
          <View
            className={`w-5 h-5 rounded-md mr-2 items-center justify-center ${accept ? 'bg-primary' : 'border border-border'}`}
          >
            {accept ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
          </View>
          <Text className="text-textSecondary text-sm">I accept terms & conditions</Text>
        </Pressable>

        <View className="mt-8">
          <Button label="Sign Up" onPress={submit} disabled={!accept} />
        </View>
      </ScrollView>

      <BottomSheet visible={showCongrats} onClose={() => setShowCongrats(false)}>
        <View className="items-center pt-2">
          <View className="w-24 h-24 rounded-full bg-primary/15 items-center justify-center">
            <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>
          </View>
          <Text className="text-text text-xl font-bold mt-5">Congratulations!</Text>
          <Text className="text-textSecondary text-sm mt-2 text-center">
            Your account has been created successfully.
          </Text>
          <View className="w-full mt-8">
            <Button
              label="Get Started"
              onPress={() => {
                setShowCongrats(false);
                router.replace('/(tabs)');
              }}
            />
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  secureTextEntry,
  keyboardType,
  rightIcon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  rightIcon?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <Text className="text-textSecondary text-sm mb-2">{label}</Text>
      <View className="flex-row items-center bg-surface border border-border rounded-xl px-4">
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          className="flex-1 text-text py-3 text-base"
        />
        {rightIcon}
      </View>
    </View>
  );
}

function PhoneField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { colors } = useTheme();
  return (
    <View>
      <Text className="text-textSecondary text-sm mb-2">Phone Number</Text>
      <View className="flex-row items-center bg-surface border border-border rounded-xl pr-4">
        <View className="flex-row items-center pl-4 pr-3 border-r border-border py-3">
          <Text className="text-text text-base">🇺🇸 +1</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="555 123 4567"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          className="flex-1 text-text py-3 text-base ml-3"
        />
        {value ? (
          <Pressable onPress={() => onChange('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

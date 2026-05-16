import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A]">
      <View className="px-5 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
      </View>
      <View className="flex-1 px-5 pt-8">
        <Text className="text-white text-3xl font-bold">Sign In</Text>
        <Text className="text-[#8A8A8A] text-base mt-2">
          Hi! Welcome back, you've been missed.
        </Text>

        <View className="mt-10 gap-4">
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <View>
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
                    color="#8A8A8A"
                  />
                </Pressable>
              }
            />
            <Pressable className="mt-2 self-end" hitSlop={6}>
              <Text className="text-[#E24B4A] text-sm">Forgot Password?</Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-10">
          <Button label="Sign In" onPress={() => router.replace('/(tabs)')} />
        </View>

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-[#2A2A2A]" />
          <Text className="text-[#8A8A8A] mx-3 text-sm">Or</Text>
          <View className="flex-1 h-px bg-[#2A2A2A]" />
        </View>

        <View className="flex-row justify-center gap-4">
          {[
            { name: 'logo-facebook' as const, color: '#1877F2' },
            { name: 'logo-google' as const, color: '#EA4335' },
          ].map((s) => (
            <Pressable
              key={s.name}
              className="w-14 h-14 rounded-2xl bg-[#1A1A1A] items-center justify-center border border-[#2A2A2A]"
            >
              <Ionicons name={s.name} size={24} color={s.color} />
            </Pressable>
          ))}
        </View>
      </View>
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
  return (
    <View>
      <Text className="text-[#8A8A8A] text-sm mb-2">{label}</Text>
      <View className="flex-row items-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4">
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#555555"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          className="flex-1 text-white py-3 text-base"
        />
        {rightIcon}
      </View>
    </View>
  );
}

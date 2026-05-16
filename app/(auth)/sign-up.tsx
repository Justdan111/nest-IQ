import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accept, setAccept] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const submit = () => setShowCongrats(true);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A]">
      <View className="px-5 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
      </View>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="pt-6">
          <Text className="text-white text-3xl font-bold">Sign Up</Text>
          <Text className="text-[#8A8A8A] text-base mt-2">
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
                  color="#8A8A8A"
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
            className={`w-5 h-5 rounded-md mr-2 items-center justify-center ${accept ? 'bg-[#3B6FF0]' : 'border border-[#2A2A2A]'}`}
          >
            {accept ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
          </View>
          <Text className="text-[#8A8A8A] text-sm">I accept terms & conditions</Text>
        </Pressable>

        <View className="mt-8">
          <Button label="Sign Up" onPress={submit} disabled={!accept} />
        </View>
      </ScrollView>

      <BottomSheet visible={showCongrats} onClose={() => setShowCongrats(false)}>
        <View className="items-center pt-2">
          <View className="w-24 h-24 rounded-full bg-[#3B6FF0]/15 items-center justify-center">
            <View className="w-16 h-16 rounded-full bg-[#3B6FF0] items-center justify-center">
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>
          </View>
          <Text className="text-white text-xl font-bold mt-5">Congratulations!</Text>
          <Text className="text-[#8A8A8A] text-sm mt-2 text-center">
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

function PhoneField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View>
      <Text className="text-[#8A8A8A] text-sm mb-2">Phone Number</Text>
      <View className="flex-row items-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl pr-4">
        <View className="flex-row items-center pl-4 pr-3 border-r border-[#2A2A2A] py-3">
          <Text className="text-white text-base">🇺🇸 +1</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="555 123 4567"
          placeholderTextColor="#555555"
          keyboardType="phone-pad"
          className="flex-1 text-white py-3 text-base ml-3"
        />
        {value ? (
          <Pressable onPress={() => onChange('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#555555" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

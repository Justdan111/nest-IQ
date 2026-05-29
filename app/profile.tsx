import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { initials } from '@/utils/initials';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, setUser } = useAppState();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [homeName, setHomeName] = useState(user.homeName);

  const save = () => {
    setUser({
      ...user,
      name: name.trim() || user.name,
      email: email.trim(),
      address: address.trim(),
      homeName: homeName.trim(),
    });
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Profile Edit</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mt-4 mb-6">
          <View
            className="w-28 h-28 rounded-full items-center justify-center"
            style={{ borderWidth: 3, borderColor: colors.primary }}
          >
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
              <Text className="text-white font-bold text-3xl">
                {initials(name)}
              </Text>
            </View>
            <Pressable
              hitSlop={6}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary items-center justify-center"
              style={{ borderWidth: 3, borderColor: colors.background }}
            >
              <Ionicons name="pencil" size={14} color="#fff" />
            </Pressable>
          </View>
          <Text className="text-text font-bold text-xl mt-4">{name}</Text>
          <Text className="text-textSecondary text-sm mt-1">{email}</Text>
        </View>

        <View className="px-5 gap-4">
          <Field label="Name" value={name} onChange={setName} placeholder="Your name" />
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <Field
            label="Address"
            value={address}
            onChange={setAddress}
            placeholder="City, Country"
          />
          <Field
            label="Home Name"
            value={homeName}
            onChange={setHomeName}
            placeholder="My Home"
          />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="px-5 pb-3">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button label="Cancel" variant="outline" onPress={() => router.back()} />
          </View>
          <View className="flex-1">
            <Button label="Save" onPress={save} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address';
}) {
  const { colors } = useTheme();
  return (
    <View>
      <Text className="text-textSecondary text-sm mb-2">{label}</Text>
      <View className="bg-surface border border-border rounded-xl px-4">
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          className="text-text py-3 text-base"
        />
      </View>
    </View>
  );
}

import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '@/hooks/useAppState';
import { useTheme } from '@/hooks/useTheme';
import { Avatar } from '@/components/ui/Avatar';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { haptic } from '@/utils/haptics';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, setUser } = useAppState();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [homeName, setHomeName] = useState(user.homeName);
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  // Avatar source picker — shown when the user taps the pencil badge.
  const [pickerOpen, setPickerOpen] = useState(false);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    // Simulate the network round-trip a real backend would have. Even with
    // local-only state the brief spinner makes the action feel committed.
    await new Promise((r) => setTimeout(r, 500));
    setUser({
      ...user,
      name: name.trim() || user.name,
      email: email.trim(),
      address: address.trim(),
      homeName: homeName.trim(),
      avatar,
    });
    haptic('success');
    toast.success('Profile updated');
    setSaving(false);
    router.back();
  };

  const pickFromLibrary = async () => {
    setPickerOpen(false);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    setAvatar(result.assets[0].uri);
  };

  const captureFromCamera = async () => {
    setPickerOpen(false);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    setAvatar(result.assets[0].uri);
  };

  const clearAvatar = () => {
    setPickerOpen(false);
    setAvatar(undefined);
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
            className="rounded-full items-center justify-center"
            style={{
              width: 112,
              height: 112,
              borderWidth: 3,
              borderColor: colors.primary,
            }}
          >
            <Avatar uri={avatar} name={name} size={96} />
            <Pressable
              onPress={() => setPickerOpen(true)}
              hitSlop={6}
              accessibilityLabel="Change profile photo"
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
            <Button
              label="Cancel"
              variant="outline"
              onPress={() => router.back()}
              disabled={saving}
            />
          </View>
          <View className="flex-1">
            <Button label="Save" onPress={save} loading={saving} />
          </View>
        </View>
      </SafeAreaView>

      {/* Avatar source picker */}
      <BottomSheet visible={pickerOpen} onClose={() => setPickerOpen(false)}>
        <Text className="text-text font-semibold text-lg mb-4 text-center">
          Profile Photo
        </Text>
        <View className="gap-3">
          <SourceRow
            icon="image-outline"
            label="Choose from Library"
            onPress={pickFromLibrary}
          />
          <SourceRow
            icon="camera-outline"
            label="Take Photo"
            onPress={captureFromCamera}
          />
          {avatar ? (
            <SourceRow
              icon="trash-outline"
              label="Remove Photo"
              destructive
              onPress={clearAvatar}
            />
          ) : null}
        </View>
      </BottomSheet>
    </View>
  );
}

function SourceRow({
  icon,
  label,
  destructive,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  destructive?: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const tint = destructive ? colors.error : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      className="bg-background border border-border rounded-2xl p-4 flex-row items-center"
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{
          backgroundColor: destructive
            ? 'rgba(226, 75, 74, 0.15)'
            : `${colors.primary}26`,
        }}
      >
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <Text
        className="font-medium ml-3 flex-1"
        style={{ color: destructive ? colors.error : colors.text }}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
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

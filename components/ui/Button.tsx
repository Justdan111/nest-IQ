import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import type { PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Variant = 'primary' | 'outline' | 'ghost';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  loading,
  icon,
  fullWidth = true,
  disabled,
  ...rest
}: Props) {
  const base = 'rounded-full py-4 items-center justify-center flex-row';
  const styles: Record<Variant, { bg: string; text: string }> = {
    primary: { bg: 'bg-[#3B6FF0] active:bg-[#2952C8]', text: 'text-white' },
    outline: {
      bg: 'border border-[#3B6FF0] bg-transparent active:bg-[#3B6FF0]/10',
      text: 'text-[#3B6FF0]',
    },
    ghost: { bg: 'bg-transparent', text: 'text-white' },
  };

  return (
    <Pressable
      disabled={disabled || loading}
      className={`${base} ${styles[variant].bg} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : ''}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#3B6FF0'} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={variant === 'primary' ? '#fff' : '#3B6FF0'}
            />
          ) : null}
          <Text className={`${styles[variant].text} font-semibold text-base`}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

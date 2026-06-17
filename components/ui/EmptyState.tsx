import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  /** Optional CTA — surfaces a primary button under the message. */
  ctaLabel?: string;
  onCtaPress?: () => void;
  /** Use 'page' for full-screen empties, 'card' for inline section cards. */
  variant?: 'page' | 'card';
};

/**
 * Reusable empty-state block. A stylized concentric-circle "illustration"
 * with a centered icon, headline, optional supporting copy, and an optional
 * primary action. Consistent across screens (room list, device list, room
 * detail, notifications, etc.) so every empty surface feels intentional
 * instead of a placeholder.
 */
export function EmptyState({
  icon,
  title,
  message,
  ctaLabel,
  onCtaPress,
  variant = 'card',
}: Props) {
  const { colors } = useTheme();
  return (
    <View
      className={
        variant === 'page'
          ? 'flex-1 items-center justify-center px-8'
          : 'bg-surface rounded-2xl items-center px-6 py-10'
      }
    >
      {/* Concentric rings — outer fades from primary, inner sits on a lighter
          plate. Gives the surface visual weight beyond just an icon. */}
      <View
        className="rounded-full items-center justify-center"
        style={{
          width: 110,
          height: 110,
          backgroundColor: `${colors.primary}10`,
        }}
      >
        <View
          className="rounded-full items-center justify-center"
          style={{
            width: 76,
            height: 76,
            backgroundColor: `${colors.primary}26`,
          }}
        >
          <View
            className="rounded-full items-center justify-center"
            style={{ width: 52, height: 52, backgroundColor: colors.primary }}
          >
            <Ionicons name={icon} size={22} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <Text className="text-text font-bold text-base mt-5 text-center">
        {title}
      </Text>
      {message ? (
        <Text className="text-textSecondary text-sm mt-2 text-center leading-5 max-w-[280px]">
          {message}
        </Text>
      ) : null}
      {ctaLabel && onCtaPress ? (
        <View className="mt-5 w-full max-w-[220px]">
          <Button label={ctaLabel} onPress={onCtaPress} />
        </View>
      ) : null}
    </View>
  );
}

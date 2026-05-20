import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  /**
   * 'text' — minimal "See All" style link.
   * 'pill' — dark pill with a primary "+" circle inside, e.g. "Add New".
   */
  actionVariant?: 'text' | 'pill';
};

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  actionVariant = 'text',
}: Props) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-text font-semibold text-lg">{title}</Text>
      {actionLabel ? (
        actionVariant === 'pill' ? (
          <Pressable
            onPress={onAction}
            hitSlop={6}
            className="flex-row items-center bg-surface rounded-full pl-1 pr-4 py-1"
          >
            <View className="w-7 h-7 rounded-full bg-primary items-center justify-center mr-2">
              <Ionicons name="add" size={18} color="#fff" />
            </View>
            <Text className="text-text text-sm font-medium">{actionLabel}</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text className="text-textSecondary text-sm font-medium">{actionLabel}</Text>
          </Pressable>
        )
      ) : null}
    </View>
  );
}

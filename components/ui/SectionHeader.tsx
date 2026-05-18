import { Pressable, Text, View } from 'react-native';

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-text font-semibold text-lg">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-primary text-sm font-medium">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

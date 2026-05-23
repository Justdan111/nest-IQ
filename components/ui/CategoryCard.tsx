import { Image, Pressable, Text, View } from 'react-native';
import type { Category } from '@/types';

type Props = {
  category: Category;
  /** Override subtitle, e.g. "3 rooms". */
  subtitle?: string;
  onPress?: (category: Category) => void;
};

/**
 * Pastel category card for the Home grid. Light cards keep their look in both
 * themes — dark text always wins on the pastel background.
 */
export function CategoryCard({ category, subtitle, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress?.(category)}
      className="flex-1 rounded-2xl overflow-hidden"
      style={{ backgroundColor: category.tintColor, height: 160 }}
    >
      <View
        className="absolute rounded-full"
        style={{
          top: -28,
          right: -28,
          width: 130,
          height: 130,
          backgroundColor: category.blobColor,
        }}
      />
      {category.image ? (
        <Image
          source={category.image}
          resizeMode="cover"
          style={{
            position: 'absolute',
            top: 12,
            right: 10,
            width: 86,
            height: 86,
            borderRadius: 14,
          }}
        />
      ) : null}
      <View className="absolute bottom-0 left-0 right-0 p-4">
        <Text className="text-[#1A1A1A] font-bold text-base">{category.name}</Text>
        {subtitle ? (
          <Text className="text-[#1A1A1A]/60 text-xs mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

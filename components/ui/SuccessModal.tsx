import { Modal, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

const SPARKLES: { size: number; pos: object }[] = [
  { size: 6, pos: { top: 0, left: 40 } },
  { size: 4, pos: { top: 14, right: 6 } },
  { size: 5, pos: { bottom: 8, left: 0 } },
  { size: 7, pos: { bottom: 22, right: 0 } },
  { size: 4, pos: { top: 36, left: 2 } },
  { size: 5, pos: { bottom: 0, right: 36 } },
];

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  ctaLabel?: string;
  onClose: () => void;
};

/**
 * Reusable centered success modal — blue ring with white check + sparkle
 * dots. Used everywhere a "thing X added!" confirmation is needed.
 */
export function SuccessModal({
  visible,
  title = 'Congratulation!',
  message,
  ctaLabel = 'Close',
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 bg-black/70 items-center justify-center px-8">
        <View className="w-full bg-surface rounded-3xl p-8 items-center">
          <View
            style={{ width: 120, height: 120 }}
            className="items-center justify-center"
          >
            {SPARKLES.map((s, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  ...s.pos,
                  width: s.size,
                  height: s.size,
                  borderRadius: s.size / 2,
                  backgroundColor: '#3B6FF0',
                }}
              />
            ))}
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
              <View className="w-12 h-12 rounded-xl bg-white items-center justify-center">
                <Ionicons name="checkmark" size={28} color="#3B6FF0" />
              </View>
            </View>
          </View>
          <Text className="text-text text-2xl font-bold mt-6">{title}</Text>
          <Text className="text-textSecondary text-sm mt-2 text-center">{message}</Text>
          <View className="w-full mt-6">
            <Button label={ctaLabel} onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

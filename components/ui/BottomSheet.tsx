import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet({ visible, onClose, children }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 bg-black/60 justify-end"
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            entering={SlideInDown.duration(300)}
            exiting={SlideOutDown.duration(200)}
            className="bg-[#1A1A1A] rounded-t-3xl px-5 pt-4 pb-8"
          >
            <View className="items-center mb-3">
              <View className="w-10 h-1 rounded-full bg-[#2A2A2A]" />
            </View>
            <SafeAreaView edges={['bottom']}>{children}</SafeAreaView>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

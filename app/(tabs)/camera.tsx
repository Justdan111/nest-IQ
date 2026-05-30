import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CameraFeed } from '@/components/camera/CameraFeed';
import { useSidebar } from '@/components/ui/Sidebar';
import { useTheme } from '@/hooks/useTheme';

type Cam = {
  id: string;
  name: string;
  floor: string;
  date: string;
  time: string;
  image: ReturnType<typeof require>;
  /** Optional live stream URL — when set, CameraFeed will switch into LIVE mode. */
  streamUrl?: string;
};

const CAMERAS: Cam[] = [
  {
    id: '1',
    name: 'Dining room',
    floor: '1st Floor',
    date: '11 Feb 2023',
    time: '05:32:19',
    image: require('@/assets/images/dinning.jpg'),
  },
  {
    id: '2',
    name: 'Bed Room',
    floor: '1st Floor',
    date: '11 Feb 2023',
    time: '05:32:19',
    image: require('@/assets/images/bedroom-01.jpg'),
  },
  {
    id: '3',
    name: 'Living room',
    floor: '1st Floor',
    date: '11 Feb 2023',
    time: '05:32:19',
    image: require('@/assets/images/livingroom.jpg'),
  },
  {
    id: '4',
    name: 'Kitchen',
    floor: '1st Floor',
    date: '11 Feb 2023',
    time: '05:32:19',
    image: require('@/assets/images/kitchen.jpg'),
  },
];

export default function CameraScreen() {
  const { open } = useSidebar();
  const { colors } = useTheme();

  const [activeId, setActiveId] = useState<string>(CAMERAS[1].id); // Bed Room by default to match mockup
  const [fullscreen, setFullscreen] = useState(false);

  const active = CAMERAS.find((c) => c.id === activeId) ?? CAMERAS[0];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-2 mb-4">
          <Pressable onPress={open} hitSlop={10}>
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>
          <Text className="text-text font-semibold text-lg">Real Time</Text>
          <Pressable hitSlop={10}>
            <View className="w-9 h-9 rounded-full bg-surface items-center justify-center">
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
            </View>
          </Pressable>
        </View>

        {/* Hero feed — tap to expand */}
        <Pressable onPress={() => setFullscreen(true)} className="mx-5 mb-6">
          <CameraFeed
            poster={active.image}
            streamUrl={active.streamUrl}
            label={active.name}
            height={260}
            borderRadius={20}
          />
          <View
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          >
            <Ionicons name="expand" size={16} color="#fff" />
          </View>
        </Pressable>

        <View className="px-5">
          <SectionHeader
            title="Cameras"
            actionLabel="Add New"
            actionVariant="pill"
          />
          <View className="gap-3">
            {CAMERAS.map((c) => {
              const isActive = c.id === activeId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setActiveId(c.id)}
                  className={`rounded-2xl p-3 flex-row items-center ${isActive ? 'bg-primary' : 'bg-surface'}`}
                >
                  <Image
                    source={c.image}
                    resizeMode="cover"
                    style={{ width: 56, height: 56, borderRadius: 12 }}
                  />
                  <View className="flex-1 ml-3">
                    <Text
                      className={`font-bold text-base ${isActive ? 'text-white' : 'text-text'}`}
                    >
                      {c.name}
                    </Text>
                    <Text
                      className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-textSecondary'}`}
                    >
                      {c.floor}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text
                      className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-text'}`}
                    >
                      {c.date}
                    </Text>
                    <Text
                      className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-textSecondary'}`}
                    >
                      {c.time}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <FullscreenFeedModal
        visible={fullscreen}
        camera={active}
        onClose={() => setFullscreen(false)}
      />
    </SafeAreaView>
  );
}

function FullscreenFeedModal({
  visible,
  camera,
  onClose,
}: {
  visible: boolean;
  camera: Cam;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
      statusBarTranslucent
    >
      <StatusBar hidden />
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraFeed
          poster={camera.image}
          streamUrl={camera.streamUrl}
          label={camera.name}
        />
        <SafeAreaView
          edges={['top']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 16,
            }}
          >
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.55)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

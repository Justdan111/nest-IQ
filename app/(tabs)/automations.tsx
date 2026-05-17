import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TodaySceneCard } from '@/components/automations/TodaySceneCard';
import { SceneRow } from '@/components/automations/SceneRow';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { SCENES, SUGGESTED_SCENES } from '@/constants/Scenes';
import { useSidebar } from '@/components/ui/Sidebar';

export default function AutomationsScreen() {
  const { open } = useSidebar();
  const [showAddScene, setShowAddScene] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [sceneName, setSceneName] = useState('');
  const [schedule, setSchedule] = useState<'yes' | 'no' | null>(null);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#0A0A0A]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-2 mb-6">
          <Pressable onPress={open} hitSlop={10}>
            <Ionicons name="menu" size={26} color="#fff" />
          </Pressable>
          <Text className="text-white font-semibold text-lg">Automations</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </Pressable>
        </View>

        <View className="px-5">
          <SectionHeader
            title="Scenes"
            actionLabel="+ Add New"
            onAction={() => setShowAddScene(true)}
          />
          {SUGGESTED_SCENES.map((s) => (
            <SceneRow
              key={s.id}
              name={s.name}
              icon={s.icon as keyof typeof Ionicons.glyphMap}
              description={s.description}
              onPress={() => setShowAddScene(true)}
            />
          ))}
        </View>

        <View className="px-5 mt-6">
          <SectionHeader title="Today's Scenes" actionLabel="+ Add New" />
          <FlatList
            data={SCENES}
            keyExtractor={(s) => s.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
            renderItem={({ item }) => <TodaySceneCard scene={item} />}
          />
        </View>
      </ScrollView>

      <BottomSheet visible={showAddScene} onClose={() => setShowAddScene(false)}>
        <Text className="text-white font-semibold text-lg mb-4">Add a Scene</Text>
        <Text className="text-[#8A8A8A] text-sm mb-3">Suggested Scenes</Text>
        {SUGGESTED_SCENES.map((s) => (
          <SceneRow
            key={s.id}
            name={s.name}
            icon={s.icon as keyof typeof Ionicons.glyphMap}
            description={s.description}
          />
        ))}
        <View className="mt-2">
          <Button
            label="Create New"
            onPress={() => {
              setShowAddScene(false);
              setShowCreate(true);
            }}
          />
        </View>
      </BottomSheet>

      <BottomSheet visible={showCreate} onClose={() => setShowCreate(false)}>
        <Text className="text-white font-semibold text-lg mb-4">Create Scene</Text>
        <Text className="text-[#8A8A8A] text-sm mb-2">Scene Name</Text>
        <TextInput
          value={sceneName}
          onChangeText={setSceneName}
          placeholder="e.g. Movie Time"
          placeholderTextColor="#555555"
          className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-base mb-4"
        />
        <Text className="text-[#8A8A8A] text-sm mb-2">Schedule?</Text>
        <View className="flex-row gap-3 mb-6">
          {(['yes', 'no'] as const).map((opt) => {
            const active = schedule === opt;
            return (
              <Pressable
                key={opt}
                onPress={() => setSchedule(opt)}
                className={`flex-1 py-3 rounded-full items-center ${active ? 'bg-[#3B6FF0]' : 'bg-[#0A0A0A] border border-[#2A2A2A]'}`}
              >
                <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-[#8A8A8A]'}`}>
                  {opt === 'yes' ? 'Yes' : 'No'}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Button
          label="Continue"
          onPress={() => {
            setShowCreate(false);
            setSceneName('');
            setSchedule(null);
          }}
          disabled={!sceneName || !schedule}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

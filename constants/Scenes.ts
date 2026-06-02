import type { Scene } from '@/types';
import { formatSceneRepeat, formatSceneTime } from '@/utils/sceneFormatting';

const ALL_WEEK = [0, 1, 2, 3, 4, 5, 6];

// Build a seed scene from its trigger so display + trigger never drift.
function seed(
  partial: Omit<Scene, 'time' | 'repeat'> & {
    trigger: NonNullable<Scene['trigger']>;
  },
): Scene {
  return {
    ...partial,
    time: formatSceneTime(partial.trigger),
    repeat: formatSceneRepeat(partial.trigger.weekdays),
  };
}

export const SCENES: Scene[] = [
  seed({
    id: '1',
    name: "Rise n' Shine",
    icon: 'sunny',
    color: '#3B6FF0',
    status: 'Scheduled',
    trigger: { hour: 7, minute: 0, weekdays: ALL_WEEK },
  }),
  seed({
    id: '2',
    name: 'House Keeping',
    icon: 'construct',
    color: '#1A1A1A',
    status: 'Scheduled',
    trigger: { hour: 10, minute: 0, weekdays: ALL_WEEK },
  }),
  seed({
    id: '3',
    name: 'Movie Night',
    icon: 'film',
    color: '#1A1A1A',
    status: 'Scheduled',
    trigger: { hour: 19, minute: 0, weekdays: [5, 6] },
  }),
  seed({
    id: '4',
    name: 'Good Night',
    icon: 'moon',
    color: '#C97E8A',
    status: 'Scheduled',
    trigger: { hour: 21, minute: 0, weekdays: ALL_WEEK },
  }),
];

export const SUGGESTED_SCENES = [
  {
    id: 's1',
    name: 'Morning scene',
    icon: 'sunny-outline',
    description: 'Lights on, blinds open, coffee maker.',
  },
  {
    id: 's2',
    name: 'Night scene',
    icon: 'moon-outline',
    description: 'Lights off, doors lock, AC to sleep.',
  },
];

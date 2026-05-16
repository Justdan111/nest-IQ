import type { Scene } from '@/types';

export const SCENES: Scene[] = [
  {
    id: '1',
    name: "Rise n' Shine",
    time: '7:00 am',
    repeat: 'Everyday',
    icon: 'sunny',
    color: '#3B6FF0',
    status: 'Scheduled',
  },
  {
    id: '2',
    name: 'House Keeping',
    time: '10:00 am',
    repeat: 'Everyday',
    icon: 'construct',
    color: '#1A1A1A',
    status: 'Scheduled',
  },
  {
    id: '3',
    name: 'Movie Night',
    time: '07:00 pm',
    repeat: 'Fri, Sat',
    icon: 'film',
    color: '#1A1A1A',
    status: 'Scheduled',
  },
  {
    id: '4',
    name: 'Good Night',
    time: '9:00 pm',
    repeat: 'Everyday',
    icon: 'moon',
    color: '#C97E8A',
    status: 'Scheduled',
  },
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

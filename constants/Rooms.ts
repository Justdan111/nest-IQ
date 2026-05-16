import type { Room } from '@/types';

export const ROOMS: Room[] = [
  {
    id: '1',
    name: 'Bed Room',
    deviceCount: 5,
    totalDevices: 8,
    image: null,
    tintColor: '#FDE8E8',
  },
  {
    id: '2',
    name: 'Living Room',
    deviceCount: 2,
    totalDevices: 6,
    image: null,
    tintColor: '#E8F0FD',
  },
  {
    id: '3',
    name: 'Study Room',
    deviceCount: 1,
    totalDevices: 4,
    image: null,
    tintColor: '#FDF6E8',
  },
  {
    id: '4',
    name: 'Guest Room',
    deviceCount: 2,
    totalDevices: 5,
    image: null,
    tintColor: '#F0EDF8',
  },
];

export const ROOM_NAMES = ROOMS.map((r) => r.name);

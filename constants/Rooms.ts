import type { Room } from '@/types';

export const ROOMS: Room[] = [
  {
    id: '1',
    name: 'Bed Room',
    subtitle: 'Five rooms',
    deviceCount: 5,
    totalDevices: 8,
    image: require('@/assets/images/bed-2.jpg'),
    tintColor: '#FDE8E8',
    blobColor: '#F7D2D2',
  },
  {
    id: '2',
    name: 'Living Room',
    subtitle: 'Two rooms',
    deviceCount: 2,
    totalDevices: 6,
    image: require('@/assets/images/chair-1.jpg'),
    tintColor: '#E8F0FD',
    blobColor: '#D1E0F8',
  },
  {
    id: '3',
    name: 'Study Room',
    subtitle: 'One rooms',
    deviceCount: 1,
    totalDevices: 4,
    image: require('@/assets/images/chair-2.jpg'),
    tintColor: '#FDF6E8',
    blobColor: '#F8E7BD',
  },
  {
    id: '4',
    name: 'Guest Room',
    subtitle: 'Two rooms',
    deviceCount: 2,
    totalDevices: 5,
    image: require('@/assets/images/bed-1.jpg'),
    tintColor: '#EDEDED',
    blobColor: '#DDDDDD',
  },
];

export const ROOM_NAMES = ROOMS.map((r) => r.name);

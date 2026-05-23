import type { Category, Room } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'bed',
    name: 'Bed Room',
    image: require('@/assets/images/bedroom-01.jpg'),
    tintColor: '#FDE8E8',
    blobColor: '#F7D2D2',
  },
  {
    id: 'living',
    name: 'Living Room',
    image: require('@/assets/images/livingroom.jpg'),
    tintColor: '#E8F0FD',
    blobColor: '#D1E0F8',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    image: require('@/assets/images/kitchen.jpg'),
    tintColor: '#FDF6E8',
    blobColor: '#F8E7BD',
  },
  {
    id: 'dining',
    name: 'Dining Room',
    image: require('@/assets/images/dinning.jpg'),
    tintColor: '#EDEDED',
    blobColor: '#DDDDDD',
  },
];

export const ROOMS: Room[] = [
  {
    id: '1',
    categoryId: 'bed',
    name: 'Master Bedroom',
    image: require('@/assets/images/bedroom-01.jpg'),
  },
  {
    id: '2',
    categoryId: 'bed',
    name: 'Edamame Bedroom',
    image: require('@/assets/images/bedroom-02.jpg'),
  },
  {
    id: '3',
    categoryId: 'bed',
    name: 'Kids Room',
    image: require('@/assets/images/bedroom-03.jpg'),
  },
  {
    id: '4',
    categoryId: 'living',
    name: 'Main Living Room',
    image: require('@/assets/images/livingroom.jpg'),
  },
  {
    id: '5',
    categoryId: 'kitchen',
    name: 'Main Kitchen',
    image: require('@/assets/images/kitchen.jpg'),
  },
  {
    id: '6',
    categoryId: 'kitchen',
    name: 'Pantry',
    image: require('@/assets/images/kitchen-2.jpg'),
  },
  {
    id: '7',
    categoryId: 'dining',
    name: 'Main Dining',
    image: require('@/assets/images/dinning.jpg'),
  },
];

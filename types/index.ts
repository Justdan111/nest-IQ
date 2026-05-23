export interface Device {
  id: string;
  name: string;
  icon: string;
  status: 'Connected' | 'Disconnected';
  isOn: boolean;
  kwhPerHour: number;
  /** Matches a {@link Room} by its specific name, not by category. */
  room: string;
  type?: 'ac' | 'light' | 'fan' | 'speaker' | 'camera' | 'lock';
}

export interface Category {
  id: string;
  name: string;
  /** Cutout / hero image shown on the Home category card. May be null for user-added categories. */
  image: any | null;
  /** Pastel card background for the Home grid. */
  tintColor: string;
  /** Lighter spotlight circle behind the category image. */
  blobColor: string;
}

export type RoomMedia = { uri: string; type: 'image' | 'video' };

export interface Room {
  id: string;
  categoryId: string;
  name: string;
  /** Hero photo of the room (real interior shot). */
  image: any;
  /** User-uploaded gallery (camera roll / library / camera capture). */
  media?: RoomMedia[];
}

export interface Scene {
  id: string;
  name: string;
  time: string;
  repeat: string;
  icon: string;
  color: string;
  status: 'Scheduled' | 'Active';
  devices?: Device[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  homeName: string;
  address: string;
}

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

/**
 * When a scene should fire. `weekdays` is 0..6 (Sun=0). An empty `weekdays`
 * array means "once" (the next occurrence at the given time, then done).
 */
export interface SceneTrigger {
  hour: number;
  minute: number;
  weekdays: number[];
}

export interface Scene {
  id: string;
  name: string;
  /** Human-readable time, e.g. "7:00 am". Derived from `trigger`. */
  time: string;
  /** Human-readable repeat label, e.g. "Everyday" / "Fri, Sat" / "Once". */
  repeat: string;
  icon: string;
  color: string;
  status: 'Scheduled' | 'Active';
  /** Devices this scene affects. */
  deviceIds?: string[];
  /** Structured trigger — drives scheduling and the display fields above. */
  trigger?: SceneTrigger;
  /** Notification handles returned by expo-notifications; used to cancel. */
  notificationIds?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  homeName: string;
  address: string;
}

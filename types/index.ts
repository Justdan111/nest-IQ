export interface Device {
  id: string;
  name: string;
  icon: string;
  status: 'Connected' | 'Disconnected';
  isOn: boolean;
  kwhPerHour: number;
  room: string;
  type?: 'ac' | 'light' | 'fan' | 'speaker' | 'camera' | 'lock';
}

export interface Room {
  id: string;
  name: string;
  deviceCount: number;
  totalDevices: number;
  /** Furniture cut-out (bed / chair) shown in the room card's top-right. */
  image: any;
  /** Pastel card background. */
  tintColor: string;
  /** Lighter spotlight circle that sits behind the image. */
  blobColor: string;
  /** Display string shown beneath the room name, e.g. "Five rooms". */
  subtitle: string;
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

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
  image: any;
  tintColor: string;
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

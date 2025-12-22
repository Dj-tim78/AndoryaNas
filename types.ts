
export enum View {
  DASHBOARD = 'DASHBOARD',
  STORAGE = 'STORAGE',
  SHARES = 'SHARES',
  USERS = 'USERS',
  DRIVE_MAPPING = 'DRIVE_MAPPING',
  SETTINGS = 'SETTINGS',
  GEMINI_HELP = 'GEMINI_HELP'
}

export interface Group {
  id: string;
  name: string;
  memberCount: number;
}

export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'User' | 'Guest';
  status: 'Active' | 'Disabled';
  lastLogin: string;
  groups: string[];
}

export interface Share {
  id: string;
  name: string;
  path: string;
  protocol: 'SMB' | 'NFS' | 'AFP';
  status: 'Active' | 'Locked' | 'Hidden';
  isPrivate: boolean;
  authorizedUsers: string[];
  sizeUsed: number;
  sizeTotal: number;
}

export interface StorageDisk {
  id: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  type: 'SSD' | 'HDD' | 'NVMe';
  capacity: string;
  health: 'Healthy' | 'Warning' | 'Critical';
  temperature: number;
}

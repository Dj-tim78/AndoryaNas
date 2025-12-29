
import { User, Group, Share, StorageDisk, StoragePool } from './types';

// On cible le port 3000 comme spécifié par l'utilisateur
const API_BASE = `http://${window.location.hostname}:3000/api`;

export const api = {
  async checkConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getSystemStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  async getDisks(): Promise<StorageDisk[]> {
    const res = await fetch(`${API_BASE}/disks`);
    return res.json();
  },

  async getShares(): Promise<Share[]> {
    const res = await fetch(`${API_BASE}/shares`);
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  }
};

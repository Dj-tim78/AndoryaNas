
import { User, Group, Share, StorageDisk, StoragePool } from './types';

// Utilise l'IP actuelle du navigateur ou localhost, sur le port 3000
const API_BASE = `http://${window.location.hostname || 'localhost'}:3000/api`;

export const api = {
  async checkConnection(): Promise<boolean> {
    try {
      // Timeout court pour ne pas bloquer l'UI
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1500);
      
      const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
      clearTimeout(id);
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async getSystemStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error("Stats unreachable");
    return res.json();
  },

  async getDisks(): Promise<StorageDisk[]> {
    const res = await fetch(`${API_BASE}/disks`);
    if (!res.ok) throw new Error("Disks unreachable");
    return res.json();
  },

  async getShares(): Promise<Share[]> {
    const res = await fetch(`${API_BASE}/shares`);
    if (!res.ok) throw new Error("Shares unreachable");
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error("Users unreachable");
    return res.json();
  }
};

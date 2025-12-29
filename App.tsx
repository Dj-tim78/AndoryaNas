
import React, { useState, useEffect } from 'react';
import { View, User, Group, Share } from './types';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NetworkShares from './components/NetworkShares';
import MappingWizard from './components/MappingWizard';
import GeminiAssistant from './components/GeminiAssistant';
import StorageManager from './components/StorageManager';
import UserManagement from './components/UserManagement';
import SettingsView from './components/Settings';
import Login from './components/Login';
import { 
  LayoutDashboard, 
  Database, 
  Network, 
  MonitorPlay, 
  Settings as SettingsIcon, 
  Bot,
  Users,
  Wifi,
  WifiOff
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [isLive, setIsLive] = useState(false);
  
  const [serverName, setServerName] = useState('AndoryaNas-Home');
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'admin', password: 'admin', role: 'Admin', status: 'Active', lastLogin: 'Just now', groups: ['admin'] },
  ]);
  
  const [shares, setShares] = useState<Share[]>([
    { id: '1', name: 'Media', path: '/volume1/media', protocol: 'SMB', status: 'Active', isPrivate: false, authorizedUsers: [], sizeUsed: 8400, sizeTotal: 10000 },
  ]);

  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'admin', memberCount: 1 },
  ]);

  // Vérification de la connexion au serveur réel au démarrage
  useEffect(() => {
    const initApp = async () => {
      const connected = await api.checkConnection();
      setIsLive(connected);
      if (connected) {
        try {
          const [realUsers, realShares] = await Promise.all([
            api.getUsers(),
            api.getShares()
          ]);
          setUsers(realUsers);
          setShares(realShares);
        } catch (e) {
          console.warn("Erreur lors de la récupération des données réelles, passage en mode démo.");
        }
      }
    };
    initApp();
  }, []);

  const handleLogin = (user: string) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleLogout} 
        serverName={serverName}
      />
      <main className="flex-1 overflow-y-auto bg-zinc-900/50 backdrop-blur-sm border-l border-zinc-800">
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold tracking-tight">
              {activeView.replace('_', ' ')}
            </h1>
            {isLive ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-black text-emerald-500 uppercase">
                <Wifi size={10} /> Live Server
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-black text-amber-500 uppercase">
                <WifiOff size={10} /> Simulation Mode
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-full border border-zinc-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs font-bold text-zinc-300">{serverName} • {currentUser}</span>
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {activeView === View.DASHBOARD && <Dashboard isLive={isLive} />}
          {activeView === View.SHARES && <NetworkShares shares={shares} onUpdateShares={setShares} />}
          {activeView === View.USERS && <UserManagement users={users} groups={groups} onUpdateUsers={setUsers} onUpdateGroups={setGroups} />}
          {activeView === View.DRIVE_MAPPING && <MappingWizard />}
          {activeView === View.STORAGE && <StorageManager isLive={isLive} />}
          {activeView === View.SETTINGS && <SettingsView serverName={serverName} onUpdateServerName={setServerName} />}
          {activeView === View.GEMINI_HELP && <GeminiAssistant />}
        </div>
      </main>
    </div>
  );
};

export default App;

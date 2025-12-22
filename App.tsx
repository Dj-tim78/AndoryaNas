
import React, { useState } from 'react';
import { View, User, Group, Share } from './types';
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
  LogOut
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  
  // Global Shared States
  const [serverName, setServerName] = useState('AndoryaNas-Home');
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'admin', role: 'Admin', status: 'Active', lastLogin: 'Just now', groups: ['admin'] },
    { id: '2', username: 'media_box', role: 'User', status: 'Active', lastLogin: '2h ago', groups: ['multimedia'] },
  ]);
  
  const [shares, setShares] = useState<Share[]>([
    { id: '1', name: 'Media', path: '/volume1/media', protocol: 'SMB', status: 'Active', isPrivate: false, authorizedUsers: [], sizeUsed: 8400, sizeTotal: 10000 },
    { id: '2', name: 'Backups', path: '/volume1/backups', protocol: 'SMB', status: 'Locked', isPrivate: true, authorizedUsers: ['admin'], sizeUsed: 2800, sizeTotal: 5000 },
    { id: '3', name: 'Dev', path: '/volume1/projects', protocol: 'NFS', status: 'Active', isPrivate: true, authorizedUsers: ['admin'], sizeUsed: 450, sizeTotal: 1000 },
  ]);

  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'admin', memberCount: 1 },
    { id: '2', name: 'multimedia', memberCount: 1 },
  ]);

  const handleLogin = (user: string) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.SHARES: 
        return <NetworkShares shares={shares} onUpdateShares={setShares} />;
      case View.USERS: 
        return <UserManagement 
          users={users} 
          groups={groups} 
          onUpdateUsers={setUsers} 
          onUpdateGroups={setGroups} 
        />;
      case View.DRIVE_MAPPING: return <MappingWizard />;
      case View.STORAGE: return <StorageManager />;
      case View.SETTINGS: 
        return <SettingsView serverName={serverName} onUpdateServerName={setServerName} />;
      case View.GEMINI_HELP: return <GeminiAssistant />;
      default: return null;
    }
  };

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
            {activeView === View.DASHBOARD && <LayoutDashboard className="text-indigo-400" size={20} />}
            {activeView === View.SHARES && <Network className="text-emerald-400" size={20} />}
            {activeView === View.USERS && <Users className="text-cyan-400" size={20} />}
            {activeView === View.DRIVE_MAPPING && <MonitorPlay className="text-amber-400" size={20} />}
            {activeView === View.STORAGE && <Database className="text-rose-400" size={20} />}
            {activeView === View.SETTINGS && <SettingsIcon className="text-zinc-400" size={20} />}
            {activeView === View.GEMINI_HELP && <Bot className="text-purple-400" size={20} />}
            <h1 className="text-lg font-semibold tracking-tight">
              {activeView.replace('_', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-full border border-zinc-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs font-bold text-zinc-300">{serverName} • {currentUser}</span>
            </div>
            <button onClick={() => setActiveView(View.SETTINGS)} className={`p-2 rounded-lg transition-all ${activeView === View.SETTINGS ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800 text-zinc-400'}`}>
              <SettingsIcon size={18} />
            </button>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;


import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  Database, 
  Network, 
  MonitorPlay, 
  Bot,
  HardDrive,
  Users,
  LogOut,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-400' },
    { id: View.STORAGE, label: 'Storage Manager', icon: Database, color: 'text-rose-400' },
    { id: View.SHARES, label: 'Network Shares', icon: Network, color: 'text-emerald-400' },
    { id: View.USERS, label: 'Users & Groups', icon: Users, color: 'text-cyan-400' },
    { id: View.DRIVE_MAPPING, label: 'Network Letters', icon: MonitorPlay, color: 'text-amber-400' },
    { id: View.SETTINGS, label: 'Server Config', icon: Settings, color: 'text-zinc-400' },
    { id: View.GEMINI_HELP, label: 'AI Assistant', icon: Bot, color: 'text-purple-400' },
  ];

  return (
    <aside className="w-64 bg-zinc-950 flex flex-col p-6 space-y-8 h-full">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <HardDrive className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
          AndoryaNas
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-zinc-800/80 text-white shadow-sm border border-zinc-700' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Icon size={18} className={`${isActive ? item.color : 'text-zinc-500 group-hover:text-zinc-400'}`} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className={`ml-auto w-1.5 h-1.5 rounded-full ${item.color.replace('text', 'bg')}`} />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Pool Usage</span>
            <span className="text-[10px] text-zinc-400">82%</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded-full">
            <div className="h-full bg-indigo-500 w-[82%] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium text-sm"
        >
          <LogOut size={18} />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
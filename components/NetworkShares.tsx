
import React from 'react';
import { Share } from '../types';
import { Plus, Search, MoreVertical, Lock, Unlock, Shield, Users, UserCheck } from 'lucide-react';

const mockShares: Share[] = [
  { id: '1', name: 'Media', path: '/volume1/media', protocol: 'SMB', status: 'Active', isPrivate: false, authorizedUsers: [], sizeUsed: 8400, sizeTotal: 10000 },
  { id: '2', name: 'Backups', path: '/volume1/backups', protocol: 'SMB', status: 'Locked', isPrivate: true, authorizedUsers: ['admin', 'family_media'], sizeUsed: 2800, sizeTotal: 5000 },
  { id: '3', name: 'Dev', path: '/volume1/projects', protocol: 'NFS', status: 'Active', isPrivate: true, authorizedUsers: ['admin'], sizeUsed: 450, sizeTotal: 1000 },
  { id: '4', name: 'Public', path: '/volume1/public', protocol: 'AFP', status: 'Active', isPrivate: false, authorizedUsers: [], sizeUsed: 120, sizeTotal: 2000 },
];

const NetworkShares: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search folders or protocols..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={18} />
          <span className="text-sm font-semibold">Create Share</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockShares.map((share) => (
          <div key={share.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group relative overflow-hidden">
            {share.isPrivate && (
              <div className="absolute top-0 right-0 p-1">
                <div className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-bl-xl text-[10px] font-bold flex items-center gap-1">
                  <Lock size={10} /> PROTECTED
                </div>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${
                  share.isPrivate ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {share.isPrivate ? <Shield size={20} /> : <Unlock size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-zinc-100">{share.name}</h4>
                  <p className="text-xs font-mono text-zinc-500">{share.path}</p>
                </div>
              </div>
              <button className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                    share.protocol === 'SMB' ? 'bg-indigo-500/20 text-indigo-400' :
                    share.protocol === 'NFS' ? 'bg-rose-500/20 text-rose-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {share.protocol}
                  </span>
                  <span className="text-xs text-zinc-500">•</span>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                    <Users size={14} className="text-zinc-500" />
                    {share.isPrivate ? `${share.authorizedUsers.length} Users` : 'Public Access'}
                  </div>
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  {share.sizeUsed >= 1024 ? `${(share.sizeUsed/1024).toFixed(1)} TB` : `${share.sizeUsed} GB`} 
                  {' / '}
                  {share.sizeTotal >= 1024 ? `${(share.sizeTotal/1024).toFixed(0)} TB` : `${share.sizeTotal} GB`}
                </div>
              </div>

              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    share.isPrivate ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${(share.sizeUsed / share.sizeTotal) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-300">
                  <UserCheck size={14} className="text-cyan-400" />
                  Manage Permissions
                </button>
                <button className="flex-1 text-xs font-semibold py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-300">
                  Settings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkShares;

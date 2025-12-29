
import React, { useState } from 'react';
import { Share } from './types';
import { Plus, Search, MoreVertical, Lock, Unlock, Shield, Users, UserCheck, Edit2, Trash2, X } from 'lucide-react';

interface NetworkSharesProps {
  shares: Share[];
  onUpdateShares: (shares: Share[]) => void;
}

const NetworkShares: React.FC<NetworkSharesProps> = ({ shares, onUpdateShares }) => {
  const [editingShare, setEditingShare] = useState<Share | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShares = shares.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.protocol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce partage ?')) {
      onUpdateShares(shares.filter(s => s.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShare) return;

    if (editingShare.id === 'new') {
      const newShare = { ...editingShare, id: Math.random().toString(36).substr(2, 9) };
      onUpdateShares([...shares, newShare]);
    } else {
      onUpdateShares(shares.map(s => s.id === editingShare.id ? editingShare : s));
    }
    setEditingShare(null);
  };

  const openNewModal = () => {
    setEditingShare({
      id: 'new',
      name: '',
      path: '/volume1/',
      protocol: 'SMB',
      status: 'Active',
      isPrivate: false,
      authorizedUsers: [],
      sizeUsed: 0,
      sizeTotal: 5000
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search folders or protocols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
          />
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 font-bold text-sm"
        >
          <Plus size={18} />
          <span>Create Share</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredShares.map((share) => (
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
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingShare(share)}
                  className="p-2 text-zinc-500 hover:text-indigo-400 bg-zinc-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(share.id)}
                  className="p-2 text-zinc-500 hover:text-rose-500 bg-zinc-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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

              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden p-[1px]">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    share.isPrivate ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.max(2, (share.sizeUsed / share.sizeTotal) * 100)}%` }}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-300">
                  <UserCheck size={14} className="text-cyan-400" />
                  Manage Permissions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-3xl relative animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">{editingShare.id === 'new' ? 'Nouveau Partage' : 'Modifier Partage'}</h3>
              <button onClick={() => setEditingShare(null)} className="p-2 text-zinc-500 hover:text-white rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Nom du dossier</label>
                <input 
                  type="text" 
                  value={editingShare.name}
                  onChange={(e) => setEditingShare({...editingShare, name: e.target.value})}
                  className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-bold text-white"
                  placeholder="ex: Photos_Vacances"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Chemin Physique</label>
                <input 
                  type="text" 
                  value={editingShare.path}
                  onChange={(e) => setEditingShare({...editingShare, path: e.target.value})}
                  className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs font-mono text-white"
                  placeholder="/volume1/data"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Protocole</label>
                  <select 
                    value={editingShare.protocol}
                    onChange={(e) => setEditingShare({...editingShare, protocol: e.target.value as any})}
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-white"
                  >
                    <option value="SMB">SMB (Windows/Mac)</option>
                    <option value="NFS">NFS (Linux)</option>
                    <option value="AFP">AFP (Legacy Mac)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Visibilité</label>
                  <button 
                    type="button"
                    onClick={() => setEditingShare({...editingShare, isPrivate: !editingShare.isPrivate})}
                    className={`w-full py-4 rounded-2xl text-xs font-bold border-2 transition-all ${
                      editingShare.isPrivate 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {editingShare.isPrivate ? 'Privé (Protégé)' : 'Public (Ouvert)'}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setEditingShare(null)}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-2xl font-bold transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkShares;

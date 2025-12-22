
import React, { useState } from 'react';
import { User, Group } from '../types';
import { 
  UserPlus, Search, Shield, Key, Trash2, Eye, EyeOff, 
  Users, CheckCircle2, XCircle, Edit2, X, Save, AlertTriangle 
} from 'lucide-react';

interface UserManagementProps {
  users: User[];
  groups: Group[];
  onUpdateUsers: (users: User[]) => void;
  onUpdateGroups: (groups: Group[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, groups, onUpdateUsers, onUpdateGroups }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form States
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'User' | 'Guest'>('User');
  const [newGroupName, setNewGroupName] = useState('');

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUsername,
      password: newPassword || 'password', // Valeur par défaut si vide
      role: newRole,
      status: 'Active',
      lastLogin: 'Never',
      groups: []
    };
    
    onUpdateUsers([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
    setShowAddModal(false);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const toggleUserStatus = (id: string) => {
    onUpdateUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Disabled' : 'Active' };
      }
      return u;
    }));
  };

  const handleResetPassword = (username: string) => {
    alert(`Un lien de réinitialisation a été généré pour ${username}. (Simulation)`);
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    if (groups.some(g => g.name.toLowerCase() === newGroupName.toLowerCase())) {
        alert("Ce groupe existe déjà.");
        return;
    }
    
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGroupName.toLowerCase(),
      memberCount: 0
    };
    
    onUpdateGroups([...groups, newGroup]);
    setNewGroupName('');
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('Supprimer ce groupe ? Cela ne supprimera pas les utilisateurs associés mais retirera leur appartenance.')) {
      onUpdateGroups(groups.filter(g => g.id !== id));
      onUpdateUsers(users.map(u => ({
          ...u,
          groups: u.groups.filter(gn => gn !== groups.find(g => g.id === id)?.name)
      })));
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-1 p-1 bg-zinc-950/50 w-fit rounded-xl border border-zinc-800">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Utilisateurs
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'groups' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Groupes
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Rechercher un ${activeTab === 'users' ? 'utilisateur' : 'groupe'}...`}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-lg shadow-cyan-600/20 font-bold text-sm"
        >
          {activeTab === 'users' ? <UserPlus size={18} /> : <Users size={18} />}
          <span>{activeTab === 'users' ? 'Ajouter un utilisateur' : 'Ajouter un groupe'}</span>
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl">
        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800">
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-nowrap">Profil</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-nowrap">Rôle</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center text-nowrap">Statut</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform">
                          <Shield size={20} className={user.role === 'Admin' ? 'text-amber-400' : 'text-cyan-400'} />
                        </div>
                        <div>
                          <span className="font-bold text-zinc-100 block">{user.username}</span>
                          <span className="text-[10px] text-zinc-500 font-mono italic">Connexion : {user.lastLogin}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${
                        user.role === 'Admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        user.role === 'User' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        'bg-zinc-700/30 text-zinc-400 border border-zinc-700/50'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => toggleUserStatus(user.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                            user.status === 'Active' 
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20'
                          }`}
                        >
                          {user.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          <span className="text-[10px] font-bold uppercase">{user.status === 'Active' ? 'Actif' : 'Désactivé'}</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleResetPassword(user.username)}
                          title="Réinitialiser mot de passe"
                          className="p-2 text-zinc-500 hover:text-amber-400 bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Key size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingUser(user)}
                          title="Modifier"
                          className="p-2 text-zinc-500 hover:text-cyan-400 bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          title="Supprimer"
                          className="p-2 text-zinc-500 hover:text-rose-400 bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map(group => (
                <div key={group.id} className="p-6 bg-zinc-950/50 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Users size={24} className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-100 capitalize">{group.name}</h4>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">{group.memberCount} Membres</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2 text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              {/* Add Group Card */}
              <form onSubmit={handleAddGroup} className="p-6 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col justify-center gap-4 bg-zinc-950/20">
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Nom du nouveau groupe"
                  className="bg-transparent text-sm font-bold border-b border-zinc-800 focus:border-cyan-500 outline-none pb-2 text-center placeholder:text-zinc-700"
                />
                <button type="submit" className="text-xs font-bold text-cyan-500 hover:text-cyan-400 flex items-center justify-center gap-2 py-1">
                   <Plus size={14} /> Créer le groupe
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                            <Edit2 size={32} className="text-cyan-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Modifier l'utilisateur</h3>
                            <p className="text-zinc-500 text-sm">Édition des privilèges de {editingUser.username}</p>
                        </div>
                    </div>
                    <button onClick={() => setEditingUser(null)} className="p-2 text-zinc-500 hover:text-white rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleUpdateUser} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Identifiant</label>
                        <input 
                            type="text" 
                            value={editingUser.username}
                            onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                            className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm font-bold"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Rôle Système</label>
                            <select 
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                                className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm appearance-none"
                            >
                                <option value="User">Utilisateur Standard</option>
                                <option value="Admin">Administrateur</option>
                                <option value="Guest">Invité</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">État du Compte</label>
                            <button 
                                type="button"
                                onClick={() => setEditingUser({...editingUser, status: editingUser.status === 'Active' ? 'Disabled' : 'Active'})}
                                className={`w-full py-4 rounded-2xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                                    editingUser.status === 'Active' 
                                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                                        : 'bg-rose-500/10 border-rose-500 text-rose-500'
                                }`}
                            >
                                {editingUser.status === 'Active' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                {editingUser.status === 'Active' ? 'ACTIF' : 'DÉSACTIVÉ'}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-3">
                        <AlertTriangle className="text-amber-500" size={18} />
                        <p className="text-[11px] text-zinc-500 italic">La modification du rôle peut affecter l'accès aux volumes sécurisés.</p>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-zinc-800">
                        <button 
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-2xl font-bold transition-all"
                        >
                            Annuler
                        </button>
                        <button type="submit" className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-cyan-600/20 flex items-center justify-center gap-2">
                            <Save size={18} /> Mettre à jour
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {showAddModal && activeTab === 'users' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 text-zinc-100">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                        <UserPlus size={32} className="text-cyan-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Nouvel Utilisateur</h3>
                        <p className="text-zinc-500 text-sm">Provisionnement d'un nouvel accès sécurisé.</p>
                    </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-zinc-500 hover:text-white rounded-full">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Identifiant de compte</label>
                <input 
                  type="text" 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm font-bold text-white"
                  placeholder="ex: j_dupont"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Rôle d'accès</label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm text-white"
                  >
                    <option value="User">Utilisateur Standard</option>
                    <option value="Admin">Administrateur</option>
                    <option value="Guest">Invité</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Statut Initial</label>
                  <div className="flex items-center gap-4 py-4 px-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-xs font-black text-zinc-300 uppercase">Actif</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Mot de passe sécurisé</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 pr-14 text-sm font-mono text-white"
                    placeholder="Saisissez un mot de passe"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-all"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-cyan-600/20">
                  Créer le profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Plus = ({ size, className = '' }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default UserManagement;

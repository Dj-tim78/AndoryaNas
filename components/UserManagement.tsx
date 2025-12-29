
import React, { useState, useMemo } from 'react';
import { User, Group } from '../types';
import { 
  UserPlus, Search, Shield, Key, Trash2, Eye, EyeOff, 
  Users, CheckCircle2, XCircle, Edit2, X, Save, AlertTriangle,
  UserCheck, Hash, Tag, ChevronRight, MoreHorizontal, Filter
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
  
  // Form States for New User
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'User' | 'Guest'>('User');
  const [newUserGroups, setNewUserGroups] = useState<string[]>([]);

  // Calculate member count dynamically
  const groupsWithCounts = useMemo(() => {
    return groups.map(group => ({
      ...group,
      memberCount: users.filter(user => user.groups.includes(group.name)).length
    }));
  }, [groups, users]);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groupsWithCounts.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUsername,
      password: newPassword || 'password',
      role: newRole,
      status: 'Active',
      lastLogin: 'Never',
      groups: newUserGroups
    };
    
    onUpdateUsers([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
    setNewUserGroups([]);
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

  const toggleGroupInForm = (groupName: string, isEditing: boolean) => {
    if (isEditing && editingUser) {
      const current = editingUser.groups.includes(groupName)
        ? editingUser.groups.filter(g => g !== groupName)
        : [...editingUser.groups, groupName];
      setEditingUser({ ...editingUser, groups: current });
    } else {
      const current = newUserGroups.includes(groupName)
        ? newUserGroups.filter(g => g !== groupName)
        : [...newUserGroups, groupName];
      setNewUserGroups(current);
    }
  };

  const handleAddGroup = (e: React.FormEvent) => {
    const newName = prompt("Entrez le nom du nouveau groupe :");
    if (!newName || !newName.trim()) return;
    
    if (groups.some(g => g.name.toLowerCase() === newName.toLowerCase())) {
        alert("Ce groupe existe déjà.");
        return;
    }
    
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName.toLowerCase(),
      memberCount: 0
    };
    
    onUpdateGroups([...groups, newGroup]);
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('Supprimer ce groupe ? Les utilisateurs ne seront plus membres mais leurs comptes resteront actifs.')) {
      const groupToDelete = groups.find(g => g.id === id);
      if (!groupToDelete) return;
      
      onUpdateGroups(groups.filter(g => g.id !== id));
      onUpdateUsers(users.map(u => ({
          ...u,
          groups: u.groups.filter(gn => gn !== groupToDelete.name)
      })));
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-1 p-1 bg-zinc-950/80 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'users' 
                ? 'bg-zinc-800 text-cyan-400 shadow-lg border border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <UserIcon size={14} />
            Utilisateurs
          </button>
          <button 
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'groups' 
                ? 'bg-zinc-800 text-purple-400 shadow-lg border border-zinc-700' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Users size={14} />
            Groupes
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Filtrer par nom...`}
              className="pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-xs font-medium w-64"
            />
          </div>
          <button 
            onClick={() => activeTab === 'users' ? setShowAddModal(true) : handleAddGroup(null as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all shadow-xl font-black text-xs uppercase tracking-widest ${
              activeTab === 'users' 
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20' 
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
            }`}
          >
            {activeTab === 'users' ? <UserPlus size={16} /> : <Users size={16} />}
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/20 border-b border-zinc-800">
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Utilisateur</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Privilèges</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Groupes</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center">État</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/20 transition-colors group/row">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center border border-zinc-700 shadow-lg group-hover/row:scale-105 transition-transform duration-300">
                          <Shield size={20} className={user.role === 'Admin' ? 'text-amber-400' : 'text-cyan-400'} />
                        </div>
                        <div>
                          <span className="font-black text-zinc-100 block text-sm tracking-tight">{user.username}</span>
                          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                            <Hash size={10} /> ID: {user.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${
                        user.role === 'Admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        user.role === 'User' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                        'bg-zinc-700/30 text-zinc-400 border-zinc-700/50'
                      }`}>
                        {user.role === 'Admin' && <Shield size={10} />}
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {user.groups.length > 0 ? (
                          user.groups.map(g => (
                            <span key={g} className="px-2 py-0.5 bg-zinc-800/80 text-zinc-400 text-[9px] font-bold uppercase rounded border border-zinc-700">
                              {g}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-zinc-600 italic">Aucun groupe</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                          user.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{user.status === 'Active' ? 'Actif' : 'Bloqué'}</span>
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2.5 text-zinc-400 hover:text-cyan-400 bg-zinc-800/80 rounded-xl transition-all border border-zinc-700/50 hover:border-cyan-500/30"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2.5 text-zinc-400 hover:text-rose-500 bg-zinc-800/80 rounded-xl transition-all border border-zinc-700/50 hover:border-rose-500/30"
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
          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map(group => (
                <div key={group.id} className="p-8 bg-zinc-950/40 border border-zinc-800 rounded-[2rem] hover:border-purple-500/30 transition-all flex flex-col group/card shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                     <button 
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-2 text-zinc-700 hover:text-rose-500 transition-colors opacity-0 group-hover/card:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-inner">
                      <Users size={28} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-100 capitalize text-lg tracking-tight">{group.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <UserCheck size={12} className="text-purple-500/60" />
                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{group.memberCount} Membres</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        {[...Array(Math.min(group.memberCount, 3))].map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center">
                            <UserIcon size={10} className="text-zinc-500" />
                          </div>
                        ))}
                        {group.memberCount > 3 && (
                          <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-950 flex items-center justify-center text-[8px] font-black text-zinc-500">
                            +{group.memberCount - 3}
                          </div>
                        )}
                     </div>
                     <button className="text-[10px] font-black uppercase text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                       Gérer <ChevronRight size={12} />
                     </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => handleAddGroup(null as any)}
                className="p-8 border-2 border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center gap-4 bg-zinc-950/20 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group/new"
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 group-hover/new:border-purple-500/50 group-hover/new:text-purple-500 transition-all">
                   <Plus size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-600 group-hover/new:text-zinc-400">Nouveau Groupe</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS: ADD / EDIT USER */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-3xl relative animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl border ${showAddModal ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                  {showAddModal ? <UserPlus size={32} /> : <Edit2 size={32} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tight uppercase">
                    {showAddModal ? 'Nouvel Accès' : 'Profil Utilisateur'}
                  </h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                    {showAddModal ? 'Provisionnement de sécurité' : `Configuration: ${editingUser?.username}`}
                  </p>
                </div>
              </div>
              <button onClick={() => { setShowAddModal(false); setEditingUser(null); }} className="p-3 bg-zinc-800/50 text-zinc-500 hover:text-white rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddUser : handleUpdateUser} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Identifiant Unique</label>
                    <input 
                      type="text" 
                      value={showAddModal ? newUsername : editingUser?.username}
                      onChange={(e) => showAddModal ? setNewUsername(e.target.value) : setEditingUser({...editingUser!, username: e.target.value})}
                      className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm font-bold text-white shadow-inner"
                      placeholder="Identifiant"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Niveau d'Accès</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Admin', 'User', 'Guest'].map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => showAddModal ? setNewRole(role as any) : setEditingUser({...editingUser!, role: role as any})}
                          className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all ${
                            (showAddModal ? newRole === role : editingUser?.role === role)
                              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {showAddModal && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Secret d'Authentification</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 pr-14 text-sm font-mono text-white shadow-inner"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Tag size={12} /> Appartenance aux Groupes
                    </label>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 max-h-[220px] overflow-y-auto space-y-2 scrollbar-hide shadow-inner">
                      {groups.map(group => {
                        const isMember = showAddModal 
                          ? newUserGroups.includes(group.name)
                          : editingUser?.groups.includes(group.name);
                        return (
                          <button
                            key={group.id}
                            type="button"
                            onClick={() => toggleGroupInForm(group.name, !showAddModal)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                              isMember 
                                ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-600'
                            }`}
                          >
                            <span className="text-xs font-bold capitalize">{group.name}</span>
                            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${
                              isMember ? 'bg-purple-500 border-purple-500' : 'border-zinc-700'
                            }`}>
                              {isMember && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                          </button>
                        );
                      })}
                      {groups.length === 0 && (
                        <p className="text-[10px] text-zinc-700 italic text-center py-4">Aucun groupe disponible.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-zinc-800">
                <button 
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingUser(null); }}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-cyan-600/20 flex items-center justify-center gap-2">
                  <Save size={18} /> {showAddModal ? 'Créer le profil' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const UserIcon = ({ size, className = '' }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Plus = ({ size, className = '' }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default UserManagement;

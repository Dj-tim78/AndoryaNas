import React, { useState } from 'react';
import { User, Group } from '../types';
import { UserPlus, Search, Shield, Key, Trash2, Eye, EyeOff, Users, CheckCircle2, XCircle } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  groups: Group[];
  onUpdateUsers: (users: User[]) => void;
  onUpdateGroups: (groups: Group[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, groups, onUpdateUsers, onUpdateGroups }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'User' | 'Guest'>('User');
  const [newGroupName, setNewGroupName] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUsername,
      role: newRole,
      status: 'Active',
      lastLogin: 'Never',
      groups: []
    };
    
    onUpdateUsers([...users, newUser]);
    setNewUsername('');
    setShowAddModal(false);
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGroupName,
      memberCount: 0
    };
    
    onUpdateGroups([...groups, newGroup]);
    setNewGroupName('');
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
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
          Users
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'groups' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Groups
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-lg shadow-cyan-600/20 font-bold text-sm"
        >
          {activeTab === 'users' ? <UserPlus size={18} /> : <Users size={18} />}
          <span>{activeTab === 'users' ? 'Add User' : 'Add Group'}</span>
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl">
        {activeTab === 'users' ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Security</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform">
                        <Shield size={20} className={user.role === 'Admin' ? 'text-amber-400' : 'text-cyan-400'} />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-100 block">{user.username}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">Last seen: {user.lastLogin}</span>
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
                    <div className="flex items-center justify-center gap-2">
                      {user.status === 'Active' ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-500 uppercase">Secure</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
                          <XCircle size={12} className="text-rose-500" />
                          <span className="text-[10px] font-bold text-rose-500 uppercase">Disabled</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-500 hover:text-cyan-400 bg-zinc-800 rounded-lg">
                        <Key size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-zinc-500 hover:text-rose-400 bg-zinc-800 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map(group => (
                <div key={group.id} className="p-6 bg-zinc-950/50 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Users size={24} className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-100">{group.name}</h4>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">{group.memberCount} Members</p>
                    </div>
                  </div>
                  <button className="p-2 text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              {/* Add Group Card */}
              <form onSubmit={handleAddGroup} className="p-6 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col justify-center gap-4">
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="New Group Name"
                  className="bg-transparent text-sm font-bold border-b border-zinc-800 focus:border-cyan-500 outline-none pb-2 text-center"
                />
                <button type="submit" className="text-xs font-bold text-cyan-500 hover:text-cyan-400 flex items-center justify-center gap-2">
                   <Plus size={14} /> Create Group
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {showAddModal && activeTab === 'users' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-cyan-500/10 rounded-2xl">
                <UserPlus size={32} className="text-cyan-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">New NAS User</h3>
                <p className="text-zinc-500 text-sm">Create a secure entry point for a team member.</p>
              </div>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Account Username</label>
                <input 
                  type="text" 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g. s_smith"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Access Role</label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    <option value="User">Standard User</option>
                    <option value="Admin">Administrator</option>
                    <option value="Guest">Limited Guest</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Status</label>
                  <div className="flex items-center gap-4 py-4 px-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-zinc-300 uppercase">Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Secure Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/50 pr-14"
                    placeholder="Auto-generated or custom"
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
                  Discard
                </button>
                <button type="submit" className="flex-1 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-cyan-600/20">
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Fix for property 'className' missing error by making it optional with a default value
const Plus = ({ size, className = '' }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default UserManagement;
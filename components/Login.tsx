
import React, { useState } from 'react';
import { Shield, Key, User as UserIcon, Loader2, HardDrive } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (username: string) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Recherche de l'utilisateur dans la liste dynamique
    setTimeout(() => {
      const foundUser = users.find(u => u.username === username);
      
      if (foundUser && foundUser.password === password) {
        if (foundUser.status === 'Disabled') {
          setError('Ce compte est désactivé. Contactez l\'administrateur.');
          setIsLoading(false);
        } else {
          onLogin(username);
        }
      } else {
        setError('Identifiants invalides. Vérifiez votre nom d\'utilisateur et mot de passe.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 overflow-hidden text-zinc-100">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <HardDrive className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-zinc-100">AndoryaNas Login</h1>
          <p className="text-zinc-500 text-sm mt-1">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-white"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium animate-in slide-in-from-top-2 text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <span>Unlock NAS</span>
                <Shield size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-800/50 flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          <span>Encrypted Session</span>
          <span>v2.4.0-Andorya</span>
        </div>
      </div>
    </div>
  );
};

export default Login;

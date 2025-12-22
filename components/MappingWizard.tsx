
import React, { useState } from 'react';
import { Monitor, Apple, Terminal, Copy, Check, Info, Lock } from 'lucide-react';

const MappingWizard: React.FC = () => {
  const [os, setOs] = useState<'Windows' | 'macOS' | 'Linux'>('Windows');
  const [driveLetter, setDriveLetter] = useState('Z');
  const [sharePath, setSharePath] = useState('\\\\AndoryaNas\\Media');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const getCommand = () => {
    switch (os) {
      case 'Windows':
        const pwdPart = password ? ` ${password}` : '';
        return `net use ${driveLetter}: "${sharePath}"${pwdPart} /user:${username} /persistent:yes`;
      case 'macOS':
        const smbPath = sharePath.replace(/\\/g, '/').replace(/^\/\//, '');
        const authPart = password ? `${username}:${password}@` : `${username}@`;
        return `open "smb://${authPart}${smbPath}"`;
      case 'Linux':
        const linuxPath = sharePath.replace(/\\/g, '/').replace(/^\/\//, '');
        const pwdOption = password ? `,password=${password}` : '';
        return `sudo mount -t cifs -o username=${username}${pwdOption} //${linuxPath} /mnt/nas`;
      default:
        return '';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Network Drive Wizard</h2>
        <p className="text-zinc-500">Generate the command with credentials to securely map your folders.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { id: 'Windows', icon: Monitor, label: 'Windows' },
          { id: 'macOS', icon: Apple, label: 'macOS' },
          { id: 'Linux', icon: Terminal, label: 'Linux' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setOs(item.id as any)}
            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
              os === item.id 
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/10' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
            }`}
          >
            <item.icon size={32} />
            <span className="text-sm font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
              <Info size={14} /> Path Configuration
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Share Path</label>
                <input 
                  type="text" 
                  value={sharePath}
                  onChange={(e) => setSharePath(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-mono text-sm"
                  placeholder="\\NAS-IP\Folder"
                />
              </div>
              {os === 'Windows' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Drive Letter</label>
                  <select 
                    value={driveLetter}
                    onChange={(e) => setDriveLetter(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-mono"
                  >
                    {['Z', 'Y', 'X', 'W', 'V', 'U', 'S'].map(l => (
                      <option key={l} value={l}>{l}:</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-amber-500 uppercase flex items-center gap-2">
              <Lock size={14} /> Credentials
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-mono text-sm"
                  placeholder="AndoryaNas username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Password (Optional)</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-mono text-sm"
                  placeholder="Leave empty to be prompted"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Final Command</label>
          <div className="relative group">
            <div className="w-full px-6 py-5 bg-black border border-zinc-800 rounded-2xl font-mono text-sm text-indigo-300 break-all pr-14 leading-relaxed">
              {getCommand()}
            </div>
            <button 
              onClick={copyToClipboard}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all shadow-lg"
            >
              {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 font-medium">Copy and paste this into your {os === 'Windows' ? 'Command Prompt' : 'Terminal'}.</p>
        </div>
      </div>
    </div>
  );
};

export default MappingWizard;
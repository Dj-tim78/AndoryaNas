
import React, { useState, useMemo } from 'react';
import { Server, Globe, HardDrive, Cpu, Terminal, FileText, Copy, Check, Save, Info, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
  serverName: string;
  onUpdateServerName: (name: string) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ serverName, onUpdateServerName }) => {
  const [localServerInfo, setLocalServerInfo] = useState({
    name: serverName,
    ip: '192.168.1.45',
    os: 'Ubuntu Server 22.04 LTS',
    storage: '15 TB',
    sshPort: '22'
  });

  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const readmeContent = useMemo(() => {
    return `# 🚀 AndoryaNas Management Suite - ${localServerInfo.name}

## 📋 Server Specification
- **Hostname**: ${localServerInfo.name}
- **Local IP**: ${localServerInfo.ip}
- **Host OS**: ${localServerInfo.os}
- **Capacity**: ${localServerInfo.storage}
- **SSH Port**: ${localServerInfo.sshPort}

## 🛠️ Installation Guide
1. Prerequisites: Ensure you have Node.js (v18+) and npm.
2. Deployment: git clone the repository and run npm install.
3. Env Setup: API_KEY=your_gemini_key_here in .env.
4. Build: npm run build && serve -s dist -l 3000.
`;
  }, [localServerInfo]);

  const copyReadme = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = () => {
    onUpdateServerName(localServerInfo.name);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {showSuccess && (
        <div className="fixed top-24 right-8 z-[200] animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-900/40 border border-emerald-500">
            <CheckCircle2 size={20} />
            <span className="font-bold text-sm">Informations serveur mises à jour !</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Server Config Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-zinc-800 rounded-2xl">
              <Server className="text-zinc-100" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Server Identity</h3>
              <p className="text-xs text-zinc-500 font-medium">Configure how the NAS identifies itself.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Server Name</label>
              <div className="relative">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="text" 
                  value={localServerInfo.name}
                  onChange={(e) => setLocalServerInfo({...localServerInfo, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Static IP</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="text" 
                  value={localServerInfo.ip}
                  onChange={(e) => setLocalServerInfo({...localServerInfo, ip: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Host Operating System</label>
            <div className="relative">
              <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                type="text" 
                value={localServerInfo.os}
                onChange={(e) => setLocalServerInfo({...localServerInfo, os: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Raw Capacity</label>
              <div className="relative">
                <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="text" 
                  value={localServerInfo.storage}
                  onChange={(e) => setLocalServerInfo({...localServerInfo, storage: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">SSH Port</label>
              <input 
                type="text" 
                value={localServerInfo.sshPort}
                onChange={(e) => setLocalServerInfo({...localServerInfo, sshPort: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono text-center"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex gap-4">
            <button 
              onClick={handleUpdate}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Save size={18} /> Update Server Identity
            </button>
          </div>
        </div>

        {/* README Generator Preview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <FileText className="text-emerald-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Installation README</h3>
                <p className="text-xs text-zinc-500 font-medium">Auto-generated deployment guide.</p>
              </div>
            </div>
            <button 
              onClick={copyReadme}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs ${
                copied ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy README'}
            </button>
          </div>

          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-xs overflow-y-auto leading-relaxed scrollbar-hide select-text">
            <pre className="whitespace-pre-wrap text-emerald-500/80">
              {readmeContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

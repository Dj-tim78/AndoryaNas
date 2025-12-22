
import React, { useState, useMemo } from 'react';
import { 
  Server, Globe, HardDrive, Cpu, Terminal, FileText, 
  Copy, Check, Save, Info, CheckCircle2, Link, 
  Unlink, Activity, Wifi, ShieldCheck, AlertCircle
} from 'lucide-react';

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
    sshPort: '22',
    apiUrl: 'http://localhost:8080/api/v1'
  });

  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAgentConnected, setIsAgentConnected] = useState(false);

  const readmeContent = useMemo(() => {
    return `# 🚀 AndoryaNas Management Suite - ${localServerInfo.name}

## 📋 Spécifications du Serveur
- **Hostname**: ${localServerInfo.name}
- **IP Locale**: ${localServerInfo.ip}
- **Système**: ${localServerInfo.os}
- **Capacité**: ${localServerInfo.storage}

## 🛠️ Guide de Connexion Réelle
Pour afficher vos vraies données système :
1. Installez l'agent 'andorya-agent' sur votre serveur.
2. Configurez l'URL de l'API ci-contre : ${localServerInfo.apiUrl}
3. L'interface Web récupérera alors dynamiquement les stats CPU, RAM et Disques via REST/WebSocket.
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
            <span className="font-bold text-sm">Configuration enregistrée !</span>
          </div>
        </div>
      )}

      {/* Connection Status Banner */}
      <div className={`p-6 rounded-[2rem] border flex items-center justify-between transition-all ${
        isAgentConnected 
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isAgentConnected ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
            {isAgentConnected ? <Wifi size={24} /> : <Unlink size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-lg">
              {isAgentConnected ? 'Connecté au matériel réel' : 'Mode Démonstration (Simulé)'}
            </h3>
            <p className="text-sm opacity-80">
              {isAgentConnected 
                ? 'L\'interface reçoit des données en temps réel de l\'agent Andorya.' 
                : 'L\'interface n\'est pas reliée à un backend. Les données affichées sont fictives.'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsAgentConnected(!isAgentConnected)}
          className={`px-6 py-2 rounded-xl font-bold text-xs border transition-all ${
            isAgentConnected 
              ? 'bg-emerald-500 text-white border-emerald-400' 
              : 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20'
          }`}
        >
          {isAgentConnected ? 'Passer en Démo' : 'Connecter l\'Agent'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Server Config Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl">
              <Server className="text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Identité du Serveur</h3>
              <p className="text-xs text-zinc-500 font-medium">Définissez comment le NAS se présente sur le réseau.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nom d'hôte (Hostname)</label>
              <div className="relative">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="text" 
                  value={localServerInfo.name}
                  onChange={(e) => setLocalServerInfo({...localServerInfo, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Adresse IP Statique</label>
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
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Point d'accès API (Backend)</label>
            <div className="relative">
              <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                type="text" 
                value={localServerInfo.apiUrl}
                onChange={(e) => setLocalServerInfo({...localServerInfo, apiUrl: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50 text-xs font-mono text-amber-500"
                placeholder="http://votre-ip:8080/api"
              />
            </div>
            <p className="text-[10px] text-zinc-600 mt-1 italic flex items-center gap-1">
              <AlertCircle size={10} /> C'est ici que l'interface cherchera les vraies données de vos disques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Capacité Totale</label>
              <div className="relative">
                <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="text" 
                  value={localServerInfo.storage}
                  onChange={(e) => setLocalServerInfo({...localServerInfo, storage: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Port SSH</label>
              <input 
                type="text" 
                value={localServerInfo.sshPort}
                onChange={(e) => setLocalServerInfo({...localServerInfo, sshPort: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-center"
              />
            </div>
          </div>

          <button 
            onClick={handleUpdate}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Save size={18} /> Mettre à jour la configuration
          </button>
        </div>

        {/* Installation Guide */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col h-full shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <FileText className="text-emerald-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Guide de Déploiement</h3>
                <p className="text-xs text-zinc-500 font-medium">Informations pour votre administrateur.</p>
              </div>
            </div>
            <button 
              onClick={copyReadme}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs ${
                copied ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copié' : 'Copier README'}
            </button>
          </div>

          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-xs overflow-y-auto leading-relaxed scrollbar-hide select-text">
            <pre className="whitespace-pre-wrap text-emerald-500/80">
              {readmeContent}
            </pre>
          </div>
          
          <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="text-indigo-400 mt-0.5" size={18} />
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              <strong>Sécurité :</strong> Assurez-vous que l'agent API utilise une authentification par jeton (Token) pour éviter tout accès non autorisé à votre matériel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

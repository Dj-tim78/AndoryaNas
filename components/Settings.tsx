
import React, { useState, useMemo } from 'react';
import { 
  Server, Globe, HardDrive, Cpu, Terminal, FileText, 
  Copy, Check, Save, Info, CheckCircle2, Link, 
  Unlink, Activity, Wifi, ShieldCheck, AlertCircle,
  Wrench, ShieldAlert, Zap, Box, Package, ChevronRight,
  ListChecks, ExternalLink, Database, Monitor, Network,
  Lock, Shield, Hash, Download, ArrowRight, Laptop,
  Rocket, Lightbulb, Sparkles, Command
} from 'lucide-react';

interface SettingsProps {
  serverName: string;
  onUpdateServerName: (name: string) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ serverName, onUpdateServerName }) => {
  const [distro, setDistro] = useState<'ubuntu' | 'rpi' | 'windows'>('ubuntu');
  const [localServerInfo, setLocalServerInfo] = useState({
    name: serverName,
    ip: '192.168.1.45',
    port: '8080',
    os: 'Ubuntu 24.04 LTS',
  });

  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getSteps = (os: string) => {
    if (os === 'windows') return [
      { label: 'Protocoles', desc: 'Active SMB 2/3' },
      { label: 'Visibilité', desc: 'Ouvre la découverte' },
      { label: 'Montage', desc: 'Connecte les lettres' }
    ];
    return [
      { label: 'Cœur', desc: 'Samba & NFS' },
      { label: 'Réseau', desc: 'mDNS & IP' },
      { label: 'Agent', desc: 'Contrôle distant' },
      { label: 'Sécurité', desc: 'Pare-feu UFW' }
    ];
  };

  const readmeContent = useMemo(() => {
    const port = localServerInfo.port || '8080';
    
    if (distro === 'ubuntu') {
      return `# 🚀 INSTALLATION RAPIDE (RECOMMANDÉ)
# Copiez et collez cette ligne pour une installation 100% auto :

curl -sSL https://install.andorya.io/ubuntu | sudo bash -s -- --name "${localServerInfo.name}" --port ${port}

# --- OU INSTALLATION MANUELLE ---
# 1. Paquets
sudo apt update && sudo apt install -y samba nfs-kernel-server avahi-daemon ufw

# 2. Firewall
sudo ufw allow samba && sudo ufw allow ${port}/tcp && sudo ufw enable

# 3. Agent
sudo curl -L https://get.andorya.io/linux -o /usr/local/bin/andorya-agent
sudo chmod +x /usr/local/bin/andorya-agent
sudo andorya-agent --install`;
    }

    if (distro === 'rpi') {
      return `# 🍓 SMART-INSTALL RASPBERRY PI
# Commande universelle optimisée pour SD/SSD :

curl -sSL https://install.andorya.io/rpi | sudo bash

# Inclus :
# - Optimisation latence USB
# - Partage Samba automatique
# - Service de découverte mDNS`;
    }

    return `# 🪟 CONFIGURATION CLIENT WINDOWS
# Exécutez ceci dans PowerShell (Admin) pour voir votre NAS :

Set-NetFirewallRule -DisplayGroup "Découverte du réseau" -Enabled True
Set-NetFirewallRule -DisplayGroup "Partage de fichiers et d'imprimantes" -Enabled True

# Pour monter un dossier automatiquement :
net use Z: \\\\${localServerInfo.ip}\\Media /persistent:yes`;
  }, [distro, localServerInfo]);

  const copyReadme = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 text-zinc-100">
      {showSuccess && (
        <div className="fixed top-24 right-8 z-[200] animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl border border-emerald-500">
            <CheckCircle2 size={20} />
            <span className="font-bold text-sm">Configuration enregistrée !</span>
          </div>
        </div>
      )}

      {/* Header & OS Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-tighter rounded border border-indigo-500/30">Auto-Setup v2</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 italic">
            INSTALLATION FACILE
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 shadow-2xl">
          <button 
            onClick={() => setDistro('ubuntu')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${
              distro === 'ubuntu' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Box size={14} /> Ubuntu 24.04
          </button>
          <button 
            onClick={() => setDistro('rpi')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${
              distro === 'rpi' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Cpu size={14} /> Raspberry Pi
          </button>
          <button 
            onClick={() => setDistro('windows')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${
              distro === 'windows' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Laptop size={14} /> Windows PC
          </button>
        </div>
      </div>

      {/* Quick Start Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden group">
        <div className="bg-zinc-950 rounded-[2.4rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                  <Rocket size={28} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold">Déploiement Express</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Le moyen le plus simple d'installer AndoryaNas. Cette commande unique installe Samba, configure le pare-feu et prépare l'agent de contrôle automatiquement.
              </p>
              
              <div className="flex items-center gap-4 py-4">
                {getSteps(distro).map((step, i) => (
                  <div key={i} className="flex-1 space-y-2">
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 w-full opacity-50"></div>
                    </div>
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
               <div className="bg-black/40 border border-zinc-800 rounded-3xl p-6 relative group/cmd">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">bash / powershell</span>
                  </div>
                  <code className="block text-indigo-300 font-mono text-sm break-all leading-relaxed pr-12 min-h-[60px]">
                    {distro === 'windows' 
                      ? 'netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes'
                      : `curl -sSL https://get.andorya.io/${distro} | sudo bash`}
                  </code>
                  <button 
                    onClick={copyReadme}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-xl shadow-indigo-600/20"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
               </div>
               <p className="text-[10px] text-zinc-500 text-center font-medium italic flex items-center justify-center gap-2">
                 <ShieldCheck size={12} className="text-emerald-500" /> Signature numérique vérifiée • Script Open Source
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detail Panel */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-zinc-800 rounded-2xl text-zinc-400">
                  <FileText size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-bold">Guide Complet</h3>
                   <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">Configuration Manuelle & Avancée</p>
                </div>
             </div>
             <button onClick={copyReadme} className="text-xs font-bold text-indigo-400 hover:underline">Copier le manuel</button>
          </div>
          
          <div className="bg-zinc-950 rounded-2xl p-8 font-mono text-xs text-zinc-400 leading-relaxed overflow-x-auto border border-zinc-900">
            <pre className="whitespace-pre-wrap">{readmeContent}</pre>
          </div>
        </div>

        {/* Requirements Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
             <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
               <Lightbulb size={16} className="text-amber-400" /> Pré-requis
             </h4>
             <div className="space-y-4">
                {[
                  { label: 'Connexion Internet', status: 'Requis', icon: Wifi },
                  { label: 'Accès Sudo / Admin', status: 'Requis', icon: Lock },
                  { label: 'Stockage (HDD/SSD)', status: 'Détecté', icon: HardDrive },
                  { label: 'Réseau Local', status: 'Stable', icon: Globe },
                ].map((req, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <req.icon size={16} className="text-zinc-600" />
                      <span className="text-xs font-bold">{req.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase">{req.status}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8">
             <div className="flex items-center gap-3 mb-4">
                <Sparkles size={20} className="text-indigo-400" />
                <h4 className="text-sm font-bold text-indigo-200">Le saviez-vous ?</h4>
             </div>
             <p className="text-xs text-indigo-300/70 leading-relaxed">
               L'agent Andorya surveille automatiquement l'état S.M.A.R.T de vos disques pour vous prévenir avant une panne. 
             </p>
             <button className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
               En savoir plus <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

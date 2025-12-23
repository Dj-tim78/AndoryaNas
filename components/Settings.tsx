
import React, { useState, useMemo } from 'react';
import { 
  Server, Globe, HardDrive, Cpu, Terminal, FileText, 
  Copy, Check, Save, Info, CheckCircle2, Link, 
  Unlink, Activity, Wifi, ShieldCheck, AlertCircle,
  Wrench, ShieldAlert, Zap, Box, Package, ChevronRight,
  ListChecks, ExternalLink, Database, Monitor, Network,
  Lock, Shield, Hash, Download, ArrowRight, Laptop
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

  const getDependencies = (os: string) => {
    switch(os) {
      case 'ubuntu':
      case 'rpi':
        return [
          { name: 'Samba', desc: 'Protocole de partage Windows/Mac', icon: Monitor },
          { name: 'NFS Server', desc: 'Partage haute performance Linux', icon: Network },
          { name: 'Avahi', desc: 'Découverte réseau mDNS (Bonjour)', icon: Globe },
          { name: 'Mdadm', desc: 'Gestionnaire de RAID logiciel', icon: Database },
          { name: 'UFW', desc: 'Pare-feu (Security First)', icon: ShieldCheck },
        ];
      case 'windows':
        return [
          { name: 'SMB Client', desc: 'Support des partages réseau', icon: Laptop },
          { name: 'Net Discovery', desc: 'Visibilité sur le réseau local', icon: Wifi },
          { name: 'PowerShell', desc: 'Pour les scripts de montage auto', icon: Terminal },
        ];
      default: return [];
    }
  };

  const readmeContent = useMemo(() => {
    const port = localServerInfo.port || '8080';
    
    if (distro === 'ubuntu') {
      return `# 🐧 CONFIGURATION UBUNTU 24.04 LTS

## 1. INSTALLATION DES PAQUETS CŒURS
Copiez cette commande pour installer tout le nécessaire NAS :
\`\`\`bash
sudo apt update && sudo apt install -y samba cifs-utils nfs-kernel-server mdadm smartmontools avahi-daemon ufw apparmor-utils
\`\`\`

## 2. CONFIGURATION DU PARE-FEU
\`\`\`bash
sudo ufw allow samba
sudo ufw allow nfs
sudo ufw allow ${port}/tcp
sudo ufw enable
\`\`\`

## 3. AGENT ANDORYA (CONTRÔLEUR)
\`\`\`bash
sudo curl -L https://get.andorya.io/linux-agent -o /usr/local/bin/andorya-agent
sudo chmod +x /usr/local/bin/andorya-agent
\`\`\`

---
*Note : Ubuntu 24.04 utilise une sécurité renforcée. Si Samba est bloqué, vérifiez 'aa-status' pour AppArmor.*`;
    }

    if (distro === 'rpi') {
      return `# 🍓 RASPBERRY PI OS (Toutes versions)

## 1. MISE À JOUR & DÉPENDANCES
\`\`\`bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y samba nfs-kernel-server avahi-daemon mdadm
\`\`\`

## 2. OPTIMISATION DISQUE (USB 3.0)
Pour éviter la mise en veille des disques externes :
\`\`\`bash
sudo apt install hdparm
sudo hdparm -S 0 /dev/sda
\`\`\`

## 3. DÉMARRAGE DE L'AGENT
\`\`\`bash
# Téléchargement version ARM
sudo curl -L https://get.andorya.io/arm-agent -o /usr/local/bin/andorya-agent
sudo chmod +x /usr/local/bin/andorya-agent
\`\`\`
`;
    }

    return `# 🪟 PRÉPARATION WINDOWS (Client NAS)

## 1. ACTIVER LES PROTOCOLES
1. Allez dans 'Activer ou désactiver des fonctionnalités Windows'.
2. Cochez 'Support de partage de fichiers SMB 1.0' (si vieux NAS) ou assurez-vous que 'Client SMB 2.0/3.0' est actif.

## 2. DÉCOUVERTE RÉSEAU
Ouvrez PowerShell en Admin et lancez :
\`\`\`powershell
netsh advfirewall firewall set rule group="Découverte du réseau" new enable=Yes
netsh advfirewall firewall set rule group="Partage de fichiers et d'imprimantes" new enable=Yes
\`\`\`

## 3. LECTEURS RÉSEAU
Utilisez l'onglet 'Network Letters' de cette interface pour générer vos commandes de montage automatique.
`;
  }, [distro, localServerInfo]);

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 text-zinc-100">
      {showSuccess && (
        <div className="fixed top-24 right-8 z-[200] animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl border border-emerald-500">
            <CheckCircle2 size={20} />
            <span className="font-bold text-sm">Identité mise à jour !</span>
          </div>
        </div>
      )}

      {/* Header with OS Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Wrench className="text-indigo-400" /> Centre d'Installation
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Configurez votre serveur ou préparez vos machines clientes.</p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
          <button 
            onClick={() => setDistro('ubuntu')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              distro === 'ubuntu' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Box size={14} /> Ubuntu
          </button>
          <button 
            onClick={() => setDistro('rpi')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              distro === 'rpi' ? 'bg-rose-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Cpu size={14} /> Pi OS
          </button>
          <button 
            onClick={() => setDistro('windows')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              distro === 'windows' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Laptop size={14} /> Windows
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Settings & Deps */}
        <div className="space-y-8">
          {/* NAS Identity Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <Server size={22} />
              </div>
              <h3 className="text-lg font-bold">Identité du NAS</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nom du Serveur</label>
                <input 
                  type="text" 
                  value={localServerInfo.name}
                  onChange={(e) => setLocalServerInfo({...localServerInfo, name: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Port Agent</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={12} />
                    <input 
                      type="number" 
                      value={localServerInfo.port}
                      onChange={(e) => setLocalServerInfo({...localServerInfo, port: e.target.value})}
                      className="w-full pl-8 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">IP Locale</label>
                  <input 
                    type="text" 
                    value={localServerInfo.ip}
                    onChange={(e) => setLocalServerInfo({...localServerInfo, ip: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={handleUpdate}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
            >
              <Save size={18} />
              <span>Sauvegarder</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Dependencies List */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                <ListChecks size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Dépendances</h3>
                <p className="text-[10px] text-zinc-500 font-medium">ÉLÉMENTS INDISPENSABLES</p>
              </div>
            </div>
            <div className="space-y-3">
              {getDependencies(distro).map((dep, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl group hover:border-zinc-700 transition-all cursor-help">
                  <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500 group-hover:text-emerald-400 transition-colors">
                    <dep.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-zinc-200">{dep.name}</div>
                    <div className="text-[9px] text-zinc-500 leading-tight">{dep.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Panel: Guide & Terminal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col shadow-xl min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  distro === 'ubuntu' ? 'bg-orange-500/10' : 
                  distro === 'rpi' ? 'bg-rose-500/10' : 'bg-blue-500/10'
                }`}>
                  <Terminal className={
                    distro === 'ubuntu' ? 'text-orange-500' : 
                    distro === 'rpi' ? 'text-rose-500' : 'text-blue-500'
                  } size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Guide Terminal</h3>
                  <p className="text-xs text-zinc-500">Exécutez ces commandes pour configurer votre {distro === 'windows' ? 'client' : 'serveur'}.</p>
                </div>
              </div>
              <button 
                onClick={copyReadme}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-xs ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copié !' : 'Tout Copier'}
              </button>
            </div>

            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-8 font-mono text-xs overflow-y-auto leading-relaxed scrollbar-hide select-text shadow-inner">
              <pre className="whitespace-pre-wrap text-zinc-300">
                {readmeContent}
              </pre>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-start gap-3">
                <Info className="text-indigo-400 mt-1 flex-shrink-0" size={18} />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-zinc-200">Besoin d'aide ?</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Utilisez notre <strong>Assistant IA</strong> (Gemini) pour diagnostiquer un problème de montage ou de permissions.
                  </p>
                </div>
              </div>
              <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="text-amber-500 mt-1 flex-shrink-0" size={18} />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-zinc-200">Sécurité</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Ne partagez jamais vos clés d'authentification <strong>UBUNTU_SECRET</strong> avec des tiers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

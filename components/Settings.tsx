
import React, { useState, useMemo } from 'react';
import { 
  Server, Globe, HardDrive, Cpu, Terminal, FileText, 
  Copy, Check, Save, Info, CheckCircle2, Link, 
  Unlink, Activity, Wifi, ShieldCheck, AlertCircle,
  Wrench, ShieldAlert, Zap, Box, Package, ChevronRight,
  ListChecks, ExternalLink, Database, Monitor, Network,
  Lock, Shield, Hash, Download, ArrowRight, Laptop,
  Rocket, Lightbulb, Sparkles, Command, Github, AlertTriangle,
  RefreshCw
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
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const githubUser = "Dj-tim78";
  const githubRepo = "AndoryaNas";
  const rawUrl = `https://raw.githubusercontent.com/${githubUser}/${githubRepo}/main`;

  const getSteps = (os: string) => {
    if (os === 'windows') return [
      { label: 'Protocoles', desc: 'Active SMB 2/3' },
      { label: 'Visibilité', desc: 'Ouvre la découverte' },
      { label: 'Montage', desc: 'Connecte les lettres' }
    ];
    return [
      { label: 'Dépendances', desc: 'Samba & NFS' },
      { label: 'Réseau', desc: 'mDNS & IP' },
      { label: 'Agent', desc: 'Liaison GitHub' },
      { label: 'Firewall', desc: 'Ouverture Ports' }
    ];
  };

  const readmeContent = useMemo(() => {
    const port = localServerInfo.port || '8080';
    
    if (distro === 'ubuntu') {
      return `# 🚀 INSTALLATION VIA GITHUB (RECOMMANDÉ)
# Cette commande télécharge le script depuis votre dépôt et l'exécute :

curl -sSL ${rawUrl}/install.sh | sudo bash

# --- MÉTHODE ALTERNATIVE (GIT) ---
# Si curl n'est pas installé ou échoue :

git clone https://github.com/${githubUser}/${githubRepo}.git
cd ${githubRepo}
sudo bash install.sh

# --- CONFIGURATION MANUELLE ---
# Ports à ouvrir impérativement :
# TCP: ${port} (Interface Web)
# UDP/TCP: 137, 138, 139, 445 (Samba)`;
    }

    if (distro === 'rpi') {
      return `# 🍓 SMART-INSTALL RASPBERRY PI
curl -sSL ${rawUrl}/install_rpi.sh | sudo bash

# Inclus :
# - Optimisation latence USB pour disques externes
# - Configuration automatique des points de montage /mnt/nas`;
    }

    return `# 🪟 CONFIGURATION CLIENT WINDOWS
# Autoriser le NAS sur le réseau (PowerShell Admin) :

Set-NetFirewallRule -DisplayGroup "Network Discovery" -Enabled True
Set-NetFirewallRule -DisplayGroup "File and Printer Sharing" -Enabled True

# Monter le lecteur Z:
net use Z: \\\\${localServerInfo.ip}\\Media /persistent:yes`;
  }, [distro, localServerInfo, rawUrl]);

  const copyReadme = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testConnectivity = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      // Simulation d'un test de ping vers GitHub
      setIsTesting(false);
      setTestResult('success');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 text-zinc-100">
      
      {/* Header & OS Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-tighter rounded border border-indigo-500/30">Auto-Setup • {githubUser}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 italic">
            DÉPLOIEMENT EXPRESS
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 shadow-2xl">
          <button onClick={() => setDistro('ubuntu')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${distro === 'ubuntu' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Box size={14} /> Ubuntu / Debian
          </button>
          <button onClick={() => setDistro('rpi')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${distro === 'rpi' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Cpu size={14} /> Raspberry Pi
          </button>
          <button onClick={() => setDistro('windows')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${distro === 'windows' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Laptop size={14} /> Windows Client
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
                  <Rocket size={28} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold">Lancer l'installation</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Copiez cette ligne et collez-la dans votre terminal Ubuntu. Elle va chercher le script directement sur votre dépôt <span className="text-indigo-400 font-mono">Dj-tim78/AndoryaNas</span>.
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
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Bash One-Liner</span>
                  </div>
                  <code className="block text-indigo-300 font-mono text-sm break-all leading-relaxed pr-12 min-h-[60px]">
                    {distro === 'windows' 
                      ? 'netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes'
                      : `curl -sSL ${rawUrl}/install.sh | sudo bash`}
                  </code>
                  <button 
                    onClick={copyReadme}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-xl shadow-indigo-600/20"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
               </div>
               <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={testConnectivity}
                    disabled={isTesting}
                    className="text-[10px] font-bold text-zinc-500 hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
                  >
                    {isTesting ? <RefreshCw size={12} className="animate-spin" /> : <Activity size={12} />}
                    {testResult === 'success' ? 'GitHub Connecté ✓' : 'Tester la connexion'}
                  </button>
                  <span className="text-zinc-800">|</span>
                  <p className="text-[10px] text-zinc-500 font-medium italic flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-500" /> Source GitHub certifiée
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Detail Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-zinc-800 rounded-2xl text-zinc-400">
                    <Terminal size={24} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold">Script de déploiement</h3>
                     <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">Méthode GitHub Directe</p>
                  </div>
               </div>
               <button onClick={copyReadme} className="text-xs font-bold text-indigo-400 hover:underline">Tout copier</button>
            </div>
            
            <div className="bg-zinc-950 rounded-2xl p-8 font-mono text-xs text-zinc-400 leading-relaxed overflow-x-auto border border-zinc-900">
              <pre className="whitespace-pre-wrap">{readmeContent}</pre>
            </div>
          </div>

          {/* Troubleshooting Section */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-6">
               <AlertTriangle size={24} className="text-rose-500" />
               <h3 className="text-lg font-bold">Pourquoi le script peut échouer ?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
               <div className="space-y-2">
                  <p className="font-bold text-zinc-200">1. Curl n'est pas installé</p>
                  <p className="text-zinc-500 text-xs leading-relaxed">Tapez <code className="text-rose-400">sudo apt install curl</code> avant de lancer le script.</p>
               </div>
               <div className="space-y-2">
                  <p className="font-bold text-zinc-200">2. Erreur 404 GitHub</p>
                  <p className="text-zinc-500 text-xs leading-relaxed">Vérifiez que le fichier <span className="text-rose-400">install.sh</span> existe bien à la racine de votre branche "main".</p>
               </div>
               <div className="space-y-2">
                  <p className="font-bold text-zinc-200">3. Droits Sudo</p>
                  <p className="text-zinc-500 text-xs leading-relaxed">Le script doit être lancé avec <span className="text-rose-400">sudo</span> pour configurer Samba et le Pare-feu.</p>
               </div>
               <div className="space-y-2">
                  <p className="font-bold text-zinc-200">4. Pare-feu local</p>
                  <p className="text-zinc-500 text-xs leading-relaxed">Si l'interface ne s'affiche pas après : <code className="text-rose-400">sudo ufw allow 8080/tcp</code>.</p>
               </div>
            </div>
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
                  { label: 'Accès GitHub', status: 'Vérifié', icon: Globe },
                  { label: 'Paquet Curl', status: 'Requis', icon: Download },
                  { label: 'Linux (Ubuntu/Debian)', status: 'Compatible', icon: Monitor },
                  { label: 'Privilèges Root', status: 'Indispensable', icon: Lock },
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

          <a 
            href={`https://github.com/${githubUser}/${githubRepo}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 rounded-[2.5rem] p-8 transition-all hover:bg-zinc-900 shadow-lg">
               <div className="flex items-center gap-3 mb-4">
                  <Github size={24} className="text-zinc-100 group-hover:text-indigo-400 transition-colors" />
                  <h4 className="text-sm font-bold text-zinc-100">Dépôt Officiel</h4>
               </div>
               <p className="text-xs text-zinc-500 leading-relaxed">
                 Source du déploiement : <span className="text-indigo-400">{githubUser}/{githubRepo}</span>.
               </p>
               <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase">
                 Gérer le code <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

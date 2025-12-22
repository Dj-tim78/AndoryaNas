
import React, { useState, useMemo } from 'react';
import { 
  Server, Globe, HardDrive, Cpu, Terminal, FileText, 
  Copy, Check, Save, Info, CheckCircle2, Link, 
  Unlink, Activity, Wifi, ShieldCheck, AlertCircle,
  Wrench, ShieldAlert, Zap, Box, Package, ChevronRight
} from 'lucide-react';

interface SettingsProps {
  serverName: string;
  onUpdateServerName: (name: string) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ serverName, onUpdateServerName }) => {
  const [distro, setDistro] = useState<'rpi' | 'ubuntu'>('ubuntu');
  const [localServerInfo, setLocalServerInfo] = useState({
    name: serverName,
    ip: '192.168.1.45',
    os: 'Ubuntu 24.04 LTS (Noble)',
    storage: '15 TB',
    sshPort: '22',
    apiUrl: 'http://localhost:8080/api/v1'
  });

  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAgentConnected, setIsAgentConnected] = useState(false);

  const readmeContent = useMemo(() => {
    if (distro === 'ubuntu') {
      return `# 🐧 GUIDE SPÉCIAL UBUNTU 24.04 (NOBLE NUMBAT)

## 📦 1. DÉPENDANCES UBUNTU
Ubuntu 24.04 nécessite des paquets précis pour le montage et le partage :

\`\`\`bash
sudo apt update
sudo apt install -y samba cifs-utils nfs-kernel-server smartmontools mdadm avahi-daemon apparmor-utils
\`\`\`

---

## 📥 2. INSTALLATION DE L'AGENT
Sur Ubuntu, assurez-vous de bien être en **root** pour les permissions :

\`\`\`bash
# Téléchargement ARM64 (Pi 5)
sudo curl -L https://get.andorya.io/arm64-agent -o /usr/local/bin/andorya-agent

# Permissions CRUCIALES
sudo chmod 755 /usr/local/bin/andorya-agent
sudo chown root:root /usr/local/bin/andorya-agent
\`\`\`

---

## ⚙️ 3. SERVICE SYSTEMD (UBUNTU READY)
\`\`\`bash
sudo nano /etc/systemd/system/andorya-nas.service
\`\`\`

*Copiez ce bloc (optimisé pour Ubuntu) :*
\`\`\`ini
[Unit]
Description=AndoryaNas Agent for Ubuntu 24.04
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
Group=root
ExecStart=/usr/local/bin/andorya-agent --port 8080 --auth-key UBUNTU_POWER
Restart=always
RestartSec=5
# Ubuntu 24.04 security
NoNewPrivileges=no

[Install]
WantedBy=multi-user.target
\`\`\`

\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable andorya-nas
sudo systemctl start andorya-nas
\`\`\`

---

## 🛠️ 4. RÉGLAGES PI 5 SUR UBUNTU
Le fichier de config se trouve ici :
\`\`\`bash
sudo nano /boot/firmware/config.txt
# Ajoutez pour le NVMe :
dtparam=pciex1_gen=3
\`\`\`
`;
    }

    return `# 🍓 GUIDE RASPBERRY PI OS (DEBIAN)

## 📦 1. DÉPENDANCES
\`\`\`bash
sudo apt update
sudo apt install -y samba cifs-utils nfs-kernel-server smartmontools mdadm avahi-daemon
\`\`\`

---

## 📥 2. INSTALLATION
\`\`\`bash
sudo curl -L https://get.andorya.io/arm64-agent -o /usr/local/bin/andorya-agent
sudo chmod +x /usr/local/bin/andorya-agent
\`\`\`

---

## 🔗 3. LIAISON
Adresse API : \`http://${localServerInfo.ip}:8080/api/v1\`
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 text-zinc-100">
      {showSuccess && (
        <div className="fixed top-24 right-8 z-[200] animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-900/40 border border-emerald-500">
            <CheckCircle2 size={20} />
            <span className="font-bold text-sm">Configuration enregistrée !</span>
          </div>
        </div>
      )}

      {/* OS Selector Tabs */}
      <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-3xl border border-zinc-800 w-fit mx-auto lg:mx-0">
        <button 
          onClick={() => setDistro('ubuntu')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            distro === 'ubuntu' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Box size={18} /> Ubuntu 24.04
        </button>
        <button 
          onClick={() => setDistro('rpi')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            distro === 'rpi' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Cpu size={18} /> Raspberry Pi OS
        </button>
      </div>

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
            <h3 className="font-bold text-lg flex items-center gap-2">
              {isAgentConnected ? 'Système Relié' : 'Mode Déconnecté'}
              <span className={`px-2 py-0.5 text-[10px] rounded-full border ${
                distro === 'ubuntu' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' : 'bg-rose-500/20 text-rose-400 border-rose-500/20'
              }`}>
                {distro === 'ubuntu' ? 'Ubuntu Noble' : 'Debian Bookworm'}
              </span>
            </h3>
            <p className="text-sm opacity-80">
              {isAgentConnected 
                ? 'L\'agent transmet les données matérielles en temps réel.' 
                : 'Veuillez configurer l\'agent sur votre serveur Ubuntu 24.04.'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsAgentConnected(!isAgentConnected)}
          className={`px-6 py-2 rounded-xl font-bold text-xs border transition-all ${
            isAgentConnected 
              ? 'bg-emerald-500 text-white border-emerald-400' 
              : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
          }`}
        >
          {isAgentConnected ? 'Désactiver Liaison' : 'Forcer la Connexion'}
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
              <h3 className="text-xl font-bold">Paramètres NAS</h3>
              <p className="text-xs text-zinc-500 font-medium">Configuration réseau locale.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nom du NAS</label>
              <div className="relative">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="text" 
                  value={localServerInfo.name}
                  onChange={(e) => setLocalServerInfo({...localServerInfo, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-bold text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">IP du Serveur</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="text" 
                  value={localServerInfo.ip}
                  onChange={(e) => setLocalServerInfo({...localServerInfo, ip: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Endpoint API</label>
            <div className="relative">
              <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                type="text" 
                value={localServerInfo.apiUrl}
                onChange={(e) => setLocalServerInfo({...localServerInfo, apiUrl: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50 text-xs font-mono text-amber-500"
              />
            </div>
          </div>

          <button 
            onClick={handleUpdate}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Save size={18} /> Sauvegarder
          </button>
        </div>

        {/* Installation Guide */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col h-full shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${distro === 'ubuntu' ? 'bg-orange-500/10' : 'bg-rose-500/10'}`}>
                <Package className={distro === 'ubuntu' ? 'text-orange-500' : 'text-rose-500'} size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Guide {distro === 'ubuntu' ? 'Ubuntu' : 'RPi'}</h3>
                <p className="text-xs text-zinc-500 font-medium">Instructions certifiées pour Noble Numbat.</p>
              </div>
            </div>
            <button 
              onClick={copyReadme}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs ${
                copied ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copié' : 'Copier'}
            </button>
          </div>

          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-xs overflow-y-auto leading-relaxed scrollbar-hide select-text">
            <pre className="whitespace-pre-wrap text-zinc-300">
              {readmeContent}
            </pre>
          </div>
          
          <div className="mt-6 p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="text-orange-400 mt-0.5" size={18} />
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              <strong>Attention Ubuntu :</strong> Si l'agent refuse de démarrer, vérifiez les logs avec \`journalctl -u andorya-nas\`. Il se peut qu'AppArmor bloque l'accès à certains dossiers de montage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

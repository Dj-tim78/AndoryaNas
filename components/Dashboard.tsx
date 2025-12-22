
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, ShieldCheck, Cpu, MemoryStick as Memory, Globe, 
  Thermometer, Fan, Server, HardDrive, List, Bell, CheckCircle2, 
  AlertTriangle, Info, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const storageData = [
  { name: 'Used', value: 12.4, color: '#6366f1' },
  { name: 'Free', value: 2.6, color: '#27272a' },
];

const COLORS = ['#6366f1', '#27272a'];

const Dashboard: React.FC = () => {
  // Simuler des données de réseau qui bougent
  const [throughputData, setThroughputData] = useState([
    { name: '00:00', upload: 45, download: 120 },
    { name: '04:00', upload: 30, download: 80 },
    { name: '08:00', upload: 150, download: 450 },
    { name: '12:00', upload: 220, download: 600 },
    { name: '16:00', upload: 180, download: 520 },
    { name: '20:00', upload: 110, download: 300 },
  ]);

  const [cpuTemp, setCpuTemp] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuTemp(prev => Math.max(38, Math.min(55, prev + (Math.random() * 4 - 2))));
      
      setThroughputData(prev => {
        const newData = [...prev];
        const last = newData[newData.length - 1];
        newData.shift();
        newData.push({
          name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          download: Math.floor(Math.random() * 400 + 200),
          upload: Math.floor(Math.random() * 100 + 50)
        });
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { name: 'SMB Service', status: 'Online', icon: Server, color: 'text-emerald-400' },
    { name: 'NFS Server', status: 'Online', icon: Globe, color: 'text-emerald-400' },
    { name: 'Docker Engine', status: 'Online', icon: Activity, color: 'text-cyan-400' },
    { name: 'SSH Access', status: 'Restricted', icon: ShieldCheck, color: 'text-amber-400' },
  ];

  const recentLogs = [
    { id: 1, type: 'info', msg: 'Sauvegarde "TimeMachine" terminée', time: 'Il y a 12 min' },
    { id: 2, type: 'warning', msg: 'Température disque 4 élevée (48°C)', time: 'Il y a 45 min' },
    { id: 3, type: 'success', msg: 'Utilisateur "media_box" connecté via SMB', time: 'Il y a 1h' },
    { id: 4, type: 'info', msg: 'Mise à jour système AndoryaOS v2.4.1 prête', time: 'Il y a 3h' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'État Système', value: 'Sain', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: 'Tous les volumes sont OK' },
          { label: 'CPU Load', value: '14.2%', icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10', sub: `${cpuTemp.toFixed(1)}°C • 8 Cores` },
          { label: 'Température', value: `${cpuTemp.toFixed(0)}°C`, icon: Thermometer, color: 'text-rose-400', bg: 'bg-rose-500/10', sub: 'Fan: 1240 RPM' },
          { label: 'Débit Réseau', value: '620 Mb/s', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10', sub: 'Bonding: Active/Backup' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={22} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</span>
                <div className="text-xl font-bold tracking-tight text-zinc-100">{stat.value}</div>
              </div>
            </div>
            <div className="text-[10px] font-medium text-zinc-500 flex items-center gap-1.5 border-t border-zinc-800/50 pt-3 mt-1">
              <Info size={12} className="opacity-50" />
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Network Monitor */}
        <div className="lg:col-span-2 p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <Globe className="text-indigo-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Flux Réseau</h3>
                <p className="text-xs text-zinc-500">Activité temps réel des interfaces eth0 & eth1</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Entrant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sortant</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 10}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 10}} 
                  unit=" Mb"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '16px', border: '1px solid #3f3f46' }}
                  itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="download" stroke="#6366f1" fillOpacity={1} fill="url(#colorDownload)" strokeWidth={3} />
                <Area type="monotone" dataKey="upload" stroke="#a855f7" fillOpacity={1} fill="url(#colorUpload)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Health */}
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex flex-col items-center shadow-xl">
          <div className="w-full flex justify-between items-start mb-6">
            <h3 className="text-lg font-bold">Santé Stockage</h3>
            <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20">
              Optimal
            </div>
          </div>
          <div className="h-[240px] w-full relative group">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black tracking-tighter">82%</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Utilisé</span>
            </div>
          </div>
          <div className="w-full mt-6 space-y-4">
            <div className="flex justify-between items-center group/item cursor-default">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-semibold text-zinc-400">Main Pool (RAID 5)</span>
              </div>
              <span className="font-mono text-xs font-bold text-zinc-100">12.4 TB</span>
            </div>
            <div className="flex justify-between items-center group/item cursor-default">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                <span className="text-xs font-semibold text-zinc-400">Espace Libre</span>
              </div>
              <span className="font-mono text-xs font-bold text-zinc-100">2.6 TB</span>
            </div>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-4 border border-zinc-700/50">
              Analyser les volumes
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services Status */}
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-xl">
           <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Server className="text-emerald-400" size={20} />
            </div>
            <h3 className="text-lg font-bold">Services & Protocoles</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {services.map((service, i) => (
              <div key={i} className="p-5 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl flex items-center justify-between group hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <service.icon size={18} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  <span className="text-xs font-bold text-zinc-300">{service.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${service.color === 'text-emerald-400' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]'}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${service.color}`}>{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Bell className="text-amber-400" size={20} />
            </div>
            <h3 className="text-lg font-bold">Dernières Activités</h3>
          </div>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-2xl flex items-center justify-between group hover:bg-zinc-950/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    log.type === 'info' ? 'bg-indigo-500/10 text-indigo-400' :
                    log.type === 'warning' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {log.type === 'info' ? <Info size={14} /> :
                     log.type === 'warning' ? <AlertTriangle size={14} /> :
                     <CheckCircle2 size={14} />}
                  </div>
                  <span className="text-xs font-medium text-zinc-300">{log.msg}</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase italic">{log.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-300 transition-colors">
            Voir tous les journaux →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

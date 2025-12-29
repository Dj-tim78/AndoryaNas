
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, ShieldCheck, Cpu, MemoryStick as Memory, Globe, 
  Thermometer, Server, Bell, CheckCircle2, 
  AlertTriangle, Info
} from 'lucide-react';
import { api } from '../api';

interface DashboardProps {
  isLive?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLive }) => {
  const [stats, setStats] = useState({
    cpuLoad: '0.0',
    cpuTemp: 0,
    memUsed: '0.0',
    memTotal: '0.0',
    netDownload: 0,
    netUpload: 0,
    // FIX: Add uptime to stats state to store value received from server
    uptime: 0
  });

  const [throughputHistory, setThroughputHistory] = useState<any[]>([]);

  // Récupération des données réelles
  useEffect(() => {
    const fetchData = async () => {
      if (!isLive) return;
      try {
        const realStats = await api.getSystemStats();
        setStats(realStats);
        
        setThroughputHistory(prev => {
          const next = [...prev, {
            name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            download: Math.floor(realStats.netDownload / 1024 / 1024), // Convert to MB
            upload: Math.floor(realStats.netUpload / 1024 / 1024)
          }];
          return next.slice(-10); // Garder les 10 derniers points
        });
      } catch (e) {
        console.error("Erreur API Stats");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'État Système', value: isLive ? 'Connecté' : 'Simulation', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: 'Services opérationnels' },
          { label: 'Charge CPU', value: `${stats.cpuLoad}%`, icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10', sub: `${stats.cpuTemp}°C` },
          { label: 'Mémoire RAM', value: `${stats.memUsed} GB`, icon: Memory, color: 'text-rose-400', bg: 'bg-rose-500/10', sub: `Total: ${stats.memTotal} GB` },
          { label: 'Réseau (D/L)', value: `${(stats.netDownload / 1024 / 1024).toFixed(1)} Mb/s`, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10', sub: 'Interface eth0' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all shadow-lg">
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
        <div className="lg:col-span-2 p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Moniteur Réseau Réel</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Download</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputHistory}>
                <defs>
                  <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} unit=" Mb" />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="download" stroke="#6366f1" fillOpacity={1} fill="url(#colorDownload)" strokeWidth={3} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-xl flex flex-col justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
               <Server className="text-indigo-400" size={32} />
            </div>
            <h4 className="text-xl font-bold">Identité Serveur</h4>
            <p className="text-sm text-zinc-500">IP: {window.location.hostname}</p>
            <div className="pt-4 space-y-2">
               <div className="flex justify-between text-xs px-4">
                  <span className="text-zinc-500">OS</span>
                  <span className="text-zinc-200">Linux x64</span>
               </div>
               <div className="flex justify-between text-xs px-4">
                  <span className="text-zinc-500">Uptime</span>
                  {/* FIX: Replaced process.uptime() (unavailable in browser) with stats.uptime from server */}
                  <span className="text-zinc-200">{Math.floor(stats.uptime / 3600)}h</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

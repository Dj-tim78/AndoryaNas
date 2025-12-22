
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Activity, ShieldCheck, Cpu, MemoryStick as Memory, Globe } from 'lucide-react';

const throughputData = [
  { name: '00:00', upload: 45, download: 120 },
  { name: '04:00', upload: 30, download: 80 },
  { name: '08:00', upload: 150, download: 450 },
  { name: '12:00', upload: 220, download: 600 },
  { name: '16:00', upload: 180, download: 520 },
  { name: '20:00', upload: 110, download: 300 },
];

const storageData = [
  { name: 'Used', value: 12.4, color: '#6366f1' },
  { name: 'Free', value: 2.6, color: '#27272a' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Uptime', value: '42d 15h 3m', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'CPU Usage', value: '18.4%', icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'RAM Usage', value: '4.2 GB', icon: Memory, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'IP Address', value: '192.168.1.45', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors group">
            <div className="flex items-center gap-4 mb-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <span className="text-sm font-medium text-zinc-500">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-100">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Network Throughput */}
        <div className="lg:col-span-2 p-8 bg-zinc-900 border border-zinc-800 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity className="text-indigo-400" size={20} />
              <h3 className="text-lg font-semibold">Network Activity</h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs text-zinc-400 font-medium">Download</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-zinc-400 font-medium">Upload</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 12}} 
                  unit=" Mbps"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="download" stroke="#6366f1" fillOpacity={1} fill="url(#colorDownload)" strokeWidth={2} />
                <Area type="monotone" dataKey="upload" stroke="#a855f7" fillOpacity={1} fill="url(#colorUpload)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Distribution */}
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-8 self-start">Storage Distribution</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">12.4 TB</span>
              <span className="text-xs text-zinc-500 font-medium">Used Space</span>
            </div>
          </div>
          <div className="w-full mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">System Files</span>
              <span className="font-mono text-zinc-200">1.2 TB</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Media Library</span>
              <span className="font-mono text-zinc-200">8.4 TB</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Backups</span>
              <span className="font-mono text-zinc-200">2.8 TB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

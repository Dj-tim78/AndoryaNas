
import React, { useState, useMemo } from 'react';
import { StorageDisk } from '../types';
import { HardDrive, AlertCircle, Thermometer, Activity, Zap, ArrowDownCircle, ArrowUpCircle, XCircle, Info, Filter } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// Utility to generate high-resolution mock data (1000 points)
const generateHighResData = () => {
  const points = [];
  const now = new Date();
  for (let i = 1000; i > 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
    const baseRead = 400 + Math.sin(i / 10) * 100 + Math.random() * 50;
    const baseWrite = 300 + Math.cos(i / 15) * 80 + Math.random() * 40;
    points.push({
      timestamp: time.getTime(),
      timeStr: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: Math.floor(baseRead),
      write: Math.floor(baseWrite),
      iops: Math.floor(baseRead * 5 + Math.random() * 500)
    });
  }
  return points;
};

const GLOBAL_HISTORY = generateHighResData();

const mockDisks: StorageDisk[] = [
  { id: '1', model: 'WD Gold 4TB Enterprise', serialNumber: 'WD-WXV1E80H7KJ4', firmwareVersion: '81.00A81', type: 'HDD', capacity: '4.0 TB', health: 'Healthy', temperature: 34 },
  { id: '2', model: 'Samsung 980 Pro 2TB', serialNumber: 'S69ENF0R812345X', firmwareVersion: '5B2QGXA7', type: 'NVMe', capacity: '2.0 TB', health: 'Healthy', temperature: 42 },
  { id: '3', model: 'WD Gold 4TB Enterprise', serialNumber: 'WD-WXV1E80H7KJ9', firmwareVersion: '81.00A81', type: 'HDD', capacity: '4.0 TB', health: 'Healthy', temperature: 36 },
  { id: '4', model: 'Seagate IronWolf 5TB', serialNumber: 'ST5000VN001-XYZ', firmwareVersion: 'SC60', type: 'HDD', capacity: '5.0 TB', health: 'Warning', temperature: 48 },
];

/**
 * Downsamples data to a fixed number of points to ensure UI performance
 * @param data The raw data array
 * @param limit The maximum number of points to return
 */
function downsample<T>(data: T[], limit: number): T[] {
  if (data.length <= limit) return data;
  const result: T[] = [];
  const step = data.length / limit;
  for (let i = 0; i < limit; i++) {
    result.push(data[Math.floor(i * step)]);
  }
  return result;
}

const StorageManager: React.FC = () => {
  const [timeRange, setTimeRange] = useState<number>(60); // minutes
  const problematicDisks = mockDisks.filter(d => d.health !== 'Healthy');

  // Performance optimization: Filter and Downsample only when timeRange changes
  const chartData = useMemo(() => {
    const cutoff = Date.now() - timeRange * 60000;
    const filtered = GLOBAL_HISTORY.filter(p => p.timestamp >= cutoff);
    // Render at most 60 points to keep Recharts snappy
    return downsample(filtered, 60);
  }, [timeRange]);

  const ranges = [
    { label: '1H', value: 60 },
    { label: '6H', value: 360 },
    { label: '24H', value: 1440 },
    { label: '7D', value: 10080 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Dynamic Health Alerts */}
      {problematicDisks.length > 0 && (
        <div className="space-y-4">
          {problematicDisks.map((disk) => (
            <div 
              key={`alert-${disk.id}`} 
              className={`border rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg animate-in slide-in-from-top-2 duration-300 ${
                disk.health === 'Critical' 
                  ? 'bg-rose-500/5 border-rose-500/20 shadow-rose-950/10' 
                  : 'bg-amber-500/5 border-amber-500/20 shadow-amber-950/10'
              }`}
            >
              <div className={`p-5 rounded-3xl border ${
                disk.health === 'Critical' 
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
              }`}>
                {disk.health === 'Critical' ? <XCircle size={32} /> : <AlertCircle size={32} />}
              </div>
              <div className="flex-1 space-y-1 text-center md:text-left">
                <h4 className={`text-xl font-bold ${
                  disk.health === 'Critical' ? 'text-rose-500' : 'text-amber-500'
                }`}>
                  {disk.health} Hardware Alert
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
                  Disk <span className={`font-mono font-bold ${
                    disk.health === 'Critical' ? 'text-rose-500/80' : 'text-amber-500/80'
                  }`}>#{disk.id} ({disk.model})</span> is reporting {disk.health === 'Critical' ? 'severe failures' : 'sector reallocation errors'}. 
                  The system {disk.health === 'Critical' ? 'cannot maintain redundancy' : 'performance has been throttled'}. 
                  Immediate action is required to prevent data loss.
                </p>
              </div>
              <button className={`px-8 py-4 font-bold rounded-2xl transition-all shadow-xl whitespace-nowrap active:scale-95 ${
                disk.health === 'Critical'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/30'
              }`}>
                {disk.health === 'Critical' ? 'Replace Disk Now' : 'Initiate Maintenance'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Physical Disks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockDisks.map((disk) => (
          <div key={disk.id} className="relative p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all flex flex-col h-full group">
            {/* Detailed Hardware Tooltip Overlay */}
            <div className="absolute inset-x-2 bottom-full mb-2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
                  <Info size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Hardware Details</span>
                </div>
                <div className="space-y-2 font-mono text-[10px]">
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500">Full Model:</span>
                    <span className="text-zinc-200 text-right">{disk.model}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500">Serial No:</span>
                    <span className="text-zinc-200 text-right">{disk.serialNumber}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500">Firmware:</span>
                    <span className="text-zinc-200 text-right">{disk.firmwareVersion}</span>
                  </div>
                </div>
              </div>
              {/* Tooltip Arrow */}
              <div className="w-3 h-3 bg-zinc-950 border-r border-b border-zinc-700 rotate-45 mx-auto -mt-1.5 shadow-xl"></div>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl transition-colors ${
                disk.health === 'Healthy' 
                  ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20' 
                  : disk.health === 'Critical'
                    ? 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20'
                    : 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20'
              }`}>
                <HardDrive size={24} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-950 rounded-full border border-zinc-800">
                <Thermometer size={14} className={disk.temperature > 45 ? 'text-amber-500' : 'text-zinc-500'} />
                {disk.temperature}°C
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-zinc-100 line-clamp-1">{disk.model}</h4>
              <p className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-widest">{disk.type} • {disk.capacity}</p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">SMART Health</span>
                <span className={`font-bold ${
                  disk.health === 'Healthy' ? 'text-emerald-500' : 
                  disk.health === 'Critical' ? 'text-rose-500' : 'text-amber-500'
                }`}>
                  {disk.health}
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    disk.health === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                    disk.health === 'Critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                    'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                  }`}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optimized Performance Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <Activity className="text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-100">Volume Performance</h3>
              <p className="text-sm text-zinc-500 font-medium flex items-center gap-2">
                Real-time throughput 
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] border border-emerald-500/20 font-bold uppercase">
                  Optimized ({chartData.length} pts)
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
              {ranges.map(r => (
                <button
                  key={r.label}
                  onClick={() => setTimeRange(r.value)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === r.value 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <ArrowDownCircle size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Read</p>
                  <p className="text-lg font-mono font-bold text-zinc-100">
                    {Math.floor(chartData.reduce((acc, v) => acc + v.read, 0) / (chartData.length || 1))} MB/s
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <ArrowUpCircle size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Write</p>
                  <p className="text-lg font-mono font-bold text-zinc-100">
                    {Math.floor(chartData.reduce((acc, v) => acc + v.write, 0) / (chartData.length || 1))} MB/s
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Historical Throughput Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                Throughput History <span className="text-[10px] text-zinc-600 font-mono">(MB/s)</span>
              </h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-zinc-500 font-medium">Read</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-xs text-zinc-500 font-medium">Write</span>
                </div>
              </div>
            </div>
            <div className="h-[280px] w-full bg-zinc-950/50 p-4 rounded-3xl border border-zinc-800/50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="readGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="writeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.5} />
                  <XAxis 
                    dataKey="timeStr" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#71717a', fontSize: 10, fontWeight: 500}} 
                    dy={10}
                    interval="preserveStartEnd"
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#71717a', fontSize: 10, fontWeight: 500}} 
                    unit="MB"
                  />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                    cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="read" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#readGradient)" 
                    strokeWidth={2.5}
                    animationDuration={600}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="write" 
                    stroke="#6366f1" 
                    fillOpacity={1} 
                    fill="url(#writeGradient)" 
                    strokeWidth={2.5}
                    animationDuration={600}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical IOPS Chart */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Aggregated IOPS</h4>
            <div className="h-[280px] w-full bg-zinc-950/50 p-4 rounded-3xl border border-zinc-800/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.5} />
                  <XAxis 
                    dataKey="timeStr" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#71717a', fontSize: 10, fontWeight: 500}} 
                    dy={10}
                    interval="preserveStartEnd"
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#71717a', fontSize: 10, fontWeight: 500}} 
                  />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="iops" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                    animationDuration={600}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Latency Stats Overlay */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-zinc-800">
          <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Peak Read Latency</p>
              <p className="text-2xl font-mono font-bold text-emerald-400">0.84 <span className="text-xs font-sans text-zinc-500">ms</span></p>
            </div>
            <div className="w-32 h-10 opacity-50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.slice(-10)}>
                  <Area type="monotone" dataKey="read" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Peak Write Latency</p>
              <p className="text-2xl font-mono font-bold text-indigo-400">3.42 <span className="text-xs font-sans text-zinc-500">ms</span></p>
            </div>
            <div className="w-32 h-10 opacity-50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.slice(-10)}>
                  <Area type="monotone" dataKey="write" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageManager;

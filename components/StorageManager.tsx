
import React, { useState, useMemo, useEffect } from 'react';
import { StorageDisk, StoragePool } from '../types';
import { 
  HardDrive, AlertCircle, Thermometer, Activity, Zap, 
  ArrowDownCircle, ArrowUpCircle, XCircle, Info, 
  PlusCircle, Layers, X, Shield, Cpu, Database, 
  RefreshCw, Box, Workflow, CheckCircle2, Trash2, ShieldAlert, Edit3, LogOut, TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// Logic to generate high resolution data for simulation
const generateHighResData = (count: number) => {
  const points = [];
  const now = new Date();
  for (let i = count; i > 0; i--) {
    const time = new Date(now.getTime() - i * 5000); // 5s intervals
    const baseRead = 200 + Math.sin(i / 8) * 80 + Math.random() * 40;
    const baseWrite = 120 + Math.cos(i / 12) * 60 + Math.random() * 30;
    points.push({
      timestamp: time.getTime(),
      timeStr: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      read: Math.floor(baseRead),
      write: Math.floor(baseWrite),
      iops: Math.floor(baseRead * 2.5 + Math.random() * 200)
    });
  }
  return points;
};

/**
 * Optimizes chart performance by downsampling data points.
 * Simple Nth-point sampling to keep Recharts performant with large buffers.
 */
const downsampleData = (data: any[], targetPoints: number) => {
  if (data.length <= targetPoints) return data;
  const factor = Math.floor(data.length / targetPoints);
  return data.filter((_, i) => i % factor === 0);
};

const INITIAL_DISKS: StorageDisk[] = [
  { id: '1', model: 'WD Gold 4TB Enterprise', serialNumber: 'WD-WXV1E80H7KJ4', firmwareVersion: '81.00A81', type: 'HDD', capacity: '4.0 TB', health: 'Healthy', temperature: 34, status: 'In Pool', slot: 1 },
  { id: '2', model: 'Samsung 980 Pro 2TB', serialNumber: 'S69ENF0R812345X', firmwareVersion: '5B2QGXA7', type: 'NVMe', capacity: '2.0 TB', health: 'Healthy', temperature: 42, status: 'In Pool', slot: 2 },
  { id: '3', model: 'WD Gold 4TB Enterprise', serialNumber: 'WD-WXV1E80H7KJ9', firmwareVersion: '81.00A81', type: 'HDD', capacity: '4.0 TB', health: 'Healthy', temperature: 36, status: 'In Pool', slot: 3 },
  { id: '4', model: 'Seagate IronWolf 5TB', serialNumber: 'ST5000VN001-XYZ', firmwareVersion: 'SC60', type: 'HDD', capacity: '5.0 TB', health: 'Warning', temperature: 48, status: 'In Pool', slot: 4 },
  { id: '5', model: 'Crucial MX500 1TB', serialNumber: 'CT1000MX500SSD1', firmwareVersion: 'M3CR046', type: 'SSD', capacity: '1.0 TB', health: 'Uninitialized', temperature: 28, status: 'Available', slot: 5 },
  { id: '6', model: 'WD Red Pro 10TB', serialNumber: 'WD-WCC7K1NXZY82', firmwareVersion: '83.00A83', type: 'HDD', capacity: '10.0 TB', health: 'Uninitialized', temperature: 30, status: 'Available', slot: 6 },
];

const INITIAL_POOLS: StoragePool[] = [
  { id: 'pool-1', name: 'Main_Archive', raidLevel: 'RAID 5', fileSystem: 'Btrfs', status: 'Healthy', capacityUsed: 8400, capacityTotal: 12000, diskIds: ['1', '3', '4'] },
  { id: 'pool-2', name: 'Cache_NVMe', raidLevel: 'Basic', fileSystem: 'EXT4', status: 'Healthy', capacityUsed: 1200, capacityTotal: 2000, diskIds: ['2'] },
];

// Added StorageManagerProps to accept isLive from App.tsx
interface StorageManagerProps {
  isLive?: boolean;
}

const StorageManager: React.FC<StorageManagerProps> = ({ isLive }) => {
  const [disks, setDisks] = useState<StorageDisk[]>(INITIAL_DISKS);
  const [pools, setPools] = useState<StoragePool[]>(INITIAL_POOLS);
  const [isScanning, setIsScanning] = useState(false);
  const [configuringDisk, setConfiguringDisk] = useState<StorageDisk | null>(null);
  const [poolToRename, setPoolToRename] = useState<StoragePool | null>(null);
  const [poolToDelete, setPoolToDelete] = useState<StoragePool | null>(null);
  const [diskToRemove, setDiskToRemove] = useState<StorageDisk | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [initStep, setInitStep] = useState<'config' | 'progress' | 'success'>('config');
  const [progress, setProgress] = useState(0);

  // Performance Monitoring State
  const [perfData, setPerfData] = useState<any[]>(() => generateHighResData(200));

  // Simulation of live performance data
  useEffect(() => {
    const interval = setInterval(() => {
      setPerfData(prev => {
        const next = [...prev];
        if (next.length > 500) next.shift(); // Hard limit buffer
        const last = next[next.length - 1];
        const time = new Date(last.timestamp + 5000);
        const baseRead = 200 + Math.sin(next.length / 8) * 80 + Math.random() * 40;
        const baseWrite = 120 + Math.cos(next.length / 12) * 60 + Math.random() * 30;
        next.push({
          timestamp: time.getTime(),
          timeStr: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          read: Math.floor(baseRead),
          write: Math.floor(baseWrite),
          iops: Math.floor(baseRead * 2.5 + Math.random() * 200)
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Optimized data for charts (downsampled to 60 points for 5 mins view or similar)
  const displayData = useMemo(() => downsampleData(perfData, 60), [perfData]);

  // Form State
  const [configName, setConfigName] = useState('');
  const [raidLevel, setRaidLevel] = useState('RAID 0');
  const [fileSystem, setFileSystem] = useState<'Btrfs' | 'EXT4'>('Btrfs');
  const [formatMode, setFormatMode] = useState<'Quick' | 'Full'>('Quick');

  const availableDisks = disks.filter(d => d.status === 'Available');

  const handleScanHardware = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const startInitialization = (disk: StorageDisk) => {
    setConfiguringDisk(disk);
    setConfigName(`Volume_${disk.slot}`);
    setInitStep('config');
    setFormatMode('Quick');
  };

  const runInitialization = () => {
    setInitStep('progress');
    setProgress(0);
    const stepIncrement = formatMode === 'Quick' ? 5 : 1.5;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => completeInitialization(), 800);
          return 100;
        }
        return prev + stepIncrement;
      });
    }, 100);
  };

  const completeInitialization = () => {
    if (!configuringDisk) return;
    
    const newPool: StoragePool = {
      id: `pool-${Date.now()}`,
      name: configName,
      raidLevel: raidLevel,
      fileSystem: fileSystem,
      status: 'Healthy',
      capacityUsed: 0,
      capacityTotal: parseFloat(configuringDisk.capacity) * 1024,
      diskIds: [configuringDisk.id]
    };

    setPools([...pools, newPool]);
    setDisks(disks.map(d => d.id === configuringDisk.id ? { ...d, status: 'In Pool', health: 'Healthy' } : d));
    setInitStep('success');
  };

  const confirmRename = (newName: string) => {
    if (!poolToRename) return;
    setPools(pools.map(p => p.id === poolToRename.id ? { ...p, name: newName } : p));
    setPoolToRename(null);
  };

  const confirmDeletePool = () => {
    if (!poolToDelete) return;
    setIsDeleting(true);
    setTimeout(() => {
      const poolDiskIds = poolToDelete.diskIds;
      setDisks(prev => prev.map(disk => 
        poolDiskIds.includes(disk.id) ? { ...disk, status: 'Available', health: 'Uninitialized' } : disk
      ));
      setPools(prev => prev.filter(p => p.id !== poolToDelete.id));
      setIsDeleting(false);
      setPoolToDelete(null);
      setDeleteConfirmText('');
    }, 2000);
  };

  const handleEjectDisk = () => {
    if (!diskToRemove) return;
    setDisks(prev => prev.filter(d => d.id !== diskToRemove.id));
    setDiskToRemove(null);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Storage Pools */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Box className="text-indigo-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Storage Pools</h3>
              <p className="text-xs text-zinc-500">Gérez vos volumes logiques et RAID.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pools.map(pool => (
            <div key={pool.id} className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-zinc-700 transition-all group shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Database size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-100">{pool.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded border border-zinc-700">{pool.raidLevel}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">{pool.fileSystem}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setPoolToRename(pool)}
                      className="p-2 rounded-xl bg-zinc-950 text-zinc-500 hover:text-indigo-400 border border-zinc-800 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => setPoolToDelete(pool)}
                      className="p-2 rounded-xl bg-zinc-950 text-zinc-500 hover:text-rose-500 border border-zinc-800 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pool.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {pool.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Capacité Utilisée</span>
                  <span className="text-zinc-200 font-mono">{(pool.capacityUsed/1024).toFixed(1)} TB / {(pool.capacityTotal/1024).toFixed(1)} TB</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(5, (pool.capacityUsed / pool.capacityTotal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Volume Performance - NEW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <TrendingUp className="text-cyan-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Performance du Volume</h3>
              <p className="text-xs text-zinc-500">Lecture/Écriture et IOPS en temps réel (sous-échantillonné pour performance).</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lecture (MB/s)</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Écriture (MB/s)</span>
                 </div>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWrite" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="timeStr" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} unit="MB/s" />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ padding: '2px 0' }}
                  />
                  <Area type="monotone" dataKey="read" stroke="#6366f1" fillOpacity={1} fill="url(#colorRead)" strokeWidth={2} isAnimationActive={false} />
                  <Area type="monotone" dataKey="write" stroke="#f43f5e" fillOpacity={1} fill="url(#colorWrite)" strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Opérations IOPS</h4>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                 <Activity size={10} className="text-cyan-400" />
                 <span className="text-[10px] font-bold text-cyan-400">Live</span>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="timeStr" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '10px' }}
                  />
                  <Line type="step" dataKey="iops" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Unconfigured Hardware */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Zap className="text-amber-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Matériel non configuré</h3>
              <p className="text-xs text-zinc-500">Disques détectés prêts pour le provisionnement.</p>
            </div>
          </div>
          <button 
            onClick={handleScanHardware}
            disabled={isScanning}
            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-amber-500/20 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Balayage...' : 'Scanner'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableDisks.map(disk => (
            <div key={disk.id} className="p-6 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-[2.5rem] hover:border-amber-500/40 transition-all flex flex-col group animate-in zoom-in-95">
               <div className="flex items-start justify-between mb-4">
                  <div className="p-4 bg-zinc-900 rounded-2xl text-zinc-400 border border-zinc-800 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors">
                    <HardDrive size={28} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Slot #{disk.slot}</span>
                    <button 
                      onClick={() => setDiskToRemove(disk)}
                      className="p-2 rounded-lg bg-zinc-900 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Retirer le disque du système"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-zinc-100 truncate mb-1">{disk.model}</h4>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">{disk.type} • {disk.capacity}</p>
                <div className="mt-6 flex gap-2">
                  <button 
                    onClick={() => startInitialization(disk)}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={14} /> Provisionner
                  </button>
                  <button className="p-3 bg-zinc-900 text-zinc-500 rounded-2xl hover:text-white transition-colors">
                    <Info size={16} />
                  </button>
                </div>
            </div>
          ))}
          {availableDisks.length === 0 && (
            <div className="col-span-full py-12 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center text-zinc-600">
               <Database size={32} className="mb-2 opacity-20" />
               <p className="text-sm font-medium italic">Aucun matériel disponible à configurer.</p>
            </div>
          )}
        </div>
      </section>

      {/* Hardware Removal Modal */}
      {diskToRemove && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-zinc-900 border border-rose-500/30 rounded-[2.5rem] p-10 shadow-3xl text-center space-y-6">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
              <LogOut size={32} className="text-rose-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Retrait Matériel</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Voulez-vous retirer le disque <span className="text-zinc-100 font-bold">{diskToRemove.model}</span> ? 
                Le système ne pourra plus y accéder tant qu'un nouveau scan ne sera pas effectué.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setDiskToRemove(null)} 
                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-2xl font-bold transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={handleEjectDisk}
                className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-600/20"
              >
                Confirmer Retrait
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {poolToRename && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-3xl">
            <h3 className="text-xl font-bold mb-6">Renommer le Pool</h3>
            <input 
              autoFocus
              type="text" 
              defaultValue={poolToRename.name}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmRename(e.currentTarget.value);
                if (e.key === 'Escape') setPoolToRename(null);
              }}
              className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-bold mb-6"
            />
            <div className="flex gap-3">
              <button onClick={() => setPoolToRename(null)} className="flex-1 py-3 bg-zinc-800 text-zinc-400 rounded-xl font-bold">Annuler</button>
              <button 
                onClick={(e) => confirmRename((e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement).value)} 
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Modals */}
      {configuringDisk && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-3xl">
            {initStep === 'config' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Initialisation</h3>
                <input 
                  type="text" 
                  value={configName} 
                  onChange={e => setConfigName(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Nom du volume"
                />
                <div className="grid grid-cols-2 gap-4">
                  {['Quick', 'Full'].map(m => (
                    <button 
                      key={m} 
                      onClick={() => setFormatMode(m as any)}
                      className={`py-4 rounded-2xl font-bold border-2 ${formatMode === m ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-800 text-zinc-500'}`}
                    >
                      {m} Format
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setConfiguringDisk(null)} className="flex-1 py-4 bg-zinc-800 rounded-2xl">Annuler</button>
                  <button onClick={runInitialization} className="flex-1 py-4 bg-amber-500 text-zinc-950 rounded-2xl font-bold">Lancer</button>
                </div>
              </div>
            )}
            {initStep === 'progress' && (
              <div className="text-center py-10 space-y-6">
                <div className="text-4xl font-black text-amber-500">{Math.floor(progress)}%</div>
                <p className="text-zinc-500">Formatage {formatMode} en cours...</p>
              </div>
            )}
            {initStep === 'success' && (
              <div className="text-center py-10 space-y-6">
                <CheckCircle2 size={64} className="text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-bold">Volume prêt !</h3>
                <button onClick={() => setConfiguringDisk(null)} className="w-full py-4 bg-emerald-600 rounded-2xl font-bold">Terminer</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {poolToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-zinc-950/95 backdrop-blur-2xl">
          <div className="w-full max-w-lg bg-zinc-900 border-2 border-rose-500/30 rounded-[3rem] p-10">
            <h3 className="text-2xl font-black text-rose-500 mb-4 uppercase italic">Attention !</h3>
            <p className="text-zinc-400 mb-8">La suppression de <span className="text-white font-bold">{poolToDelete.name}</span> entraînera la perte définitive des données.</p>
            <input 
              type="text" 
              placeholder="Tapez le nom pour confirmer"
              className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl mb-8 outline-none text-rose-500 font-bold text-center"
              onChange={e => setDeleteConfirmText(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setPoolToDelete(null)} className="flex-1 py-4 bg-zinc-800 rounded-2xl font-bold">Annuler</button>
              <button 
                onClick={confirmDeletePool} 
                disabled={deleteConfirmText !== poolToDelete.name}
                className={`flex-1 py-4 rounded-2xl font-bold ${deleteConfirmText === poolToDelete.name ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-600'}`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageManager;

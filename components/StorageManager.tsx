
import React, { useState, useMemo, useEffect } from 'react';
import { StorageDisk, StoragePool } from '../types';
import { api } from '../api';
import { 
  HardDrive, Zap, Info, PlusCircle, Database, 
  RefreshCw, Box, CheckCircle2, Trash2, Edit3, LogOut, TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const generateHighResData = (count: number) => {
  const points = [];
  const now = new Date();
  for (let i = count; i > 0; i--) {
    const time = new Date(now.getTime() - i * 5000);
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

const downsampleData = (data: any[], targetPoints: number) => {
  if (data.length <= targetPoints) return data;
  const factor = Math.floor(data.length / targetPoints);
  return data.filter((_, i) => i % factor === 0);
};

interface StorageManagerProps {
  isLive?: boolean;
}

const StorageManager: React.FC<StorageManagerProps> = ({ isLive }) => {
  const [disks, setDisks] = useState<StorageDisk[]>([]);
  const [pools, setPools] = useState<StoragePool[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [configuringDisk, setConfiguringDisk] = useState<StorageDisk | null>(null);
  const [poolToRename, setPoolToRename] = useState<StoragePool | null>(null);
  const [poolToDelete, setPoolToDelete] = useState<StoragePool | null>(null);
  const [diskToRemove, setDiskToRemove] = useState<StorageDisk | null>(null);
  const [initStep, setInitStep] = useState<'config' | 'progress' | 'success'>('config');
  const [progress, setProgress] = useState(0);

  // Performance simulation data
  const [perfData, setPerfData] = useState<any[]>(() => generateHighResData(100));

  // Charger les vrais disques si Live
  useEffect(() => {
    const loadDisks = async () => {
      if (isLive) {
        try {
          const realDisks = await api.getDisks();
          setDisks(realDisks);
          
          // Simulation d'un pool basé sur les disques utilisés
          const usedDisks = realDisks.filter(d => d.status === 'In Pool');
          if (usedDisks.length > 0) {
            setPools([{
              id: 'pool-root',
              name: 'System_Storage',
              raidLevel: 'Basic',
              fileSystem: 'Btrfs',
              status: 'Healthy',
              capacityUsed: 450,
              capacityTotal: usedDisks.reduce((acc, d) => acc + parseFloat(d.capacity) * 1024, 0),
              diskIds: usedDisks.map(d => d.id)
            }]);
          }
        } catch (e) {
          console.error("Erreur chargement disques réels");
        }
      }
    };
    loadDisks();
  }, [isLive]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPerfData(prev => {
        const next = [...prev];
        if (next.length > 200) next.shift();
        const last = next[next.length - 1];
        const time = new Date(last.timestamp + 5000);
        const baseRead = 10 + Math.random() * 50;
        const baseWrite = 5 + Math.random() * 30;
        next.push({
          timestamp: time.getTime(),
          timeStr: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          read: Math.floor(baseRead),
          write: Math.floor(baseWrite),
          iops: Math.floor(baseRead * 2)
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayData = useMemo(() => downsampleData(perfData, 40), [perfData]);
  const availableDisks = disks.filter(d => d.status === 'Available');

  const handleScanHardware = async () => {
    setIsScanning(true);
    try {
      const realDisks = await api.getDisks();
      setDisks(realDisks);
    } catch (e) {}
    setTimeout(() => setIsScanning(false), 1500);
  };

  const startInitialization = (disk: StorageDisk) => {
    setConfiguringDisk(disk);
    setInitStep('config');
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Box className="text-indigo-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Volumes de Stockage</h3>
              <p className="text-xs text-zinc-500">Groupes de disques physiques montés sur le système.</p>
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
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`}>
                  {pool.status}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Capacité Totale Détectée</span>
                  <span className="text-zinc-200 font-mono">{(pool.capacityTotal/1024).toFixed(1)} TB</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-indigo-500 w-[15%] rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
          {pools.length === 0 && (
            <div className="col-span-full py-12 bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center text-zinc-600">
               <Database size={32} className="mb-2 opacity-20" />
               <p className="text-sm font-medium italic">Aucun pool détecté sur ce serveur.</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Zap className="text-amber-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Disques Physiques</h3>
              <p className="text-xs text-zinc-500">Liste réelle des disques détectés via systeminformation.</p>
            </div>
          </div>
          <button onClick={handleScanHardware} disabled={isScanning} className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-amber-500/20">
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Balayage...' : 'Scanner les disques'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disks.map(disk => (
            <div key={disk.id} className={`p-6 bg-zinc-950 border-2 rounded-[2.5rem] transition-all flex flex-col group animate-in zoom-in-95 ${disk.status === 'In Pool' ? 'border-zinc-800' : 'border-dashed border-zinc-800 hover:border-amber-500/40'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-2xl border border-zinc-800 ${disk.status === 'In Pool' ? 'bg-indigo-500/5 text-indigo-400' : 'bg-zinc-900 text-zinc-400 group-hover:bg-amber-500/10 group-hover:text-amber-400'}`}>
                    <HardDrive size={28} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Dev: /dev/sd{String.fromCharCode(96 + disk.slot)}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 ${disk.status === 'In Pool' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {disk.status === 'In Pool' ? 'UTILISÉ' : 'DISPONIBLE'}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-zinc-100 truncate mb-1">{disk.model}</h4>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">{disk.type} • {disk.capacity}</p>
                <p className="text-[9px] text-zinc-600 mt-1 truncate">S/N: {disk.serialNumber}</p>
                
                {disk.status === 'Available' && (
                  <div className="mt-6">
                    <button onClick={() => startInitialization(disk)} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                      <PlusCircle size={14} /> Provisionner
                    </button>
                  </div>
                )}
            </div>
          ))}
          {disks.length === 0 && !isScanning && (
             <div className="col-span-full py-12 text-center text-zinc-600 italic">
               Aucun disque détecté. Vérifiez que le backend tourne sur le port 3000.
             </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StorageManager;

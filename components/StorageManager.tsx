
import React, { useState, useMemo, useEffect } from 'react';
import { StorageDisk, StoragePool } from '../types';
import { api } from '../api';
import { 
  HardDrive, Zap, Info, PlusCircle, Database, 
  RefreshCw, Box, CheckCircle2, Trash2, Edit3, LogOut, TrendingUp,
  AlertTriangle
} from 'lucide-react';

const INITIAL_DEMO_DISKS: StorageDisk[] = [
  { id: 'demo-1', model: 'WD Gold 4TB Enterprise', serialNumber: 'WD-WXV1E80H7KJ4', firmwareVersion: '81.00A81', type: 'HDD', capacity: '4.0 TB', health: 'Healthy', temperature: 34, status: 'In Pool', slot: 1 },
  { id: 'demo-2', model: 'Samsung 980 Pro 2TB', serialNumber: 'S69ENF0R812345X', firmwareVersion: '5B2QGXA7', type: 'NVMe', capacity: '2.0 TB', health: 'Healthy', temperature: 42, status: 'In Pool', slot: 2 },
  { id: 'demo-3', model: 'Crucial MX500 1TB', serialNumber: 'CT1000MX500SSD1', firmwareVersion: 'M3CR046', type: 'SSD', capacity: '1.0 TB', health: 'Uninitialized', temperature: 28, status: 'Available', slot: 3 },
];

interface StorageManagerProps {
  isLive?: boolean;
}

const StorageManager: React.FC<StorageManagerProps> = ({ isLive }) => {
  // On initialise avec les disques de démo pour ne pas avoir un écran vide
  const [disks, setDisks] = useState<StorageDisk[]>(INITIAL_DEMO_DISKS);
  const [pools, setPools] = useState<StoragePool[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRealData = async () => {
    if (!isLive) return;
    setIsScanning(true);
    setError(null);
    try {
      const realDisks = await api.getDisks();
      if (realDisks && realDisks.length > 0) {
        setDisks(realDisks);
        
        const usedDisks = realDisks.filter(d => d.status === 'In Pool');
        if (usedDisks.length > 0) {
          setPools([{
            id: 'pool-root',
            name: 'System_Storage',
            raidLevel: 'Basic',
            fileSystem: 'Btrfs',
            status: 'Healthy',
            capacityUsed: 450,
            capacityTotal: usedDisks.reduce((acc, d) => acc + (parseFloat(d.capacity) || 0) * 1024, 0),
            diskIds: usedDisks.map(d => d.id)
          }]);
        }
      } else {
        setError("Le serveur est en ligne mais ne renvoie aucun disque. Essayez de lancer le backend avec 'sudo'.");
      }
    } catch (e) {
      setError("Impossible de joindre le backend sur le port 3000.");
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isLive) {
      fetchRealData();
    }
  }, [isLive]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Alerte si le serveur n'est pas détecté */}
      {!isLive && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 text-amber-500 text-sm">
          <AlertTriangle size={20} />
          <div>
            <p className="font-bold uppercase tracking-tight">Mode Simulation Actif</p>
            <p className="opacity-80">Les disques ci-dessous sont des exemples. Lancez <code>node server.js</code> sur votre serveur pour voir vos vrais disques.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500 text-sm">
          <Info size={20} />
          <p>{error}</p>
        </div>
      )}

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
                  <span className="text-zinc-500 font-medium">Capacité Totale</span>
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
               <p className="text-sm font-medium italic">Aucun pool actif détecté.</p>
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
              <p className="text-xs text-zinc-500">{isLive ? 'Vraie liste matérielle du serveur.' : 'Données d\'exemple (Mode Simulation).'}</p>
            </div>
          </div>
          <button 
            onClick={fetchRealData} 
            disabled={isScanning || !isLive} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              isLive ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20' : 'bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed'
            }`}
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Synchronisation...' : 'Scanner les disques'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disks.map(disk => (
            <div key={disk.id} className={`p-6 bg-zinc-950 border-2 rounded-[2.5rem] transition-all flex flex-col group animate-in zoom-in-95 ${disk.status === 'In Pool' ? 'border-zinc-800 shadow-lg' : 'border-dashed border-zinc-800 hover:border-amber-500/40'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-2xl border border-zinc-800 ${disk.status === 'In Pool' ? 'bg-indigo-500/5 text-indigo-400' : 'bg-zinc-900 text-zinc-400 group-hover:bg-amber-500/10 group-hover:text-amber-400'}`}>
                    <HardDrive size={28} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Slot #{disk.slot}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 ${disk.status === 'In Pool' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {disk.status === 'In Pool' ? 'UTILISÉ' : 'LIBRE'}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-zinc-100 truncate mb-1">{disk.model}</h4>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">{disk.type} • {disk.capacity}</p>
                <p className="text-[9px] text-zinc-600 mt-2 truncate opacity-50">S/N: {disk.serialNumber}</p>
                
                {disk.status === 'Available' && (
                  <div className="mt-6">
                    <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                      <PlusCircle size={14} /> Provisionner
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StorageManager;

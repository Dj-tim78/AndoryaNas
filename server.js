
const express = require('express');
const si = require('systeminformation');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 1. Santé et Uptime
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// 2. Statistiques dynamiques (CPU, RAM, Temp, Réseau)
app.get('/api/stats', async (req, res) => {
  try {
    const [cpu, temp, mem, network, time] = await Promise.all([
      si.currentLoad(),
      si.cpuTemperature(),
      si.mem(),
      si.networkStats(),
      si.time()
    ]);
    
    res.json({
      cpuLoad: cpu.currentLoad.toFixed(1),
      cpuTemp: temp.main || 40, // Fallback si pas de capteur
      memUsed: (mem.active / 1024 / 1024 / 1024).toFixed(1),
      memTotal: (mem.total / 1024 / 1024 / 1024).toFixed(1),
      netDownload: network[0]?.rx_sec || 0,
      netUpload: network[0]?.tx_sec || 0,
      uptime: time.uptime
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Liste des disques PHYSIQUES réels
app.get('/api/disks', async (req, res) => {
  try {
    const [disks, blockDevices] = await Promise.all([
      si.diskLayout(),
      si.blockDevices()
    ]);
    
    const formattedDisks = disks.map((d, i) => {
      // On cherche si le disque a des partitions montées pour définir son statut
      const deviceName = d.device.split('/').pop();
      const hasPartitions = blockDevices.some(bd => bd.name.includes(deviceName) && bd.mount);

      return {
        id: d.serialNum || `disk-${i}`,
        model: d.name || d.device,
        serialNumber: d.serialNum || 'N/A',
        firmwareVersion: 'N/A',
        type: d.type === 'NVMe' ? 'NVMe' : (d.size < 600000000000 ? 'SSD' : 'HDD'),
        capacity: (d.size / 1024 / 1024 / 1024 / 1024).toFixed(1) + ' TB',
        health: 'Healthy',
        temperature: 32 + i, // Simulation température par défaut
        status: hasPartitions ? 'In Pool' : 'Available',
        slot: i + 1
      };
    });
    res.json(formattedDisks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Partages SMB réels (Analyse du fichier de config Samba)
app.get('/api/shares', (req, res) => {
  exec('grep "\\[" /etc/samba/smb.conf | grep -v "global"', (err, stdout) => {
    if (err) return res.json([]);
    const shares = stdout.split('\n')
      .filter(s => s.trim())
      .map((s, i) => {
        const name = s.replace(/\[|\]/g, '');
        return {
          id: `share-${i}`,
          name: name,
          path: `/srv/samba/${name}`, // Chemin présumé
          protocol: 'SMB',
          status: 'Active',
          isPrivate: false,
          authorizedUsers: [],
          sizeUsed: 0,
          sizeTotal: 1000
        };
      });
    res.json(shares);
  });
});

// 5. Liste des utilisateurs système (Unix)
app.get('/api/users', async (req, res) => {
  exec('cut -d: -f1 /etc/passwd | tail -n 10', (err, stdout) => {
    const userList = stdout.split('\n')
      .filter(u => u.trim() && !['root', 'daemon', 'bin'].includes(u))
      .map((u, i) => ({
        id: `u-${i}`,
        username: u,
        role: 'User',
        status: 'Active',
        lastLogin: 'System User',
        groups: ['users']
      }));
    res.json(userList);
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur de données AndoryaNas actif sur le port ${port}`);
});

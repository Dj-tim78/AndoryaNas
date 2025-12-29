
const express = require('express');
const si = require('systeminformation');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Log toutes les requêtes pour le debug
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 1. Santé et Uptime
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// 2. Statistiques dynamiques
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
      cpuTemp: temp.main || 40,
      memUsed: (mem.active / 1024 / 1024 / 1024).toFixed(1),
      memTotal: (mem.total / 1024 / 1024 / 1024).toFixed(1),
      netDownload: network[0]?.rx_sec || 0,
      netUpload: network[0]?.tx_sec || 0,
      uptime: time.uptime
    });
  } catch (err) {
    console.error("Erreur Stats:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Liste des disques PHYSIQUES réels
app.get('/api/disks', async (req, res) => {
  try {
    console.log("Scanning physical disks...");
    const [disks, blockDevices] = await Promise.all([
      si.diskLayout(),
      si.blockDevices()
    ]);
    
    console.log(`Found ${disks.length} physical disks.`);

    const formattedDisks = disks.map((d, i) => {
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
        temperature: 32 + i,
        status: hasPartitions ? 'In Pool' : 'Available',
        slot: i + 1
      };
    });
    res.json(formattedDisks);
  } catch (err) {
    console.error("Erreur Disques:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Partages SMB
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
          path: `/srv/samba/${name}`,
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

// 5. Utilisateurs
app.get('/api/users', async (req, res) => {
  exec('cut -d: -f1 /etc/passwd | tail -n 20', (err, stdout) => {
    if (err) return res.json([]);
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
  console.log('-----------------------------------------');
  console.log(`🚀 ANDORYA NAS BACKEND STARTING`);
  console.log(`📡 URL: http://0.0.0.0:${port}`);
  console.log(`💡 Mode: Physical Data Reader`);
  console.log('-----------------------------------------');
});

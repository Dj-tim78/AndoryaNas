# 🛠️ GUIDE D'INSTALLATION - ANDORYANAS v2.4

Ce guide explique comment déployer l'interface de gestion et l'agent de contrôle sur votre infrastructure.

## 🏗️ 1. ARCHITECTURE
L'AndoryaNas se compose de deux parties :
- **L'Interface (Frontend)** : Ce site web (HTML/React).
- **L'Agent (Backend)** : Un service qui tourne sur votre serveur pour lire les disques et exécuter les commandes.

---

## 🐧 2. INSTALLATION SUR LINUX (Ubuntu, Debian, Proxmox)

### A. Pré-requis
- Accès SSH avec droits 'sudo'.
- Ports 80 (Web) et 8080 (API) ouverts.

### B. Installation de l'Agent de contrôle
```bash
# 1. Télécharger l'agent
curl -L https://get.andorya.io/linux-agent -o /usr/local/bin/andorya-agent
chmod +x /usr/local/bin/andorya-agent

# 2. Créer le service de démarrage automatique
sudo nano /etc/systemd/system/andorya-nas.service
```

*Copiez ceci dans le fichier service :*
```ini
[Unit]
Description=AndoryaNas Control Agent
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/andorya-agent --port 8080 --auth-key VORTRE_CLE_SECRET
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# 3. Lancer le service
sudo systemctl enable andorya-nas
sudo systemctl start andorya-nas
```

---

## 🪟 3. INSTALLATION SUR WINDOWS (Server ou 10/11)

### A. Configuration de l'Agent
1. Ouvrez **PowerShell** en mode Administrateur.
2. Téléchargez et installez l'agent :
   ```powershell
   Invoke-WebRequest -Uri "https://get.andorya.io/win-agent.exe" -OutFile "C:Andoryaagent.exe"
   ```

### B. Création du Service Windows
```powershell
New-Service -Name "AndoryaAgent" -BinaryPathName "C:Andoryaagent.exe --port 8080" -DisplayName "AndoryaNas Agent" -StartupType Automatic
Start-Service "AndoryaAgent"
```

### C. Ouverture du Pare-feu
```powershell
New-NetFirewallRule -DisplayName "NAS API" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

---

## 🐳 4. DÉPLOIEMENT DOCKER (Méthode Recommandée)
Si vous utilisez Docker, une seule commande suffit pour l'agent :

```bash
docker run -d \
  --name andorya-agent \
  --restart always \
  --privileged \
  -p 8080:8080 \
  -v /dev:/dev \
  -v /proc:/host/proc:ro \
  andorya/nas-agent:latest
```

---

## 🔗 5. LIAISON FINALE
Une fois l'agent installé :
1. Allez dans l'onglet **Server Config** de cette interface.
2. Dans **Point d'accès API**, entrez : `http://192.168.1.45:8080/api/v1`
3. Cliquez sur **Enregistrer**. L'interface affichera alors vos vraies données !

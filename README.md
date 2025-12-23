# 🐧 CONFIGURATION UBUNTU 24.04 LTS

## 1. INSTALLATION DES PAQUETS CŒURS
Copiez cette commande pour installer tout le nécessaire NAS :
```bash
sudo apt update && sudo apt install -y samba cifs-utils nfs-kernel-server mdadm smartmontools avahi-daemon ufw apparmor-utils
```

## 2. CONFIGURATION DU PARE-FEU
```bash
sudo ufw allow samba
sudo ufw allow nfs
sudo ufw allow 8080/tcp
sudo ufw enable
```

## 3. AGENT ANDORYA (CONTRÔLEUR)
```bash
sudo curl -L https://get.andorya.io/linux-agent -o /usr/local/bin/andorya-agent
sudo chmod +x /usr/local/bin/andorya-agent
```

---
*Note : Ubuntu 24.04 utilise une sécurité renforcée. Si Samba est bloqué, vérifiez 'aa-status' pour AppArmor.*

# 🪟 PRÉPARATION WINDOWS (Client NAS)

## 1. ACTIVER LES PROTOCOLES
1. Allez dans 'Activer ou désactiver des fonctionnalités Windows'.
2. Cochez 'Support de partage de fichiers SMB 1.0' (si vieux NAS) ou assurez-vous que 'Client SMB 2.0/3.0' est actif.

## 2. DÉCOUVERTE RÉSEAU
Ouvrez PowerShell en Admin et lancez :
```powershell
netsh advfirewall firewall set rule group="Découverte du réseau" new enable=Yes
netsh advfirewall firewall set rule group="Partage de fichiers et d'imprimantes" new enable=Yes
```

## 3. LECTEURS RÉSEAU
Utilisez l'onglet 'Network Letters' de cette interface pour générer vos commandes de montage automatique.

# 🍓 RASPBERRY PI OS (Toutes versions)

## 1. MISE À JOUR & DÉPENDANCES
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y samba nfs-kernel-server avahi-daemon mdadm
```

## 2. OPTIMISATION DISQUE (USB 3.0)
Pour éviter la mise en veille des disques externes :
```bash
sudo apt install hdparm
sudo hdparm -S 0 /dev/sda
```

## 3. DÉMARRAGE DE L'AGENT
```bash
# Téléchargement version ARM
sudo curl -L https://get.andorya.io/arm-agent -o /usr/local/bin/andorya-agent
sudo chmod +x /usr/local/bin/andorya-agent
```

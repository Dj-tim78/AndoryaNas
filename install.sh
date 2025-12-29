#!/usr/bin/env bash

set -e

echo "🔄 Mise à jour du système et installation des dépendances..."

# Mise à jour et installation des paquets requis
sudo apt update && sudo apt upgrade -y
sudo apt install -y samba cifs-utils nfs-kernel-server mdadm smartmontools avahi-daemon ufw apparmor-utils

echo "🛡️ Configuration du pare-feu UFW..."
sudo ufw allow Samba
sudo ufw allow NFS
sudo ufw allow 8090/tcp
sudo ufw enable

echo "📥 Téléchargement de l'agent Andorya..."
sudo curl -L https://get.andorya.io/linux-agent -o /usr/local/bin/andorya-agent

echo "🔐 Ajout des permissions d'exécution..."
sudo chmod +x /usr/local/bin/andorya-agent

echo "✅ Installation terminée !"

echo -e "\n📌 Prochaines étapes :"
echo " - Vérifiez la configuration de Samba (/etc/samba/smb.conf)"
echo " - Ajoutez vos partages NAS."
echo " - Démarrez les services :"
echo "     sudo systemctl restart smbd nmbd nfs-server"

sudo npm install -g npm@11.7.0

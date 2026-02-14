#!/bin/bash
# Deploy statische Quartz-Seite auf eigenen Server
# Usage: ./deploy-site.sh

set -e

# Konfiguration
SERVER_USER="max"
SERVER_IP="91.99.236.172"
SSH_KEY="$HOME/ssh_keys"
REMOTE_PATH="/var/www/notes.maximleopold.com"

# Farben
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Deploying notes.coxilab.de to server...${NC}"

# 1. Prüfe ob public/ existiert
if [ ! -d "public" ]; then
    echo -e "${YELLOW}Building site first...${NC}"
    npm run build
fi

# 2. Prüfe SSH Key
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}❌ SSH Key not found at $SSH_KEY${NC}"
    exit 1
fi

# 3. Sync mit rsync
echo -e "${YELLOW}[1/2]${NC} Syncing files to server..."
rsync -avz --delete \
    -e "ssh -i $SSH_KEY" \
    public/ \
    "$SERVER_USER@$SERVER_IP:$REMOTE_PATH/"

# 4. Setze Berechtigungen
echo -e "${YELLOW}[2/2]${NC} Setting permissions..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "chmod -R 755 $REMOTE_PATH"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "Site available at: ${GREEN}https://notes.coxilab.de${NC}"

#!/bin/bash
# RAG Server Deployment Script für eigenen Server
# Führe dieses Script auf deinem Server aus

set -e  # Exit on error

echo "🚀 RAG Server Deployment gestartet..."

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Konfiguration
REPO_URL="https://github.com/maximleopold/notes.maximleopold.com.git"
APP_DIR="/home/max/rag-server"
DOMAIN="${RAG_DOMAIN:-server.maximleopold.com}"  # Domain from env or default
EMAIL="${RAG_EMAIL:-max@maximleopold.com}"  # Email for Let's Encrypt

echo -e "${YELLOW}Domain:${NC} $DOMAIN"
echo -e "${YELLOW}App Directory:${NC} $APP_DIR"

# 1. Prüfe Node.js Version
echo -e "\n${GREEN}[1/10]${NC} Prüfe Node.js Installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js nicht gefunden!${NC}"
    echo "Installiere Node.js v22+ mit:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js Version:${NC} $NODE_VERSION"

# 2. Prüfe npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm nicht gefunden!${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm Version:${NC} $NPM_VERSION"

# 3. Clone Repository (oder update)
echo -e "\n${GREEN}[2/10]${NC} Clone/Update Repository..."
if [ -d "$APP_DIR" ]; then
    echo "Repository existiert bereits, führe git pull aus..."
    cd "$APP_DIR"
    git pull
else
    echo "Clone Repository..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# 4. Installiere Dependencies
echo -e "\n${GREEN}[3/10]${NC} Installiere Dependencies..."
npm install

# 5. Erstelle .env Datei
echo -e "\n${GREEN}[4/10]${NC} Konfiguriere Environment Variables..."
if [ ! -f .env ]; then
    echo "Erstelle .env Datei..."
    echo "Bitte gib deine API Keys ein:"

    read -p "ANTHROPIC_API_KEY: " ANTHROPIC_KEY
    read -p "OPENAI_API_KEY: " OPENAI_KEY

    cat > .env << EOF
# API Keys
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
OPENAI_API_KEY=$OPENAI_KEY

# Environment
NODE_ENV=production
PORT=3030
EOF

    echo -e "${GREEN}✅ .env Datei erstellt${NC}"
else
    echo -e "${YELLOW}⚠️  .env Datei existiert bereits, überspringe...${NC}"
fi

# 6. Indexiere Vector Store
echo -e "\n${GREEN}[5/10]${NC} Indexiere Vector Store..."
if [ ! -f "rag/vector-store.json" ]; then
    echo "Starte Indexierung (kann 3-5 Minuten dauern)..."
    npm run rag:index
    echo -e "${GREEN}✅ Vector Store erstellt${NC}"
else
    echo -e "${YELLOW}⚠️  Vector Store existiert bereits${NC}"
    read -p "Möchtest du neu indexieren? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run rag:index
    fi
fi

# 7. Installiere PM2 (global)
echo -e "\n${GREEN}[6/10]${NC} Installiere PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo -e "${GREEN}✅ PM2 installiert${NC}"
else
    echo -e "${GREEN}✅ PM2 bereits installiert${NC}"
fi

# 8. Erstelle PM2 Ecosystem File
echo -e "\n${GREEN}[7/10]${NC} Konfiguriere PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'rag-server',
    script: 'npm',
    args: 'run rag:server',
    cwd: '/home/max/rag-server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3030
    },
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
EOF

# 9. Starte/Restarte RAG Server mit PM2
echo -e "\n${GREEN}[8/10]${NC} Starte RAG Server mit PM2..."
mkdir -p logs
pm2 delete rag-server 2>/dev/null || true  # Lösche alte Instanz falls vorhanden
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u max --hp /home/max
echo -e "${GREEN}✅ RAG Server läuft!${NC}"

# 10. Installiere und konfiguriere nginx
echo -e "\n${GREEN}[9/10]${NC} Konfiguriere nginx..."
if ! command -v nginx &> /dev/null; then
    echo "Installiere nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Erstelle nginx Config
sudo tee /etc/nginx/sites-available/rag-server > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Aktiviere Site
sudo ln -sf /etc/nginx/sites-available/rag-server /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
echo -e "${GREEN}✅ nginx konfiguriert${NC}"

# 11. SSL mit Let's Encrypt
echo -e "\n${GREEN}[10/10]${NC} SSL-Zertifikat mit Let's Encrypt..."
if ! command -v certbot &> /dev/null; then
    echo "Installiere certbot..."
    sudo apt-get install -y certbot python3-certbot-nginx
fi

echo -e "${YELLOW}Führe certbot aus...${NC}"
echo "WICHTIG: Stelle sicher, dass DNS für $DOMAIN auf 91.99.236.172 zeigt!"
read -p "DNS konfiguriert? Weiter mit SSL Setup? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL || {
        echo -e "${YELLOW}⚠️  SSL Setup fehlgeschlagen. Führe später aus:${NC}"
        echo "  sudo certbot --nginx -d $DOMAIN --email $EMAIL"
    }
else
    echo -e "${YELLOW}⚠️  SSL Setup übersprungen. Führe später aus:${NC}"
    echo "  sudo certbot --nginx -d $DOMAIN --email $EMAIL"
fi

# Fertig!
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment abgeschlossen!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "RAG Server läuft auf:"
echo "  - http://$DOMAIN (HTTP)"
echo "  - https://$DOMAIN (HTTPS, falls SSL konfiguriert)"
echo ""
echo "Nützliche Befehle:"
echo "  pm2 status          # Status anzeigen"
echo "  pm2 logs rag-server # Logs anzeigen"
echo "  pm2 restart rag-server # Server neustarten"
echo "  pm2 stop rag-server # Server stoppen"
echo ""
echo "Teste den Server:"
echo "  curl https://$DOMAIN/health"
echo ""
echo -e "${YELLOW}⚠️  Vergiss nicht, die Frontend-URL zu aktualisieren!${NC}"
echo "  Datei: quartz/components/scripts/ragChatbot.inline.ts"
echo "  Zeile 4: Ändere zu 'https://$DOMAIN'"

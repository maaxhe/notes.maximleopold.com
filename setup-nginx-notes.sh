#!/bin/bash
# Setup nginx für notes.coxilab.de (Haupt-Domain) auf dem Server
# notes.maximleopold.com wird auf notes.coxilab.de weitergeleitet
#
# Führe dieses Script EINMAL auf dem Server aus:
#   scp -i ~/ssh_keys setup-nginx-notes.sh max@91.99.236.172:/home/max/
#   ssh -i ~/ssh_keys max@91.99.236.172 "chmod +x setup-nginx-notes.sh && ./setup-nginx-notes.sh"

set -e

DOMAIN="notes.coxilab.de"
DOMAIN_OLD="notes.maximleopold.com"
WEB_ROOT="/var/www/notes.maximleopold.com"
EMAIL="max@maximleopold.com"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Setting up nginx for $DOMAIN...${NC}"

# 1. Erstelle Web-Verzeichnis
echo -e "${YELLOW}[1/4]${NC} Creating web directory..."
sudo mkdir -p "$WEB_ROOT"
sudo chown -R max:max "$WEB_ROOT"

# 2. Erstelle nginx Config
echo -e "${YELLOW}[2/4]${NC} Creating nginx config..."
sudo tee /etc/nginx/sites-available/notes > /dev/null << 'EOF'
# Haupt-Domain: notes.coxilab.de
server {
    listen 80;
    listen [::]:80;
    server_name notes.coxilab.de;

    root /var/www/notes.maximleopold.com;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml image/svg+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main location
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Error pages
    error_page 404 /404.html;
}

# Redirect: notes.maximleopold.com -> notes.coxilab.de
server {
    listen 80;
    listen [::]:80;
    server_name notes.maximleopold.com;

    return 301 https://notes.coxilab.de$request_uri;
}
EOF

# 3. Aktiviere Site
echo -e "${YELLOW}[3/4]${NC} Enabling site..."
sudo ln -sf /etc/nginx/sites-available/notes /etc/nginx/sites-enabled/notes
# Entferne alte Config falls vorhanden
sudo rm -f /etc/nginx/sites-enabled/notes.maximleopold.com
sudo nginx -t
sudo systemctl reload nginx

# 4. SSL mit Let's Encrypt
echo -e "${YELLOW}[4/4]${NC} Setting up SSL..."
if ! command -v certbot &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
fi

echo -e "${YELLOW}Running certbot...${NC}"
sudo certbot --nginx -d "$DOMAIN" -d "$DOMAIN_OLD" --non-interactive --agree-tos --email "$EMAIL" || {
    echo -e "${YELLOW}SSL setup failed. Run manually: sudo certbot --nginx -d $DOMAIN -d $DOMAIN_OLD${NC}"
}

echo -e "${GREEN}✅ nginx setup complete!${NC}"
echo "Site available at https://$DOMAIN"
echo "Redirect: https://$DOMAIN_OLD -> https://$DOMAIN"

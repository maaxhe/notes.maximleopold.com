# RAG Server Deployment auf eigenem Server

## Übersicht

Dieser Guide erklärt, wie du den RAG-Chatbot auf deinem eigenen Server deployest.

**Server:** 91.99.236.172
**Domain:** server.maximleopold.com
**User:** max

## Schritt 1: DNS-Konfiguration

Bevor du deployest, musst du einen DNS A-Record erstellen:

1. Gehe zu deinem DNS-Provider (z.B. Cloudflare, Namecheap, etc.)
2. Erstelle einen neuen **A-Record**:
   - **Name/Host:** `server` (oder `server.maximleopold.com`)
   - **Type:** A
   - **Value/Points to:** `91.99.236.172`
   - **TTL:** 300 (oder Auto)

3. Warte 5-10 Minuten, bis DNS propagiert ist

**DNS-Check:**
```bash
# Von deinem lokalen Rechner:
dig server.maximleopold.com +short
# Sollte ausgeben: 91.99.236.172

# Alternative:
nslookup server.maximleopold.com
```

## Schritt 2: Deployment-Script auf Server kopieren

```bash
# Von deinem lokalen Rechner:
scp -i ~/ssh_keys deploy-to-server.sh max@91.99.236.172:/home/max/
```

## Schritt 3: Deployment ausführen

```bash
# SSH zum Server:
ssh -i ~/ssh_keys max@91.99.236.172

# Deployment-Script ausführbar machen:
chmod +x /home/max/deploy-to-server.sh

# Setze Domain als Environment Variable:
export RAG_DOMAIN=server.maximleopold.com

# Führe Deployment aus:
./deploy-to-server.sh
```

**Das Script macht folgendes:**
1. ✅ Prüft Node.js Installation
2. ✅ Clont Repository nach `/home/max/rag-server`
3. ✅ Installiert Dependencies (`npm install`)
4. ✅ Erstellt `.env` Datei (fragt nach API Keys)
5. ✅ Indexiert Vector Store (`npm run rag:index`) - dauert 3-5 Min
6. ✅ Installiert PM2
7. ✅ Startet RAG Server mit PM2
8. ✅ Konfiguriert nginx als Reverse Proxy
9. ✅ Installiert SSL-Zertifikat mit Let's Encrypt

## Schritt 4: API Keys eingeben

Während des Deployments wirst du nach den API Keys gefragt:

```
ANTHROPIC_API_KEY: sk-ant-api...
OPENAI_API_KEY: sk-...
```

**Wo finde ich die Keys?**
- In deiner lokalen `.env` Datei
- Oder in den Dashboards:
  - Anthropic: https://console.anthropic.com
  - OpenAI: https://platform.openai.com/api-keys

## Schritt 5: Server testen

Nach dem Deployment:

```bash
# Health Check:
curl https://server.maximleopold.com/health

# Erwartete Ausgabe:
# {"status":"ok","vectorStore":"loaded","chunks":6409}

# PM2 Status:
pm2 status

# Logs anschauen:
pm2 logs rag-server
```

## Schritt 6: Frontend aktualisieren

Die Datei `quartz/components/scripts/ragChatbot.inline.ts` wurde bereits aktualisiert.

Pushe die Änderungen:

```bash
# Vom lokalen Rechner:
git add .
git commit -m "Configure RAG server for production (server.maximleopold.com)"
git push
```

## Schritt 7: Testen

1. Öffne: https://notes.maximleopold.com
2. Klicke auf den Chatbot-Button
3. Stelle eine Frage!

## PM2 Commands

```bash
# Status anzeigen:
pm2 status

# Logs anzeigen:
pm2 logs rag-server

# Server neustarten:
pm2 restart rag-server

# Server stoppen:
pm2 stop rag-server

# Server starten:
pm2 start rag-server

# Auto-start bei Server-Reboot:
pm2 startup
pm2 save
```

## nginx Commands

```bash
# nginx Status:
sudo systemctl status nginx

# nginx neustarten:
sudo systemctl restart nginx

# nginx Config testen:
sudo nginx -t

# nginx Logs:
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## SSL-Zertifikat erneuern

Certbot erneuert das Zertifikat automatisch. Falls nötig:

```bash
# Manuell erneuern:
sudo certbot renew

# Test-Run:
sudo certbot renew --dry-run
```

## Troubleshooting

### Server läuft nicht

```bash
# Prüfe PM2 Status:
pm2 status

# Prüfe Logs:
pm2 logs rag-server --lines 100

# Starte neu:
pm2 restart rag-server
```

### Vector Store nicht geladen

```bash
cd /home/max/rag-server
npm run rag:index
pm2 restart rag-server
```

### nginx Error

```bash
# Prüfe Config:
sudo nginx -t

# Prüfe Logs:
sudo tail -f /var/log/nginx/error.log

# Starte neu:
sudo systemctl restart nginx
```

### Port 3030 bereits in Verwendung

```bash
# Finde Prozess:
sudo lsof -i :3030

# Stoppe PM2:
pm2 stop rag-server
pm2 delete rag-server

# Starte neu:
pm2 start ecosystem.config.js
```

### SSL-Fehler

```bash
# Prüfe Certbot:
sudo certbot certificates

# Neu installieren:
sudo certbot --nginx -d server.maximleopold.com
```

## Updates deployen

Wenn du Änderungen am Code machst:

```bash
# SSH zum Server:
ssh -i ~/ssh_keys max@91.99.236.172

# Update Code:
cd /home/max/rag-server
git pull
npm install

# Bei Änderungen am Server-Code:
pm2 restart rag-server

# Bei Änderungen an den Dokumenten:
npm run rag:index
pm2 restart rag-server
```

## Monitoring

### Resource Usage

```bash
# CPU/RAM anzeigen:
pm2 monit

# Detaillierte Infos:
pm2 show rag-server
```

### Disk Space

```bash
# Disk Usage:
df -h

# Vector Store Größe:
du -h /home/max/rag-server/rag/vector-store.json
```

### Logs rotieren

PM2 rotiert Logs automatisch. Falls nötig:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Backup

Sichere regelmäßig den Vector Store:

```bash
# Backup erstellen:
cd /home/max/rag-server
tar -czf vector-store-backup-$(date +%Y%m%d).tar.gz rag/vector-store.json

# Backup herunterladen:
scp -i ~/ssh_keys max@91.99.236.172:/home/max/rag-server/vector-store-backup-*.tar.gz ~/backups/
```

## Kosten

**Server-Kosten:** Je nach Hosting-Provider
**API-Kosten (monatlich bei moderater Nutzung):**
- OpenAI Embeddings: ~$1-3
- Claude API: ~$5-15

**Total: ~$6-20/Monat** 🚀

---

**Bei Fragen oder Problemen:**
- Prüfe PM2 Logs: `pm2 logs rag-server`
- Prüfe nginx Logs: `sudo tail -f /var/log/nginx/error.log`
- Prüfe Server Health: `curl https://server.maximleopold.com/health`

# 🚀 Quick Start: RAG Server auf server.maximleopold.com

## ✅ Was wurde vorbereitet


auf '/Users/maxmacbookpro/Developer/eigene Projekte/second_brain/notes.maximleopold.com' gehen und:

npm run publish:quick

eingeben. Den Status kann ich mir hier anschauen: 

https://github.com/maaxhe/notes.maximleopold.com/actions/workflows/deploy-server.yml

Nützliche Befehle:
  - Log prüfen: cat /tmp/notes-publish.log                                   
  - Manuell testen: ./auto-publish.sh                                        
  - Deaktivieren: launchctl unload                                           
  ~/Library/LaunchAgents/com.maxim.notes-publish.plist  
  

1. ✅ Deployment-Script erstellt (`deploy-to-server.sh`)
2. ✅ Frontend-URL aktualisiert (zeigt auf `server.maximleopold.com`)
3. ✅ Vollständige Deployment-Anleitung erstellt (`SERVER-DEPLOYMENT.md`)

## 📋 Was du jetzt tun musst

### Schritt 1: DNS konfigurieren (5 Min)

Gehe zu deinem DNS-Provider und erstelle einen A-Record:

```
Host/Name:  server
Type:       A
Value:      91.99.236.172
TTL:        Auto (oder 300)
```

**DNS-Check (nach 5-10 Min):**
```bash
dig server.maximleopold.com +short
# Sollte ausgeben: 91.99.236.172
```

### Schritt 2: Deployment-Script auf Server kopieren (1 Min)

```bash
# Von deinem lokalen Rechner:
scp -i ~/ssh_keys deploy-to-server.sh max@91.99.236.172:/home/max/
```

### Schritt 3: Deployment ausführen (10-15 Min)

```bash
# 1. SSH zum Server:
ssh -i ~/ssh_keys max@91.99.236.172

# 2. Script ausführbar machen:
chmod +x /home/max/deploy-to-server.sh

# 3. Deployment starten:
./deploy-to-server.sh
```

**Das Script wird fragen:**
- ✅ ANTHROPIC_API_KEY: (aus deiner `.env` Datei)
- ✅ OPENAI_API_KEY: (aus deiner `.env` Datei)
- ✅ Neu indexieren? (Ja)
- ✅ DNS konfiguriert für SSL? (Ja, wenn DNS fertig ist)

### Schritt 4: Testen (1 Min)

```bash
# Health Check:
curl https://server.maximleopold.com/health

# Erwartete Ausgabe:
# {"status":"ok","vectorStore":"loaded","chunks":6409}
```

### Schritt 5: Frontend deployen (2 Min)

```bash
# Vom lokalen Rechner:
git add .
git commit -m "Configure RAG server for production (server.maximleopold.com)"
git push
```

Nach ~2-3 Minuten (GitHub Pages Build), öffne:
👉 **https://notes.maximleopold.com**

Klicke auf den Chatbot-Button und teste! 🎉

## 🛠️ Nützliche Befehle

### Auf dem Server (via SSH)

```bash
# PM2 Status:
pm2 status

# Logs anschauen:
pm2 logs rag-server

# Server neustarten:
pm2 restart rag-server

# nginx Status:
sudo systemctl status nginx

# Vector Store neu indexieren:
cd /home/max/rag-server
npm run rag:index
pm2 restart rag-server
```

### Von deinem lokalen Rechner

```bash
# Health Check:
curl https://server.maximleopold.com/health

# Stats:
curl https://server.maximleopold.com/stats

# Test Chat (POST):
curl -X POST https://server.maximleopold.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Was sind auditorische Streams?"}'
```

## 🔥 Troubleshooting

### Server läuft nicht

```bash
ssh -i ~/ssh_keys max@91.99.236.172
pm2 logs rag-server --lines 50
pm2 restart rag-server
```

### Vector Store nicht geladen

```bash
ssh -i ~/ssh_keys max@91.99.236.172
cd /home/max/rag-server
npm run rag:index
pm2 restart rag-server
```

### SSL-Fehler

```bash
ssh -i ~/ssh_keys max@91.99.236.172
sudo certbot --nginx -d server.maximleopold.com
```

### CORS-Fehler im Browser

```bash
# Prüfe nginx Config:
ssh -i ~/ssh_keys max@91.99.236.172
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

## 📊 Monitoring

### Resource Usage

```bash
ssh -i ~/ssh_keys max@91.99.236.172
pm2 monit
```

### Disk Space

```bash
ssh -i ~/ssh_keys max@91.99.236.172
df -h
du -h /home/max/rag-server/rag/vector-store.json
```

## 🔄 Updates deployen

Wenn du Änderungen am Code machst:

```bash
ssh -i ~/ssh_keys max@91.99.236.172
cd /home/max/rag-server
git pull
npm install
pm2 restart rag-server
```

## 💰 Kosten

**Geschätzte monatliche Kosten:**
- Server-Hosting: Je nach Provider
- OpenAI Embeddings: ~$1-3
- Claude API: ~$5-15

**Total: ~$6-20/Monat** für voll funktionsfähigen Chatbot 🚀

---

## 📚 Weitere Dokumentation

- **Vollständige Deployment-Anleitung:** `SERVER-DEPLOYMENT.md`
- **RAG Server README:** `rag/README.md`
- **API Keys Setup:** `rag/API-KEYS-SETUP.md`

---

**Bei Fragen oder Problemen:**
1. Prüfe PM2 Logs: `pm2 logs rag-server`
2. Prüfe nginx Logs: `sudo tail -f /var/log/nginx/error.log`
3. Prüfe Health: `curl https://server.maximleopold.com/health`

**Viel Erfolg! 🎉**

# RAG Chatbot Deployment Guide

## Übersicht

Der RAG Chatbot besteht aus zwei Teilen:
1. **Frontend** (Quartz statische Seite) → bereits auf notes.maximleopold.com deployed
2. **Backend** (RAG Server) → muss separat deployed werden

## RAG Server auf Railway.app deployen (Empfohlen)

### Schritt 1: Railway Account erstellen
1. Gehe zu [railway.app](https://railway.app)
2. Melde dich mit GitHub an

### Schritt 2: Neues Projekt erstellen
1. Klicke auf "New Project"
2. Wähle "Deploy from GitHub repo"
3. Wähle dein Repository `notes.maximleopold.com`
4. Railway erkennt automatisch das Node.js Projekt

### Schritt 3: Environment Variables setzen
Im Railway Dashboard, gehe zu "Variables" und füge hinzu:

```
ANTHROPIC_API_KEY=dein-anthropic-api-key
OPENAI_API_KEY=dein-openai-api-key
NODE_ENV=production
```

**Wichtig:** Die API Keys findest du in deiner `.env` Datei lokal.

### Schritt 4: Deploy starten
1. Railway startet automatisch den Build
2. Nach ~2-3 Minuten ist der Server online
3. Du bekommst eine URL wie: `https://dein-projekt.up.railway.app`

### Schritt 5: Frontend-Code aktualisieren
Öffne `quartz/components/scripts/ragChatbot.inline.ts` und ersetze:

```typescript
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3030"
  : "https://dein-projekt.up.railway.app" // ← Hier deine Railway URL einfügen!
```

### Schritt 6: Vector Store hochladen
Der Server braucht die `vector-store.json` Datei:

**Option A: Über Railway Dashboard**
1. Führe lokal einmal aus: `npm run rag:index`
2. Die Datei `rag/vector-store.json` wird erstellt
3. Committe sie zu Git: `git add rag/vector-store.json && git commit -m "Add vector store"`
4. Pushe zu GitHub: `git push`
5. Railway deployt automatisch neu

**Option B: Re-indexierung auf Railway**
1. Nach dem ersten Deployment
2. Trigger `/reindex` Endpoint:
   ```bash
   curl -X POST https://dein-projekt.up.railway.app/reindex
   ```

### Schritt 7: Testen
1. Öffne: `https://dein-projekt.up.railway.app/health`
2. Du solltest sehen: `{"status":"ok","vectorStore":"loaded","chunks":6409}`
3. Pushe deine Frontend-Änderungen zu GitHub
4. Der Chatbot auf notes.maximleopold.com sollte jetzt funktionieren! 🎉

## Kosten

**Railway.app Free Tier:**
- $5 kostenloses Guthaben pro Monat
- Sollte für moderate Nutzung ausreichen
- Nach Verbrauch: ~$5-10/Monat für kleine Apps

**Alternative: Render.com**
- Komplett kostenlos für Hobby-Projekte
- Server schläft nach 15 Min Inaktivität (erste Anfrage dauert dann 30-60 Sek)

## Troubleshooting

### Server startet nicht
```bash
# Prüfe Logs in Railway Dashboard unter "Deployments" → "View Logs"
```

### CORS Fehler
Der Server hat bereits CORS aktiviert (`cors()` middleware), sollte kein Problem sein.

### Vector Store nicht gefunden
Stelle sicher, dass `rag/vector-store.json` in Git committed ist:
```bash
git add rag/vector-store.json
git commit -m "Add vector store"
git push
```

### Kosten zu hoch
Wenn Railway zu teuer wird, wechsle zu **Render.com** (kostenlos, aber Server schläft bei Inaktivität).

## Monitoring

Checke regelmäßig:
- Railway Dashboard → Metrics (CPU, RAM, Requests)
- OpenAI Dashboard → Usage (Embedding Costs)
- Anthropic Dashboard → Usage (Claude API Costs)

---

**Geschätzte monatliche Kosten:**
- Railway Hosting: $5-10/Monat (oder Free Tier)
- OpenAI Embeddings: ~$1-3/Monat (bei moderater Nutzung)
- Claude API: ~$5-15/Monat (abhängig von Anfragen)

**Total: ~$10-25/Monat** für voll funktionsfähigen Chatbot 🚀

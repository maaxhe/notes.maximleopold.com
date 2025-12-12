# Railway Deployment - Quick Start

## 1. Railway Account Setup

1. Gehe zu **[railway.app](https://railway.app)**
2. "Login with GitHub"
3. Autorisiere Railway

## 2. Neues Projekt erstellen

1. Dashboard → **"New Project"**
2. **"Deploy from GitHub repo"**
3. Wähle: `notes.maximleopold.com`
4. Railway startet automatischen Build

## 3. Environment Variables konfigurieren

Im Railway Dashboard → **"Variables"** Tab:

```bash
ANTHROPIC_API_KEY=sk-ant-...  # Dein Anthropic API Key
OPENAI_API_KEY=sk-...         # Dein OpenAI API Key
NODE_ENV=production
```

> **Wo finde ich meine API Keys?**
> - Schau in deine lokale `.env` Datei
> - Oder: Anthropic Dashboard, OpenAI Dashboard

## 4. Start Command anpassen (falls nötig)

Railway sollte automatisch erkennen: `npm run rag:server`

Falls nicht, gehe zu **Settings** → **Deploy** → **Start Command**:
```
npm run rag:server
```

## 5. Vector Store erstellen (WICHTIG!)

Die `vector-store.json` ist 292 MB groß und NICHT in Git.

**Nach dem ersten Deployment:**

```bash
# Trigger Re-Indexierung auf Railway:
curl -X POST https://dein-projekt.up.railway.app/reindex
```

Das dauert **3-5 Minuten**. Railway indiziert alle deine Markdown/PDF-Dateien.

## 6. Domain URL kopieren

Railway gibt dir eine URL wie:
```
https://notes-rag-production-abc123.up.railway.app
```

**Kopiere diese URL!**

## 7. Frontend aktualisieren

Öffne: `quartz/components/scripts/ragChatbot.inline.ts`

Ersetze Zeile 4:
```typescript
: "https://notes-rag-production-abc123.up.railway.app" // ← Deine Railway URL!
```

## 8. Deployen & Testen

```bash
git add .
git commit -m "Configure RAG server for production"
git push
```

**Test:**
1. Öffne: `https://dein-projekt.up.railway.app/health`
2. Sollte zeigen: `{"status":"ok","vectorStore":"loaded","chunks":6409}`
3. Öffne: `https://notes.maximleopold.com`
4. Chatbot sollte funktionieren! 🎉

## Troubleshooting

### "Vector Store nicht geladen"
```bash
curl -X POST https://dein-projekt.up.railway.app/reindex
```
Warte 5 Minuten, dann checke `/health` erneut.

### "CORS Error" im Browser
- Sollte nicht passieren (CORS ist aktiviert)
- Falls doch: Checke Railway Logs

### Server schläft ein
Railway Free Tier schläft NICHT ein (im Gegensatz zu Render.com).

### Kosten überwachen
Railway Dashboard → **"Usage"** Tab zeigt aktuellen Verbrauch.

---

**Geschätzte Deployment-Zeit: 10-15 Minuten** ⏱️

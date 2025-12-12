# Mika - RAG Chatbot für deine Bachelorarbeit

Mika ist dein persönlicher Retrieval-Augmented Generation (RAG) Chatbot, der deine Bachelorarbeit-Notizen und PDFs indiziert und dir ermöglicht, intelligent durch deine Dokumente zu suchen.

## Features

✅ **Intelligente Suche**: Semantische Suche durch alle Markdown-Dateien und PDFs
✅ **Claude AI Integration**: Nutzt Claude 3.5 Sonnet für qualitativ hochwertige Antworten
✅ **OpenAI Embeddings**: text-embedding-3-large für beste Retrieval-Qualität
✅ **Quellenangaben**: Zeigt dir genau, woher die Informationen stammen
✅ **Relevanz-Scoring**: Sortiert Ergebnisse nach Relevanz
✅ **Konversations-Historie**: Chatbot merkt sich den Kontext eurer Unterhaltung

## Architektur

```
┌─────────────────┐
│  Quartz Frontend│
│   (React UI)    │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Express Server │
│   (RAG Logic)   │
└────────┬────────┘
         │
    ┌────┴─────┬─────────────┬──────────┐
    ▼          ▼             ▼          ▼
┌────────┐ ┌─────────┐ ┌──────────┐ ┌────────┐
│Vector  │ │ OpenAI  │ │ Claude   │ │ Files  │
│Store   │ │Embeddings│ │   API    │ │ (MD+PDF│
│(JSON)  │ │(3-large)│ │(Chat)   │ │        │
└────────┘ └─────────┘ └──────────┘ └────────┘
```

## Setup

### 1. Dependencies installieren

```bash
npm install
```

Installiert:
- `@anthropic-ai/sdk` - Claude API Client
- `openai` - OpenAI SDK für Embeddings
- `express` - Backend Server
- `cors` - Cross-Origin Resource Sharing
- `pdf-parse` - PDF Text Extraction

### 2. API-Keys einrichten

Du benötigst zwei API-Keys:

#### Anthropic (Claude) API Key
1. Gehe zu https://console.anthropic.com/
2. Erstelle einen Account
3. Gehe zu "API Keys" und erstelle einen neuen Key
4. Kopiere den Key

#### OpenAI API Key
1. Gehe zu https://platform.openai.com/api-keys
2. Erstelle einen Account (falls noch nicht vorhanden)
3. Klicke auf "Create new secret key"
4. Gib einen Namen ein (z.B. "Mika Embeddings")
5. Kopiere den Key sofort (wird nur einmal angezeigt!)

#### Keys als Environment Variables setzen:

**macOS/Linux:**
```bash
export ANTHROPIC_API_KEY='sk-ant-...'
export OPENAI_API_KEY='sk-proj-...'
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY='sk-ant-...'
$env:OPENAI_API_KEY='sk-proj-...'
```

**Persistent (empfohlen):**
Füge zu deiner `~/.zshrc` oder `~/.bashrc` hinzu:
```bash
export ANTHROPIC_API_KEY='sk-ant-...'
export OPENAI_API_KEY='sk-proj-...'
```

### 3. Dokumente indizieren

Dieser Schritt erstellt Embeddings für alle deine Dokumente:

```bash
npm run rag:index
```

Das Script:
- Findet alle Markdown-Dateien in `content/Bachelorarbeit/`
- Findet alle PDFs in `content/a Literatur-Notizen/PDFs/`
- Teilt Dokumente in semantisch sinnvolle Chunks auf (~800 Zeichen)
- Erstellt Embeddings mit OpenAI text-embedding-3-large
- Speichert alles in `rag/vector-store.json`

⏱️ **Dauer**: ~1-2 Minuten (OpenAI ist sehr schnell)
💰 **Kosten**: ~$0.09 (für ~700 Chunks, text-embedding-3-large: $0.13/1M tokens)

**Output-Beispiel:**
```
🚀 Starte Indexierung der Bachelorarbeit-Dokumente...

📄 Suche Markdown-Dateien...
  ✓ 104 Markdown-Dateien gefunden

📚 Suche PDF-Dateien...
  ✓ 25 PDF-Dateien gefunden

⚙️  Verarbeite Dokumente...
  ✓ 287 Markdown-Chunks erstellt
  ✓ 412 PDF-Chunks erstellt

📊 Gesamt: 699 Chunks

🔮 Erstelle Embeddings für 699 Chunks...
  ✓ Batch 1/6 fertig
  ✓ Batch 2/6 fertig
  ...

✅ Indexierung abgeschlossen!
   Gespeichert in: rag/vector-store.json
   Größe: 45.23 MB
```

### 4. RAG Server starten

```bash
npm run rag:server
```

Der Server läuft auf `http://localhost:3030` und stellt folgende Endpoints bereit:

- `GET /health` - Health Check
- `POST /chat` - Chat mit RAG
- `POST /search` - Direkte Suche
- `GET /stats` - Statistiken

**Server-Output:**
```
✅ Vector Store geladen: 699 Chunks

🚀 RAG Server läuft auf http://localhost:3030

📍 Endpoints:
   GET  /health  - Health Check
   POST /chat    - Chat mit RAG
   POST /search  - Direkte Suche
   GET  /stats   - Statistiken
```

### 5. Quartz Website starten

In einem **separaten Terminal**:

```bash
npm run dev
```

Die Website läuft auf `http://localhost:8080`.

Gehe zu `/Bachelorarbeit/Dashboard-BA` um den Chatbot zu sehen!

## Verwendung

### Im Browser

1. Öffne `http://localhost:8080/Bachelorarbeit/Dashboard-BA`
2. Du siehst Mika (🧠) am unteren Ende der Seite
3. Stelle eine Frage, z.B.:
   - "Was sind die Unterschiede zwischen ventralem und dorsalem Stream?"
   - "Welche Rolle spielt das FEF?"
   - "Fasse die Hauptpunkte über auditorische Streams zusammen"

### Via API (zum Testen)

**Health Check:**
```bash
curl http://localhost:3030/health
```

**Chat:**
```bash
curl -X POST http://localhost:3030/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Was sind auditorische Streams?"
  }'
```

**Suche:**
```bash
curl -X POST http://localhost:3030/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "FEF",
    "topK": 5
  }'
```

## Konfiguration

### Chunk-Größe anpassen

In `rag/index-documents.ts`:
```typescript
const CHUNK_SIZE = 800 // Erhöhen für längere Chunks
const CHUNK_OVERLAP = 200 // Überlappung zwischen Chunks
```

### Anzahl der abgerufenen Chunks

In `rag/server.ts` (Zeile ~134):
```typescript
const relevantChunks = await findRelevantChunks(message, 8) // 8 → anpassen
```

### Claude Modell ändern

In `rag/server.ts` (Zeile ~147):
```typescript
model: "claude-3-5-sonnet-20241022", // Oder: claude-3-opus-20240229
```

### OpenAI Embedding Modell ändern

In `rag/index-documents.ts` (Zeile ~163):
```typescript
model: "text-embedding-3-large", // Oder: text-embedding-3-small (günstiger)
dimensions: 1536, // Kann auf 3072 erhöht werden für mehr Präzision
```

**Modell-Vergleich:**
- `text-embedding-3-small`: Günstiger ($0.02/1M tokens), schneller, gute Qualität
- `text-embedding-3-large`: Teurer ($0.13/1M tokens), beste Qualität (empfohlen)

## Troubleshooting

### "Vector Store nicht geladen"
→ Führe `npm run rag:index` aus

### "ANTHROPIC_API_KEY nicht gesetzt" oder "OPENAI_API_KEY nicht gesetzt"
→ Setze die Environment Variables (siehe Setup Schritt 2)

### "Server ist nicht erreichbar"
→ Stelle sicher, dass `npm run rag:server` läuft

### Schlechte Suchergebnisse
→ Probiere:
- Chunk-Größe anpassen
- Anzahl der Top-K Chunks erhöhen
- Spezifischere Fragen stellen

### PDFs werden nicht richtig geparst
→ Manche PDFs sind gescannt und enthalten keinen extrahierbaren Text. Nutze OCR-Tools vorher.

## Kosten-Übersicht

### Indexierung (einmalig)
- **OpenAI Embeddings**: ~$0.09 (text-embedding-3-large: $0.13/1M tokens)
- Beispiel: 700 Chunks à 800 Zeichen ≈ 700K tokens ≈ $0.09
- **Alternative mit text-embedding-3-small**: ~$0.014 (85% günstiger, etwas schlechter)

### Laufzeit (pro Chat-Anfrage)
- **OpenAI Query Embedding**: ~$0.0001 (sehr klein)
- **Claude API**: ~$0.015-0.03 pro Request
  - Input (8 Chunks + Query): ~3000 tokens × $0.003/1K = $0.009
  - Output (~500 tokens): ~500 tokens × $0.015/1K = $0.0075

**Gesamt**: ~$0.018 pro Chat-Anfrage

### Monatliche Kosten (Schätzung)
- 100 Fragen/Monat: ~$1.80
- 500 Fragen/Monat: ~$9
- 1000 Fragen/Monat: ~$18

**Tipp**: Verwende `text-embedding-3-small` statt `-large` um Kosten zu senken (bei minimalem Qualitätsverlust)

## Erweiterte Features (Optional)

### Re-Indexierung bei Datei-Änderungen
Erstelle ein Watch-Script:
```typescript
// rag/watch-and-reindex.ts
import chokidar from 'chokidar'
import { execSync } from 'child_process'

chokidar.watch(['content/Bachelorarbeit/**/*.md']).on('change', () => {
  console.log('Änderung erkannt, re-indexiere...')
  execSync('npm run rag:index')
})
```

### Deployment
Für Production:
1. Verwende Redis oder Pinecone statt JSON für Vector Store
2. Hoste Backend auf Railway/Render/Fly.io
3. Setze Environment Variables dort
4. Update Frontend-URL in `RAGChatbot.tsx`

## Weitere Ideen

- 🔍 **Filter nach Kategorie**: Nur in bestimmten Ordnern suchen
- 📊 **Export-Funktion**: Konversationen als Markdown exportieren
- 🎯 **Keyword Highlighting**: Zeige relevante Keywords an
- 📈 **Analytics**: Tracking der häufigsten Fragen
- 🗣️ **Sprachausgabe**: Text-to-Speech Integration

## Support

Bei Fragen oder Problemen:
1. Schaue in die Logs (`npm run rag:server` Output)
2. Teste die API direkt mit `curl`
3. Überprüfe Browser Console für Frontend-Fehler

Viel Erfolg mit deiner Bachelorarbeit! 🎓

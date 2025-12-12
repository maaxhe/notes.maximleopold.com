# 🧠 Mika - Quick Start Guide

Mika ist dein persönlicher RAG-Chatbot für deine Bachelorarbeit über auditorische Streams.

## Schnellstart (3 Minuten)

### 1️⃣ API-Keys einrichten

Du brauchst zwei API-Keys:

**Anthropic (Claude):**

- Gehe zu: https://console.anthropic.com/
- Erstelle Account → API Keys → Neuer Key
- Kopiere den Key

**OpenAI:**

- Gehe zu: https://platform.openai.com/api-keys
- Erstelle Account → API Keys → Create new secret key
- Kopiere den Key

**Setze die Keys:**

```bash
export ANTHROPIC_API_KEY='sk-ant-...'
export OPENAI_API_KEY='sk-proj-...'
```

### 2️⃣ Dokumente indizieren

```bash
npm run rag:index
```

⏱️ Dauert ~1-2 Minuten. Erstellt Embeddings mit OpenAI text-embedding-3-large.

### 3️⃣ Server starten

**Terminal 1 - Backend:**

```bash
npm run rag:server
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

### 4️⃣ Mika benutzen

Öffne: http://localhost:8080/Bachelorarbeit/Dashboard-BA

Scrolle nach unten und stelle Mika eine Frage! 💬

## Beispiel-Fragen

- "Was sind die Unterschiede zwischen ventralem und dorsalem auditorischen Stream?"
- "Welche Rolle spielt das FEF im auditorischen Where-Pathway?"
- "Fasse die Haupterkenntnisse über Lateralisierung zusammen"
- "Welche Hirnareale sind am Auditory What-Stream beteiligt?"

## Troubleshooting

**"Vector Store nicht geladen"**
→ Führe `npm run rag:index` aus

**"Server ist nicht erreichbar"**
→ Stelle sicher, dass `npm run rag:server` läuft

**"API Key fehlt"**
→ Setze die Environment Variables (siehe Schritt 1)

## Kosten

- **Indexierung**: ~$0.09 (einmalig, mit text-embedding-3-large)
- **Pro Frage**: ~$0.018
- **100 Fragen/Monat**: ~$1.80

## Weitere Infos

Vollständige Dokumentation: `rag/README.md`

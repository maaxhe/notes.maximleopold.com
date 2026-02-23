---
title: "Mika — KI-Assistent Architektur"
date: 2026-02-23
tags: [meta, ki, rag, architektur]
modified: 2026-02-23
---

# Mika — Wie der KI-Assistent funktioniert

Mika ist ein **RAG-System** (Retrieval-Augmented Generation), das auf meiner persönlichen Wissensdatenbank basiert. Er kann Fragen zu meiner Bachelorarbeit beantworten, indem er relevante Passagen aus meinen Notizen und Papers findet und diese als Kontext an ein Large Language Model übergibt.

---

## Das Grundprinzip: RAG

Das Problem mit reinen LLMs (wie ChatGPT): Sie wissen nichts über meine spezifischen Notizen, Papers und Gedanken. RAG löst das:

> Statt das Modell alles "lernen" zu lassen, sucht das System zuerst die relevantesten Textpassagen und gibt sie dem Modell als Kontext mit — ähnlich wie "Open Book Exam" statt "Auswendig lernen".

---

## Architektur im Überblick

```
┌─────────────────────────────────────────────────────────┐
│                    OFFLINE (einmalig)                    │
│                                                         │
│  Markdown-Notizen + PDFs                                │
│         ↓ Chunking (nach Headings)                      │
│  ~6400 Textpassagen à ~500–800 Zeichen                  │
│         ↓ OpenAI text-embedding-3-large                 │
│  Jeder Chunk → 1536-dimensionaler Vektor                │
│         ↓                                               │
│  vector-store.json  (~200 MB)                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  ONLINE (pro Anfrage)                   │
│                                                         │
│  User: "Was ist der dorsale Stream?"                    │
│         ↓                                               │
│  1. Query → OpenAI Embedding → Query-Vektor             │
│  2. Hybrid Search:                                      │
│     a) Cosinus-Ähnlichkeit (semantisch)                 │
│     b) BM25 Keyword-Score (lexikalisch)                 │
│     → kombinierter Score, Top-20 Kandidaten             │
│  3. Reranking: keyword overlap → Top-5 final            │
│  4. Kontext aufbauen:                                   │
│     Chunks + aktuelle Seite + Gesprächsverlauf          │
│         ↓                                               │
│  5. Claude Sonnet (streaming via SSE)                   │
│         ↓                                               │
│  Antwort mit Inline-Zitaten [Source] + Quellen-Karten  │
└─────────────────────────────────────────────────────────┘
```

---

## Stack

| Komponente | Technologie | Warum |
|---|---|---|
| **Embeddings** | OpenAI `text-embedding-3-large` (1536 dims) | State-of-the-art Qualität |
| **Vector Store** | Flat JSON (`vector-store.json`) | Kein Infra-Overhead, läuft lokal |
| **Semantic Search** | Cosinus-Ähnlichkeit (in-memory Node.js) | Schnell genug für ~6400 Chunks |
| **Keyword Search** | BM25 (selbst implementiert) | Trifft exakte Begriffe die semantisch weit liegen |
| **Reranking** | Keyword-Overlap Score | Verfeinert die Top-20 auf Top-5 |
| **LLM (Chat)** | Anthropic Claude Sonnet | Beste Qualität für Reasoning |
| **LLM (Follow-ups)** | Anthropic Claude Haiku | Schnell, günstig für kurze Tasks |
| **Server** | Express.js + SSE Streaming | Echtzeit-Streaming im Browser |
| **Frontend** | Quartz (SSG) + Inline TypeScript | Integriert in Notiz-System |
| **Deployment** | VPS + PM2 + nginx | Self-hosted, volle Kontrolle |

---

## Retrieval im Detail: Hybrid Search

Reines semantisches Suchen (Cosinus-Ähnlichkeit) hat einen blinden Fleck: exakte Fachbegriffe wie "FEF" oder "IFJ" können semantisch weit von der Query liegen, obwohl sie direkt relevant sind. Deshalb kombiniert Mika zwei Ansätze:

### 1. Semantische Suche (Cosinus-Ähnlichkeit)
- Query und Chunks werden als Vektoren repräsentiert
- Cosinus-Winkel zwischen Vektoren = semantische Ähnlichkeit
- Versteht Synonyme und verwandte Konzepte

### 2. BM25 (Keyword-Ranking)
- Klassischer Information-Retrieval-Algorithmus
- Bewertet Chunks nach Häufigkeit der Query-Terme
- Berücksichtigt Dokumentlänge (tf-idf Basis)

### 3. Score-Kombination
```
final_score = 0.7 × cosine_score + 0.3 × bm25_score
```

### 4. Kontextuelles Boosting
- Chunks der **aktuell angezeigten Seite** → Score × 2.0
- Explizite **[[Wikilinks]]** in der Query → absolute Priorität

---

## Chunking-Strategie

Schlechtes Chunking zerstört RAG-Qualität. Statt fixer Zeichenanzahl wird nach **Markdown-Headings** gechunkt:

```markdown
# Kapitel: Auditorische Verarbeitung   ← Chunk-Grenze
Inhalt des Kapitels...

## Dorsaler Stream                      ← Chunk-Grenze
Inhalt des Abschnitts...
```

Das bedeutet: jeder Chunk enthält eine **semantisch zusammenhängende Einheit** (einen Abschnitt), nicht einen willkürlichen Textausschnitt. Die Heading-Hierarchie wird als Metadaten mitgespeichert.

---

## Was Mika kann

- **Fragen beantworten** zu allen Inhalten in meiner Wissensdatenbank
- **Aktuelle Seite lesen** — schaut auf den Inhalt der gerade geöffneten Notiz (inkl. Transclusions wie `![[andere Seite]]`)
- **Literatur durchsuchen** — findet relevante Papers und Studien
- **Zusammenfassen** — fasst die aktuelle Seite zusammen
- **Follow-up Fragen** generieren — schlägt sinnvolle Anschlussfragen vor
- **Gesprächsverlauf** — merkt sich den Kontext über mehrere Fragen hinweg
- **Seitengedächtnis** — erkennt wenn man auf eine neue Seite navigiert

---

## Was ich im Interview sagen würde

> "Mika ist ein RAG-System das auf meiner persönlichen Notiz-Wissensdatenbank läuft. Ich habe alle meine Markdown-Notizen und PDFs offline mit OpenAI Embeddings vektorisiert und in einem JSON-basierten Vektorspeicher abgelegt — insgesamt etwa 6400 Chunks. Bei einer Anfrage wird die Query ebenfalls embedded, dann kombiniere ich semantische Ähnlichkeit per Cosinus mit einem BM25 Keyword-Score, um sowohl konzeptuell verwandte als auch exakt passende Passagen zu finden. Die Top-Kandidaten werden nochmals reranked und als Kontext an Claude Sonnet übergeben. Das Besondere ist das kontextsensitive Boosting: Chunks der aktuell angeschauten Seite bekommen einen Score-Boost, sodass Mika immer auch die gerade gelesene Seite 'versteht'. Geantwortet wird per Server-Sent Events für echtes Token-by-Token Streaming im Browser."

---

## Verbesserungspotenzial (nächste Schritte)

- **Cross-Encoder Reranking** (z.B. Cohere Rerank API) statt heuristischem Reranking
- **Größeres Embedding-Modell** (`text-embedding-3-large` mit 3072 dims statt 1536)
- **Inkrementelles Indexieren** — nur geänderte Dateien neu embedden
- **Graphbasiertes Retrieval** — Wikilink-Graphstruktur für bessere Zusammenhänge nutzen

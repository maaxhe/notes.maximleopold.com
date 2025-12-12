# 🔐 API-Keys sicher einrichten

## ✅ Die SICHERE Methode: .env Datei

Ich habe eine `.env` Datei für dich erstellt. Diese Datei:
- ✅ Ist in `.gitignore` → wird **NIE** zu Git committed
- ✅ Bleibt lokal auf deinem Computer
- ✅ Ist einfach zu benutzen

## Schritt-für-Schritt Anleitung:

### 1. Öffne die .env Datei

Die Datei ist hier: **`.env`** (im Projekt-Root)

```bash
# In VS Code öffnen:
code .env

# Oder mit einem anderen Editor:
open .env
```

### 2. Füge deine API-Keys ein

Die Datei sieht so aus:

```env
# Mika RAG Chatbot - API Keys

# Anthropic API Key (für Claude Chat)
ANTHROPIC_API_KEY=

# OpenAI API Key (für Embeddings)
OPENAI_API_KEY=
```

**Fülle die Keys aus:**

```env
# Anthropic API Key (für Claude Chat)
ANTHROPIC_API_KEY=sk-ant-dein-echter-key-hier

# OpenAI API Key (für Embeddings)
OPENAI_API_KEY=sk-proj-dein-echter-key-hier
```

### 3. Speichern & fertig!

- Speichere die Datei (Cmd+S)
- Die Scripts laden die Keys jetzt automatisch
- Du musst nichts mehr ins Terminal eingeben!

## API-Keys besorgen:

### Anthropic (Claude):
1. Gehe zu https://console.anthropic.com/
2. Registriere dich / Logge dich ein
3. Gehe zu "API Keys"
4. Klicke "Create Key"
5. Kopiere den Key (sieht aus wie: `sk-ant-...`)

### OpenAI:
1. Gehe zu https://platform.openai.com/api-keys
2. Registriere dich / Logge dich ein
3. Klicke "Create new secret key"
4. Gib einen Namen ein (z.B. "Mika Embeddings")
5. Kopiere den Key sofort! (wird nur einmal angezeigt, sieht aus wie: `sk-proj-...`)

## Jetzt starten:

```bash
# 1. Dokumente indizieren (liest automatisch aus .env)
npm run rag:index

# 2. Server starten (Terminal 1)
npm run rag:server

# 3. Website starten (Terminal 2)
npm run dev
```

## Warum ist das sicher?

✅ **`.env` ist in `.gitignore`** → Git ignoriert diese Datei komplett
✅ **Keine Commits** → Keys landen nie in deiner Git-Historie
✅ **Lokal** → Datei bleibt nur auf deinem Computer
✅ **Einfach** → Kein Terminal-Gefummel mehr

## Überprüfung:

Teste, ob Git die Datei ignoriert:

```bash
git status
```

Du solltest `.env` **NICHT** in der Liste sehen! ✅

Wenn doch → die Datei wurde schon committed. Dann:

```bash
# Entferne aus Git (aber behalte lokal)
git rm --cached .env
git commit -m "Remove .env from Git"
```

## Beispiel:

So sieht eine ausgefüllte `.env` aus:

```env
ANTHROPIC_API_KEY=sk-ant-api03-AbC123XyZ456...
OPENAI_API_KEY=sk-proj-FgH789IjK012...
```

**Wichtig:** Verwende deine echten Keys, nicht die Platzhalter!

---

🎉 **Fertig!** Du kannst jetzt sicher mit Mika arbeiten!

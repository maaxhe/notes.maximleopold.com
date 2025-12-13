#!/bin/bash
# RAG Server Setup auf VPS
# Kopiert nur die notwendigen Dateien und richtet alles ein

set -e

SERVER="max@91.99.236.172"
SSH_KEY="~/ssh_keys"
REMOTE_DIR="/home/max/rag-server"

echo "🚀 RAG Server Setup gestartet..."

# 1. Erstelle Verzeichnis auf Server
echo "[1/8] Erstelle Verzeichnis auf Server..."
ssh -i $SSH_KEY $SERVER "mkdir -p $REMOTE_DIR/rag"

# 2. Kopiere package.json
echo "[2/8] Kopiere package.json..."
scp -i $SSH_KEY package.json $SERVER:$REMOTE_DIR/

# 3. Kopiere tsconfig.json falls vorhanden
echo "[3/8] Kopiere tsconfig.json..."
if [ -f tsconfig.json ]; then
    scp -i $SSH_KEY tsconfig.json $SERVER:$REMOTE_DIR/
fi

# 4. Kopiere RAG-Dateien (ohne vector-store.json!)
echo "[4/8] Kopiere RAG-Dateien..."
scp -i $SSH_KEY rag/server.ts $SERVER:$REMOTE_DIR/rag/
scp -i $SSH_KEY rag/index-documents.ts $SERVER:$REMOTE_DIR/rag/
scp -i $SSH_KEY rag/.gitignore $SERVER:$REMOTE_DIR/rag/ 2>/dev/null || true

# 5. Kopiere content Verzeichnis für Indexierung
echo "[5/8] Kopiere content Verzeichnis..."
ssh -i $SSH_KEY $SERVER "mkdir -p $REMOTE_DIR/content"
scp -i $SSH_KEY -r content/* $SERVER:$REMOTE_DIR/content/

# 6. Installiere Dependencies auf Server
echo "[6/8] Installiere Dependencies..."
ssh -i $SSH_KEY $SERVER "cd $REMOTE_DIR && npm install"

# 7. Erstelle .env Datei
echo "[7/8] Erstelle .env Datei..."
echo "Bitte gib deine API Keys ein:"
read -p "ANTHROPIC_API_KEY: " ANTHROPIC_KEY
read -p "OPENAI_API_KEY: " OPENAI_KEY

ssh -i $SSH_KEY $SERVER "cat > $REMOTE_DIR/.env << EOF
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
OPENAI_API_KEY=$OPENAI_KEY
NODE_ENV=production
PORT=3030
EOF"

# 8. Indexiere Vector Store auf Server
echo "[8/8] Indexiere Vector Store (dauert 3-5 Minuten)..."
ssh -i $SSH_KEY $SERVER "cd $REMOTE_DIR && npm run rag:index"

echo "✅ Setup abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. PM2 starten: ssh -i $SSH_KEY $SERVER 'cd $REMOTE_DIR && pm2 start \"npm run rag:server\" --name mika-rag'"
echo "2. Caddy konfigurieren"
echo "3. Frontend aktualisieren"

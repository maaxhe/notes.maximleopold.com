#!/bin/bash

echo "🧠 Mika Setup - RAG Chatbot für deine Bachelorarbeit"
echo "=================================================="
echo ""

# Überprüfe ob Node.js installiert ist
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert!"
    echo "   Installiere Node.js von https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js gefunden: $(node --version)"
echo ""

# Überprüfe API Keys
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  ANTHROPIC_API_KEY nicht gesetzt!"
    echo ""
    echo "Setze deinen Anthropic API Key:"
    read -p "ANTHROPIC_API_KEY: " anthropic_key
    export ANTHROPIC_API_KEY="$anthropic_key"
    echo "export ANTHROPIC_API_KEY='$anthropic_key'" >> ~/.zshrc
    echo "✓ Key gesetzt und zu ~/.zshrc hinzugefügt"
else
    echo "✓ ANTHROPIC_API_KEY gefunden"
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo ""
    echo "⚠️  OPENAI_API_KEY nicht gesetzt!"
    echo ""
    echo "Setze deinen OpenAI API Key:"
    read -p "OPENAI_API_KEY: " openai_key
    export OPENAI_API_KEY="$openai_key"
    echo "export OPENAI_API_KEY='$openai_key'" >> ~/.zshrc
    echo "✓ Key gesetzt und zu ~/.zshrc hinzugefügt"
else
    echo "✓ OPENAI_API_KEY gefunden"
fi

echo ""
echo "📦 Installiere Dependencies..."
npm install

echo ""
echo "🔮 Indexiere Dokumente..."
npm run rag:index

echo ""
echo "✅ Setup abgeschlossen!"
echo ""
echo "Starte Mika mit:"
echo "  Terminal 1: npm run rag:server"
echo "  Terminal 2: npm run dev"
echo ""
echo "Dann öffne: http://localhost:8080/Bachelorarbeit/Dashboard-BA"
echo ""
echo "Viel Erfolg mit deiner Bachelorarbeit! 🎓"

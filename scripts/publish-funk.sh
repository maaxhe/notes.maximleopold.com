#!/bin/bash
# Build & deploy a standalone Funkkurs-only Quartz site to funk.maximilianherrmann.com
# Reuses the same Quartz theme/layout as notes.coxilab.de, but only the Funkkurs folder.
#
# Usage:  npm run sync   (refresh content/Funkkurs from the vault)  then  bash scripts/publish-funk.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SRC="content/Funkkurs"
BILDER="content/a Literatur-Notizen/Bilder"
PDFS="content/a Literatur-Notizen/PDFs"
BUILD="funk-build"          # temp content dir (gitignored)
OUT="public-funk"           # temp output dir (gitignored)

SERVER_USER="max"
SERVER_IP="91.99.236.172"
SERVER_PATH="/var/www/funk.maximilianherrmann.com"
SSH_KEY="$HOME/ssh_keys"

echo "🧹 Preparing Funkkurs content..."
rm -rf "$BUILD" "$OUT"
mkdir -p "$BUILD/assets"

# 1. Copy all Funkkurs markdown
cp "$SRC"/*.md "$BUILD/"

# 2. Copy referenced assets (Quartz resolves [[name]] by basename, folder doesn't matter)
for f in "$BILDER"/Funk-* "$BILDER"/funkkurs-* "$BILDER"/Funkschema-* \
         "$PDFS"/SRC-* "$PDFS"/Funkkurs-Diagramme.pdf; do
  [ -e "$f" ] && cp "$f" "$BUILD/assets/" || true
done

# 3. Homepage: transclude the existing Funkkurs hub note
cat > "$BUILD/index.md" <<'EOF'
---
title: Funkkurs SRC & UBI
---

> [!info] Funkzeugnis-Kurs
> Komplette Lernunterlagen für das **SRC** (Seefunk) und **UBI** (Binnenfunk) — Technik, Notverfahren, DSC, Quiz & mehr.

![[Funkzeugnis-Kurs SRC und UBI]]
EOF

echo "🏗️  Building Quartz (Funkkurs only)..."
QUARTZ_BASE_URL="funk.maximilianherrmann.com" \
QUARTZ_PAGE_TITLE="Funkkurs SRC & UBI" \
QUARTZ_PAGE_TITLE_SUFFIX="" \
  npx quartz build -d "$BUILD" -o "$OUT"

echo "🚀 Deploying to $SERVER_USER@$SERVER_IP:$SERVER_PATH ..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "sudo mkdir -p $SERVER_PATH && sudo chown -R $SERVER_USER:$SERVER_USER $SERVER_PATH"
rsync -avz --delete -e "ssh -i $SSH_KEY" "$OUT"/ "$SERVER_USER@$SERVER_IP:$SERVER_PATH/"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "chmod -R 755 $SERVER_PATH"

echo "✅ Funkkurs site deployed: https://funk.maximilianherrmann.com"

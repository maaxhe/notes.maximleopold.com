#!/bin/bash
# Auto-publish notes once per day
# Scheduled via launchd at 10:00 and 16:00 (fallback)

set -e

PROJECT_DIR="/Users/maxmacbookpro/Developer/eigene Projekte/second_brain/notes.maximleopold.com"
STAMP_FILE="$PROJECT_DIR/.last-publish"
LOG_FILE="/tmp/notes-publish.log"
TODAY=$(date +%Y-%m-%d)

echo "[$( date )] Auto-publish triggered" >> "$LOG_FILE"

# Skip if already published today
if [ -f "$STAMP_FILE" ] && [ "$(cat "$STAMP_FILE")" = "$TODAY" ]; then
  echo "[$( date )] Already published today, skipping." >> "$LOG_FILE"
  exit 0
fi

cd "$PROJECT_DIR"

# Source nvm/node if needed
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"

npm run publish:quick >> "$LOG_FILE" 2>&1

echo "$TODAY" > "$STAMP_FILE"
echo "[$( date )] Published successfully." >> "$LOG_FILE"

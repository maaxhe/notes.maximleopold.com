import dotenv from "dotenv"

// Lade .env Datei
dotenv.config()

console.log("🔍 Überprüfe API-Keys...\n")

// Prüfe Anthropic Key
if (process.env.ANTHROPIC_API_KEY) {
  const key = process.env.ANTHROPIC_API_KEY
  const masked = key.substring(0, 10) + "..." + key.substring(key.length - 4)
  console.log("✅ ANTHROPIC_API_KEY gefunden:")
  console.log(`   ${masked}`)
  console.log(`   Länge: ${key.length} Zeichen`)

  if (!key.startsWith("sk-ant-")) {
    console.log("   ⚠️  Warnung: Key sollte mit 'sk-ant-' beginnen")
  }
} else {
  console.log("❌ ANTHROPIC_API_KEY nicht gefunden!")
  console.log("   → Überprüfe, ob der Key in .env eingetragen ist")
}

console.log("")

// Prüfe OpenAI Key
if (process.env.OPENAI_API_KEY) {
  const key = process.env.OPENAI_API_KEY
  const masked = key.substring(0, 10) + "..." + key.substring(key.length - 4)
  console.log("✅ OPENAI_API_KEY gefunden:")
  console.log(`   ${masked}`)
  console.log(`   Länge: ${key.length} Zeichen`)

  if (!key.startsWith("sk-")) {
    console.log("   ⚠️  Warnung: Key sollte mit 'sk-' beginnen")
  }
} else {
  console.log("❌ OPENAI_API_KEY nicht gefunden!")
  console.log("   → Überprüfe, ob der Key in .env eingetragen ist")
}

console.log("\n" + "=".repeat(50))

if (process.env.ANTHROPIC_API_KEY && process.env.OPENAI_API_KEY) {
  console.log("✅ Alle API-Keys korrekt geladen!")
  console.log("\nDu kannst jetzt starten:")
  console.log("  npm run rag:index   # Dokumente indizieren")
  console.log("  npm run rag:server  # Server starten")
} else {
  console.log("❌ Nicht alle Keys gefunden!")
  console.log("\nÖffne .env und stelle sicher, dass beide Keys eingetragen sind:")
  console.log("  ANTHROPIC_API_KEY=sk-ant-...")
  console.log("  OPENAI_API_KEY=sk-...")
}

console.log("=".repeat(50))

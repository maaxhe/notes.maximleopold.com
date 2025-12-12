import fs from "fs"
import path from "path"

console.log("🔍 Debug .env Datei...\n")

const envPath = path.join(process.cwd(), ".env")

try {
  const envContent = fs.readFileSync(envPath, "utf-8")
  const lines = envContent.split("\n")

  console.log(`📁 .env Datei gefunden: ${envPath}`)
  console.log(`📊 Anzahl Zeilen: ${lines.length}\n`)

  console.log("Zeilen-Analyse:")
  console.log("=" .repeat(60))

  lines.forEach((line, index) => {
    const lineNum = (index + 1).toString().padStart(3, " ")

    // Leere Zeile
    if (line.trim() === "") {
      console.log(`${lineNum} | (leer)`)
      return
    }

    // Kommentar
    if (line.trim().startsWith("#")) {
      console.log(`${lineNum} | # Kommentar`)
      return
    }

    // Key-Value Zeile
    if (line.includes("=")) {
      const [key, ...valueParts] = line.split("=")
      const value = valueParts.join("=").trim()
      const keyTrimmed = key.trim()

      // Zeige Key-Namen
      console.log(`${lineNum} | ${keyTrimmed}=...`)

      // Checks
      if (key !== keyTrimmed) {
        console.log(`     ⚠️  Leerzeichen vor dem Key!`)
      }

      if (value === "") {
        console.log(`     ❌ LEER! (kein Wert)`)
      } else if (value.startsWith('"') || value.startsWith("'")) {
        console.log(`     ⚠️  Beginnt mit Anführungszeichen (sollte nicht sein)`)
      } else if (value.startsWith(" ")) {
        console.log(`     ⚠️  Leerzeichen nach dem =`)
      } else {
        const masked = value.substring(0, 10) + "..." + value.substring(value.length - 4)
        console.log(`     ✅ Wert: ${masked} (${value.length} Zeichen)`)
      }
    } else {
      console.log(`${lineNum} | ${line}`)
      console.log(`     ⚠️  Keine gültige Key=Value Zeile`)
    }
  })

  console.log("=" .repeat(60))
  console.log("\n✅ Analyse abgeschlossen!")
  console.log("\nErwartete Format:")
  console.log("  ANTHROPIC_API_KEY=sk-ant-...")
  console.log("  OPENAI_API_KEY=sk-...")
  console.log("\n(OHNE Leerzeichen, OHNE Anführungszeichen)")

} catch (error: any) {
  console.error("❌ Fehler beim Lesen der .env Datei:", error.message)
}

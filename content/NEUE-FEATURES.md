---
title: "Neue Features - Übersicht"
---

# 🎉 Alle neuen Features für deine Bachelorarbeit

## 🆕 Feature 3: "Neu"-Badge

**Was ist das?**
Seiten, die kürzlich (innerhalb der letzten 7 Tage) bearbeitet wurden, bekommen automatisch ein auffälliges "Neu"-Badge!

**Wo sehe ich es?**
Direkt am Anfang jeder Seite, die kürzlich geändert wurde:

> 🆕 **Neu** | Vor 2 Tagen aktualisiert

**Features:**
- 🎨 Blauer Gradient-Badge (sehr auffällig!)
- ⏰ Zeigt relative Zeit ("Heute", "Gestern", "Vor 3 Tagen")
- ✨ Animierter Glow-Effekt
- 📱 Responsive auf Mobile

**Für deinen Prof:**
Dein Prof sieht sofort, welche Seiten neu sind oder aktualisiert wurden - ohne extra suchen zu müssen!

**Einstellung ändern:**
Standard: 7 Tage. Im Code anpassbar in `quartz.layout.ts`:
```typescript
Component.NewBadge({ daysThreshold: 14 }) // 14 Tage statt 7
```

---

## 📋 Feature 4: Offene Feedback-Punkte

**Was ist das?**
Eine zentrale Übersichtsseite mit **allen** Seiten, die Feedback benötigen!

**Wo finde ich es?**
Besuche: `/Offene-Punkte`

**Was zeigt es?**
- 📊 Große Zahl: Wie viele offene Punkte gibt es?
- 📝 Liste aller Seiten mit `needsFeedback: true`
- 🔴 Sortiert nach Priorität (needs-revision > review > draft)
- 💬 Zeigt deine Feedback-Notizen
- 🟡🔵🟢 Status-Badges
- 📈 Fortschritt in %
- 📅 Letztes Update-Datum

**Für deinen Prof:**
Perfekt für einen schnellen Überblick: "Was braucht noch meine Aufmerksamkeit?"

**Beispiel-Frontmatter:**
```yaml
---
title: "Kapitel 3: Methodik"
status: review
progress: 70
needsFeedback: true
feedbackNote: "Ist die Stichprobengröße ausreichend? Sollte ich mehr Probanden einschließen?"
tags:
  - bachelorarbeit
---
```

**Dann erscheint auf `/Offene-Punkte`:**

> **#1** Kapitel 3: Methodik
>
> 🔵 Review | 70% fertig | Aktualisiert: 15. Jan 2025
>
> 💬 Ist die Stichprobengröße ausreichend? Sollte ich mehr Probanden einschließen?

---

## 📊 Zusammenfassung aller Features

### Haupt-Features:
1. **📊 Dashboard** (`/BA-Dashboard`) - Übersicht aller Kapitel
2. **📅 Changelog** (`/Was-ist-neu`) - Alle Änderungen chronologisch
3. **🆕 "Neu"-Badge** - Automatisch auf kürzlich geänderten Seiten
4. **📋 Offene Punkte** (`/Offene-Punkte`) - Alle Seiten die Feedback brauchen

### Weitere Features:
5. **⚠️ Feedback-Badge** - Gelber Warning-Banner
6. **🟡🔵🟢 Status-System** - Draft/Review/Final/Approved
7. **📈 Fortschrittsbalken** - 0-100% pro Kapitel
8. **📝 Review-Status** - Zeigt Status prominent an
9. **📥 PDF-Export** - Button auf jeder Seite
10. **📚 Literaturverwaltung** - Automatisches Verzeichnis
11. **⬅️➡️ Kapitel-Navigation** - Previous/Next Buttons
12. **✨ Hypothesis.is** - Kollaboratives Annotieren
13. **🔗 Klappbare Backlinks** - Mit Toggle
14. **📑 Scrollbares TOC** - Begrenzte Höhe

---

## 🚀 Quick Start für deinen Prof

**3 Seiten die dein Prof kennen sollte:**

1. **Dashboard** (`/BA-Dashboard`)
   - Übersicht über alle Kapitel
   - Zeigt Status und Fortschritt
   - Sieht ⚠️ bei Seiten die Feedback brauchen

2. **Was ist neu?** (`/Was-ist-neu`)
   - Chronologische Liste aller Änderungen
   - Perfekt für: "Was hat sich seit letzter Woche geändert?"

3. **Offene Punkte** (`/Offene-Punkte`)
   - Alle Seiten die noch Review brauchen
   - Mit deinen Fragen/Notizen

---

## 💡 Workflow-Beispiel

### Du schreibst:
```yaml
---
title: "Kapitel 4: Ergebnisse"
chapterNumber: 4
status: draft
progress: 50
tags:
  - bachelorarbeit
---
```

### Du bist unsicher:
```yaml
status: review
progress: 80
needsFeedback: true
feedbackNote: "Ist die Interpretation der Daten korrekt?"
```

### Prof gibt Feedback:
- Besucht `/Offene-Punkte` → sieht deine Frage
- Liest Kapitel → annotiert mit Hypothesis.is
- Kommentiert via Giscus

### Du überarbeitest:
```yaml
status: needs-revision
progress: 85
needsFeedback: false  # Feedback erhalten!
```

### Fertig:
```yaml
status: final
progress: 100
```

### Prof genehmigt:
```yaml
status: approved
```

---

## 🎯 Alle Frontmatter-Optionen

```yaml
---
# Basis
title: "Dein Titel"
chapterNumber: 3           # Für Sortierung

# Status & Fortschritt
status: review             # draft/review/needs-revision/final/approved
progress: 75               # 0-100

# Feedback
needsFeedback: true
feedbackNote: "Deine spezifische Frage"

# Navigation
chapter: "Kapitel 3"
prev: "kapitel-2"
next: "kapitel-4"

# Kategorisierung
tags:
  - bachelorarbeit         # WICHTIG für Dashboard

# Literatur
bibliography:
  - author: "Autor"
    year: "2024"
    title: "Titel"
    journal: "Journal"
    url: "https://..."
---
```

---

Viel Erfolg! 🎓

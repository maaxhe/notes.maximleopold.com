---
title: Dashboard BA
tags: [ba, dashboard]
modified: 2026-06-14
---

# 🎓 Bachelorarbeit — Dashboard

**Abgabe:** → Kalender checken
**Status-Legende:** 🟡 Entwurf · 🔵 Review · 🟠 Überarbeitung nötig · 🟢 Final · ✅ Genehmigt

---

## 📊 Kapitelstatus

> [!warning] Dataview Query Not Available
> This note contains a Dataview query that cannot be rendered in the static site.
>
> ```
> TABLE WITHOUT ID
  file.link AS "Kapitel",
  choice(status = "draft", "🟡 Entwurf",
    choice(status = "review", "🔵 Review",
      choice(status = "needs-revision", "🟠 Überarbeitung",
        choice(status = "final", "🟢 Final", "✅ Genehmigt")
      )
    )
  ) AS "Status",
  choice(needsFeedback = true, "⚠️ Feedback nötig", "") AS "Feedback",
  progress + "%" AS "Fortschritt"
FROM "Bachelorarbeit/4. Schreiben"
WHERE chapterNumber
SORT chapterNumber ASC
> ```

---

## ✅ Offene Tasks (alle BA-Dateien)

> [!warning] Dataview Query Not Available
> This note contains a Dataview query that cannot be rendered in the static site.
>
> ```
> TASK
FROM "Bachelorarbeit"
WHERE !completed
SORT file.name ASC
> ```

---

## 🕐 Zuletzt bearbeitet

> [!warning] Dataview Query Not Available
> This note contains a Dataview query that cannot be rendered in the static site.
>
> ```
> LIST file.mtime
FROM "Bachelorarbeit/4. Schreiben"
WHERE chapterNumber
SORT file.mtime DESC
LIMIT 5
> ```

---

## ⚠️ Brauchen Feedback

> [!warning] Dataview Query Not Available
> This note contains a Dataview query that cannot be rendered in the static site.
>
> ```
> LIST
FROM "Bachelorarbeit/4. Schreiben"
WHERE needsFeedback = true
> ```

---

## Notizen & Scrapbook

→ [[To-Do's Bachelorarbeit]] · [[0.1 Outline Bachelorarbeit]]

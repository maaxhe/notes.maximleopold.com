---
title: "Neue Kollaborations-Features für die Bachelorarbeit"
status: draft
progress: 100
chapter: "Einführung"
next: "Deine-nächste-Seite"
prev: "Vorherige-Seite"
tags:
  - anleitung
  - features
bibliography:
  - author: "Müller, M. & Schmidt, K."
    year: "2023"
    title: "Effektive Zusammenarbeit in wissenschaftlichen Arbeiten"
    journal: "Journal of Academic Collaboration"
    url: "https://example.com/paper"
  - author: "Weber, T."
    year: "2024"
    title: "Digitale Tools für Forschungsarbeiten"
    journal: "Digital Research Methods"
---

# Neue Kollaborations-Features

Diese Seite zeigt alle neuen Features, die für die Zusammenarbeit an deiner Bachelorarbeit implementiert wurden.

## 1. 📝 Git-Historie / Letzte Änderungen

**Automatisch aktiv!** Über jedem Artikel siehst du jetzt:
- Das letzte Änderungsdatum
- Wie lange die letzte Änderung her ist (z.B. "vor 2 Tagen")
- Wortanzahl des Dokuments

Das hilft deinem Prof sofort zu sehen, was neu ist!

## 2. 🟡 Review-Status

Im Frontmatter kannst du den Status deiner Seite angeben:

```yaml
---
status: draft        # Optionen: draft, review, needs-revision, final, approved
progress: 75         # Optional: Fortschritt in Prozent (0-100)
---
```

Das zeigt dann einen farbigen Badge an:
- 🟡 **Draft** - Entwurf
- 🔵 **Review** - In Begutachtung
- 🟠 **Needs-Revision** - Überarbeitung nötig
- 🟢 **Final** - Fertig
- ✅ **Approved** - Genehmigt

## 3. 📥 PDF-Export

**Automatisch aktiv!** Oben auf jeder Seite gibt es jetzt einen "Als PDF exportieren" Button.
- Klicke den Button
- Wähle "Als PDF speichern" im Druckdialog
- Fertig!

Das Layout ist optimiert für den Druck (keine Navigation, saubere Formatierung).

## 4. 📚 Literaturverwaltung

Füge im Frontmatter deine Quellen hinzu:

**Einfache Variante:**
```yaml
---
sources:
  - "Müller (2023): Titel des Papers"
  - "Schmidt (2024): Anderes Paper"
---
```

**Ausführliche Variante:**
```yaml
---
bibliography:
  - author: "Müller, M."
    year: "2023"
    title: "Vollständiger Titel"
    journal: "Journal Name"
    url: "https://link-zur-quelle.com"
---
```

## 5. ⬅️➡️ Kapitel-Navigation

Verlinke deine Kapitel im Frontmatter:

```yaml
---
chapter: "Kapitel 1: Einleitung"
prev: "vorheriges-kapitel"  # Slug der vorherigen Seite
next: "nächstes-kapitel"    # Slug der nächsten Seite
---
```

Am Ende jeder Seite erscheinen dann "Vorherige Seite" und "Nächste Seite" Buttons!

## 6. ✨ Highlight & Annotation System (Hypothesis)

**Das coolste Feature!** 🎉

### Wie es funktioniert:

1. **Text markieren**: Wähle einfach Text auf der Seite aus
2. **Annotate-Button klickt sich**: Es erscheint ein Highlight/Annotate-Popup
3. **Highlight oder Kommentieren**:
   - **Highlight**: Gelbe Markierung (nur für dich sichtbar, wenn nicht öffentlich)
   - **Annotate**: Kommentar hinzufügen (kann öffentlich oder privat sein)

### Für deinen Prof:

Dein Professor kann:
- ✏️ Text markieren und Kommentare hinterlassen
- 💬 Auf deine Kommentare antworten
- 🔍 Alle Annotationen in der Sidebar sehen
- 🌐 Öffentliche oder private Annotationen erstellen

### So startet ihr:

1. **Hypothesis Account erstellen** (kostenlos): https://hypothes.is/signup
2. Auf deiner Seite auf Text klicken → Annotate
3. Account verbinden
4. **Fertig!** Alle Highlights und Kommentare sind persistent und für alle sichtbar (wenn öffentlich)

### Tipps:

- **Öffentliche Annotationen**: Sichtbar für alle mit dem Link
- **Private Annotationen**: Nur für dich sichtbar
- **Gruppen**: Ihr könnt eine Hypothesis-Gruppe erstellen, dann sind Annotationen nur für Gruppenmitglieder sichtbar

## Beispiel für eine vollständige Frontmatter-Konfiguration:

```yaml
---
title: "Mein Kapitel"
status: review
progress: 85
chapter: "Kapitel 3: Methodik"
prev: "kapitel-2-theorie"
next: "kapitel-4-ergebnisse"
tags:
  - bachelorarbeit
  - methodik
bibliography:
  - author: "Meyer, A."
    year: "2023"
    title: "Forschungsmethoden"
    journal: "Methods Journal"
    url: "https://example.com"
  - author: "Schulz, B."
    year: "2024"
    title: "Qualitative Analyse"
---
```

## Workflow-Vorschlag:

1. **Du schreibst** ein Kapitel → Status: `draft`
2. **Du fertiggestellt** → Status: `review`
3. **Prof liest** und macht Hypothesis-Annotationen mit Feedback
4. **Prof sagt Bescheid** → Du siehst die Annotationen
5. **Du überarbeitest** → Status: `needs-revision`
6. **Fertig** → Status: `final`
7. **Prof genehmigt** → Status: `approved`

Viel Erfolg bei deiner Bachelorarbeit! 🎓

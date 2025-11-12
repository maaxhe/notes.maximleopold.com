# Dashboard Styling Example

## DataviewJS Wrapper-Beispiel (NUR Optik, KEINE Logik-Änderung)

Dieses Beispiel zeigt, wie du deine **bestehende** DataviewJS-Logik mit den neuen CSS-Klassen umhüllst.

### ✅ Installation

**Obsidian:**

1. Aktiviere `dashboard-theme.css` in Settings → Appearance → CSS Snippets

**Quartz:**

1. `dashboard.scss` liegt bereits in `quartz/styles/`
2. Quartz kompiliert es automatisch beim Build

---

## 📦 Beispiel: KPI-Karten

### Vorher (ohne Styling)

```dataviewjs
const pages = dv.pages('"Bachelorarbeit"');
const total = pages.length;
const final = pages.where(p => p.status === "final").length;

dv.paragraph(`**Total Pages:** ${total}`);
dv.paragraph(`**Final:** ${final}`);
```

### Nachher (mit Styling - NUR Wrapper hinzugefügt)

```dataviewjs
// ─── LOGIK BLEIBT GLEICH ───
const pages = dv.pages('"Bachelorarbeit"');
const total = pages.length;
const final = pages.where(p => p.status === "final").length;

// ─── NUR AUSGABE MIT KLASSEN WRAPPEN ───
dv.paragraph(`
<div class="ba-dash">
  <div class="ba-cards">
    <!-- KPI-Karte 1 -->
    <div class="ba-card">
      <div class="ba-card__head">Total Pages</div>
      <div class="ba-card__body">${total}</div>
      <div class="ba-card__foot">Alle Seiten im Projekt</div>
    </div>

    <!-- KPI-Karte 2 -->
    <div class="ba-card">
      <div class="ba-card__head">Fertige Seiten</div>
      <div class="ba-card__body">${final}</div>
      <div class="ba-card__foot">${((final/total)*100).toFixed(0)}% abgeschlossen</div>
    </div>
  </div>
</div>
`);
```

---

## 🎯 Beispiel: Status-Badges

### Status-Mapping-Helper (einmal definieren, dann wiederverwenden)

```js
// ─── Helper-Funktion: Status → CSS-Klasse ───
function statusBadge(status) {
  const map = {
    draft: "is-draft",
    in_review: "is-review",
    needs_revision: "is-needsrev",
    final: "is-final",
    approved: "is-approved",
  }
  const cls = map[status] || "is-draft"
  const label = status?.replace("_", " ") || "draft"
  return `<span class="ba-badge ${cls}">${label}</span>`
}
```

### Verwendung

```dataviewjs
const pages = dv.pages('"Bachelorarbeit"');

// ─── Helper einbinden (siehe oben) ───
function statusBadge(status) { /* ... */ }

// ─── Ausgabe mit Badges ───
dv.paragraph(`
<div class="ba-dash">
  <div class="ba-cards">
    ${pages.map(p => `
      <div class="ba-card">
        <div class="ba-card__head">${p.file.name}</div>
        <div class="ba-card__body">${statusBadge(p.status)}</div>
        <div class="ba-card__foot">Zuletzt: ${p.file.mtime.toFormat('dd.MM.yyyy')}</div>
      </div>
    `).join('')}
  </div>
</div>
`);
```

---

## 📊 Beispiel: Progress Bar

### Vorher

```dataviewjs
const total = 50;
const done = 37;
const pct = ((done/total)*100).toFixed(0);
dv.paragraph(`Progress: ${pct}%`);
```

### Nachher

```dataviewjs
// ─── LOGIK BLEIBT ───
const total = 50;
const done = 37;
const progress = done / total; // 0.0 - 1.0 für CSS-Variable

// ─── NUR AUSGABE MIT PROGRESS-BAR ───
dv.paragraph(`
<div class="ba-dash">
  <div class="ba-card">
    <div class="ba-card__head">Projektfortschritt</div>
    <div class="ba-progress">
      <div class="ba-progress__track">
        <div class="ba-progress__bar" style="--value: ${progress}"></div>
      </div>
      <div class="ba-progress__label">${(progress * 100).toFixed(0)}%</div>
    </div>
    <div class="ba-card__foot">${done} von ${total} Aufgaben erledigt</div>
  </div>
</div>
`);
```

**Wichtig:** Die CSS-Variable `--value` muss ein Wert zwischen 0.0 und 1.0 sein (z.B. 0.73 für 73%).

---

## 📋 Beispiel: Tabelle

### Vorher

```dataviewjs
dv.table(
  ["Datei", "Status", "Wörter"],
  dv.pages('"Bachelorarbeit"')
    .map(p => [p.file.name, p.status, p.words])
);
```

### Nachher (mit Table-Skin)

```dataviewjs
const pages = dv.pages('"Bachelorarbeit"');

// ─── Helper für Badges ───
function statusBadge(status) {
  const map = {
    draft: 'is-draft',
    in_review: 'is-review',
    needs_revision: 'is-needsrev',
    final: 'is-final',
    approved: 'is-approved'
  };
  const cls = map[status] || 'is-draft';
  const label = status?.replace('_', ' ') || 'draft';
  return `<span class="ba-badge ${cls}">${label}</span>`;
}

// ─── Ausgabe mit styled Table ───
dv.paragraph(`
<div class="ba-dash">
  <table class="ba-table">
    <thead>
      <tr>
        <th>Datei</th>
        <th>Status</th>
        <th>Wörter</th>
      </tr>
    </thead>
    <tbody>
      ${pages.map(p => `
        <tr>
          <td>${p.file.name}</td>
          <td>${statusBadge(p.status)}</td>
          <td>${p.words || 0}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</div>
`);
```

---

## 🎨 Farben anpassen

Alle Farben sind als CSS-Variablen definiert. Um die Palette zu ändern, überschreibe die Variablen:

### Obsidian

Erstelle `.obsidian/snippets/dashboard-custom-colors.css`:

```css
:root {
  --ba-brand: #ff6b6b; /* Deine Primärfarbe */
  --ba-accent: #4ecdc4; /* Deine Akzentfarbe */
  --ba-success: #95e1d3; /* etc. */
}
```

### Quartz

In `quartz/styles/custom.scss`:

```scss
:root {
  --ba-brand: #ff6b6b;
  --ba-accent: #4ecdc4;
  --ba-success: #95e1d3;
}
```

---

## 🔧 Utility-Klassen

```html
<!-- Kompaktere Karte -->
<div class="ba-card is-compact">...</div>

<!-- Großzügigere Karte -->
<div class="ba-card is-spacious">...</div>
```

---

## ✅ Checkliste

- [ ] Obsidian CSS-Snippet aktiviert
- [ ] Quartz neu gebaut (`npm run build`)
- [ ] Bestehende DataviewJS-Blöcke mit `<div class="ba-dash">` umhüllt
- [ ] KPI-Werte in `.ba-card` Struktur
- [ ] Status-Strings durch `statusBadge()` Helper gemappt
- [ ] Progress-Werte als `--value: 0.XX` an `.ba-progress__bar`
- [ ] Tabellen mit `class="ba-table"`

---

## 🚨 Wichtig

**NUR die Ausgabe wrappen, NIE die Logik ändern!**

```js
// ✅ GUT
const result = myComplexCalculation()
dv.paragraph(`<div class="ba-card">${result}</div>`)

// ❌ SCHLECHT - Logik verändert
const result = `<div class="ba-card">${myComplexCalculation()}</div>`
```

Die Berechnungen, Filter, Mappings etc. bleiben **exakt wie sie sind**. Nur das HTML-Template drum herum wird ergänzt.

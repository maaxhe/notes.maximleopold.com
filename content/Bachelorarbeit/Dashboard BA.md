# 📊 Bachelorarbeit Dashboard

```dataviewjs
// ─────────────────────────────────────────────────────────────────
// KPI-Berechnung (Logik bleibt gleich)
// ─────────────────────────────────────────────────────────────────
const pages = dv.pages('"Bachelorarbeit"').where(p => p.status);
const total = pages.length;

const draft = pages.where(p => p.status === "draft").length;
const review = pages.where(p => p.status === "review").length;
const needsRev = pages.where(p => p.status === "needs-revision").length;
const final = pages.where(p => p.status === "final").length;
const approved = pages.where(p => p.status === "approved").length;

// ─────────────────────────────────────────────────────────────────
// HTML-Ausgabe mit Styling
// ─────────────────────────────────────────────────────────────────
dv.paragraph(`
<div class="ba-dash">
  <div class="ba-cards">
    <!-- 1. Gesamte Seiten -->
    <div class="ba-card is-compact">
      <div class="ba-card__head">Gesamte Seiten</div>
      <div class="ba-card__body">${total}</div>
      <div class="ba-card__foot">Alle Seiten mit Status</div>
    </div>

    <!-- 2. Draft -->
    <div class="ba-card is-compact">
      <div class="ba-card__head">🟡 Draft</div>
      <div class="ba-card__body">${draft}</div>
      <div class="ba-card__foot">${total > 0 ? ((draft/total)*100).toFixed(0) : 0}% im Entwurf</div>
    </div>

    <!-- 3. Review -->
    <div class="ba-card is-compact">
      <div class="ba-card__head">🔵 Review</div>
      <div class="ba-card__body">${review}</div>
      <div class="ba-card__foot">${total > 0 ? ((review/total)*100).toFixed(0) : 0}% in Review</div>
    </div>

    <!-- 4. Überarbeitung -->
    <div class="ba-card is-compact">
      <div class="ba-card__head">🟠 Überarbeitung</div>
      <div class="ba-card__body">${needsRev}</div>
      <div class="ba-card__foot">${total > 0 ? ((needsRev/total)*100).toFixed(0) : 0}% zu überarbeiten</div>
    </div>

    <!-- 5. Final -->
    <div class="ba-card is-compact">
      <div class="ba-card__head">🟢 Final</div>
      <div class="ba-card__body">${final}</div>
      <div class="ba-card__foot">${total > 0 ? ((final/total)*100).toFixed(0) : 0}% fertig</div>
    </div>

    <!-- 6. Genehmigt -->
    <div class="ba-card is-compact">
      <div class="ba-card__head">✅ Genehmigt</div>
      <div class="ba-card__body">${approved}</div>
      <div class="ba-card__foot">${total > 0 ? ((approved/total)*100).toFixed(0) : 0}% genehmigt</div>
    </div>
  </div>
</div>
`);
```

---

## Status-Legende

So werden die Seiten markiert:
- draft (🟡 Entwurf)
- review (🔵 Review)
- needs-revision (🟠 Überarbeitung)
- final (🟢 Final)
- approved (✅ Genehmigt)

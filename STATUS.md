# Project Status

Living file. Update this whenever tasks change state.

**Last updated:** 2026-05-02

---

## Current Focus

_Last session: 2026-05-02_

### What was done
- [chapters/04_results.tex] — Full rewrite from vault: added PBelt as new §4.4.2 (subsection between A4/A5 and PSL); added A4/A5 gateway sentence to Area 45 in §4.5.4; added Appendix A2 reference sentence to §4.6; updated cross-references (PSL→4.4.3, STV→4.4.4)
- [chapters/05_discussion.tex] — Full rewrite from vault: updated cross-references for PSL (4.4.2→4.4.3) and STV (4.4.3→4.4.4) to match new results numbering
- [chapters/09_abbreviations.tex] — Rewritten from vault (no content changes)
- [chapters/10_appendix.tex] — Rewritten: updated dagger cross-references PSL S4.4.2→S4.4.3, STV S4.4.3→S4.4.4
- [chapters/11_declaration.tex] — Rewritten from vault (no content changes)
- [compile] — Full pipeline: pdflatex → biber → pdflatex × 2; clean compile 63 pages, no errors; PDF synced to iCloud vault

### What's next (top priorities)
- [ ] Write 5.5 Predictive Modelling prose — agreed scope: 3 paragraphs (what-stream result, where-stream honest accounting, noise filtering); right lateralization brief + hedged
- [ ] Fix Soyuhos year: text cites 2022 in §1.1 and §3.3.6, references has 2023 — update wikilinks to [[Soyuhos, O., & Baldauf, D. (2023)]]
- [ ] 5.3.2 gap: add lateralization argument (bilateral IFJa → left-lateralized Broca system; Hickok & Poeppel 2007)
- [ ] Complete 5.6.1 Limitations prose (headers exist, prose missing)
- [ ] Complete 5.6.2 Future Directions prose (headers exist, prose missing)
- [ ] Abstract (write last)
- [ ] Language sweep: "control/drives/directs" → hedged fMRI language across all sections
- [ ] Insert 4 uncited references (Wu-Minn 2018 → §3.1.1; Romanski 1999 → §2.0; Griffiths 1998 → §2.2.1; Veniero 2021 → §5.6.2)

### Blockers / open questions
- Soyuhos PPA/FFA paper (Human Brain Mapping) — not yet in Zotero; needed for Methods methodological precedent
- Glasser et al. (2016) SUPPL offline LANGUAGE-STORY scores — not yet checked (5.5 todo)
- No git repository in /Developer/Bachelorarbeit — git push step skipped; PDF only synced via iCloud

### Uncited references that need to be placed
- Wu-Minn HCP Consortium (2018) → §3.1.1: cite when introducing the HCP S1200 dataset
- Romanski et al. (1999) → §2.0: cite alongside Romanski (2004); the 1999 paper is the anatomical dual-stream tracing study
- Griffiths et al. (1998) → §2.2.1: right parietal cortex and sound movement — supports right-lateralized spatial claim
- Veniero et al. (2021) → §5.6.2: FEF oscillatory top-down control — precedent for MEG future directions

### Blockers / open questions
- Soyuhos PPA/FFA paper (Human Brain Mapping) — not yet in Zotero; needed for Methods methodological precedent
- Offline/online tasks paper — title still not found; needed for Methods
- Glasser et al. (2016) SUPPL offline LANGUAGE-STORY scores — not yet checked (5.5 todo)

---

## Open Tasks

_Add tasks here as they come up. Include context so the next session can pick up without re-discovery._

---

## Completed Tasks

| Date | Task | Notes |
|------|------|-------|
| 2026-03-23 | Created WORKSPACE_OVERVIEW.md, AGENTS.md, STATUS.md | Initial agent orientation files |
| 2026-05-01 | 5.2.1 polish | MST sentence merged, summary sentence added |
| 2026-05-01 | 5.3 prose | All three subsections written and polished |
| 2026-05-01 | 4.5.4 cleanup | Smoothened, terminology corrected, redundant sentence removed |
| 2026-05-02 | 5.4 STV paragraph | Frühholz stripped (pSTG = A5 territory, not STV); STV positioned as what-stream primary; grammar fix applied |
| 2026-05-02 | 5.4 LaTeX compile | Added missing intro para + bold summaries + PBelt sentence to 05_discussion.tex; clean compile 63pp |
| 2026-05-02 | Full compile pipeline | All 7 chapter .tex files rewritten from vault; PBelt added as §4.4.2; cross-refs updated throughout; clean 63pp PDF |

---

## Known Issues / Tech Debt

_Document known bugs, workarounds, or deferred improvements here._

---

## Decisions Log

_Record significant decisions so future sessions understand why things are the way they are._

| Date | Decision | Reason |
|------|----------|--------|
| 2026-05-01 | Area 44 "inferior parietal coupling for spatial processing" claim removed | Data shows PFop mean=−0.01 (negative), PF mean=0.01 (negligible) — claim not defensible |
| 2026-05-01 | Soyuhos "negative=positive edge equivalence" claim flagged as unverified | Not found in either available Soyuhos paper; PPA/FFA paper still missing |

---

## How to Use This File

- **Starting a task:** Add it under "Current Focus" with a brief description of the goal and which files are involved.
- **Finishing a task:** Move it to "Completed Tasks" with the date.
- **Discovering new work:** Add it to "Open Tasks" with enough context to pick it up cold.
- **Hitting a blocker:** Note it under the task so the next session knows where things stopped.

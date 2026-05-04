# Project Status

Living file. Update this whenever tasks change state.

**Last updated:** 2026-05-04

---

## Current Focus

_Last session: 2026-05-04_

### What was done
- [compile] — Full vault-to-LaTeX compile pipeline completed: all 7 chapter .tex files (01–05, 09, 10) rewritten from vault sources; three-pass pdflatex+biber compile produced clean 75-page PDF; PDF synced to iCloud Bachelorarbeit vault folder
- [chapters/04_results.tex] — Added beh_acc_all_neg + beh_acc_all_pos figures as LH+RH side-by-side pair alongside existing beh_acc_all_bar (triple figure group)
- [chapters/05_discussion.tex] — Rewritten from vault 5.1–5.4 (with 5.5 Predictive Modelling and 5.6 Limitations as stubs); N&S exclusion rule applied throughout
- [chapters/09_abbreviations.tex] + [chapters/10_appendix.tex] — Rewritten from vault 9.0 and 7.0 respectively
- [vault publish] — notes.maximleopold.com pushed (including heatmap_LH, ifja_circular_LH/RH new figures)
- [chapters/03_methods.tex §3.2] — Converted all `\begin{itemize}` blocks in §3.2.2–3.2.5 to plain `\textbf{Name.}` paragraphs (no bullets); surgical edit only; clean 71pp compile

### What's next (top priorities)
- [ ] Write 5.5 Predictive Modelling prose — agreed scope: 3 paragraphs (what-stream result, where-stream honest accounting, noise filtering); right lateralization brief + hedged
- [ ] Fix Soyuhos year: text cites 2022 in §1.1 and §3.3.6, references has 2023 — update wikilinks to [[Soyuhos, O., & Baldauf, D. (2023)]]
- [ ] 5.3.2 gap: add lateralization argument (bilateral IFJa → left-lateralized Broca system; Hickok & Poeppel 2007)
- [ ] Complete 5.6.1 Limitations prose (headers exist, prose missing)
- [ ] Complete 5.6.2 Future Directions prose (headers exist, prose missing)
- [ ] Abstract (write last)
- [ ] Language sweep: "control/drives/directs" → hedged fMRI language across all sections
- [ ] Insert 4 uncited references (Wu-Minn 2018 → §3.1.1; Romanski 1999 → §2.0; Griffiths 1998 → §2.2.1; Veniero 2021 → §5.6.2)
- [ ] Vault fix: move abstract text from N&S to main body in 0.2 Abstract.md
- [ ] Vault fix: move §5.4.1–5.4.4 detailed subsections from N&S to main body in 5.4 anatomical Ambiguities.md

### 🔒 compile pipeline exception — chapters/04_results.tex
`/thesis-assistant compile` must NEVER do a full overwrite of `chapters/04_results.tex`.
It contains VS Code-level figure layout overrides (height=, keepaspectratio, subfigure/minipage structure) that cannot be expressed in Markdown.

**Rule:** For text/prose changes from vault 4.x files → apply as targeted surgical edits to the existing `04_results.tex`, leaving all figure environments, sizing, and layout untouched.
All other chapter files (01, 02, 03, 05, 09, 10) continue to full-overwrite from vault as normal.

### VS Code formatting overrides (DO NOT overwrite on next compile)
These were edited directly in VS Code and must be preserved manually after any vault→LaTeX compile:
- **main.tex line 41**: `\captionsetup{font=small}` — global small captions (safe, in main.tex, survives compile)
- **04_results.tex Fig 4.4** (brain_LH/RH_fef_ifja, lines 48/50): `height=5.5cm, keepaspectratio` — do NOT revert to `width=0.48\textwidth`
- **04_results.tex Fig 4.10** (fef_55b_brain_LH/RH, lines 177/179): `height=5.5cm, keepaspectratio` — same rule
- **04_results.tex §4.6 beh_acc_all figure** (lines 222–242): stacked layout — neg + bar-on-right, then pos + bar-on-right; bars at `height=2.8cm` with `\raisebox{0.4cm}`, gap `\hspace{0.004\textwidth}`, subfigures at `0.80\textwidth`, bar minipage at `0.07\textwidth`
- All circular/heatmap figure pairs: `width=0.48\textwidth` — do not change
- VS Code outDir set to `%DIR%` (project root); all vault PDF names are symlinks to `main.pdf`
- **.vscode/settings.json**: `autoClean.run: "never"`; clean list = `.blg .fls .log .fdb_latexmk .out .idx .ind` only — `.toc .lof .lot .aux .bbl` must stay for ToC to work

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
| 2026-05-03 | 02_background.tex cleanup | Removed 7 stale TODO comments; all BibTeX keys verified valid; clean recompile 63pp |
| 2026-05-03 | Figure format fix + full compile | Converted 4 .tif → .png; fixed all 14 wrong figure filenames in 04_results.tex; clean 79pp compile |
| 2026-05-03 | Full vault-to-LaTeX pipeline (session 2) | All 7 chapter .tex files rewritten from vault; beh_acc_all_neg/pos triple-figure group added; 75pp clean compile; PDF synced to iCloud |
| 2026-05-04 | 03_methods.tex §3.2 bullet→paragraph conversion | All 6 itemize blocks in §3.2.2–3.2.5 converted to plain \textbf{Name.} paragraphs; surgical edit; clean 71pp compile |

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

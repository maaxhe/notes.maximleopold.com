---
modified: 2026-05-31
---

# Agent Notes

Start with `WORKSPACE_OVERVIEW.md`. Read before you write anything.

This is a personal digital garden: Obsidian notes published via Quartz 4 at notes.maximleopold.com. There is a RAG search system, a vault sync pipeline, and a self-hosted deployment setup.

---

## Reading Order

For any non-trivial task, read these files first:

1. `WORKSPACE_OVERVIEW.md` — project structure and key areas
2. `AGENTS.md` — this file, rules and task-specific reading paths
3. `STATUS.md` — open tasks and current in-progress work
4. `SKILLS.md` — repeatable procedures for common tasks

To see the current note structure, run `ls content/` — it changes as notes are added so do not rely on a static snapshot. The stable top-level folders are:

```
content/
├── Bachelorarbeit/
│   ├── 1. Streams and related/
│   ├── 2. Glasser areas/
│   ├── 3. Other areas/
│   ├── 4. Schreiben/        # writing drafts
│   ├── 5. Sources/
│   ├── 6. Further related/
│   └── 7. Meeting Notes/
├── a Literatur-Notizen/     # literature notes
│   ├── Bilder/
│   └── PDFs/
└── Dopamin/                 # standalone topic notes
```

Then read task-specific files depending on the work:

**Content / notes tasks:**
- `scripts/sync-from-vault.ts` — understand what gets synced and how
- `quartz.config.ts` — site configuration (plugins, locale, baseUrl)
- `quartz.layout.ts` — layout and components

**RAG / search tasks:**
- `rag/README.md` — RAG system overview
- `rag/server.ts` — API server
- `rag/index-documents.ts` — indexing pipeline

**Deployment / infrastructure tasks:**
- `DEPLOYMENT-GUIDE.md`
- `SERVER-DEPLOYMENT.md`
- `deploy-to-server.sh`
- `Dockerfile`, `railway.json`, `netlify.toml`

**Quartz customization tasks:**
- `quartz/components/` — UI components
- `quartz/plugins/` — transformers and emitters
- `quartz/styles/` — CSS

---

## Thesis Writing Tasks

Any task that involves reading, writing, or discussing the Bachelor's thesis requires this reading order **before responding or writing anything**:

### Step 0 — Read the entire Bachelorarbeit folder (always, without exception)

Before doing anything else, read **all files** in `content/Bachelorarbeit/4. Schreiben/`. The thesis is one interconnected document — any section can be relevant to any other. Do not skip files because they seem unrelated to the current task.

### Step 1 — Orientation (always)

1. `content/Bachelorarbeit/4. Schreiben/0.1 Outline Bachelorarbeit.md` — chapter structure, status, word targets
2. `content/Bachelorarbeit/4. Schreiben/0.0 Bachelorarbeit Gesamt.md` — understand how chapters are assembled

### Step 2 — Read the relevant chapter file

For any writing or question about a specific chapter or section, read that chapter file fully before responding. Chapter files live in `content/Bachelorarbeit/4. Schreiben/`. Examples:

- Question about dorsal stream → read `2.2 The Auditory Where ("Dorsal") Stream.md`
- Question about methods → read `3.0 Methods.md` + relevant sub-files
- Question about results → read `4.0 Results.md` + relevant sub-files

### Step 3 — Read relevant area notes

Before writing about a brain region, always read the corresponding note first:

- Glasser parcellation areas → `content/Bachelorarbeit/2. Glasser areas/<area>.md`
- Classical anatomical regions → `content/Bachelorarbeit/3. Other areas/<area>.md`
- Stream/network background → `content/Bachelorarbeit/1. Streams and related/<topic>.md`

### Step 4 — Read relevant source notes

Before writing a claim that cites a paper, read that paper's note in `content/Bachelorarbeit/5. Sources/`. Never fabricate citations or paraphrase from memory — always read the source note first.

Key sources to know:
- `Rolls et al. (2023) - Cerebral Cortex.md` — connectivity fingerprints, groups 1–4
- `Bedini (2023) - Brain Structure.md` — FEF vs IFJa anatomy
- `Bedini & Baldauf (2021).md` — FEF/IFJa functional dissociation
- `Hickok & Poeppel 2007 - Nature.md` — dual stream model
- `Rauschecker & Scott (2009) - Nature Neuroscience.md` — dorsal stream
- `Glasser et al. (2016) - Nature.md` — HCP parcellation
- `BA All Sources.md` — master bibliography overview

### Step 5 — Read data files if writing results

Data files are in `content/Bachelorarbeit/5. Sources/` with names starting with `Data`. Read the relevant one before writing about specific connectivity results.

### Rule: Never answer thesis questions from memory alone

If asked about the thesis content, a brain region, a paper finding, or a result — always read the relevant file first. Do not rely on training knowledge when project-specific notes exist. The notes are authoritative; general neuroscience knowledge is only a fallback when no relevant note exists.

### Rule: Never directly edit thesis chapter files — always post text in the chat

The `content/Bachelorarbeit/` files are synced from the Obsidian vault and get overwritten on every `npm run publish:quick`. Directly editing these files is therefore pointless and will cause confusion. Instead:

- **Always post written or revised text directly in the chat** so the user can copy it into Obsidian themselves.
- Never use file-editing tools (Edit, Write, Bash redirects) on files inside `content/Bachelorarbeit/`.
- This applies to all thesis writing tasks: new sections, revisions, rewrites, and corrections.

---

## Rules

### Read first, write second

Do not modify files you have not read. For any task that touches more than one file, read all relevant files before making any changes.

### Guide files vs living files

- `WORKSPACE_OVERVIEW.md` and `AGENTS.md` are guide files — change them only if the structure of the project changes.
- `STATUS.md` is a living file — update it whenever tasks are started, completed, or added.

### Content directory

- `content/` is generated by `npm run sync`. Do not manually edit notes there unless the task explicitly requires it — changes will be overwritten on the next sync.
- `static/assets/` is also managed by sync. Do not add files there manually.

### Quartz framework

- The `quartz/` directory is a framework dependency. Modify it only when the task explicitly requires customizing Quartz internals. Prefer configuring via `quartz.config.ts` and `quartz.layout.ts`.

### RAG vector store

- `rag/vector-store.json` is auto-generated. Never edit it manually. Regenerate with `npm run rag:index`.

### Deployment

- Do not push to `main` or trigger deployments unless the user explicitly requests it.
- Do not modify GitHub Actions workflows without explicit instruction.

### Task state

- When starting a task, mark it as in-progress in `STATUS.md`.
- When completing a task, mark it as done in `STATUS.md`.
- If you discover new work needed, add it to `STATUS.md` under Open Tasks.
- At the end of every session, write all unfinished or follow-up work into `STATUS.md` under Open Tasks with enough context (which files, what the goal was, where you stopped) so the next session can continue without re-discovery.
- At the start of every session, check `STATUS.md` for open tasks before asking the user what to do.

---

## npm Scripts Reference

```bash
npm run sync          # Sync content from Obsidian vault into content/
npm run dev           # sync + build + serve at localhost:8080
npm run build         # Build static site into public/
npm run check:links   # Validate internal wikilinks
npm run check:types   # TypeScript type check
npm run format        # Prettier formatting
npm run rag:index     # Re-index notes into rag/vector-store.json
npm run rag:server    # Start RAG search API server
npm run publish:quick # sync + commit + push (auto-publish shortcut)
```

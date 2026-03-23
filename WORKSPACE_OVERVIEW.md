# Workspace Overview

This is a personal notes site: **notes.maximleopold.com**

A self-hosted Obsidian Publish alternative built on [Quartz 4](https://quartz.jzhao.xyz/). Notes are written in Obsidian, synced to this repo, built into a static site, and deployed to a self-hosted server.

The purpose of this file is stable orientation. It describes structure and where to find things — not project status (see `STATUS.md` for that).

---

## Guide Files vs Living Files

Guide files are structural and change rarely:

- `WORKSPACE_OVERVIEW.md` — this file
- `AGENTS.md` — instructions for AI agents working in this repo
- `quartz.config.ts` — site-wide Quartz configuration
- `quartz.layout.ts` — layout/component configuration

Living files contain evolving content or state:

- `content/` — Markdown notes synced from the Obsidian vault
- `STATUS.md` — open tasks, in-progress work, decisions
- `rag/vector-store.json` — auto-generated RAG index (do not edit manually)
- `static/assets/` — images synced from vault

---

## Project Structure

```
.
├── content/              # Markdown notes (synced from Obsidian vault)
│   ├── Bachelorarbeit/   # Bachelor thesis notes
│   ├── a Literatur-Notizen/  # Literature notes
│   └── index.md          # Homepage
├── static/
│   └── assets/           # Images and media synced from vault
├── scripts/
│   ├── sync-from-vault.ts    # Vault -> content/ sync logic
│   ├── watch-vault.ts        # File watcher for vault changes
│   ├── add-frontmatter.ts    # Batch frontmatter tool
│   ├── update-frontmatter.cjs
│   └── check-links.mjs       # Internal link validator
├── rag/
│   ├── server.ts             # RAG API server (search endpoint)
│   ├── index-documents.ts    # Indexes content/ into vector-store.json
│   ├── vector-store.json     # Generated embeddings store
│   └── README.md             # RAG setup documentation
├── quartz/               # Quartz framework (treat as dependency, modify carefully)
├── quartz.config.ts      # Site title, baseUrl, plugins, locale
├── quartz.layout.ts      # Page layout and components
├── AGENTS.md             # AI agent instructions and reading order
├── STATUS.md             # Open tasks and current work state
└── README.md             # Full project documentation
```

---

## Key Areas

### Content Pipeline

Obsidian vault → `npm run sync` → `content/` → `npm run build` → `public/`

The sync script (`scripts/sync-from-vault.ts`) copies only whitelisted directories from the vault, strips private content, and converts Obsidian embeds.

### RAG System

The `rag/` directory contains a semantic search system:
- `npm run rag:index` — re-indexes all notes into `rag/vector-store.json`
- `npm run rag:server` — starts the search API server

### Deployment

The site deploys to a self-hosted server. See `DEPLOYMENT-GUIDE.md` and `SERVER-DEPLOYMENT.md` for server setup. The `deploy-to-server.sh` script handles production deployment.

CI/CD auto-deploys on push to `main` via GitHub Actions.

---

## Recommended Reading Order

For any non-trivial task, read in this order:

1. This file (`WORKSPACE_OVERVIEW.md`)
2. `AGENTS.md`
3. `STATUS.md`
4. `SKILLS.md`
5. Task-specific files (see `AGENTS.md` for guidance)

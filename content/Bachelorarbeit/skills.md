---
modified: 2026-05-04
---

# Skills

Repeatable procedures for common tasks in this project. Each skill documents the exact steps, relevant files, and things to watch out for.

---

## Sync & Publish Notes

**When:** User wants to push new or updated notes live.

```bash
npm run publish:quick
# = sync + git add . + commit "Auto-update notes" + push
```

If a preview first is needed:
```bash
npm run dev        # localhost:8080
# then:
npm run publish:quick
```

Watch out for:
- `content/` is overwritten on every sync — never manually edit files there
- Check `npm run check:links` if wikilinks were restructured

---

## Re-index RAG Search

**When:** New notes were added or content changed significantly.

```bash
npm run rag:index
```

This regenerates `rag/vector-store.json`. Commit it afterwards if it should be tracked:

```bash
git add rag/vector-store.json
git commit -m "Update RAG index"
```

Watch out for:
- Requires API key for embeddings — check `.env` if it fails
- Never edit `vector-store.json` manually

---

## Add or Change a Quartz Plugin

**When:** User wants to enable/disable a feature (e.g. graph view, RSS, search).

Files to read first:
1. `quartz.config.ts` — plugin list under `plugins: { transformers, filters, emitters }`
2. `quartz/plugins/` — available plugin implementations

Steps:
1. Read `quartz.config.ts`
2. Add/remove the plugin in the relevant array
3. Run `npm run build` to verify no errors
4. Run `npm run dev` to preview

---

## Change Site Layout or Components

**When:** User wants to move, add, or remove UI elements (sidebar, backlinks, table of contents, etc.).

Files to read first:
1. `quartz.layout.ts` — defines which components appear where
2. `quartz/components/` — component implementations

Steps:
1. Read `quartz.layout.ts`
2. Adjust the relevant layout section (`defaultContentPageLayout`, `defaultListPageLayout`)
3. Preview with `npm run dev`

---

## Add Custom CSS

**When:** User wants to tweak the visual design.

Files:
- `quartz/styles/custom.scss` — project-level style overrides (create if missing)
- `quartz/styles/base.scss` — Quartz base styles (read-only reference)

Steps:
1. Check if `custom.scss` exists, create it if not
2. Add overrides there — do not modify `base.scss`
3. Verify in `quartz.config.ts` that the custom stylesheet is referenced

---

## Validate Internal Links

**When:** After restructuring notes or renaming files.

```bash
npm run check:links
```

Fix broken links in the source Obsidian vault, then re-sync:
```bash
npm run sync
```

---

## Deploy to Server

**When:** User explicitly requests a production deployment.

```bash
./deploy-to-server.sh
```

Read `DEPLOYMENT-GUIDE.md` and `SERVER-DEPLOYMENT.md` before running for the first time or if something is unclear.

Do not run without explicit user confirmation — this affects the live site.

---

## Update Sync Configuration

**When:** User wants to publish a new vault folder or exclude content.

File to edit: `scripts/sync-from-vault.ts`

Key config block:
```typescript
const CONFIG = {
  VAULT_PATH: "...",
  PUBLIC_DIRS: ["/FolderToPublish"],   // whitelist
  ASSETS_DIRS: ["/FolderToPublish/Images"],
  EXCLUDE_PATTERNS: ["**/Private/**"], // blacklist
  REQUIRE_PUBLISH_FLAG: false,
}
```

After changing: run `npm run sync` and verify `content/` looks correct before building.

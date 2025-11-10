# notes.maximleopold.com

Self-hosted Obsidian Publish alternative using [Quartz 4](https://quartz.jzhao.xyz/) - A static site generator optimized for publishing digital gardens and note-taking vaults.

## 📋 Overview

This project converts an Obsidian vault into a static website with full support for:

- **Wikilinks** (`[[Note Name]]`) - Internal linking between notes
- **Backlinks** - Automatic bidirectional links
- **Graph View** - Visual network of connected notes
- **Tags** - Organized topic browsing
- **Search** - Full-text search functionality
- **Pretty URLs** - Clean, readable URLs with proper slug generation
- **Image Support** - Automatic conversion of Obsidian image embeds

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 22
- **npm** >= 10.9.2
- **Git**
- An Obsidian vault (local or cloud-synced)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/maximleopold/notes.maximleopold.com.git
   cd notes.maximleopold.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your vault path**

   Edit `scripts/sync-from-vault.ts` and update the `CONFIG` section:

   ```typescript
   const CONFIG = {
     VAULT_PATH: '/path/to/your/vault',
     PUBLIC_DIRS: ['/FolderToPublish'],
     ASSETS_DIRS: ['/FolderToPublish/Images'],
     // ...
   };
   ```

   Or set the environment variable:
   ```bash
   export VAULT_PATH="/path/to/your/vault"
   ```

4. **Run local development server**
   ```bash
   npm run dev
   ```

   This will:
   - Sync content from your vault
   - Build the site
   - Start a local server at `http://localhost:8080`

## 📁 Project Structure

```
.
├── content/              # Markdown files (synced from vault)
├── static/               # Static assets (images, etc.)
│   └── assets/          # Images and media files
├── scripts/
│   ├── sync-from-vault.ts   # Vault sync script
│   └── check-links.mjs      # Internal link validation
├── quartz/              # Quartz framework files
├── quartz.config.ts     # Main configuration
├── quartz.layout.ts     # Layout configuration
├── public/              # Generated site (git-ignored)
└── .github/workflows/   # CI/CD pipelines
```

## 🔧 Configuration

### Vault Sync Settings

Edit `scripts/sync-from-vault.ts`:

```typescript
const CONFIG = {
  // Path to your Obsidian vault
  VAULT_PATH: process.env.VAULT_PATH || '/path/to/vault',

  // Directories to publish (whitelist)
  PUBLIC_DIRS: [
    '/PublicNotes',
    '/Blog',
    '/Research',
  ],

  // Asset directories (images, PDFs, etc.)
  ASSETS_DIRS: [
    '/PublicNotes/Images',
    '/Blog/Assets',
  ],

  // Patterns to exclude (blacklist)
  EXCLUDE_PATTERNS: [
    '**/Private/**',
    '**/*.excalidraw',
    '**/Templates/**',
  ],

  // Only sync files with "publish: true" in frontmatter
  REQUIRE_PUBLISH_FLAG: false,
};
```

### Site Settings

Edit `quartz.config.ts`:

```typescript
configuration: {
  pageTitle: "Your Site Name",
  pageTitleSuffix: " | Your Tagline",
  baseUrl: "your-domain.com",
  locale: "en-US", // or "de-DE"
  // ...
}
```

## 📝 Content Management

### Publishing Notes

There are two approaches to publishing notes:

#### 1. Directory Whitelist (Default)

Only directories listed in `PUBLIC_DIRS` are published.

```typescript
PUBLIC_DIRS: ['/Blog', '/Research']
```

#### 2. Frontmatter Flag

Enable `REQUIRE_PUBLISH_FLAG: true` to only publish notes with:

```markdown
---
publish: true
title: My Note
tags: [example, tutorial]
---

# My Note Content
```

### Private Content Protection

The following are **never** published:

- Any path matching `EXCLUDE_PATTERNS`
- `.obsidian/` folder
- `*.excalidraw` files
- Directories named `Private`, `Templates`, `_archive`

### Image Handling

Obsidian image embeds are automatically converted:

```markdown
# In Obsidian:
![[image.png]]
![[folder/diagram.jpg|My Caption]]

# Converts to:
![](/assets/image.png)
![My Caption](/assets/folder/diagram.jpg)
```

### Wikilinks

Wikilinks are preserved and resolved by Quartz:

```markdown
See [[Another Note]] for details.
Links to [[Folder/Nested Note]] also work.
```

## 🛠️ Development Workflow

### Available Scripts

```bash
# Sync content from vault (doesn't build)
npm run sync

# Start development server (syncs + builds + serves)
npm run dev

# Build for production
npm run build

# Check for broken internal links
npm run check:links

# Check TypeScript types
npm run check:types

# Format code
npm run format
```

### Local Preview

```bash
npm run dev
```

Visit `http://localhost:8080` to preview your site. The dev server watches for changes and rebuilds automatically.

### Adding New Content

1. Write notes in your Obsidian vault
2. Ensure they're in a directory listed in `PUBLIC_DIRS`
3. Run `npm run sync` to copy to the project
4. The dev server will automatically rebuild

## 🚢 Deployment

This project supports deployment to **Netlify** or **Cloudflare Pages**.

### Option 1: Netlify

#### Setup

1. Create a new site on [Netlify](https://netlify.com)

2. Add environment variables in Netlify dashboard:
   - `VAULT_PATH`: Path to your vault (if using CI sync)

3. Get your deployment credentials:
   - **NETLIFY_SITE_ID**: Site settings → General → Site ID
   - **NETLIFY_AUTH_TOKEN**: User settings → Applications → Personal access tokens

4. Add secrets to GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add:
     - `NETLIFY_SITE_ID`
     - `NETLIFY_AUTH_TOKEN`
     - `VAULT_PATH` (optional, if syncing in CI)

5. Push to `main` branch to trigger deployment

#### Configuration

The `netlify.toml` file is already configured:

```toml
[build]
  command = "npm run sync && npm run build"
  publish = "public"
```

### Option 2: Cloudflare Pages

#### Setup

1. Create a new Pages project on [Cloudflare](https://pages.cloudflare.com)

2. Configure build settings:
   - **Build command**: `npm run sync && npm run build`
   - **Build output directory**: `public`
   - **Root directory**: `/`
   - **Node version**: `22`

3. Add environment variables in Cloudflare dashboard:
   - `VAULT_PATH`: Path to your vault (if needed)

4. Add secrets to GitHub:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

5. Enable the GitHub Actions workflow:
   ```bash
   # Disable Netlify workflow
   mv .github/workflows/deploy-netlify.yml .github/workflows/deploy-netlify.yml.disabled
   ```

### Custom Domain

#### Netlify

1. Go to Site settings → Domain management
2. Add custom domain: `notes.maximleopold.com`
3. Add DNS records as instructed:
   ```
   CNAME  notes  your-site.netlify.app
   ```

#### Cloudflare Pages

1. Go to Workers & Pages → your project → Custom domains
2. Add domain: `notes.maximleopold.com`
3. Update DNS records in Cloudflare dashboard:
   ```
   CNAME  notes  your-project.pages.dev
   ```

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the site
npm run sync && npm run build

# The public/ directory contains the complete static site
# Upload to any static hosting provider
```

## 🔒 Security

### Pre-commit Hooks

Husky pre-commit hooks automatically:

- Format code with Prettier
- Check for potential secrets in staged files
- Prevent committing private content

To bypass (not recommended):
```bash
git commit --no-verify
```

### CI/CD Checks

GitHub Actions automatically:

- Validates TypeScript types
- Checks code formatting
- Builds the site
- Validates internal links
- Fails build if any check fails

### Best Practices

1. **Never commit**:
   - `.env` files
   - API keys or tokens
   - Personal information
   - Content in `Private/` directories

2. **Review `.gitignore`**:
   - Ensure all sensitive patterns are listed
   - Test with `git status` before committing

3. **Use frontmatter**:
   ```markdown
   ---
   publish: true  # Only if REQUIRE_PUBLISH_FLAG is enabled
   draft: true    # Automatically excluded
   ---
   ```

## 🐛 Troubleshooting

### Build Errors

**Vault not found**:
```bash
Error: Vault path does not exist
```
→ Update `VAULT_PATH` in `scripts/sync-from-vault.ts` or environment variable

**Broken links detected**:
```bash
❌ Broken internal links found
```
→ Run `npm run check:links` to see details
→ Fix or remove broken wikilinks in your notes

**Missing dependencies**:
```bash
npm ci  # Clean install
```

### Development Issues

**Port already in use**:
```bash
# Change port in dev server or kill the process
lsof -ti:8080 | xargs kill -9
```

**Changes not reflecting**:
```bash
# Clear cache and rebuild
rm -rf .quartz-cache public
npm run dev
```

### Deployment Issues

**CI Build Failing**:
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Test build locally: `npm run sync && npm run build`

**Images not loading**:
1. Ensure images are in `ASSETS_DIRS`
2. Check image paths in markdown
3. Verify `static/assets/` directory exists

## 📚 Features in Detail

### Wikilink Resolution

Quartz automatically resolves wikilinks:

```markdown
[[Note Name]]              → /note-name
[[Folder/Note Name]]       → /folder/note-name
[[Note Name|Custom Text]]  → Custom Text → /note-name
```

### Backlinks

Every note automatically shows which other notes link to it.

### Graph View

Interactive graph visualization of note connections:
- Click nodes to navigate
- Zoom and pan
- Filter by tags

### Search

Full-text search with:
- Instant results
- Keyboard navigation
- Content preview

### Tags

Organize notes by topic:
```markdown
---
tags:
  - tutorial
  - obsidian
  - quartz
---
```

Tag pages automatically generated at `/tags/<tag-name>`.

### LaTeX Math

Supports KaTeX for mathematical notation:

```markdown
Inline: $E = mc^2$

Block:
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### Code Syntax Highlighting

Automatic highlighting for 100+ languages:

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Table of Contents

Automatic ToC generation for notes with headings.

## 🔄 Workflow Examples

### Daily Workflow: Publishing New Notes

```bash
# 1. Write notes in Obsidian as usual
# 2. When ready to publish, sync and preview:
npm run dev

# 3. Review at http://localhost:8080
# 4. Commit and push
git add .
git commit -m "Add new notes on X topic"
git push

# 5. CI automatically deploys to production
```

### Weekly Workflow: Vault Maintenance

```bash
# 1. Review what will be published
npm run sync

# 2. Check for broken links
npm run build && npm run check:links

# 3. Fix any issues in Obsidian
# 4. Re-sync and deploy
```

## 🤝 Contributing

This is a personal site, but feel free to:
- Report issues
- Suggest improvements
- Fork for your own use

## 📄 License

MIT License - Feel free to use this setup for your own notes site.

## 🙏 Acknowledgments

- [Quartz 4](https://quartz.jzhao.xyz/) by [@jackyzha0](https://github.com/jackyzha0)
- [Obsidian](https://obsidian.md/)
- Inspired by the digital garden movement

---

## 📖 Additional Resources

- [Quartz Documentation](https://quartz.jzhao.xyz/)
- [Obsidian Help](https://help.obsidian.md/)
- [Digital Garden Principles](https://maggieappleton.com/garden-history)

## 🔗 Links

- **Live Site**: [https://notes.maximleopold.com](https://notes.maximleopold.com)
- **Repository**: [https://github.com/maximleopold/notes.maximleopold.com](https://github.com/maximleopold/notes.maximleopold.com)
- **Issues**: [Report a problem](https://github.com/maximleopold/notes.maximleopold.com/issues)

---

**Last Updated**: 2024-11-10

**Status**: ✅ Production Ready

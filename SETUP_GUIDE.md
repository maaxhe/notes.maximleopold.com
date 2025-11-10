# Quick Setup Guide

This document provides a step-by-step guide to get your Obsidian → Quartz site up and running.

## ✅ Initial Setup Checklist

### 1. Configure Vault Path

Update `scripts/sync-from-vault.ts` with your specific paths:

```typescript
const CONFIG = {
  VAULT_PATH:
    "/Users/maxmacbookpro/Library/Mobile Documents/iCloud~md~obsidian/Documents/Brain online",

  PUBLIC_DIRS: [
    "/Bachelorarbeit", // Your public directories
  ],

  ASSETS_DIRS: [
    "/Bachelorarbeit/BA_Bilder", // Your image directories
  ],

  EXCLUDE_PATTERNS: ["**/Private/**", "**/*.excalidraw", "**/Templates/**"],
}
```

### 2. Test Local Build

```bash
# Sync content from your vault
npm run sync

# Build and start dev server
npm run dev
```

Visit http://localhost:8080 to preview your site.

### 3. Customize Site Settings

Edit `quartz.config.ts`:

```typescript
configuration: {
  pageTitle: "Maxim Leopold's Notes",  // Change this
  pageTitleSuffix: " | Brain Online",  // And this
  baseUrl: "notes.maximleopold.com",   // Your domain
  locale: "de-DE",                      // Your language
}
```

### 4. GitHub Repository Setup

```bash
# Create GitHub repository at github.com/new
# Name it: notes.maximleopold.com

# Add remote and push
git remote add origin https://github.com/maximleopold/notes.maximleopold.com.git
git branch -M main
git add -A
git commit -m "Initial Quartz setup with Obsidian sync"
git push -u origin main
```

### 5. Netlify Deployment Setup

1. **Create Netlify Account**: Sign up at https://netlify.com

2. **Create New Site**:
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Build settings are already configured in `netlify.toml`

3. **Get Deployment Credentials**:
   - **Site ID**: Site settings → General → Site details → Site ID
   - **Auth Token**: User settings → Applications → Personal access tokens → New access token

4. **Add GitHub Secrets**:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add New repository secret:
     - Name: `NETLIFY_SITE_ID`, Value: (your site ID)
     - Name: `NETLIFY_AUTH_TOKEN`, Value: (your auth token)
     - Name: `VAULT_PATH` (optional if syncing in CI): (your vault path)

5. **Configure Custom Domain** (Optional):
   - Netlify dashboard → Domain settings → Add custom domain
   - Update DNS records as instructed

### 6. Alternative: Cloudflare Pages Deployment

If you prefer Cloudflare Pages over Netlify:

1. **Disable Netlify Workflow**:

   ```bash
   mv .github/workflows/deploy-netlify.yml .github/workflows/deploy-netlify.yml.disabled
   ```

2. **Create Cloudflare Pages Project**:
   - Go to https://pages.cloudflare.com
   - Create new project from GitHub
   - Build settings:
     - Build command: `npm run sync && npm run build`
     - Build output: `public`
     - Node version: `22`

3. **Add GitHub Secrets**:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

## 🔄 Daily Workflow

### Publishing New Notes

1. **Write in Obsidian** as usual in your whitelisted directories

2. **Preview locally**:

   ```bash
   npm run dev
   ```

3. **Commit and push**:

   ```bash
   git add .
   git commit -m "Add notes on [topic]"
   git push
   ```

4. **Automatic deployment**: GitHub Actions will build and deploy to Netlify/Cloudflare

### Quick Commands

```bash
# Sync content only (no build)
npm run sync

# Local development (sync + build + serve)
npm run dev

# Production build
npm run build

# Check for broken links
npm run check:links

# Format code
npm run format

# Type checking
npm run check:types
```

## 🎨 Customization

### Changing Theme Colors

Edit `quartz.config.ts`:

```typescript
theme: {
  colors: {
    lightMode: {
      light: "#faf8f8",
      lightgray: "#e5e5e5",
      gray: "#b8b8b8",
      darkgray: "#4e4e4e",
      dark: "#2b2b2b",
      secondary: "#284b63",
      tertiary: "#84a59d",
      highlight: "rgba(143, 159, 169, 0.15)",
    },
    // darkMode colors...
  }
}
```

### Adding Custom CSS

Create `quartz/styles/custom.scss` and add your styles.

### Modifying Layout

Edit `quartz.layout.ts` to change component arrangement:

```typescript
export const defaultContentPageLayout: ContentLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}
```

## 🔒 Security Best Practices

### Pre-commit Hooks

Husky automatically runs checks before each commit:

- Formats code
- Checks for potential secrets
- Prevents committing private content

### Manual Secret Check

Before committing, review staged files:

```bash
git diff --cached | grep -i "password\|secret\|token\|api"
```

### Testing Private Content Exclusion

```bash
# Sync and verify no private content
npm run sync
ls -R content/  # Should not show any Private/ directories
```

## 🐛 Common Issues & Solutions

### Issue: Vault not found

```bash
Error: Vault path does not exist
```

**Solution**: Update `VAULT_PATH` in `scripts/sync-from-vault.ts`

### Issue: Build fails with "Cannot find module"

```bash
npm ci          # Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: Images not loading

**Solution**:

1. Check images are in `ASSETS_DIRS`
2. Ensure paths use forward slashes
3. Run `npm run sync` again

### Issue: Broken wikilinks

**Solution**:

- Broken wikilinks to non-existent pages are normal in digital gardens
- They will be automatically created when you add those notes
- Use `npm run check:links` to review

### Issue: Changes not showing in dev server

```bash
# Clear cache and rebuild
rm -rf .quartz-cache public
npm run dev
```

## 📊 Monitoring & Analytics

### Adding Plausible Analytics

1. Sign up at https://plausible.io
2. Add your domain
3. Update `quartz.config.ts`:
   ```typescript
   analytics: {
     provider: "plausible",
   }
   ```

### Adding Google Analytics

```typescript
analytics: {
  provider: "google",
  tagId: "G-XXXXXXXXXX"
}
```

## 🚀 Performance Tips

### Optimize Build Time

1. **Disable OG Image Generation** (for faster builds):

   ```typescript
   // In quartz.config.ts, comment out:
   // Plugin.CustomOgImages(),
   ```

2. **Reduce Content Size**:
   - Only publish necessary directories
   - Compress large images before adding to vault

### CDN Optimization

Netlify/Cloudflare automatically provide:

- Global CDN
- Automatic SSL
- Compression (gzip/brotli)
- Image optimization

## 📱 Mobile Editing

To edit and publish from mobile:

1. **Use Obsidian Mobile** with iCloud/Dropbox sync
2. **Git-based workflow**:
   - Install Working Copy (iOS) or Termux (Android)
   - Clone repository
   - Edit in Obsidian
   - Commit and push from git client

## 🆘 Getting Help

- **Documentation**: https://quartz.jzhao.xyz/
- **Issues**: https://github.com/maximleopold/notes.maximleopold.com/issues
- **Quartz Discord**: https://discord.gg/cRFFHYye7t

## ✨ Next Steps

1. ✅ Complete initial setup
2. ✅ Test local build
3. ✅ Deploy to Netlify/Cloudflare
4. ✅ Configure custom domain
5. 🔄 Start publishing notes!
6. 📊 Add analytics (optional)
7. 🎨 Customize theme (optional)

---

**Congratulations!** Your self-hosted Obsidian Publish is ready. Start writing and watch your digital garden grow! 🌱

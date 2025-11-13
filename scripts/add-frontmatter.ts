#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Repository } from '@napi-rs/simple-git';
import { globby } from 'globby';

interface FrontmatterData {
  title?: string;
  created?: string;
  modified?: string;
  [key: string]: any;
}

async function getGitDates(repo: Repository, filePath: string, repoRoot: string): Promise<{ created?: Date; modified?: Date }> {
  try {
    const relativePath = path.relative(repoRoot, filePath);

    // Get last modified date
    const modified = await repo.getFileLatestModifiedDateAsync(relativePath);

    // For created date, we'd need to get the first commit
    // For now, we'll use the modified date as fallback
    return {
      created: modified ? new Date(modified) : undefined,
      modified: modified ? new Date(modified) : undefined,
    };
  } catch (error) {
    console.warn(`Could not get git dates for ${filePath}:`, error);
    return {};
  }
}

async function getFilesystemDates(filePath: string): Promise<{ created: Date; modified: Date }> {
  const stats = await fs.stat(filePath);
  return {
    created: stats.birthtime,
    modified: stats.mtime,
  };
}

function extractTitleFromContent(content: string): string | undefined {
  // Try to find first # heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  return undefined;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

async function addFrontmatterToFile(filePath: string, repo: Repository | null, repoRoot: string): Promise<boolean> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const parsed = matter(fileContent);

  // Skip if file already has frontmatter with both created and modified
  if (parsed.data && Object.keys(parsed.data).length > 0) {
    const hasCreated = 'created' in parsed.data;
    const hasModified = 'modified' in parsed.data;

    if (hasCreated && hasModified) {
      console.log(`⏭️  Skipping ${path.basename(filePath)} (already has frontmatter)`);
      return false;
    }
  }

  // Get dates from git or filesystem
  let created: Date | undefined;
  let modified: Date | undefined;

  if (repo) {
    const gitDates = await getGitDates(repo, filePath, repoRoot);
    created = gitDates.created;
    modified = gitDates.modified;
  }

  // Fallback to filesystem dates
  if (!created || !modified) {
    const fsDates = await getFilesystemDates(filePath);
    created = created || fsDates.created;
    modified = modified || fsDates.modified;
  }

  // Extract title if not present
  let title = parsed.data.title;
  if (!title) {
    title = extractTitleFromContent(parsed.content) || path.basename(filePath, '.md');
  }

  // Create new frontmatter
  const newFrontmatter: FrontmatterData = {
    ...parsed.data,
    title,
  };

  // Only add dates if they don't exist
  if (!parsed.data.created && created) {
    newFrontmatter.created = formatDate(created);
  }
  if (!parsed.data.modified && modified) {
    newFrontmatter.modified = formatDate(modified);
  }

  // Write back to file
  const newContent = matter.stringify(parsed.content, newFrontmatter);
  await fs.writeFile(filePath, newContent, 'utf-8');

  console.log(`✅ Added frontmatter to ${path.basename(filePath)}`);
  return true;
}

async function main() {
  const contentDir = path.join(process.cwd(), 'content');

  console.log('🔍 Finding markdown files...');
  const files = await globby('**/*.md', {
    cwd: contentDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.obsidian/**'],
  });

  console.log(`📝 Found ${files.length} markdown files\n`);

  // Initialize git repository
  let repo: Repository | null = null;
  let repoRoot = process.cwd();
  try {
    repo = Repository.discover(process.cwd());
    repoRoot = repo.workdir() || process.cwd();
    console.log('✓ Git repository found\n');
  } catch (error) {
    console.log('⚠️  No git repository found, using filesystem dates\n');
  }

  let processedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const wasProcessed = await addFrontmatterToFile(file, repo, repoRoot);
    if (wasProcessed) {
      processedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Processed: ${processedCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   📝 Total: ${files.length}`);
}

main().catch(console.error);

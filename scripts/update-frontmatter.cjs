#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get staged markdown files
function getStagedMarkdownFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    });
    return output
      .split('\n')
      .filter((file) => file.endsWith('.md') && file.startsWith('content/'))
      .map((file) => file.trim());
  } catch (error) {
    return [];
  }
}

// Update or add frontmatter to a file
function updateFrontmatter(filePath) {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Check if file has frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);

  if (match) {
    // Update existing frontmatter
    let frontmatter = match[1];

    // Check if modified field exists
    if (frontmatter.includes('modified:')) {
      // Update existing modified date
      frontmatter = frontmatter.replace(
        /modified:\s*.*/,
        `modified: ${today}`
      );
    } else {
      // Add modified field
      frontmatter += `\nmodified: ${today}`;
    }

    content = content.replace(frontmatterRegex, `---\n${frontmatter}\n---\n`);
  } else {
    // Add new frontmatter
    const newFrontmatter = `---\nmodified: ${today}\n---\n\n`;
    content = newFrontmatter + content;
  }

  fs.writeFileSync(fullPath, content, 'utf-8');
  return true;
}

// Main execution
const stagedFiles = getStagedMarkdownFiles();

if (stagedFiles.length === 0) {
  process.exit(0);
}

console.log(`Updating frontmatter for ${stagedFiles.length} file(s)...`);

let updated = 0;
for (const file of stagedFiles) {
  if (updateFrontmatter(file)) {
    // Re-stage the file
    try {
      execSync(`git add "${file}"`, { stdio: 'ignore' });
      updated++;
      console.log(`  ✓ ${file}`);
    } catch (error) {
      console.error(`  ✗ Failed to re-stage ${file}`);
    }
  }
}

console.log(`Updated ${updated} file(s) with current date.`);
process.exit(0);

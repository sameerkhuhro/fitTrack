const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
console.log('--- FITTRACK PRO CODEBASE INSPECTOR ---');
console.log('Root Directory:', rootDir);

// 1. Check package.json files
const pkgPaths = ['package.json', 'server/package.json', 'client/package.json'];
const packages = {};
pkgPaths.forEach(p => {
  const full = path.join(rootDir, p);
  if (fs.existsSync(full)) {
    packages[p] = JSON.parse(fs.readFileSync(full, 'utf8'));
    console.log(`[OK] Found ${p} (v${packages[p].version})`);
  } else {
    console.error(`[MISSING] ${p}`);
  }
});

// 2. Scan for empty files or placeholder markers
function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (['node_modules', '.git', 'dist', 'data'].includes(f)) continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanDir(full, fileList);
    } else {
      fileList.push(full);
    }
  }
  return fileList;
}

const allFiles = scanDir(rootDir);
console.log(`\nTotal tracked source files found: ${allFiles.length}`);

const emptyFiles = [];
const placeholderMatches = [];

allFiles.forEach(file => {
  const stat = fs.statSync(file);
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  if (stat.size === 0 && !file.endsWith('.gitkeep')) {
    emptyFiles.push(rel);
  }

  // Check text files for suspicious placeholders
  if (/\.(js|jsx|json|md|html|css|yml)$/.test(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (/TODO|FIXME|LOREM IPSUM|DUMMY_DATA|PLACEHOLDER/i.test(line)) {
        if (!rel.includes('PROJECT_REPORT.md') && !rel.includes('AUDIT') && !rel.includes('audit_codebase')) {
          placeholderMatches.push({ file: rel, line: idx + 1, text: line.trim() });
        }
      }
    });
  }
});

console.log('\n--- EMPTY FILES ---');
if (emptyFiles.length === 0) {
  console.log('[PASS] No unexpected empty files found.');
} else {
  emptyFiles.forEach(f => console.log('EMPTY:', f));
}

console.log('\n--- PLACEHOLDER / TODO INSPECTION ---');
if (placeholderMatches.length === 0) {
  console.log('[PASS] No TODO/FIXME/Placeholder stubs found in application code.');
} else {
  console.log(`Found ${placeholderMatches.length} placeholder occurrences:`);
  placeholderMatches.slice(0, 15).forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.text}`));
}

// 3. Verify server routes vs controllers vs models
const modelsDir = path.join(rootDir, 'server/src/models');
const routesDir = path.join(rootDir, 'server/src/routes');
const controllersDir = path.join(rootDir, 'server/src/controllers');

const models = fs.readdirSync(modelsDir);
const routes = fs.readdirSync(routesDir);
const controllers = fs.readdirSync(controllersDir);

console.log(`\n--- SERVER INVENTORY ---`);
console.log(`Models (${models.length}):`, models.join(', '));
console.log(`Routes (${routes.length}):`, routes.join(', '));
console.log(`Controllers (${controllers.length}):`, controllers.join(', '));

// 4. Verify client pages
const publicPages = fs.readdirSync(path.join(rootDir, 'client/src/pages/public'));
const adminPages = fs.readdirSync(path.join(rootDir, 'client/src/pages/admin'));
const trainerPages = fs.readdirSync(path.join(rootDir, 'client/src/pages/trainer'));
const memberPages = fs.readdirSync(path.join(rootDir, 'client/src/pages/member'));

console.log(`\n--- CLIENT INVENTORY ---`);
console.log(`Public Pages (${publicPages.length}):`, publicPages.join(', '));
console.log(`Admin Pages (${adminPages.length}):`, adminPages.join(', '));
console.log(`Trainer Pages (${trainerPages.length}):`, trainerPages.join(', '));
console.log(`Member Pages (${memberPages.length}):`, memberPages.join(', '));

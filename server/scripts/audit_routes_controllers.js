const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../src/controllers');
const routesDir = path.join(__dirname, '../src/routes');

console.log('=== AUDITING CONTROLLERS & ROUTES ===\n');

const routeFiles = fs.readdirSync(routesDir);
const controllerFiles = fs.readdirSync(controllersDir);

routeFiles.forEach(rf => {
  const routeContent = fs.readFileSync(path.join(routesDir, rf), 'utf8');
  console.log(`\nRoute File: ${rf}`);
  
  // Extract HTTP method and path
  const routeRegex = /router\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/g;
  let match;
  let count = 0;
  while ((match = routeRegex.exec(routeContent)) !== null) {
    count++;
    console.log(`  ${match[1].toUpperCase().padEnd(6)} ${match[2]}`);
  }
  if (count === 0) console.log('  (No direct router methods found)');
});

console.log('\n=== CONTROLLERS EXPORTS AUDIT ===\n');
controllerFiles.forEach(cf => {
  try {
    const ctrl = require(path.join(controllersDir, cf));
    const methods = Object.keys(ctrl);
    console.log(`Controller: ${cf} (${methods.length} methods)`);
    console.log(`  Methods: ${methods.join(', ')}`);
  } catch (err) {
    console.error(`Error loading ${cf}:`, err.message);
  }
});

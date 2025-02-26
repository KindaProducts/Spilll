const fs = require('fs');
const path = require('path');

// Paths
const buildDir = path.join(__dirname, 'build');
const overrideScriptSrc = path.join(__dirname, 'public', 'lemonsqueezy-override.js');
const overrideScriptDest = path.join(buildDir, 'lemonsqueezy-override.js');
const indexHtmlPath = path.join(buildDir, 'index.html');

// Copy the override script to the build directory
console.log('Copying lemonsqueezy-override.js to build directory...');
fs.copyFileSync(overrideScriptSrc, overrideScriptDest);
console.log('✅ Copied lemonsqueezy-override.js');

// Read the built index.html file
console.log('Modifying index.html to include the override script...');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Check if the script tag already exists
if (!indexHtml.includes('lemonsqueezy-override.js')) {
  // Add the script tag before the main.js script
  indexHtml = indexHtml.replace(
    /<script>window\.__env__=/,
    '<script src="/lemonsqueezy-override.js"></script><script>window.__env__='
  );

  // Write the modified index.html back to the build directory
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log('✅ Added script tag to index.html');
} else {
  console.log('⚠️ Script tag already exists in index.html');
}

console.log('Post-build process completed successfully!'); 
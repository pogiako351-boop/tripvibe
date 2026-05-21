const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: dist/index.html not found. Run expo export first.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

// Replace absolute asset paths with relative paths so Netlify CDN serves them correctly
html = html.replace(/"\/_expo\//g, '"./_expo/');
html = html.replace(/'\/_expo\//g, "'./_expo/");
html = html.replace(/"\/assets\//g, '"./assets/');
html = html.replace(/'\/assets\//g, "'./assets/");

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Fixed absolute asset paths in dist/index.html -> relative paths');

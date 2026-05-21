const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: dist/index.html not found. Run expo export first.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

// Replace absolute asset paths with relative paths so CDN serves them correctly
html = html.replace(/"\/_expo\//g, '"./_expo/');
html = html.replace(/'\/_expo\//g, "'./_expo/");
html = html.replace(/"\/assets\//g, '"./assets/');
html = html.replace(/'\/assets\//g, "'./assets/");

// Inject apple-touch-icon if not already present
if (!html.includes('apple-touch-icon')) {
  html = html.replace(
    '</head>',
    '  <link rel="apple-touch-icon" href="./assets/images/icon.png">\n  </head>'
  );
  console.log('Injected apple-touch-icon link tag');
}

// Inject web manifest link if not already present
if (!html.includes('manifest.json')) {
  html = html.replace(
    '</head>',
    '  <link rel="manifest" href="./manifest.json">\n  </head>'
  );
  console.log('Injected manifest.json link tag');
}

// Inject theme-color meta tag if not already present
if (!html.includes('name="theme-color"')) {
  html = html.replace(
    '</head>',
    '  <meta name="theme-color" content="#FFFFFF">\n  </head>'
  );
  console.log('Injected theme-color meta tag');
}

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Fixed absolute asset paths in dist/index.html -> relative paths');

// Copy manifest.json to dist if it exists in public
const publicManifest = path.resolve(__dirname, '..', 'public', 'manifest.json');
const distManifest = path.join(distDir, 'manifest.json');
if (fs.existsSync(publicManifest) && !fs.existsSync(distManifest)) {
  fs.copyFileSync(publicManifest, distManifest);
  console.log('Copied manifest.json to dist/');
}

// Copy icon to dist/assets/images if not already there
const srcIcon = path.resolve(__dirname, '..', 'assets', 'images', 'icon.png');
const distIconDir = path.join(distDir, 'assets', 'images');
const distIcon = path.join(distIconDir, 'icon.png');
if (fs.existsSync(srcIcon) && !fs.existsSync(distIcon)) {
  fs.mkdirSync(distIconDir, { recursive: true });
  fs.copyFileSync(srcIcon, distIcon);
  console.log('Copied icon.png to dist/assets/images/');
}

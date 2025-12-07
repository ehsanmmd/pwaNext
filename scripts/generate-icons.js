/**
 * Icon Generator Script
 * Run this script to generate PWA icons of various sizes
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Note: For production, replace the generated icons with your actual app icons
 */

const fs = require('fs');
const path = require('path');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate an SVG icon
function generateSVG(size, primaryColor = '#6366f1', secondaryColor = '#818cf8') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">PWA</text>
</svg>`;
}

// Generate badge icon
function generateBadge(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#6366f1"/>
  <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">P</text>
</svg>`;
}

// Generate cache icon
function generateCacheIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="24" height="24" fill="#1e1b4b" rx="4"/>
  <ellipse cx="12" cy="5" rx="8" ry="3" stroke="white"/>
  <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="white"/>
  <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="white"/>
</svg>`;
}

// Generate notification icon
function generateNotificationIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="24" height="24" fill="#1e1b4b" rx="4"/>
  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" fill="none"/>
  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white"/>
</svg>`;
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate main icons
ICON_SIZES.forEach(size => {
  const svg = generateSVG(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
  console.log(`Generated: icon-${size}x${size}.svg`);
});

// Generate badge icon
fs.writeFileSync(path.join(iconsDir, 'badge-72x72.svg'), generateBadge(72));
console.log('Generated: badge-72x72.svg');

// Generate cache icon
fs.writeFileSync(path.join(iconsDir, 'cache-icon.svg'), generateCacheIcon(96));
console.log('Generated: cache-icon.svg');

// Generate notification icon
fs.writeFileSync(path.join(iconsDir, 'notification-icon.svg'), generateNotificationIcon(96));
console.log('Generated: notification-icon.svg');

console.log('\n✅ All icons generated successfully!');
console.log('\nNote: For production, convert these SVGs to PNGs using a tool like:');
console.log('- Sharp (npm package)');
console.log('- ImageMagick');
console.log('- Online converters');
console.log('\nOr replace them with your custom icons.');


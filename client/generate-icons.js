const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' }
];

const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="64" fill="#1e293b"/>
  
  <!-- Calendar Icon -->
  <g transform="translate(128, 96)">
    <!-- Calendar Body -->
    <rect x="0" y="32" width="256" height="256" rx="16" fill="#f1f5f9" stroke="#64748b" stroke-width="4"/>
    
    <!-- Calendar Header -->
    <rect x="0" y="32" width="256" height="48" rx="16" fill="#3b82f6"/>
    
    <!-- Calendar Rings -->
    <circle cx="64" cy="16" r="12" fill="#64748b"/>
    <circle cx="192" cy="16" r="12" fill="#64748b"/>
    
    <!-- Ring holes -->
    <circle cx="64" cy="16" r="6" fill="#1e293b"/>
    <circle cx="192" cy="16" r="6" fill="#1e293b"/>
    
    <!-- Calendar Grid -->
    <g stroke="#cbd5e1" stroke-width="2" fill="none">
      <line x1="36" y1="112" x2="220" y2="112"/>
      <line x1="36" y1="144" x2="220" y2="144"/>
      <line x1="36" y1="176" x2="220" y2="176"/>
      <line x1="36" y1="208" x2="220" y2="208"/>
      <line x1="36" y1="240" x2="220" y2="240"/>
      
      <line x1="68" y1="96" x2="68" y2="272"/>
      <line x1="100" y1="96" x2="100" y2="272"/>
      <line x1="132" y1="96" x2="132" y2="272"/>
      <line x1="164" y1="96" x2="164" y2="272"/>
      <line x1="196" y1="96" x2="196" y2="272"/>
    </g>
    
    <!-- Expiry Warning -->
    <circle cx="180" cy="160" r="24" fill="#ef4444"/>
    <text x="180" y="168" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="white">!</text>
    
    <!-- Food Item -->
    <circle cx="84" cy="192" r="16" fill="#22c55e"/>
    <circle cx="84" cy="224" r="16" fill="#f59e0b"/>
    <circle cx="116" cy="160" r="16" fill="#8b5cf6"/>
  </g>
</svg>`;

async function generateIcons() {
  const iconsDir = path.join(__dirname, 'public', 'icons');
  const publicDir = path.join(__dirname, 'public');

  // Create directories if they don't exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Generate icons
  for (const { size, name } of iconSizes) {
    try {
      const outputPath = name.startsWith('pwa-') 
        ? path.join(publicDir, name) 
        : path.join(iconsDir, name);
        
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`Error generating ${name}:`, error);
    }
  }

  // Generate favicon.ico
  try {
    await sharp(Buffer.from(svgContent))
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('Generated favicon.ico');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceIcon = join(__dirname, 'logo', 'exp.png');
const publicDir = join(__dirname, 'client', 'public');

const iconCopies = [
  'exp-192.png',
  'exp-512.png',
  'favicon-16.png',
  'favicon-32.png',
  'apple-touch-icon.png',
  'favicon.ico'
];

async function copyIcons() {
  try {
    // Ensure public directory exists
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    // Check if source exists
    if (!existsSync(sourceIcon)) {
      console.error('❌ Source icon not found:', sourceIcon);
      console.log('Please ensure logo/exp.png exists');
      process.exit(1);
    }

    console.log('📦 Copying icons to public directory...\n');

    // Copy exp.png to all required sizes (placeholder)
    for (const icon of iconCopies) {
      const dest = join(publicDir, icon);
      await copyFile(sourceIcon, dest);
      console.log(`✓ Copied ${icon}`);
    }

    console.log('\n✅ All icons copied successfully!');
    console.log('\n⚠️  NOTE: These are placeholder copies of exp.png');
    console.log('For production, please generate properly sized icons using:');
    console.log('  - ImageMagick: ./generate-icons.sh');
    console.log('  - Or online tools mentioned in PWA_SETUP.md');
  } catch (error) {
    console.error('❌ Error copying icons:', error);
    process.exit(1);
  }
}

copyIcons();

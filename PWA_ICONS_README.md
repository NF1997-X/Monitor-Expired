# PWA Icons Setup

To complete PWA setup, you need to add proper icon files:

## Required Icons

1. **icon-192.png** (192x192 pixels)
   - Location: `/client/public/icon-192.png`
   - Used for: App icon, notifications, shortcuts

2. **icon-512.png** (512x512 pixels)
   - Location: `/client/public/icon-512.png`
   - Used for: App splash screen, high-res displays

## How to Generate Icons

You can use your existing FamilyMart.png logo or create new icons using:

### Option 1: Online Tools
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

### Option 2: Manual Creation
1. Create 192x192 PNG with your logo/icon
2. Create 512x512 PNG with your logo/icon
3. Place in `/client/public/` folder
4. Update paths in `manifest.json` if needed

### Recommended Design
- Dark background (#1a1a1a)
- Food/tracking related icon or emoji (🍱 📅 ⏰)
- Rounded corners for iOS style
- High contrast for visibility

## Screenshots (Optional)

For better PWA installation experience:

1. **screenshot-mobile.png** (390x844)
2. **screenshot-tablet.png** (768x1024)

These show users what the app looks like before installing.

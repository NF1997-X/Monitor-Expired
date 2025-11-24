# PWA Icons Setup

## Generate Icons from exp.png

To generate all required PWA icons and favicons, you have two options:

### Option 1: Using ImageMagick (Recommended)

1. Install ImageMagick:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install imagemagick
   
   # macOS
   brew install imagemagick
   ```

2. Run the generation script:
   ```bash
   chmod +x generate-icons.sh
   ./generate-icons.sh
   ```

### Option 2: Using Online Tools

1. Upload `logo/exp.png` to one of these tools:
   - https://realfavicongenerator.net/
   - https://favicon.io/favicon-converter/
   - https://www.pwabuilder.com/imageGenerator

2. Download the generated icons package

3. Extract and place files in `client/public/`:
   - `favicon-16.png` (16x16)
   - `favicon-32.png` (32x32)
   - `exp-192.png` (192x192)
   - `exp-512.png` (512x512)
   - `apple-touch-icon.png` (180x180)
   - `favicon.ico` (multi-size)

### Option 3: Manual Resize

If you have access to image editing software (Photoshop, GIMP, etc.):

1. Open `logo/exp.png`
2. Create these sizes:
   - 16x16 → Save as `client/public/favicon-16.png`
   - 32x32 → Save as `client/public/favicon-32.png`
   - 192x192 → Save as `client/public/exp-192.png`
   - 512x512 → Save as `client/public/exp-512.png`
   - 180x180 → Save as `client/public/apple-touch-icon.png`

## Required Icon Files

After generation, verify these files exist in `client/public/`:

```
client/public/
├── favicon-16.png
├── favicon-32.png
├── favicon-48.png
├── favicon.ico
├── exp-192.png
├── exp-512.png
└── apple-touch-icon.png
```

## Testing PWA

After generating icons:

1. Build the app: `npm run build`
2. Start the server: `npm start`
3. Open in browser and test "Add to Home Screen"
4. Check that the correct icon appears

## Current Setup

- App Version: **v1.3.0**
- Service Worker: Enabled with auto-update detection
- PWA Features:
  - ✅ Installable (Add to Home Screen)
  - ✅ Offline support
  - ✅ Auto-update notifications
  - ✅ Push notifications
  - ✅ App-like experience
  - ✅ Custom icons and splash screens

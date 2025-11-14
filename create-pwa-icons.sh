#!/bin/bash

# Create placeholder icons for PWA testing
echo "Creating placeholder PWA icons..."

# Create icons directory if it doesn't exist
mkdir -p client/public/icons

# Create a simple SVG icon
cat > client/public/icons/icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="#1e293b"/>
  <g transform="translate(128, 96)">
    <rect x="0" y="32" width="256" height="256" rx="16" fill="#f1f5f9" stroke="#64748b" stroke-width="4"/>
    <rect x="0" y="32" width="256" height="48" rx="16" fill="#3b82f6"/>
    <circle cx="64" cy="16" r="12" fill="#64748b"/>
    <circle cx="192" cy="16" r="12" fill="#64748b"/>
    <circle cx="64" cy="16" r="6" fill="#1e293b"/>
    <circle cx="192" cy="16" r="6" fill="#1e293b"/>
    <circle cx="180" cy="160" r="24" fill="#ef4444"/>
    <text x="180" y="168" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="white">!</text>
    <circle cx="84" cy="192" r="16" fill="#22c55e"/>
    <circle cx="84" cy="224" r="16" fill="#f59e0b"/>
    <circle cx="116" cy="160" r="16" fill="#8b5cf6"/>
  </g>
</svg>
EOF

# Use Python to create PNG files if available
if command -v python3 &> /dev/null; then
    python3 -c "
import os
try:
    from PIL import Image, ImageDraw
    
    # Icon sizes
    sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]
    
    for size in sizes:
        img = Image.new('RGB', (size, size), '#1e293b')
        draw = ImageDraw.Draw(img)
        
        # Simple calendar icon
        margin = size // 8
        rect_size = size - 2 * margin
        draw.rectangle([margin, margin, size-margin, size-margin], fill='#f1f5f9', outline='#64748b')
        draw.rectangle([margin, margin, size-margin, margin + rect_size//4], fill='#3b82f6')
        
        img.save(f'client/public/icons/icon-{size}x{size}.png')
        print(f'Created icon-{size}x{size}.png')
    
    # PWA specific icons
    for size in [192, 512]:
        img = Image.new('RGB', (size, size), '#1e293b')
        draw = ImageDraw.Draw(img)
        margin = size // 8
        rect_size = size - 2 * margin
        draw.rectangle([margin, margin, size-margin, size-margin], fill='#f1f5f9', outline='#64748b')
        draw.rectangle([margin, margin, size-margin, margin + rect_size//4], fill='#3b82f6')
        img.save(f'client/public/pwa-{size}x{size}.png')
        print(f'Created pwa-{size}x{size}.png')
    
    # Favicon
    img = Image.new('RGB', (32, 32), '#1e293b')
    draw = ImageDraw.Draw(img)
    draw.rectangle([4, 4, 28, 28], fill='#f1f5f9', outline='#64748b')
    draw.rectangle([4, 4, 28, 12], fill='#3b82f6')
    img.save('client/public/favicon.ico')
    print('Created favicon.ico')
    
    print('All icons created successfully!')
    
except ImportError:
    print('PIL not available. Creating placeholder files...')
    # Create empty placeholder files
    import os
    os.makedirs('client/public/icons', exist_ok=True)
    sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]
    for size in sizes:
        with open(f'client/public/icons/icon-{size}x{size}.png', 'wb') as f:
            f.write(b'PNG placeholder')
    for size in [192, 512]:
        with open(f'client/public/pwa-{size}x{size}.png', 'wb') as f:
            f.write(b'PNG placeholder')
    with open('client/public/favicon.ico', 'wb') as f:
        f.write(b'ICO placeholder')
    print('Created placeholder icon files.')
"
else
    echo "Python3 not available. Creating placeholder files..."
    # Create placeholder files
    mkdir -p client/public/icons
    for size in 16 32 72 96 128 144 152 192 384 512; do
        echo "PNG placeholder" > client/public/icons/icon-${size}x${size}.png
    done
    echo "PNG placeholder" > client/public/pwa-192x192.png
    echo "PNG placeholder" > client/public/pwa-512x512.png
    echo "ICO placeholder" > client/public/favicon.ico
fi

echo "Icon creation completed!"
echo "Visit /pwa-test.html to test PWA functionality"
#!/bin/bash

# Create simple colored PNG icons using ImageMagick if available
# This is a backup method if Sharp is not available

if command -v convert &> /dev/null; then
    echo "ImageMagick found, generating icons..."
    
    # Create icons directory
    mkdir -p client/public/icons
    
    # Define color
    COLOR="#1e293b"
    
    # Generate different sized icons
    convert -size 16x16 xc:"$COLOR" client/public/icons/icon-16x16.png
    convert -size 32x32 xc:"$COLOR" client/public/icons/icon-32x32.png
    convert -size 72x72 xc:"$COLOR" client/public/icons/icon-72x72.png
    convert -size 96x96 xc:"$COLOR" client/public/icons/icon-96x96.png
    convert -size 128x128 xc:"$COLOR" client/public/icons/icon-128x128.png
    convert -size 144x144 xc:"$COLOR" client/public/icons/icon-144x144.png
    convert -size 152x152 xc:"$COLOR" client/public/icons/icon-152x152.png
    convert -size 192x192 xc:"$COLOR" client/public/icons/icon-192x192.png
    convert -size 384x384 xc:"$COLOR" client/public/icons/icon-384x384.png
    convert -size 512x512 xc:"$COLOR" client/public/icons/icon-512x512.png
    
    # PWA specific icons
    convert -size 192x192 xc:"$COLOR" client/public/pwa-192x192.png
    convert -size 512x512 xc:"$COLOR" client/public/pwa-512x512.png
    
    # Favicon
    convert -size 32x32 xc:"$COLOR" client/public/favicon.ico
    
    echo "Icons generated successfully!"
else
    echo "ImageMagick not found. Please install ImageMagick or use the Node.js script."
fi
#!/bin/bash

# Script to generate PWA icons and favicons from exp.png
# Requires ImageMagick to be installed

SOURCE_IMAGE="logo/exp.png"
PUBLIC_DIR="client/public"

# Check if source image exists
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Error: Source image $SOURCE_IMAGE not found!"
    exit 1
fi

# Create public directory if it doesn't exist
mkdir -p "$PUBLIC_DIR"

echo "Generating PWA icons and favicons from $SOURCE_IMAGE..."

# Generate favicon sizes
convert "$SOURCE_IMAGE" -resize 16x16 "$PUBLIC_DIR/favicon-16.png"
convert "$SOURCE_IMAGE" -resize 32x32 "$PUBLIC_DIR/favicon-32.png"
convert "$SOURCE_IMAGE" -resize 48x48 "$PUBLIC_DIR/favicon-48.png"

# Generate PWA icons
convert "$SOURCE_IMAGE" -resize 192x192 "$PUBLIC_DIR/exp-192.png"
convert "$SOURCE_IMAGE" -resize 512x512 "$PUBLIC_DIR/exp-512.png"

# Generate Apple touch icon
convert "$SOURCE_IMAGE" -resize 180x180 "$PUBLIC_DIR/apple-touch-icon.png"

# Create favicon.ico with multiple sizes
convert "$SOURCE_IMAGE" -resize 16x16 \
        "$SOURCE_IMAGE" -resize 32x32 \
        "$SOURCE_IMAGE" -resize 48x48 \
        "$PUBLIC_DIR/favicon.ico"

echo "✓ Generated favicon-16.png"
echo "✓ Generated favicon-32.png"
echo "✓ Generated favicon-48.png"
echo "✓ Generated exp-192.png"
echo "✓ Generated exp-512.png"
echo "✓ Generated apple-touch-icon.png"
echo "✓ Generated favicon.ico"
echo ""
echo "All icons generated successfully!"

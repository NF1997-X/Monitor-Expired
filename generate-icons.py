import os
from PIL import Image, ImageDraw

# Create icons directory
icons_dir = "client/public/icons"
public_dir = "client/public"

os.makedirs(icons_dir, exist_ok=True)

# Icon sizes to generate
icon_sizes = [
    (16, "icon-16x16.png"),
    (32, "icon-32x32.png"),
    (72, "icon-72x72.png"),
    (96, "icon-96x96.png"),
    (128, "icon-128x128.png"),
    (144, "icon-144x144.png"),
    (152, "icon-152x152.png"),
    (192, "icon-192x192.png"),
    (384, "icon-384x384.png"),
    (512, "icon-512x512.png"),
]

# PWA specific icons
pwa_sizes = [
    (192, "pwa-192x192.png"),
    (512, "pwa-512x512.png"),
]

# Colors
bg_color = "#1e293b"  # slate-800
calendar_color = "#f1f5f9"  # slate-100
header_color = "#3b82f6"  # blue-500
warning_color = "#ef4444"  # red-500

def create_icon(size):
    # Create image
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Calculate proportions based on size
    margin = size // 8
    cal_width = size - (2 * margin)
    cal_height = int(cal_width * 0.8)
    cal_x = margin
    cal_y = margin + (size // 16)
    
    # Draw calendar body
    draw.rounded_rectangle(
        [cal_x, cal_y + (cal_height // 8), cal_x + cal_width, cal_y + cal_height],
        radius=size // 32,
        fill=calendar_color
    )
    
    # Draw calendar header
    draw.rounded_rectangle(
        [cal_x, cal_y + (cal_height // 8), cal_x + cal_width, cal_y + (cal_height // 3)],
        radius=size // 32,
        fill=header_color
    )
    
    # Draw warning indicator (red circle)
    warning_size = size // 8
    warning_x = cal_x + cal_width - warning_size - (size // 16)
    warning_y = cal_y + (cal_height // 2)
    
    draw.ellipse(
        [warning_x, warning_y, warning_x + warning_size, warning_y + warning_size],
        fill=warning_color
    )
    
    return img

# Generate all icon sizes
for size, filename in icon_sizes:
    img = create_icon(size)
    img.save(os.path.join(icons_dir, filename))
    print(f"Generated {filename} ({size}x{size})")

# Generate PWA icons
for size, filename in pwa_sizes:
    img = create_icon(size)
    img.save(os.path.join(public_dir, filename))
    print(f"Generated {filename} ({size}x{size})")

# Generate favicon
favicon_img = create_icon(32)
favicon_img.save(os.path.join(public_dir, "favicon.ico"))
print("Generated favicon.ico (32x32)")

print("All icons generated successfully!")
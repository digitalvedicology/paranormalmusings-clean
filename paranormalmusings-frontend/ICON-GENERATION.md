# Icon Generation Guide

The site requires several PNG icon formats for different devices and contexts. An SVG source file has been created at `public/icon.svg`.

## Required Icons

1. **favicon.ico** (16x16, 32x32, 48x48 multi-resolution ICO file)
2. **icon-192.png** (192x192 PNG)
3. **icon-512.png** (512x512 PNG)
4. **icon-maskable-192.png** (192x192 PNG with safe zone for masking)
5. **icon-maskable-512.png** (512x512 PNG with safe zone for masking)
6. **apple-touch-icon.png** (180x180 PNG for iOS)

## Option 1: Using Online Tools (Easiest)

### Generate ICO from SVG
1. Go to https://convertio.co/svg-ico/
2. Upload `public/icon.svg`
3. Download as `favicon.ico`
4. Place in `public/favicon.ico`

### Generate PNGs from SVG
1. Go to https://www.svgtoimg.com/
2. Upload `public/icon.svg`
3. For each size, download as PNG:
   - 192x192 → `public/icon-192.png`
   - 512x512 → `public/icon-512.png`
   - 180x180 → `public/apple-touch-icon.png`

### Generate Maskable Icons
1. Maskable icons need padding in the safe zone (center 66% of the image)
2. For production, use: https://www.maskable.app/
3. Upload `public/icon.svg`
4. Download maskable versions:
   - 192x192 → `public/icon-maskable-192.png`
   - 512x512 → `public/icon-maskable-512.png`

## Option 2: Using Node.js (Automated)

### Setup
```bash
npm install --save-dev sharp
```

### Create `scripts/generate-icons.js`
```javascript
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgFile = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public');

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-maskable-192.png', size: 192 },
  { name: 'icon-maskable-512.png', size: 512 },
];

async function generateIcons() {
  console.log('Generating icons from SVG...');
  
  for (const { name, size } of sizes) {
    try {
      await sharp(svgFile, { density: 150 })
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, name));
      console.log(`✓ Generated ${name}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }
  
  // Also generate favicon.ico using convert (ImageMagick)
  // Alternative: use online tool
  console.log('\nGenerate favicon.ico using:');
  console.log('  https://convertio.co/svg-ico/');
  console.log('  Upload: public/icon.svg');
  console.log('  Download and place at: public/favicon.ico');
}

generateIcons();
```

### Run
```bash
node scripts/generate-icons.js
```

## Option 3: Using ImageMagick (Command Line)

```bash
# Install ImageMagick
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick
# Windows: Download from https://imagemagick.org/

# Convert SVG to PNG
convert -density 300 public/icon.svg -resize 192x192 public/icon-192.png
convert -density 300 public/icon.svg -resize 512x512 public/icon-512.png
convert -density 300 public/icon.svg -resize 180x180 public/apple-touch-icon.png

# For favicon.ico (requires multi-resolution)
convert -density 150 public/icon.svg \
  -define icon:auto-resize=256,128,96,64,48,32,16 \
  public/favicon.ico
```

## Option 4: Using Python (Pillow)

```bash
pip install pillow cairosvg
```

```python
# scripts/generate_icons.py
import cairosvg
from PIL import Image
import os

svg_file = 'paranormalmusings-frontend/public/icon.svg'
output_dir = 'paranormalmusings-frontend/public'

sizes = [192, 512, 180]

for size in sizes:
    png_file = f'{output_dir}/icon-{size}.png'
    cairosvg.svg2png(url=svg_file, write_to=png_file, output_width=size, output_height=size)
    print(f'Generated {png_file}')

# Also generate favicon versions
for size in [16, 32, 48, 64]:
    png_file = f'{output_dir}/favicon-{size}.png'
    cairosvg.svg2png(url=svg_file, write_to=png_file, output_width=size, output_height=size)

print('Generated favicon sizes. Combine with ImageMagick:')
print('convert paranormalmusings-frontend/public/favicon-*.png paranormalmusings-frontend/public/favicon.ico')
```

```bash
python scripts/generate_icons.py
```

## Verification

After generating the icons, verify they're recognized:

1. **Check manifest.json references**
   - Icons should be listed in `public/manifest.json`
   - Check all sizes match

2. **Test in browser**
   - Reload the page (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
   - Favicon should appear in tab
   - Open DevTools → Application → Manifest to verify

3. **Google Rich Results Test**
   - Go to https://search.google.com/test/rich-results
   - Enter site URL
   - Check "Supports Web App Install" appears

4. **Lighthouse**
   - Run Lighthouse audit
   - Check PWA score improves with manifest and icons

## Maskable Icon Specification

Maskable icons are displayed with a circular or rounded mask on many devices. The safe zone is the center 66% of the icon:

- **Icon size:** 192x192 or 512x512
- **Safe zone:** Center 66% (e.g., for 192px: center 128x128 area)
- **Logo/content:** Keep within safe zone
- **Background:** Should extend to edges

The current `icon.svg` has been designed with a margin, so the center content is protected when masked.

## References

- [Manifest.json Icons Spec](https://www.w3.org/TR/appmanifest/#icon-member)
- [Maskable Icons Format](https://www.w3.org/TR/appmanifest/#icon-masks)
- [Apple Touch Icon](https://developer.apple.com/library/archive/documentation/AppleWebKit/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Favicon Best Practices](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-matter)

## Next Steps

1. Choose one of the generation methods above
2. Generate all required icon files
3. Place them in `public/`
4. Test with `npm run dev` locally
5. Verify in production after deployment

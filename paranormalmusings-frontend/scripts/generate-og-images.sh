#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# PARANORMAL MUSINGS - OG IMAGE GENERATOR
# ═══════════════════════════════════════════════════════════════════════════════
# This script generates placeholder OpenGraph images for all SEO entries
#
# Requirements:
#   - ImageMagick (convert command)
#   - The paranormalmusings-seo-data.csv file
#
# Installation:
#   Ubuntu/Debian: sudo apt-get install imagemagick
#   macOS: brew install imagemagick
#   Windows: Download from https://imagemagick.org/script/download.php
#
# Usage:
#   bash paranormalmusings-frontend/scripts/generate-og-images.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGES_DIR="paranormalmusings-frontend/public/images"
CSV_FILE="paranormalmusings-seo-data.csv"
IMAGE_WIDTH=1200
IMAGE_HEIGHT=630
FONT_SIZE=60
QUALITY=85

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ ImageMagick is not installed${NC}"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  Windows: https://imagemagick.org/script/download.php"
    exit 1
fi

# Create images directory
mkdir -p "$IMAGES_DIR"
echo -e "${BLUE}📁 Using directory: $IMAGES_DIR${NC}"

# Check if CSV exists
if [ ! -f "$CSV_FILE" ]; then
    echo -e "${RED}❌ CSV file not found: $CSV_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}📖 Reading from: $CSV_FILE${NC}"
echo ""

# Function to extract filename from URL
extract_og_image_name() {
    echo "$1" | grep -oP '(?<=/)[^/]*(?=/$)' | head -1
}

# Function to create image
create_image() {
    local title="$1"
    local filename="$2"

    if [ -z "$title" ] || [ -z "$filename" ]; then
        return
    fi

    local filepath="$IMAGES_DIR/$filename"

    # Skip if already exists
    if [ -f "$filepath" ]; then
        echo -e "${YELLOW}⏭️  Skipping (exists): $filename${NC}"
        return
    fi

    # Create image with title
    convert \
        -size ${IMAGE_WIDTH}x${IMAGE_HEIGHT} \
        "xc:#1a1a1a" \
        -pointsize $FONT_SIZE \
        -fill white \
        -font Arial-Bold \
        -gravity center \
        -annotate +0-100 "Paranormal Musings" \
        -pointsize 40 \
        -annotate +0+50 "$title" \
        -quality $QUALITY \
        "$filepath"

    echo -e "${GREEN}✅ Created: $filename${NC}"
}

# Parse CSV and create images
image_count=0
skipped_count=0

while IFS=',' read -r url seo_title meta_desc keyword og_title og_desc og_image canonical; do
    # Skip header and empty lines
    if [[ "$url" == "URL" ]] || [[ -z "$url" ]]; then
        continue
    fi

    # Skip section headers
    if [[ "$url" == *"PAGES"* ]] || [[ "$url" == *"CATEGORY"* ]] || [[ "$url" == *"BLOG"* ]]; then
        continue
    fi

    # Get image name from og_image field
    og_image=$(echo "$og_image" | xargs)  # Trim whitespace

    if [ -z "$og_image" ] || [ "$og_image" == "MISSING" ]; then
        ((skipped_count++))
        continue
    fi

    # Extract just the filename
    image_filename=$(basename "$og_image")

    # Clean up title for display
    title=$(echo "$og_title" | sed 's/^"//' | sed 's/"$//' | cut -c1-50)

    create_image "$title" "$image_filename"
    ((image_count++))

done < "$CSV_FILE"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Image Generation Complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "Created: ${GREEN}$image_count${NC} images"
echo -e "Skipped: ${YELLOW}$skipped_count${NC} (already exist or missing)"
echo -e "Location: ${BLUE}$IMAGES_DIR${NC}"
echo ""
echo "📝 Next Steps:"
echo "  1. Review generated images in $IMAGES_DIR"
echo "  2. Replace placeholder images with real artwork"
echo "  3. Ensure all images are 1200x630 pixels"
echo "  4. Commit images: git add $IMAGES_DIR && git commit -m 'Add OG images'"
echo ""

# SEO Data Management Guide

## Quick Reference

### View SEO Data for a Post
SEO data is stored in `paranormalmusings-admin/data/content.json` within each post:

```json
{
  "slug": "how-to-become-a-paranormal-investigator",
  "title": "How to Become a Paranormal Investigator?",
  "seo": {
    "metaTitle": "How to Become a Paranormal Investigator? - paranormalmusings.com",
    "metaDescription": "Before I answer how to be a paranormal investigator, it is very important to understand the concept of being a paranormal investigator.",
    "keyword": "how to become a paranormal investigator",
    "ogTitle": "How to Become a Paranormal Investigator?",
    "ogDescription": "Before I answer how to be a paranormal investigator, it is very important to understand the concept of being a paranormal investigator.",
    "ogImage": "/images/og-become-investigator.jpg",
    "canonical": "https://paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/"
  }
}
```

## Updating SEO Data

### Method 1: Direct Edit (Admin Interface)
If you implement an admin UI:
1. Navigate to post editor
2. Expand "SEO" section
3. Edit fields
4. Save

### Method 2: CSV Import (Current)
1. Update `paranormalmusings-seo-data.csv`
2. Run import script:
   ```bash
   cd paranormalmusings-admin
   npx tsx scripts/import-seo-data.ts
   ```
3. Commit changes

### Method 3: Manual JSON Edit
Edit `paranormalmusings-admin/data/content.json` directly:
1. Find the post by slug
2. Add/update the `seo` object
3. Save file

## SEO Field Guidelines

### metaTitle (SEO Title)
- **Purpose:** `<title>` tag and search results
- **Length:** 50-60 characters
- **Format:** "Main Topic - paranormalmusings.com" or "Question - paranormalmusings.com"
- **Example:** "How to Become a Paranormal Investigator? - paranormalmusings.com"

### metaDescription
- **Purpose:** `<meta name="description">` tag
- **Length:** 150-160 characters
- **Content:** Summary of page content
- **Example:** "Before I answer how to be a paranormal investigator, it is very important to understand the concept..."

### keyword
- **Purpose:** SEO keyword tracking (reference only)
- **Format:** "target keyword phrase"
- **Example:** "how to become a paranormal investigator"

### ogTitle (OpenGraph Title)
- **Purpose:** Social media title when shared
- **Length:** 50-60 characters (same as metaTitle usually)
- **Format:** Clear, compelling title
- **Example:** "How to Become a Paranormal Investigator?"

### ogDescription (OpenGraph Description)
- **Purpose:** Social media description when shared
- **Length:** 150-160 characters
- **Content:** Summary highlighting value/interest
- **Example:** "Before I answer how to be a paranormal investigator, it is very important..."

### ogImage
- **Purpose:** Social media image when shared
- **Format:** Absolute URL or relative path
- **Dimensions:** 1200x630px recommended
- **Example:** "/images/og-become-investigator.jpg" or "https://paranormalmusings.com/images/og-become-investigator.jpg"

### canonical
- **Purpose:** Tell search engines the primary URL
- **Format:** Full absolute URL
- **Note:** Usually matches the article URL
- **Example:** "https://paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/"

## CSV Import Format

```csv
URL,SEO Title,Meta Description,Keyword,OG Title,OG Description,OG Image,Canonical
https://paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/,How to Become a Paranormal Investigator? - paranormalmusings.com,Before I answer how to be a paranormal investigator...,how to become a paranormal investigator,How to Become a Paranormal Investigator?,Before I answer how to be a paranormal investigator...,/images/og-become-investigator.jpg,https://paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/
```

## What Pages Have SEO Data?

### ✅ Posts with SEO (83 total)
- All blog articles in categories:
  - Eastern Views
  - Western Views
  - Paranormal Investigation
  - Case Studies

### ✅ Categories with SEO (4 total)
- Eastern Views category page
- Western Views category page
- Paranormal Investigation category page
- Case Studies category page

### ❌ Pages Without SEO (Not in CSV)
These pages use defaults - you can add SEO data if needed:
- Homepage (/)
- About page (/about)
- Contact page (/contact-us)
- Privacy page (/privacy)
- Terms page (/terms)
- Legal page (/legal)

## Testing SEO Implementation

### Check in Browser
1. Go to any post or category page
2. Right-click → "View Page Source"
3. Search for:
   - `<title>` - Should show your SEO title
   - `<meta name="description"` - Should show meta description
   - `<meta property="og:title"` - Should show OG title
   - `<meta property="og:description"` - Should show OG description
   - `<meta property="og:image"` - Should show OG image
   - `<link rel="canonical"` - Should show canonical URL

### Using Browser DevTools
1. Open DevTools (F12)
2. Go to Elements/Inspector tab
3. Look for `<head>` section
4. Verify all meta tags are present

### Using SEO Tools
- Google Search Console: Check rich results
- Facebook OG Debugger: Check social sharing
- Twitter Card Validator: Check Twitter sharing
- SEMrush/Ahrefs: Full SEO audit

## Common Issues & Solutions

### Issue: SEO changes not showing
**Solution:** 
1. Verify changes in content.json
2. Rebuild the site: `npm run build` in paranormalmusings-frontend
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: OG images not showing on social media
**Solution:**
1. Verify image URL is absolute (starts with http/https or domain)
2. Test with Facebook OG Debugger
3. Ensure image exists at specified URL
4. Image should be 1200x630px minimum

### Issue: Duplicate content warnings
**Solution:**
1. Check canonical URLs are correct
2. Ensure each page has one canonical tag
3. Point canonicals to the authoritative version

## Workflow for New Content

When adding a new post:

1. **Create post** in admin interface with basic info
2. **Get the slug** from the created post
3. **Create SEO entry** in CSV:
   ```csv
   https://paranormalmusings.com/category/your-slug/,Your Title,Your description...,keyword,Your OG Title,Your OG Description,/images/og-slug.jpg,https://paranormalmusings.com/category/your-slug/
   ```
4. **Run import script:**
   ```bash
   cd paranormalmusings-admin
   npx tsx scripts/import-seo-data.ts
   ```
5. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add SEO data for: Your Post Title"
   ```
6. **Deploy** when ready

## Performance Notes

- ✅ All SEO processing happens at build time
- ✅ No runtime overhead
- ✅ No extra API calls
- ✅ Static site generation works perfectly
- ✅ SEO data is included in initial HTML payload (not fetched later)

## Questions?

Refer to:
- `SEO-IMPLEMENTATION-COMPLETE.md` - Technical details
- `paranormalmusings-seo-data.csv` - Current SEO data
- `paranormalmusings-admin/scripts/import-seo-data.ts` - Import script reference

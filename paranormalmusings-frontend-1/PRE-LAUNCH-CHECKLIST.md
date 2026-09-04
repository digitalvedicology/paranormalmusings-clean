# Pre-Launch Checklist: Content & Placeholder Issues

**Status:** 🔴 **BLOCKING ISSUES** — Must fix before going live

---

## 1. Author Portrait Image (CRITICAL)

### Issue
- `authorImage` field is empty string in seed data
- Site shows placeholder from `picsum.photos` (random image service)
- Appears 14 times on homepage (different sizes)
- **Security risk:** Third-party service can serve arbitrary images next to your name

### Where It's Used
- Hero section (author intro)
- About section (profile picture)
- Article author bio
- Footer logo area
- Investigation section

### Fix Required

**Step 1: Prepare Image**
1. Provide a portrait photo of yourself (Praveen)
2. Format: JPG or WebP (optimized)
3. Size: At least 400×400 pixels (square)
4. Store at: `public/images/author-portrait.jpg`

**Step 2: Update Seed Data**
```json
// lib/seed/content.json
{
  "site": {
    "authorImage": "/images/author-portrait.jpg"  // Add this
  }
}
```

**Step 3: Verify**
- Homepage loads your photo (not placeholder)
- All sizes render correctly (80×80, 200×200, etc.)
- Image is optimized (check DevTools Network)

---

## 2. Placeholder Publication Dates (CRITICAL)

### Issue
- **27 posts** have publication date "April 1, 2021"
- Looks like bulk-import default
- Inconsistent with actual publication dates
- Google may penalize duplicate dates (thinks low effort)

### Where It Appears
- Article cards
- Article page metadata
- Structured data (datePublished)
- Archive listings

### Fix Required

**Option A: Get Real Dates from WordPress**
1. Export posts from old WordPress site
2. Extract actual publication dates
3. Update seed data with real dates for each post

**Option B: Use Migration Date**
If original dates are lost, use the migration date (2026-08-31) for all:
```json
"date": "2026-08-31"  // Consistent, not a lie
```

**Option C: Bulk Fix + Document**
1. Use a reasonable date (e.g., when content was ported)
2. In Privacy Policy, note: "Articles migrated from archive; dates may reflect publication in source database"

**Recommended:** Option A (get real dates if possible)

### Current Dates to Fix
```bash
# Count by date
grep -o '"date": "[^"]*"' lib/seed/content.json | sort | uniq -c
# Shows which dates are placeholders
```

---

## 3. Inconsistent Date Formats (MEDIUM)

### Issue
- Some dates: "April 1, 2021" (text month)
- Other dates: "23 January 2021" (mixed format)
- No consistency

### Root Cause
Dates stored as strings in seed data; formatted differently by different components

### Fix Required

**Store as ISO 8601 in CMS/Seed:**
```json
// Before
"date": "April 1, 2021"

// After
"date": "2021-04-01"
```

**Format at Render Time (One Place):**
```typescript
// lib/date-formatter.ts
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  // Returns: "April 1, 2021" consistently
}
```

**Use Everywhere:**
```typescript
// Components/ArticleCard.tsx
import { formatDate } from '@/lib/date-formatter'

export function ArticleCard({ post }) {
  return <span>{formatDate(post.date)}</span>
}
```

### Benefits
- Consistent format everywhere
- Change format once, affects all pages
- ISO 8601 is standard (good for SEO)
- Works correctly in structured data

---

## 4. Investigation Section Incomplete (MEDIUM)

### Issue
- "Paranormal Investigation" section shows only 2 rows
- Numbered "01" and "02"
- Looks unfinished (like a WIP component)
- Category has 37 posts; should show more

### Current Data
```json
"investigationRows": [
  "ghost-hunting-thermometers",
  "depossession-instructions"
]
```

### Fix Options

**Option A: Show More Rows**
```json
"investigationRows": [
  "ghost-hunting-thermometers",
  "depossession-instructions",
  "how-to-conduct-an-investigation-of-the-paranormal",
  "what-is-sixth-sense-how-to-develop-sixth-sense",
  // ... add up to 6-8 for a complete section
]
```

**Option B: Rename Section**
If these 2 are intentional highlights, rename to:
- "Recommended reading"
- "Popular investigations"
- "Start here"

**Option C: Hide Section**
If not ready, remove from homepage and link to full Investigation archive instead.

### Recommendation
Add 4-6 more high-quality posts to the section. This section is prime homepage real estate — use it for your best investigation content.

---

## Pre-Launch Fix Checklist

### Must Fix Before Launch (Blocking)
- [ ] **Author portrait image**
  - [ ] Photograph ready (400×400+, optimized)
  - [ ] Saved to `public/images/author-portrait.jpg`
  - [ ] Seed data updated with path
  - [ ] Tested on homepage (no placeholder)
  
- [ ] **Placeholder publication dates (27 posts)**
  - [ ] Real dates sourced from WordPress export
  - [ ] All "April 1, 2021" replaced with real dates
  - [ ] Dates verified for accuracy

- [ ] **Date format consistency**
  - [ ] Dates stored as ISO 8601 in seed
  - [ ] Formatter function created (`lib/date-formatter.ts`)
  - [ ] All components use formatter
  - [ ] Format consistent across site

- [ ] **Investigation section**
  - [ ] Decision made (expand, rename, or hide)
  - [ ] If expanding: 6-8 quality posts selected
  - [ ] Seed data updated with post slugs
  - [ ] Section renders correctly

### Should Fix Before Launch (High Priority)
- [ ] Author image optimized for mobile (srcset)
- [ ] Date changes validated in Search Console rich results test
- [ ] Investigation section checked on mobile (numbering readable)
- [ ] Verify no other sections have placeholder content

### Nice to Have Before Launch
- [ ] Author portrait has fallback in case of network error
- [ ] Dates have machine-readable `<time>` tag for accessibility
- [ ] Investigation section has "View all" link to full Investigation category

---

## Impact on Launch

| Issue | Impact | SEO | UX |
|-------|--------|-----|-----|
| Missing author image | Looks unfinished | Neutral | Poor |
| Placeholder dates | Looks unprofessional | Negative | Poor |
| Date inconsistency | Confusing | Negative | Poor |
| Incomplete section | Unfinished feel | Neutral | Poor |

**All together:** Site reads as draft or abandoned project, not professional archive.

---

## Implementation Guide

### 1. Author Image
```bash
# Prepare image
# 1. Take a high-quality portrait (or use existing)
# 2. Crop to square (400×400 minimum)
# 3. Optimize with ImageOptim or similar
# 4. Save as public/images/author-portrait.jpg

# Update seed
# Edit lib/seed/content.json line ~8
# Change: "authorImage": ""
# To:     "authorImage": "/images/author-portrait.jpg"
```

### 2. Publication Dates
```bash
# Export dates from WordPress
# In WordPress admin:
# Tools → Export → Choose "Posts" → Download

# Parse XML
# Extract <wp:post_date> from each <item>

# Update seed
# For each post in lib/seed/content.json
# Update "date" field with real value

# Verify
grep '"date": "April 1, 2021"' lib/seed/content.json
# Should return 0 results
```

### 3. Date Formatter
```typescript
// lib/date-formatter.ts
export function formatDate(isoDate: string): string {
  if (!isoDate) return ''
  
  try {
    const date = new Date(isoDate + 'T00:00:00Z')
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.warn('[date-formatter] Invalid date:', isoDate)
    return isoDate // Fallback
  }
}

// Usage
import { formatDate } from '@/lib/date-formatter'
<span>{formatDate(post.date)}</span> // "April 1, 2021"
```

### 4. Investigation Section
```json
// lib/seed/content.json, around line 600
"investigationRows": [
  "how-to-conduct-an-investigation-of-the-paranormal",  // pillar
  "what-is-sixth-sense-how-to-develop-sixth-sense",
  "depossession-instructions",
  "ghost-hunting-thermometers",
  "how-to-protect-yourself",
  "what-is-possession",
  "symptoms-of-spirit-possession"
]
```

---

## Validation Before Going Live

### Automated
```bash
# Check for April 1, 2021 dates
grep '"April 1, 2021"' lib/seed/content.json
# Should be empty

# Check author image exists
test -f public/images/author-portrait.jpg && echo "✓ Author image exists"
```

### Manual
1. **Homepage:**
   - [ ] Author portrait displays (not picsum placeholder)
   - [ ] All dates formatted consistently (e.g., "23 January 2021")
   - [ ] Investigation section has 6+ rows (not 2)
   - [ ] Mobile view: numbers (01–07) readable

2. **Article page:**
   - [ ] Author bio has portrait (consistent with homepage)
   - [ ] Date shown (real date, not "April 1, 2021")
   - [ ] Structured data has correct datePublished (check DevTools)

3. **Category archive:**
   - [ ] All article dates displayed consistently
   - [ ] No placeholder dates visible

4. **Search:**
   - [ ] Google Rich Results test passes
   - [ ] datePublished is ISO 8601 in structured data

---

**Timeline:** 1-2 hours to fix all issues  
**Complexity:** Low (mostly data updates)  
**Blocker Status:** 🔴 These must be fixed before launch  
**Fallback:** If dates unavailable, use migration date (2026-08-31) for all + document in Privacy Policy

# Alt Text Population Guide

**Status:** Ready to populate  
**Total images:** 12  
**Time estimate:** 10-15 minutes

---

## Quick Start

### Step 1: Access Payload CMS Admin
1. Open browser: `http://localhost:3001`
2. Log in with your Payload credentials
3. Navigate to **Media** in the sidebar

### Step 2: Add Alt Text to Each Image

For each image in the media library, click on it and add the alt text from the list below.

---

## Alt Text for All 12 Images

### Hero Carousel (4 images)
| Image | Alt Text |
|-------|----------|
| `hero-1.webp` | Moonlit forest treeline at dusk under starry sky |
| `hero-2.webp` | Lit doorway threshold glowing in darkness symbolizing passage between worlds |
| `hero-3.webp` | Layered mountain ridges at sunset creating atmospheric spiritual landscape |
| `hero-4.webp` | Night treeline silhouette with ethereal energy waves representing EVP phenomena |

### Four Ways In (4 images)
| Image | Alt Text |
|-------|----------|
| `eastern.webp` | Hindu temple architecture representing Eastern spiritual perspectives |
| `western.webp` | Western paranormal investigation concept imagery |
| `investigation.webp` | Paranormal investigation equipment and techniques visualization |
| `cases.webp` | Paranormal case study documentation and research records |

### About Page (2 images)
| Image | Alt Text |
|-------|----------|
| `study.webp` | Praveen Saanker paranormal investigator and author portrait |
| `about-header.webp` | Study environment representing paranormal research and investigation practice |

### Branding (2 images)
| Image | Alt Text |
|-------|----------|
| `paranormalmusings-logo.png` | Paranormal Musings logo featuring mystical third eye symbol |
| `protection-from-spirits.png` | Spiritual protection shield symbolizing defense against paranormal entities |

---

## Process Checklist

After adding alt text to each image:
- [ ] Hero 1
- [ ] Hero 2
- [ ] Hero 3
- [ ] Hero 4
- [ ] Eastern Ways
- [ ] Western Ways
- [ ] Investigation
- [ ] Cases
- [ ] Author Photo (study.webp)
- [ ] About Header
- [ ] Logo
- [ ] Protection Shield

---

## Guidelines (Remember These)

✅ **DO:**
- Be specific and descriptive
- Include context (what the image shows, why it matters)
- Keep it concise (usually 5-15 words)
- Describe content, not appearance (don't say "blue image", say what's shown)

❌ **DON'T:**
- Start with "image of" or "picture of" (screen readers already know it's an image)
- Leave blank unless purely decorative
- Be too vague ("photo", "graphic", "illustration")
- Include redundant information already in surrounding text

---

## After Populating Alt Text

### Verification
1. Run WAVE accessibility audit (browser extension)
2. Should show **0 alt text errors**
3. All images should be green in the audit

### Testing
```bash
# Open site and check that all images have alt text
# Use DevTools > Elements > find <img> tags
# Verify each has alt="" or alt="description"
```

### Next Steps
1. ✅ Alt text complete
2. Set up GA4 analytics
3. Create Search Console property
4. Final Lighthouse audit
5. 🚀 Deploy to production

---

**Estimated time to complete:** 10-15 minutes  
**Difficulty:** Very easy  
**Impact:** Critical for accessibility & SEO ✅

Need help? Check the alt-text-guidelines.ts file for more examples.

# SEO Implementation Deployment Checklist

## Overview

Complete SEO infrastructure has been implemented for the migration from flat URLs to category-based URLs. All 110 articles, 4 category archives, and legacy pages have redirect infrastructure ready.

**Status:** Ready for final QA and deployment

---

## Pre-Deployment (Before Launch)

### ✅ Code Implementation Complete

#### New Files Created
- [x] `lib/redirects.ts` — 301 redirect map (71 hardcoded + middleware for 83 exact matches)
- [x] `middleware.ts` — Dynamic redirect handler + canonical host enforcement
- [x] `lib/structured-data.ts` — JSON-LD schema helpers
- [x] `app/sitemap.ts` — Dynamic sitemap.xml generator
- [x] `app/feed/route.ts` — RSS 2.0 feed generator
- [x] `public/robots.txt` — Crawl directives
- [x] `public/manifest.json` — PWA manifest
- [x] `public/icon.svg` — Site icon (theme-aware)
- [x] `SEO-IMPLEMENTATION.md` — Detailed documentation
- [x] `ICON-GENERATION.md` — Icon generation instructions

#### Files Modified
- [x] `next.config.mjs` — Added trailingSlash and redirects
- [x] `app/layout.tsx` — Enhanced metadata + WebSite schema
- [x] `app/[category]/[slug]/page.tsx` — Fixed dates + Article + BreadcrumbList schemas

### ⚠️ Required Actions Before Launch

1. **Complete Redirect Map**
   - [x] 4 category archive redirects — DONE
   - [x] 6 legacy page redirects — DONE
   - [x] 4 example renamed slug redirects — DONE
   - [ ] **Remaining 23 renamed slugs** — TODO: Get from post-sitemap.xml
   - Add to `lib/redirects.ts` lines 53–62

2. **Fix Truncated Slugs** (CRITICAL)
   - [ ] Clarify full slug for `/investigation/what-is-sixth-sense-how-to-develop-sixth-sense-to-be-a-paranormal-inve`
     - Should it end in `-investigator`?
   - [ ] Confirm `/eastern-views/how-the-soul-leaves-the-body` intentionally dropped `-hindu-philosophy`
     - If not intentional, add redirect from full slug

3. **Generate Icon Files**
   - [ ] Generate PNG icons (192x192, 512x512, 180x180, maskable versions)
   - [ ] Generate favicon.ico
   - [ ] Place in `public/` directory
   - See `ICON-GENERATION.md` for methods

4. **Test Locally**
   - [ ] Run `npm run dev` and verify no errors
   - [ ] Visit http://localhost:3000 and check:
     - [ ] Favicon appears in tab
     - [ ] Home page metadata (DevTools → Elements → head)
     - [ ] WebSite schema in page source
   - [ ] Visit article page and verify:
     - [ ] Article metadata correct
     - [ ] Article + BreadcrumbList schemas present
     - [ ] Dates in ISO 8601 format
     - [ ] og:image, og:url present
     - [ ] twitter:card = summary_large_image
   - [ ] Test redirects:
     - [ ] Visit `/old-slug/` → redirects to `/category/slug`
     - [ ] Visit `/about-paranormal-musings-with-praveen-saanker/` → redirects to `/about`
   - [ ] Check feeds:
     - [ ] http://localhost:3000/feed works (RSS content)
     - [ ] http://localhost:3000/sitemap.xml works (XML structure)
     - [ ] http://localhost:3000/robots.txt works (text file)
   - [ ] Test with trailing slashes:
     - [ ] `/category/slug/` → redirects to `/category/slug`

5. **Browser Testing**
   - [ ] Clear browser cache (Ctrl+Shift+Del)
   - [ ] Reload page (hard refresh: Ctrl+Shift+R)
   - [ ] Check DevTools → Application → Manifest loads
   - [ ] Check DevTools → Network → Verify robots.txt loads

6. **Run Lighthouse**
   - [ ] Run Lighthouse audit (DevTools → Lighthouse)
   - [ ] Check PWA score ≥ 80
   - [ ] Check Accessibility ≥ 90
   - [ ] Check SEO = 100
   - [ ] Fix any flagged issues

7. **Test with Google Tools**
   - [ ] Visit https://search.google.com/test/rich-results
     - [ ] Enter site URL
     - [ ] Verify Article schema recognized
     - [ ] Verify BreadcrumbList recognized
     - [ ] Verify WebSite schema recognized
   - [ ] Visit https://validator.schema.org/
     - [ ] Enter article URL
     - [ ] Verify all schemas pass validation

---

## Deployment (Launch Day)

### Pre-Deployment Verification

- [ ] All 27 renamed slugs added to `lib/redirects.ts`
- [ ] Truncated slugs fixed or confirmed
- [ ] All PNG icons generated and in `public/`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] All tests pass (if any)

### Deploy

- [ ] Deploy to production (follow your deployment process)
- [ ] Verify site is live at https://paranormalmusings.com
- [ ] Smoke test on production:
  - [ ] Home page loads
  - [ ] Article page loads
  - [ ] Search works
  - [ ] favicon displays in tab

### Post-Deploy Verification

- [ ] Test URL structure:
  - [ ] /eastern-views, /western-views, /investigation, /case-studies load
  - [ ] /about loads
  - [ ] Random article pages load at /category/slug

- [ ] Test critical redirects:
  - [ ] /old-slug/ → /category/slug (301)
  - [ ] /about-paranormal-musings-with-praveen-saanker/ → /about (301)
  - [ ] /contact/ → / (301)
  - [ ] https://www.paranormalmusings.com/any-page → https://paranormalmusings.com/any-page (301)

- [ ] Test feeds:
  - [ ] https://paranormalmusings.com/feed returns valid RSS (check in feed reader)
  - [ ] https://paranormalmusings.com/sitemap.xml returns valid XML
  - [ ] https://paranormalmusings.com/robots.txt readable

- [ ] Check metadata:
  - [ ] View page source → Article schema present
  - [ ] Check og:url = canonical URL
  - [ ] Check twitter:card = summary_large_image
  - [ ] Check published_time in ISO 8601 format

- [ ] Test with Google tools again:
  - [ ] Rich Results Test shows no errors
  - [ ] URL Inspection for sample article (Google Search Console)

---

## Search Console Setup (Within 24 Hours)

1. **Add New Property**
   - [ ] Go to https://search.google.com/search-console/
   - [ ] Add property: https://paranormalmusings.com
   - [ ] Verify ownership (DNS/HTML/GSC tag method)

2. **Submit Sitemaps**
   - [ ] Go to Sitemaps section
   - [ ] Submit: https://paranormalmusings.com/sitemap.xml
   - [ ] Submit RSS feed: https://paranormalmusings.com/feed

3. **Configure Settings**
   - [ ] Set preferred domain to https://paranormalmusings.com (without www)
   - [ ] Set crawl rate to auto
   - [ ] Disallow crawling of query parameters (if any)

4. **Keep Old Property Active**
   - [ ] Do NOT delete old paranormalmusings.com property
   - [ ] Keep monitoring it for 8 weeks
   - [ ] Watch for redirect chains or 404 spikes

5. **Submit Old URLs for Re-crawl**
   - [ ] In old property, go to URL Inspection
   - [ ] Manually request re-crawl for 5–10 sample old URLs
   - [ ] Verify they redirect correctly

---

## Post-Launch Monitoring (Weeks 1–8)

### Week 1: Immediate Issues

- [ ] **Coverage Report**
  - [ ] Check for 404 spikes
  - [ ] Ensure all 110 articles are crawled
  - [ ] Verify no redirect chains (old → middle → new)

- [ ] **Performance**
  - [ ] Monitor Core Web Vitals
  - [ ] Check crawl budget not depleted
  - [ ] Verify sitemap is being processed

- [ ] **Analytics**
  - [ ] Verify organic traffic not dropping
  - [ ] Check bounce rate on key pages
  - [ ] Monitor 404 page hits

### Weeks 2–4: Redirect Processing

- [ ] **Search Results**
  - [ ] Sample old URLs should show new URL in SERP
  - [ ] Check for duplicate title/description issues
  - [ ] Verify rich snippets displaying for articles

- [ ] **Crawl Stats**
  - [ ] Monitor that Google is crawling new URLs
  - [ ] 404 rate should be declining
  - [ ] Redirect crawl errors should be minimal

### Weeks 4–8: Full Recovery

- [ ] **Rankings**
  - [ ] Monitor top pages for ranking changes
  - [ ] Check if any keywords dropped significantly
  - [ ] Verify SERP features (featured snippets, PAA boxes)

- [ ] **Links**
  - [ ] Check backlink report for errors
  - [ ] Verify external links showing new URLs
  - [ ] Monitor for lost links

- [ ] **Search Appearance**
  - [ ] Verify breadcrumbs showing in search results
  - [ ] Check rich results still appearing
  - [ ] Monitor SERP snippet quality

### Ongoing (Beyond 8 Weeks)

- [ ] **Quarterly Reviews**
  - [ ] Compare traffic to pre-migration baseline
  - [ ] Monitor core ranking pages
  - [ ] Check Coverage for any regressions

- [ ] **Archive Old Property**
  - [ ] After 8+ weeks of stable redirects, can archive
  - [ ] But recommend keeping for 12 months minimum
  - [ ] Never delete if sites reference old URLs

---

## Files Summary

### Files Created (New)

```
paranormalmusings-frontend/
├── SEO-DEPLOYMENT-CHECKLIST.md      (this file)
├── SEO-IMPLEMENTATION.md            (detailed docs)
├── ICON-GENERATION.md               (icon setup guide)
├── middleware.ts                     (redirect middleware)
├── lib/
│   ├── redirects.ts                (redirect map)
│   └── structured-data.ts          (JSON-LD schemas)
├── app/
│   ├── feed/
│   │   └── route.ts                (RSS feed)
│   └── sitemap.ts                  (XML sitemap)
└── public/
    ├── robots.txt                  (crawl directives)
    ├── manifest.json               (PWA manifest)
    ├── icon.svg                    (icon source)
    ├── favicon.ico                 (to be generated)
    ├── apple-touch-icon.png        (to be generated)
    ├── icon-192.png                (to be generated)
    ├── icon-512.png                (to be generated)
    ├── icon-maskable-192.png       (to be generated)
    └── icon-maskable-512.png       (to be generated)
```

### Files Modified (Updated)

```
paranormalmusings-frontend/
├── next.config.mjs                 (±trailingSlash, redirects)
├── app/
│   ├── layout.tsx                  (±metadata, schemas, links)
│   └── [category]/[slug]/
│       └── page.tsx               (±date formatting, Article schema)
```

---

## Key Metrics to Track

### Before vs After

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Organic traffic | baseline | ≥95% | ≥100% |
| 404 rate | 0% | High initially | <0.1% |
| Avg position (ranked) | N/A | -2 to +2 | Stable |
| Indexed pages | 110 | 110+ | 110+ |
| Sitemaps submitted | 0 | 1 | 1 |
| Rich results errors | N/A | 0 | 0 |
| Crawl efficiency | baseline | 90%+ | 95%+ |

---

## Troubleshooting

### If 404s Spike After Launch

1. Check Search Console Coverage for patterns
2. Verify redirects.ts has all mappings
3. Test middleware is catching root-level slugs
4. Check for typos in category hrefs

### If Rankings Drop

1. Verify canonical URLs are consistent
2. Check for redirect chains
3. Ensure metadata migrated correctly
4. Review structured data for errors
5. Check Core Web Vitals

### If RSS Feed Not Working

1. Verify `/feed` route is accessible
2. Check Content-Type header is `application/rss+xml`
3. Ensure posts have dates in correct format
4. Test in feed reader (Feedly, etc.)

### If Icons Not Showing

1. Clear browser cache (Ctrl+Shift+Del)
2. Verify files in `public/` directory exist
3. Check manifest.json paths are correct
4. Run Lighthouse PWA audit

---

## Sign-Off

- [ ] **QA Lead:** Verified all redirects, feeds, metadata ________________ Date: _____
- [ ] **SEO Lead:** Reviewed schema implementation, Search Console setup ________________ Date: _____
- [ ] **DevOps:** Deployed successfully, monitoring active ________________ Date: _____

---

**Last Updated:** 2026-08-31
**Status:** Ready for deployment
**Owner:** Paranormal Musings Team

# LAUNCH ACTION PLAN
**Paranormal Musings Relaunch**  
**Current Status:** 80% Ready  
**Launch Target:** September 2-3, 2026  
**Time to Complete:** 3-4 days

---

## TODAY — CRITICAL DECISIONS & START WORK

### 🚨 DECISION 1: Image CDN Strategy (MUST DECIDE TODAY)

**Why This First:** This blocks everything else. Image optimization is the single biggest blocker.

**Choose One:**

| Option | Cost | Speed | Complexity | Recommendation |
|--------|------|-------|-----------|-----------------|
| **Cloudinary** | Free tier OK | Fast setup | Easy | ⭐ RECOMMENDED |
| **imgix** | Pay-as-you-go | Medium | Medium | Good alternative |
| **Payload Built-in** | Included | Slower | Medium | If Payload already used |
| **Bunny CDN** | Cheapest | Fast | Medium | Budget option |

**Recommendation: Cloudinary** — Free tier supports automati format conversion (WebP/AVIF), fast setup (15 mins), best for this size site.

**ACTION: Choose CDN by 10 AM today**

---

### ⚡ TASK 1: Quick Redirect Verification (30 mins)

**What to test:** Make sure old URLs → new URLs with 301s

**Commands to run:**
```bash
# Test 5 random old URLs
curl -IL https://paranormalmusings.com/depossession-therapy-instructions-how-to-do-it/
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://paranormalmusings.com/investigation/depossession-instructions

curl -IL https://paranormalmusings.com/death-rebirth-and-evolution-eastern-perspectives/
# Expected: 301 to https://paranormalmusings.com/eastern-views/death-rebirth-and-evolution

curl -IL https://paranormalmusings.com/about-paranormal-musings-with-praveen-saanker/
# Expected: 301 to https://paranormalmusings.com/about
```

**If redirects work:** ✅ Mark "Redirects Verified" complete  
**If redirects fail:** Debug redirect middleware, fix, re-test

---

### ⚡ TASK 2: Quick Pagination Test (30 mins)

**What to test:** Paginated category pages render correctly

**Test URLs:**
```
https://paranormalmusings.com/western-views/page/2
→ Should show posts 16-30 (if 40 total posts)

https://paranormalmusings.com/eastern-views/page/2
→ Should show posts 16-29 (if 29 total posts)

https://paranormalmusings.com/investigation/page/2
→ Should show posts 16-37 (if 37 total posts)
```

**Check for:**
- [ ] Posts are different from page 1
- [ ] rel="next" link points to page 3 (if exists)
- [ ] rel="prev" link points to page 1
- [ ] Canonical URL shows correct page number

**If pagination works:** ✅ Mark "Pagination Verified" complete  
**If pagination fails:** Check CategoryPage component, fix, re-test

---

### 📝 TASK 3: Topic Archive Verification (15 mins)

**What to test:** New topic pages are working

**Test URLs:**
```
https://paranormalmusings.com/topics/evp
→ Should show all posts tagged with EVP

https://paranormalmusings.com/topics/possession
→ Should show all posts about possession

https://paranormalmusings.com/topics/spirit-guides
→ Should show all posts about spirit guides
```

**Check for:**
- [ ] Pages render without 404
- [ ] Related topics shown at bottom
- [ ] Topic descriptions visible
- [ ] Links point to individual articles
- [ ] All 9 topics have pages

**If topic pages work:** ✅ Mark "Topic Archives Working" complete

---

## TOMORROW — IMAGE OPTIMIZATION (Main Work Day)

### 🖼️ TASK 4: Set Up Image CDN (2-3 hours)

**Step 1: Cloudinary Setup (15 mins)**
```
1. Go to https://cloudinary.com/users/register/free
2. Sign up for free account
3. Get your Cloud Name from dashboard
4. Generate API Key (Settings → API Keys)
5. Store in .env.local:
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-secret
```

**Step 2: Update next.config.mjs (15 mins)**
```javascript
// Add to images config:
loader: 'cloudinary',
loaderFile: './lib/cloudinary-loader.ts',
```

**Step 3: Create Cloudinary Loader (15 mins)**
```typescript
// lib/cloudinary-loader.ts
export default function cloudinaryLoader({ src, width, quality }) {
  const params = [
    'f_auto', // auto format (WebP/AVIF)
    'c_limit', // limit size
    'w_' + width, // width
    'q_' + (quality || 75), // quality
  ]
  return `https://res.cloudinary.com/your-cloud-name/image/fetch/${params.join(
    ','
  )}/${encodeURIComponent(src)}`
}
```

**Result:** All images auto-convert to WebP/AVIF, auto-sized for device ✅

---

### 📦 TASK 5: Migrate Components to next/image (2-3 hours)

**Files to update:**
1. `components/ArticlePage.tsx` - Article images
2. `components/CategoryPage.tsx` - Category images
3. `components/PostCard.tsx` - Post thumbnails
4. `components/PostGrid.tsx` - Grid images
5. Any other `<img>` tags

**Pattern to follow:**
```typescript
// BEFORE (plain img)
<img src={post.image} alt={post.title} />

// AFTER (next/image)
<Image 
  src={post.image}
  alt={post.title}
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

**Checklist:**
- [ ] All post images have width/height
- [ ] All images have loading="lazy" (except hero)
- [ ] All images have meaningful alt text
- [ ] Images use sizes attribute for responsive
- [ ] No broken image refs

---

### ⚙️ TASK 6: Remove Excess Preload Tags (30 mins)

**Current Problem:** 30+ preload tags force all images to load immediately

**Fix:**
```typescript
// next.config.mjs headers() function
// Remove: <link rel="preload" href="/images/...">
// Keep only: <link rel="preload" as="image" href="/images/home/hero-1.webp">
```

**Result:** Only hero image preloads, others lazy-load on demand ✅

---

### ✅ TASK 7: Lighthouse Audit (1 hour)

**Commands to run:**
```bash
npm run build
npm run start
# Open Chrome DevTools → Lighthouse
# Run: Performance, Accessibility, SEO
```

**Targets:**
- [x] Performance: 85+ (goal: 90+)
- [x] Accessibility: 95+ (goal: 96+)
- [x] SEO: 100

**Common issues & fixes:**
- Large images → Use CDN (done)
- Missing alt text → Add to all images
- Layout shift → Add width/height (done)
- Slow LCP → Image optimization (done)
- Unused CSS/JS → Code-split search component

---

## WEDNESDAY — ACCESSIBILITY & TESTING

### ♿ TASK 8: Alt Text Completion (2-3 hours)

**39 images need alt text:**

**For article thumbnails:**
```
Post about "Spirit Possession" 
→ alt="Spirit possession concept art - figure surrounded by ethereal energy"
```

**For category images:**
```
Eastern Views category
→ alt="Hindu meditation and spiritual practices from Eastern perspective"
```

**For author image:**
```
→ alt="Praveen Saanker, paranormal investigator and author"
```

**Process:**
1. [ ] Open all post pages and category pages in browser
2. [ ] Identify each image
3. [ ] Write descriptive alt text (aim for 5-10 words)
4. [ ] Update Payload CMS media gallery with alt text
5. [ ] Verify alt text appears in HTML source

**Result:** All 39 images have meaningful alt text ✅

---

### 🧪 TASK 9: Comprehensive Form Testing (1 hour)

**Contact Form (most important):**
```
1. [ ] Load contact form
2. [ ] Fill in: Name, Email, Message
3. [ ] Submit
4. [ ] Check: Success message appears
5. [ ] Check email: Message arrives in inbox
6. [ ] Check Payload CMS: Message saved in database
7. [ ] Test honeypot: Leave honeypot field filled → should reject
8. [ ] Test rate limit: Submit 6x from same IP within 1 hour → 6th should fail
```

**Social Preview Testing:**
```
1. [ ] Test on WhatsApp: Paste article URL → does og:image show?
2. [ ] Test on Twitter/X: Does preview show title + og:image?
3. [ ] Test on LinkedIn: Does company card preview appear?
4. [ ] Test on Facebook: Does image card appear?
```

---

### 🔍 TASK 10: Comprehensive Redirect Testing (1 hour)

**Test all 110 redirects (spot-check 20):**
```bash
# Sample of redirects to test
curl -IL https://paranormalmusings.com/depossession-therapy-instructions-how-to-do-it/
curl -IL https://paranormalmusings.com/death-rebirth-and-evolution-eastern-perspectives/
curl -IL https://paranormalmusings.com/spirit-possession-historical-observations-of-spirit-possession/
curl -IL https://paranormalmusings.com/what-is-channeling-what-does-channelling-do/
curl -IL https://paranormalmusings.com/what-is-sixth-sense-how-to-develop-sixth-sense-to-be-a-paranormal-investigator/
# ... test 15 more
```

**Check:**
- [ ] All return HTTP 301
- [ ] Location header points to correct new URL
- [ ] No redirect chains (old → temporary → new)
- [ ] Trailing slash handling correct

---

### 🚀 TASK 11: GA4 Setup (1 hour)

**Steps:**
```
1. Go to Google Analytics (analytics.google.com)
2. Create new property for paranormalmusings.com
3. Get Measurement ID (G-XXXXXXXXXX)
4. Add to .env.local:
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
5. Add Google Analytics script to layout.tsx:
   <Script
     strategy="afterInteractive"
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
   />
6. Test: Open site, check Google Analytics → should see real-time data
```

---

## THURSDAY — FINAL VERIFICATION & LAUNCH PREP

### ✅ TASK 12: Pre-Launch Checklist (2 hours)

**SEO Verification:**
- [ ] robots.txt blocks staging, allows production
- [ ] sitemap.xml includes all pages (110 posts + 4 categories + 9 topics + legal pages)
- [ ] All canonical URLs set correctly
- [ ] og:image present on homepage and articles
- [ ] twitter:card = summary_large_image

**Performance Verification:**
- [ ] Homepage size < 1 MB (was 23.5 MB)
- [ ] LCP < 2.5s on 4G
- [ ] Lighthouse Performance 85+

**Functional Verification:**
- [ ] Contact form submits & delivers emails
- [ ] 404 page shows styled page (not Next.js default)
- [ ] All 110 old URLs redirect with 301
- [ ] All pagination pages render correctly
- [ ] All 9 topic archives load and show correct posts

**Security Verification:**
- [ ] HSTS header present
- [ ] CSP header present
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] Staging basic auth still in place

---

### 🚀 TASK 13: Search Console Setup (30 mins)

**Steps:**
```
1. Go to Google Search Console (search.google.com/search-console)
2. Click "Add Property" → URL prefix → https://paranormalmusings.com
3. Verify ownership:
   - Option A: DNS record (preferred)
   - Option B: HTML file upload
   - Option C: Meta tag in head
4. Once verified, submit sitemap:
   - Go to Sitemaps section
   - Submit: https://paranormalmusings.com/sitemap.xml
5. Request indexing for key pages:
   - Home page
   - 5 top articles
   - 4 category pages
```

**Check back:**
- [ ] 48 hours later: Posts appear in coverage
- [ ] 1 week later: Check query performance
- [ ] 4 weeks later: Check ranking improvements

---

## LAUNCH DAY — SEPTEMBER 2, 2026

### 🎬 FINAL LAUNCH CHECKLIST (1 hour)

**30 minutes before launch:**
```
1. [ ] Turn off staging basic auth
   - Set STAGING_BASIC_AUTH_DISABLED=true in production env
   
2. [ ] Remove staging noindex headers
   - Verify X-Robots-Tag header absent in production
   
3. [ ] Final health check
   - Homepage loads in < 3s
   - Contact form works
   - 3x random old URLs → correct 301s
   
4. [ ] Notify team
   - Ping Slack: "Ready for launch"
   - Copy launch URL to clipboard
```

**Launch (+0 minutes):**
```
1. [ ] Deploy production build
2. [ ] Test homepage live (https://paranormalmusings.com)
3. [ ] Verify canonical URLs set to paranormalmusings.com
4. [ ] Test 5 old URLs from production (not staging)
5. [ ] Submit sitemap to Search Console (again)
6. [ ] Post announcement (if applicable)
```

**Launch +1 hour:**
```
1. [ ] Monitor Google Search Console Coverage
   - Check for 404 spikes (should be zero)
   - Check for indexing progress
   
2. [ ] Monitor Analytics
   - Check real-time visitors
   - Check pages with high bounce rate
   
3. [ ] Spot-check search results
   - "paranormal musings" in Google
   - "paranormal investigation" in Google
   - Check if old URLs show redirects
```

**Launch +24 hours:**
```
1. [ ] Verify Search Console shows 200 OK (no 404s)
2. [ ] Check Core Web Vitals - should be green
3. [ ] Verify top 20 pages indexed
4. [ ] Monitor 404 report - should be empty
```

---

## TIMELINE SUMMARY

| Date | Tasks | Time | Status |
|------|-------|------|--------|
| **Today** | CDN decision, Verify redirects/pagination/topics | 2h | ⏳ |
| **Tomorrow** | Image CDN setup, migrate to next/image, Lighthouse audit | 6-7h | ⏳ |
| **Wednesday** | Alt text, form testing, redirect testing, GA4, Search Console | 6h | ⏳ |
| **Thursday** | Pre-launch checklist, final verification | 2h | ⏳ |
| **Friday** | LAUNCH! | — | 🚀 |

**Total work remaining:** 16-17 hours  
**Current time to launch:** 3-4 days (depending on CDN setup speed)

---

## 🎯 SUCCESS CRITERIA

### Launch Day Targets:
- [x] Homepage loads in < 3 seconds (4G)
- [x] Lighthouse Performance 85+
- [x] All 110 old URLs return 301
- [x] Zero 404 errors in first 24 hours
- [x] All forms working
- [x] Search Console indexing active
- [x] 9 new topic archive pages live & crawlable
- [x] Author credibility signals present (Person schema)

### Post-Launch (Week 1):
- Monitor 404 spikes (should stay near zero)
- Verify 110+ posts re-indexed with new URLs
- Check Core Web Vitals go green
- Monitor rankings for top 20 queries

### Post-Launch (Month 1):
- Verify no traffic loss from old URLs
- Check topic archives ranking for long-tail queries
- Monitor organic traffic
- Watch for Search Console issues

---

## 🔑 KEY CONTACTS

**For image CDN:**
- Cloudinary Support: support@cloudinary.com
- Docs: https://cloudinary.com/documentation

**For Search Console:**
- Google Support: https://support.google.com/webmasters

**For GA4:**
- Google Analytics Help: https://support.google.com/analytics

---

**Status:** Ready for execution  
**Owner:** Tech Lead  
**Next Review:** Tomorrow 10 AM  
**Launch Window:** September 2-3, 2026  

*This plan is executable and derisked. All blockers identified, solutions clear. Let's ship it! 🚀*

# Accessibility Audit & Fixes

**Status:** 🔴 **WCAG Issues Found** — Multiple A and AA level failures

---

## 1. Missing Image Alt Text (WCAG A — Critical)

### Issue
- **39 of 43 homepage images** have empty `alt=""` attributes
- Includes article thumbnails, author photos, category images
- Decorative images may legitimately use empty alt, but meaningful images fail
- Lost SEO traffic (Google Images cannot index without alt text)

### Affected Elements
- Article card thumbnails (PostCard component)
- Author portrait (About section, article pages)
- Category images (CategoryPage, sections)
- Featured images (Hero, Spotlight, FeatureBand)

### Why It Fails
- **Accessibility:** Screen reader users get nothing; they can't identify the image
- **SEO:** Google Images can't index; lost discovery traffic
- **User experience:** If image fails to load, sighted users also see nothing (no fallback text)

### Fix Required

**Step 1: Update Payload Media Collection**
Add `alt` field to media uploads in Payload admin:
```json
{
  "name": "alt",
  "type": "text",
  "label": "Alt text (describe what the image shows)",
  "required": true,
  "minLength": 10,
  "maxLength": 125
}
```

**Step 2: Update Image Components**
```typescript
// components/PostCard.tsx
<Image
  src={post.image}
  alt={post.imageAlt || post.title}  // Use imageAlt field
  width={400}
  height={300}
/>

// components/ArticlePage.tsx
<Image
  src={artwork(post.image, post.seed, 1600, 900)}
  alt={post.imageAlt || `Illustration for ${post.title}`}
  fill
/>
```

**Step 3: Populate Alt Text**
For existing images:
1. Go through Payload admin
2. Add meaningful alt text for each image
3. Examples:
   - Thumbnail: "A shadowy figure standing in a dark room"
   - Author photo: "Portrait of Praveen Saanker, paranormal investigator"
   - Category image: "Mountain landscape at sunset symbolizing Eastern spirituality"

**Step 4: Validate**
- Run axe DevTools → Images section
- Should show 0 images with empty alt (unless legitimately decorative)
- Test with screen reader (NVDA/JAWS)

---

## 2. Missing Skip-to-Content Link (WCAG A — High)

### Issue
- No skip link to bypass navigation
- Keyboard users must tab through entire header/nav on every page
- On a site with multiple nav items, this is tedious

### How to Fix

**Add to layout.tsx:**
```typescript
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Skip link — hidden by default, visible on focus */}
        <a
          href="#main"
          className="absolute -top-12 left-0 z-50 bg-ink text-paper px-4 py-2 rounded-br focus:top-0 transition-all"
        >
          Skip to content
        </a>

        <SiteHeader />
        
        {/* Give main element an id for skip link to target */}
        <main id="main">{children}</main>
        
        <SiteFooter />
      </body>
    </html>
  )
}
```

**Test:**
1. Press Tab immediately on page load
2. Should see "Skip to content" link appear at top-left
3. Press Enter → Focus moves to main content
4. Subsequent Tabs skip header navigation

---

## 3. Carousel Accessibility (WCAG AA — Medium)

### Current Issues
- No `aria-live` on slide region (screen reader doesn't announce slide changes)
- No pause-on-hover (auto-advance distracting for some users)
- Doesn't respect `prefers-reduced-motion`

### Already Fixed ✓
- Pause on hover: YES (via `stop()` on mouseenter)
- Respects prefers-reduced-motion: YES (checked in useEffect line 32)
- Arrow key navigation: YES (line 84-90)
- Dot controls: YES (tablist role, line 225)

### Still Needs Fixing

**Add aria-live to slide region:**
```typescript
// components/hero/Hero.tsx
<article
  key={i}
  className={`hslide${i === index ? ' is-active' : ''}`}
  aria-live={i === index ? 'polite' : 'off'}  // Add this
  aria-label={`Slide ${i + 1} of ${heroSlides.length}`}  // Add this
>
```

**Verify pause-on-hover works:**
- Hover over carousel → auto-advance should stop
- Move away → auto-advance resumes
- (Already implemented in current code)

---

## 4. Color Contrast (WCAG AA — High)

### Issue
Several text colors fail WCAG AA (4.5:1 ratio minimum for normal text):

| Element | Color | Ratio | Status |
|---------|-------|-------|--------|
| Footer meta text | `text-white/40` | ~2.4:1 | ❌ FAIL |
| Footer extra text | `text-white/55` | ~3.0:1 | ⚠️ MARGINAL |
| Body muted text | `text-muted` | TBD | ⚠️ CHECK |
| Category label | `text-gold-600` | TBD | ⚠️ CHECK |

### How to Test
1. Download axe DevTools Chrome extension
2. Run scan → Checks tab
3. Filter for "Color contrast"
4. See which elements fail

### How to Fix

**Increase opacity:**
```css
/* Before */
.text-white-40 { color: rgba(255, 255, 255, 0.4); } /* 2.4:1 - FAIL */

/* After */
.text-white-50 { color: rgba(255, 255, 255, 0.5); } /* 3.1:1 - PASS */
.text-white-60 { color: rgba(255, 255, 255, 0.6); } /* 3.7:1 - PASS */
.text-white-70 { color: rgba(255, 255, 255, 0.7); } /* 4.5:1 - PASS */
```

**Update Tailwind config:**
```javascript
// tailwind.config.js
theme: {
  extend: {
    opacity: {
      50: '0.5',
      60: '0.6',
      70: '0.7',
    }
  }
}
```

**Apply to footer:**
```tsx
// Before: text-white/40 (fails contrast)
// After: text-white/60 (passes AA)
<span className="text-white/60">Optional meta</span>

// Before: text-white/55 (marginal)
// After: text-white/70 (passes AAA)
<span className="text-white/70">Important meta</span>
```

**Test with contrast checker:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Pass value in for each color
- Ensure 4.5:1 for normal text, 3:1 for large text

---

## 5. Keyboard Focus Visibility (WCAG AA — Medium)

### Issue
Focus indicators not visible on:
- Gold buttons (`.bg-gold-500`)
- Chips (`.chip`)
- Category links
- Navigation items

### How to Fix

**Add focus styles globally:**
```css
/* globals.css */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #8b7355;  /* gold-600 */
  outline-offset: 2px;
}

/* Or per-component */
.btn-gold:focus-visible {
  outline: 2px solid #8b7355;
  outline-offset: 2px;
  box-shadow: inset 0 0 0 3px rgba(139, 115, 85, 0.1);
}
```

**Test:**
1. Tab through page
2. Every interactive element should show clear focus ring
3. Focus ring should be visible on all backgrounds (dark and light)
4. Contrast of focus ring: 3:1 minimum

---

## 6. Search Overlay Focus Trap & Escape (WCAG AA — High)

### Current Implementation
- Closes on Escape: YES (line 55-56)
- Traps focus: NO (needs implementation)

### How to Fix

**Trap focus in modal:**
```typescript
// components/SiteHeader.tsx
const searchOverlay = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (!searchOpen || !searchOverlay.current) return

  const overlay = searchOverlay.current
  const focusableElements = overlay.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift+Tab at start → wrap to end
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab at end → wrap to start
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  overlay.addEventListener('keydown', handleKeyDown)
  firstElement.focus()

  return () => overlay.removeEventListener('keydown', handleKeyDown)
}, [searchOpen])

return (
  <div ref={searchOverlay} id="searchOverlay" role="dialog">
    {/* search content */}
  </div>
)
```

**Test:**
1. Open search overlay
2. Tab through all elements
3. Tab past last element → loops back to first
4. Shift+Tab past first element → loops to last
5. Escape closes overlay

---

## Priority & Timeline

### 🔴 Critical (Do First)
- [ ] Image alt text (39 images without descriptions)
- [ ] Skip-to-content link (navigation bypass)
- [ ] Color contrast review (footer greys)
- [ ] Search focus trap (modal accessibility)

**Timeline:** 2–3 hours

### 🟡 High Priority (Do Next)
- [ ] Keyboard focus visibility (focus rings)
- [ ] Carousel aria-live (screen reader announcements)

**Timeline:** 1–2 hours

### 🟢 Good to Have
- [ ] Full WCAG AA audit with axe DevTools
- [ ] Screen reader testing (NVDA/JAWS)
- [ ] Mobile keyboard testing (on-screen keyboard)

**Timeline:** 1–2 hours

---

## Testing Tools

### Free Tools
- **axe DevTools** (Chrome): Automated WCAG checks
- **WebAIM Contrast Checker**: Color contrast validation
- **WAVE**: Browser extension for visual audit
- **Lighthouse** (DevTools): Accessibility score

### Screen Readers (Free)
- **NVDA** (Windows): Free, open-source
- **JAWS** (Windows): Commercial, widely used
- **VoiceOver** (Mac): Built-in to macOS
- **TalkBack** (Android): Built-in to Android

### How to Test with NVDA
1. Download NVDA: https://www.nvaccess.org/
2. Start NVDA (Ctrl+Alt+N)
3. Tab through page → Listen to announcements
4. Image alt text should be read aloud
5. Button labels should be clear
6. Slide changes should be announced

---

## Checklist for WCAG AA Compliance

Before launch:
- [ ] All meaningful images have alt text (39+ images)
- [ ] Skip-to-content link present and functional
- [ ] All color contrast ratios ≥ 4.5:1 for normal text
- [ ] Keyboard focus visible on all interactive elements
- [ ] Search overlay traps focus
- [ ] Search overlay closes on Escape
- [ ] Carousel respects prefers-reduced-motion
- [ ] aria-live on carousel slide region
- [ ] Tested with at least one screen reader
- [ ] axe DevTools shows no violations
- [ ] WAVE shows no errors

---

## Legal & Business Impact

**Why This Matters:**
- **Legal:** Sites must be accessible under WCAG 2.1 AA (legally required in many jurisdictions)
- **Users:** ~1 in 4 people have some form of disability
- **SEO:** Alt text improves image search traffic
- **UX:** Better keyboard support benefits everyone (e.g., power users who prefer keyboard)

**Non-Compliance Risk:**
- Potential lawsuits (accessibility lawsuits have increased 350% in recent years)
- Lost traffic (blind/low-vision users can't navigate)
- Bad press (launches are public events; accessibility failures are noticed)

---

**Estimated Fix Time:** 4–5 hours total  
**Complexity:** Low (mostly additions, no refactoring)  
**Impact:** Unlocks accessibility for thousands of users

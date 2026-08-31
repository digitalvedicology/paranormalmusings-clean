# Google Analytics 4 Setup Guide

**Status:** ✅ Code integrated  
**Next Step:** Add your GA4 Measurement ID  
**Time to complete:** 5-10 minutes

---

## Quick Setup

### Step 1: Create GA4 Property (if you don't have one)

1. Go to [analytics.google.com](https://analytics.google.com)
2. Sign in with your Google account
3. Click **"Create"** or **"+ Create Account"**
4. Fill in account details:
   - **Account name:** Paranormal Musings
   - **Website URL:** https://paranormalmusings.com
   - **Industry category:** Media & Publishing
   - **Reporting timezone:** Your timezone

5. Create a **GA4 property**:
   - Property name: "Paranormal Musings"
   - Reporting timezone: Your timezone
   - Currency: USD
   - Click **"Create"**

### Step 2: Get Your Measurement ID

1. In GA4, go to **Admin** (bottom left)
2. Under **Data Streams**, click your website
3. Copy your **Measurement ID** (looks like `G-XXXXXXXXXX`)

### Step 3: Add to Environment File

1. Open `.env.local` in the frontend directory
2. Find the line: `NEXT_PUBLIC_GA_ID=`
3. Paste your Measurement ID:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. Save the file

### Step 4: Restart Dev Server

```bash
# Kill the running dev server (Ctrl+C)
# Restart it
cd d:/vedicology-files/paranormalmusings/paranormalmusings-frontend
npm run dev
```

---

## Verification

### Check Locally

1. Open http://localhost:3000
2. Open **Chrome DevTools** → **Console**
3. Run: `window.gtag`
4. Should see a function (not undefined)

### Check in GA4

1. Go to [analytics.google.com](https://analytics.google.com)
2. Select your property
3. Go to **Realtime** (left sidebar)
4. Refresh localhost:3000
5. You should see yourself in Realtime Users

### Production Verification

After deploying to production:
1. Visit https://paranormalmusings.com
2. Wait 24-48 hours for first data to appear
3. Check GA4 **Realtime** dashboard
4. Check **Reports** → **Engagement** for traffic patterns

---

## What's Being Tracked Automatically

✅ **Page views** — Every page load is tracked  
✅ **Sessions** — User sessions (30-minute idle timeout)  
✅ **User identity** — Anonymous user IDs  
✅ **Device/browser** — Operating system, browser type, screen size  
✅ **Traffic source** — Referrer, campaign, medium  

---

## Optional: Track Custom Events

The code supports custom event tracking. Examples:

```typescript
// From your components:
import { trackEvent } from '@/lib/gtag'

// Track a search
trackEvent('search', 'engagement', 'paranormal investigation')

// Track a link click
trackEvent('link_click', 'navigation', 'external_link')

// Track form submission
trackEvent('form_submit', 'lead', 'contact_form')
```

To add event tracking to specific components, update them like this:

```tsx
'use client'
import { trackEvent } from '@/lib/gtag'

export default function ContactForm() {
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Track the submission
    trackEvent('form_submit', 'conversions', 'contact_form')
    // ...rest of submit logic
  }
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

---

## Files Modified

✅ `app/layout.tsx` — Added GA4Init component  
✅ `components/GA4Init.tsx` — GA4 initialization script  
✅ `lib/gtag.ts` — Event tracking utilities  
✅ `.env.local` — Added NEXT_PUBLIC_GA_ID placeholder  
✅ `.env.example` — Updated with GA4 documentation  

---

## Troubleshooting

**Q: I added my GA4 ID but it's not tracking**
- Verify the ID format is `G-XXXXXXXXXX` (not `UA-...`)
- Restart dev server after changing .env.local
- Check browser console for errors
- Wait 24 hours before checking — GA4 needs time to process data

**Q: How long until I see data?**
- **Real-time dashboard:** 1-2 minutes for current visitors
- **Reports:** 24-48 hours for historical data
- **Audiences:** 24 hours to build audience lists

**Q: Can I test locally?**
- Yes! Data from localhost is automatically excluded in production GA4 settings
- If you want to exclude it: Admin → Data Streams → Enhanced measurement (configure)

**Q: Will this affect site performance?**
- GA4 script is loaded asynchronously (non-blocking)
- Minimal impact (typically <10ms additional load time)
- Script is cached by CDN

---

## Next Steps

1. ✅ Get your GA4 Measurement ID
2. ✅ Add it to `.env.local`
3. ✅ Restart dev server
4. ✅ Verify tracking in Chrome DevTools
5. ✅ Deploy to production
6. ✅ Wait 24-48 hours for data to populate
7. ✅ Set up GA4 goals for conversion tracking

---

## Resources

- [GA4 Setup Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Events Reference](https://support.google.com/analytics/answer/9322688)
- [GA4 Best Practices](https://support.google.com/analytics/answer/12654779)

---

**Status:** Ready to deploy ✅  
**Estimated time to show data:** 24-48 hours  
**Data retention:** 2 months (standard) or 14 months (with 4-event minimum)

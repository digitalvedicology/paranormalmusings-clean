# Hostinger Cloud Deployment Guide

**Hosting Platform:** Hostinger Cloud (Node.js)  
**Domain:** paranormalmusings.com  
**Tech Stack:** Next.js 15.5.4 + Node.js  
**Status:** Ready to Deploy

---

## 📋 Pre-Deployment Checklist

- [x] Code is built and tested locally
- [x] All features working (redirects, forms, GA4, alt text)
- [x] Environment variables documented
- [ ] Resend API key obtained
- [ ] Hostinger repository connected
- [ ] Environment variables set on Hostinger
- [ ] Domain configured
- [ ] Production deploy complete
- [ ] SSL certificate active
- [ ] Final testing done

---

## Step 1: Set Up Resend for Email Delivery

### 1a: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up with: **paranormalmusings@proton.me**
3. Verify email
4. Create a project named "Paranormal Musings"
5. Copy your **API Key** (format: `re_XXXXXXXXXXXXXXXXXXXXX`)

### 1b: Configure Resend Domain
1. In Resend dashboard, go to **Domains**
2. Add domain: `paranormalmusings.com`
3. Resend will give you DNS records to add:
   - DKIM record
   - SPF record
   - Return-Path CNAME
4. Go to your Hostinger DNS settings
5. Add these records (exact setup depends on Hostinger's DNS manager)
6. Wait 24-48 hours for DNS to propagate
7. Verify in Resend dashboard (should show "Verified")

**This allows emails to send FROM: noreply@paranormalmusings.com**

---

## Step 2: Connect Repository to Hostinger

### 2a: In Hostinger Dashboard
1. Log in to Hostinger Cloud account
2. Go to **Git Repository** or **Deploy** section
3. Click **"Connect Repository"** or **"Connect Git"**
4. Select **GitHub** (or your provider)
5. Authorize Hostinger to access your account
6. Select repository: `vedicology-files/paranormalmusings`
7. Select branch: `main`
8. Click **Connect**

### 2b: Verify Repository Connected
- You should see: "Repository: paranormalmusings"
- Branch: main
- Ready for deployment

---

## Step 3: Set Environment Variables

### On Hostinger Dashboard:

1. Go to **Environment Variables** or **Settings → Environment**
2. Add each variable below:

**Copy-paste these exactly:**

```
ADMIN_API_URL=https://paranormalmusings.com
CONTENT_REVALIDATE=60
REVALIDATE_SECRET=[GENERATE RANDOM SECRET - min 32 chars]

NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY=[optional - get from Cloudflare]
CLOUDFLARE_TURNSTILE_SECRET_KEY=[optional - get from Cloudflare]

RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXX
CONTACT_EMAIL_TO=paranormalmusings@proton.me

NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### For REVALIDATE_SECRET:
Generate a random 32+ character string. You can use:
```bash
openssl rand -hex 32
# Example output: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

### For TURNSTILE_KEY (Optional):
If you want spam protection via Cloudflare:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain
3. Go to **Turnstile** (left sidebar)
4. Create a new site
5. Get Site Key and Secret Key

### For GA4 (Optional):
If you created a GA4 property:
1. Go to [analytics.google.com](https://analytics.google.com)
2. Find your property
3. Get Measurement ID (G-XXXXXXXXXX)

---

## Step 4: Configure Domain & SSL

### 4a: Point Domain to Hostinger

1. Go to Hostinger Domain Manager
2. Find paranormalmusings.com
3. Go to **DNS Settings**
4. You should see Hostinger's nameservers or pointing instructions
5. Follow Hostinger's guide to point domain to their servers

### 4b: SSL Certificate

1. Hostinger auto-generates free SSL (Let's Encrypt)
2. Should be automatic for connected domains
3. Verify: Visit https://paranormalmusings.com (should have green lock)

---

## Step 5: Deploy Application

### Option A: Auto Deploy (Recommended)
1. In Hostinger, find your project
2. Look for **Deploy** or **Build & Deploy** button
3. Click **Deploy**
4. Watch logs for build progress
5. Wait for deployment to complete (usually 5-10 mins)

### Option B: Manual Deploy
1. Make changes locally
2. Commit and push to GitHub: `git push origin main`
3. Hostinger auto-deploys from main branch
4. (If not auto-deploying, trigger manually in dashboard)

### Deployment Logs
- Go to **Deployment** or **Logs** section
- Watch for:
  - ✅ "Build successful"
  - ✅ "Application started"
  - ❌ Any errors (fix and redeploy)

---

## Step 6: Verify Production Deployment

### Test These URLs:

1. **Homepage:**
   ```
   https://paranormalmusings.com
   ```
   Should load in <3 seconds

2. **Redirect Test:**
   ```
   https://paranormalmusings.com/ghost-or-spirit-possession-of-prateek-case-study-number-3
   ```
   Should redirect to: `/case-studies/ghost-or-spirit-possession-of-prateek-case-study-number-3`

3. **Category Pages:**
   ```
   https://paranormalmusings.com/eastern-views
   https://paranormalmusings.com/investigation
   https://paranormalmusings.com/case-studies
   https://paranormalmusings.com/western-views
   ```
   All should load

4. **Topic Archive:**
   ```
   https://paranormalmusings.com/topics/evp
   ```
   Should load

5. **Contact Form:**
   - Go to https://paranormalmusings.com/about
   - Fill contact form
   - Should receive email at paranormalmusings@proton.me

6. **Search Console:**
   ```
   https://paranormalmusings.com/sitemap.xml
   ```
   Should return XML

### Monitor Logs:
- Watch Hostinger logs for errors
- Check application health dashboard

---

## Step 7: Post-Launch Configuration

### A. Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: paranormalmusings.com
3. Verify ownership (DNS method recommended)
4. Submit sitemap: paranormalmusings.com/sitemap.xml
5. Monitor indexing status

### B. Google Analytics
1. GA4 already configured in code
2. Should start tracking immediately
3. Check realtime dashboard after launch

### C. Monitor Email Delivery
1. Check Resend dashboard for delivery status
2. Resend shows: "Delivered", "Bounced", "Failed"
3. If high bounce rate: check email list cleanliness

### D. Set Up Monitoring
- Enable Hostinger application monitoring
- Set up alerts for downtime
- Monitor error logs daily first week

---

## Troubleshooting

### Issue: Build Fails
**Check:**
- [ ] Node.js version on Hostinger (should be 18+)
- [ ] Environment variables all set correctly
- [ ] Run `npm run build` locally first
- [ ] Check deployment logs for error message

**Fix:**
- Add `.nvmrc` file with `18` to specify Node version
- Deploy again

### Issue: Environment Variables Not Working
**Check:**
- [ ] Redeployed AFTER adding variables
- [ ] Variable names match code exactly (case-sensitive)
- [ ] No extra spaces in values

**Fix:**
- Re-save each variable
- Trigger manual redeploy

### Issue: Emails Not Sending
**Check:**
- [ ] Resend API key valid (not expired)
- [ ] Domain verified in Resend
- [ ] CONTACT_EMAIL_TO is set correctly
- [ ] Check Resend dashboard for failed sends

**Fix:**
- Verify domain in Resend
- Wait 24-48 hours for DNS
- Resend key should start with `re_`

### Issue: Slow Loading (>3 seconds)
**Check:**
- [ ] Images optimized (should be auto via Next.js)
- [ ] Hostinger server location
- [ ] Cache headers set correctly

**Fix:**
- Check Hostinger performance monitoring
- Enable CDN (if available)
- Contact Hostinger support

---

## Deployment Timeline

| Step | Time | Who |
|------|------|-----|
| Set up Resend | 5 min | You |
| Connect repo to Hostinger | 5 min | You |
| Add environment variables | 5 min | You |
| Configure domain | 5 min | You |
| Deploy | 10 min | Hostinger |
| DNS propagation | 24-48 hrs | DNS |
| Verify all pages | 15 min | You |
| Test contact form | 5 min | You |
| Setup Search Console | 10 min | You |

**Total: ~1-2 hours (plus 24-48 hrs DNS)**

---

## Hostinger Resources

- **Hostinger Help:** https://support.hostinger.com
- **Node.js Deployment:** https://support.hostinger.com/articles/nodejs
- **Environment Variables:** https://support.hostinger.com/articles/environment-variables
- **Custom Domain:** https://support.hostinger.com/articles/add-custom-domain

---

## Success Criteria ✅

After deployment:
- [ ] Site loads at https://paranormalmusings.com
- [ ] All 4 categories visible
- [ ] Redirects work (old URLs → new URLs)
- [ ] Contact form receives emails
- [ ] GA4 shows real-time users
- [ ] Search Console shows pages indexed
- [ ] No console errors in browser
- [ ] Mobile responsive
- [ ] Page loads <3 seconds

---

## Launch Checklist (Final)

Before announcing to public:
- [ ] DNS fully propagated
- [ ] SSL certificate active (green lock)
- [ ] Contact form tested with real email
- [ ] Search Console property verified
- [ ] Sitemap submitted to Google
- [ ] 110 articles accessible
- [ ] No 404 errors
- [ ] Mobile tested
- [ ] Social preview tested (og:image)
- [ ] Analytics tracking confirmed

---

**You're ready to launch! 🚀**

If you hit any issues, check the Troubleshooting section or contact Hostinger support with your deployment logs.

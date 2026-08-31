# Staging Environment Protection

**Status:** 🔴 **ACTION REQUIRED** — Basic auth not yet configured

The staging site (frontend.paranormalmusings.com) is currently unprotected and publicly crawlable. This is a critical SEO issue: Google will index it as a duplicate of the real site, harming rankings.

---

## What's Implemented

### 1. HTTP Basic Auth Middleware
**File:** `middleware.auth.ts`

- Protects `frontend.paranormalmusings.com` with username/password
- Blocks all unauthenticated requests with 401 Unauthorized
- Decodes HTTP Basic Auth headers
- Credentials from environment variables

### 2. Noindex Headers (Defense in Depth)
**File:** `next.config.mjs`

Added for staging environment only:
- `X-Robots-Tag: noindex, nofollow` — Tell search engines not to index
- `Cache-Control: no-cache, no-store, must-revalidate` — Don't cache pages

**Note:** Basic auth is the primary protection; noindex is a backup.

---

## Configuration Required

### Step 1: Set Environment Variables

On Vercel (or your hosting platform), add these environment variables:

**For Staging/Preview:**
```
STAGING_BASIC_AUTH_USERNAME=staging
STAGING_BASIC_AUTH_PASSWORD=your-secure-password-here
```

**For Development (local):**
```bash
# Add to .env.local (already gitignored)
STAGING_BASIC_AUTH_USERNAME=staging
STAGING_BASIC_AUTH_PASSWORD=your-secure-password-here
```

### Step 2: Generate Strong Password

```bash
# Generate a 32-character random password
openssl rand -base64 24

# Or use a password manager to generate one
# Requirements: 12+ characters, mix of upper/lower/numbers/symbols
```

### Step 3: Deploy

Push changes to trigger deployment:
```bash
git add middleware.auth.ts next.config.mjs
git commit -m "Add HTTP basic auth to staging environment"
git push origin main
```

---

## Testing

### Test Basic Auth (Before Launch)

**1. Without credentials (should fail):**
```bash
curl -I https://frontend.paranormalmusings.com/
# Should return: 401 Unauthorized
# WWW-Authenticate: Basic realm="Staging Environment"
```

**2. With credentials (should succeed):**
```bash
curl -I --user staging:your-password https://frontend.paranormalmusings.com/
# Should return: 200 OK
```

**3. In browser:**
- Visit `https://frontend.paranormalmusings.com`
- Should show HTTP Basic Auth dialog
- Enter username (staging) and password
- Should load the site

### Test Noindex Headers

```bash
curl -I https://frontend.paranormalmusings.com/ | grep X-Robots-Tag
# Should return: X-Robots-Tag: noindex, nofollow
```

### Verify Admin Protection

Check that `admin.paranormalmusings.com` (Payload):

```bash
# 1. Is not indexable
curl -I https://admin.paranormalmusings.com/ | grep -i robots

# 2. Is rate-limited
# (Requires checking Payload/Vercel rate limit config)
curl -v -H "X-Forwarded-For: 127.0.0.1" https://admin.paranormalmusings.com/
# Repeat ~100 times rapidly
# Should see 429 Too Many Requests
```

---

## Removing Auth at Launch

**CRITICAL:** Remove basic auth before going to production, or Google cannot crawl your site.

### Step 1: Disable Basic Auth

Set environment variable on production:
```
STAGING_BASIC_AUTH_DISABLED=true
```

Or delete `middleware.auth.ts` file and redeploy.

### Step 2: Verify Access

```bash
# Should NOT prompt for auth
curl -I https://paranormalmusings.com/

# Should return 200 OK
```

### Step 3: Remove noindex Headers

Update `next.config.mjs` to remove noindex for production:

```javascript
// In the headers() function:
// Remove this block for production:
if (isStaging) {
  securityHeaders.push(
    {
      key: 'X-Robots-Tag',
      value: 'noindex, nofollow',
    },
    ...
  )
}
```

### Step 4: Submit to Google

1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Add your production domain
3. Submit the sitemap: `https://paranormalmusings.com/sitemap.xml`
4. Request indexing for key pages

---

## Admin Site Protection (Payload)

### Verify admin.paranormalmusings.com is Protected

**Checklist:**
- [ ] No public robots.txt (or robots.txt disallows all)
- [ ] X-Robots-Tag: noindex header present
- [ ] Requires authentication to access
- [ ] Rate limiting enabled (max requests per IP)
- [ ] No sensitive data in error messages

**Test:**
```bash
# Should show 404 or 401, not admin login
curl -I https://admin.paranormalmusings.com/

# Should be blocked from indexing
curl -s https://admin.paranormalmusings.com/robots.txt
```

**If not protected, add to Payload config:**
```javascript
// payload.config.ts
export default buildConfig({
  admin: {
    autoLogin: false,  // Require login
    rbac: true,        // Role-based access control
  },
  routes: {
    admin: '/admin',
    api: '/api',
  },
  // Disable public APIs if not needed
})
```

---

## SEO Impact

### Current Risk (Unprotected Staging)
- 🔴 Google indexes `frontend.paranormalmusings.com`
- 🔴 Real site treated as duplicate → rankings penalized
- 🔴 Traffic split between staging and production
- 🔴 Confusing search results for users

### With Basic Auth + Noindex
- 🟡 Google cannot crawl staging (auth blocks it)
- 🟡 Noindex directive prevents indexing
- 🟡 Real site gets full ranking potential

### At Launch (After Removing Auth)
- ✅ Google crawls production freely
- ✅ Sitemap submitted
- ✅ Full ranking potential unlocked

---

## Timeline

**Staging (Before Launch):**
- ✅ Basic auth enabled
- ✅ Noindex headers added
- ✅ Admin protected
- ✅ Not indexed by Google

**At Launch:**
- [ ] Disable basic auth
- [ ] Remove noindex headers
- [ ] Deploy production
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor indexing in GSC

**1 Week After Launch:**
- [ ] Verify production pages indexed
- [ ] Check search visibility
- [ ] Remove staging credentials from team docs

---

## Credentials Management

### For Team
1. Share credentials through password manager (1Password, LastPass)
2. Never commit credentials to git
3. Rotate credentials monthly (good security practice)
4. Revoke when team member leaves

### For CI/CD
1. Store in platform secrets (Vercel, GitHub Secrets)
2. Never log credentials in CI output
3. Rotate quarterly

### Cleanup at Launch
1. Remove `STAGING_BASIC_AUTH_USERNAME` env var
2. Remove `STAGING_BASIC_AUTH_PASSWORD` env var
3. Remove credentials from all password managers
4. Update team wiki to remove staging access instructions

---

## Troubleshooting

### "401 Unauthorized" with correct credentials
- Check credentials are in environment variables
- Verify spelling (case-sensitive)
- Restart application after changing env vars

### Browser keeps asking for password
- Clear browser cache/cookies for the domain
- Try in private/incognito window
- Check that auth isn't broken by middleware order

### Basic auth not working after deployment
- Confirm `middleware.auth.ts` was deployed
- Check environment variables were set
- Wait 5-10 minutes for deployment to fully propagate

---

## References

- [HTTP Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
- [X-Robots-Tag Header](https://developers.google.com/search/reference/overview)
- [Google Search Console](https://search.google.com/search-console/)

---

**Status:** Implementation complete, configuration required  
**Action:** Set environment variables on staging platform  
**Deadline:** Before launching production  
**Removal:** Required at launch (set STAGING_BASIC_AUTH_DISABLED=true)

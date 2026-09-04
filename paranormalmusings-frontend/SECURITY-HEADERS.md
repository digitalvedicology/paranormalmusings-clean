# Security Headers Implementation

**Status:** ✅ Implemented in `next.config.mjs`

All critical security headers are now configured and will be sent with every response.

---

## Headers Implemented

### 1. Strict-Transport-Security (HSTS)
```
max-age=63072000; includeSubDomains; preload
```

**What it does:** Forces HTTPS for all connections  
**Max-age:** 2 years (63,072,000 seconds)  
**Benefits:**
- Prevents SSL downgrade attacks
- Browsers cache the policy
- `includeSubDomains`: applies to all subdomains
- `preload`: eligible for HSTS preload list (hardcoded in browsers)

**Test:**
```bash
curl -I https://paranormalmusings.com | grep Strict-Transport-Security
# Should output: Strict-Transport-Security: max-age=...
```

---

### 2. X-Content-Type-Options
```
nosniff
```

**What it does:** Prevents MIME type sniffing attacks  
**Protects against:** Browser incorrectly interpreting files as different types  
**Example:** Serving a text file as JavaScript

**Test:**
```bash
curl -I https://paranormalmusings.com | grep X-Content-Type-Options
# Should output: X-Content-Type-Options: nosniff
```

---

### 3. Referrer-Policy
```
strict-origin-when-cross-origin
```

**What it does:** Controls how much referrer info is shared when navigating  
**Levels (strictest to most permissive):**
- `no-referrer` — Never send
- `strict-origin-when-cross-origin` — Send only origin on cross-site (chosen)
- `origin` — Send only origin (not path)
- `unsafe-url` — Send full URL (not recommended)

**Benefits:**
- Protects user privacy
- Doesn't leak URL paths to external sites

---

### 4. Permissions-Policy (formerly Feature-Policy)
```
camera=(), microphone=(), geolocation=()
```

**What it does:** Disables browser APIs your site doesn't use  
**Disabled APIs:**
- `camera` — Prevent camera access
- `microphone` — Prevent microphone access
- `geolocation` — Prevent location tracking

**Benefits:**
- If hacked, attackers can't use these APIs
- Prevents accidental usage
- Improves user privacy expectations

**Test:**
```bash
curl -I https://paranormalmusings.com | grep Permissions-Policy
```

---

### 5. X-Frame-Options
```
SAMEORIGIN
```

**What it does:** Prevents clickjacking attacks (embedding your site in iframes)  
**Options:**
- `DENY` — Never allow framing
- `SAMEORIGIN` — Allow framing only on same origin (chosen)
- `ALLOW-FROM url` — Allow specific origin (deprecated)

**Protects against:** Clickjacking (malicious site embeds yours in hidden iframe)

**Test:**
```bash
curl -I https://paranormalmusings.com | grep X-Frame-Options
# Should output: X-Frame-Options: SAMEORIGIN
```

---

### 6. Content-Security-Policy (CSP)
```
default-src 'self';
script-src 'self' https://challenges.cloudflare.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: blob:;
media-src 'self' https:;
connect-src 'self' https: wss:;
frame-ancestors 'self';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests
```

**What it does:** Specifies which resources can be loaded and from where  

**Breakdown:**
| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | All resources from same origin by default |
| `script-src` | `'self' + Cloudflare, CDN` | JavaScript from self + third-party services |
| `style-src` | `'self' 'unsafe-inline' + Google Fonts` | CSS from self (inline allowed for Tailwind) + fonts |
| `font-src` | `'self' https://fonts.gstatic.com` | Fonts from self + Google |
| `img-src` | `'self' data: https: blob:` | Images from self, data URIs, HTTPS, blobs |
| `connect-src` | `'self' https: wss:` | API calls from self + HTTPS/WSS |
| `frame-ancestors` | `'self'` | Can only be framed by same origin |
| `base-uri` | `'self'` | Base tag can only point to same origin |
| `form-action` | `'self'` | Forms can only submit to same origin |
| `upgrade-insecure-requests` | — | Auto-upgrade HTTP to HTTPS |

**Protects against:**
- XSS (cross-site scripting)
- Injection attacks
- Loading malicious third-party scripts

---

## Third-Party Scripts to Add

When adding new third-party services (analytics, chat, etc.), update CSP:

### Google Analytics
```
script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com
img-src 'self' data: https: blob: https://www.google-analytics.com
```

### Resend (Email)
```
connect-src 'self' https: wss: https://api.resend.com
```

### Cloudflare Turnstile (Captcha)
```
script-src 'self' https://challenges.cloudflare.com
frame-src https://challenges.cloudflare.com
connect-src 'self' https: wss: https://challenges.cloudflare.com
```

### Slack (Chat widget - if added)
```
script-src 'self' https://cdn.segment.com https://api.slack.com
frame-src https://app.slack.com
connect-src 'self' https: wss: https://api.slack.com https://socket-api.slack.com
```

---

## Testing Headers

### Method 1: curl
```bash
# Check all headers
curl -I https://paranormalmusings.com

# Check specific header
curl -I https://paranormalmusings.com | grep Strict-Transport-Security
```

### Method 2: Online Tools
- https://securityheaders.com — Grades security headers (A+ ideal)
- https://csp-evaluator.appspot.com — Evaluates CSP strength
- https://observatory.mozilla.org — Full security audit

### Method 3: Browser DevTools
1. Open DevTools → Network tab
2. Reload page
3. Click on any request
4. Response Headers section shows all headers

### Method 4: CLI tools
```bash
# Install observatory
npm install -g observatory

# Test site
observatory paranormalmusings.com
```

---

## Validation

### CSP Issues to Watch For

If CSP is too strict, things will break:

**Console errors like:**
```
Refused to load the script because it violates the Content-Security-Policy directive
```

**Fix:** Add the domain to the appropriate directive

**Common violations:**
- `script-src` — Third-party JavaScript blocked
- `style-src` — External stylesheets blocked
- `connect-src` — API calls blocked
- `img-src` — External images blocked

### How to Debug CSP Violations

1. Open DevTools → Console
2. Look for "Refused to load" errors
3. Error message shows which directive was violated
4. Update CSP to allow that resource

**Example:**
```
Refused to load the script because it violates the Content-Security-Policy directive: 
"script-src 'self' https://challenges.cloudflare.com"

Missing: https://example.com
```

Add to `script-src`: `https://example.com`

---

## HSTS Preload

The `preload` flag makes the site eligible for the HSTS preload list (hardcoded in all browsers).

**Submit to preload list:**
1. Go to https://hstspreload.org/
2. Enter domain: `paranormalmusings.com`
3. Verify HSTS header is present
4. Click "Submit" button
5. Review will take a few weeks

**Benefits:**
- HTTPS enforced from first visit (no HTTP downgrade possible)
- Browsers cache policy for 2 years

---

## Maintenance

### When Adding New Third-Party Services

1. **Document the service** in your code/config
2. **Update CSP** to allow the domain
3. **Test with securityheaders.com** (should stay A or A+)
4. **Test locally** with `npm run dev` to ensure nothing breaks

### Annual Review

- Check securityheaders.com grade annually
- Review CSP for unused domains (remove them)
- Update HSTS max-age if needed (2 years is standard)

---

## Security Score

**Before:** Single header (CSP upgrade-insecure-requests only)  
**After:** 6 headers + comprehensive CSP  
**Expected grade:** A+ on securityheaders.com (90+ points)

---

## References

- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HSTS Preload List](https://hstspreload.org/)

---

**Status:** ✅ Production-ready  
**Test:** Visit https://securityheaders.com/?q=paranormalmusings.com  
**Next:** Monitor for CSP violations in production

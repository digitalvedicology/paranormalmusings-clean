# Contact Form Setup & Configuration

Complete guide for setting up the "Write to us" contact form with spam protection, email delivery, and message storage.

## Overview

The contact form includes:
- **Spam protection**: Honeypot field + rate limiting (5 per IP per hour) + Cloudflare Turnstile
- **Email delivery**: Via Resend (transactional email service)
- **Message storage**: Payload CMS (for backups if email fails)
- **Privacy**: GDPR + India DPDP Act 2023 compliant
- **UX**: Success/error states, loading indicator, accessible design
- **Placement**: Footer + end-of-article module

---

## 1. Cloudflare Turnstile Setup (Free CAPTCHA)

Turnstile is Cloudflare's privacy-friendly CAPTCHA alternative to reCAPTCHA.

### Step 1: Create Turnstile Site

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile** (in the left menu under "AI & ML")
3. Click **Create Site**
4. Fill in:
   - **Site name**: `Paranormal Musings Contact Form`
   - **Domain**: `paranormalmusings.com`
   - **Mode**: Managed (recommended, auto-adjusts difficulty)
   - **Widget Mode**: Non-Interactive (or Managed for better UX)

### Step 2: Copy Keys

5. Copy both:
   - **Site Key** → `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY` in .env.local
   - **Secret Key** → `CLOUDFLARE_TURNSTILE_SECRET_KEY` in .env.local

### Step 3: Test Locally

6. Start dev server: `npm run dev`
7. Visit contact form (footer or end of article)
8. Turnstile widget should appear
9. Submit form and verify it works

### Step 4: Deploy

10. Add keys to production environment variables
11. Test on production before taking form live

---

## 2. Resend Email Service Setup

Resend is a developer-friendly transactional email service.

### Step 1: Create Account

1. Go to [Resend](https://resend.com/)
2. Sign up or log in
3. Verify email address

### Step 2: Create API Key

4. Go to [API Keys](https://resend.com/api-keys)
5. Click **Create API Key**
6. Copy the key → `RESEND_API_KEY` in .env.local

### Step 3: Configure Sender Domain

7. Go to [Domains](https://resend.com/domains)
8. Add domain: `paranormalmusings.com`
9. Follow Resend's DNS setup instructions
   - Add CNAME records to your DNS provider
   - Wait for DNS propagation (up to 48 hours)
10. Once verified, you can send from `noreply@paranormalmusings.com`

### Step 4: Set Recipient Email

11. In `.env.local`, set:
    ```
    CONTACT_EMAIL_TO=support@vedicology.com
    ```
    This is where submissions will be sent.

### Step 5: Test Email Delivery

12. Fill out contact form and submit
13. Check `support@vedicology.com` inbox
14. Verify email formatting and content

---

## 3. Payload CMS Integration (Optional Message Storage)

Messages can be stored in Payload CMS as a backup if email fails. This requires a `contact-messages` collection in Payload.

### Step 1: Create Collection in Payload Admin

1. Log in to Payload admin (e.g., `http://localhost:3001/admin`)
2. Go to Collections
3. Create new collection:
   - **Label**: Contact Messages
   - **Slug**: contact-messages
   - **Enable timestamps**: Yes

### Step 2: Define Fields

4. Add these fields:
   - `name` (Text, Required)
   - `email` (Email, Required)
   - `message` (Textarea, Required)
   - `ipAddress` (Text, Optional)
   - `userAgent` (Text, Optional)
   - `status` (Select: new | read | replied, Default: new)

### Step 3: Access Control

5. Set permissions so:
   - Frontend can POST new messages
   - Only admin can view/edit
   - Messages are read-only after creation (no delete)

### Example Field Config

```json
{
  "name": "name",
  "type": "text",
  "required": true
}
```

---

## 4. Environment Variables

Add to `.env.local`:

```bash
# Cloudflare Turnstile
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY=1x00000000000000000000AA
CLOUDFLARE_TURNSTILE_SECRET_KEY=2x0000000000000000000000000000000AA

# Resend Email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Recipient
CONTACT_EMAIL_TO=support@vedicology.com

# Payload Admin (already set)
ADMIN_API_URL=http://localhost:3001
```

**Note**: 
- `NEXT_PUBLIC_*` variables are exposed to browser (safe for public keys)
- Other variables are server-side only (safe for secrets)

---

## 5. Rate Limiting

Built-in rate limiting: **5 submissions per IP per hour**

### Customize

Edit `lib/rate-limiter.ts`:

```typescript
export const contactFormLimiter = new RateLimiter(
  3600000,  // Time window in ms (1 hour)
  5         // Max requests per window
)
```

### Monitoring

Rate limit errors show:
```
"Too many requests. Please try again later."
```

With a `Retry-After` header telling browser when to retry.

### Scale Consideration

For production with multiple servers, upgrade to Redis:

```typescript
import { createClient } from 'redis'

const redis = createClient()
// Use redis for distributed rate limiting
```

---

## 6. Honeypot & Spam Detection

### How It Works

1. **Honeypot field**: Hidden input field that humans won't fill but spam bots will
2. **Submission**: If honeypot is filled, silently return success (fool the bot)
3. **Email never sent**: The "success" is fake; malicious IPs get no response

### Testing

To test honeypot:
1. Open browser DevTools → Elements
2. Find input with `name="honeypot"` (has `display: none`)
3. Remove the `display: none` style
4. Fill it with text
5. Submit form
6. Should silently succeed (no error, form clears)
7. No email sent to admin

### Customization

In `ContactForm.tsx`, honeypot field:
```tsx
<input name="honeypot" type="text" style={{ display: 'none' }} />
```

---

## 7. Testing

### Local Testing

```bash
# 1. Start dev server
npm run dev

# 2. Visit contact form
# - Footer: Scroll to bottom
# - Article: Scroll to bottom of any article

# 3. Fill form
# - Name, email, message
# - Turnstile widget should appear

# 4. Submit
# - Should show "Thank you" message
# - Form should clear
# - Email should arrive in inbox

# 5. Rate limit test
# - Submit 5 more times
# - 6th attempt should show rate limit error
```

### Email Testing

```bash
# Test with Resend's playground
curl -X POST https://api.resend.com/emails \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer re_xxx' \
  -d '{
    "from": "noreply@paranormalmusings.com",
    "to": "support@vedicology.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

### Turnstile Testing

Turnstile has test keys for local development:

```bash
# Non-Interactive Mode (always passes)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY=1x00000000000000000000AA
CLOUDFLARE_TURNSTILE_SECRET_KEY=2x0000000000000000000000000000000AA
```

---

## 8. Deployment Checklist

Before going live:

- [ ] Cloudflare Turnstile site created & keys in production env vars
- [ ] Resend API key in production
- [ ] Resend domain verified (DNS records propagated)
- [ ] Recipient email (`CONTACT_EMAIL_TO`) is correct
- [ ] Test submission on staging
- [ ] Email arrives in inbox
- [ ] Form UI works on mobile
- [ ] Privacy policy linked in form exists
- [ ] Rate limiting works (test after 5 submissions)
- [ ] Success message displays correctly
- [ ] Error states test (e.g., invalid email)

---

## 9. Post-Deployment Monitoring

### Email Delivery

Track in Resend dashboard:
- **Sent**: Number of emails sent
- **Bounced**: Hard failures (bad address)
- **Suppressed**: Soft failures (full inbox)
- **Complaints**: Users marked as spam

### Form Analytics

Add to your analytics tool:
- Submission attempts
- Success rate
- Error rate
- Rate limit hits

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Turnstile widget not loading | Check `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY` is public key, not secret |
| Email not received | Verify `CONTACT_EMAIL_TO`, check Resend dashboard for bounces |
| 429 errors | User hit rate limit, wait 1 hour or clear in-memory limiter |
| Form spam | Increase `maxRequests` to lower value in `rate-limiter.ts` |

---

## 10. Future Enhancements

Possible additions:
- [ ] Email templates (HTML-only, plain text fallback)
- [ ] File attachments (Resend supports up to 40MB)
- [ ] Auto-reply to user ("We received your message")
- [ ] Notification to admin (Slack/Discord webhook)
- [ ] Message threading (replies to earlier messages)
- [ ] Categories/tags (case enquiry, media request, etc.)
- [ ] Admin dashboard to manage messages
- [ ] Scheduled digest emails (daily summary)

---

## 11. Privacy & Compliance

### GDPR

- ✅ Privacy notice under form (links to Privacy Policy)
- ✅ Data collected: name, email, message, IP address
- ✅ Data stored: Payload CMS (can export/delete)
- ✅ Retention: Admin decision (recommend 1 year)
- ✅ No third-party tracking pixels

### India DPDP Act 2023

- ✅ Purpose stated: Respond to contact requests
- ✅ Consent obtained: Form submission = consent
- ✅ Data protection: Stored in Payload (encrypted at rest recommended)
- ✅ User rights: Can request deletion via email

### Implementation

Privacy policy should include:
```
We collect your name, email, and message to respond to your inquiry.
Your data is stored securely and deleted after [X months].
You can request deletion anytime by emailing us.
See our full Privacy Policy for details.
```

---

## Quick Reference

| Component | File |
|-----------|------|
| Contact Form UI | `components/ContactForm.tsx` |
| API Handler | `app/api/contact/route.ts` |
| Rate Limiter | `lib/rate-limiter.ts` |
| Article Module | `components/EndOfArticleContact.tsx` |
| Footer Integration | `components/SiteFooter.tsx` |

| Variable | Required | Type |
|----------|----------|------|
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY` | Yes | Public key |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Yes | Secret key |
| `RESEND_API_KEY` | Yes | API token |
| `CONTACT_EMAIL_TO` | Yes | Email address |

---

**Last Updated**: 2026-08-31  
**Status**: Ready for deployment

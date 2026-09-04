# Production Environment Variables - Hostinger Setup

Complete guide for setting up environment variables on Hostinger for both frontend and admin applications.

---

## 🔐 Generate Strong Secrets

Before setting up, generate secure random strings for secrets:

**Online generator:** https://generate-secret.vercel.app/ (or use terminal)

```bash
# macOS/Linux - Generate random secret
openssl rand -base64 32

# PowerShell - Generate random secret
[Convert]::ToBase64String((Get-Random -Minimum 0 -Maximum 256 -Count 32))
```

Example strong secret: `f7ef19e2a5b5cbc8ec858f499bfc045f420a7b0b375b0c700916a3f4a7c2d8e`

---

## 📋 FRONTEND Environment Variables

**File location on server:** `/home/paranormalmusings/public_html/.env.production`

### Full Configuration

```env
# ═══════════════════════════════════════════════════════════════════════════════
# PARANORMAL MUSINGS - FRONTEND PRODUCTION
# ═══════════════════════════════════════════════════════════════════════════════

# ──────────────────────────────────────────────────────────────────────────────
# CRITICAL: ADMIN API CONFIGURATION
# ──────────────────────────────────────────────────────────────────────────────
ADMIN_API_URL=https://admin.paranormalmusings.com

# Cache revalidation time in seconds (3600 = 1 hour)
CONTENT_REVALIDATE=3600

# Must match REVALIDATE_SECRET in admin .env.production
# Generate: openssl rand -base64 32
REVALIDATE_SECRET=YOUR_STRONG_RANDOM_SECRET_HERE_32_CHARS_MIN

# ──────────────────────────────────────────────────────────────────────────────
# EMAIL DELIVERY (Nodemailer + Hostinger SMTP)
# ──────────────────────────────────────────────────────────────────────────────
# Get these from Hostinger Email settings
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=YOUR_EMAIL_PASSWORD_FROM_HOSTINGER
SMTP_FROM=contact@paranormalmusings.com

# Email recipient for contact form submissions
CONTACT_EMAIL_TO=paranormalmusings@proton.me

# ──────────────────────────────────────────────────────────────────────────────
# SECURITY: CLOUDFLARE TURNSTILE (Spam Protection)
# ──────────────────────────────────────────────────────────────────────────────
# Get from: https://dash.cloudflare.com → Turnstile → Create Site
# Site name: paranormalmusings.com
# Domain: paranormalmusings.com

# Public key (safe to share - appears in HTML)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY=YOUR_CLOUDFLARE_PUBLIC_KEY

# Secret key (keep private - server only)
CLOUDFLARE_TURNSTILE_SECRET_KEY=YOUR_CLOUDFLARE_SECRET_KEY

# ──────────────────────────────────────────────────────────────────────────────
# ANALYTICS
# ──────────────────────────────────────────────────────────────────────────────
# Get from: https://analytics.google.com
# Format: G-XXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-YOUR_GA4_MEASUREMENT_ID
```

### Variables Explained

| Variable | Value | Source | Security |
|----------|-------|--------|----------|
| `ADMIN_API_URL` | `https://admin.paranormalmusings.com` | Your domain | Public |
| `CONTENT_REVALIDATE` | `3600` | Static config | Public |
| `REVALIDATE_SECRET` | Random 32+ chars | Generate yourself | 🔐 PRIVATE |
| `SMTP_HOST` | `smtp.hostinger.com` | Hostinger | Public |
| `SMTP_PORT` | `587` | Hostinger default | Public |
| `SMTP_USER` | Your email address | Hostinger panel | 🔐 PRIVATE |
| `SMTP_PASSWORD` | Email password | Hostinger panel | 🔐 PRIVATE |
| `SMTP_FROM` | Your email address | Your choice | Public |
| `CONTACT_EMAIL_TO` | Your inbox email | Your choice | Public |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY` | Cloudflare key | Cloudflare dashboard | Public |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Cloudflare secret | Cloudflare dashboard | 🔐 PRIVATE |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | Google Analytics | Public |

---

## 📋 ADMIN Environment Variables

**File location on server:** `/home/admin.paranormalmusings.com/public_html/.env.production`

### Full Configuration

```env
# ═══════════════════════════════════════════════════════════════════════════════
# PARANORMAL MUSINGS - ADMIN PRODUCTION
# ═══════════════════════════════════════════════════════════════════════════════

# ──────────────────────────────────────────────────────────────────────────────
# ADMIN SECURITY
# ──────────────────────────────────────────────────────────────────────────────
# Admin login password (used for /admin access)
# Generate: openssl rand -base64 24 | tr '/' '_'
ADMIN_PASSWORD=YOUR_STRONG_ADMIN_PASSWORD_25_CHARS_MIN

# API key for content revalidation requests
# Generate: openssl rand -base64 32
ADMIN_API_KEY=YOUR_STRONG_API_KEY_32_CHARS_MIN

# ──────────────────────────────────────────────────────────────────────────────
# FRONTEND INTEGRATION
# ──────────────────────────────────────────────────────────────────────────────
# Frontend URL (used for revalidation requests)
SITE_URL=https://paranormalmusings.com

# Revalidation secret (must match frontend REVALIDATE_SECRET exactly!)
# Generate: openssl rand -base64 32
REVALIDATE_SECRET=YOUR_STRONG_RANDOM_SECRET_HERE_32_CHARS_MIN

# ──────────────────────────────────────────────────────────────────────────────
# FILE STORAGE (Hostinger)
# ──────────────────────────────────────────────────────────────────────────────
# Where user uploads are stored (must match frontend MEDIA_DIR)
UPLOAD_DIR=/home/paranormalmusings/public_html/media

# ──────────────────────────────────────────────────────────────────────────────
# EMAIL - HOSTINGER SMTP CONFIGURATION
# ──────────────────────────────────────────────────────────────────────────────
# For contact form emails from the public site
# Get these from Hostinger Email settings

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=YOUR_EMAIL_PASSWORD_FROM_HOSTINGER
SMTP_FROM=contact@paranormalmusings.com

# Email recipient for contact form submissions
CONTACT_EMAIL_TO=paranormalmusings@proton.me

# ──────────────────────────────────────────────────────────────────────────────
# DATA STORAGE
# ──────────────────────────────────────────────────────────────────────────────
# Directory for JSON data files (contact messages, newsletter subscribers)
DATA_DIR=/home/admin.paranormalmusings.com/public_html/data

# ──────────────────────────────────────────────────────────────────────────────
# ADMIN URL (Optional - for referencing itself)
# ──────────────────────────────────────────────────────────────────────────────
# ADMIN_URL=https://admin.paranormalmusings.com
```

### Variables Explained

| Variable | Value | Source | Security |
|----------|-------|--------|----------|
| `ADMIN_PASSWORD` | Random strong string | Generate yourself | 🔐 PRIVATE |
| `ADMIN_API_KEY` | Random 32+ chars | Generate yourself | 🔐 PRIVATE |
| `SITE_URL` | `https://paranormalmusings.com` | Your domain | Public |
| `REVALIDATE_SECRET` | **SAME as frontend** | Must match! | 🔐 PRIVATE |
| `UPLOAD_DIR` | `/home/paranormalmusings/public_html/media` | Hostinger path | Public |
| `SMTP_HOST` | `smtp.hostinger.com` | Hostinger | Public |
| `SMTP_PORT` | `587` | Hostinger default | Public |
| `SMTP_USER` | Your email address | Hostinger panel | 🔐 PRIVATE |
| `SMTP_PASSWORD` | Email password | Hostinger panel | 🔐 PRIVATE |
| `SMTP_FROM` | Your email address | Your choice | Public |
| `CONTACT_EMAIL_TO` | Your inbox email | Your choice | Public |
| `DATA_DIR` | `/home/admin.../public_html/data` | Hostinger path | Public |

---

## 🚀 How to Set Up on Hostinger

### Step 1: Get Hostinger Email Credentials

1. Login to **Hostinger hPanel** → https://hpanel.hostinger.com
2. Click **Emails** in left sidebar
3. Click your domain
4. You'll see email accounts created
5. Click the email account (e.g., `contact@paranormalmusings.com`)
6. Note the password (you set this when creating the email)
7. Default SMTP:
   - Host: `smtp.hostinger.com`
   - Port: `587`
   - Username: `contact@paranormalmusings.com`
   - Password: (from step 6)

### Step 2: Create Environment Files via SSH

```bash
# SSH into your server
ssh username@your-hostinger-ip

# Frontend .env.production
nano /home/paranormalmusings/public_html/.env.production
# Paste the frontend config above
# Press Ctrl+X, then Y, then Enter to save

# Admin .env.production
nano /home/admin.paranormalmusings.com/public_html/.env.production
# Paste the admin config above
# Press Ctrl+X, then Y, then Enter to save
```

### Step 3: Set File Permissions

```bash
# Make sure only owner can read (security)
chmod 600 /home/paranormalmusings/public_html/.env.production
chmod 600 /home/admin.paranormalmusings.com/public_html/.env.production
```

### Step 4: Create Data Directory

```bash
# For admin data (JSON files)
mkdir -p /home/admin.paranormalmusings.com/public_html/data
chmod 755 /home/admin.paranormalmusings.com/public_html/data

# For media uploads (shared with frontend)
mkdir -p /home/paranormalmusings/public_html/media
chmod 755 /home/paranormalmusings/public_html/media
```

### Step 5: Verify Connections

```bash
# Test SMTP connection
# You can use telnet or a Node.js script to verify

# Quick test via Node:
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  auth: {
    user: 'contact@paranormalmusings.com',
    pass: 'YOUR_PASSWORD'
  }
});
transporter.verify((err, success) => {
  if (err) console.log('Error:', err);
  else console.log('SMTP OK:', success);
});
"
```

---

## ✅ Production Checklist

### Frontend
- [ ] `ADMIN_API_URL` = `https://admin.paranormalmusings.com`
- [ ] `REVALIDATE_SECRET` = Strong random 32+ chars
- [ ] `REVALIDATE_SECRET` matches admin's value
- [ ] `SMTP_HOST` = `smtp.hostinger.com`
- [ ] `SMTP_PORT` = `587`
- [ ] `SMTP_USER` = Valid email from Hostinger
- [ ] `SMTP_PASSWORD` = Correct password
- [ ] `CONTACT_EMAIL_TO` = Your inbox email
- [ ] Cloudflare Turnstile keys obtained and set
- [ ] Google Analytics ID obtained and set

### Admin
- [ ] `ADMIN_PASSWORD` = Strong 25+ chars
- [ ] `ADMIN_API_KEY` = Strong 32+ chars
- [ ] `SITE_URL` = `https://paranormalmusings.com`
- [ ] `REVALIDATE_SECRET` = **EXACTLY matches frontend**
- [ ] `UPLOAD_DIR` = Correct Hostinger path
- [ ] `SMTP_HOST` = `smtp.hostinger.com`
- [ ] `SMTP_PORT` = `587`
- [ ] `SMTP_USER` = Valid email from Hostinger
- [ ] `SMTP_PASSWORD` = Correct password
- [ ] `CONTACT_EMAIL_TO` = Your inbox email
- [ ] `DATA_DIR` = Correct path and writable
- [ ] All files have `chmod 600` permissions

---

## 🔐 Security Best Practices

1. **Generate Secrets Properly**
   ```bash
   # Use cryptographic random generation
   openssl rand -base64 32
   ```

2. **Never Commit .env Files**
   - `.env.production` is already in `.gitignore`
   - Never push secrets to GitHub

3. **Use Strong Passwords**
   - Admin: 25+ characters
   - Mix uppercase, lowercase, numbers, symbols
   - Don't use common words

4. **Keep Secrets in Sync**
   - `REVALIDATE_SECRET` must be identical on both apps
   - Update both if you change it

5. **Restrict File Access**
   - `chmod 600` on .env files
   - Only root/owner can read

6. **Rotate Secrets Regularly**
   - Change passwords every 3 months
   - Rotate API keys yearly

7. **Monitor Logs**
   - Check for failed auth attempts
   - Monitor SMTP errors
   - Watch for unauthorized access

---

## 🔧 Environment Variables by Application

### Frontend Only
```
ADMIN_API_URL
CONTENT_REVALIDATE
REVALIDATE_SECRET
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY
CLOUDFLARE_TURNSTILE_SECRET_KEY
NEXT_PUBLIC_GA_ID
```

### Admin Only
```
ADMIN_PASSWORD
ADMIN_API_KEY
UPLOAD_DIR
DATA_DIR
```

### Both Applications (Must Match)
```
REVALIDATE_SECRET (must be identical)
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
CONTACT_EMAIL_TO
SITE_URL (frontend URL for admin)
```

---

## 📞 Troubleshooting

### SMTP Connection Failed
```
Error: Email delivery failed

Solution:
1. Verify SMTP credentials in Hostinger panel
2. Check if password is correct
3. Confirm email account is active
4. Ensure port 587 is not blocked by firewall
5. Try connecting via telnet: telnet smtp.hostinger.com 587
```

### REVALIDATE_SECRET Mismatch
```
Error: ISR revalidation failed / Cache not updating

Solution:
1. Copy REVALIDATE_SECRET from admin
2. Paste exact same value in frontend
3. Redeploy both applications
4. Test with curl:
   curl -X POST https://admin.paranormalmusings.com/api/revalidate \
     -H "Authorization: Bearer YOUR_SECRET"
```

### File Upload Fails
```
Error: Cannot write to upload directory

Solution:
1. Check UPLOAD_DIR path is correct
2. Verify directory exists: mkdir -p /path/to/media
3. Check permissions: chmod 755 /path/to/media
4. Verify Node.js process can write (run as app user)
```

### Emails Not Sending
```
Error: Failed to send contact form email

Solution:
1. Verify SMTP credentials match Hostinger
2. Check if email account is active in Hostinger
3. Try sending test email from Hostinger panel
4. Check spam folder
5. Review SMTP logs: tail -f /var/log/mail.log
```

---

## 🎯 Quick Reference

### Frontend .env.production
```env
ADMIN_API_URL=https://admin.paranormalmusings.com
CONTENT_REVALIDATE=3600
REVALIDATE_SECRET=[GENERATE_STRONG_SECRET]
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=[FROM_HOSTINGER]
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY=[FROM_CLOUDFLARE]
CLOUDFLARE_TURNSTILE_SECRET_KEY=[FROM_CLOUDFLARE]
NEXT_PUBLIC_GA_ID=[FROM_GOOGLE_ANALYTICS]
```

### Admin .env.production
```env
ADMIN_PASSWORD=[GENERATE_STRONG_PASSWORD_25+_CHARS]
ADMIN_API_KEY=[GENERATE_STRONG_SECRET_32+_CHARS]
SITE_URL=https://paranormalmusings.com
REVALIDATE_SECRET=[SAME_AS_FRONTEND]
UPLOAD_DIR=/home/paranormalmusings/public_html/media
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=[FROM_HOSTINGER]
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
DATA_DIR=/home/admin.paranormalmusings.com/public_html/data
```

---

## ✨ You're All Set!

Once all environment variables are configured:
1. ✅ Restart both Node.js applications
2. ✅ Test frontend: https://paranormalmusings.com
3. ✅ Test admin: https://admin.paranormalmusings.com
4. ✅ Test contact form (should receive email)
5. ✅ Test newsletter signup
6. ✅ Monitor logs for errors

**Congratulations! Production is ready! 🚀**

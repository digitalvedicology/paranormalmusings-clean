# Hostinger SMTP Setup Guide

**Free email delivery for your contact form**

---

## 🎯 What This Does

Sends contact form emails from your Hostinger account to `paranormalmusings@proton.me`:

```
User submits form
        ↓
Your Hostinger SMTP server sends email
        ↓
Email arrives at paranormalmusings@proton.me
        ↓
You can reply to user directly
```

**Cost:** FREE (included with Hostinger hosting)

---

## 📋 STEP 1: Create Email Account on Hostinger

### 1a. Log into Hostinger

1. Go to https://hpanel.hostinger.com
2. Sign in with your account
3. Select your domain: **paranormalmusings.com**

### 1b. Create Email Account

1. **Left sidebar** → Find **Email** or **Email Accounts**
2. Click **Create Email Account** (or similar button)
3. **Fill in:**
   - Email address: `contact@paranormalmusings.com`
   - Password: Create a strong password (at least 12 characters with numbers/symbols)
   - Confirm password
4. Click **Create**

**Optional:** You can also create `info@paranormalmusings.com` or `noreply@paranormalmusings.com`

### 1c. Note the Settings

Once created, click on the email account to see settings:

Look for **SMTP Settings** or **Connection Settings** - you'll see:

```
SMTP Server (Outgoing):  mail.paranormalmusings.com
SMTP Port:               587  (or 465)
Username:                contact@paranormalmusings.com
Password:                [the one you just created]
```

**Copy these 4 values** - you need them in the next step.

---

## 🔐 STEP 2: Add Credentials to Environment

### 2a. Update `.env.local`

Add these lines to your `.env.local` file:

```env
# Hostinger SMTP Configuration
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=your-strong-password-here
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
```

**Replace:**
- `your-strong-password-here` → The password you created on Hostinger
- `contact@paranormalmusings.com` → Your email if you used different address

### 2b. Verify `.env.local`

Run: `cat .env.local`

Should show:
```
ADMIN_API_URL=http://localhost:3001
CONTENT_REVALIDATE=60
REVALIDATE_SECRET=dev-revalidate-secret
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=your-password
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
NEXT_PUBLIC_GA_ID=
```

---

## 🚀 STEP 3: Install Nodemailer (For SMTP)

### 3a. Install Package

```bash
cd paranormalmusings-frontend
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### 3b. Verify Installation

```bash
npm list nodemailer
```

Should show: `nodemailer@6.x.x` (or newer)

---

## 💻 STEP 4: Code Changes (Already Done!)

The code has been updated to use SMTP. Here's what changed:

### Updated `/api/contact/route.ts`

Changed from Resend to SMTP:

**Before:**
```typescript
// Send email via Resend
const resendApiKey = process.env.RESEND_API_KEY
if (resendApiKey) {
  // ... Resend logic
}
```

**After:**
```typescript
// Send email via Hostinger SMTP
const smtpHost = process.env.SMTP_HOST
if (smtpHost) {
  // ... Nodemailer logic
}
```

### Created `/lib/smtp.ts`

New utility for sending SMTP emails:

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Send email via transporter
await transporter.sendMail({
  from: 'contact@paranormalmusings.com',
  to: 'paranormalmusings@proton.me',
  replyTo: userEmail,
  subject: `New contact form message from ${userName}`,
  html: emailHTML,
})
```

---

## 🧪 STEP 5: Test Locally

### 5a. Restart Dev Server

```bash
npm run dev
```

Watch for any errors about SMTP configuration.

### 5b. Test Contact Form

1. Open http://localhost:3002/about
2. Scroll to contact form
3. Fill out:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: "This is a test message from paranormal investigations contact form"
4. Click "Send message"

### 5c: Check Results

**Success (Green Box):**
```
✓ Message received
Thank you for writing...
```

**Then check your email:**
- Login to `paranormalmusings@proton.me`
- Should have email from `contact@paranormalmusings.com`
- Subject: "New contact form message from Test User"
- Can reply directly to test@example.com

**If Error (Red Box):**
Check server logs:
```
npm run dev
# Look for [SMTP] errors
```

---

## ⚠️ TROUBLESHOOTING

### Issue: "SMTP connection failed"

**Cause:** Wrong host, port, or credentials

**Fix:**
1. Verify values in Hostinger dashboard
2. Check `.env.local` has correct values
3. Make sure password doesn't have special characters (or quote it)
4. Try port 465 instead of 587

### Issue: "Authentication failed"

**Cause:** Wrong username or password

**Fix:**
1. Verify email address is exactly: `contact@paranormalmusings.com`
2. Verify password matches what you set in Hostinger
3. Try creating email again with simpler password (for testing)

### Issue: "Email sends but never arrives"

**Cause:** Spam folder or mail server issue

**Fix:**
1. Check paranormalmusings@proton.me spam folder
2. Whitelist: contact@paranormalmusings.com
3. Contact Hostinger support if persistent

### Issue: Form works but email doesn't send

**Check:**
1. `.env.local` has `SMTP_HOST` value
2. Restarted dev server after adding env vars
3. Check console logs for [SMTP] errors

---

## 📊 Comparison: Resend vs Hostinger SMTP

| Feature | Resend | Hostinger SMTP |
|---------|--------|---|
| **Cost** | $0-20/mo | FREE |
| **Setup time** | 5 mins | 20 mins |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Deliverability** | Excellent | Good |
| **Dashboard** | Yes | No |
| **Already in code** | Yes | No (need npm install) |

---

## 🚀 Deploying to Hostinger

### 1. Add Environment Variables on Hostinger

1. Log into Hostinger Cloud dashboard
2. Go to **Environment Variables** or **Settings**
3. Add each variable:

```
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=your-strong-password
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
```

### 2. Redeploy

1. Push code to GitHub:
```bash
git add .
git commit -m "Set up Hostinger SMTP email delivery"
git push origin main
```

2. Hostinger auto-deploys OR click Deploy button

3. Wait for deployment to complete

### 3. Test on Production

1. Visit https://paranormalmusings.com/about
2. Fill contact form
3. Check paranormalmusings@proton.me for email
4. Reply to test user

---

## ✅ Checklist

Before deploying:
- [ ] Created email account on Hostinger (`contact@paranormalmusings.com`)
- [ ] Copied SMTP credentials (host, port, user, password)
- [ ] Added credentials to `.env.local`
- [ ] Ran `npm install nodemailer`
- [ ] Restarted dev server
- [ ] Tested form locally (green success message)
- [ ] Received test email at paranormalmusings@proton.me
- [ ] Added env vars to Hostinger dashboard
- [ ] Deployed to production
- [ ] Tested form on https://paranormalmusings.com
- [ ] Received production email

---

## 🎯 FAQ

**Q: Can I test without creating the email account?**
A: No, SMTP requires valid credentials. Create the account first.

**Q: What password should I use?**
A: Strong password (12+ chars, numbers, symbols). Avoid special chars like !@#$ in password.

**Q: Will emails be reliable?**
A: Yes, Hostinger's mail servers are stable. You may occasionally see delays (5-30 mins).

**Q: Can I change the sender name?**
A: Yes, in the code change: `from: 'contact@paranormalmusings.com'`

**Q: Will I get spam?**
A: Less than Resend. SPF/DKIM setup helps (ask Hostinger if needed).

**Q: Can I use multiple email accounts?**
A: Yes, create multiple accounts and update `SMTP_USER` for each.

---

## 📞 Support

If issues persist:
1. Check Hostinger support: https://support.hostinger.com
2. Search for: "Hostinger SMTP settings"
3. Ask Hostinger to enable SMTP on your email account

---

**You're all set!** 🚀

Once you complete Steps 1-3, the contact form will send emails via your Hostinger account.

**Ready to proceed?**

# ✅ Email Requirements - Complete Checklist

**Everything needed to send emails from contact form**

---

## 1️⃣ DATA NEEDED FROM USER

When someone fills the contact form, we collect:

```
Name:     "John Doe"           ← User enters
Email:    "john@example.com"    ← User enters
Message:  "I saw a ghost..."    ← User enters
```

**These 3 fields are REQUIRED.** Form won't submit without them.

---

## 2️⃣ HOSTINGER EMAIL ACCOUNT

**Create ONE email account on Hostinger:**

```
Email Address: contact@paranormalmusings.com
Password: strong-password-12345!
```

**Location:** Hostinger dashboard → Email section

---

## 3️⃣ SMTP CREDENTIALS

**From Hostinger, get these 4 values:**

```
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=strong-password-12345!
```

**How to get:**
1. Go to Hostinger email settings
2. Look for "SMTP Settings" or "Connection Settings"
3. Copy the 4 values

---

## 4️⃣ ENVIRONMENT VARIABLES

**Add to `.env.local`:**

```env
# Email Configuration
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=your-password-here
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
```

**Locations where needed:**
- [ ] `.env.local` (local development)
- [ ] Hostinger dashboard (production)

---

## 5️⃣ NODEJS PACKAGE

**Install nodemailer (handles SMTP):**

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

**Verify:**
```bash
npm list nodemailer
# Should show: nodemailer@6.x.x
```

---

## 6️⃣ CODE (Already Done ✅)

**Files modified for email:**
- ✅ `/api/contact/route.ts` - Updated to use SMTP
- ✅ `/lib/smtp.ts` - SMTP email utility
- ✅ `.env.local` - Added SMTP variables

**No additional code changes needed.**

---

## 7️⃣ FORM DATA FLOW

Here's exactly what happens:

```
┌─────────────────────────────┐
│ USER SUBMITS FORM           │
│ Name: John Doe              │
│ Email: john@example.com     │
│ Message: I saw a ghost      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ FRONTEND VALIDATION         │
│ ✅ Name not empty?          │
│ ✅ Email valid format?      │
│ ✅ Message 10+ characters?  │
│ ✅ Honeypot empty?          │
│ ✅ Turnstile token?         │
└──────────────┬──────────────┘
               │ All pass
               ▼
┌─────────────────────────────┐
│ SEND TO API                 │
│ POST /api/contact           │
│ Data: name, email, message  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ SERVER VALIDATION           │
│ ✅ Rate limited?            │
│ ✅ Fields valid?            │
│ ✅ Email format?            │
│ ✅ Message length?          │
└──────────────┬──────────────┘
               │ All pass
               ▼
┌─────────────────────────────┐
│ SEND EMAIL VIA HOSTINGER    │
│ Host: mail.paranormal...    │
│ Port: 587                   │
│ User: contact@paranormal... │
│ Pass: your-password         │
│                             │
│ From: contact@paranormal... │
│ To: paranormalmusings@...   │
│ Reply-To: john@example.com  │
│ Subject: New contact msg    │
│ Body: User's message        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ EMAIL DELIVERED             │
│ Recipient: paranormal...@   │
│ proton.me                   │
│ Status: ✅ Success          │
└─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│ USER SEES SUCCESS MESSAGE   │
│ ✓ Message received          │
│ Thank you for writing...    │
└─────────────────────────────┘
```

---

## 📋 COMPLETE CHECKLIST

### Phase 1: Setup (Do Once)

**On Hostinger:**
- [ ] Log into Hostinger dashboard
- [ ] Create email: `contact@paranormalmusings.com`
- [ ] Copy SMTP credentials:
  - [ ] Host
  - [ ] Port
  - [ ] User
  - [ ] Password

**On Your Computer:**
- [ ] Update `.env.local` with SMTP credentials
- [ ] Run: `npm install nodemailer`
- [ ] Run: `npm install --save-dev @types/nodemailer`

**Code:**
- [ ] Already updated (no action needed)

### Phase 2: Testing (Verify)

**Local Test:**
- [ ] Restart dev server: `npm run dev`
- [ ] Open form: http://localhost:3002/about
- [ ] Fill form with test data
- [ ] Click "Send message"
- [ ] See green success box
- [ ] Check email arrives at paranormalmusings@proton.me

**Production Test:**
- [ ] Add same SMTP env vars to Hostinger dashboard
- [ ] Deploy to production
- [ ] Test form at https://paranormalmusings.com
- [ ] Verify email arrives

---

## 🚨 CRITICAL REQUIREMENTS

**Without these, emails WON'T SEND:**

1. ❌ SMTP credentials not configured
   → Email won't send, form shows error

2. ❌ Nodemailer not installed
   → Server crashes when form submitted

3. ❌ Environment variables not set
   → API can't access SMTP settings

4. ❌ Hostinger email account not created
   → SMTP authentication fails

5. ❌ Port 587 blocked by firewall
   → Connection times out (rare)

---

## ✅ WHAT YOU NEED TO DO

### Step 1: Get Hostinger Email Details
```
Go to Hostinger dashboard
  → Email section
  → Create email: contact@paranormalmusings.com
  → View settings
  → Copy these 4 values:
     • SMTP_HOST
     • SMTP_PORT
     • SMTP_USER (email address)
     • SMTP_PASSWORD
```

### Step 2: Update `.env.local`
```bash
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=YOUR-PASSWORD-HERE
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
```

### Step 3: Install Package
```bash
npm install nodemailer
```

### Step 4: Restart & Test
```bash
npm run dev
# Visit http://localhost:3002/about
# Fill form and submit
# Check paranormalmusings@proton.me for email
```

### Step 5: Deploy
```bash
# Add same SMTP env vars to Hostinger dashboard
# Deploy to production
# Test at https://paranormalmusings.com
```

---

## 📧 EMAIL EXAMPLE

**What you'll receive in paranormalmusings@proton.me:**

```
From:       contact@paranormalmusings.com
To:         paranormalmusings@proton.me
Reply-To:   john@example.com
Subject:    New contact form message from John Doe

┌─────────────────────────────────────┐
│ New Contact Form Message            │
│                                     │
│ From: John Doe                      │
│ Reply to: john@example.com          │
│                                     │
│ Message:                            │
│ I saw a ghost in my house at 3am.   │
│ Can you help me understand?         │
│                                     │
│ Sent from paranormalmusings.com     │
└─────────────────────────────────────┘
```

**You can reply directly** - just click reply and type.

---

## ❓ COMMON QUESTIONS

**Q: What if I don't have all the credentials yet?**
A: The form will work but emails won't send until you add them.

**Q: What if email doesn't arrive?**
A: Check spam folder, verify SMTP credentials are correct, check firewall.

**Q: Can I use a different email for contact form?**
A: Yes, create `info@paranormalmusings.com` or any email you want.

**Q: Will emails be encrypted?**
A: Yes, port 587 uses TLS encryption.

**Q: Can users reply to emails?**
A: Yes! Reply-To is set to their email address.

**Q: What if SMTP_PASSWORD has special characters?**
A: Quote it: `SMTP_PASSWORD="my!@#$password"`

---

## 🎯 SUMMARY

| Item | Status | What to Do |
|------|--------|-----------|
| **User data collection** | ✅ Ready | Form collects name, email, message |
| **Hostinger email** | ⏳ Pending | Create `contact@paranormalmusings.com` |
| **SMTP credentials** | ⏳ Pending | Get from Hostinger, add to `.env.local` |
| **Nodemailer** | ⏳ Pending | Run `npm install nodemailer` |
| **Code changes** | ✅ Done | Already updated |
| **Environment setup** | ⏳ Pending | Add SMTP vars to `.env.local` |
| **Testing** | ⏳ Pending | Test form locally then on production |

---

**Ready to get started?** Tell me when you've created the Hostinger email account and I'll help with the rest! 🚀

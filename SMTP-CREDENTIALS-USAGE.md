# Using SMTP Credentials - Step by Step

**You have 4 credentials from Hostinger. Here's what to do with them.**

---

## 📋 YOUR 4 CREDENTIALS

From Hostinger, you should have:

```
1. SMTP_HOST = mail.paranormalmusings.com
2. SMTP_PORT = 587
3. SMTP_USER = contact@paranormalmusings.com
4. SMTP_PASSWORD = [the password you created]
```

---

## 📝 STEP 1: Update `.env.local`

### What is `.env.local`?
- File that stores sensitive information
- NOT uploaded to GitHub
- Only used locally and on Hostinger server
- Contains passwords, API keys, secrets

### Where is it?
```
d:\vedicology-files\paranormalmusings\paranormalmusings-frontend\.env.local
```

### What to do:

1. **Open the file** in a text editor
2. **Find this section:**
```env
# Google Analytics 4 - Add your GA4 Measurement ID here
NEXT_PUBLIC_GA_ID=
```

3. **Add these lines AFTER it:**
```env
# Hostinger SMTP Configuration
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=your-password-here
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
```

4. **Replace:**
   - `your-password-here` → The password you created for contact@paranormalmusings.com

### Example after update:
```env
ADMIN_API_URL=http://localhost:3001
CONTENT_REVALIDATE=60
REVALIDATE_SECRET=dev-revalidate-secret

# Google Analytics 4 - Add your GA4 Measurement ID here
NEXT_PUBLIC_GA_ID=

# Hostinger SMTP Configuration
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=MyStrongPassword123!
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
```

5. **Save the file**

---

## 📚 WHAT EACH CREDENTIAL DOES

### `SMTP_HOST=mail.paranormalmusings.com`
- **What:** The mail server location
- **Why:** Tells the email system WHERE to send emails
- **Always:** `mail.paranormalmusings.com` (for Hostinger)

### `SMTP_PORT=587`
- **What:** The port (connection channel)
- **Why:** Tells the system HOW to connect (secure)
- **Always:** `587` for Hostinger (or `465` as alternative)
- **Security:** Port 587 uses TLS encryption

### `SMTP_USER=contact@paranormalmusings.com`
- **What:** The email login username
- **Why:** Proves you own this email account
- **Format:** Must be exact email address you created

### `SMTP_PASSWORD=YourPassword123!`
- **What:** The email account password
- **Why:** Authenticates/proves it's really you
- **Security:** This is SECRET - never share it
- **Note:** If password has special chars like `!@#$`, wrap in quotes: `SMTP_PASSWORD="My!@#$Pass"`

### `SMTP_FROM=contact@paranormalmusings.com`
- **What:** Who the email appears to come FROM
- **Why:** Sets the sender address
- **Shows in inbox:** User sees "From: contact@paranormalmusings.com"

### `CONTACT_EMAIL_TO=paranormalmusings@proton.me`
- **What:** Where form submissions are RECEIVED
- **Why:** Tells system where to send contact form emails
- **You check:** Your Proton Mail inbox for these emails

---

## 🔐 SECURITY RULES

**NEVER do these:**
- ❌ Don't share your SMTP_PASSWORD
- ❌ Don't commit `.env.local` to GitHub
- ❌ Don't post credentials online
- ❌ Don't include in screenshots

**DO these:**
- ✅ Keep `.env.local` locally only
- ✅ Use strong password (8+ chars, numbers, symbols)
- ✅ Save `.env.local` in `.gitignore` (it already is)

---

## ✅ STEP 2: Install Nodemailer

Nodemailer is the package that SENDS emails via SMTP.

### Run this command:
```bash
cd d:\vedicology-files\paranormalmusings\paranormalmusings-frontend
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Verify it installed:
```bash
npm list nodemailer
```

Should show: `nodemailer@6.x.x` or similar

---

## 🚀 STEP 3: Restart Dev Server

Now the system knows your SMTP credentials.

### Stop the running server:
```
Press Ctrl+C in the terminal running npm run dev
```

### Restart it:
```bash
npm run dev
```

### Watch for errors:
- If you see `[SMTP] error` → credential issue
- If you see `Error: Cannot find module 'nodemailer'` → npm install didn't work

---

## 🧪 STEP 4: Test the Form

### Test locally:

1. **Open form:**
   ```
   http://localhost:3002/about
   ```
   (or scroll to contact form on any page)

2. **Fill out:**
   ```
   Name: Test User
   Email: test@example.com
   Message: This is a test email from the contact form
   ```

3. **Click "Send message"**

### Expected results:

**Success (Green Box):**
```
✓ Message received
Thank you for writing. We read everything
but cannot reply to every message.
Your inquiry has been recorded.

[Send another message]
```

**Then check email:**
- Open paranormalmusings@proton.me
- Look for email from: contact@paranormalmusings.com
- Subject: "New contact form message from Test User"
- Body: Shows your test message

**If Error (Red Box):**
```
✗ Failed to process message.
Please try again later.
```

Check these:
1. Is `.env.local` saved? (with all 6 SMTP variables)
2. Did you restart dev server after saving?
3. Is SMTP_PASSWORD correct? (check it matches Hostinger)
4. Is Hostinger email account active? (check in Hostinger dashboard)

---

## 🌍 STEP 5: Deploy to Production

### On Hostinger Dashboard:

1. **Log into Hostinger**
2. **Go to Environment Variables** (or Settings)
3. **Add each variable:**
   ```
   SMTP_HOST=mail.paranormalmusings.com
   SMTP_PORT=587
   SMTP_USER=contact@paranormalmusings.com
   SMTP_PASSWORD=your-password
   SMTP_FROM=contact@paranormalmusings.com
   CONTACT_EMAIL_TO=paranormalmusings@proton.me
   ```
4. **Save**
5. **Redeploy** (click Deploy or push to GitHub)

### Test on production:

1. **Wait 5 mins for deploy**
2. **Visit:** https://paranormalmusings.com/about
3. **Fill form and submit**
4. **Check paranormalmusings@proton.me for email**

---

## 📊 COMPLETE FLOW DIAGRAM

```
You create email on Hostinger
  ↓
Get 4 SMTP credentials
  ↓
Add to .env.local file
  ↓
Install nodemailer (npm install)
  ↓
Restart dev server (npm run dev)
  ↓
Test form locally
  ↓
User submits form
  ↓
Form validates data
  ↓
API calls /api/contact
  ↓
Nodemailer connects to Hostinger SMTP
  ↓
Uses credentials to authenticate:
  • Host: mail.paranormalmusings.com
  • Port: 587
  • User: contact@paranormalmusings.com
  • Pass: your-password
  ↓
Sends email:
  • From: contact@paranormalmusings.com
  • To: paranormalmusings@proton.me
  • Reply-To: user's email
  • Subject: New contact form message
  • Body: User's message
  ↓
Email arrives in your Proton Mail inbox ✅
  ↓
You read it and can reply directly to user
```

---

## ⚙️ WHAT HAPPENS BEHIND SCENES

When user submits form:

```javascript
// 1. Form data collected
const data = {
  name: "John Doe",
  email: "john@example.com",
  message: "I saw a ghost...",
  honeypot: "",
  'cf-turnstile-response': "token..."
}

// 2. Sent to API
fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify(data)
})

// 3. API validates and creates nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // mail.paranormalmusings.com
  port: process.env.SMTP_PORT,      // 587
  secure: false,                     // TLS (not SSL)
  auth: {
    user: process.env.SMTP_USER,    // contact@paranormalmusings.com
    pass: process.env.SMTP_PASSWORD // your-password
  }
})

// 4. Sends email
await transporter.sendMail({
  from: 'contact@paranormalmusings.com',
  to: 'paranormalmusings@proton.me',
  replyTo: 'john@example.com',
  subject: 'New contact form message from John Doe',
  html: '<h2>John Doe wrote:</h2><p>I saw a ghost...</p>',
  text: 'Plain text version...'
})

// 5. Returns success to user
return { success: true, message: 'Thank you...' }
```

---

## ✅ CHECKLIST

- [ ] Opened `.env.local` file
- [ ] Added all 6 SMTP variables
- [ ] Replaced password with YOUR actual password
- [ ] Saved the file
- [ ] Ran `npm install nodemailer`
- [ ] Restarted dev server (`npm run dev`)
- [ ] Tested form locally
- [ ] Received test email at paranormalmusings@proton.me
- [ ] Added same variables to Hostinger dashboard
- [ ] Deployed to production
- [ ] Tested form on https://paranormalmusings.com
- [ ] Received production email

---

## 🎯 SUMMARY

**Your credentials tell the system:**
- WHERE to send emails (SMTP_HOST)
- HOW to connect (SMTP_PORT)
- WHO you are (SMTP_USER + SMTP_PASSWORD)
- WHO the email is FROM (SMTP_FROM)
- WHERE you receive emails (CONTACT_EMAIL_TO)

**When user submits form:**
```
User's data → Validated → SMTP sends via Hostinger → Your inbox
```

---

## 💬 NEXT STEP

**Tell me:**
1. Is `.env.local` updated? (Yes/No)
2. Did you run `npm install nodemailer`? (Yes/No)
3. Did you restart dev server? (Yes/No)
4. Are you ready to test? (Yes/No)

Once all Yes → I'll help you test! 🚀

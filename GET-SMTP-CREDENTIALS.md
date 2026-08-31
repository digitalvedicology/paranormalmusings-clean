# How to Get SMTP Credentials from Hostinger

**After creating contact@paranormalmusings.com, here's exactly how to find & copy SMTP settings**

---

## 🎯 WHAT YOU'RE LOOKING FOR

After creating the email, Hostinger shows 4 credentials you need:

```
1. SMTP_HOST = mail.paranormalmusings.com
2. SMTP_PORT = 587 (or 465)
3. SMTP_USER = contact@paranormalmusings.com
4. SMTP_PASSWORD = [the password you created]
```

Here's how to find them...

---

## ✅ METHOD 1: From Email List (Easiest)

### Step 1a: You're Already on Email Page
After creating the email, you should see the email listed:

```
┌────────────────────────────────────────┐
│ Email Accounts                         │
├────────────────────────────────────────┤
│                                        │
│ ✉ contact@paranormalmusings.com      │
│                                        │
│ Status: Active                         │
│ Storage: 0 MB / 100 MB                 │
│                                        │
│ [Settings] [Delete] [More options]    │
│                                        │
└────────────────────────────────────────┘
```

### Step 1b: Click [Settings] Button
Look for a button that says:
- **[Settings]**
- or **[⚙️]** (gear icon)
- or **[View]**
- or **[Details]**

Click it.

### Step 1c: You'll See Settings Page
```
┌────────────────────────────────────────┐
│ contact@paranormalmusings.com          │
│ Settings                               │
├────────────────────────────────────────┤
│                                        │
│ Email Address                          │
│ contact@paranormalmusings.com          │
│                                        │
│ Password                               │
│ ••••••••••                             │
│ [Change Password]                      │
│                                        │
│ Storage                                │
│ 0 MB / 100 MB                          │
│                                        │
│ SMTP Settings                    ← !!  │
│ ─────────────────────────────────── │  │
│ Look here for credentials!              │
│                                        │
└────────────────────────────────────────┘
```

---

## ✅ METHOD 2: Scroll Down for SMTP Settings

### Step 2a: Scroll Down on Settings Page
On the settings page, scroll **DOWN** (don't close the page)

### Step 2b: Find "SMTP Settings" or "Mail Client Settings"

You'll see a section like:

```
┌────────────────────────────────────────┐
│ SMTP Settings                          │
│ (or "Mail Client Settings" or          │
│  "Outgoing Mail Server")               │
├────────────────────────────────────────┤
│                                        │
│ SMTP Server (Outgoing):                │
│ mail.paranormalmusings.com             │
│                                        │
│ SMTP Port:                             │
│ 587                                    │
│                                        │
│ Username (Login):                      │
│ contact@paranormalmusings.com          │
│                                        │
│ Password:                              │
│ [the password you created]             │
│                                        │
│ Encryption:                            │
│ TLS / STARTTLS                         │
│                                        │
│ [Copy] or [Copy to Clipboard]          │
│                                        │
└────────────────────────────────────────┘
```

### Step 2c: COPY The 4 Values

Write down or copy these EXACTLY:

```
SMTP_HOST = mail.paranormalmusings.com
SMTP_PORT = 587
SMTP_USER = contact@paranormalmusings.com
SMTP_PASSWORD = [password you created]
```

---

## 📋 WHAT EACH VALUE MEANS

| Value | Example | Meaning |
|-------|---------|---------|
| **SMTP_HOST** | `mail.paranormalmusings.com` | Where to send emails (always starts with `mail.`) |
| **SMTP_PORT** | `587` | Connection port (587 = TLS, 465 = SSL) |
| **SMTP_USER** | `contact@paranormalmusings.com` | Login username (your full email) |
| **SMTP_PASSWORD** | `Contact@2024#Email` | Password you created (KEEP SECRET!) |

---

## 🔍 IF YOU CAN'T FIND SMTP SETTINGS

### Option A: Email List View
1. Go back to **Email** page (left sidebar)
2. Look for email: `contact@paranormalmusings.com`
3. Click on the **email name** itself (not a button)
4. Should open settings

### Option B: Three-Dot Menu
1. Find `contact@paranormalmusings.com` in list
2. Click **[⋮]** (three dots) or **[More]**
3. Look for:
   - **"Settings"**
   - **"View Settings"**
   - **"Email Settings"**
   - **"Connection Settings"**
4. Click it

### Option C: Right-Click Context Menu
1. Find `contact@paranormalmusings.com` in list
2. Right-click on it
3. Look for **"View Settings"** or **"Properties"**
4. Click it

### Option D: Default Values
If you really can't find settings, Hostinger **always** uses:

```
SMTP_HOST = mail.paranormalmusings.com
SMTP_PORT = 587
SMTP_USER = contact@paranormalmusings.com
SMTP_PASSWORD = [your password]
```

Just use these!

---

## 📸 FULL VISUAL WALKTHROUGH

### View 1: Email Accounts List
```
Hostinger Dashboard
    ↓
Email (left sidebar)
    ↓
See email list
    ↓
┌──────────────────────────────────────┐
│ Email Accounts                       │
├──────────────────────────────────────┤
│ 📧 contact@paranormalmusings.com    │
│                                      │
│ [Settings] [Delete] [⋮]             │
│                                      │
└──────────────────────────────────────┘
     ↓ Click [Settings]
```

### View 2: Email Settings Page
```
┌──────────────────────────────────────┐
│ contact@paranormalmusings.com        │
│ Settings                             │
├──────────────────────────────────────┤
│                                      │
│ Email Address                        │
│ contact@paranormalmusings.com        │
│                                      │
│ Password                             │
│ ••••••••••••                         │
│ [Change]                             │
│                                      │
│ ─────────────────────────────────── │
│ Scroll DOWN ↓↓↓ to find:            │
│ ─────────────────────────────────── │
│                                      │
└──────────────────────────────────────┘
     ↓ Scroll Down
```

### View 3: SMTP Settings Section
```
┌──────────────────────────────────────┐
│ SMTP Settings                        │
├──────────────────────────────────────┤
│                                      │
│ SMTP Server:                         │
│ mail.paranormalmusings.com           │ ← COPY THIS
│                                      │
│ Port:                                │
│ 587                                  │ ← COPY THIS
│                                      │
│ Username:                            │
│ contact@paranormalmusings.com        │ ← COPY THIS
│                                      │
│ Password:                            │
│ [your-password-here]                 │ ← COPY THIS
│                                      │
│ [Copy Settings] or [Copy to Clip]   │
│                                      │
└──────────────────────────────────────┘
```

---

## 💾 HOW TO SAVE THE CREDENTIALS

### Option 1: Write on Paper (Most Secure)
```
SMTP_HOST: mail.paranormalmusings.com
SMTP_PORT: 587
SMTP_USER: contact@paranormalmusings.com
SMTP_PASSWORD: [write it here]
```

### Option 2: Copy to Text File (Temporary)
Create file: `SMTP-TEMP.txt`
```
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=your-password-here
```

Then later add to `.env.local`

### Option 3: Directly to `.env.local`
Open `.env.local` and add:
```env
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=your-password-here
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
```

---

## 🚨 IMPORTANT SECURITY NOTES

**NEVER:**
- ❌ Share SMTP_PASSWORD online
- ❌ Post it in Slack/Discord/GitHub
- ❌ Include in screenshots
- ❌ Commit `.env.local` to GitHub (it's in .gitignore, so it won't be)

**DO:**
- ✅ Keep password secret
- ✅ Store in `.env.local` only
- ✅ Write down on paper if needed
- ✅ Use strong password (which you already did)

---

## ✅ CHECKLIST

- [ ] Logged into Hostinger
- [ ] Clicked Email section
- [ ] Found: contact@paranormalmusings.com
- [ ] Clicked [Settings]
- [ ] Scrolled down to SMTP Settings
- [ ] Copied/wrote down SMTP_HOST
- [ ] Copied/wrote down SMTP_PORT
- [ ] Copied/wrote down SMTP_USER
- [ ] Copied/wrote down SMTP_PASSWORD
- [ ] Ready to add to .env.local ✓

---

## 🎯 WHAT TO DO WITH CREDENTIALS

Once you have all 4 values:

### Step 1: Open `.env.local` File
```
d:\vedicology-files\paranormalmusings\paranormalmusings-frontend\.env.local
```

### Step 2: Add These Lines
```env
# Hostinger SMTP Configuration
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=your-password-here
SMTP_FROM=contact@paranormalmusings.com
CONTACT_EMAIL_TO=paranormalmusings@proton.me
```

### Step 3: Save File
```
Ctrl+S (Windows)
```

### Step 4: Install Nodemailer
```bash
cd paranormalmusings-frontend
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Step 5: Restart Dev Server
```bash
npm run dev
```

### Step 6: Test
- Open: http://localhost:3002/about
- Fill contact form
- Click "Send message"
- Check email in paranormalmusings@proton.me

---

## 🆘 STUCK?

**If you can't find SMTP settings:**

1. Try right-clicking email name
2. Look for "Connection Settings" instead of "SMTP Settings"
3. Check if there's a dropdown menu
4. Look for "Mail Client Configuration"

**Worst case:** Just use these defaults (always work on Hostinger):
```
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=[the password you created]
```

---

## 📞 NEXT STEP

**Tell me when you see the SMTP Settings section and I'll help you add them to `.env.local`!**

Or if you already have the 4 values:
```
✅ SMTP_HOST: mail.paranormalmusings.com
✅ SMTP_PORT: 587
✅ SMTP_USER: contact@paranormalmusings.com
✅ SMTP_PASSWORD: [secured - you have it]

Ready to add to .env.local!
```

Then we'll install nodemailer and test! 🚀

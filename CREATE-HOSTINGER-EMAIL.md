# How to Create Email on Hostinger

**Step-by-step guide to create contact@paranormalmusings.com**

---

## 🎯 WHAT YOU'LL DO

Create an email account that will **send** contact form emails to your inbox.

```
contact@paranormalmusings.com (sender)
         ↓
       SMTP
         ↓
paranormalmusings@proton.me (receiver - you)
```

---

## ✅ STEP 1: Log Into Hostinger

### 1a. Open Hostinger
Go to: **https://hpanel.hostinger.com**

### 1b. Sign In
- Enter your **email** (the one you used to create Hostinger account)
- Enter your **password**
- Click **Log In**

### 1c. Select Your Domain
- Look for **paranormalmusings.com** in the list
- Click on it

**You should now see the Hostinger dashboard for paranormalmusings.com**

---

## ✅ STEP 2: Find Email Section

### 2a. Look for Email in Left Menu
In the **left sidebar**, find one of these:
- **Email** ← Most common
- **Email Accounts**
- **Mail**
- **Email Forwarding**

Click it.

### 2b. You Should See
A page showing:
- "Email Accounts"
- A button like **"Create Email Account"** or **"Add Email"** or **"+"**

---

## ✅ STEP 3: Create Email Account

### 3a. Click "Create Email Account" Button
Look for a button that says:
- **"Create Email Account"**
- or **"Add Email"**
- or **"+"**
- or **"New Email Account"**

Click it.

### 3b. Fill In the Form

You'll see a form with fields:

```
Email Address: _______________________
Password:      _______________________
Confirm Pwd:   _______________________
```

### 3c. Enter Email Address

**First field - Email Address:**
```
Type: contact@paranormalmusings.com
```

**Important:** Make sure it says `@paranormalmusings.com` (not gmail, not other domain)

### 3d. Create Strong Password

**Second field - Password:**

Create a **strong password**:
- At least 8 characters (preferably 12+)
- Include: UPPERCASE letters
- Include: lowercase letters
- Include: numbers (0-9)
- Include: special characters (!@#$%)

**Example passwords:**
```
✅ Contact@2024#Email
✅ Paranormal$Email123
✅ SendForm@Host!2024
```

**Do NOT use:**
```
❌ password
❌ 12345678
❌ contact123
```

### 3e. Confirm Password

**Third field - Confirm Password:**

Type the **same password** again

---

## ✅ STEP 4: Create Account

### 4a. Click "Create" or "Save"
Look for a button that says:
- **"Create"**
- or **"Create Email Account"**
- or **"Save"**
- or **"Confirm"**

Click it.

### 4b. Wait for Confirmation
You should see:
```
✅ Email account created successfully!
```

or

```
Email account has been created:
contact@paranormalmusings.com
```

---

## ✅ STEP 5: Get SMTP Credentials

Now you need to copy the SMTP credentials (4 values).

### 5a. Find Your Email in List
On the email page, you should see your new email listed:
```
contact@paranormalmusings.com
```

### 5b. Click on It
Click on **contact@paranormalmusings.com** to see settings

### 5c. Find "SMTP Settings" or "Settings"
Look for a section called:
- **"SMTP Settings"**
- or **"Connection Settings"**
- or **"Mail Client Settings"**
- or **"Outgoing Server"**

### 5d. Copy These 4 Values

You'll see something like:

```
SMTP Server (Outgoing):  mail.paranormalmusings.com
SMTP Port:               587
Username:                contact@paranormalmusings.com
Password:                [the password you just created]
```

**Copy these EXACTLY:**

1. **SMTP_HOST:** `mail.paranormalmusings.com`
2. **SMTP_PORT:** `587`
3. **SMTP_USER:** `contact@paranormalmusings.com`
4. **SMTP_PASSWORD:** `[your password]`

**Important Notes:**
- Port might show as 587 or 465 (either works, use 587)
- Username is always the full email address
- Password is the one you created in Step 3d

---

## 📸 VISUAL GUIDE

### Dashboard View
```
┌─────────────────────────────────────┐
│ Hostinger hPanel                    │
├─────────────────────────────────────┤
│ ▶ My Domains                        │
│ ▶ Email        ← CLICK HERE         │
│ ▶ Hosting      
│ ▶ Websites     
└─────────────────────────────────────┘
```

### Email Section
```
┌─────────────────────────────────────┐
│ Email Accounts                      │
├─────────────────────────────────────┤
│                                     │
│ [+ Create Email Account] ← CLICK    │
│                                     │
└─────────────────────────────────────┘
```

### Create Email Form
```
┌─────────────────────────────────────┐
│ Create Email Account                │
├─────────────────────────────────────┤
│                                     │
│ Email Address:                      │
│ [contact@paranormalmusings.com] ✓   │
│                                     │
│ Password:                           │
│ [Contact@2024#Email      ] ✓        │
│                                     │
│ Confirm Password:                   │
│ [Contact@2024#Email      ] ✓        │
│                                     │
│            [Create Account]         │
│                                     │
└─────────────────────────────────────┘
```

### Settings/SMTP View
```
┌─────────────────────────────────────┐
│ contact@paranormalmusings.com       │
│ Settings                            │
├─────────────────────────────────────┤
│                                     │
│ SMTP Settings                       │
│ ─────────────────────────────────── │
│ SMTP Server: mail.paranormal...     │
│ SMTP Port:   587                    │
│ Username:    contact@paranormal...  │
│ Password:    Contact@2024#Email     │
│                                     │
│ [Copy Settings]                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 WHAT TO DO WITH THESE 4 VALUES

Once you have the 4 credentials, you'll add them to `.env.local`:

```env
SMTP_HOST=mail.paranormalmusings.com
SMTP_PORT=587
SMTP_USER=contact@paranormalmusings.com
SMTP_PASSWORD=Contact@2024#Email
```

Then:
1. Save .env.local
2. Run `npm install nodemailer`
3. Restart dev server
4. Test contact form
5. Deploy to production

---

## ✅ CHECKLIST

- [ ] Logged into https://hpanel.hostinger.com
- [ ] Selected paranormalmusings.com domain
- [ ] Found Email section in left menu
- [ ] Clicked "Create Email Account"
- [ ] Entered: contact@paranormalmusings.com
- [ ] Created strong password (12+ chars, mixed case, numbers, symbols)
- [ ] Clicked "Create"
- [ ] Saw success message
- [ ] Opened email settings
- [ ] Copied 4 SMTP values
- [ ] Ready to add to .env.local ✓

---

## 🆘 TROUBLESHOOTING

### Issue: "Can't find Email section"
**Solution:** 
- Look for these names in left menu:
  - Email
  - Mail
  - Email Accounts
  - Email Forwarding
  - Email Management
- If still not found, click on paranormalmusings.com domain name at top

### Issue: "Email already exists"
**Solution:**
- Email might have been created before
- Try using: `info@paranormalmusings.com` instead
- Or: `noreply@paranormalmusings.com`
- Then update SMTP_USER in .env.local

### Issue: "Password doesn't work"
**Solution:**
- Make sure password is:
  - Correct spelling
  - Correct case (uppercase vs lowercase)
  - No extra spaces
  - Don't include quotes
- If forgotten, reset it in Hostinger

### Issue: "Can't find SMTP settings"
**Solution:**
- Click on email account name to expand
- Look for: "Connection Settings" or "Outgoing Server"
- Or scroll down on the page
- Default for Hostinger is always:
  - Host: mail.[yourdomain].com
  - Port: 587
  - User: [your full email]
  - Pass: [password you created]

---

## 💡 TIPS

**Best practice for password:**
```
Use a phrase with replacement:
"My P@r@norm@l Email 2024!"

Or generate strong:
- Use password manager (1Password, LastPass)
- Or: https://www.random.org/passwords/

Write it down SECURELY (not in code)
```

**Email address options:**
- `contact@paranormalmusings.com` ✅ (good for forms)
- `info@paranormalmusings.com` ✅ (also good)
- `noreply@paranormalmusings.com` ✅ (for automated)
- `paranormalmusings@paranormalmusings.com` ❌ (confusing)

**Port options:**
- `587` ✅ (recommended - TLS)
- `465` ✅ (also works - SSL)
- `25` ❌ (not for submission)

---

## 🚀 NEXT STEPS

Once you have the 4 credentials:

1. **Tell me the SMTP values** (without password, for safety)
   ```
   SMTP_HOST: ___________________
   SMTP_PORT: ___________________
   SMTP_USER: ___________________
   SMTP_PASSWORD: ✓ [I won't show this]
   ```

2. **Or directly update .env.local:**
   ```env
   SMTP_HOST=mail.paranormalmusings.com
   SMTP_PORT=587
   SMTP_USER=contact@paranormalmusings.com
   SMTP_PASSWORD=[your-password-here]
   SMTP_FROM=contact@paranormalmusings.com
   CONTACT_EMAIL_TO=paranormalmusings@proton.me
   ```

3. **Then run:**
   ```bash
   npm install nodemailer
   npm run dev
   ```

4. **Test it!** 🎉

---

**Ready to create the email?** Let me know when you've got the credentials! 📧

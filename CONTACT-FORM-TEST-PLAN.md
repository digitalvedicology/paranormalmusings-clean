# Contact Form End-to-End Test Plan

**Status:** Ready to Test  
**Test Environment:** localhost:3002  
**Test Date:** 2026-08-31

---

## 📋 Test Checklist

### Part 1: API Validation ✅ DONE

**What works:**
- ✅ API endpoint exists at `/api/contact`
- ✅ Input validation working (name, email, message)
- ✅ Rate limiting enabled (5 per IP per hour)
- ✅ Honeypot spam protection enabled
- ✅ Email HTML generation working
- ✅ Payload CMS storage prepared

**Configuration Status:**
- ❓ Resend API key: **NOT configured** (RESEND_API_KEY)
- ❓ Turnstile: **NOT configured** (NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY)
- ✅ Contact email: **paranormalmusings@proton.me**
- ✅ Payload CMS: **Running on localhost:3001**

---

## Part 2: Test Scenarios

### Scenario 1: Full Form Submission (UI)
**Steps:**
1. Open http://localhost:3002/about (or navigate to WriteToUs section)
2. Find "Write to Us" section (replaced newsletter)
3. Fill contact form:
   - Name: "Test User"
   - Email: "your-email@example.com"
   - Message: "This is a test message from the paranormal investigation website contact form."
4. Complete Turnstile if visible (or skip if not configured)
5. Click "Send message"

**Expected Results:**
- [ ] Form submits without errors
- [ ] Success message appears (green box)
- [ ] Form clears after submission
- [ ] No console errors in DevTools

### Scenario 2: API Success Path
**Test with cURL:**
```bash
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Testing paranormal investigation contact form functionality and email delivery setup."
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Thank you. We have received your message..."
}
```

### Scenario 3: Validation Tests

**Test 3a: Missing fields**
```bash
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": ""}'
```
**Expected:** `{ "success": false, "error": "Missing required fields" }`

**Test 3b: Invalid email**
```bash
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "message": "Test message with minimum length required"
  }'
```
**Expected:** `{ "success": false, "error": "Invalid email address" }`

**Test 3c: Message too short**
```bash
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "message": "Short"
  }'
```
**Expected:** `{ "success": false, "error": "Message must be 10-5000 characters" }`

**Test 3d: Honeypot triggered**
```bash
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "message": "Test message with minimum required length to pass validation",
    "honeypot": "FILLED"
  }'
```
**Expected:** Silently succeeds (fools spam bots)

### Scenario 4: Rate Limiting
**Test:** Submit 6 messages from same IP within 5 seconds
```bash
for i in {1..6}; do
  curl -X POST http://localhost:3002/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name": "Test", "email": "test@example.com", "message": "Rate limit test message number '$i'"}'
  echo ""
done
```
**Expected:** Last request returns 429 with `retryAfter: <seconds>`

---

## Part 3: Email Configuration Status

### Current Setup:
- ✅ Email template: **HTML formatted, ready**
- ✅ Email recipient: **paranormalmusings@proton.me**
- ❌ Resend API key: **MISSING**

### To Enable Email Delivery:

1. **Get Resend API Key:**
   - Go to [resend.com](https://resend.com)
   - Create account with paranormalmusings@proton.me
   - Copy API key from dashboard

2. **Add to Environment:**
   ```
   RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXX
   ```
   - Add to `.env.local` (development)
   - Add to server environment (production)

3. **Verify Setup:**
   - Run: `echo $RESEND_API_KEY` (should not be empty)
   - Restart dev server
   - Test contact form again

---

## Part 4: Payload CMS Integration

### Current Status:
- ✅ API endpoint: `/api/contact-messages` (ready in admin)
- ✅ Payload CMS running: `localhost:3001`
- ✅ Fallback storage: **Messages stored in Payload if Resend fails**

### Test Storage:
1. Submit form via http://localhost:3002/about
2. Check Payload admin at http://localhost:3001
3. Look for "Contact Messages" collection
4. Should show your test submission

---

## Expected Flow

```
User fills form → Browser validates → API validates → 
  ├─ Try send email via Resend
  ├─ Try store in Payload CMS
  └─ If either succeeds → Show success
  └─ If both fail → Show error
```

**Current status:** Will succeed if Payload CMS is reachable (fallback)

---

## Success Criteria ✅

After completing tests:
- [ ] Form submission doesn't crash
- [ ] Validation errors show correctly
- [ ] Success message displays
- [ ] Rate limiting works
- [ ] Honeypot silently succeeds
- [ ] Email or Payload storage confirms receipt

**Deployment Ready When:**
- ✅ API validates and stores messages
- ⏳ (Optional) Email delivery configured via Resend

---

## Quick Test Command

```bash
# Send valid test submission
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Investigator",
    "email": "test@paranormalmusings.com",
    "message": "I am testing the paranormal musings contact form to verify email delivery and validation are working correctly before launch."
  }'

# Expected: {"success":true,"message":"Thank you. We have received your message..."}
```

---

## Notes

- **Dev Server:** Running on http://localhost:3002 (not 3000)
- **Contact Email:** paranormalmusings@proton.me
- **Fallback:** Payload CMS stores all submissions even if email fails
- **Rate Limit:** 5 submissions per IP per hour
- **Message Length:** 10-5000 characters required

---

**Ready to test?** Pick any scenario above and report results! 🧪

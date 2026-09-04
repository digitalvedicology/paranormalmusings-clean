# Quick Fix - Get SEO Data on Live Site (5 minutes)

## The Issue
```
✅ SEO data in JSON file
❌ SEO data NOT in MongoDB
❌ Frontend can't see SEO (reads from MongoDB)
```

## The Fix (3 Steps)

### Step 1: Get Your MongoDB URI (1 min)

**MongoDB Atlas (Cloud):**
1. Go to: https://www.mongodb.com/atlas
2. Click: Cluster → Connect → Drivers
3. Copy the connection string
4. It looks like: `mongodb+srv://user:pass@cluster.mongodb.net/paranormalmusings`

**OR if you already have it:** Find it in your production environment/hosting panel

### Step 2: Run Migration (2 min)

Open terminal in `paranormalmusings-admin/` and run:

```bash
MONGODB_URI="mongodb+srv://YOUR_FULL_CONNECTION_STRING" npm run migrate:mongo -- --force
```

**Replace** `mongodb+srv://YOUR_FULL_CONNECTION_STRING` with your actual connection string

**You should see:**
```
✓ Connected to MongoDB
✓ Imported X posts
✓ Imported X categories  
✓ Settings synced
✓ Migration complete!
```

### Step 3: Rebuild & Restart (2 min)

```bash
# Admin
npm run build
pm2 restart pm-admin

# Frontend
cd ../paranormalmusings-frontend
npm run build  
pm2 restart pm-frontend

# Check it worked
sleep 5
curl -s "https://frontend.paranormalmusings.com/" | grep -o '<title>' && echo "✅ Live site is up!"
```

## Verify It Worked

### Test 1: View any article
Visit: `https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/`

Right-click → View Page Source → Search for:
- `<title>` - Should show your SEO title ✅
- `og:title` - Should show OG title ✅
- `og:image` - Should show image path ✅

### Test 2: Check API directly
```bash
curl "https://admin.paranormalmusings.com/api/content" | grep "metaTitle" | wc -l
# Should output: 83 (or however many posts you have)
```

### Test 3: Social sharing
Visit: https://developers.facebook.com/tools/debug/og/object

Paste any article URL and it should show:
- ✅ Correct title
- ✅ Correct description
- ✅ Image preview

---

## If It Doesn't Work

### Error: "MONGODB_URI is not set"
```bash
# Make sure to set the variable BEFORE running npm command
export MONGODB_URI="mongodb+srv://..."
npm run migrate:mongo -- --force
```

### Error: "Connection refused"
```bash
# Test the connection first
mongosh "your-connection-string"
# Should connect and show: admin>
```

### Error: "Database not empty"
```bash
# The --force flag allows overwriting
npm run migrate:mongo -- --force
# Don't forget the --force!
```

### Still no SEO tags showing?
```bash
# 1. Clear cache
rm -rf paranormalmusings-frontend/.next

# 2. Rebuild
npm run build

# 3. Restart
pm2 restart pm-frontend

# 4. Wait 10 seconds then check
sleep 10
curl -s "https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/" | grep '<title>'
```

---

## What This Does

```
Before Migration:
  content.json (has SEO) ← Import script put it here
  MongoDB (no SEO) ← Frontend reads from here
  Result: ❌ No SEO on live site

After Migration:
  content.json (has SEO) 
  MongoDB (NOW has SEO) ← Frontend reads from here
  Result: ✅ SEO on live site!
```

---

## One-Liner Command

If you just want to copy-paste:

```bash
cd paranormalmusings-admin && MONGODB_URI="paste-your-connection-string-here" npm run migrate:mongo -- --force && npm run build && cd ../paranormalmusings-frontend && npm run build && pm2 restart pm-admin pm-frontend
```

---

**Time to fix: ~5 minutes**

After this, all 87 content items will have complete SEO data visible on your live website! 🎉

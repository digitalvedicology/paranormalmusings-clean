# Save All SEO Data to MongoDB Database

This guide will save all 87 items (83 posts + 4 categories) with complete SEO data to your MongoDB database.

---

## 📋 What Will Be Saved

```
✅ 83 Blog Posts with:
   - SEO Titles
   - Meta Descriptions
   - Keywords
   - OG Titles
   - OG Descriptions
   - OG Images
   - Canonical URLs

✅ 4 Categories with:
   - SEO Titles
   - Meta Descriptions
   - Keywords
   - OG Titles
   - OG Descriptions
   - OG Images
   - Canonical URLs

✅ All other site data
```

---

## ⚙️ Step-by-Step Process

### STEP 1: Get Your MongoDB Connection String (2 minutes)

**If you have MongoDB Atlas:**
1. Go to: https://www.mongodb.com/atlas
2. Click your cluster
3. Click "Connect" → "Drivers" → Copy connection string
4. Should look like: `mongodb+srv://user:password@cluster.mongodb.net/paranormalmusings`

**If you have it in your hosting:**
1. Check your hosting control panel
2. Look for Database or MongoDB section
3. Copy the connection string

**If unsure where it is:**
- See: `FIND-YOUR-MONGODB-URI.md` for detailed instructions

**Copy the entire connection string and keep it ready**

---

### STEP 2: Save Data to Database (3 minutes)

**On your local machine or server, run this command:**

```bash
# Navigate to admin directory
cd paranormalmusings-admin

# Run migration with your MongoDB URI
MONGODB_URI="PASTE_YOUR_CONNECTION_STRING_HERE" npm run migrate:mongo -- --force
```

**Replace:** `PASTE_YOUR_CONNECTION_STRING_HERE` with your actual MongoDB URI

**Example:**
```bash
MONGODB_URI="mongodb+srv://myuser:mypassword@paranormalmusings.mongodb.net/paranormalmusings" npm run migrate:mongo -- --force
```

**You should see output like:**
```
Connecting to MongoDB...
✓ Connected successfully
✓ Migrated 83 posts to database
✓ Migrated 4 categories to database
✓ Settings synced
✓ All data saved to MongoDB!
Migration complete!
```

---

### STEP 3: Verify Data Was Saved (2 minutes)

**Option A: Using MongoDB Shell**

```bash
# Connect to your database
mongosh "your-connection-string"

# Check posts were saved
db.posts.countDocuments()
# Should show: 83

# Check a post has SEO data
db.posts.findOne()
# Should show: { seo: { metaTitle: "...", ... } }

# Check categories were saved
db.categories.countDocuments()
# Should show: 4

# Check a category has SEO data
db.categories.findOne()
# Should show: { seo: { metaTitle: "...", ... } }
```

**Option B: Using Quick Command**

```bash
# This checks if posts have SEO data
mongosh "your-connection-string" --eval "db.posts.find().limit(1).forEach(p => console.log(JSON.stringify(p.seo, null, 2)))"

# Should print something like:
# {
#   "metaTitle": "How to Become a Paranormal Investigator? - paranormalmusings.com",
#   "metaDescription": "Before I answer how to be...",
#   "keyword": "how to become a paranormal investigator",
#   ...
# }
```

---

### STEP 4: Update Production Environment (1 minute)

Add MongoDB URI to your production `.env.production`:

**Edit:** `paranormalmusings-admin/.env.production`

Add these lines:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/paranormalmusings
MONGODB_DB=paranormalmusings
```

---

### STEP 5: Rebuild and Restart Services (2 minutes)

```bash
# Rebuild Admin with MongoDB support
cd paranormalmusings-admin
npm run build
pm2 restart pm-admin

# Wait a moment
sleep 5

# Rebuild Frontend
cd ../paranormalmusings-frontend
npm run build
pm2 restart pm-frontend

# Check services restarted
pm2 list
# Should show pm-admin and pm-frontend as "online"

# Check logs for errors
pm2 logs pm-admin --lines 20
pm2 logs pm-frontend --lines 20
```

---

### STEP 6: Test on Live Website (2 minutes)

Visit your website and check SEO is working:

```bash
# Test 1: Check API returns SEO data
curl "https://admin.paranormalmusings.com/api/content" | grep "metaTitle" | head -1

# Test 2: Check article has meta tags
curl -s "https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/" | grep -E '<title>|og:title' | head -2

# Test 3: Check category has meta tags
curl -s "https://frontend.paranormalmusings.com/eastern-views/" | grep '<title>'
```

**Or manually:**
1. Visit: https://frontend.paranormalmusings.com/
2. Go to any article
3. Right-click → View Page Source
4. Search for `<title>` → Should show your SEO title ✅

---

## ✅ Complete Checklist

- [ ] Found MongoDB connection string
- [ ] Ran migration with `--force` flag
- [ ] Saw "Migration complete!" message
- [ ] Verified 83 posts in database
- [ ] Verified 4 categories in database
- [ ] Checked posts have SEO data
- [ ] Added MONGODB_URI to .env.production
- [ ] Rebuilt admin with `npm run build`
- [ ] Rebuilt frontend with `npm run build`
- [ ] Restarted both services with `pm2 restart`
- [ ] Checked live website shows meta tags
- [ ] Tested social sharing

---

## 🐛 Troubleshooting

### Problem: "MONGODB_URI is not set"
**Solution:**
```bash
# Make sure to set the variable
export MONGODB_URI="mongodb+srv://..."
npm run migrate:mongo -- --force
```

### Problem: "Connection refused" or "connection timeout"
**Solution:**
1. Verify connection string is correct
2. If using MongoDB Atlas, check IP is whitelisted
3. Test connection: `mongosh "your-uri"`

### Problem: "Database not empty"
**Solution:**
The `--force` flag should override. Try:
```bash
npm run migrate:mongo -- --force
```

### Problem: Still no SEO tags on website
**Solution:**
1. Clear Next.js cache:
   ```bash
   rm -rf paranormalmusings-frontend/.next
   ```
2. Rebuild:
   ```bash
   npm run build
   ```
3. Restart:
   ```bash
   pm2 restart pm-frontend
   ```
4. Wait 10 seconds and refresh website

### Problem: "Authentication failed"
**Solution:**
Check username and password in connection string are correct. If you forgot:
1. Go to MongoDB Atlas
2. Click "Database Access"
3. Reset password
4. Get new connection string

---

## 🎯 Quick Command Summary

```bash
# 1. Migrate data
cd paranormalmusings-admin
MONGODB_URI="your-uri" npm run migrate:mongo -- --force

# 2. Verify data
mongosh "your-uri" --eval "db.posts.countDocuments()"
# Should show: 83

# 3. Rebuild services
npm run build
cd ../paranormalmusings-frontend
npm run build

# 4. Restart
pm2 restart pm-admin pm-frontend

# 5. Check live
curl "https://frontend.paranormalmusings.com/" | grep '<title>'
```

---

## 📊 After Migration Complete

All data is now in MongoDB:

```
content.json (SEO data source)
    ↓
npm run migrate:mongo (sync)
    ↓
MongoDB (all 87 items saved) ✅
    ↓
Admin API reads from MongoDB
    ↓
Frontend fetches from API
    ↓
Live website shows SEO tags ✅
```

---

## ⏱️ Total Time Required

- Step 1 (Get URI): 2 min
- Step 2 (Migrate): 3 min
- Step 3 (Verify): 2 min
- Step 4 (Update env): 1 min
- Step 5 (Rebuild): 2 min
- Step 6 (Test): 2 min

**TOTAL: ~12 minutes to save all data and verify**

---

## 🎉 Success Indicators

✅ All data saved when you see:
- Migration script completes without errors
- `db.posts.countDocuments()` returns 83
- `db.categories.countDocuments()` returns 4
- Each post/category has `seo` field
- Live website shows proper title and meta tags
- Social media shows rich previews with images

---

## 📞 Need Help?

See these guides for more details:

1. **Can't find MongoDB URI?**
   → `FIND-YOUR-MONGODB-URI.md`

2. **Migration failed?**
   → `SYNC-SEO-TO-MONGODB.md` (troubleshooting section)

3. **Quick reference?**
   → `QUICK-FIX-SEO-ON-LIVE.md`

---

**Status: Ready to save all data to database!**

Start with Step 1 above. ⬆️

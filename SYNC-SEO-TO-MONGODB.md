# Sync SEO Data to MongoDB Database

## Problem Identified

✅ SEO data IS in `paranormalmusings-admin/data/content.json` (from our import script)
❌ SEO data is NOT in MongoDB yet
❌ Your frontend is reading from MongoDB, so it doesn't see the SEO data

## Solution: Migrate to MongoDB

### Step 1: Find Your MongoDB URI

Your MongoDB connection string should be in one of these places:

**Option A: MongoDB Atlas (Cloud)**
- Visit: https://www.mongodb.com/atlas
- Go to: Cluster → Connect → Connection String
- It looks like: `mongodb+srv://username:password@cluster.mongodb.net/paranormalmusings`

**Option B: Local MongoDB**
- Connection string: `mongodb://localhost:27017/paranormalmusings`

**Option C: Check your production .env**
- Look for `MONGODB_URI` in your production environment
- Ask your hosting provider where the database is

### Step 2: Run Migration Script

**Local Development:**
```bash
cd paranormalmusings-admin

# Set your MongoDB URI and run migration
MONGODB_URI="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/paranormalmusings" \
npm run migrate:mongo

# You should see:
# ✓ Connected to MongoDB
# ✓ Migrated X posts
# ✓ Migrated X categories
# ✓ Settings synced
```

**If database already has data:**
```bash
# Add --force to overwrite existing data with SEO content from JSON
MONGODB_URI="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/paranormalmusings" \
npm run migrate:mongo -- --force
```

### Step 3: Verify SEO Data in MongoDB

```bash
# Install MongoDB client if needed
npm install -g mongosh

# Connect and check
mongosh "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/paranormalmusings"

# In mongosh shell, run these commands:
db.posts.findOne() // Should show seo field like: {"seo": {"metaTitle": "...", ...}}
db.categories.findOne() // Should show seo field
```

### Step 4: Update Production Environment

Add this to your production `.env.production`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/paranormalmusings
MONGODB_DB=paranormalmusings
```

### Step 5: Rebuild & Restart Services

```bash
cd paranormalmusings-admin

# Rebuild (will now use MongoDB)
npm run build
pm2 restart pm-admin

# Rebuild frontend (will fetch from MongoDB via API)
cd ../paranormalmusings-frontend
npm run build
pm2 restart pm-frontend

# Check logs
pm2 logs pm-admin
pm2 logs pm-frontend
```

### Step 6: Verify Frontend Sees SEO Data

Visit your site and check:

```bash
# Test 1: Check API returns SEO data
curl "https://admin.paranormalmusings.com/api/content" | grep -o '"metaTitle"' | head -5

# Should return multiple matches (one per post with SEO)

# Test 2: Check frontend page source has meta tags
curl -s "https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/" | \
  grep -E '<title>|og:title' | head -3

# Should show your SEO titles now!
```

---

## Understanding the Flow

**BEFORE (without MongoDB):**
```
content.json (has SEO)
    ↓
Admin reads/writes JSON
    ↓
Frontend fetches /api/content
    ↓
Returns JSON with SEO ✅
```

**AFTER (with MongoDB, if not synced):**
```
content.json (has SEO) ← ORPHANED, not used!
MongoDB (missing SEO) ← FRONTEND READS THIS
    ↓
Admin reads/writes MongoDB
    ↓
Frontend fetches /api/content
    ↓
Returns MongoDB without SEO ❌
```

**AFTER (with MongoDB, after sync):**
```
content.json (has SEO)
    ↓ (migrated with --force or clean migration)
MongoDB (NOW HAS SEO) ← FRONTEND READS THIS
    ↓
Admin reads/writes MongoDB
    ↓
Frontend fetches /api/content
    ↓
Returns MongoDB WITH SEO ✅
```

---

## Troubleshooting

### Issue: "MONGODB_URI is not set"
**Solution:** 
```bash
# Make sure to export the variable
export MONGODB_URI="mongodb+srv://..."
npm run migrate:mongo
```

### Issue: "Connection refused" or timeout
**Solution:**
1. Check connection string is correct
2. If using MongoDB Atlas, ensure your IP is whitelisted
3. Test connection: `mongosh "your-connection-string"`

### Issue: Migration says "Database not empty"
**Solution:** Use `--force` flag to overwrite with JSON content:
```bash
MONGODB_URI="..." npm run migrate:mongo -- --force
```

### Issue: SEO data still not showing after migration
**Solution:**
1. Clear frontend cache: `rm -rf paranormalmusings-frontend/.next`
2. Rebuild: `npm run build`
3. Restart: `pm2 restart pm-frontend`
4. Check logs: `pm2 logs pm-frontend`

### Issue: Admin changes not showing on frontend
**Solution:**
Make sure `ADMIN_API_URL` in frontend `.env.production` points to correct admin:
```env
ADMIN_API_URL=https://admin.paranormalmusings.com
```

---

## Verify Migration Worked

### Check 1: Posts have SEO fields
```javascript
// In mongosh shell:
db.posts.findOne({_id: "how-to-become-a-paranormal-investigator"})
// Should show:
// {
//   _id: "how-to-become-a-paranormal-investigator",
//   title: "How to Become a Paranormal Investigator?",
//   seo: {
//     metaTitle: "How to Become a Paranormal Investigator? - paranormalmusings.com",
//     metaDescription: "Before I answer how to be...",
//     ...
//   },
//   order: 42,
//   ...
// }
```

### Check 2: Categories have SEO fields
```javascript
db.categories.findOne({_id: "eastern"})
// Should show seo field
```

### Check 3: API returns SEO data
```bash
curl "https://admin.paranormalmusings.com/api/content" | \
  jq '.posts[0].seo' | head -20

# Should show something like:
# {
#   "metaTitle": "...",
#   "metaDescription": "...",
#   "keyword": "...",
#   ...
# }
```

### Check 4: Frontend renders meta tags
```bash
curl -s "https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/" | \
  grep -A1 '<title>'

# Should show:
# <title>How to Become a Paranormal Investigator? - paranormalmusings.com</title>
```

---

## After Migration Complete

### Update your admin environment files:

**paranormalmusings-admin/.env.production:**
```env
# Add this line
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/paranormalmusings
MONGODB_DB=paranormalmusings

# Keep existing settings
ADMIN_PASSWORD=your-password
SITE_URL=https://frontend.paranormalmusings.com
REVALIDATE_SECRET=your-secret
```

**paranormalmusings-frontend/.env.production:**
```env
# Make sure this points to your admin
ADMIN_API_URL=https://admin.paranormalmusings.com
```

---

## Next Steps

1. ✅ Find your MongoDB URI
2. ✅ Run migration script with `--force`
3. ✅ Update .env files with MONGODB_URI
4. ✅ Rebuild and restart services
5. ✅ Verify SEO data in database
6. ✅ Check frontend shows meta tags
7. ✅ Test social sharing

---

## Command Cheat Sheet

```bash
# Quick migration with new database
MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/paranormalmusings" \
npm run migrate:mongo

# Migration to existing database (overwrite)
MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/paranormalmusings" \
npm run migrate:mongo -- --force

# Check database has data
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/paranormalmusings"
# Then: db.posts.countDocuments()
# Then: db.posts.findOne()

# Rebuild and restart
npm run build
pm2 restart pm-admin pm-frontend

# Check frontend API
curl "https://frontend.paranormalmusings.com/api/content" | grep metaTitle
```

---

## Why This Happened

1. We updated `content.json` with SEO data using the import script ✅
2. But MongoDB is the PRIMARY data store (if configured)
3. The migration script didn't run, so MongoDB was never updated with SEO data
4. Frontend reads from MongoDB API, not from the JSON file
5. Result: SEO data exists in JSON but not in the database

**Solution:** Run the migration to sync JSON → MongoDB

---

## Support

If migration fails:
1. Check MongoDB URI is correct
2. Ensure network access is allowed (MongoDB Atlas)
3. Verify database connection: `mongosh "your-uri"`
4. Check MongoDB has space/permissions
5. Try with `--force` flag
6. Check logs: `npm run migrate:mongo` (shows detailed errors)

---

**Status:** After running this migration, your SEO data will be in MongoDB and visible on the frontend! ✅

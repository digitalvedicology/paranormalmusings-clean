# Sync Production Data to Local Development

Copy all live website data from your production MongoDB to your local environment.

---

## 📋 Prerequisites

Make sure you have:
- [ ] Production MongoDB connection string
- [ ] Local development environment set up
- [ ] `mongosh` installed (`npm install -g mongosh`)
- [ ] About 30 minutes

---

## 🎯 Goal

```
Production MongoDB (live data)
    ↓
Export/Backup
    ↓
Local Development
    ↓
See exact same data locally
```

---

## Method 1: Direct MongoDB to MongoDB Sync ⭐ (Recommended)

Best if you have local MongoDB running.

### Step 1: Connect to Production Database

```bash
# Connect to production and export all data
mongosh "your-production-mongodb-uri"

# In mongosh shell:
# List databases
show dbs

# Select database
use paranormalmusings

# Check collections
show collections

# Count documents to verify
db.posts.countDocuments()  # Should show 83
db.categories.countDocuments()  # Should show 4
```

### Step 2: Export Using mongodump

```bash
# Install mongodump if needed (part of MongoDB tools)
# On Windows: Download from https://www.mongodb.com/try/download/database-tools
# On Mac: brew install mongodb-database-tools

# Export production data
mongodump \
  --uri="your-production-mongodb-uri" \
  --out=./mongodb-backup

# Wait for completion
# You should see output like:
# dumped 83 posts from paranormalmusings.posts
# dumped 4 categories from paranormalmusings.categories
# etc.
```

### Step 3: Restore to Local MongoDB

**If you have local MongoDB running:**

```bash
# Stop local MongoDB service (if it's running)
# On Mac: brew services stop mongodb-community
# On Windows: net stop MongoDB

# Restore from backup
mongorestore \
  --uri="mongodb://localhost:27017" \
  ./mongodb-backup

# Start MongoDB again
# On Mac: brew services start mongodb-community
# On Windows: net start MongoDB
```

### Step 4: Verify Data Was Synced

```bash
# Connect to local MongoDB
mongosh "mongodb://localhost:27017/paranormalmusings"

# Check data
db.posts.countDocuments()  # Should show 83
db.categories.countDocuments()  # Should show 4
db.posts.findOne()  # Should show post with SEO data
```

---

## Method 2: Export to JSON Then Import

Good if you don't have local MongoDB set up yet.

### Step 1: Export from Production

```bash
# Export posts collection
mongoexport \
  --uri="your-production-mongodb-uri" \
  --collection=posts \
  --out=posts.json

# Export categories collection
mongoexport \
  --uri="your-production-mongodb-uri" \
  --collection=categories \
  --out=categories.json

# Export settings collection
mongoexport \
  --uri="your-production-mongodb-uri" \
  --collection=settings \
  --out=settings.json

# You should now have:
# - posts.json (83 posts)
# - categories.json (4 categories)
# - settings.json (1 settings document)
```

### Step 2: Combine Into content.json

```bash
# Create a script to combine JSON files
cat > combine-data.js << 'EOF'
const fs = require('fs');

// Read individual collections
const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('categories.json', 'utf8'));
const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

// Combine into single document
const contentDoc = {
  version: settings[0]?.version || 1,
  updatedAt: settings[0]?.updatedAt || new Date().toISOString(),
  site: settings[0]?.site || {},
  categories: categories.map(c => {
    const { _id, order, ...rest } = c;
    return rest;
  }),
  posts: posts.map(p => {
    const { _id, order, ...rest } = p;
    return rest;
  }),
  home: settings[0]?.home || {},
  navLinks: settings[0]?.navLinks || [],
  popularSearches: settings[0]?.popularSearches || [],
  topics: settings[0]?.topics || [],
  relatedSites: settings[0]?.relatedSites || [],
  footerPopular: settings[0]?.footerPopular || []
};

// Write to content.json
fs.writeFileSync(
  'paranormalmusings-admin/data/content.json',
  JSON.stringify(contentDoc, null, 2),
  'utf8'
);

console.log('✓ content.json created successfully!');
console.log(`✓ ${contentDoc.posts.length} posts`);
console.log(`✓ ${contentDoc.categories.length} categories`);
EOF

# Run the script
node combine-data.js

# Verify content.json was created
ls -lh paranormalmusings-admin/data/content.json
```

---

## Method 3: Quick Command (If You Already Have mongodump/mongoexport)

```bash
# 1. Export everything from production
mongodump \
  --uri="your-production-mongodb-uri" \
  --out=./prod-backup

# 2. Restore to local MongoDB
mongorestore \
  --uri="mongodb://localhost:27017" \
  ./prod-backup

# 3. Verify
mongosh "mongodb://localhost:27017/paranormalmusings" \
  --eval "db.posts.countDocuments(); db.categories.countDocuments();"
```

---

## Method 4: Using Admin API (Easiest)

If you can't access MongoDB directly:

```bash
# 1. Get data from production admin API
curl -s "https://admin.paranormalmusings.com/api/content?preview=1" \
  > production-content.json

# 2. Copy to local admin data directory
cp production-content.json paranormalmusings-admin/data/content.json

# 3. Verify
cat paranormalmusings-admin/data/content.json | head -50
```

---

## Verify Synced Data

### Check Local File

```bash
# If using JSON file
cd paranormalmusings-admin
cat data/content.json | jq '.posts | length'  # Should show 83
cat data/content.json | jq '.categories | length'  # Should show 4

# Check SEO data is present
cat data/content.json | jq '.posts[0].seo'  # Should show SEO fields
```

### Check Local MongoDB

```bash
# Connect to local MongoDB
mongosh mongodb://localhost:27017/paranormalmusings

# Commands to verify:
db.posts.countDocuments()
db.categories.countDocuments()
db.posts.findOne({}, { seo: 1 })
db.settings.findOne()
```

### Run Local Dev Server

```bash
# Frontend
cd paranormalmusings-frontend
npm run dev  # http://localhost:3000

# Admin (in another terminal)
cd paranormalmusings-admin
ADMIN_PASSWORD=test-local npm run dev  # http://localhost:3001
```

Visit both locally and verify:
- [ ] Homepage loads with real data
- [ ] Articles show correct content
- [ ] Categories display properly
- [ ] SEO titles visible in source
- [ ] Admin dashboard shows all posts

---

## Troubleshooting

### Problem: "mongodump command not found"

**Solution:**
```bash
# Install MongoDB Database Tools
# Windows: Download from https://www.mongodb.com/try/download/database-tools
# Mac: brew install mongodb-database-tools
# Linux: sudo apt-get install mongodb-tools
```

### Problem: "Connection refused"

**Solution:**
```bash
# Verify connection strings
# Production: mongodb+srv://user:pass@cluster.mongodb.net/paranormalmusings
# Local: mongodb://localhost:27017

# If local MongoDB not running:
# Mac: brew services start mongodb-community
# Windows: net start MongoDB
# Linux: sudo systemctl start mongod

# Verify MongoDB is running
mongosh mongodb://localhost:27017
# Should connect successfully
```

### Problem: "Authentication failed"

**Solution:**
```bash
# Check production credentials are correct
# Ensure special characters in password are URL-encoded
# Example: password "p@ss" → "p%40ss"

# Test connection
mongosh "your-mongodb-uri"
# Should connect without error
```

### Problem: "Restore failed - collection already exists"

**Solution:**
```bash
# Drop existing collections first
mongosh mongodb://localhost:27017/paranormalmusings << 'EOF'
db.posts.deleteMany({})
db.categories.deleteMany({})
db.settings.deleteMany({})
EOF

# Then restore
mongorestore \
  --uri="mongodb://localhost:27017" \
  ./mongodb-backup
```

---

## Verification Checklist

After syncing, verify everything:

- [ ] Posts count is 83
- [ ] Categories count is 4
- [ ] Each post has SEO data
- [ ] Each category has SEO data
- [ ] Settings document exists
- [ ] Home page loads correctly
- [ ] Admin dashboard shows all content
- [ ] No errors in console
- [ ] Can navigate to articles
- [ ] Images load (if using media)

---

## Update After Getting Latest Data

Whenever you need fresh data from production:

```bash
# Quick re-sync (recommended)
mongodump \
  --uri="your-production-uri" \
  --out=./prod-backup-$(date +%Y%m%d_%H%M%S)

mongorestore \
  --drop \  # Remove local copies first
  --uri="mongodb://localhost:27017" \
  ./prod-backup-*
```

---

## Keep Data in Sync

To always have fresh data locally:

```bash
# Create a sync script (sync-prod-to-local.sh)
#!/bin/bash

echo "🔄 Syncing production data..."
mongodump \
  --uri="$PROD_MONGODB_URI" \
  --out=./prod-backup-$(date +%Y%m%d_%H%M%S)

mongorestore \
  --drop \
  --uri="mongodb://localhost:27017" \
  ./prod-backup-*/

echo "✓ Production data synced to local!"
```

Make it executable:
```bash
chmod +x sync-prod-to-local.sh

# Run whenever you need fresh data
./sync-prod-to-local.sh
```

---

## Environment Variables

Add to your `.env.local`:

```env
# Local development
MONGODB_URI=mongodb://localhost:27017/paranormalmusings
MONGODB_DB=paranormalmusings

# Or if using file-based
# (Leave MONGODB_URI unset to use data/content.json)
```

---

## Quick Summary

**Fastest way (3 commands):**

```bash
# 1. Export from production
mongodump --uri="your-uri" --out=./backup

# 2. Import to local
mongorestore --drop --uri="mongodb://localhost:27017" ./backup

# 3. Verify
mongosh mongodb://localhost:27017/paranormalmusings --eval "db.posts.countDocuments()"
```

**Time needed:** 5-10 minutes

---

## Next Steps

After syncing:

1. ✅ Start local dev servers
2. ✅ Verify data loads correctly
3. ✅ Make test changes locally
4. ✅ Push to production when ready

You now have an exact copy of your live website running locally! 🎉

# Connect MongoDB Atlas to Local Development

Use your production MongoDB Atlas database with your local development environment.

---

## 🔗 Step 1: Get Your MongoDB Connection String

You're already at MongoDB Atlas. Follow these steps:

1. **In the URL you provided**, click on your cluster name or **"Connect" button**
2. Click **"Drivers"** tab
3. Select **"Node.js"** as the driver
4. You'll see a connection string like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/paranormalmusings?retryWrites=true&w=majority
   ```

**Or:**
1. Click on your cluster
2. Click **"Connect"** button
3. Choose **"Connect with a connection string"**
4. Copy the full connection string

**The string looks like:**
```
mongodb+srv://username:password@cluster0.abcde.mongodb.net/paranormalmusings?retryWrites=true&w=majority
```

---

## 📝 Step 2: Add to Your Local Environment

Edit `paranormalmusings-admin/.env.local`:

```env
# Existing settings
ADMIN_PASSWORD=paranormal-dev
ADMIN_API_KEY=dev-api-key
SITE_URL=http://localhost:3000
REVALIDATE_SECRET=dev-revalidate-secret

# ADD THESE LINES (your MongoDB connection)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.abcde.mongodb.net/paranormalmusings?retryWrites=true&w=majority
MONGODB_DB=paranormalmusings
```

**Replace:**
- `YOUR_USERNAME` - with your MongoDB Atlas username
- `YOUR_PASSWORD` - with your MongoDB Atlas password (URL-encode if special chars)
- `cluster0.abcde.mongodb.net` - with your actual cluster URL

---

## ⚠️ Important: Special Characters in Password

If your password has special characters (like `@`, `#`, `!`), URL-encode them:

| Character | Encoded |
|-----------|---------|
| @ | %40 |
| # | %23 |
| ! | %21 |
| : | %3A |
| / | %2F |

**Example:**
- Original password: `myp@ss#word`
- Encoded: `myp%40ss%23word`
- Connection string: `mongodb+srv://user:myp%40ss%23word@cluster.mongodb.net/paranormalmusings`

---

## ✅ Step 3: Verify Connection Works

### Test 1: Using mongosh

```bash
# Install if needed
npm install -g mongosh

# Test connection
mongosh "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.abcde.mongodb.net/paranormalmusings"

# In mongosh shell:
show dbs
use paranormalmusings
db.posts.countDocuments()  # Should show 83
exit
```

### Test 2: Start Admin Locally

```bash
cd paranormalmusings-admin
npm run dev

# Should connect to MongoDB without errors
# Check terminal - should see successful connection
```

### Test 3: Check Data in Admin

Open http://localhost:3001 in browser:
- Admin should load
- Posts should be visible
- All data from production should appear

---

## 🚀 Step 4: Update Frontend to Use Local Admin

Edit `paranormalmusings-frontend/.env.local`:

```env
# Use local admin (which connects to production MongoDB)
ADMIN_API_URL=http://localhost:3001
```

---

## 💾 Step 5: Start Both Services

**Terminal 1 - Admin:**
```bash
cd paranormalmusings-admin
npm run dev
# http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd paranormalmusings-frontend
npm run dev
# http://localhost:3000
```

---

## ✨ What This Gives You

✅ Local development environment  
✅ Connected to production MongoDB Atlas  
✅ See all real data locally  
✅ Make test changes without affecting production  
✅ Test new features with real data  
✅ Full SEO data visible  

---

## 🔒 Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git (already in .gitignore)
- Don't share your MongoDB password
- Connection string stays in .env.local only
- Only for local development

---

## 📊 What You See Locally

When connected, you'll see:
- All 83 blog posts
- All 4 categories
- All SEO metadata
- Contact form submissions (if any)
- Full admin functionality

**But changes you make locally don't affect production** (unless you specifically save/edit in admin)

---

## 🧪 Verify Everything Works

### Check 1: Admin loads
```
http://localhost:3001
# Should show posts, categories, settings
```

### Check 2: Frontend loads
```
http://localhost:3000
# Should show all content from production
```

### Check 3: Data is correct
Open DevTools (F12) on http://localhost:3000:
- Go to Network tab
- Refresh page
- Look for `/api/content` request
- Should return 83 posts with SEO data

### Check 4: SEO data visible
On any article page:
- Right-click → View Source
- Search for `<title>`
- Should show your SEO title ✅

---

## 🔄 Switching Between Local and Production MongoDB

### Use Local MongoDB (development)
```env
MONGODB_URI=mongodb://localhost:27017/paranormalmusings
```

### Use Production MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://user:pass@cluster0.abcde.mongodb.net/paranormalmusings
```

Just edit `.env.local` and restart the admin!

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
- Check username and password are correct
- Verify URL encoding if special characters in password
- IP address must be whitelisted in MongoDB Atlas

### Error: "Connection refused"
- Verify connection string is correct
- Check internet connection
- MongoDB Atlas cluster must be running

### Error: "No database selected"
- Make sure database name is in the connection string
- Should end with `/paranormalmusings`

### Admin won't start
- Check `.env.local` syntax
- Make sure MONGODB_URI is set correctly
- Try restarting: `npm run dev`

---

## 🎯 Recommended Setup

For best local development:

**Option A: Use Production MongoDB (Easy) ← RECOMMENDED**
- Edit `.env.local` with production URI
- See real data locally
- Perfect for testing features

**Option B: Use Local MongoDB (More Control)**
- Sync production data to local first
- Use `mongodb://localhost:27017`
- Independent of production
- Faster for some operations

**Start with Option A (your choice)** - it's simpler and you get real data immediately!

---

## 📋 Final Checklist

- [ ] Copied MongoDB connection string from Atlas
- [ ] Added MONGODB_URI to `paranormalmusings-admin/.env.local`
- [ ] Added ADMIN_API_URL to `paranormalmusings-frontend/.env.local`
- [ ] Tested connection with mongosh
- [ ] Started admin on http://localhost:3001
- [ ] Started frontend on http://localhost:3000
- [ ] Verified data loads correctly
- [ ] Checked SEO data in page source

Done! Your local environment is now connected to production MongoDB! 🎉

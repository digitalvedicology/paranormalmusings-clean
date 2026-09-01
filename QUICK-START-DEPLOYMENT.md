# Quick Start - Deploy SEO to Production

## 🚀 Fast Path to Production (15-30 minutes)

### Step 1: Prepare Environment Files (5 min)

**Frontend:**
```bash
# Copy template
cp paranormalmusings-frontend/.env.production.example paranormalmusings-frontend/.env.production

# Edit with your values
nano paranormalmusings-frontend/.env.production
```

Fill in these critical values:
- `ADMIN_API_URL=https://admin.paranormalmusings.com`
- `REVALIDATE_SECRET=your-strong-secret-here`
- `CLOUDFLARE_TURNSTILE_KEY` (your keys)
- `RESEND_API_KEY` (your API key)
- `NEXT_PUBLIC_GA_ID` (your GA4 ID)

**Admin:**
```bash
# Copy template
cp paranormalmusings-admin/.env.production.example paranormalmusings-admin/.env.production

# Edit with your values
nano paranormalmusings-admin/.env.production
```

Fill in these critical values:
- `ADMIN_PASSWORD=your-secure-password`
- `ADMIN_API_KEY=your-secure-key`
- `SITE_URL=https://frontend.paranormalmusings.com`
- `REVALIDATE_SECRET=your-strong-secret-here` (MUST match frontend)
- `UPLOAD_DIR=/home/paranormalmusings/public_html/media`

### Step 2: Generate OG Images (2 min)

```bash
# Generate placeholder images
bash paranormalmusings-frontend/scripts/generate-og-images.sh

# This creates all 121 images in paranormalmusings-frontend/public/images/
# Replace with real images later if desired
```

### Step 3: Build Locally (3 min)

```bash
# Frontend
cd paranormalmusings-frontend
npm install
npm run build

# Check for errors - if build fails, fix before deployment
echo "Frontend build status: $?"

# Admin
cd ../paranormalmusings-admin
npm install
npm run build

# Check for errors
echo "Admin build status: $?"
```

### Step 4: Deploy to Server (5 min)

**Option A: Using Git (Recommended)**
```bash
# Push to your repository
git add -A
git commit -m "Deploy SEO implementation and OG images"
git push origin main

# SSH to your server and pull
ssh user@paranormalmusings.com

cd /home/paranormalmusings/public_html

# Clone or pull latest
# If new: git clone <your-repo-url> paranormalmusings
# If exists:
cd paranormalmusings
git pull origin main
```

**Option B: Direct Upload**
```bash
# Upload entire project via SCP/SFTP
scp -r paranormalmusings-frontend user@paranormalmusings.com:/home/paranormalmusings/public_html/
scp -r paranormalmusings-admin user@paranormalmusings.com:/home/paranormalmusings/public_html/

# Also upload .env.production files (keep secure!)
scp paranormalmusings-frontend/.env.production user@paranormalmusings.com:/home/paranormalmusings/public_html/paranormalmusings-frontend/
scp paranormalmusings-admin/.env.production user@paranormalmusings.com:/home/paranormalmusings/public_html/paranormalmusings-admin/
```

### Step 5: Install & Start Services (5 min)

**SSH into your server:**
```bash
ssh user@paranormalmusings.com
```

**Frontend Setup:**
```bash
cd /home/paranormalmusings/public_html/paranormalmusings-frontend
npm install
npm run build
pm2 start "npm start" --name "pm-frontend"
pm2 save
pm2 logs pm-frontend  # Check for errors
```

**Admin Setup:**
```bash
cd /home/paranormalmusings/public_html/paranormalmusings-admin
npm install
npm run build
pm2 start "npm start" --name "pm-admin"
pm2 save
pm2 logs pm-admin  # Check for errors
```

### Step 6: Upload Images (2 min)

**Local machine:**
```bash
# Upload generated images to server
scp -r paranormalmusings-frontend/public/images/* \
  user@paranormalmusings.com:/home/paranormalmusings/public_html/images/
```

### Step 7: Verify Everything Works (3 min)

```bash
# From your local machine
# Check frontend
curl -I https://frontend.paranormalmusings.com/

# Check meta tags
curl -s https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/ | \
  grep -E '<title>|<meta name="description"|og:' | head -5

# Check admin
curl -I https://admin.paranormalmusings.com/
```

**In your browser:**
1. Visit https://frontend.paranormalmusings.com/
2. Go to any article page
3. Right-click → "View Page Source"
4. Search for `<title>` - should show your SEO title ✅
5. Search for `og:title` - should show OG title ✅
6. Search for `og:image` - should show image URL ✅

---

## 📋 Pre-Deployment Checklist

Before you start:
- [ ] Both `.env.production` files created and filled
- [ ] OG images generated or ready to upload
- [ ] Frontend and admin build successfully
- [ ] All values in .env files are secure/correct
- [ ] Images directory exists on server: `/home/paranormalmusings/public_html/images/`
- [ ] Media directory exists on server: `/home/paranormalmusings/public_html/media/`

---

## 🔍 Verification Tests

### Test 1: Frontend Loads
```bash
curl -I https://frontend.paranormalmusings.com/
# Should return 200 OK
```

### Test 2: Meta Tags Present
```bash
curl -s https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/ | \
  grep -c "og:title"
# Should return > 0
```

### Test 3: Admin API Works
```bash
curl https://admin.paranormalmusings.com/api/content | head -100
# Should return JSON with posts and categories including seo field
```

### Test 4: Revalidation Works
```bash
curl -X POST "https://frontend.paranormalmusings.com/api/revalidate?secret=your-revalidate-secret"
# Should return {"revalidated":true} or similar
```

---

## ⚡ Common Issues & Quick Fixes

### Issue: Services not starting
```bash
pm2 logs pm-frontend
pm2 logs pm-admin
# Check error messages and fix issues

# Restart services
pm2 restart pm-frontend
pm2 restart pm-admin
```

### Issue: SEO tags not showing
```bash
# Rebuild with production env
cd paranormalmusings-frontend
rm -rf .next
npm run build
pm2 restart pm-frontend
```

### Issue: OG images not loading
```bash
# Check images exist
ls -la /home/paranormalmusings/public_html/images/ | wc -l
# Should show all 121 images

# Check permissions
chmod 755 /home/paranormalmusings/public_html/images/
chmod 644 /home/paranormalmusings/public_html/images/*
```

### Issue: Admin API not accessible
```bash
# Check processes
pm2 list

# Check logs
pm2 logs pm-admin

# Verify ADMIN_API_URL in frontend .env.production
cat paranormalmusings-frontend/.env.production | grep ADMIN_API_URL
```

---

## 📈 Post-Deployment Steps

### 1. Verify in Google Search Console
- [ ] Submit sitemap
- [ ] Request indexing of key pages
- [ ] Check for mobile usability issues

### 2. Test Social Sharing
- [ ] Facebook: https://developers.facebook.com/tools/debug/og/object
- [ ] Twitter: https://cards-dev.twitter.com/validator
- [ ] Paste article URLs and verify metadata

### 3. Check Analytics
- [ ] Google Analytics 4 receiving data
- [ ] Set up custom events if needed
- [ ] Create dashboards for tracking

### 4. Monitor Logs
```bash
# Check for errors in the next 24 hours
pm2 logs pm-frontend --lines 100
pm2 logs pm-admin --lines 100

# Set up log rotation
pm2 install pm2-logrotate
pm2 save
```

### 5. Backup
```bash
# Create first backup
tar -czf ~/backup-deployment-$(date +%Y%m%d).tar.gz \
  /home/paranormalmusings/public_html/paranormalmusings-frontend \
  /home/paranormalmusings/public_html/paranormalmusings-admin \
  /home/paranormalmusings/public_html/images

# Set up daily backups (see PRODUCTION-DEPLOYMENT-GUIDE.md)
```

---

## 📞 Need Help?

### Quick Reference
- **SEO Details**: See `SEO-SETUP-SUMMARY.md`
- **Complete Guide**: See `PRODUCTION-DEPLOYMENT-GUIDE.md`
- **Troubleshooting**: See `DEPLOYMENT-CHECKLIST.md`
- **SEO Management**: See `SEO-MANAGEMENT-GUIDE.md`

### Key Contacts
- Hosting Support: Hostinger support panel
- Domain Provider: Where you registered domain
- Email Issues: Resend support (email service)
- Images Issues: Check file permissions and paths

---

## ✅ Success Indicators

Your deployment is successful when:

1. **Frontend accessible**
   ```
   ✅ https://frontend.paranormalmusings.com/ loads
   ```

2. **Admin accessible**
   ```
   ✅ https://admin.paranormalmusings.com/ loads
   ```

3. **SEO tags present**
   ```
   ✅ View page source shows <title>, og:title, og:image
   ```

4. **Content loads**
   ```
   ✅ Articles display with correct metadata
   ✅ Categories display with correct metadata
   ```

5. **Images serve**
   ```
   ✅ OG images accessible at /images/og-*.jpg
   ```

6. **Services stable**
   ```
   ✅ pm2 status shows both services running
   ✅ No errors in logs after 10 minutes
   ```

---

## 🎉 Deployment Complete!

Once all checks pass, you're done! Your website now has:
- ✅ Complete SEO metadata
- ✅ OpenGraph support for social sharing
- ✅ Proper canonical URLs
- ✅ 121 articles with SEO data
- ✅ 4 categories with SEO data
- ✅ Production-ready configuration

**Estimated Total Time: 15-30 minutes**

---

Last Updated: 2026-09-01
Status: ✅ Production Ready

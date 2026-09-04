# Production Deployment Guide - SEO Implementation

## Overview
This guide covers deploying the SEO implementation to your live website and ensuring proper configuration for both local development and production.

---

## 1. Production Environment Setup

### Frontend Production (.env.production)

Create `.env.production` in `paranormalmusings-frontend/`:

```env
# Production Admin API
ADMIN_API_URL=https://admin.paranormalmusings.com

# Cache settings
CONTENT_REVALIDATE=3600

# Revalidate secret (must match admin)
REVALIDATE_SECRET=your-production-revalidate-secret

# Media directory on Hostinger
MEDIA_DIR=/home/paranormalmusings/public_html/media

# Cloudflare Turnstile (spam protection)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY=your_cloudflare_public_key
CLOUDFLARE_TURNSTILE_SECRET_KEY=your_cloudflare_secret_key

# Email settings
CONTACT_EMAIL_TO=paranormalmusings@proton.me

# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-your-measurement-id

# Resend API for emails
RESEND_API_KEY=re_your_resend_api_key
```

### Admin Production (.env.production)

Create `.env.production` in `paranormalmusings-admin/`:

```env
# Admin configuration
ADMIN_PASSWORD=your-secure-password
ADMIN_API_KEY=your-secure-api-key

# Frontend URL for revalidation
SITE_URL=https://frontend.paranormalmusings.com

# Revalidate secret (must match frontend)
REVALIDATE_SECRET=your-production-revalidate-secret

# Data directory on Hostinger
UPLOAD_DIR=/home/paranormalmusings/public_html/media
```

---

## 2. Local Development Setup

### Frontend Local Development

Your current `.env.local` in `paranormalmusings-frontend/`:

```env
# Use local admin API
ADMIN_API_URL=http://localhost:3001

# Cache settings
CONTENT_REVALIDATE=60

# Revalidate secret (must match admin)
REVALIDATE_SECRET=dev-revalidate-secret

# Local uploads (comment out MEDIA_DIR)
# MEDIA_DIR=/home/paranormalmusings/public_html/media

# Cloudflare Turnstile (use dev keys)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY=dev_public_key
CLOUDFLARE_TURNSTILE_SECRET_KEY=dev_secret_key

# Email settings
CONTACT_EMAIL_TO=paranormalmusings@proton.me

# Google Analytics 4 (can be empty for local)
NEXT_PUBLIC_GA_ID=

# Resend API (can be empty for local)
RESEND_API_KEY=
```

### Admin Local Development

Your current `.env.local` in `paranormalmusings-admin/`:

```env
# Admin configuration (development)
ADMIN_PASSWORD=paranormal-dev
ADMIN_API_KEY=dev-api-key

# Frontend URL for revalidation
SITE_URL=http://localhost:3000

# Revalidate secret (must match frontend)
REVALIDATE_SECRET=dev-revalidate-secret

# Local uploads directory
UPLOAD_DIR=./public/media
```

---

## 3. OG Images Setup

### Image Locations

Images should be placed in:

**Production (Hostinger):**
```
/home/paranormalmusings/public_html/images/og-*.jpg
```

**Local Development:**
```
paranormalmusings-frontend/public/images/og-*.jpg
```

### Create OG Images Directory

```bash
# On your local machine
mkdir -p paranormalmusings-frontend/public/images

# On Hostinger server (via SSH)
mkdir -p /home/paranormalmusings/public_html/images
```

### OG Images List

The CSV includes these images. Create or upload them:

```
/images/og-home.jpg (1200x630)
/images/og-about.jpg
/images/og-contact.jpg
/images/og-legal.jpg
/images/og-privacy.jpg
/images/og-privacy-main.jpg
/images/og-terms.jpg
/images/og-case-studies.jpg
/images/og-eastern-views.jpg
/images/og-investigation.jpg
/images/og-western-views.jpg
[... 110 more post images ...]
```

### Quick Image Setup Option

If you don't have individual images yet, use a placeholder:

```bash
# Create a single image for testing
convert -size 1200x630 xc:navy \
  -pointsize 40 -fill white \
  -gravity center -annotate +0+0 'Paranormal Musings' \
  paranormalmusings-frontend/public/images/og-placeholder.jpg
```

Then update all `ogImage` entries in `paranormalmusings-seo-data.csv` to use the same placeholder.

---

## 4. Deployment Steps

### Step 1: Local Testing

```bash
# Test build locally
cd paranormalmusings-frontend
npm run build
npm run start

# Visit http://localhost:3000
# View source to verify meta tags
```

### Step 2: Push Code to Production

```bash
# Commit any local changes
git add .
git commit -m "Deploy SEO implementation to production"

# Push to repository
git push origin main
```

### Step 3: Deploy Frontend

**Option A: Hostinger Control Panel**
1. Go to Hostinger > File Manager
2. Navigate to public_html
3. Upload paranormalmusings-frontend files
4. Run build commands via SSH:
   ```bash
   cd public_html/paranormalmusings-frontend
   npm install
   npm run build
   npm run start
   ```

**Option B: SSH Deployment (Recommended)**
```bash
# SSH into Hostinger
ssh user@paranormalmusings.com

# Navigate to web root
cd public_html

# Clone/pull latest code
git clone https://github.com/yourusername/paranormalmusings.git
# or if exists: git pull origin main

# Install and build
cd paranormalmusings/paranormalmusings-frontend
npm install
npm run build

# Start with PM2 (if using process manager)
pm2 start npm --name "pm-frontend" -- start
```

### Step 4: Deploy Admin

```bash
# SSH into Hostinger
ssh user@paranormalmusings.com

cd public_html/paranormalmusings/paranormalmusings-admin

npm install
npm run build

# Start admin
pm2 start npm --name "pm-admin" -- start
```

### Step 5: Upload OG Images

```bash
# Via SFTP or SCP
scp -r paranormalmusings-frontend/public/images/* \
  user@paranormalmusings.com:/home/paranormalmusings/public_html/images/

# Or via SSH
ssh user@paranormalmusings.com
cd /home/paranormalmusings/public_html/images
# Upload files via file manager
```

### Step 6: Verify Deployment

1. **Check Frontend:**
   ```bash
   curl -I https://frontend.paranormalmusings.com/
   ```

2. **Check Meta Tags:**
   - Visit https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/
   - View page source (Ctrl+U)
   - Search for `<title>`, `<meta name="description">`, `<meta property="og:`

3. **Check Admin:**
   ```bash
   curl -I https://admin.paranormalmusings.com/
   ```

4. **Test Social Sharing:**
   - Visit Facebook OG Debugger: https://developers.facebook.com/tools/debug/og/object
   - Enter your post URLs
   - Verify title, description, and image

---

## 5. File Structure on Hostinger

After deployment, your Hostinger should have this structure:

```
/home/paranormalmusings/
├── public_html/
│   ├── paranormalmusings-frontend/
│   │   ├── .next/
│   │   ├── public/
│   │   │   ├── images/
│   │   │   │   └── og-*.jpg (all 121 images)
│   │   │   ├── manifest.json
│   │   │   └── icon.svg
│   │   ├── .env.production (with production URLs)
│   │   ├── next.config.mjs
│   │   └── package.json
│   │
│   ├── paranormalmusings-admin/
│   │   ├── .next/
│   │   ├── data/
│   │   │   └── content.json (with SEO data)
│   │   ├── .env.production
│   │   ├── next.config.mjs
│   │   └── package.json
│   │
│   └── media/ (for user uploads)
│       └── (files uploaded via admin)
```

---

## 6. Running Both Services

### Using PM2 Process Manager

```bash
# SSH into Hostinger
ssh user@paranormalmusings.com

# Install PM2
npm install -g pm2

# Start frontend
cd /home/paranormalmusings/public_html/paranormalmusings-frontend
pm2 start "npm start" --name "pm-frontend"

# Start admin
cd /home/paranormalmusings/public_html/paranormalmusings-admin
pm2 start "npm start" --name "pm-admin"

# Save PM2 config
pm2 save
pm2 startup

# Monitor
pm2 list
pm2 logs
```

### Using Systemd Service Files

Create `/etc/systemd/system/paranormalmusings-frontend.service`:

```ini
[Unit]
Description=Paranormal Musings Frontend
After=network.target

[Service]
Type=simple
User=paranormalmusings
WorkingDirectory=/home/paranormalmusings/public_html/paranormalmusings-frontend
EnvironmentFile=/home/paranormalmusings/public_html/paranormalmusings-frontend/.env.production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable paranormalmusings-frontend
sudo systemctl start paranormalmusings-frontend
sudo systemctl status paranormalmusings-frontend
```

---

## 7. Nginx Reverse Proxy Setup

If using Nginx on Hostinger, configure:

```nginx
# Frontend proxy
upstream pm_frontend {
    server localhost:3000;
}

server {
    server_name frontend.paranormalmusings.com;
    
    location / {
        proxy_pass http://pm_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Serve images directly
    location /images/ {
        alias /home/paranormalmusings/public_html/images/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# Admin proxy
upstream pm_admin {
    server localhost:3001;
}

server {
    server_name admin.paranormalmusings.com;
    
    location / {
        proxy_pass http://pm_admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 8. SSL/HTTPS Setup

Ensure SSL certificates are installed:

```bash
# SSH into Hostinger
ssh user@paranormalmusings.com

# Check certificate
ls -la /etc/ssl/certs/

# If using Let's Encrypt with Certbot
sudo certbot renew --dry-run
```

---

## 9. Environment Variables Comparison

| Variable | Local | Production |
|----------|-------|------------|
| ADMIN_API_URL | http://localhost:3001 | https://admin.paranormalmusings.com |
| SITE_URL | http://localhost:3000 | https://frontend.paranormalmusings.com |
| CONTENT_REVALIDATE | 60 | 3600 |
| MEDIA_DIR | (not set) | /home/paranormalmusings/public_html/media |
| Environment | development | production |

---

## 10. Troubleshooting

### Issue: Meta tags not showing

**Solution:**
1. Check that `generateMetadata()` is being called
2. Verify .env.production has correct ADMIN_API_URL
3. Rebuild: `npm run build && npm start`

### Issue: OG images not showing

**Solution:**
1. Verify images exist in `/images/` directory
2. Check path in content.json: should be `/images/og-{slug}.jpg`
3. Test image URL directly in browser

### Issue: Admin API not accessible

**Solution:**
1. Check ADMIN_API_URL in .env.production
2. Verify admin service is running: `pm2 logs pm-admin`
3. Check firewall/proxy settings

### Issue: Content not updating

**Solution:**
1. Check REVALIDATE_SECRET matches in frontend and admin
2. Verify revalidate endpoint: `curl -X POST https://frontend.paranormalmusings.com/api/revalidate?secret=YOUR_SECRET`
3. Check admin logs for errors

---

## 11. Monitoring & Maintenance

### Check Service Health

```bash
# SSH into server
ssh user@paranormalmusings.com

# Monitor processes
pm2 list
pm2 logs pm-frontend
pm2 logs pm-admin

# Check disk space
df -h /home/paranormalmusings/

# Check memory usage
free -h
```

### Update Code

```bash
# Pull latest changes
cd /home/paranormalmusings/public_html/paranormalmusings-frontend
git pull origin main
npm install
npm run build
pm2 restart pm-frontend

# Same for admin
cd ../paranormalmusings-admin
git pull origin main
npm install
npm run build
pm2 restart pm-admin
```

---

## 12. Backup Strategy

```bash
# Backup content.json daily
0 2 * * * cp /home/paranormalmusings/public_html/paranormalmusings-admin/data/content.json /home/paranormalmusings/backups/content.json.$(date +\%Y\%m\%d)

# Backup media uploads
0 3 * * * tar -czf /home/paranormalmusings/backups/media.$(date +\%Y\%m\%d).tar.gz /home/paranormalmusings/public_html/media/
```

---

## Summary Checklist

- [ ] Create .env.production files (both frontend and admin)
- [ ] Update ADMIN_API_URL, SITE_URL, and other variables
- [ ] Create /images directory on server
- [ ] Upload all 121 OG images
- [ ] Deploy frontend code
- [ ] Deploy admin code
- [ ] Start both services (PM2 or systemd)
- [ ] Configure Nginx reverse proxy
- [ ] Verify SSL/HTTPS
- [ ] Test meta tags on various pages
- [ ] Test social sharing (Facebook, Twitter)
- [ ] Monitor logs for errors
- [ ] Set up backups

---

**Status: Ready for Production Deployment** ✅

All SEO data is in place and ready to serve on your live website.

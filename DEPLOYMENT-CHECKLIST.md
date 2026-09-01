# Deployment Checklist - SEO Implementation

## Pre-Deployment (Local)

### Code Review
- [ ] All SEO changes committed to git
- [ ] No uncommitted changes in working directory
- [ ] Latest changes pulled from remote

```bash
git status
git log --oneline -5
```

### Local Testing
- [ ] Frontend builds without errors
- [ ] Admin builds without errors
- [ ] Meta tags visible in browser devtools
- [ ] OG tags present in page source

```bash
# Frontend
cd paranormalmusings-frontend
npm run build
npm run start
# Visit http://localhost:3000 and verify tags

# Admin
cd paranormalmusings-admin
npm run build
npm run start
# Verify admin interface works
```

### Environment Variables
- [ ] .env.production files created (not in git)
- [ ] All variables filled in (not defaults)
- [ ] Secrets are strong and random
- [ ] REVALIDATE_SECRET matches in both .env files
- [ ] ADMIN_API_URL points to production admin
- [ ] SITE_URL points to production frontend

## Production Setup (Hostinger/Server)

### Directory Structure
- [ ] Create `/home/paranormalmusings/public_html/paranormalmusings-frontend/`
- [ ] Create `/home/paranormalmusings/public_html/paranormalmusings-admin/`
- [ ] Create `/home/paranormalmusings/public_html/images/` (for OG images)
- [ ] Create `/home/paranormalmusings/public_html/media/` (for uploads)
- [ ] Create `/home/paranormalmusings/backups/` (for backups)

```bash
mkdir -p /home/paranormalmusings/public_html/{paranormalmusings-frontend,paranormalmusings-admin,images,media}
mkdir -p /home/paranormalmusings/backups
```

### Node.js & Dependencies
- [ ] Node.js installed on server (v18+ recommended)
- [ ] npm or yarn available
- [ ] PM2 installed globally (`npm install -g pm2`)

```bash
node --version
npm --version
pm2 --version
```

### Frontend Deployment
- [ ] Code deployed to `/home/paranormalmusings/public_html/paranormalmusings-frontend/`
- [ ] `.env.production` file created and filled
- [ ] `npm install` run successfully
- [ ] `npm run build` completed without errors
- [ ] Application started with PM2 or systemd

```bash
cd /home/paranormalmusings/public_html/paranormalmusings-frontend
npm install
npm run build
pm2 start "npm start" --name "pm-frontend"
pm2 save
```

### Admin Deployment
- [ ] Code deployed to `/home/paranormalmusings/public_html/paranormalmusings-admin/`
- [ ] `.env.production` file created and filled
- [ ] `npm install` run successfully
- [ ] `npm run build` completed without errors
- [ ] Application started with PM2 or systemd

```bash
cd /home/paranormalmusings/public_html/paranormalmusings-admin
npm install
npm run build
pm2 start "npm start" --name "pm-admin"
pm2 save
```

### OG Images
- [ ] All 121 OG image files uploaded to `/home/paranormalmusings/public_html/images/`
- [ ] Image paths match those in content.json (e.g., `/images/og-{slug}.jpg`)
- [ ] Images are 1200x630 pixels (minimum)
- [ ] Images accessible via HTTPS

```bash
# Generate placeholder images locally, then upload
bash paranormalmusings-frontend/scripts/generate-og-images.sh
# Then SCP to server:
scp -r paranormalmusings-frontend/public/images/* \
  user@paranormalmusings.com:/home/paranormalmusings/public_html/images/
```

### Web Server Configuration
- [ ] Nginx reverse proxy configured for frontend (port 3000 → 80/443)
- [ ] Nginx reverse proxy configured for admin (port 3001 → 80/443)
- [ ] SSL/TLS certificates installed and valid
- [ ] Static files cache headers configured
- [ ] Gzip compression enabled

```nginx
# Check Nginx syntax
nginx -t

# Reload Nginx
systemctl reload nginx
```

### Firewall & Security
- [ ] Ports 80/443 open for public traffic
- [ ] Port 3000 only accessible from localhost (Nginx reverse proxy)
- [ ] Port 3001 only accessible from localhost (Nginx reverse proxy)
- [ ] UFW or firewall rules configured

```bash
# Example UFW rules
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
```

## Post-Deployment Verification

### Service Health
- [ ] Frontend service running: `pm2 list | grep pm-frontend`
- [ ] Admin service running: `pm2 list | grep pm-admin`
- [ ] No errors in logs: `pm2 logs pm-frontend` and `pm2 logs pm-admin`

```bash
pm2 list
pm2 logs pm-frontend --lines 20
pm2 logs pm-admin --lines 20
```

### Frontend Access
- [ ] https://frontend.paranormalmusings.com/ returns 200
- [ ] Homepage loads without errors
- [ ] Navigation works
- [ ] Images load

```bash
curl -I https://frontend.paranormalmusings.com/
```

### Admin Access
- [ ] https://admin.paranormalmusings.com/ returns 200
- [ ] Admin login page loads
- [ ] Can login with ADMIN_PASSWORD
- [ ] Content editor works

```bash
curl -I https://admin.paranormalmusings.com/
```

### SEO Meta Tags - Sample Pages
- [ ] https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/
  - [ ] Has SEO title in `<title>`
  - [ ] Has meta description
  - [ ] Has canonical link
  - [ ] Has OG title, description, image

- [ ] https://frontend.paranormalmusings.com/eastern-views/
  - [ ] Category page has SEO meta tags
  - [ ] OG image for category exists

- [ ] https://frontend.paranormalmusings.com/ (homepage)
  - [ ] Has title and meta tags
  - [ ] No errors in console

**Verification Script:**
```bash
#!/bin/bash
echo "Checking meta tags..."
curl -s https://frontend.paranormalmusings.com/investigation/how-to-become-a-paranormal-investigator/ | \
  grep -E '<title>|<meta name="description"|<meta property="og:' | head -10
```

### Social Sharing
- [ ] Test Facebook sharing: https://developers.facebook.com/tools/debug/og/object
  - [ ] Title shows correctly
  - [ ] Description shows correctly
  - [ ] Image shows correctly
  
- [ ] Test Twitter card: https://cards-dev.twitter.com/validator
  - [ ] Title shows correctly
  - [ ] Description shows correctly

### API Endpoints
- [ ] Content API accessible: `curl https://admin.paranormalmusings.com/api/content`
  - [ ] Returns valid JSON
  - [ ] Includes SEO data in posts
  - [ ] Includes SEO data in categories

- [ ] Revalidate endpoint works: 
  ```bash
  curl -X POST "https://frontend.paranormalmusings.com/api/revalidate?secret=YOUR_SECRET"
  ```

### Performance
- [ ] Frontend load time < 3 seconds
- [ ] Admin load time < 2 seconds
- [ ] Images load without delay
- [ ] No console errors

```bash
# Check frontend performance
curl -w "@curl-format.txt" -o /dev/null -s https://frontend.paranormalmusings.com/
```

### Browser DevTools Check
- [ ] Open https://frontend.paranormalmusings.com/
- [ ] Press F12 → Elements → <head>
- [ ] Verify:
  - [ ] `<title>` tag present and correct
  - [ ] `<meta name="description">` present
  - [ ] `<meta property="og:title">` present
  - [ ] `<meta property="og:description">` present
  - [ ] `<meta property="og:image">` present
  - [ ] `<link rel="canonical">` present
  - [ ] No 404 errors in Network tab

## DNS & Domain

- [ ] DNS A record for frontend.paranormalmusings.com points to server IP
- [ ] DNS A record for admin.paranormalmusings.com points to server IP
- [ ] DNS propagation complete (can take up to 48 hours)
- [ ] SSL certificates auto-renew configured (if using Let's Encrypt)

```bash
# Check DNS
nslookup frontend.paranormalmusings.com
nslookup admin.paranormalmusings.com

# Check SSL expiry
echo | openssl s_client -servername frontend.paranormalmusings.com -connect frontend.paranormalmusings.com:443 2>/dev/null | openssl x509 -noout -dates
```

## Analytics & Monitoring

- [ ] Google Analytics 4 ID configured in .env.production
- [ ] GA4 receiving data from production
- [ ] Google Search Console updated with new content
- [ ] Sitemap submitted to Google
- [ ] Monitor logs for errors: `pm2 logs`
- [ ] Set up error alerting (optional)

```bash
# Monitor both services
pm2 monit
```

## Backup & Recovery

- [ ] Backup strategy defined
- [ ] Daily backup of content.json scheduled
- [ ] Daily backup of media uploads scheduled
- [ ] Backups stored securely (separate location)
- [ ] Tested recovery procedure

```bash
# Example cron job for daily backups
0 2 * * * cp /home/paranormalmusings/public_html/paranormalmusings-admin/data/content.json /home/paranormalmusings/backups/content.json.$(date +\%Y\%m\%d)
```

## Documentation

- [ ] Deployment documented in PRODUCTION-DEPLOYMENT-GUIDE.md
- [ ] Environment variables documented
- [ ] Admin credentials stored securely
- [ ] Recovery procedures documented
- [ ] Team trained on deployment process

## Communication

- [ ] Notify team of deployment
- [ ] Update status page if applicable
- [ ] Monitor for user feedback
- [ ] Check error logs for issues

## Final Sign-Off

- [ ] All checklist items completed
- [ ] Testing passed successfully
- [ ] No critical issues found
- [ ] Deployment approved by team lead
- [ ] Monitoring and alerts active
- [ ] Ready for public access

**Deployment Date:** _______________
**Deployed By:** _______________
**Reviewed By:** _______________

---

## Quick Rollback (If Issues)

If deployment has critical issues:

```bash
# Stop services
pm2 stop pm-frontend
pm2 stop pm-admin

# Revert to previous code
cd /home/paranormalmusings/public_html/paranormalmusings-frontend
git reset --hard PREVIOUS_COMMIT_HASH

cd /home/paranormalmusings/public_html/paranormalmusings-admin
git reset --hard PREVIOUS_COMMIT_HASH

# Rebuild and restart
npm run build
pm2 restart pm-frontend
pm2 restart pm-admin
```

---

## Support Resources

- 📖 PRODUCTION-DEPLOYMENT-GUIDE.md - Detailed deployment guide
- 📖 SEO-MANAGEMENT-GUIDE.md - SEO data management
- 📖 SEO-IMPLEMENTATION-COMPLETE.md - Technical details
- 🐛 Check logs: `pm2 logs pm-frontend` and `pm2 logs pm-admin`
- 🔍 Debug: Check browser DevTools console for errors

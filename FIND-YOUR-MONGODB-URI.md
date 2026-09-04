# Find Your MongoDB Connection String for Live Website

Your MongoDB URI is stored in one of these places. Follow the path that matches your setup.

---

## 🔍 Where Your Database Is Hosted

### **Option 1: MongoDB Atlas (Cloud)** ⭐ Most Common

MongoDB Atlas is the official cloud hosting for MongoDB. This is likely where your database is.

**Find it:**

1. Go to: https://www.mongodb.com/atlas
2. Log in with your account
3. Select your cluster (usually named something like "paranormalmusings-prod" or "pm-cluster")
4. Click: **"Connect"** button
5. Choose: **"Drivers"** 
6. Select: **"Node.js"** driver
7. Copy the connection string

**It looks like:**
```
mongodb+srv://username:password@cluster-name.mongodb.net/paranormalmusings?retryWrites=true&w=majority
```

**Or click "Connection String" tab and copy the full URI**

---

### **Option 2: Hostinger Managed Database**

If you're using Hostinger's managed database service:

1. Log in to: https://www.hostinger.com/cpanel
2. Go to: **Databases** or **MongoDB**
3. Find your database connection details
4. Look for: "Connection String" or "Connection URI"
5. It might look like:
   ```
   mongodb://username:password@host:port/database_name
   ```

**If you don't see it in control panel:**
- Contact Hostinger support chat
- Ask: "What is my MongoDB connection URI?"
- They'll provide it directly

---

### **Option 3: Check Your Production Server**

If the database is on your Hostinger server, SSH in and check:

```bash
ssh user@paranormalmusings.com

# Check if it's in the admin environment
cat /home/paranormalmusings/public_html/paranormalmusings-admin/.env.production | grep MONGODB_URI

# Or check recent bash history
history | grep -i mongodb

# Or check PM2 environment
pm2 info pm-admin | grep MONGODB
```

If you see output like `MONGODB_URI=mongodb://...`, copy that entire string.

---

### **Option 4: Check Docker/Container Setup** 

If using Docker:

```bash
# Check running containers
docker ps

# Check MongoDB container logs
docker logs <mongodb-container-id> | grep "connection string"

# Or check environment
docker inspect <container-id> | grep MONGODB
```

---

### **Option 5: Ask Your DevOps/Admin**

If you're not sure, ask whoever set up your infrastructure:

> "What is the MongoDB connection URI for my paranormalmusings database in production?"

They should have it in:
- Deployment documentation
- Infrastructure notes
- Secret management system (Vault, AWS Secrets Manager, etc.)
- Kubernetes secrets (if using K8s)

---

## ✅ Verify You Have the Right URI

Once you have a connection string, test it:

### Test 1: Using MongoDB Shell

```bash
# Install mongosh if needed
npm install -g mongosh

# Connect to your database
mongosh "your-connection-string-here"

# In the shell, try:
show dbs
# Should list your databases including 'paranormalmusings'

# Then exit
exit
```

### Test 2: Using MongoDB Compass (GUI)

1. Download: https://www.mongodb.com/products/compass
2. Open Compass
3. Paste your connection string in "New Connection"
4. Click "Connect"
5. Should see your databases

### Test 3: Check for Posts Collection

```bash
# In mongosh:
use paranormalmusings
db.posts.countDocuments()
# Should return: 83 (your posts)

db.posts.findOne()
# Should show your post structure
```

---

## 📋 Typical MongoDB URIs by Provider

### MongoDB Atlas Format:
```
mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### Self-Hosted MongoDB Format:
```
mongodb://username:password@hostname:27017/database_name
```

### Localhost (Local Development):
```
mongodb://localhost:27017/paranormalmusings
```

---

## 🔐 Important Notes

### Security
- ⚠️ **Never share your MongoDB URI publicly**
- ⚠️ **Don't commit it to git**
- ✅ Only put it in `.env.production` (not in git)
- ✅ Rotate passwords regularly

### Connection String Parts
```
mongodb+srv://
  username : password @ 
  cluster.mongodb.net / 
  database_name ? 
  retryWrites=true&w=majority
  │          │     │         │
  │          │     │         └─ Options
  │          │     └─ Database name
  │          └─ Host
  └─ Protocol
```

---

## 🚨 If You Can't Find It

### Scenario 1: Database doesn't exist yet
If you don't have a MongoDB database, create one:

**Free Option (MongoDB Atlas):**
1. Go to: https://www.mongodb.com/atlas
2. Sign up (free tier available)
3. Create a cluster
4. Get the connection string
5. Use it for migration

**Hostinger Option:**
1. Contact: https://support.hostinger.com/
2. Ask to set up MongoDB
3. They'll provide connection string

### Scenario 2: Have connection but it's not working
```bash
# Test connection
mongosh "your-uri" --eval "db.adminCommand('ping')"

# If fails, check:
# - Username and password are correct
# - Database name is correct
# - IP address is whitelisted (if MongoDB Atlas)
# - Special characters in password are URL-encoded
```

### Scenario 3: Using old connection string
If your connection string is old:
1. Log into MongoDB Atlas
2. Click "Connect"
3. Click "Reset Password" if needed
4. Get the new connection string
5. Use the new one

---

## 📝 Common Issues & Fixes

### Issue: "authentication failed"
**Fix:** Check username and password are correct
```bash
# Try with explicit credentials
mongodb+srv://myuser:mypassword@cluster.mongodb.net/paranormalmusings
```

### Issue: "connection refused"
**Fix:** 
- Check hostname is correct
- Check port (if self-hosted)
- Check firewall allows connection
- Check MongoDB is running

### Issue: "no such host"
**Fix:**
- Copy full connection string again
- Don't miss any characters
- Check for typos in hostname

### Issue: Special characters in password
**Fix:** URL-encode the password
```bash
# If password is: mypass@word!
# Convert to: mypass%40word%21
# Use: mongodb+srv://user:mypass%40word%21@...
```

---

## 🎯 Quick Reference Checklist

Find your MongoDB URI by checking:
- [ ] MongoDB Atlas account → Cluster → Connect → Drivers
- [ ] Hostinger control panel → Databases
- [ ] Production server → /env.production file
- [ ] Your notes/documentation
- [ ] DevOps/Admin team
- [ ] Try mongodb+srv://... format first (most common)
- [ ] Verify with mongosh or Compass
- [ ] Test connection with: db.adminCommand('ping')

---

## 🆘 Still Can't Find It?

If you've checked everywhere, here are your options:

### Option A: Create a New Database
```bash
# Use MongoDB Atlas (free)
1. Go to https://www.mongodb.com/atlas
2. Sign up free
3. Create cluster
4. Get connection string
5. Migrate data (your existing data will be imported)
```

### Option B: Contact Support
**MongoDB Atlas Support:**
- https://support.mongodb.com/

**Hostinger Support:**
- https://support.hostinger.com/
- Chat or ticket: "What is my MongoDB URI?"

**Your Admin/DevOps:**
- Email or message: "Need MongoDB connection string for paranormalmusings production"

---

## ✅ Format Your Answer

Once you find it, it should look like ONE of these:

```
# MongoDB Atlas (cloud) - Most Common
mongodb+srv://user:password@paranormalmusings.mongodb.net/paranormalmusings

# Self-hosted
mongodb://user:password@192.168.1.100:27017/paranormalmusings

# Localhost (local only)
mongodb://localhost:27017/paranormalmusings
```

---

## 🎯 Next Step

Once you have your connection string, run:

```bash
MONGODB_URI="your-connection-string-here" npm run migrate:mongo -- --force
```

See: `QUICK-FIX-SEO-ON-LIVE.md` for next steps.

---

**Need more help?** Check the detailed guide: `SYNC-SEO-TO-MONGODB.md`

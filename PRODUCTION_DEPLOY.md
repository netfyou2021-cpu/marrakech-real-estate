# 🏠 Atlas Real Estate - Production Deployment Guide

## 🌐 Domain Setup: atlasrealestate.com or atlasrealestate.ma

### Option A: Deploy to Vercel (Recommended - Easiest & Free)

**Step 1: Deploy Your Code**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /workspaces/marrakech-real-estate
vercel --prod
```

**Step 2: Configure Your Domain**

1. **Buy domain from:**
   - **atlasrealestate.com**: Namecheap, GoDaddy, Google Domains (~$12/year)
   - **atlasrealestate.ma**: .ma registry (Morocco) (~200 MAD/year)

2. **Add domain to Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add: `atlasrealestate.com` or `atlasrealestate.ma`
   
3. **Update DNS at your domain registrar:**
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **SSL Certificate:** Vercel auto-provisions (free)

---

### Option B: Deploy to Your Own VPS (Full Control)

**Step 1: Get a VPS**
- DigitalOcean Droplet ($6/month)
- Vultr ($5/month)
- OVH Morocco (local hosting)

**Step 2: Server Setup**
```bash
# SSH into your server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Clone your repository
git clone https://github.com/netfyou2021-cpu/marrakech-real-estate.git
cd marrakech-real-estate
git checkout feature/fullstack

# Install dependencies (none needed for current setup)
# Set production environment
echo "ADMIN_TOKEN=$(openssl rand -hex 32)" > .env
echo "PORT=3000" >> .env

# Start with PM2
pm2 start server.js --name atlas-real-estate
pm2 save
pm2 startup
```

**Step 3: Configure Nginx**
```bash
# Install Nginx
apt-get install nginx

# Create Nginx config
cat > /etc/nginx/sites-available/atlasrealestate << 'EOF'
server {
    listen 80;
    server_name atlasrealestate.com www.atlasrealestate.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/atlasrealestate /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Install SSL with Let's Encrypt
apt-get install certbot python3-certbot-nginx
certbot --nginx -d atlasrealestate.com -d www.atlasrealestate.com
```

**Step 4: DNS Configuration**
```
Type: A
Name: @
Value: YOUR_SERVER_IP

Type: A
Name: www
Value: YOUR_SERVER_IP
```

---

### Option C: Netlify (Alternative)

1. Connect GitHub repo to Netlify
2. Build command: (leave empty)
3. Publish directory: `.`
4. Add domain in Netlify settings
5. Follow Netlify DNS instructions

---

## 👤 Admin Access Setup

**Your Production Admin Panel:**
- URL: `https://atlasrealestate.com/admin.html`
- Token is in `.env` file on server

**To manage customer listings:**
1. Go to admin panel
2. Enter your secure token
3. Click "+ Add New Listing"
4. Fill form with customer property details
5. Click Save

---

## 📝 Customer Submission Workflow

### Method 1: Direct Admin Entry (Current)
- Customer emails/calls you with property details
- You log into admin panel
- Add listing manually

### Method 2: Customer Submission Form (Future Enhancement)
Create a public form where customers can submit:
- Contact form on website → customer fills details
- You receive email notification
- Review in admin panel → approve/reject
- Approved listings go live automatically

---

## 🗄️ Database: Do You Need One?

**Current Setup:** ✅ **NO DATABASE NEEDED**
- Uses `data/listings.json` file
- Perfect for 0-500 listings
- Zero maintenance
- Automatic backups with git

**When to upgrade to Database:**
- You have 500+ listings
- Multiple admins editing simultaneously  
- Need advanced search analytics
- Want customer accounts/login

**If you need a database later:**
1. Switch to `server_sqlite.js` (SQLite - included)
2. Or upgrade to PostgreSQL (cloud hosted)
3. Migration script provided in codebase

---

## 🚀 Quick Deploy Checklist

- [ ] Choose hosting: Vercel / VPS / Netlify
- [ ] Register domain: atlasrealestate.com or .ma
- [ ] Deploy code following steps above
- [ ] Configure DNS records
- [ ] Test site loads at your domain
- [ ] Access admin panel at /admin.html
- [ ] Save your admin token securely
- [ ] Add first test listing
- [ ] Verify it appears on homepage
- [ ] Share URL with team/customers

---

## 📞 Support & Maintenance

**Backup listings:**
```bash
# On your server
cp data/listings.json data/listings-backup-$(date +%Y%m%d).json
```

**Update site:**
```bash
git pull origin feature/fullstack
pm2 restart atlas-real-estate
```

**View logs:**
```bash
pm2 logs atlas-real-estate
```

---

## 🎯 You're Ready!

Your site has:
- ✅ Professional frontend with map
- ✅ Advanced filters
- ✅ Mobile responsive
- ✅ Multi-language (EN/FR/AR)
- ✅ Admin panel for listings management
- ✅ No database complexity
- ✅ Secure token authentication

**Next step:** Pick a hosting option above and deploy! 🚀

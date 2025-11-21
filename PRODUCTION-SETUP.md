# Atlas Real Estate - Production Deployment Guide

## 🎯 Goal
Deploy your Atlas Real Estate website to production with a custom domain and make it ready to use.

## ✅ Current Status
- ✅ Backend: Node.js server with JSON storage (no database needed)
- ✅ Frontend: Fully functional with interactive map, filters, favorites
- ✅ Admin Panel: Ready to manage customer listings
- ✅ All code committed to GitHub: `feature/fullstack` branch

## 📋 Deployment Options (Choose One)

### Option 1: Vercel (Recommended - Easiest & Free)
**Best for:** Quick deployment, automatic SSL, free custom domain

**Steps:**
1. **Sign up at https://vercel.com** with your GitHub account
2. **Import your repository:**
   - Click "New Project"
   - Select `marrakech-real-estate` repository
   - Branch: `feature/fullstack`
3. **Configure:**
   - Build Command: Leave empty
   - Output Directory: Leave empty
   - Install Command: `npm install` (optional)
4. **Environment Variables:**
   - Add: `ADMIN_TOKEN` = `fdd753f7608c53fbf04ef8e07282bc47`
   - Add: `PORT` = `3000`
5. **Deploy:** Click "Deploy"
6. **Custom Domain:**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `atlasrealestate.com`)
   - Follow DNS configuration instructions

**Vercel will provide:**
- Free SSL certificate
- Auto-deployment on every GitHub push
- URL like: `atlas-real-estate.vercel.app`

---

### Option 2: Render (Good Alternative - Free Tier)
**Best for:** Full control, free SSL, easy setup

**Steps:**
1. **Sign up at https://render.com**
2. **Create New Web Service:**
   - Connect your GitHub repository
   - Select `feature/fullstack` branch
3. **Configure:**
   - Name: `atlas-real-estate`
   - Environment: `Node`
   - Build Command: `npm install` (optional)
   - Start Command: `node server.js`
4. **Environment Variables:**
   - `ADMIN_TOKEN` = `fdd753f7608c53fbf04ef8e07282bc47`
   - `PORT` = `3000`
5. **Deploy**
6. **Custom Domain:**
   - Go to Settings → Custom Domain
   - Add your domain and configure DNS

**Render provides:**
- Free SSL
- Auto-deploy from GitHub
- URL like: `atlas-real-estate.onrender.com`

---

### Option 3: DigitalOcean (Most Control - $6/month)
**Best for:** Full server control, scalability

**Steps:**
1. **Create Droplet:**
   - Sign up at https://digitalocean.com
   - Create Ubuntu 24.04 droplet ($6/month)
2. **SSH into server and setup:**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   
   # Clone your repository
   git clone https://github.com/netfyou2021-cpu/marrakech-real-estate.git
   cd marrakech-real-estate
   git checkout feature/fullstack
   
   # Setup environment
   echo "ADMIN_TOKEN=fdd753f7608c53fbf04ef8e07282bc47" > .env
   echo "PORT=3000" >> .env
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   
   # Start server
   pm2 start server.js --name atlas-real-estate
   pm2 startup
   pm2 save
   
   # Install Nginx (web server)
   sudo apt install nginx
   ```

3. **Configure Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/atlas-real-estate
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/atlas-real-estate /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## 🌐 Domain Registration

### Step 1: Register Your Domain
Choose a domain registrar:
- **Namecheap** (https://namecheap.com) - Popular, ~$12/year
- **GoDaddy** (https://godaddy.com) - Well-known, ~$15/year
- **Google Domains** (https://domains.google) - Simple, ~$12/year
- **Cloudflare** (https://cloudflare.com) - Cheapest, ~$9/year

**Suggested domains:**
- `atlasrealestate.ma` (Morocco domain)
- `atlasrealestate.com`
- `atlas-marrakech.com`
- `marrakechhomes.com`

### Step 2: Configure DNS
After deployment, point your domain to your hosting:

**For Vercel/Render:**
Add these DNS records in your domain registrar:
```
Type: A
Name: @
Value: [Provided by Vercel/Render]

Type: CNAME
Name: www
Value: [Your deployment URL]
```

**For DigitalOcean:**
```
Type: A
Name: @
Value: [Your Droplet IP Address]

Type: A
Name: www
Value: [Your Droplet IP Address]
```

DNS propagation takes 1-48 hours (usually under 2 hours).

---

## 🔐 Security Checklist

### Before Going Live:
1. ✅ Update admin token (change from default):
   ```bash
   openssl rand -hex 32
   ```
   Update in `.env` file or hosting environment variables

2. ✅ Test admin panel:
   - Visit: `yourdomain.com/admin.html`
   - Enter your secure token
   - Add/edit a test listing

3. ✅ Enable HTTPS (SSL):
   - Vercel/Render: Automatic
   - DigitalOcean: Run certbot command above

4. ✅ Backup data regularly:
   ```bash
   # Backup listings
   cp data/listings.json data/listings-backup-$(date +%Y%m%d).json
   ```

---

## 📱 After Deployment - Testing Checklist

### Frontend Testing:
- [ ] Homepage loads correctly
- [ ] All filters work (region, type, rooms, price, surface)
- [ ] Search bar functions properly
- [ ] Map displays properties with markers
- [ ] Clicking markers shows property popup
- [ ] Favorites (heart icon) saves to browser
- [ ] Language switcher works (EN/FR/AR)
- [ ] Property detail modal opens correctly
- [ ] Mobile responsive design works
- [ ] Footer social links are visible

### Admin Panel Testing:
- [ ] Admin panel loads at `/admin.html`
- [ ] Token authentication works
- [ ] Can view existing listings
- [ ] Can create new listing
- [ ] Can edit existing listing
- [ ] Can delete listing
- [ ] Changes reflect on main site immediately
- [ ] Image URLs display correctly
- [ ] i18n editor loads translations

---

## 🚀 Quick Start Commands

### Development (Local):
```bash
cd /workspaces/marrakech-real-estate
node server.js
# Visit: http://localhost:3000
# Admin: http://localhost:3000/admin.html
```

### Production (After Deployment):
```bash
# Update code
git pull origin feature/fullstack

# Restart server (if using PM2)
pm2 restart atlas-real-estate

# View logs
pm2 logs atlas-real-estate
```

---

## 💡 Recommended: Start with Vercel

**Why Vercel?**
- ✅ Free tier sufficient for your needs
- ✅ Automatic HTTPS/SSL
- ✅ Auto-deploy on GitHub push
- ✅ Easy custom domain setup
- ✅ No server management needed
- ✅ Fast global CDN
- ✅ Deploy in under 5 minutes

**After setup, you'll have:**
- Live website: `yourdomain.com`
- Admin panel: `yourdomain.com/admin.html`
- Auto-updates when you push to GitHub
- Professional, secure, fast hosting

---

## 📞 Your Admin Credentials

**Admin Panel URL:** `yourdomain.com/admin.html`
**Admin Token:** `fdd753f7608c53fbf04ef8e07282bc47`
⚠️ **Change this token in production!**

---

## 🎓 Next Steps

1. **Choose hosting platform** (Vercel recommended)
2. **Register domain** (Namecheap/Cloudflare)
3. **Deploy website** (follow platform steps above)
4. **Configure DNS** (point domain to hosting)
5. **Update admin token** (for security)
6. **Test everything** (use checklist above)
7. **Start adding properties!** 🏠

---

## 💬 Need Help?

Your site is fully functional and ready to deploy. All code is tested and working:
- Backend serves API and static files
- Frontend displays properties with advanced features
- Admin panel manages everything
- No database setup required

**You're ready to go live! 🚀**

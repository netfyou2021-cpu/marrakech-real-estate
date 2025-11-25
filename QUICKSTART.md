# Atlas Real Estate - Quick Start for Production

## 🚀 Fastest Way to Go Live (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
cd /workspaces/marrakech-real-estate
vercel login
vercel --prod
```

### Step 3: Get Your Domain
- Buy **atlasrealestate.com** from Namecheap ($12/year)
- Or **atlasrealestate.ma** from Morocco registrar

### Step 4: Connect Domain
1. Go to Vercel dashboard
2. Add your domain
3. Update DNS at registrar:
   - CNAME @ → cname.vercel-dns.com
   - CNAME www → cname.vercel-dns.com

### Step 5: Access Admin
- URL: `https://atlasrealestate.com/admin.html`
- Token: `fdd753f7608c53fbf04ef8e07282bc47`

## ✅ Done! Your site is live!

---

## 📋 Managing Customer Listings

### When a customer contacts you:
1. Open `https://atlasrealestate.com/admin.html`
2. Enter token: `fdd753f7608c53fbf04ef8e07282bc47`
3. Click "+ Add New Listing" (or click existing to edit)
4. Fill in:
   - Title: "Luxury Villa in Palmeraie"
   - Type: villa
   - Action: rent or buy
   - Price: 25000 (in Dhrs)
   - Price Text: "25,000 Dhrs/month"
   - Location: Palmeraie
   - Rooms: 5
   - Bathrooms: 4
   - Surface: 450
   - Images: Copy image URLs from Unsplash or customer photos
   - Description: Full property description
5. Click **Save**
6. Listing appears immediately on website!

---

## 🗄️ Database: Not Needed!

Your current setup uses JSON files:
- **Perfect for**: 0-1000 listings
- **No maintenance**
- **Auto-backed up** with git
- **Fast & simple**

**You don't need a database yet!**

If you grow to 1000+ listings or need multiple admins, I can upgrade you to PostgreSQL later.

---

## 🆘 Need Help?

Check the full guide: `PRODUCTION_DEPLOY.md`

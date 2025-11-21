# Atlas Real Estate - Quick Deploy to Vercel

## 🚀 Deploy in 5 Minutes

### Step 1: Visit Vercel
Go to: https://vercel.com/new

### Step 2: Import Repository
- Click "Import Git Repository"
- Select: `netfyou2021-cpu/marrakech-real-estate`
- Branch: `feature/fullstack`

### Step 3: Configure
- Framework Preset: **Other**
- Root Directory: `./`
- Build Command: (leave empty)
- Output Directory: (leave empty)
- Install Command: (leave empty)

### Step 4: Environment Variables
Click "Add Environment Variable" and add:

```
ADMIN_TOKEN=fdd753f7608c53fbf04ef8e07282bc47
PORT=3000
```

### Step 5: Deploy
Click "Deploy" and wait ~2 minutes.

### Step 6: Visit Your Site
You'll get a URL like: `atlas-real-estate-xxx.vercel.app`

### Step 7: Add Custom Domain
1. Go to Project Settings → Domains
2. Enter your domain (e.g., `atlasrealestate.com`)
3. Follow DNS instructions from your domain registrar

---

## Your Live URLs
- **Main Site:** `https://your-domain.com`
- **Admin Panel:** `https://your-domain.com/admin.html`
- **API:** `https://your-domain.com/api/listings`

---

## ⚠️ Important: Change Admin Token
After deployment, generate a new secure token:
```bash
openssl rand -hex 32
```
Update it in Vercel Settings → Environment Variables

---

## ✅ Verification
- [ ] Visit homepage - should load with 6 sample listings
- [ ] Click on filters - should filter properties
- [ ] Test map - should show property markers
- [ ] Visit `/admin.html` - should load admin panel
- [ ] Enter token - should access admin features
- [ ] Add a test listing - should appear on homepage

**Done! Your site is live! 🎉**

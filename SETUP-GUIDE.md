# Atlas Real Estate - Complete Setup Guide

## 🎯 Quick Start Checklist

- [ ] Set up custom domain
- [ ] Configure Google Analytics
- [ ] Test authentication system
- [ ] Verify all features work
- [ ] Add your property listings

---

## 1. Custom Domain Setup (www.atlasrealestate.com)

### Step 1: Purchase Domain
1. Go to a domain registrar (Namecheap, GoDaddy, Google Domains, etc.)
2. Search for "atlasrealestate.com"
3. Purchase the domain (~$10-15/year)

### Step 2: Configure Domain in Vercel
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your "marrakech-real-estate" project
3. Click on "Settings" → "Domains"
4. Click "Add Domain"
5. Enter: `www.atlasrealestate.com`
6. Vercel will show you DNS records to add

### Step 3: Update DNS Records
In your domain registrar's DNS settings, add:

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**For root domain (optional):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Verification can take 24-48 hours**

---

## 2. Google Analytics Setup

### Step 1: Create Google Analytics Account
1. Go to: https://analytics.google.com
2. Click "Start measuring"
3. Create an account:
   - Account Name: "Atlas Real Estate"
   - Property Name: "Atlas Real Estate Website"
   - Reporting Time Zone: Select your timezone
   - Currency: MAD (Moroccan Dirham)

### Step 2: Get Measurement ID
1. After creating property, you'll see a "Measurement ID" (format: G-XXXXXXXXXX)
2. Copy this ID

### Step 3: Add to Your Website
1. Open `index.html` in your code editor
2. Find the Google Analytics section (around line 30)
3. Replace `YOUR_GA_ID` with your actual Measurement ID
4. Uncomment the code (remove `/*` and `*/`)
5. Save and deploy

### Step 4: Verify Setup
1. Visit your website
2. In Google Analytics, go to Reports → Realtime
3. You should see yourself as an active user
4. Wait 24-48 hours for full data collection

---

## 3. Authentication System

### Your First Admin Account

1. Visit: `https://your-site.vercel.app/auth.html`
2. Click "Register"
3. Fill in:
   - Full Name: Your name
   - Email: Your email
   - Password: Choose a secure password (min 6 characters)
4. Click "Register"
5. Login with your credentials
6. You'll be redirected to the admin panel

### Managing Properties

**To Add a New Property:**
1. Login to admin panel
2. Fill in the form on the right:
   - Title: "Luxury Villa in Palmeraie"
   - Type: villa
   - Action: buy or rent
   - Price: 2500000 (in Dirhams)
   - Price Text: "2,500,000 Dhrs"
   - Location: "Palmeraie, Marrakech"
   - Rooms: 5
   - Bathrooms: 4
   - Surface: 450 (in m²)
   - Images: Paste image URLs, comma-separated
   - Description: Full property description
3. Click "Save"

**Image Sources:**
- Use Unsplash for free high-quality images: https://unsplash.com/s/photos/villa-morocco
- Or upload to a service like Imgur, Cloudinary
- Copy the direct image URL

**To Edit a Property:**
1. Click "Edit" next to any property
2. Modify the form
3. Click "Save"

**To Delete a Property:**
1. Click "Delete" next to any property
2. Confirm deletion

---

## 4. Feature Overview

### 🏠 Property Listings
- Filter by type, location, price, rooms, surface
- Grid and list views
- Interactive map with markers
- Real-time search

### 📸 Image Galleries
- Multiple images per property
- Click to view in carousel
- Navigation arrows and thumbnails
- Image counter

### 🔄 Property Comparison
- Compare up to 3 properties
- Click "Add to Compare" on any property
- View comparison table
- Floating compare button appears when properties are selected

### 📞 Contact Features
- WhatsApp direct messaging
- Call agent button
- Schedule viewing form
- Automatic request storage

### 🔗 Sharing
- Share on Facebook, Twitter, WhatsApp, Email
- Copy link to clipboard
- Native share API on mobile

### 🌙 Dark Mode
- Toggle button in top-right corner
- Auto-detects system preference
- Persists across sessions

### 🖨️ Print
- Print property details
- Clean, optimized layout
- Click "Print" button on any property

### 🌐 Multi-Language
- English, French, Arabic
- Dropdown selector in navigation
- RTL support for Arabic

---

## 5. Vercel Deployment

Your site auto-deploys on every push to GitHub.

**Deployment URLs:**
- Production: Your Vercel URL (e.g., marrakech-real-estate.vercel.app)
- Custom Domain: www.atlasrealestate.com (once configured)

**To Trigger New Deployment:**
1. Make changes to your code
2. Commit: `git add -A && git commit -m "Your message"`
3. Push: `git push`
4. Vercel automatically deploys (takes ~1 minute)

**View Deployments:**
https://vercel.com/dashboard → Select project → "Deployments"

---

## 6. Customization Guide

### Update Site Branding

**Change Logo/Company Name:**
Edit `index.html` and `admin.html`:
```html
<div class="logo">Your Company Name</div>
```

**Change Colors:**
Edit `styles.css`:
```css
:root {
  --accent: #c14b1a;        /* Primary color */
  --accent-2: #d2691e;      /* Secondary color */
  --muted: #6b4a32;         /* Text color */
}
```

**Change Hero Image:**
1. Replace `Marrakech.png` with your image
2. Or update `styles.css`:
```css
.hero {
  background-image: url('your-image.jpg');
}
```

### Add More Regions

Edit `index.html`, find the region dropdown and add:
```html
<option value="YourRegion">Your Region</option>
```

### Customize Agent Contact

When adding properties, include agent info:
```json
{
  "agent": {
    "name": "Agent Name",
    "phone": "+212600123456"
  }
}
```

---

## 7. Maintenance & Support

### Backup Data

Your data is stored in `data/` folder:
- `listings.json` - All properties
- `users.json` - Admin accounts (passwords are hashed)

**To backup:**
```bash
git pull
cp -r data/ backups/data-$(date +%Y%m%d)/
```

### Monitor Performance

**Google Analytics Dashboard:**
- View traffic, popular properties
- User demographics
- Conversion tracking

**Vercel Analytics:**
- Page load times
- Error tracking
- Visitor insights

### Security Best Practices

1. **Strong Passwords**: Use 12+ character passwords for admin accounts
2. **Regular Updates**: Keep your listings and info current
3. **Backup Regularly**: Weekly backups recommended
4. **Monitor Access**: Check admin panel access logs

---

## 8. Troubleshooting

### Site Not Loading
1. Check Vercel deployment status
2. Verify DNS records are correct
3. Clear browser cache
4. Check browser console for errors

### Can't Login
1. Verify you registered an account
2. Check password is correct (min 6 characters)
3. Clear browser cookies
4. Try registering a new account

### Images Not Showing
1. Verify image URLs are valid
2. Check images are publicly accessible
3. Use direct image links (not webpage links)
4. Try different image hosting service

### Map Not Working
1. Check internet connection
2. Verify Leaflet library loaded
3. Check browser console for errors
4. Ensure location coordinates are valid

---

## 9. Advanced Features (Coming Soon)

Want to add more features? Contact for:
- Email notifications for leads
- Database integration (MongoDB/PostgreSQL)
- Advanced search with filters
- Property recommendations
- User reviews and ratings
- Payment integration
- Virtual tours
- Mobile app

---

## 10. Support & Resources

### Documentation
- Vercel Docs: https://vercel.com/docs
- Leaflet Map Docs: https://leafletjs.com
- Google Analytics Help: https://support.google.com/analytics

### Getting Help
1. Check this guide first
2. Review code comments
3. Check browser console for errors
4. Google specific error messages

---

## 🎉 Congratulations!

Your Atlas Real Estate website is now live with:
- ✅ User authentication
- ✅ Property management
- ✅ Image galleries
- ✅ Comparison feature
- ✅ Contact & scheduling
- ✅ Social sharing
- ✅ Dark mode
- ✅ SEO optimized
- ✅ Mobile responsive

**You're ready to start listing properties!**

---

*Last updated: November 18, 2025*

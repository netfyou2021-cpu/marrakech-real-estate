# 🏠 Marrakech Real Estate Platform

A modern, full-featured real estate listing platform for Marrakech properties. Built with vanilla JavaScript, Node.js, and PostgreSQL.

## 🌟 Live Site
**Production URL**: https://marrakech-real-estate.vercel.app
**Admin Panel**: https://marrakech-real-estate.vercel.app/admin.html
**Admin Token**: `f318525109e3a4943a33ceef25077af056a246886b4073072b4ecfc22cb153f0`

## ✨ Features

- 🔍 **Advanced Search & Filters** - Search by location, type, price, action
- 🗺️ **Interactive Map** - Leaflet map with property markers
- 🌍 **Multi-Language** - English, French, Arabic support
- 📱 **Responsive Design** - Works on all devices
- 💾 **PostgreSQL Database** - Powered by Neon
- 🚀 **Auto-Deploy** - Push to GitHub, deploys automatically

## 📁 Key Files

- `index.html` - Main homepage
- `admin.html` - Admin panel  
- `styles.css` - All styling
- `script.js` - Frontend logic
- `server.js` - Backend API
- `init-db.sql` - Database setup
- `sample-properties.sql` - 12 additional property templates

## 🔧 Management Guides

- **ADMIN-GUIDE.md** - How to add/manage properties
- **BRANDING-GUIDE.md** - Customize colors and fonts
- **DEPLOY_NOW.md** - Full deployment guide

## 🚀 Quick Start (Local Development)

```bash
# Clone repository
git clone https://github.com/netfyou2021-cpu/marrakech-real-estate.git
cd marrakech-real-estate

# Install dependencies
npm install

# Start server
node server.js

# Open browser
http://localhost:3000
```

## 🌐 Production Deployment

This site is deployed on **Vercel** with **Neon PostgreSQL**.

### Environment Variables (Already Set ✓)
- `DATABASE_URL` - Neon PostgreSQL connection
- `ADMIN_TOKEN` - Admin panel authentication

### To Update Production
```bash
git add .
git commit -m "Update"
git push origin main
```
Vercel automatically deploys your changes!

## 📊 Current Status

✅ **Live & Running**
- 6+ properties in database
- Map with markers functional
- Search & filters working
- Multi-language support active
- Admin panel secured

## 🎨 Customization

**Change Colors**: Edit `:root` in `styles.css`
**Add Properties**: See `ADMIN-GUIDE.md`
**Custom Domain**: Add in Vercel Dashboard → Domains

## 📞 Admin Access

- **URL**: https://marrakech-real-estate.vercel.app/admin.html
- **Token**: `f318525109e3a4943a33ceef25077af056a246886b4073072b4ecfc22cb153f0`

## 📄 License

MIT License

---

**🏠 Your Marrakech Real Estate Platform is Live!**

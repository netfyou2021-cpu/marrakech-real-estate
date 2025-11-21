# 🚀 Quick Reference Card - Atlas Real Estate

## Essential URLs

| Service | URL |
|---------|-----|
| **Live Site** | https://marrakech-real-estate.vercel.app |
| **Admin Panel** | https://marrakech-real-estate.vercel.app/admin.html |
| **Login** | https://marrakech-real-estate.vercel.app/auth.html |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **GitHub Repo** | https://github.com/netfyou2021-cpu/marrakech-real-estate |
| **Google Analytics** | https://analytics.google.com |

---

## Quick Actions

### Deploy Changes
```bash
git add -A
git commit -m "Your message"
git push
```

### Add New Property
1. Login to admin panel
2. Fill form → Save
3. Property appears instantly

### View Logs
```bash
# Vercel dashboard → Your project → View Function Logs
```

---

## Features at a Glance

| Feature | How to Use |
|---------|-----------|
| **Image Gallery** | Click property → Navigate with arrows |
| **Compare** | Add up to 3 properties → Click floating "Compare" button |
| **Share** | Open property → Click "Share" button |
| **Schedule** | Open property → Click "Schedule Viewing" |
| **Dark Mode** | Click 🌙 button (top-right) |
| **Print** | Open property → Click "Print" button |
| **Favorites** | Click ♥ on any property card |
| **Search** | Type in search box → Auto-filters |
| **Map** | Click markers → View property details |

---

## Admin Quick Commands

### Property Management
```
Add: Fill form → Save
Edit: Click "Edit" → Modify → Save  
Delete: Click "Delete" → Confirm
```

### Translations
```
1. Load translations
2. Edit JSON
3. Save
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close modal |
| `←` / `→` | Navigate gallery images |
| `Ctrl+P` | Print property |

---

## Support Checklist

❓ **Site not loading?**
- Check Vercel deployment status
- Verify DNS settings
- Clear cache

❓ **Can't login?**
- Register first at /auth.html
- Use correct credentials
- Clear cookies

❓ **Images missing?**
- Check image URLs
- Use direct links
- Try different host

---

## File Structure

```
marrakech-real-estate/
├── index.html          # Main page
├── auth.html           # Login/Register
├── admin.html          # Admin panel
├── script.js           # Frontend logic
├── admin.js            # Admin logic
├── styles.css          # All styles
├── server.js           # Backend API
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Crawler rules
└── data/
    ├── listings.json   # Properties
    └── users.json      # Admin accounts
```

---

## Emergency Contacts

**Deployment Issues**: Check Vercel dashboard
**Code Issues**: Review browser console (F12)
**DNS Issues**: Contact domain registrar

---

**Need Help?** Check SETUP-GUIDE.md for detailed instructions.

*Version 1.0 - Nov 2025*

# Admin Guide - Marrakech Real Estate

## Your Admin Access

**Admin Panel URL**: `http://your-domain:3000/admin.html`

**Your Secure Token**: `fdd753f7608c53fbf04ef8e07282bc47`

⚠️ **Keep this token private!** Anyone with this token can add/edit/delete listings.

## How to Manage Customer Requests

### When a Customer Wants to List Their Property:

1. **Open Admin Panel**: Go to `admin.html` in your browser
2. **Enter Your Token**: Paste the token above in the "Admin Token" field at the top
3. **Click "Add New Listing"**
4. **Fill in the property details**:
   - Title (e.g., "Beautiful Riad in Medina")
   - Type: apartment/villa/house/riad/land/garage
   - Action: rent/buy
   - Price & Price Text
   - Location
   - Number of Rooms
   - Number of Bathrooms
   - Surface Area (m²)
   - Images (comma-separated URLs)
   - Description
5. **Click "Save Listing"**

The listing appears on the homepage immediately!

## Current Storage (No Database Needed Yet)

- **Storage**: JSON file (`data/listings.json`)
- **Backup**: Auto-saved with each change
- **Scalability**: Works fine for hundreds of listings

## When You'll Need a Database

Consider upgrading to SQLite/PostgreSQL when:
- You have 500+ listings
- Multiple admins managing content simultaneously
- Need advanced search/filtering
- Want customer accounts/saved searches

## Quick Actions

### View All Listings
```bash
curl http://localhost:3000/api/listings
```

### Backup Your Data
```bash
cp data/listings.json data/listings-backup-$(date +%Y%m%d).json
```

### Check Server Status
```bash
curl http://localhost:3000/api/listings | jq '.total'
```

## Security Notes

- Token is stored in `.env` file (not committed to git)
- Only you have the token
- API validates token on all create/update/delete operations
- Public users can only view listings (no token needed)

## Customer Submission Form (Optional Future Feature)

If you want customers to submit properties directly:
1. Create a public submission form on your site
2. Form submits to a "pending" collection
3. You review and approve in admin panel
4. Approved listings go live

For now, customers can email you details and you add them via admin panel.

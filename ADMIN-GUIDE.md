# Admin Panel Guide

## Access Your Admin Panel
**URL**: https://marrakech-real-estate.vercel.app/admin.html
**Token**: `f318525109e3a4943a33ceef25077af056a246886b4073072b4ecfc22cb153f0`

## Adding New Property Listings

### Method 1: Through Admin Panel (Coming Soon)
The admin panel interface is being enhanced for easier property management.

### Method 2: Direct Database (Current Method)

#### Step 1: Access Neon SQL Editor
1. Go to https://console.neon.tech
2. Select your project: **neon-teal-umbrella**
3. Click **SQL Editor**

#### Step 2: Add a New Property
Copy and modify this template:

```sql
INSERT INTO listings (title, type, action, price, location, rooms, bathrooms, surface, description, images, features, agent_name, agent_phone) 
VALUES (
  'Your Property Title',           -- e.g., 'Modern Villa in Palmeraie'
  'villa',                          -- Options: apartment, villa, riad, house, land, garage, commercial, building, warehouse
  'buy',                            -- Options: 'buy' or 'rent'
  2500000.00,                       -- Price in MAD (use .00 for whole numbers)
  'Palmeraie, Marrakech',          -- Full address
  4,                                -- Number of bedrooms (0 for land/garage)
  3,                                -- Number of bathrooms
  300.00,                           -- Surface area in m²
  'Full description here...',       -- Detailed description
  ARRAY['https://images.unsplash.com/photo-xxxxx?w=800'],  -- Image URLs (can add multiple)
  ARRAY['Pool', 'Garden', 'Parking'],  -- Features (can add multiple)
  'Agent Name',                     -- Your name or agent name
  '+212-6-12-34-56-78'             -- Contact phone
);
```

#### Step 3: Click "Run" to add the property

### Property Types Reference:
- **apartment**: Apartments and flats
- **villa**: Luxury villas
- **riad**: Traditional Moroccan riads
- **house**: Standard houses
- **land**: Empty plots for development
- **garage**: Parking spaces
- **commercial**: Shops, restaurants, offices
- **building**: Multi-unit buildings
- **warehouse**: Storage and industrial spaces

### Action Types:
- **buy**: Property for sale
- **rent**: Property for rent

### Getting Good Property Images:
1. **Free Stock Photos**: https://unsplash.com/s/photos/luxury-home
2. **Upload Your Own**: Use a service like Imgur or Cloudinary
3. **Professional Photos**: Hire a real estate photographer

### Quick Add Multiple Properties:
Run the `sample-properties.sql` file we created:
1. Open `/workspaces/marrakech-real-estate/sample-properties.sql`
2. Copy entire content
3. Paste in Neon SQL Editor
4. Click "Run"
5. This adds 12 additional properties instantly!

## Managing Existing Properties

### View All Properties:
```sql
SELECT id, title, type, action, price, location FROM listings ORDER BY created_at DESC;
```

### Update a Property:
```sql
UPDATE listings 
SET 
  price = 2800000.00,
  description = 'Updated description'
WHERE id = 1;
```

### Delete a Property:
```sql
DELETE FROM listings WHERE id = 5;
```

### Change Property Status (Rent to Buy):
```sql
UPDATE listings SET action = 'buy' WHERE id = 3;
```

## Featured Properties
To feature a property on the homepage, you can add a `featured` flag:

```sql
-- First, add the column (one time only):
ALTER TABLE listings ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Then mark properties as featured:
UPDATE listings SET featured = TRUE WHERE id IN (1, 2, 3);
```

## Bulk Operations

### Change All Prices by Percentage:
```sql
-- Increase all rental prices by 10%
UPDATE listings SET price = price * 1.10 WHERE action = 'rent';
```

### Add Feature to Multiple Properties:
```sql
-- Add 'Swimming Pool' to all villas
UPDATE listings 
SET features = array_append(features, 'Swimming Pool') 
WHERE type = 'villa';
```

## Tips for Great Listings:
1. **Use High-Quality Images**: First image is the thumbnail
2. **Write Compelling Descriptions**: Include neighborhood, nearby amenities
3. **Accurate Pricing**: Research market rates
4. **Add Many Features**: Helps with search and filtering
5. **Include Agent Info**: Makes it easy for buyers to contact

## Troubleshooting

**Properties not showing on site?**
- Clear browser cache
- Check database with: `SELECT COUNT(*) FROM listings;`
- Verify Vercel environment variables are set

**Images not loading?**
- Use direct image URLs (not shortened links)
- Ensure URLs start with `https://`
- Test URL in browser first

**Need Help?**
Check the server logs in Vercel Dashboard → Your Project → Deployments → [Latest] → View Function Logs

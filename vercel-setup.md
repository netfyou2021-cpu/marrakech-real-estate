# Quick Database Setup for Your Deployed Site

Your site is live but needs database connection to show properties.

## Step 1: Create Vercel Postgres Database (2 minutes)

1. Go to your Vercel dashboard: https://vercel.com/younes-tebbaais-projects
2. Click on your **marrakech-real-estate** project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Name: `marrakech-db`
7. Region: `Frankfurt (eu-central-1)`
8. Click **Create**

## Step 2: Initialize Database with Sample Data

1. In Vercel dashboard, stay in **Storage** → Click your database
2. Click **Query** tab
3. Copy and paste this SQL:

```sql
-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  location TEXT NOT NULL,
  rooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  surface DECIMAL(10,2) DEFAULT 0,
  description TEXT,
  images TEXT[],
  features TEXT[],
  agent_name TEXT,
  agent_phone TEXT,
  agent_email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample listings
INSERT INTO listings (title, type, action, price, location, rooms, bathrooms, surface, description, images, features, agent_name, agent_phone) VALUES
('Modern Apartment in Gueliz', 'apartment', 'rent', 5000.00, 'Gueliz', 2, 1, 80.00, 
 'Beautiful modern apartment in the heart of Gueliz.',
 ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
 ARRAY['Furnished', 'Balcony', 'Modern Kitchen'],
 'Ahmed Benali', '+212-612-345-678'),

('Luxury Villa in Palmeraie', 'villa', 'buy', 2500000.00, 'Palmeraie', 4, 3, 300.00,
 'Stunning luxury villa with private pool and garden.',
 ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
 ARRAY['Private Pool', 'Garden', 'Security'],
 'Fatima Zahra', '+212-623-456-789'),

('Charming Riad in Medina', 'riad', 'buy', 1800000.00, 'Medina', 5, 4, 250.00,
 'Authentic Moroccan riad with traditional architecture.',
 ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
 ARRAY['Rooftop Terrace', 'Traditional'],
 'Hassan El Mansouri', '+212-634-567-890');
```

4. Click **Execute** or **Run Query**
5. You should see "Success" message

## Step 3: Redeploy (Auto-connects Database)

Vercel automatically injects the `DATABASE_URL` environment variable.

1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Wait ~1 minute

## Step 4: Check Your Live Site

Visit your site - you should now see:
- ✅ 3 property listings with images
- ✅ Filters working
- ✅ Search working
- ✅ Map showing

Your site URL: Check Vercel dashboard for the exact URL

## ✅ Done!

Your Version 3 is now fully functional with dynamic database!

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
  images TEXT[], -- Array of image URLs
  features TEXT[], -- Array of features
  agent_name TEXT,
  agent_phone TEXT,
  agent_email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_action ON listings(action);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample listings
INSERT INTO listings (title, type, action, price, location, rooms, bathrooms, surface, description, images, features, agent_name, agent_phone) VALUES
('Modern Apartment in Gueliz', 'apartment', 'rent', 5000.00, 'Gueliz', 2, 1, 80.00, 
 'Beautiful modern apartment in the heart of Gueliz. Close to restaurants, cafes, and shopping. Features include modern kitchen, spacious living room, and private balcony.',
 ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
 ARRAY['Furnished', 'Balcony', 'Modern Kitchen', 'Parking'],
 'Ahmed Benali', '+212-6-12-34-56-78'),

('Luxury Villa in Palmeraie', 'villa', 'buy', 2500000.00, 'Palmeraie', 4, 3, 300.00,
 'Stunning luxury villa with private pool and garden. Located in the prestigious Palmeraie area with 24/7 security. Perfect for families seeking tranquility with easy access to the city.',
 ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
 ARRAY['Private Pool', 'Garden', 'Security', 'Garage', 'Modern Design'],
 'Fatima Zahra', '+212-6-23-45-67-89'),

('Charming Riad in Medina', 'riad', 'buy', 1800000.00, 'Medina', 5, 4, 250.00,
 'Authentic Moroccan riad with traditional architecture. Recently renovated while preserving original features. Includes rooftop terrace with stunning views of the Atlas Mountains.',
 ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
 ARRAY['Rooftop Terrace', 'Traditional Architecture', 'Renovated', 'Mountain Views'],
 'Hassan El Mansouri', '+212-6-34-56-78-90'),

('Spacious House in Hivernage', 'house', 'rent', 12000.00, 'Hivernage', 3, 2, 180.00,
 'Modern house in the upscale Hivernage neighborhood. Walking distance to Majorelle Garden and luxury hotels. Features include private garden and modern amenities.',
 ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
 ARRAY['Private Garden', 'Modern Design', 'Central Location', 'Fully Equipped'],
 'Youssef Alami', '+212-6-45-67-89-01'),

('Investment Land in Ourika', 'land', 'buy', 800000.00, 'Ourika Valley', 0, 0, 1000.00,
 'Prime development land in the beautiful Ourika Valley. Perfect for hotel, resort, or residential development. Stunning mountain views and river access.',
 ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
 ARRAY['Development Potential', 'Mountain Views', 'River Access', 'Large Plot'],
 'Mohamed Tahiri', '+212-6-56-78-90-12'),

('Secure Garage in Gueliz', 'garage', 'rent', 800.00, 'Gueliz', 0, 0, 15.00,
 'Secure underground parking space in central Gueliz. 24/7 access with security cameras. Perfect for residents or businesses in the area.',
 ARRAY['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800'],
 ARRAY['24/7 Access', 'Security Cameras', 'Underground', 'Central Location'],
 'Karim Berrada', '+212-6-67-89-01-23');

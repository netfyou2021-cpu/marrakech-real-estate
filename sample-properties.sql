-- Additional Premium Properties for Marrakech Real Estate
-- Run these in Neon SQL Editor to add more listings

INSERT INTO listings (title, type, action, price, location, rooms, bathrooms, surface, description, images, features, agent_name, agent_phone) VALUES

-- Luxury Properties
('Penthouse with Atlas Mountain Views', 'apartment', 'buy', 3200000.00, 'Gueliz', 3, 3, 250.00,
 'Spectacular penthouse apartment with panoramic views of the Atlas Mountains. Features include a private rooftop terrace, infinity pool, designer kitchen, and smart home technology. Located in the heart of Gueliz near finest restaurants.',
 ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
 ARRAY['Rooftop Pool', 'Mountain Views', 'Smart Home', 'Designer Kitchen', 'Concierge'],
 'Leila Bennani', '+212-6-78-90-12-34'),

('Exclusive Golf Villa in Amelkis', 'villa', 'buy', 5800000.00, 'Amelkis Golf Resort', 5, 4, 450.00,
 'Exceptional villa on the golf course with stunning fairway views. Features include private pool, spa, gym, wine cellar, and guest house. Perfect for luxury living with golf membership included.',
 ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
 ARRAY['Golf Course', 'Private Pool', 'Spa', 'Gym', 'Wine Cellar', 'Guest House'],
 'Omar Taouzari', '+212-6-89-01-23-45'),

-- Rental Properties
('Furnished Studio in Agdal', 'apartment', 'rent', 3500.00, 'Agdal', 1, 1, 45.00,
 'Modern furnished studio perfect for students or young professionals. Includes kitchenette, WiFi, and all utilities. Close to universities and public transport.',
 ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
 ARRAY['Furnished', 'WiFi', 'Utilities Included', 'Near University'],
 'Nadia Filali', '+212-6-90-12-34-56'),

('Family Apartment near Schools', 'apartment', 'rent', 7500.00, 'Marrakech Centre', 3, 2, 130.00,
 'Spacious family apartment in safe neighborhood. Near international schools, parks, and shopping. Features include modern kitchen, balcony, and parking space.',
 ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
 ARRAY['Near Schools', 'Safe Area', 'Parking', 'Balcony', 'Modern'],
 'Rachid Benjelloun', '+212-6-01-23-45-67'),

-- Commercial Properties
('Restaurant Space in Gueliz', 'commercial', 'rent', 15000.00, 'Gueliz', 0, 2, 200.00,
 'Prime restaurant location on busy street in Gueliz. Fully equipped commercial kitchen, dining area for 80 guests, terrace, and bar license. Ready for immediate operation.',
 ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
 ARRAY['Commercial Kitchen', 'Bar License', 'Terrace', 'High Traffic Area'],
 'Karim Alaoui', '+212-6-12-34-56-78'),

('Retail Shop in Medina', 'commercial', 'rent', 5000.00, 'Medina', 0, 1, 60.00,
 'Charming retail space in the heart of the Medina. Perfect for boutique, gallery, or artisan shop. High foot traffic from tourists and locals.',
 ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
 ARRAY['High Foot Traffic', 'Tourist Area', 'Renovated', 'Storage Space'],
 'Fatima Chraibi', '+212-6-23-45-67-89'),

-- Investment Properties
('Development Plot in New City', 'land', 'buy', 1200000.00, 'Route de Casablanca', 0, 0, 2000.00,
 'Prime development land in rapidly growing area. Zoned for residential/commercial mixed-use. All utilities available. Perfect for apartment complex or shopping center.',
 ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
 ARRAY['Development Zone', 'All Utilities', 'High Growth Area', 'Mixed Use Zoning'],
 'Hassan Idrissi', '+212-6-34-56-78-90'),

('Income Property - 4 Apartments', 'building', 'buy', 2800000.00, 'Targa', 8, 4, 350.00,
 'Investment building with 4 separate apartments, all currently rented. Excellent ROI of 7%. Well-maintained building in growing neighborhood. Perfect passive income.',
 ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
 ARRAY['4 Units', 'All Rented', '7% ROI', 'Well Maintained', 'Passive Income'],
 'Youssef Tazi', '+212-6-45-67-89-01'),

-- Unique Properties
('Traditional Dar with Courtyard', 'house', 'buy', 950000.00, 'Marrakech Medina', 4, 3, 180.00,
 'Authentic Moroccan Dar with central courtyard and fountain. Recently restored with traditional zellige tiles and carved cedar wood. Walking distance to Jemaa el-Fnaa.',
 ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
 ARRAY['Courtyard', 'Traditional Design', 'Restored', 'Central Medina', 'Fountain'],
 'Amina Kettani', '+212-6-56-78-90-12'),

('Artist Studio with Garden', 'house', 'rent', 8500.00, 'Route de l''Ourika', 2, 1, 120.00,
 'Inspiring artist studio with large windows and natural light. Includes living space, garden with olive trees, and mountain views. Perfect for creative professionals.',
 ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'],
 ARRAY['Natural Light', 'Garden', 'Mountain Views', 'Quiet Area', 'Inspiring Space'],
 'Mehdi Lahlou', '+212-6-67-89-01-23'),

-- Parking & Storage
('Secure Parking - 3 Spaces', 'garage', 'rent', 2000.00, 'Hivernage', 0, 0, 40.00,
 'Three adjacent parking spaces in secure underground garage. 24/7 access, CCTV surveillance, and EV charging available. Perfect for luxury car storage.',
 ARRAY['https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800'],
 ARRAY['3 Spaces', '24/7 Security', 'CCTV', 'EV Charging', 'Underground'],
 'Said Benkirane', '+212-6-78-90-12-34'),

('Commercial Warehouse', 'warehouse', 'rent', 12000.00, 'Sidi Ghanem', 0, 1, 500.00,
 'Large commercial warehouse in industrial zone. High ceilings, loading dock, office space, and good access. Suitable for manufacturing, storage, or distribution.',
 ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
 ARRAY['Loading Dock', 'High Ceilings', 'Office Space', 'Industrial Zone', 'Large Space'],
 'Khalid Boussaid', '+212-6-89-01-23-45');

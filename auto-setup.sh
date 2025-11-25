#!/bin/bash

echo "🚀 Vercel Postgres Auto-Setup"
echo "=============================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

echo "🔐 Step 1: Login to Vercel"
vercel login

echo ""
echo "🔗 Step 2: Link to your project"
vercel link --yes

echo ""
echo "📊 Step 3: Create Postgres Database"
echo ""
echo "⚠️  I'll now open your browser to create the database."
echo "    Please follow these steps:"
echo ""
echo "    1. Click 'Create Database'"
echo "    2. Select 'Postgres'"
echo "    3. Name: marrakech-users"
echo "    4. Region: Europe"
echo "    5. Click 'Create'"
echo ""
echo "Press ENTER when you've created the database..."

# Open browser to storage page
"$BROWSER" "https://vercel.com/netfyou2021-cpu/marrakech-real-estate/stores" 2>/dev/null || xdg-open "https://vercel.com/netfyou2021-cpu/marrakech-real-estate/stores" 2>/dev/null || open "https://vercel.com/netfyou2021-cpu/marrakech-real-estate/stores" 2>/dev/null

read -p ""

echo ""
echo "📝 Step 4: Running database initialization..."
echo ""

# Pull environment variables
vercel env pull .env.local

# Check if database is connected
if [ -f .env.local ]; then
    echo "✅ Environment variables loaded!"
    echo ""
    echo "🔨 Creating database tables..."
    node setup-db.js
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS! Database is ready!"
        echo ""
        echo "🎉 You can now register at:"
        echo "   https://marrakech-real-estate.vercel.app/auth.html"
        echo ""
    else
        echo "❌ Error running setup-db.js"
        echo "Please run manually: node setup-db.js"
    fi
else
    echo "⚠️  Could not load environment variables."
    echo "Please make sure the database is created in Vercel dashboard."
fi

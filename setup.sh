#!/bin/bash
# Atlas Real Estate - Automated Setup Script

echo "🏠 Atlas Real Estate - Setup Wizard"
echo "===================================="
echo ""

# Function to update GA ID
setup_analytics() {
    echo "📊 Google Analytics Setup"
    echo "------------------------"
    echo ""
    echo "To get your Google Analytics ID:"
    echo "1. Visit: https://analytics.google.com"
    echo "2. Create an account (if you don't have one)"
    echo "3. Create a property for atlasrealestate.com"
    echo "4. Copy your Measurement ID (format: G-XXXXXXXXXX)"
    echo ""
    read -p "Enter your GA Measurement ID (or press Enter to skip): " ga_id
    
    if [ ! -z "$ga_id" ]; then
        # Update index.html with GA ID
        sed -i "s/YOUR-GA-MEASUREMENT-ID/$ga_id/g" index.html
        sed -i 's|// Uncomment below|// Analytics enabled|g' index.html
        sed -i 's|// var GA|var GA|g' index.html
        sed -i 's|// var script|var script|g' index.html
        sed -i 's|// script|script|g' index.html
        sed -i 's|// document|document|g' index.html
        sed -i 's|// window|window|g' index.html
        sed -i 's|// function|function|g' index.html
        sed -i 's|// gtag|gtag|g' index.html
        
        echo "✅ Google Analytics configured with ID: $ga_id"
        echo ""
    else
        echo "⏭️  Skipped Google Analytics setup"
        echo ""
    fi
}

# Function to show domain setup instructions
setup_domain() {
    echo "🌐 Custom Domain Setup"
    echo "---------------------"
    echo ""
    echo "Would you like to set up www.atlasrealestate.com?"
    read -p "(y/n): " domain_choice
    
    if [ "$domain_choice" = "y" ]; then
        echo ""
        echo "📝 Domain Setup Instructions:"
        echo ""
        echo "Step 1: Purchase Domain"
        echo "  - Go to Namecheap, GoDaddy, or Google Domains"
        echo "  - Search for: atlasrealestate.com"
        echo "  - Complete purchase"
        echo ""
        echo "Step 2: Configure in Vercel"
        echo "  1. Go to: https://vercel.com/dashboard"
        echo "  2. Select your project"
        echo "  3. Go to Settings → Domains"
        echo "  4. Click 'Add Domain'"
        echo "  5. Enter: www.atlasrealestate.com"
        echo ""
        echo "Step 3: Update DNS Records"
        echo "  In your domain registrar, add these records:"
        echo ""
        echo "  CNAME Record:"
        echo "    Name: www"
        echo "    Value: cname.vercel-dns.com"
        echo "    TTL: 3600"
        echo ""
        echo "  A Record (for root domain):"
        echo "    Name: @"
        echo "    Value: 76.76.21.21"
        echo "    TTL: 3600"
        echo ""
        echo "⏰ Note: DNS propagation can take 24-48 hours"
        echo ""
    else
        echo "⏭️  Skipped domain setup"
        echo ""
    fi
}

# Function to create first admin account
setup_admin() {
    echo "👤 Admin Account"
    echo "---------------"
    echo ""
    echo "Create your first admin account at:"
    echo "👉 https://your-site.vercel.app/auth.html"
    echo ""
    echo "After deployment, visit the auth page and register."
    echo ""
}

# Function to deploy
deploy_changes() {
    echo "🚀 Deploy Changes"
    echo "----------------"
    echo ""
    read -p "Deploy changes now? (y/n): " deploy_choice
    
    if [ "$deploy_choice" = "y" ]; then
        git add -A
        git commit -m "Configure analytics and setup"
        git push
        echo ""
        echo "✅ Changes deployed!"
        echo "⏰ Deployment will complete in ~1 minute"
        echo ""
    else
        echo "⏭️  Skipped deployment"
        echo ""
        echo "To deploy later, run:"
        echo "  git add -A"
        echo "  git commit -m 'Your message'"
        echo "  git push"
        echo ""
    fi
}

# Main setup flow
echo "This wizard will help you set up:"
echo "  ✓ Google Analytics"
echo "  ✓ Custom Domain"
echo "  ✓ Admin Account"
echo ""
read -p "Continue? (y/n): " continue_choice

if [ "$continue_choice" = "y" ]; then
    echo ""
    setup_analytics
    setup_domain
    setup_admin
    deploy_changes
    
    echo "🎉 Setup Complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Wait for deployment (~1 minute)"
    echo "  2. Visit your site and test features"
    echo "  3. Register your admin account"
    echo "  4. Start adding property listings"
    echo ""
    echo "📚 Documentation:"
    echo "  - Full guide: SETUP-GUIDE.md"
    echo "  - Quick ref: QUICK-REFERENCE.md"
    echo ""
    echo "🌐 Your Site:"
    echo "  https://marrakech-real-estate.vercel.app"
    echo ""
else
    echo ""
    echo "Setup cancelled. Run ./setup.sh anytime to configure."
    echo ""
fi

# Branding Customization Guide

## Current Brand Colors
Your site uses warm, Morocco-inspired colors:
- **Primary (Terracotta)**: #c14b1a
- **Secondary (Bronze)**: #d2691e  
- **Background (Cream)**: #fffaf0
- **Text (Brown)**: #6b4a32

## Option 1: Luxury Gold & Navy (Upscale)
```css
:root{
	--bg:#f8f8f8; 
	--accent:#1a4d7a; /* Navy Blue */
	--accent-2:#d4af37; /* Gold */
	--muted:#2c3e50; 
	--card:#fff;
}
```

## Option 2: Modern Teal & Coral (Contemporary)
```css
:root{
	--bg:#ffffff; 
	--accent:#008080; /* Teal */
	--accent-2:#ff7f50; /* Coral */
	--muted:#333333; 
	--card:#fff;
}
```

## Option 3: Moroccan Green & Gold (Traditional)
```css
:root{
	--bg:#faf8f3; 
	--accent:#2d5016; /* Moroccan Green */
	--accent-2:#c9a961; /* Gold */
	--muted:#4a4a4a; 
	--card:#fff;
}
```

## Option 4: Keep Current (Warm Terracotta) - Already Applied ✓
This is your current color scheme - warm and inviting!

## How to Apply:
1. Open `/workspaces/marrakech-real-estate/styles.css`
2. Replace the `:root` section (lines 2-4) with your chosen option
3. Save and push to GitHub
4. Vercel will auto-deploy with new colors

## Add Your Logo:
1. Create or upload your logo as `logo.png` (recommended size: 200x60px)
2. Update the logo section in `index.html`:
```html
<div class="logo">
  <img src="logo.png" alt="Your Company" style="height:40px">
</div>
```

## Custom Font:
Replace 'Roboto' with your preferred font:
```css
font-family: 'Playfair Display', serif; /* Elegant */
font-family: 'Montserrat', sans-serif; /* Modern */
font-family: 'Lora', serif; /* Classic */
```

Add to `<head>` in index.html:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
```

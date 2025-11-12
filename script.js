// Local fallback listings (used if /api/listings is unavailable)
let listings = [
    { id: 1, title: "Modern Apartment in Gueliz", type: "apartment", action: "rent", price: 5000, priceText: "5000 MAD/month", location: "Gueliz", rooms: 2, surface: 80, description: "2-bed, modern amenities.", images: ["https://via.placeholder.com/300x200?text=Apartment+Gueliz"] },
    { id: 2, title: "Luxury Villa in Palmeraie", type: "villa", action: "buy", price: 2500000, priceText: "2,500,000 MAD", location: "Palmeraie", rooms: 4, surface: 300, description: "Pool, garden, 4 beds.", images: ["https://via.placeholder.com/300x200?text=Villa+Palmeraie"] },
    { id: 3, title: "Prime Land in Ourika", type: "land", action: "buy", price: 1000000, priceText: "1,000,000 MAD", location: "Ourika", rooms: 0, surface: 1000, description: "Large plot, development potential.", images: ["https://via.placeholder.com/300x200?text=Land+Ourika"] },
    { id: 4, title: "Secure Garage in Medina", type: "garage", action: "rent", price: 2000, priceText: "2000 MAD/month", location: "Medina", rooms: 0, surface: 20, description: "Historic area parking.", images: ["https://via.placeholder.com/300x200?text=Garage+Medina"] },
    { id: 5, title: "Penthouse in Hivernage", type: "apartment", action: "buy", price: 3500000, priceText: "3,500,000 MAD", location: "Hivernage", rooms: 3, surface: 150, description: "City views, rooftop.", images: ["https://via.placeholder.com/300x200?text=Penthouse+Hivernage"] },
    { id: 6, title: "Townhouse in Bahia", type: "villa", action: "rent", price: 8000, priceText: "8000 MAD/month", location: "Bahia", rooms: 3, surface: 200, description: "Traditional, 3 beds.", images: ["https://via.placeholder.com/300x200?text=Townhouse+Bahia"] }
];

// Try to fetch listings from the API, fall back to the local `listings` if it fails
async function fetchListingsFromApi() {
    try {
        const res = await fetch('/api/listings');
        if (!res.ok) throw new Error('bad response');
        const json = await res.json();
        if (json && json.listings) {
            listings = json.listings;
        }
    } catch (e) {
        // leave fallback listings in place
        console.warn('Could not fetch /api/listings, using fallback data');
    }
}

// Translations
const translations = {
    en: {
        home: "Home", listings: "Listings", contact: "Contact",
        heroTitle: "Find Your Dream Property in Marrakech",
        heroSubtitle: "Rent or buy apartments, villas, lands, and garages with ease.",
        searchPlaceholder: "Search by location or keyword (e.g., Gueliz)", searchBtn: "Search",
        listingsTitle: "Browse Properties", filterType: "All Types", filterAction: "Rent or Buy", applyFilters: "Search",
        mapNote: "Map shows general Marrakech locations. Click markers for details.",
        footer: "© 2025 Marrakech Realty. All rights reserved."
    },
    fr: {
        home: "Accueil", listings: "Annonces", contact: "Contact",
        heroTitle: "Trouvez votre propriété de rêve à Marrakech",
        heroSubtitle: "Louer ou acheter des appartements, villas, terrains et garages facilement.",
        searchPlaceholder: "Rechercher par lieu ou mot-clé (ex: Gueliz)", searchBtn: "Rechercher",
        listingsTitle: "Parcourir les propriétés", filterType: "Tous les types", filterAction: "Louer ou Acheter", applyFilters: "Rechercher",
        mapNote: "La carte montre les emplacements généraux de Marrakech. Cliquez sur les marqueurs pour plus de détails.",

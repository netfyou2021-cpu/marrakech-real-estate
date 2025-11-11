// Sample listings data
const listings = [
    { id: 1, title: "Modern Apartment in Gueliz", type: "apartment", action: "rent", price: 5000, priceText: "5000 MAD/month", location: "Gueliz", rooms: 2, surface: 80, description: "2-bed, modern amenities.", images: ["https://via.placeholder.com/300x200?text=Apartment+Gueliz"] },
    { id: 2, title: "Luxury Villa in Palmeraie", type: "villa", action: "buy", price: 2500000, priceText: "2,500,000 MAD", location: "Palmeraie", rooms: 4, surface: 300, description: "Pool, garden, 4 beds.", images: ["https://via.placeholder.com/300x200?text=Villa+Palmeraie"] },
    { id: 3, title: "Prime Land in Ourika", type: "land", action: "buy", price: 1000000, priceText: "1,000,000 MAD", location: "Ourika", rooms: 0, surface: 1000, description: "Large plot, development potential.", images: ["https://via.placeholder.com/300x200?text=Land+Ourika"] },
    { id: 4, title: "Secure Garage in Medina", type: "garage", action: "rent", price: 2000, priceText: "2000 MAD/month", location: "Medina", rooms: 0, surface: 20, description: "Historic area parking.", images: ["https://via.placeholder.com/300x200?text=Garage+Medina"] },
    { id: 5, title: "Penthouse in Hivernage", type: "apartment", action: "buy", price: 3500000, priceText: "3,500,000 MAD", location: "Hivernage", rooms: 3, surface: 150, description: "City views, rooftop.", images: ["https://via.placeholder.com/300x200?text=Penthouse+Hivernage"] },
    { id: 6, title: "Townhouse in Bahia", type: "villa", action: "rent", price: 8000, priceText: "8000 MAD/month", location: "Bahia", rooms: 3, surface: 200, description: "Traditional, 3 beds.", images: ["https://via.placeholder.com/300x200?text=Townhouse+Bahia"] }
];

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
        footer: "© 2025 Marrakech Realty. Tous droits réservés."
    },
    ar: {
        home: "الرئيسية", listings: "القوائم", contact: "اتصل بنا",
        heroTitle: "اعثر على عقار أحلامك في مراكش",
        heroSubtitle: "استأجر أو اشترِ شققًا، فيلا، أراضي، وجراجات بسهولة.",
        searchPlaceholder: "البحث حسب الموقع أو الكلمة الرئيسية (مثل: كويليز)", searchBtn: "بحث",
        listingsTitle: "تصفح العقارات", filterType: "جميع الأنواع", filterAction: "استأجر أو اشترِ", applyFilters: "بحث",
        mapNote: "الخريطة تظهر مواقع مراكش العامة. انقر على العلامات للتفاصيل.",
        footer: "© 2025 مراكش ريالتي. جميع الحقوق محفوظة."
    }
};

// Language switching
document.getElementById('language-select').addEventListener('change', (e) => {
    const lang = e.target.value;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        el.textContent = translations[lang][key];
        if (el.placeholder) el.placeholder = translations[lang][key];
    });
});

// View toggle
let currentView = 'grid';
document.getElementById('grid-view').addEventListener('click', () => { currentView = 'grid'; toggleView(); loadListings(); });
document.getElementById('list-view').addEventListener('click', () => { currentView = 'list'; toggleView(); loadListings(); });

function toggleView() {
    document.getElementById('grid-view').classList.toggle('active', currentView === 'grid');
    document.getElementById('list-view').classList.toggle('active', currentView === 'list');
}

// Load listings
function loadListings(search = '', typeFilter = 'all', actionFilter = 'all', roomsFilter = 'all', priceFilter = 'all', surfaceFilter = 'all') {
    const grid = document.getElementById('property-grid');
    grid.className = currentView === 'grid' ? 'property-grid' : 'property-list';
    grid.innerHTML = '';
    listings.filter(l => {
        const matchesSearch = search === '' || l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || l.type === typeFilter;
        const matchesAction = actionFilter === 'all' || l.action === actionFilter;
        const matchesRooms = roomsFilter === 'all' || (roomsFilter === '4+' && l.rooms >= 4) || l.rooms == roomsFilter;
        const matchesPrice = priceFilter === 'all' || 
            (priceFilter === '0-10000' && l.price <= 10000) ||
            (priceFilter === '10000-50000' && l.price > 10000 && l.price <= 50000) ||
            (priceFilter === '50000-200000' && l.price > 50000 && l.price <= 200000) ||
            (priceFilter === '200000+' && l.price > 200000);
        const matchesSurface = surfaceFilter === 'all' || 
            (surfaceFilter === '0-50' && l.surface <= 50) ||
            (surfaceFilter === '50-100' && l.surface > 50 && l.surface <= 100) ||
            (surfaceFilter === '100-200' && l.surface > 100 && l.surface <= 200) ||
            (surfaceFilter === '200+' && l.surface > 200);
        return matchesSearch && matchesType && matchesAction && matchesRooms && matchesPrice && matchesSurface;
    }).forEach(l => {
        const cardClass = currentView === 'list' ? 'property-card list' : 'property-card';
        grid.innerHTML += `
            <div class="${cardClass}">
                <img src="${l.images[0]}" alt="${l.title}">
                <div class="content">
                    <h3>${l.title}</h3>
                    <p>${l.priceText} | ${l.location} | ${l.rooms} rooms | ${l.surface} m²</p>
                    <p>${l.description}</p>
                    <a href="#">View Details</a>
                </div>
            </div>
        `;
    });
}

// Initial load
loadListings();

// Apply filters
document.getElementById('apply-filters').addEventListener('click', () => {
    const search = document.getElementById('search-input').value;
    const type = document.getElementById('filter-type').value;
    const action = document.getElementById('filter-action').value;
    const rooms = document.getElementById('filter-rooms').value;
    const price = document.getElementById('filter-price').value;
    const surface = document.getElementById('filter-surface').value;
    loadListings(search, type, action, rooms, price, surface);
});
// ... (listings and translations remain the same)

// Updated loadListings function for flatfox-like filters
function loadListings(search = '', typeFilter = 'all', actionFilter = 'rent', roomsFilter = 'all', priceFilter = 'all', surfaceFilter = 'all') {
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

// Initial load with default rent
loadListings('', 'all', 'rent', 'all', 'all', 'all');

// Action buttons for rent/buy
document.getElementById('rent-btn').addEventListener('click', () => {
    document.getElementById('rent-btn').classList.add('active');
    document.getElementById('buy-btn').classList.remove('active');
    loadListings(document.getElementById('search-input').value, document.getElementById('filter-type').value, 'rent', document.getElementById('filter-rooms').value, document.getElementById('filter-price').value, document.getElementById('filter-surface').value);
});
document.getElementById('buy-btn').addEventListener('click', () => {
    document.getElementById('buy-btn').classList.remove('active');
    document.getElementById('rent-btn').classList.add('active');
    loadListings(document.getElementById('search-input').value, document.getElementById('filter-type').value, 'buy', document.getElementById('filter-rooms').value, document.getElementById('filter-price').value, document.getElementById('filter-surface').value);
});

// Apply filters
document.getElementById('apply-filters').addEventListener('click', () => {
    const search = document.getElementById('search-input').value;
    const type = document.getElementById('filter-type').value;
    const action = document.querySelector('.action-btn.active').getAttribute('data-action');
    const rooms = document.getElementById('filter-rooms').value;
    const price = document.getElementById('filter-price').value;
    const surface = document.getElementById('filter-surface').value;
    loadListings(search, type, action, rooms, price, surface);
});

// View toggle remains the same
// ... (rest of the file remains the same)
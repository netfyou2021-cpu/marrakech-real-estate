let map;
let markers = [];

// Initialize Leaflet Map
function initMap() {
  if (map) return; // Already initialized
  
  map = L.map('map-container').setView([31.6295, -7.9811], 12);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);
  
  // Update map once initialized
  if (listings.length > 0) {
    updateMapMarkers();
  }
}

// Initialize map when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}

// Small frontend for listings — fetches from /api/listings and shows cards + modal
let listings = [];

async function fetchListingsFromApi(params = {}) {
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await fetch('/api/listings' + (qs ? `?${qs}` : ''));
    if (!res.ok) throw new Error('bad response');
    const json = await res.json();
    if (json && Array.isArray(json.listings)) listings = json.listings;
    else listings = json.listings || [];
    return json;
  } catch (e) {
    console.warn('Could not fetch /api/listings, falling back to local data');
    // fallback small dataset
    listings = [
      { id: 1, title: 'Modern Apartment in Gueliz', type: 'apartment', action: 'rent', price: 5000, priceText: '5000 MAD/month', location: 'Gueliz', rooms: 2, surface: 80, description: '2-bed, modern amenities.', images: ['https://via.placeholder.com/600x400?text=Apartment+Gueliz'] },
      { id: 2, title: 'Luxury Villa in Palmeraie', type: 'villa', action: 'buy', price: 2500000, priceText: '2,500,000 MAD', location: 'Palmeraie', rooms: 4, surface: 300, description: 'Pool, garden, 4 beds.', images: ['https://via.placeholder.com/600x400?text=Villa+Palmeraie'] },
      { id: 3, title: 'Prime Land in Ourika', type: 'land', action: 'buy', price: 1000000, priceText: '1,000,000 MAD', location: 'Ourika', rooms: 0, surface: 1000, description: 'Large plot, development potential.', images: ['https://via.placeholder.com/600x400?text=Land+Ourika'] }
    ];
    return { listings };
  }
}

const translations = {
  en: { home: 'Home', listings: 'Listings', contact: 'Contact', heroTitle: 'Find Your Dream Property in Marrakech', heroSubtitle: 'Rent or buy apartments, villas, lands, and garages with ease.', searchPlaceholder: 'Search by location or keyword (e.g., Gueliz)', searchBtn: 'Search', listingsTitle: 'Browse Properties', filterType: 'All Types', filterAction: 'Rent or Buy', applyFilters: 'Search', mapNote: 'Map shows general Marrakech locations. Click markers for details.', footer: '© 2025 Marrakech.Homes. All rights reserved.' },
  fr: { home: 'Accueil', listings: 'Annonces', contact: 'Contact', heroTitle: 'Trouvez votre propriété de rêve à Marrakech', heroSubtitle: 'Louer ou acheter des appartements, villas, terrains et garages facilement.', searchPlaceholder: 'Rechercher par lieu ou mot-clé (ex: Gueliz)', searchBtn: 'Rechercher', listingsTitle: 'Parcourir les propriétés', filterType: 'Tous les types', filterAction: 'Louer ou Acheter', applyFilters: 'Rechercher', mapNote: 'La carte montre les emplacements généraux de Marrakech. Cliquez sur les marqueurs pour plus de détails.', footer: '© 2025 Marrakech.Homes. Tous droits réservés.' },
  ar: { home: 'الرئيسية', listings: 'القوائم', contact: 'اتصل بنا', heroTitle: 'اعثر على عقار أحلامك في مراكش', heroSubtitle: 'استأجر أو اشترِ شققًا، فيلا، أراضي، وجراجات بسهولة.', searchPlaceholder: 'البحث حسب الموقع أو الكلمة الرئيسية (مثل: كويليز)', searchBtn: 'بحث', listingsTitle: 'تصفح العقارات', filterType: 'جميع الأنواع', filterAction: 'استأجر أو اشترِ', applyFilters: 'بحث', mapNote: 'الخريطة تظهر مواقع مراكش العامة. انقر على العلامات للتفاصيل.', footer: '© 2025 Marrakech.Homes. جميع الحقوق محفوظة.' }
};

async function loadI18n() {
  try {
    const res = await fetch('/api/i18n');
    if (res.ok) {
      const payload = await res.json();
      window.SERVER_I18N = payload.ui || {};
    }
  } catch (e) { /* ignore */ }
}

function applyTranslationsFor(lang) {
  const src = (window.SERVER_I18N && window.SERVER_I18N[lang]) ? window.SERVER_I18N[lang] : translations[lang] || translations.en;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (!src[key]) return;
    if (el.placeholder !== undefined && el.tagName.toLowerCase() === 'input') el.placeholder = src[key];
    else el.textContent = src[key];
  });
}

document.getElementById('language-select').addEventListener('change', (e) => applyTranslationsFor(e.target.value));

// View toggle
let currentView = 'grid';
let allCollapsed = false;

document.getElementById('grid-view').addEventListener('click', () => { currentView = 'grid'; toggleView(); renderListings(); });
document.getElementById('list-view').addEventListener('click', () => { currentView = 'list'; toggleView(); renderListings(); });

function toggleView() {
  document.getElementById('grid-view').classList.toggle('active', currentView === 'grid');
  document.getElementById('list-view').classList.toggle('active', currentView === 'list');
}

// Collapse/Expand all functionality
document.getElementById('collapse-all-btn').addEventListener('click', () => {
  allCollapsed = !allCollapsed;
  const btn = document.getElementById('collapse-all-btn');
  const cards = document.querySelectorAll('.property-card');
  
  if (allCollapsed) {
    cards.forEach(card => card.classList.add('collapsed'));
    btn.textContent = '📂 Expand All';
    btn.style.background = '#c14b1a';
    btn.style.color = '#fff';
    btn.style.borderColor = '#c14b1a';
  } else {
    cards.forEach(card => card.classList.remove('collapsed'));
    btn.textContent = '📦 Collapse All';
    btn.style.background = '#f5f5f5';
    btn.style.color = '#666';
    btn.style.borderColor = '#ddd';
  }
});

function formatPrice(l) {
  if (l.priceText) return l.priceText.replace(/MAD/g, 'Dhrs').replace(/€/g, 'Dhrs');
  if (!l.price) return '—';
  if (l.action === 'rent') return `${l.price.toLocaleString()} Dhrs/month`;
  return `${l.price.toLocaleString()} Dhrs`;
}

function openModal(html) {
  const modal = document.getElementById('detail-modal');
  const modalContent = modal.querySelector('.modal-content');
  // Clear existing content except close button
  const closeBtn = modalContent.querySelector('.modal-close');
  modalContent.innerHTML = '';
  if (closeBtn) modalContent.appendChild(closeBtn);
  
  // Add the HTML content
  const temp = document.createElement('div');
  temp.innerHTML = html;
  Array.from(temp.children).forEach(child => modalContent.appendChild(child));
  
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
}
function closeModal() {
  const modal = document.getElementById('detail-modal');
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('open');
}
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('detail-modal').addEventListener('click', (e)=>{ if (e.target.id==='detail-modal') closeModal(); });

function renderListings() {
  const grid = document.getElementById('property-grid');
  grid.className = currentView === 'grid' ? 'property-grid' : 'property-list';
  grid.innerHTML = '';
  
  // Reset collapse state when re-rendering
  allCollapsed = false;
  const btn = document.getElementById('collapse-all-btn');
  if (btn) {
    btn.textContent = '📦 Collapse All';
    btn.style.background = '#f5f5f5';
    btn.style.color = '#666';
    btn.style.borderColor = '#ddd';
  }
  listings.forEach(l => {
    const card = document.createElement('article');
    card.className = 'property-card' + (currentView==='list'? ' list':'');
    
    // Extract location name (first part before comma)
    const locationName = l.location ? l.location.split(',')[0].trim() : 'Marrakech';
    
    // Property type for badge
    const typeLabels = {
      'apartment': 'APARTMENT',
      'villa': 'VILLA',
      'house': 'HOUSE',
      'riad': 'RIAD',
      'land': 'LAND',
      'garage': 'GARAGE'
    };
    const typeLabel = typeLabels[l.type] || l.type.toUpperCase();
    
    // Build meta info array with bed/bath/surface icons
    const metaItems = [];
    if (l.rooms) metaItems.push(`<span class="meta-item">🛏 ${l.rooms}</span>`);
    if (l.bathrooms) metaItems.push(`<span class="meta-item">🚿 ${l.bathrooms}</span>`);
    if (l.surface) metaItems.push(`<span class="meta-item">📐 ${l.surface}m²</span>`);
    
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${l.images && l.images[0] ? l.images[0] : 'https://via.placeholder.com/600x400?text=No+Image'}" alt="${l.title}">
        <div class="price-badge">${formatPrice(l)}</div>
        <div class="type-badge">${typeLabel}</div>
        <div class="location-badge">📍 ${locationName}</div>
      </div>
      <div class="content">
        <h3>${l.title}</h3>
        <div class="meta">${metaItems.join('')}</div>
        <p class="excerpt">${l.description || ''}</p>
      </div>
    `;
    
    // Add click handler to the entire card
    card.addEventListener('click', async () => {
      const id = l.id;
      try {
        const resp = await fetch(`/api/listings/${id}`);
        if (resp.ok) {
          const obj = await resp.json();
          showEnhancedModal(obj);
          return;
        }
      } catch (e) {}
      // fallback to local
      showEnhancedModal(l);
    });
    
    grid.appendChild(card);
  });
}

function showEnhancedModal(property) {
  const locationName = property.location ? property.location.split(',')[0].trim() : 'Marrakech';
  const fullLocation = property.location || 'Marrakech';
  
  // Sample amenities (you can add these to your data later)
  const amenities = ['Infinity Pool', 'Home Cinema', 'Hammam', 'Guesthouse', 'Smart Home', 'Gym', 'Garden', 'Parking'];
  
  const modalHTML = `
    <img src="${property.images && property.images[0] ? property.images[0] : 'https://via.placeholder.com/600x800?text=Property'}" 
         alt="${property.title}" class="modal-image">
    <div class="modal-details">
      <div class="modal-location">📍 ${locationName.toUpperCase()}, MARRAKECH</div>
      <h2 class="modal-title">${property.title}</h2>
      <div class="modal-price">${formatPrice(property)}</div>
      
      <div class="modal-stats">
        ${property.rooms ? `<div class="modal-stat">🛏 <strong>${property.rooms}</strong></div>` : ''}
        ${property.bathrooms ? `<div class="modal-stat">🚿 <strong>${property.bathrooms}</strong></div>` : ''}
        ${property.surface ? `<div class="modal-stat">📐 <strong>${property.surface}</strong>m²</div>` : ''}
      </div>
      
      <div class="modal-section-title">🏠 About this home</div>
      <div class="modal-description">${property.description || 'Stunning property in the heart of Marrakech.'}</div>
      
      <div class="modal-section-title">✨ Amenities</div>
      <div class="modal-amenities">
        ${amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
      </div>
      
      ${property.agent ? `
        <div class="contact-agent">
          <strong>Contact Agent</strong>
          <div>${property.agent.name || 'Real Estate Agent'}</div>
          ${property.agent.phone ? `<div style="color:#c14b1a;margin-top:0.5rem">📞 ${property.agent.phone}</div>` : ''}
        </div>
      ` : ''}
      
      <div class="modal-actions">
        <button class="btn-primary" onclick="scheduleViewing('${property.title}')">
          📅 Schedule Viewing
        </button>
        <button class="btn-secondary" onclick="shareProperty('${property.title}', '${property.id}')">
          🔗 Share
        </button>
      </div>
    </div>
  `;
  
  openModal(modalHTML);
}

async function applyAndLoad() {
  const search = document.getElementById('search-input').value || '';
  const type = document.getElementById('filter-type').value || 'all';
  const action = document.getElementById('filter-action').value || 'all';
  const minPrice = document.getElementById('min-price').value || '';
  const maxPrice = document.getElementById('max-price').value || '';
  const minRooms = document.getElementById('min-rooms').value || '';
  const minSurface = document.getElementById('min-surface').value || '';
  const sort = document.getElementById('sort-by') ? document.getElementById('sort-by').value || 'created_desc' : 'created_desc';
  const params = {};
  if (type && type!=='all') params.type = type;
  if (action && action!=='all') params.action = action;
  if (search) params.q = search;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (minRooms) params.minRooms = minRooms;
  if (minSurface) params.minSurface = minSurface;
  if (sort) params.sort = sort;
  
  console.log('🔍 Searching with params:', params);
  await fetchListingsFromApi(params);
  console.log(`📊 Found ${listings.length} listings`);
  
  renderListings();
  
  // Force map update after rendering with a delay to ensure DOM is ready
  requestAnimationFrame(() => {
    setTimeout(() => {
      console.log('🗺️ Updating map with filtered results...');
      updateMapMarkers();
    }, 200);
  });
}

function updateMapMarkers() {
  // Update map count
  const mapCount = document.getElementById('map-count');
  if (mapCount) {
    mapCount.textContent = listings.length;
  }
  
  // Wait for map to be initialized
  if (!map) {
    console.log('⏳ Waiting for map to load...');
    setTimeout(updateMapMarkers, 500);
    return;
  }
  
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  
  // Location coordinates for Marrakech neighborhoods
  const locationCoords = {
    'Gueliz': {lat: 31.6347, lng: -8.0089},
    'Medina': {lat: 31.6295, lng: -7.9811},
    'Palmeraie': {lat: 31.6692, lng: -8.0428},
    'Hivernage': {lat: 31.6219, lng: -8.0182},
    'Agdal': {lat: 31.6156, lng: -8.0089},
    'Marrakech Centre': {lat: 31.6295, lng: -7.9811},
    'Route de Fes': {lat: 31.6695, lng: -7.9669},
    'Route de Casablanca': {lat: 31.6537, lng: -8.0621},
    'Route de Ouarzazate': {lat: 31.5895, lng: -7.9811},
    'Route de l\'Ourika': {lat: 31.5736, lng: -7.8969},
    'Targa': {lat: 31.6695, lng: -8.0428},
    'Massar': {lat: 31.5895, lng: -8.0089},
    'Sidi Ghanem': {lat: 31.6863, lng: -8.0621},
    'Amerchich': {lat: 31.6537, lng: -7.9669}
  };
  
  // Helper function to find coordinates with flexible matching
  function findCoords(location) {
    if (!location) return null;
    
    // Try exact match first
    if (locationCoords[location]) return locationCoords[location];
    
    // Try partial match (case insensitive, check if location contains neighborhood name)
    const locationLower = location.toLowerCase();
    for (const [key, coords] of Object.entries(locationCoords)) {
      if (locationLower.includes(key.toLowerCase()) || key.toLowerCase().includes(locationLower)) {
        return coords;
      }
    }
    
    return null;
  }
  
  if (listings.length > 0) {
    const bounds = [];
    const locationGroups = {};
    
    // Group listings by location
    listings.forEach(listing => {
      const coords = findCoords(listing.location);
      if (coords) {
        const key = `${coords.lat},${coords.lng}`;
        if (!locationGroups[key]) {
          locationGroups[key] = {
            coords: coords,
            location: listing.location,
            count: 0
          };
        }
        locationGroups[key].count++;
      }
    });
    
    // Create markers for each location group
    Object.values(locationGroups).forEach((group) => {
      const coords = group.coords;
      if (coords) {
        const count = group.count;
        const displayLocation = group.location.split(',')[0].trim(); // Get just the neighborhood name
        
        // Create custom icon with number
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background:#c14b1a;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        
        const marker = L.marker([coords.lat, coords.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<div style="padding:8px"><strong>${displayLocation}</strong><br>${count} ${count === 1 ? 'property' : 'properties'}</div>`);
        
        markers.push(marker);
        bounds.push([coords.lat, coords.lng]);
      }
    });
    
    // Fit map to show all markers
    if (bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      } else {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
      
      console.log(`✅ Map updated with ${markers.length} markers showing ${listings.length} properties`);
      const displayedLocations = Object.values(locationGroups).map(g => g.location.split(',')[0].trim());
      console.log(`📍 Locations: ${displayedLocations.join(', ')}`);
    }
  } else {
    // Reset to default Marrakech view
    map.setView([31.6295, -7.9811], 12);
  }
}

document.getElementById('search-btn').addEventListener('click', applyAndLoad);
document.getElementById('search-input').addEventListener('keypress', (e)=>{ if(e.key==='Enter') applyAndLoad(); });
document.getElementById('filter-type').addEventListener('change', applyAndLoad);
document.getElementById('filter-action').addEventListener('change', applyAndLoad);
document.getElementById('min-price').addEventListener('change', applyAndLoad);
document.getElementById('max-price').addEventListener('change', applyAndLoad);
document.getElementById('min-rooms').addEventListener('change', applyAndLoad);
document.getElementById('min-surface').addEventListener('change', applyAndLoad);
if (document.getElementById('sort-by')) {
  document.getElementById('sort-by').addEventListener('change', applyAndLoad);
}
document.getElementById('language-select').addEventListener('change', (e) => {
  applyTranslationsFor(e.target.value);
});

// Schedule Viewing function
window.scheduleViewing = function(propertyTitle) {
  const message = `Hello! I would like to schedule a viewing for: ${propertyTitle}`;
  const whatsappNumber = '212600123456'; // Update with your WhatsApp number
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
};

// Share Property function
window.shareProperty = function(propertyTitle, propertyId) {
  const url = window.location.href.split('?')[0] + '?property=' + propertyId;
  
  if (navigator.share) {
    navigator.share({
      title: propertyTitle,
      text: `Check out this property: ${propertyTitle}`,
      url: url
    }).catch(() => copyToClipboard(url));
  } else {
    copyToClipboard(url);
  }
};

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('Property link copied to clipboard!');
}

(async ()=>{
  await loadI18n();
  applyTranslationsFor(document.getElementById('language-select').value || 'en');
  await fetchListingsFromApi();
  renderListings();
})();
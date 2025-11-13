// Small frontend for listings — fetches from /api/listings and shows cards + modal
let listings = [];
let allListings = [];
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

function toggleFavorite(id) {
  const idx = favorites.indexOf(id);
  if (idx > -1) {
    favorites.splice(idx, 1);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderListings();
}

function isFavorite(id) {
  return favorites.includes(id);
}

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
  en: { home: 'Home', listings: 'Listings', contact: 'Contact', heroTitle: 'Find Your Dream Property in Marrakech', heroSubtitle: 'Rent or buy apartments, villas, lands, and garages with ease.', searchPlaceholder: 'Search by location or keyword (e.g., Gueliz)', searchBtn: 'Search', listingsTitle: 'Browse Properties', filterType: 'All Types', filterAction: 'Rent or Buy', applyFilters: 'Search', mapNote: 'Map shows general Marrakech locations. Click markers for details.', footer: '© 2025 Atlas Real Estate. All rights reserved.' },
  fr: { home: 'Accueil', listings: 'Annonces', contact: 'Contact', heroTitle: 'Trouvez votre propriété de rêve à Marrakech', heroSubtitle: 'Louer ou acheter des appartements, villas, terrains et garages facilement.', searchPlaceholder: 'Rechercher par lieu ou mot-clé (ex: Gueliz)', searchBtn: 'Rechercher', listingsTitle: 'Parcourir les propriétés', filterType: 'Tous les types', filterAction: 'Louer ou Acheter', applyFilters: 'Rechercher', mapNote: 'La carte montre les emplacements généraux de Marrakech. Cliquez sur les marqueurs pour plus de détails.', footer: '© 2025 Atlas Real Estate. Tous droits réservés.' },
  ar: { home: 'الرئيسية', listings: 'القوائم', contact: 'اتصل بنا', heroTitle: 'اعثر على عقار أحلامك في مراكش', heroSubtitle: 'استأجر أو اشترِ شققًا، فيلا، أراضي، وجراجات بسهولة.', searchPlaceholder: 'البحث حسب الموقع أو الكلمة الرئيسية (مثل: كويليز)', searchBtn: 'بحث', listingsTitle: 'تصفح العقارات', filterType: 'جميع الأنواع', filterAction: 'استأجر أو اشترِ', applyFilters: 'بحث', mapNote: 'الخريطة تظهر مواقع مراكش العامة. انقر على العلامات للتفاصيل.', footer: '© 2025 أطلس ريال إستيت. جميع الحقوق محفوظة.' }
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
document.getElementById('grid-view').addEventListener('click', () => { currentView = 'grid'; toggleView(); renderListings(); });
document.getElementById('list-view').addEventListener('click', () => { currentView = 'list'; toggleView(); renderListings(); });
function toggleView() {
  document.getElementById('grid-view').classList.toggle('active', currentView === 'grid');
  document.getElementById('list-view').classList.toggle('active', currentView === 'list');
}

function formatPrice(l) {
  if (l.priceText) return l.priceText.replace(/MAD/g, 'Dhrs').replace(/€/g, 'Dhrs');
  if (!l.price) return '—';
  if (l.action === 'rent') return `${l.price.toLocaleString()} Dhrs/month`;
  return `${l.price.toLocaleString()} Dhrs`;
}

function openModal(html) {
  const modal = document.getElementById('detail-modal');
  document.getElementById('modal-body').innerHTML = html;
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
  const favoritesFilter = document.getElementById('favorites-filter').value;
  const displayListings = favoritesFilter === 'favorites' ? listings.filter(l => isFavorite(l.id)) : listings;
  displayListings.forEach(l => {
    const card = document.createElement('article');
    card.className = 'property-card' + (currentView==='list'? ' list':'');
    const roomsInfo = [];
    if (l.rooms) roomsInfo.push(`🛏️ ${l.rooms}`);
    if (l.bathrooms) roomsInfo.push(`🚿 ${l.bathrooms}`);
    if (l.surface) roomsInfo.push(`📐 ${l.surface}m²`);
    card.innerHTML = `
      <button class="favorite-btn ${isFavorite(l.id) ? 'active' : ''}" data-id="${l.id}" onclick="event.stopPropagation(); toggleFavorite(${l.id})">
        ${isFavorite(l.id) ? '♥' : '♡'}
      </button>
      <img src="${l.images && l.images[0] ? l.images[0] : 'https://via.placeholder.com/600x400?text=No+Image'}" alt="${l.title}">
      <div class="content">
        <h3>${l.title}</h3>
        <p class="location">📍 ${l.location || ''}</p>
        <p class="price-tag">${formatPrice(l)}</p>
        <p class="meta">${roomsInfo.join(' · ')}</p>
        <p class="excerpt">${(l.description || '').substring(0, 120)}${l.description && l.description.length > 120 ? '...' : ''}</p>
        <div class="actions"><button data-id="${l.id}" class="details-btn">View Details</button></div>
      </div>
    `;
    grid.appendChild(card);
  });
  document.querySelectorAll('.details-btn').forEach(b => b.addEventListener('click', async (e)=>{
    const id = e.currentTarget.getAttribute('data-id');
    // try fetch detail from API
    try {
      const resp = await fetch(`/api/listings/${id}`);
      if (resp.ok) {
        const obj = await resp.json();
        const detailRooms = [];
        if (obj.rooms) detailRooms.push(`🛏️ ${obj.rooms} rooms`);
        if (obj.bathrooms) detailRooms.push(`🚿 ${obj.bathrooms} bathrooms`);
        if (obj.surface) detailRooms.push(`📐 ${obj.surface}m²`);
        openModal(`<h2>${obj.title}</h2><p class="modal-meta">📍 ${obj.location}</p><p class="modal-price">${formatPrice(obj)}</p><p class="modal-meta">${detailRooms.join(' · ')}</p><img src="${obj.images && obj.images[0] ? obj.images[0] : 'https://via.placeholder.com/800x400?text=No+Image'}" style="width:100%;height:auto;margin:0.5rem 0;border-radius:8px;"/><p style="margin:1rem 0">${obj.description || ''}</p>${obj.agent ? `<div style="background:#f5f5f5;padding:1rem;border-radius:6px;margin-top:1rem"><strong>Contact Agent:</strong><br/>${obj.agent.name || ''} ${obj.agent.phone ? '· ' + obj.agent.phone : ''}</div>` : ''}`);
        return;
      }
    } catch (e) {}
    // fallback to local
    const obj = listings.find(x=>String(x.id)===String(id));
    if (obj) openModal(`<h2>${obj.title}</h2><p class="modal-meta">${formatPrice(obj)} · ${obj.location}</p><img src="${obj.images && obj.images[0] ? obj.images[0] : 'https://via.placeholder.com/800x400?text=No+Image'}" style="width:100%;height:auto;margin:0.5rem 0;"/><p>${obj.description || ''}</p><pre>${JSON.stringify(obj.agent||{}, null, 2)}</pre>`);
  }));
}

async function applyAndLoad() {
  const search = document.getElementById('search-input').value || '';
  const type = document.getElementById('filter-type').value || 'all';
  const minPrice = document.getElementById('min-price').value || '';
  const minRooms = document.getElementById('min-rooms').value || '';
  const minSurface = document.getElementById('min-surface').value || '';
  const sort = document.getElementById('sort-by') ? document.getElementById('sort-by').value || 'created_desc' : 'created_desc';
  const params = {};
  if (type && type!=='all') params.type = type;
  if (search) params.q = search;
  if (minPrice) params.minPrice = minPrice;
  if (minRooms) params.minRooms = minRooms;
  if (minSurface) params.minSurface = minSurface;
  if (sort) params.sort = sort;
  await fetchListingsFromApi(params);
  renderListings();
  updateMapMarkers();
}

function updateMapMarkers() {
  // Update map to show filtered listings
  // Note: For production, integrate Google Maps API to add dynamic markers
  // Marrakech neighborhood coordinates:
  // Gueliz: 31.6347, -8.0089 | Medina: 31.6295, -7.9811
  // Palmeraie: 31.6692, -8.0428 | Hivernage: 31.6219, -8.0182
  const mapNote = document.querySelector('.map p');
  if (mapNote && listings.length > 0) {
    mapNote.textContent = `Showing ${listings.length} ${listings.length === 1 ? 'property' : 'properties'} on map`;
  }
}

document.getElementById('search-btn').addEventListener('click', applyAndLoad);
document.getElementById('filter-type').addEventListener('change', applyAndLoad);
document.getElementById('favorites-filter').addEventListener('change', renderListings);
document.getElementById('min-price').addEventListener('change', applyAndLoad);
document.getElementById('min-rooms').addEventListener('change', applyAndLoad);
document.getElementById('min-surface').addEventListener('change', applyAndLoad);
if (document.getElementById('sort-by')) {
  document.getElementById('sort-by').addEventListener('change', applyAndLoad);
}
window.toggleFavorite = toggleFavorite;
document.getElementById('language-select').addEventListener('change', (e) => {
  applyTranslationsFor(e.target.value);
});

(async ()=>{
  await loadI18n();
  applyTranslationsFor(document.getElementById('language-select').value || 'en');
  await fetchListingsFromApi();
  renderListings();
})();
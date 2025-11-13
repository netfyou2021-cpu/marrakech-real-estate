// Use a dependency-free node http server with JSON-backed dataset
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const ADMIN = process.env.ADMIN_TOKEN || 'dev-token';

function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeJSON(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const LISTINGS_FILE = path.join(DATA_DIR, 'listings.json');
if (!fs.existsSync(LISTINGS_FILE)) {
  // seed
  const seed = [
    {
      id: 1,
      title: 'Exquisite Riad in the Heart of Medina',
      type: 'apartment',
      action: 'buy',
      price: 850000,
      priceText: '€850,000',
      location: '12 Derb Lalla Azzouna, Medina, Marrakech',
      rooms: 5,
      bathrooms: 6,
      surface: 320,
      description: 'Stunning traditional riad in the historic Medina. Beautifully restored with authentic Moroccan craftsmanship, rooftop terrace, courtyard with fountain, and modern amenities.',
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
      agent: { name: 'Fatima A.', phone: '+212 600 123 456' },
      created_at: Date.now()
    },
    {
      id: 2,
      title: 'Modern Villa in Palmeraie',
      type: 'villa',
      action: 'buy',
      price: 1200000,
      priceText: '€1,200,000',
      location: 'Route de Bab Atlas, Palmeraie, Marrakech',
      rooms: 6,
      bathrooms: 7,
      surface: 750,
      description: 'Contemporary luxury villa in prestigious Palmeraie. Features include infinity pool, landscaped gardens, home cinema, gym, and stunning Atlas mountain views.',
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
      agent: { name: 'Youssef K.', phone: '+212 661 234 567' },
      created_at: Date.now()
    },
    {
      id: 3,
      title: 'Elegant Apartment in Gueliz',
      type: 'apartment',
      action: 'rent',
      price: 8500,
      priceText: '8,500 MAD/month',
      location: 'Avenue Mohammed V, Gueliz, Marrakech',
      rooms: 3,
      bathrooms: 2,
      surface: 145,
      description: 'Modern 3-bedroom apartment in the heart of Gueliz. Walking distance to restaurants, shops, and cafes. Fully furnished with contemporary design.',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      agent: { name: 'Leila B.', phone: '+212 600 111 222' },
      created_at: Date.now()
    },
    {
      id: 4,
      title: 'Luxury Penthouse in Hivernage',
      type: 'apartment',
      action: 'buy',
      price: 2800000,
      priceText: '2,800,000 MAD',
      location: 'Hivernage, Marrakech',
      rooms: 4,
      bathrooms: 3,
      surface: 280,
      description: 'Exclusive penthouse with panoramic city and Atlas views. Private rooftop terrace, premium finishes, and resort-style amenities.',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
      agent: { name: 'Karim M.', phone: '+212 662 345 678' },
      created_at: Date.now()
    },
    {
      id: 5,
      title: 'Charming Villa in Route de Fes',
      type: 'villa',
      action: 'rent',
      price: 25000,
      priceText: '25,000 MAD/month',
      location: 'Route de Fes, Marrakech',
      rooms: 5,
      bathrooms: 4,
      surface: 450,
      description: 'Beautiful traditional villa with modern comforts. Private pool, lush gardens, spacious living areas, and staff quarters.',
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
      agent: { name: 'Amina S.', phone: '+212 670 987 654' },
      created_at: Date.now()
    },
    {
      id: 6,
      title: 'Contemporary Townhouse in Targa',
      type: 'villa',
      action: 'buy',
      price: 1650000,
      priceText: '1,650,000 MAD',
      location: 'Targa, Marrakech',
      rooms: 4,
      bathrooms: 3,
      surface: 320,
      description: 'Modern townhouse in secure residential community. Open-plan living, private garden, garage, and close to international schools.',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
      agent: { name: 'Hassan R.', phone: '+212 655 432 109' },
      created_at: Date.now()
    }
  ];
  writeJSON(LISTINGS_FILE, seed);
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
    const index = path.join(ROOT, 'index.html');
    if (fs.existsSync(index)) {
      const html = fs.readFileSync(index, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'index.html not found' }));
  }

  // static file
  const filePath = path.join(ROOT, decodeURIComponent(url.replace(/^\//, '')));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const type = ({ '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg' }[ext] || 'application/octet-stream');
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': type });
    return res.end(data);
  }

  // API: GET listings (supports filters, pagination and basic sorting)
  if (req.method === 'GET' && url === '/api/listings') {
    const q = new URL(req.url, `http://localhost:${PORT}`).searchParams;
    const type = q.get('type');
    const action = q.get('action');
    const search = q.get('q');
    const minPrice = q.get('minPrice');
    const maxPrice = q.get('maxPrice');
    const page = Math.max(1, Number(q.get('page') || 1));
    const perPage = Math.max(1, Math.min(100, Number(q.get('perPage') || 20)));
    const sort = q.get('sort'); // price_asc, price_desc, created_desc
    let items = readJSON(LISTINGS_FILE) || [];
    if (type && type !== 'all') items = items.filter(i => i.type === type);
    if (action && action !== 'all') items = items.filter(i => i.action === action);
    if (minPrice) items = items.filter(i => (i.price||0) >= Number(minPrice));
    if (maxPrice) items = items.filter(i => (i.price||0) <= Number(maxPrice));
    if (search) items = items.filter(i => (i.title||'').toLowerCase().includes(search.toLowerCase()) || (i.location||'').toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price_asc') items.sort((a,b)=> (a.price||0)-(b.price||0));
    if (sort === 'price_desc') items.sort((a,b)=> (b.price||0)-(a.price||0));
    if (sort === 'created_desc') items.sort((a,b)=> (b.created_at||0)-(a.created_at||0));
    const total = items.length;
    const start = (page-1)*perPage;
    const pageItems = items.slice(start, start+perPage);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' });
    return res.end(JSON.stringify({ listings: pageItems, total, page, perPage }));
  }

  // GET a listing
  if (req.method === 'GET' && url.startsWith('/api/listings/')) {
    const id = parseInt(url.split('/').pop(), 10);
    const items = readJSON(LISTINGS_FILE) || [];
    const it = items.find(x => x.id === id);
    if (!it) { res.writeHead(404, {'Content-Type':'application/json'}); return res.end(JSON.stringify({ error: 'not found' })); }
    res.writeHead(200, {'Content-Type':'application/json'}); return res.end(JSON.stringify(it));
  }

  // GET i18n
  if (req.method === 'GET' && url === '/api/i18n') {
    const i18n = readJSON(path.join(ROOT, 'i18n.json')) || {};
    res.writeHead(200, {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}); return res.end(JSON.stringify(i18n));
  }

  // POST i18n (admin)
  if (req.method === 'POST' && url === '/api/i18n') {
    const token = req.headers['x-admin-token'];
    if (!token || token !== ADMIN) { res.writeHead(401, {'Content-Type':'application/json'}); return res.end(JSON.stringify({ error:'unauthorized' })); }
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const obj = JSON.parse(body);
        const i18nFile = path.join(ROOT, 'i18n.json');
        const backups = path.join(ROOT, 'data', 'i18n-backups');
        if (!fs.existsSync(backups)) fs.mkdirSync(backups, { recursive: true });
        if (fs.existsSync(i18nFile)) fs.copyFileSync(i18nFile, path.join(backups, `i18n-${Date.now()}.json`));
  writeJSON(i18nFile, obj);
  res.writeHead(200, {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}); return res.end(JSON.stringify(obj));
      } catch (e) {
        res.writeHead(400, {'Content-Type':'application/json'}); return res.end(JSON.stringify({ error: 'invalid json' }));
      }
    });
    return;
  }

  // POST / PUT / DELETE listings (admin)
  if ((req.method === 'POST' && url === '/api/listings') || (req.method === 'PUT' && url.startsWith('/api/listings/')) || (req.method === 'DELETE' && url.startsWith('/api/listings/'))) {
    const token = req.headers['x-admin-token'];
    if (!token || token !== ADMIN) { res.writeHead(401, {'Content-Type':'application/json'}); return res.end(JSON.stringify({ error:'unauthorized' })); }
    let items = readJSON(LISTINGS_FILE) || [];
    if (req.method === 'POST') {
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        try {
          const obj = JSON.parse(body);
          const id = items.length ? Math.max(...items.map(i=>i.id)) + 1 : 1;
          obj.id = id; obj.created_at = Date.now();
          items.unshift(obj);
          writeJSON(LISTINGS_FILE, items);
          res.writeHead(201, {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}); return res.end(JSON.stringify(obj));
        } catch (e) { res.writeHead(400, {'Content-Type':'application/json'}); return res.end(JSON.stringify({ error:'invalid json' })); }
      });
      return;
    }
    if (req.method === 'PUT') {
      const id = parseInt(url.split('/').pop(),10);
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        try {
          const obj = JSON.parse(body);
          const idx = items.findIndex(i=>i.id===id);
          if (idx === -1) { res.writeHead(404, {'Content-Type':'application/json'}); return res.end(JSON.stringify({ error:'not found' })); }
          items[idx] = { ...items[idx], ...obj };
          writeJSON(LISTINGS_FILE, items);
          res.writeHead(200, {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}); return res.end(JSON.stringify(items[idx]));
        } catch (e) { res.writeHead(400, {'Content-Type':'application/json'}); return res.end(JSON.stringify({ error:'invalid json' })); }
      });
      return;
    }
    if (req.method === 'DELETE') {
      const id = parseInt(url.split('/').pop(),10);
      items = items.filter(i=>i.id!==id);
      writeJSON(LISTINGS_FILE, items);
      res.writeHead(200, {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}); return res.end(JSON.stringify({ ok:true }));
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

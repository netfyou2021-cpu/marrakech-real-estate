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
      title: 'Modern Apartment in Gueliz',
      type: 'apartment',
      action: 'rent',
      price: 5000,
      priceText: '5000 MAD/month',
      location: 'Gueliz',
      rooms: 2,
      surface: 80,
      description: 'Bright 2-bedroom apartment in the heart of Gueliz — walking distance to cafes, secure entry, modern kitchen.',
      images: ['images/apartment_gueliz.jpg'],
      agent: { name: 'Leila B.', phone: '+212 600 111 222' },
      created_at: Date.now()
    },
    {
      id: 2,
      title: 'Luxury Villa in Palmeraie',
      type: 'villa',
      action: 'buy',
      price: 2500000,
      priceText: '2,500,000 MAD',
      location: 'Palmeraie',
      rooms: 6,
      surface: 450,
      description: 'Private villa with infinity pool, mature gardens and guest house.',
      images: ['images/villa_palmeraie_1.jpg','images/villa_palmeraie_2.jpg'],
      agent: { name: 'Youssef' },
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

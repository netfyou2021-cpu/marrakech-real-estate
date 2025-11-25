// Use a dependency-free node http server with JSON-backed dataset
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Try to import Neon database driver
let sql;
let useDatabase = false;
try {
  const { neon } = require('@neondatabase/serverless');
  // Check for database URL (Neon provides multiple URL formats)
  const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
  
  if (databaseUrl) {
    sql = neon(databaseUrl);
    useDatabase = true;
    console.log('✅ Using Neon database');
  } else {
    console.log('ℹ️ Using in-memory storage (database not configured)');
  }
} catch (e) {
  console.error('Database import error:', e.message);
  console.log('ℹ️ Using in-memory storage (local development mode)');
  sql = null;
}

// Load .env file if it exists
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
} catch (e) { /* ignore */ }

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
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// In-memory stores for Vercel (filesystem is read-only in serverless)
let usersStore = [];
let sessionsStore = [];

// Try to load initial users from file (local dev) or use in-memory (production)
try {
  if (fs.existsSync(USERS_FILE)) {
    usersStore = readJSON(USERS_FILE) || [];
  }
} catch (e) {
  console.log('Using in-memory user storage (production mode)');
}

// Auth helpers
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'atlas-salt').digest('hex');
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function getSession(token) {
  if (useDatabase) {
    try {
      const result = await sql`
        SELECT * FROM sessions 
        WHERE token = ${token} AND expires_at > NOW()
        LIMIT 1
      `;
      return result.rows[0] || null;
    } catch (e) {
      console.error('Session lookup error:', e);
      return null;
    }
  } else {
    // Fallback to in-memory
    const session = sessionsStore.find(s => s.token === token && s.expiresAt > Date.now());
    return session;
  }
}

async function createSession(userId) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  if (useDatabase) {
    try {
      await sql`
        INSERT INTO sessions (token, user_id, expires_at)
        VALUES (${token}, ${userId}, ${expiresAt})
      `;
    } catch (e) {
      console.error('Session creation error:', e);
    }
  } else {
    // Fallback to in-memory
    sessionsStore.push({
      token,
      userId,
      user_id: userId,
      createdAt: Date.now(),
      expiresAt: expiresAt.getTime()
    });
  }
  
  return token;
}

async function clearExpiredSessions() {
  if (!useDatabase) {
    sessionsStore = sessionsStore.filter(s => s.expiresAt > Date.now());
  }
  // Database auto-cleans via query constraints
}

async function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  const sessionToken = cookies.split(';').find(c => c.trim().startsWith('session='));
  if (!sessionToken) return false;
  const token = sessionToken.split('=')[1];
  const session = await getSession(token);
  return !!session;
}

if (!fs.existsSync(LISTINGS_FILE)) {
  // seed
  const seed = [
    {
      id: 1,
      title: 'Exquisite Riad in the Heart of Medina',
      type: 'apartment',
      action: 'buy',
      price: 8500000,
      priceText: '8,500,000 Dhrs',
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
      price: 12000000,
      priceText: '12,000,000 Dhrs',
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
      priceText: '8,500 Dhrs/month',
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
      priceText: '2,800,000 Dhrs',
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
      priceText: '25,000 Dhrs/month',
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
      priceText: '1,650,000 Dhrs',
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

const server = http.createServer(async (req, res) => {
  try {
    const url = req.url.split('?')[0];
    
    // Clear expired sessions periodically
    if (Math.random() < 0.1) await clearExpiredSessions();

  // Auth endpoints
  // POST /api/auth/register
  if (req.method === 'POST' && url === '/api/auth/register') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { name, email, password } = JSON.parse(body);
        
        if (!name || !email || !password) {
          res.writeHead(400, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({ error: 'Name, email, and password are required' }));
        }
        
        if (password.length < 6) {
          res.writeHead(400, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({ error: 'Password must be at least 6 characters' }));
        }
        
        if (useDatabase) {
          // Check if email exists
          const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
          if (existing.rows.length > 0) {
            res.writeHead(400, {'Content-Type':'application/json'});
            return res.end(JSON.stringify({ error: 'Email already registered' }));
          }
          
          // Insert new user
          const result = await sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${name}, ${email}, ${hashPassword(password)}, 'admin')
            RETURNING id
          `;
          
          res.writeHead(201, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({ success: true, userId: result.rows[0].id }));
        } else {
          // Fallback to in-memory
          if (usersStore.find(u => u.email === email)) {
            res.writeHead(400, {'Content-Type':'application/json'});
            return res.end(JSON.stringify({ error: 'Email already registered' }));
          }
          
          const user = {
            id: usersStore.length ? Math.max(...usersStore.map(u => u.id)) + 1 : 1,
            name,
            email,
            password: hashPassword(password),
            createdAt: Date.now(),
            role: 'admin'
          };
          
          usersStore.push(user);
          
          res.writeHead(201, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({ success: true, userId: user.id }));
        }
      } catch (e) {
        console.error('Registration error:', e);
        res.writeHead(400, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  // POST /api/auth/login
  if (req.method === 'POST' && url === '/api/auth/login') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        
        if (!email || !password) {
          res.writeHead(400, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({ error: 'Email and password are required' }));
        }
        
        let user;
        if (useDatabase) {
          const result = await sql`SELECT * FROM users WHERE email = ${email}`;
          if (result.rows.length === 0) {
            res.writeHead(401, {'Content-Type':'application/json'});
            return res.end(JSON.stringify({ error: 'Invalid email or password' }));
          }
          user = result.rows[0];
        } else {
          user = usersStore.find(u => u.email === email);
          if (!user) {
            res.writeHead(401, {'Content-Type':'application/json'});
            return res.end(JSON.stringify({ error: 'Invalid email or password' }));
          }
        }
        
        if (user.password !== hashPassword(password)) {
          res.writeHead(401, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({ error: 'Invalid email or password' }));
        }
        
        const token = await createSession(user.id);
        
        res.writeHead(200, {
          'Content-Type':'application/json',
          'Set-Cookie': `session=${token}; HttpOnly; Path=/; Max-Age=${7*24*60*60}; SameSite=Strict`
        });
        return res.end(JSON.stringify({ success: true, user: { id: user.id, name: user.name, email: user.email } }));
      } catch (e) {
        console.error('Login error:', e);
        res.writeHead(400, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  // GET /api/auth/me
  if (req.method === 'GET' && url === '/api/auth/me') {
    const cookies = req.headers.cookie || '';
    const sessionToken = cookies.split(';').find(c => c.trim().startsWith('session='));
    
    if (!sessionToken) {
      res.writeHead(401, {'Content-Type':'application/json'});
      return res.end(JSON.stringify({ error: 'Not authenticated' }));
    }
    
    const token = sessionToken.split('=')[1];
    
    try {
      const session = await getSession(token);
      
      if (!session) {
        res.writeHead(401, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ error: 'Invalid session' }));
      }
      
      let user;
      if (useDatabase) {
        const result = await sql`SELECT id, name, email, role FROM users WHERE id = ${session.userId}`;
        if (result.rows.length === 0) {
          res.writeHead(401, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({ error: 'User not found' }));
        }
        user = result.rows[0];
      } else {
        user = usersStore.find(u => u.id === session.userId);
        if (!user) {
          res.writeHead(401, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({ error: 'User not found' }));
        }
      }
      
      res.writeHead(200, {'Content-Type':'application/json'});
      return res.end(JSON.stringify({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }));
    } catch (e) {
      console.error('Auth check error:', e);
      res.writeHead(500, {'Content-Type':'application/json'});
      return res.end(JSON.stringify({ error: 'Server error' }));
    }
  }

  // POST /api/auth/logout
  if (req.method === 'POST' && url === '/api/auth/logout') {
    const cookies = req.headers.cookie || '';
    const sessionToken = cookies.split(';').find(c => c.trim().startsWith('session='));
    
    if (sessionToken) {
      const token = sessionToken.split('=')[1];
      
      try {
        if (useDatabase) {
          await sql`DELETE FROM sessions WHERE token = ${token}`;
        } else {
          sessionsStore = sessionsStore.filter(s => s.token !== token);
        }
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    
    res.writeHead(200, {
      'Content-Type':'application/json',
      'Set-Cookie': 'session=; HttpOnly; Path=/; Max-Age=0'
    });
    return res.end(JSON.stringify({ success: true }));
  }

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

  // Protect admin.html with session auth
  if (req.method === 'GET' && url === '/admin.html') {
    const cookies = req.headers.cookie || '';
    const sessionToken = cookies.split(';').find(c => c.trim().startsWith('session='));
    
    if (!sessionToken) {
      res.writeHead(302, { 'Location': '/auth.html' });
      return res.end();
    }
    
    const token = sessionToken.split('=')[1];
    
    try {
      const session = await getSession(token);
      
      if (!session) {
        res.writeHead(302, { 'Location': '/auth.html' });
        return res.end();
      }
      
      const adminPath = path.join(ROOT, 'admin.html');
      if (fs.existsSync(adminPath)) {
        const html = fs.readFileSync(adminPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    } catch (e) {
      console.error('Admin auth error:', e);
      res.writeHead(302, { 'Location': '/auth.html' });
      return res.end();
    }
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
    const minRooms = q.get('minRooms');
    const minSurface = q.get('minSurface');
    const page = Math.max(1, Number(q.get('page') || 1));
    const perPage = Math.max(1, Math.min(100, Number(q.get('perPage') || 20)));
    const sort = q.get('sort'); // price_asc, price_desc, created_desc
    let items = readJSON(LISTINGS_FILE) || [];
    if (type && type !== 'all') items = items.filter(i => i.type === type);
    if (action && action !== 'all') items = items.filter(i => i.action === action);
    if (minPrice) items = items.filter(i => (i.price||0) >= Number(minPrice));
    if (maxPrice) items = items.filter(i => (i.price||0) <= Number(maxPrice));
    if (minRooms) items = items.filter(i => (i.rooms||0) >= Number(minRooms));
    if (minSurface) items = items.filter(i => (i.surface||0) >= Number(minSurface));
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
    const authed = await isAuthenticated(req);
    if (!authed) { res.writeHead(401, {'Content-Type':'application/json'}); return res.end(JSON.stringify({ error:'unauthorized' })); }
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
    const authed = await isAuthenticated(req);
    if (!authed) { res.writeHead(401, {'Content-Type':'application/json'}); return res.end(JSON.stringify({ error:'unauthorized' })); }
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
  } catch (error) {
    console.error('Server error:', error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
});

// For Vercel serverless - export the handler function
module.exports = server;

// Local development
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

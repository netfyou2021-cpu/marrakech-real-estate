/*
  Express + SQLite server (Option B)

  This file provides a production-like backend using Express and
  better-sqlite3. It is provided as an alternative server to run
  locally if you want a real database. To use it:

    1. npm install
    2. node server_sqlite.js

  Note: this workspace may not allow native builds. If `npm install`
  fails, use the lightweight `node server.js` JSON-backed server that
  is already included and running.
*/

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3001; // choose different port to run side-by-side
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-token';

app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname)));

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'listings.sqlite');
const db = new Database(DB_PATH);

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      type TEXT,
      action TEXT,
      price INTEGER,
      priceText TEXT,
      location TEXT,
      rooms INTEGER,
      surface INTEGER,
      description TEXT,
      images TEXT,
      agent TEXT,
      created_at INTEGER
    );
  `);
}

init();

app.get('/api/listings', (req, res) => {
  const rows = db.prepare('SELECT * FROM listings ORDER BY created_at DESC').all();
  const out = rows.map(r => ({ ...r, images: JSON.parse(r.images || '[]'), agent: JSON.parse(r.agent || '{}') }));
  res.json({ listings: out });
});

app.post('/api/listings', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_TOKEN) return res.status(401).json({ error: 'unauthorized' });
  const data = req.body;
  const stmt = db.prepare('INSERT INTO listings (title,type,action,price,priceText,location,rooms,surface,description,images,agent,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
  const info = stmt.run(data.title, data.type, data.action, data.price||0, data.priceText||'', data.location||'', data.rooms||0, data.surface||0, data.description||'', JSON.stringify(data.images||[]), JSON.stringify(data.agent||{}), Date.now());
  const row = db.prepare('SELECT * FROM listings WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ ...row, images: JSON.parse(row.images || '[]'), agent: JSON.parse(row.agent || '{}') });
});

app.listen(PORT, () => console.log(`Express+SQLite server running on http://localhost:${PORT}`));

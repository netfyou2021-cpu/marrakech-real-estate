# Marrakech Real Estate — Local Development

This workspace provides two server options so you can preview and develop a real-estate site locally.

Option A — Lightweight JSON server (fast, no native deps)
- file: `server.js`
- runs with: `node server.js`
- port: 3000 (default)
- Features: serves `index.html`, static files, and simple JSON-backed APIs: `/api/listings`, `/api/i18n`. Includes admin endpoints protected by `x-admin-token: dev-token`.

Use this if you want a fast preview without installing native packages.

Option B — Express + SQLite (production-like)
- file: `server_sqlite.js`
- requires: `npm install` (installs `express`, `better-sqlite3`, etc.)
- runs with: `node server_sqlite.js`
- port: 3001 (default)

Notes:
- If `npm install` fails (native build environment restrictions), continue using Option A.
- `server_sqlite.js` seeds a SQLite DB and exposes CRUD endpoints similar to Option A.

Frontend
- Edit `index.html`, `script.js`, and `styles.css` to change the UI. `script.js` now tries to fetch `/api/listings` and `/api/i18n` and falls back to built-in data.

Run (Option A):
```bash
node server.js
# then open http://localhost:3000
```

Run (Option B):
```bash
npm install
node server_sqlite.js
# then open http://localhost:3001
```

Admin API
- Protected by header: `x-admin-token: dev-token` (set `ADMIN_TOKEN` env var to change)
- Example: update i18n
  curl -X POST -H "Content-Type: application/json" -H "x-admin-token: dev-token" --data @i18n.json http://localhost:3000/api/i18n

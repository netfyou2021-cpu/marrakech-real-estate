# Database Setup Guide

Your website now uses **Vercel Postgres** for persistent user storage instead of in-memory storage. This ensures that user accounts persist across deployments and serverless function restarts.

## Setup Steps

### 1. Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `marrakech-real-estate` project
3. Click on **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a database name (e.g., `marrakech-users`)
7. Select your region (choose closest to Morocco/Europe)
8. Click **Create**

Vercel will automatically inject the necessary environment variables into your project.

### 2. Initialize Database Tables

After creating the database, you need to create the required tables.

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run the setup script
node setup-db.js
```

**Option B: Using Vercel Dashboard SQL Editor**

1. In Vercel dashboard, go to **Storage** > Your Postgres database
2. Click **Query** tab
3. Copy and paste the SQL from `setup-db.js`:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_users_email ON users(email);
```

4. Click **Run Query**

### 3. Deploy Changes

```bash
git add .
git commit -m "Add Vercel Postgres for persistent user storage"
git push
```

Vercel will automatically redeploy your site with database support.

### 4. Test Registration

After deployment (takes ~1 minute):

1. Visit your site: https://marrakech-real-estate.vercel.app/auth.html
2. Try registering a new account
3. You should now see "Registration successful!"

## How It Works

- **Automatic Fallback**: If the database is not configured, the server automatically falls back to in-memory storage (works but doesn't persist)
- **Environment Detection**: The server checks for `POSTGRES_URL` environment variable
- **Session Management**: Sessions are stored in the database with automatic expiration
- **Security**: Passwords are hashed with SHA-256, sessions use secure HTTP-only cookies

## Database Schema

### Users Table
- `id`: Auto-incrementing primary key
- `name`: User's full name
- `email`: Unique email address (used for login)
- `password`: SHA-256 hashed password
- `role`: User role (default: 'admin')
- `created_at`: Account creation timestamp

### Sessions Table
- `id`: Auto-incrementing primary key
- `token`: Unique session token (64-char hex string)
- `user_id`: Foreign key to users table
- `created_at`: Session creation timestamp
- `expires_at`: Session expiration (7 days from creation)

## Troubleshooting

**Issue**: "Cannot find module '@vercel/postgres'"
- **Solution**: Run `npm install` to install dependencies

**Issue**: Registration still shows "Invalid request"
- **Solution**: Make sure database tables are created (step 2) and deployment completed (step 3)

**Issue**: Database connection errors in logs
- **Solution**: Check that Postgres database is created in Vercel dashboard and environment variables are populated

## Migration Notes

- Old in-memory user data is not preserved (only existed during function execution)
- First user to register after database setup will be the admin
- All future registrations will persist across deployments

## Local Development

For local testing with database:

1. Get your Vercel Postgres credentials from dashboard
2. Create `.env.local` file:
   ```
   POSTGRES_URL="your-connection-string"
   ```
3. Run: `npm install`
4. Run: `node server.js`

The server will use database if available, otherwise fall back to in-memory storage.

# MongoDB Atlas Setup Guide

## Quick Setup Steps

### 1. Create MongoDB Atlas Account (Free)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account (no credit card required)
3. Create a new cluster (choose FREE tier - M0)
4. Choose a cloud provider and region (closest to you)

### 2. Configure Database Access

1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create username and password (save these!)
5. Set privileges to **Atlas admin** or **Read and write to any database**
6. Click **Add User**

### 3. Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development) or add your IP
4. Click **Confirm**

### 4. Get Connection String

1. Go to **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5. Update Backend Configuration

Edit `backend/.env` file:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/weather_db?retryWrites=true&w=majority
MONGODB_DB_NAME=weather_db
```

**Important:** Replace:
- `YOUR_USERNAME` with your database username
- `YOUR_PASSWORD` with your database password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Add `/weather_db` before the `?` to specify the database name

### 6. Test Connection

Start your backend:
```bash
cd backend
source venv/bin/activate
python run.py
```

You should see: `✓ Connected to MongoDB: weather_db`

## Example .env File

```env
# MongoDB Configuration (Atlas)
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/weather_db?retryWrites=true&w=majority
MONGODB_DB_NAME=weather_db

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Scraper Configuration
SCRAPER_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36

# Optional: Cities to scrape daily
SCRAPE_CITIES=Delhi,Mumbai,Bangalore,Kolkata,Chennai
```

## Troubleshooting

**Connection Timeout:**
- Check Network Access allows your IP (or use "Allow from anywhere")
- Verify username/password are correct
- Ensure cluster is running (not paused)

**Authentication Failed:**
- Double-check username and password in connection string
- Make sure user has proper permissions

**Database Not Found:**
- MongoDB Atlas creates databases automatically on first write
- The database name in URI should match `MONGODB_DB_NAME`


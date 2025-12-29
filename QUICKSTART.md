# Quick Start Guide

## ✅ Setup Complete!

Both backend and frontend dependencies have been installed.

## 🚀 Running the Application

### Step 1: Start MongoDB

**Option A: Using Docker (Recommended)**
```bash
# If you have Docker installed, use docker-compose
docker compose up -d

# Or use docker directly
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Using Local MongoDB**
```bash
# If MongoDB is installed locally, just start it
mongod
```

**Option C: Use MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update `backend/.env` with your MongoDB URI

### Step 2: Start Backend Server

Open a new terminal window:

```bash
cd /Users/aditya/weather/backend
source venv/bin/activate
python run.py
```

The API will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Step 3: Start Frontend Server

Open another terminal window:

```bash
cd /Users/aditya/weather/frontend
npm run dev
```

The frontend will be available at:
- **Frontend**: http://localhost:3000

## 🧪 Test the Application

1. Open http://localhost:3000 in your browser
2. Enter a city name (e.g., "Delhi", "Mumbai", "London")
3. Click "Search"
4. View current weather and historical chart

## 📝 Notes

- Make sure MongoDB is running before starting the backend
- The backend will automatically connect to MongoDB on startup
- Daily weather scraping is scheduled for 6 AM UTC
- If you see connection errors, check MongoDB is running and `.env` file has correct URI

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `docker ps` or check MongoDB service
- Verify `MONGODB_URI` in `backend/.env`

**Port Already in Use:**
- Backend: Change `API_PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

**City Not Found:**
- Try different city names
- Check spelling
- Some cities may not be available in the weather service


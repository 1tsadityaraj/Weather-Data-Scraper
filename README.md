# 🌦️ Weather Data Scraper

A full-stack weather application that scrapes real-time weather data, stores historical records, and displays them through a modern React dashboard.

---

## 🚀 Live Demo

- **Frontend (Vercel):** https://weather-data-scraper-5xom.vercel.app  
- **Backend (Render):** https://weather-data-scraper.onrender.com  
- **API Docs:** https://weather-data-scraper.onrender.com/docs

---

## ✨ Features

- 🌍 Fetch real-time weather data by city  
- 📊 View historical weather data (last 7 days)  
- 🧠 Air Quality Index (AQI) with health level  
- 💾 Stores data in MongoDB Atlas  
- ⚡ FastAPI backend with REST APIs  
- 🎨 Modern React + Vite frontend  

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Axios, Tailwind CSS  
**Backend:** FastAPI, Python, BeautifulSoup, APScheduler  
**Database:** MongoDB Atlas  
**Deployment:** Vercel (Frontend), Render (Backend)

---

## 📂 Project Structure

Weather-Data-Scraper/
├── frontend/
│ ├── src/
│ └── .env
├── backend/
│ ├── app/
│ ├── run.py
│ └── requirements.txt
└── README.md

yaml
Copy code

---

## 🔧 Environment Variables

### Frontend
```env
VITE_API_URL=https://weather-data-scraper.onrender.com/api
Backend
env
Copy code
MONGODB_URI=your_mongodb_atlas_uri
MONGODB_DB_NAME=weather_db
▶️ Run Locally
Backend
bash
Copy code
cd backend
pip install -r requirements.txt
python run.py
Frontend
bash
Copy code
cd frontend
npm install
npm run dev
🌐 API Endpoints
GET /api/weather?city=Delhi

GET /api/weather/history?city=Delhi&days=7

👨‍💻 Author
Aditya Raj
GitHub: https://github.com/1tsadityaraj
LinkedIn: https://www.linkedin.com/in/aditya-raj-a1b925285

⭐ Star the repo if you find it useful!


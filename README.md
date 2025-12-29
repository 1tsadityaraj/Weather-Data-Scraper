# Weather Data Scraper

A full-stack weather data scraping application with Python backend (FastAPI) and React frontend.

## Features

- 🌤️ **Real-time Weather Scraping**: Scrape current weather data for any city
- 📊 **Historical Data**: View weather history with interactive charts
- 🗄️ **MongoDB Storage**: Persistent storage of weather data
- ⏰ **Scheduled Scraping**: Daily automated weather data collection
- 🎨 **Modern UI**: Beautiful, responsive dashboard with Tailwind CSS
- 🔄 **RESTful API**: Clean API endpoints for weather data

## Project Structure

```
weather/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── database.py          # MongoDB connection
│   │   ├── models.py            # Data models
│   │   ├── scraper.py           # Weather scraper (BeautifulSoup)
│   │   ├── services.py          # Business logic
│   │   ├── scheduler.py         # Scheduled tasks
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── weather.py       # Weather API routes
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py                   # Application entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── WeatherDashboard.jsx
    │   │   ├── WeatherSearch.jsx
    │   │   ├── WeatherCard.jsx
    │   │   ├── WeatherChart.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── ErrorMessage.jsx
    │   ├── services/
    │   │   └── api.js           # API service
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud instance)

## Backend Setup

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Create virtual environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=weather_db
API_HOST=0.0.0.0
API_PORT=8000
SCRAPER_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

### 5. Start MongoDB

Make sure MongoDB is running:

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local MongoDB installation
mongod
```

### 6. Run the backend server

```bash
python run.py
```

The API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## Frontend Setup

### 1. Navigate to frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API URL (optional)

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Run the development server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Get Current Weather

```http
GET /api/weather?city=Delhi
```

**Response:**
```json
{
  "city": "Delhi",
  "temperature": 25.5,
  "humidity": 65.0,
  "wind_speed": 15.0,
  "condition": "Partly Cloudy",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Get Weather History

```http
GET /api/weather/history?city=Delhi&days=7
```

**Response:**
```json
{
  "city": "Delhi",
  "data": [
    {
      "city": "Delhi",
      "temperature": 25.5,
      "humidity": 65.0,
      "wind_speed": 15.0,
      "condition": "Partly Cloudy",
      "timestamp": "2024-01-15T10:30:00"
    }
  ]
}
```

## Scheduled Scraping

The backend includes a scheduler that automatically scrapes weather data daily at 6 AM UTC. To customize:

1. Edit `backend/app/scheduler.py`
2. Modify the `CronTrigger` time
3. Set `SCRAPE_CITIES` in `.env` to specify cities to scrape

Example `.env`:
```env
SCRAPE_CITIES=Delhi,Mumbai,Bangalore,Kolkata,Chennai
```

## Usage

1. **Start Backend**: Run `python run.py` in the `backend` directory
2. **Start Frontend**: Run `npm run dev` in the `frontend` directory
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Search Weather**: Enter a city name and click "Search"
5. **View History**: Historical data chart appears below current weather

## Error Handling

The application handles:
- Invalid city names (404 error)
- Network failures (503 error)
- Database connection issues
- Scraping failures

All errors are displayed in the UI with user-friendly messages.

## Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **BeautifulSoup4**: HTML parsing and scraping
- **Requests**: HTTP library
- **PyMongo**: MongoDB driver
- **APScheduler**: Task scheduling
- **Pydantic**: Data validation

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Recharts**: Chart library
- **Axios**: HTTP client

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate
python run.py
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
The backend can be deployed using:
- Docker
- Gunicorn/Uvicorn
- Cloud platforms (Heroku, AWS, etc.)

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### Scraping Failures

- Check internet connection
- Verify city name spelling
- Some cities may not be available in the weather service

### CORS Errors

- Ensure backend CORS settings include frontend URL
- Check `app/main.py` CORS configuration

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


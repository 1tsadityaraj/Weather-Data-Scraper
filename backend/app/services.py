"""
Business logic services for weather data
"""
from app.database import get_db
from app.scraper import scraper
from app.models import WeatherData, WeatherResponse
from datetime import datetime, timedelta
from typing import List, Optional
from bson import ObjectId

# Global flag to track MongoDB connection status
_db_available = None

def _check_db_available():
    """Check if MongoDB is available"""
    global _db_available
    if _db_available is None:
        try:
            db = get_db()
            db.weather_data.find_one()  # Test query
            _db_available = True
        except Exception:
            _db_available = False
            print("⚠️  MongoDB not available - data will not be saved to database")
    return _db_available

def save_weather_data(weather_data: dict) -> Optional[str]:
    """
    Save weather data to MongoDB
    
    Args:
        weather_data: Dictionary containing weather data
        
    Returns:
        ID of the saved document, or None if database unavailable
    """
    if not _check_db_available():
        return None
    
    try:
        db = get_db()
        collection = db.weather_data
        
        # Convert datetime to string for MongoDB storage
        doc = {
            "city": weather_data["city"],
            "temperature": weather_data["temperature"],
            "humidity": weather_data["humidity"],
            "wind_speed": weather_data["wind_speed"],
            "condition": weather_data["condition"],
            "aqi": weather_data.get("aqi"),
            "aqi_level": weather_data.get("aqi_level"),
            "timestamp": weather_data["timestamp"]
        }
        
        result = collection.insert_one(doc)
        return str(result.inserted_id)
    except Exception as e:
        global _db_available
        _db_available = False
        print(f"⚠️  Failed to save to database: {e}")
        return None

def get_current_weather(city: str, fetch_fresh: bool = True) -> WeatherResponse:
    """
    Get current weather for a city
    Optionally fetches fresh data from scraper
    
    Args:
        city: City name
        fetch_fresh: Whether to fetch fresh data from scraper
        
    Returns:
        WeatherResponse object
        
    Raises:
        Exception: If city is invalid or scraping fails
    """
    if fetch_fresh:
        # Scrape fresh weather data
        weather_data = scraper.scrape_weather(city)
        
        # Try to save to database (will fail silently if DB unavailable)
        save_weather_data(weather_data)
        
        return WeatherResponse(**weather_data)
    else:
        # Try to get from database
        if _check_db_available():
            try:
                db = get_db()
                collection = db.weather_data
                
                latest = collection.find_one(
                    {"city": city.title()},
                    sort=[("timestamp", -1)]
                )
                
                if latest:
                    # Convert ObjectId to string and datetime
                    latest["id"] = str(latest["_id"])
                    del latest["_id"]
                    return WeatherResponse(**latest)
            except Exception:
                pass
        
        # If not in DB or DB unavailable, fetch fresh
        return get_current_weather(city, fetch_fresh=True)

def get_weather_history(city: str, days: int = 7) -> List[WeatherResponse]:
    """
    Get historical weather data for a city
    
    Args:
        city: City name
        days: Number of days of history to retrieve
        
    Returns:
        List of WeatherResponse objects (empty if database unavailable)
    """
    if not _check_db_available():
        return []
    
    try:
        db = get_db()
        collection = db.weather_data
        
        # Calculate date threshold
        threshold_date = datetime.utcnow() - timedelta(days=days)
        
        # Query database
        cursor = collection.find(
            {
                "city": city.title(),
                "timestamp": {"$gte": threshold_date}
            },
            sort=[("timestamp", -1)]
        )
        
        results = []
        for doc in cursor:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            results.append(WeatherResponse(**doc))
        
        return results
    except Exception as e:
        global _db_available
        _db_available = False
        print(f"⚠️  Failed to fetch history from database: {e}")
        return []

def scrape_and_save_weather(city: str) -> bool:
    """
    Scrape weather data and save to database
    Used by scheduled tasks
    
    Args:
        city: City name to scrape
        
    Returns:
        True if successful, False otherwise
    """
    try:
        weather_data = scraper.scrape_weather(city)
        save_weather_data(weather_data)
        return True
    except Exception as e:
        print(f"Error scraping weather for {city}: {e}")
        return False


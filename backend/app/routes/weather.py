"""
Weather API routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services import get_current_weather, get_weather_history
from app.models import WeatherResponse, HistoricalWeatherResponse

router = APIRouter()

@router.get("/weather", response_model=WeatherResponse)
async def get_weather(city: str = Query(..., description="City name")):
    """
    Get current weather for a city
    
    Args:
        city: City name to get weather for
        
    Returns:
        Current weather data
        
    Raises:
        HTTPException: If city is invalid or scraping fails
    """
    try:
        if not city or not city.strip():
            raise HTTPException(status_code=400, detail="City name is required")
        
        weather = get_current_weather(city.strip(), fetch_fresh=True)
        return weather
        
    except Exception as e:
        error_message = str(e)
        if "not found" in error_message.lower() or "invalid" in error_message.lower():
            raise HTTPException(status_code=404, detail=f"City '{city}' not found")
        elif "network" in error_message.lower() or "connection" in error_message.lower():
            raise HTTPException(status_code=503, detail="Weather service unavailable. Please try again later.")
        else:
            raise HTTPException(status_code=500, detail=f"Error fetching weather: {error_message}")

@router.get("/weather/history", response_model=HistoricalWeatherResponse)
async def get_weather_history_endpoint(
    city: str = Query(..., description="City name"),
    days: int = Query(7, ge=1, le=30, description="Number of days of history")
):
    """
    Get historical weather data for a city
    
    Args:
        city: City name to get history for
        days: Number of days of history (1-30)
        
    Returns:
        Historical weather data
    """
    try:
        if not city or not city.strip():
            raise HTTPException(status_code=400, detail="City name is required")
        
        history = get_weather_history(city.strip(), days=days)
        
        return HistoricalWeatherResponse(
            city=city.title(),
            data=history
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather history: {str(e)}")


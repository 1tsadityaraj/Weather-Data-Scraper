"""
Data models for weather data
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class WeatherData(BaseModel):
    """Weather data model"""
    city: str
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., description="Humidity percentage")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    condition: str = Field(..., description="Weather condition")
    aqi: Optional[int] = Field(None, description="Air Quality Index (1-500)")
    aqi_level: Optional[str] = Field(None, description="AQI level (Good, Moderate, etc.)")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class WeatherResponse(BaseModel):
    """API response model for current weather"""
    city: str
    temperature: float
    humidity: float
    wind_speed: float
    condition: str
    aqi: Optional[int] = None
    aqi_level: Optional[str] = None
    timestamp: datetime

class HistoricalWeatherResponse(BaseModel):
    """API response model for historical weather"""
    city: str
    data: list[WeatherResponse]


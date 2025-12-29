"""
Weather data scraper using BeautifulSoup
Scrapes weather data from a public weather website
"""
import requests
from bs4 import BeautifulSoup
import os
import re
from dotenv import load_dotenv
from typing import Dict, Optional, Any
from datetime import datetime

load_dotenv()

class WeatherScraper:
    """Scraper for weather data using BeautifulSoup for HTML parsing"""
    
    def __init__(self):
        self.user_agent = os.getenv(
            "SCRAPER_USER_AGENT",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        self.base_url = "https://wttr.in"
    
    def scrape_weather(self, city: str) -> Dict[str, Any]:
        """
        Scrape weather data for a given city
        Tries JSON API first (faster), then HTML parsing with BeautifulSoup
        
        Args:
            city: City name to scrape weather for
            
        Returns:
            Dictionary containing weather data
            
        Raises:
            Exception: If scraping fails or city is invalid
        """
        # Try JSON API first (more reliable and faster)
        try:
            return self._json_scrape(city)
        except Exception as json_error:
            # If JSON fails, try HTML parsing with BeautifulSoup
            try:
                return self._html_scrape(city)
            except Exception as html_error:
                # If both fail, raise the original JSON error
                raise Exception(f"Failed to scrape weather for {city}. JSON error: {str(json_error)}")
    
    def _json_scrape(self, city: str) -> Dict[str, Any]:
        """
        Scrape weather using JSON API (primary method - faster and more reliable)
        Supports both city names and coordinates (lat,lon format)
        """
        # Handle coordinates format (e.g., "28.6139,77.2090" or "28.6139,77.2090")
        city_param = city.strip()
        
        url = f"{self.base_url}/{city_param}?format=j1"
        headers = {
            "User-Agent": self.user_agent,
            "Accept": "application/json"
        }
        
        response = requests.get(url, headers=headers, timeout=30)  # Increased timeout
        response.raise_for_status()
        
        data = response.json()
        current = data.get("current_condition", [{}])[0]
        
        if not current:
            raise Exception(f"Weather data not found for city: {city}")
        
        # Try to get AQI data
        aqi_data = self._get_aqi(city)
        
        weather_data = {
            "city": city.title(),
            "temperature": float(current.get("temp_C", 0)),
            "humidity": float(current.get("humidity", 0)),
            "wind_speed": float(current.get("windspeedKmph", 0)),
            "condition": current.get("weatherDesc", [{}])[0].get("value", "Unknown"),
            "aqi": aqi_data.get("aqi"),
            "aqi_level": aqi_data.get("level"),
            "timestamp": datetime.utcnow()
        }
        
        return weather_data
    
    def _get_aqi(self, city: str) -> Dict[str, Optional[Any]]:
        """
        Get Air Quality Index (AQI) for a city
        Uses multiple free AQI APIs as fallback
        
        Args:
            city: City name
            
        Returns:
            Dictionary with aqi and level
        """
        try:
            # Method 1: Try OpenAQ API (free, no API key)
            try:
                # OpenAQ uses coordinates, but we can try city name search
                url = f"https://api.openaq.org/v2/locations?limit=1&city={city}"
                response = requests.get(url, headers={"User-Agent": self.user_agent}, timeout=8)
                
                if response.ok:
                    data = response.json()
                    if data.get("results") and len(data["results"]) > 0:
                        location = data["results"][0]
                        # Get latest measurement
                        if location.get("lastUpdated"):
                            # Try to get AQI from parameters
                            # OpenAQ provides PM2.5, PM10, etc. but not direct AQI
                            # We'll calculate AQI from PM2.5 if available
                            pass
            except:
                pass
            
            # Method 2: Try WAQI API with demo token (limited but works for some cities)
            try:
                url = f"https://api.waqi.info/feed/{city}/?token=demo"
                response = requests.get(url, headers={"User-Agent": self.user_agent}, timeout=8)
                
                if response.ok:
                    data = response.json()
                    if data.get("status") == "ok" and data.get("data"):
                        aqi_value = data["data"].get("aqi")
                        
                        if aqi_value and isinstance(aqi_value, (int, float)) and aqi_value > 0:
                            # Determine AQI level based on US AQI scale
                            if aqi_value <= 50:
                                level = "Good"
                            elif aqi_value <= 100:
                                level = "Moderate"
                            elif aqi_value <= 150:
                                level = "Unhealthy for Sensitive Groups"
                            elif aqi_value <= 200:
                                level = "Unhealthy"
                            elif aqi_value <= 300:
                                level = "Very Unhealthy"
                            else:
                                level = "Hazardous"
                            
                            return {"aqi": int(aqi_value), "level": level}
            except Exception as e:
                print(f"WAQI API failed: {e}")
            
            # Method 3: Try aqicn.org search API
            try:
                url = f"https://api.waqi.info/search/?token=demo&keyword={city}"
                response = requests.get(url, headers={"User-Agent": self.user_agent}, timeout=8)
                
                if response.ok:
                    data = response.json()
                    if data.get("status") == "ok" and data.get("data") and len(data["data"]) > 0:
                        station = data["data"][0]
                        aqi_value = station.get("aqi")
                        
                        if aqi_value and isinstance(aqi_value, (int, float)) and aqi_value > 0:
                            if aqi_value <= 50:
                                level = "Good"
                            elif aqi_value <= 100:
                                level = "Moderate"
                            elif aqi_value <= 150:
                                level = "Unhealthy for Sensitive Groups"
                            elif aqi_value <= 200:
                                level = "Unhealthy"
                            elif aqi_value <= 300:
                                level = "Very Unhealthy"
                            else:
                                level = "Hazardous"
                            
                            return {"aqi": int(aqi_value), "level": level}
            except Exception as e:
                print(f"AQICN search failed: {e}")
                
        except Exception as e:
            print(f"Warning: Could not fetch AQI for {city}: {e}")
        
        return {"aqi": None, "level": None}
    
    def _html_scrape(self, city: str) -> Dict[str, Any]:
        """
        Scrape weather using HTML parsing with BeautifulSoup (fallback method)
        """
        url = f"{self.base_url}/{city}"
        
        headers = {
            "User-Agent": self.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
        
        response = requests.get(url, headers=headers, timeout=30)  # Increased timeout
        response.raise_for_status()
        
        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract weather data from HTML
        pre_tag = soup.find('pre')
        
        if not pre_tag:
            raise Exception("Could not find weather data in HTML")
        
        text_content = pre_tag.get_text()
        
        # Parse temperature (look for patterns like "25°C" or "25 °C")
        temp_match = re.search(r'(\+|-)?(\d+)\s*°C', text_content)
        temp_c = float(temp_match.group(2)) if temp_match else 0
        if temp_match and temp_match.group(1) == '-':
            temp_c = -temp_c
        
        # Parse humidity (look for patterns like "Humidity: 65%")
        humidity_match = re.search(r'Humidity[:\s]+(\d+)%', text_content, re.IGNORECASE)
        humidity = float(humidity_match.group(1)) if humidity_match else 0
        
        # Parse wind speed (look for patterns like "Wind: 15 km/h")
        wind_match = re.search(r'Wind[:\s]+(\d+)\s*km/h', text_content, re.IGNORECASE)
        wind_speed_kmh = float(wind_match.group(1)) if wind_match else 0
        
        # Parse condition (look for weather description)
        condition_match = re.search(r'(\w+(?:\s+\w+)*)', text_content)
        condition = condition_match.group(1) if condition_match else "Unknown"
        
        if temp_c == 0 and humidity == 0:
            raise Exception("Could not parse weather data from HTML")
        
        # Try to get AQI data
        aqi_data = self._get_aqi(city)
        
        weather_data = {
            "city": city.title(),
            "temperature": temp_c,
            "humidity": humidity,
            "wind_speed": wind_speed_kmh,
            "condition": condition,
            "aqi": aqi_data.get("aqi"),
            "aqi_level": aqi_data.get("level"),
            "timestamp": datetime.utcnow()
        }
        
        return weather_data
    

# Global scraper instance
scraper = WeatherScraper()


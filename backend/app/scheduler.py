"""
Scheduled tasks for daily weather scraping
"""
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services import scrape_and_save_weather
import os
from dotenv import load_dotenv

load_dotenv()

# Default cities to scrape daily
DEFAULT_CITIES = ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai"]

scheduler = BackgroundScheduler()

def daily_weather_scrape():
    """Scheduled task to scrape weather for default cities"""
    print("Running daily weather scrape...")
    cities = os.getenv("SCRAPE_CITIES", ",".join(DEFAULT_CITIES)).split(",")
    
    for city in cities:
        city = city.strip()
        if city:
            print(f"Scraping weather for {city}...")
            success = scrape_and_save_weather(city)
            if success:
                print(f"✓ Successfully scraped weather for {city}")
            else:
                print(f"✗ Failed to scrape weather for {city}")

def start_scheduler():
    """Start the background scheduler"""
    # Schedule daily scrape at 6 AM UTC (adjust timezone as needed)
    scheduler.add_job(
        daily_weather_scrape,
        trigger=CronTrigger(hour=6, minute=0),  # 6 AM UTC daily
        id="daily_weather_scrape",
        name="Daily Weather Scrape",
        replace_existing=True
    )
    
    scheduler.start()
    print("✓ Scheduler started - Daily weather scrape scheduled at 6 AM UTC")


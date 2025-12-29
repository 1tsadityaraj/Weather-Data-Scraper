"""
Main FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import weather
from app.scheduler import start_scheduler

app = FastAPI(
    title="Weather Data Scraper API",
    description="API for scraping and retrieving weather data",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(weather.router, prefix="/api", tags=["weather"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Weather Data Scraper API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# Start scheduler on app startup
@app.on_event("startup")
async def startup_event():
    """Start scheduled tasks on application startup"""
    start_scheduler()


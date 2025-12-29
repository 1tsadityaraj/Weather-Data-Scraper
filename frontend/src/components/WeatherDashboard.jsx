import { useState, useMemo, useEffect } from 'react'
import WeatherSearch from './WeatherSearch'
import WeatherCard from './WeatherCard'
import WeatherChart from './WeatherChart'
import WeatherStats from './WeatherStats'
import FavoriteCities from './FavoriteCities'
import LocationWeather from './LocationWeather'
import ExportData from './ExportData'
import QuickCities from './QuickCities'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import { getCurrentWeather, getWeatherHistory } from '../services/api'

/**
 * Main weather dashboard component
 */
function WeatherDashboard() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [weatherHistory, setWeatherHistory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCity, setSelectedCity] = useState('')

  // Load last searched city from localStorage on mount
  useEffect(() => {
    const lastCity = localStorage.getItem('last_searched_city')
    if (lastCity) {
      handleSearch(lastCity, false)
    }
  }, [])

  /**
   * Handle weather search
   */
  const handleSearch = async (city, saveToHistory = true) => {
    if (!city || !city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError(null)
    const cityName = city.trim()
    setSelectedCity(cityName)

    try {
      // Fetch current weather and history in parallel for better performance
      const [current, history] = await Promise.all([
        getCurrentWeather(cityName),
        getWeatherHistory(cityName, 7),
      ])

      setCurrentWeather(current)
      setWeatherHistory(history)
      
      // Save to localStorage
      if (saveToHistory) {
        localStorage.setItem('last_searched_city', cityName)
      }
    } catch (err) {
      setError(err.message)
      setCurrentWeather(null)
      setWeatherHistory(null)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Refresh current weather
   */
  const handleRefresh = () => {
    if (selectedCity) {
      handleSearch(selectedCity, false)
    }
  }

  // Memoize empty state to prevent re-renders
  const showEmptyState = useMemo(() => {
    return !currentWeather && !loading && !error
  }, [currentWeather, loading, error])

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with animation */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-transparent mb-3 drop-shadow-lg">
            <span className="inline-block animate-pulse">🌤️</span> Weather Data Scraper
          </h1>
          <p className="text-sky-100/90 text-xl font-light mb-4">
            Get real-time weather data and historical trends
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <LocationWeather onSelectCity={handleSearch} />
            {currentWeather && (
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 hover:from-blue-500/40 hover:to-cyan-500/40 border-2 border-blue-400/40 hover:border-blue-300/60 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                <span>Refresh</span>
              </button>
            )}
            <ExportData 
              currentWeather={currentWeather} 
              historyData={weatherHistory} 
              city={selectedCity}
            />
          </div>
        </div>

        {/* Favorite Cities */}
        <FavoriteCities 
          onSelectCity={handleSearch} 
          currentCity={selectedCity}
        />

        {/* Search Component */}
        <div className="animate-slide-in mb-6">
          <WeatherSearch onSearch={handleSearch} loading={loading} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-12 animate-fade-in">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="my-8 animate-fade-in">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Current Weather Card */}
        {currentWeather && !loading && (
          <div className="my-8 animate-fade-in">
            <WeatherCard weather={currentWeather} />
          </div>
        )}

        {/* Weather Statistics */}
        {weatherHistory && weatherHistory.data && weatherHistory.data.length > 0 && !loading && (
          <WeatherStats historyData={weatherHistory.data} />
        )}

        {/* Historical Chart */}
        {weatherHistory && weatherHistory.data && weatherHistory.data.length > 0 && !loading && (
          <div className="my-8 animate-fade-in">
            <WeatherChart data={weatherHistory.data} city={selectedCity} />
          </div>
        )}

        {/* Quick Cities Suggestions */}
        {showEmptyState && (
          <>
            <QuickCities onSelectCity={handleSearch} />
            <div className="text-center my-12 animate-fade-in">
              <div className="text-6xl mb-4 opacity-60 filter drop-shadow-lg">🌍</div>
              <div className="text-sky-100/80 text-xl font-light mb-2">
                Enter a city name above or select from popular cities
              </div>
              <div className="text-sky-100/60 text-sm">
                Use the location button to get weather for your current location
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WeatherDashboard


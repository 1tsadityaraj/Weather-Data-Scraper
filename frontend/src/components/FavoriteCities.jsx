import { useState, useEffect, memo } from 'react'

/**
 * Favorite cities component
 */
function FavoriteCities({ onSelectCity, currentCity }) {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('weather_favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const addFavorite = (city) => {
    if (!city || favorites.includes(city)) return
    
    const newFavorites = [...favorites, city]
    setFavorites(newFavorites)
    localStorage.setItem('weather_favorites', JSON.stringify(newFavorites))
  }

  const removeFavorite = (city) => {
    const newFavorites = favorites.filter(f => f !== city)
    setFavorites(newFavorites)
    localStorage.setItem('weather_favorites', JSON.stringify(newFavorites))
  }

  const isFavorite = (city) => favorites.includes(city)

  if (favorites.length === 0 && !currentCity) return null

  return (
    <div className="max-w-5xl mx-auto mb-6 animate-fade-in">
      <div className="bg-gradient-to-r from-sky-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-4 border-2 border-sky-400/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>⭐</span> Favorite Cities
          </h3>
          {currentCity && (
            <button
              onClick={() => isFavorite(currentCity) ? removeFavorite(currentCity) : addFavorite(currentCity)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                isFavorite(currentCity)
                  ? 'bg-yellow-500/30 text-yellow-200 hover:bg-yellow-500/40'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isFavorite(currentCity) ? '★ Remove' : '☆ Add'}
            </button>
          )}
        </div>
        
        {favorites.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {favorites.map((city) => (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 group"
              >
                <span>{city}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFavorite(city)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-300 hover:text-red-200"
                >
                  ×
                </button>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sky-100/70 text-sm">No favorite cities yet. Add cities to quickly access them!</p>
        )}
      </div>
    </div>
  )
}

export default memo(FavoriteCities)


import { useState, memo } from 'react'

/**
 * Weather search component with improved UI
 */
function WeatherSearch({ onSearch, loading }) {
  const [city, setCity] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim() && !loading) {
      onSearch(city)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {/* Main search container with glow effect */}
        <div className={`relative flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border-2 transition-all duration-300 shadow-2xl ${
          isFocused 
            ? 'border-sky-300/80 bg-white/15 shadow-[0_0_30px_rgba(14,165,233,0.3)] scale-[1.01]' 
            : 'border-sky-400/40 hover:border-sky-300/60 hover:bg-white/12'
        }`}>
          {/* Search icon */}
          <div className="pl-5 pr-3">
            <svg 
              className={`w-6 h-6 transition-colors duration-300 ${
                isFocused ? 'text-sky-200' : 'text-sky-300/70'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input field */}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for any city... (e.g., Delhi, Mumbai, London, New York)"
            className="flex-1 py-5 pr-4 bg-transparent text-white placeholder-sky-100/60 focus:outline-none text-lg font-medium disabled:opacity-50 transition-all duration-300"
            disabled={loading}
            autoFocus
          />

          {/* Search button integrated */}
          <button
            type="submit"
            disabled={loading || !city.trim()}
            className={`mx-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform ${
              loading || !city.trim()
                ? 'bg-white/10 opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 hover:from-sky-300 hover:via-blue-400 hover:to-indigo-400 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="hidden sm:inline">Searching...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Search</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </div>

        {/* Quick suggestions below search */}
        {!isFocused && !city && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-sky-100/60">Quick search:</span>
            {['Delhi', 'Mumbai', 'London', 'New York'].map((quickCity) => (
              <button
                key={quickCity}
                type="button"
                onClick={() => {
                  setCity(quickCity)
                  onSearch(quickCity)
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-sky-100 rounded-lg transition-all duration-200 hover:scale-105 border border-white/20 hover:border-white/40"
              >
                {quickCity}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}

export default memo(WeatherSearch)


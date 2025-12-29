import { useMemo, memo } from 'react'

/**
 * Get weather icon based on condition
 */
const getWeatherIcon = (condition) => {
  const cond = condition?.toLowerCase() || ''
  if (cond.includes('sun') || cond.includes('clear')) return '☀️'
  if (cond.includes('cloud')) return '☁️'
  if (cond.includes('rain')) return '🌧️'
  if (cond.includes('storm')) return '⛈️'
  if (cond.includes('snow')) return '❄️'
  if (cond.includes('fog') || cond.includes('mist')) return '🌫️'
  if (cond.includes('wind')) return '💨'
  return '🌤️'
}

/**
 * Weather card component to display current weather
 */
function WeatherCard({ weather }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const weatherIcon = useMemo(() => getWeatherIcon(weather.condition), [weather.condition])

  // Determine temperature color with better contrast
  const getTempColor = (temp) => {
    if (temp >= 30) return 'text-orange-200'
    if (temp >= 20) return 'text-yellow-200'
    if (temp >= 10) return 'text-lime-200'
    return 'text-sky-200'
  }

  // Check if city is coordinates (lat,lon format)
  const isCoordinates = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(weather.city)
  const displayCity = isCoordinates 
    ? `📍 Location (${weather.city})` 
    : weather.city

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-sky-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-sky-400/40 hover:border-sky-300/60 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(14,165,233,0.3)] hover:scale-[1.01]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-transparent mb-2 drop-shadow-lg">
              {displayCity}
            </h2>
            <p className="text-sky-100/90 text-sm font-medium">{formatDate(weather.timestamp)}</p>
          </div>
          <div className="text-7xl md:text-8xl animate-bounce filter drop-shadow-2xl" style={{ animationDuration: '3s' }}>
            {weatherIcon}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Temperature Card */}
          <div className="bg-gradient-to-br from-orange-500/30 via-red-500/20 to-pink-500/20 rounded-xl p-5 border-2 border-orange-400/40 hover:border-orange-300/60 hover:from-orange-500/40 hover:via-red-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/90 text-sm font-semibold">Temperature</div>
              <span className="text-2xl">🌡️</span>
            </div>
            <div className={`text-4xl font-bold ${getTempColor(weather.temperature)} group-hover:scale-110 transition-transform duration-300 drop-shadow-lg`}>
              {Math.round(weather.temperature)}°C
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-indigo-500/20 rounded-xl p-5 border-2 border-cyan-400/40 hover:border-cyan-300/60 hover:from-cyan-500/40 hover:via-blue-500/30 hover:to-indigo-500/30 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/90 text-sm font-semibold">Humidity</div>
              <span className="text-2xl">💧</span>
            </div>
            <div className="text-4xl font-bold text-cyan-200 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
              {Math.round(weather.humidity)}%
            </div>
          </div>

          {/* Wind Speed Card */}
          <div className="bg-gradient-to-br from-teal-500/30 via-emerald-500/20 to-green-500/20 rounded-xl p-5 border-2 border-teal-400/40 hover:border-teal-300/60 hover:from-teal-500/40 hover:via-emerald-500/30 hover:to-green-500/30 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/90 text-sm font-semibold">Wind Speed</div>
              <span className="text-2xl">💨</span>
            </div>
            <div className="text-4xl font-bold text-emerald-200 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
              {Math.round(weather.wind_speed)} <span className="text-2xl">km/h</span>
            </div>
          </div>

          {/* AQI Card */}
          {weather.aqi !== null && weather.aqi !== undefined ? (
            <div className={`rounded-xl p-5 border-2 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg ${
              weather.aqi <= 50 
                ? 'bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-teal-500/20 border-green-400/40 hover:border-green-300/60'
                : weather.aqi <= 100
                ? 'bg-gradient-to-br from-yellow-500/30 via-amber-500/20 to-orange-500/20 border-yellow-400/40 hover:border-yellow-300/60'
                : weather.aqi <= 150
                ? 'bg-gradient-to-br from-orange-500/30 via-red-500/20 to-pink-500/20 border-orange-400/40 hover:border-orange-300/60'
                : weather.aqi <= 200
                ? 'bg-gradient-to-br from-red-500/30 via-rose-500/20 to-pink-500/20 border-red-400/40 hover:border-red-300/60'
                : 'bg-gradient-to-br from-purple-500/30 via-violet-500/20 to-fuchsia-500/20 border-purple-400/40 hover:border-purple-300/60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/90 text-sm font-semibold">Air Quality</div>
                <span className="text-2xl">🌬️</span>
              </div>
              <div className={`text-4xl font-bold ${
                weather.aqi <= 50 ? 'text-green-200'
                : weather.aqi <= 100 ? 'text-yellow-200'
                : weather.aqi <= 150 ? 'text-orange-200'
                : weather.aqi <= 200 ? 'text-red-200'
                : 'text-purple-200'
              } group-hover:scale-110 transition-transform duration-300 drop-shadow-lg`}>
                {weather.aqi}
              </div>
              <div className="text-xs text-white/80 mt-1 capitalize">
                {weather.aqi_level || 'N/A'}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-500/20 via-slate-500/20 to-zinc-500/20 rounded-xl p-5 border-2 border-gray-400/40 shadow-lg opacity-50">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/70 text-sm font-semibold">Air Quality</div>
                <span className="text-2xl">🌬️</span>
              </div>
              <div className="text-2xl font-bold text-white/60">
                N/A
              </div>
              <div className="text-xs text-white/60 mt-1">
                Not available
              </div>
            </div>
          )}

          {/* Condition Card */}
          <div className="bg-gradient-to-br from-purple-500/30 via-violet-500/20 to-fuchsia-500/20 rounded-xl p-5 border-2 border-purple-400/40 hover:border-purple-300/60 hover:from-purple-500/40 hover:via-violet-500/30 hover:to-fuchsia-500/30 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/90 text-sm font-semibold">Condition</div>
              <span className="text-2xl">{weatherIcon}</span>
            </div>
            <div className="text-xl font-semibold text-purple-100 capitalize group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
              {weather.condition}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(WeatherCard)


import { useMemo, memo } from 'react'

/**
 * Weather statistics component
 */
function WeatherStats({ historyData }) {
  const stats = useMemo(() => {
    if (!historyData || historyData.length === 0) return null

    const temps = historyData.map(d => d.temperature)
    const humidities = historyData.map(d => d.humidity)
    const windSpeeds = historyData.map(d => d.wind_speed)

    return {
      temp: {
        min: Math.min(...temps),
        max: Math.max(...temps),
        avg: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      },
      humidity: {
        min: Math.min(...humidities),
        max: Math.max(...humidities),
        avg: (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(1),
      },
      wind: {
        min: Math.min(...windSpeeds),
        max: Math.max(...windSpeeds),
        avg: (windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length).toFixed(1),
      },
    }
  }, [historyData])

  if (!stats) return null

  return (
    <div className="max-w-5xl mx-auto mb-8 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-400/30">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📊</span> Weather Statistics (Last 7 Days)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Temperature Stats */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-white/80 text-sm mb-3 font-medium">Temperature</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Max:</span>
                <span className="text-orange-300 font-bold">{stats.temp.max}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Min:</span>
                <span className="text-blue-300 font-bold">{stats.temp.min}°C</span>
              </div>
              <div className="flex justify-between border-t border-white/20 pt-2">
                <span className="text-white/70">Avg:</span>
                <span className="text-yellow-300 font-bold">{stats.temp.avg}°C</span>
              </div>
            </div>
          </div>

          {/* Humidity Stats */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-white/80 text-sm mb-3 font-medium">Humidity</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Max:</span>
                <span className="text-cyan-300 font-bold">{stats.humidity.max}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Min:</span>
                <span className="text-blue-300 font-bold">{stats.humidity.min}%</span>
              </div>
              <div className="flex justify-between border-t border-white/20 pt-2">
                <span className="text-white/70">Avg:</span>
                <span className="text-cyan-200 font-bold">{stats.humidity.avg}%</span>
              </div>
            </div>
          </div>

          {/* Wind Speed Stats */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-white/80 text-sm mb-3 font-medium">Wind Speed</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Max:</span>
                <span className="text-emerald-300 font-bold">{stats.wind.max} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Min:</span>
                <span className="text-teal-300 font-bold">{stats.wind.min} km/h</span>
              </div>
              <div className="flex justify-between border-t border-white/20 pt-2">
                <span className="text-white/70">Avg:</span>
                <span className="text-green-300 font-bold">{stats.wind.avg} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(WeatherStats)


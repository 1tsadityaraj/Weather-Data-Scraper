import { useMemo, memo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * Historical weather chart component
 */
function WeatherChart({ data, city }) {
  // Memoize chart data to prevent recalculation on re-renders
  const chartData = useMemo(() => {
    return data
      .slice()
      .reverse() // Reverse to show chronological order
      .map((item) => ({
        date: new Date(item.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
        }),
        temperature: Math.round(item.temperature * 10) / 10,
        humidity: Math.round(item.humidity * 10) / 10,
        windSpeed: Math.round(item.wind_speed * 10) / 10,
      }))
  }, [data])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-md border border-white/30 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{payload[0].payload.date}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.name.includes('Temperature') ? '°C' : entry.name.includes('Humidity') ? '%' : 'km/h'}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-sky-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-sky-400/40 hover:border-sky-300/60 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(14,165,233,0.3)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-lg">
            📊 Historical Weather Data
          </h3>
          <span className="text-sky-100/90 font-semibold bg-sky-500/30 px-4 py-2 rounded-lg">{city}</span>
        </div>
        
        {chartData.length > 0 ? (
          <div className="animate-fade-in">
            <ResponsiveContainer width="100%" height={450}>
              <LineChart 
                data={chartData} 
                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255,255,255,0.15)" 
                  opacity={0.5}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.8)"
                  style={{ fontSize: '13px', fontWeight: '500' }}
                  tick={{ fill: 'rgba(255,255,255,0.9)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.8)"
                  style={{ fontSize: '13px', fontWeight: '500' }}
                  tick={{ fill: 'rgba(255,255,255,0.9)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: 'rgba(255,255,255,0.95)', fontSize: '14px' }}
                  iconType="line"
                />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#fb923c" 
                strokeWidth={3}
                name="Temperature (°C)"
                dot={{ fill: '#fb923c', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                animationDuration={1000}
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#22d3ee" 
                strokeWidth={3}
                name="Humidity (%)"
                dot={{ fill: '#22d3ee', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                animationDuration={1000}
              />
              <Line 
                type="monotone" 
                dataKey="windSpeed" 
                stroke="#34d399" 
                strokeWidth={3}
                name="Wind Speed (km/h)"
                dot={{ fill: '#34d399', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                animationDuration={1000}
              />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-5xl mb-4 opacity-50">📈</div>
            <div className="text-white/70 text-lg font-light">
              No historical data available
            </div>
            <div className="text-white/50 text-sm mt-2">
              Historical data will appear here after multiple searches
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(WeatherChart)


import { memo } from 'react'

/**
 * Export weather data component
 */
function ExportData({ currentWeather, historyData, city }) {
  const exportToJSON = () => {
    const data = {
      city: city || currentWeather?.city,
      current: currentWeather,
      history: historyData?.data || [],
      exportedAt: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weather_${city || 'data'}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    if (!historyData?.data || historyData.data.length === 0) {
      alert('No historical data to export')
      return
    }

    const headers = ['Date', 'City', 'Temperature (°C)', 'Humidity (%)', 'Wind Speed (km/h)', 'Condition']
    const rows = historyData.data.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.city,
      item.temperature,
      item.humidity,
      item.wind_speed,
      item.condition,
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weather_${city}_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!currentWeather && (!historyData?.data || historyData.data.length === 0)) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToJSON}
        className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 border-2 border-purple-400/40 hover:border-purple-300/60 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
        title="Export as JSON"
      >
        <span>💾</span>
        <span className="hidden sm:inline">Export JSON</span>
      </button>
      {historyData?.data && historyData.data.length > 0 && (
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500/30 to-blue-500/30 hover:from-indigo-500/40 hover:to-blue-500/40 border-2 border-indigo-400/40 hover:border-indigo-300/60 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
          title="Export as CSV"
        >
          <span>📄</span>
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      )}
    </div>
  )
}

export default memo(ExportData)


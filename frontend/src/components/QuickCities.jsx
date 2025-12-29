import { memo } from 'react'

const POPULAR_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai',
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney',
  'Dubai', 'Singapore', 'Hong Kong', 'Toronto', 'Berlin'
]

/**
 * Quick city suggestions component
 */
function QuickCities({ onSelectCity }) {
  return (
    <div className="max-w-3xl mx-auto mb-8 animate-fade-in">
      <div className="bg-gradient-to-r from-sky-500/15 to-blue-500/15 backdrop-blur-sm rounded-xl p-4 border border-sky-400/20">
        <p className="text-sky-100/80 text-sm mb-3 font-medium">Popular Cities:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => onSelectCity(city)}
              className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 border border-white/20 hover:border-white/40"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(QuickCities)


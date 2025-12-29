import { useState, memo } from 'react'

/**
 * Location-based weather component with improved accuracy
 */
function LocationWeather({ onSelectCity }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get Google Maps API key from environment or use null
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || null

  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords
          console.log(`Location: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`)
          
          // Try multiple geocoding services for better accuracy
          let city = null
          let bestMatch = null
          
          // Method 1: Google Maps Geocoding API (most accurate, requires API key)
          if (GOOGLE_MAPS_API_KEY) {
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}&result_type=locality|administrative_area_level_2|administrative_area_level_1`
              )
              
              if (response.ok) {
                const data = await response.json()
                if (data.results && data.results.length > 0) {
                  // Find the most specific result (locality > administrative_area_level_2 > administrative_area_level_1)
                  const locality = data.results.find(r => 
                    r.types.includes('locality')
                  )
                  const admin2 = data.results.find(r => 
                    r.types.includes('administrative_area_level_2')
                  )
                  
                  const result = locality || admin2 || data.results[0]
                  city = result.address_components.find(ac => 
                    ac.types.includes('locality')
                  )?.long_name || 
                  result.address_components.find(ac => 
                    ac.types.includes('administrative_area_level_2')
                  )?.long_name ||
                  result.address_components.find(ac => 
                    ac.types.includes('administrative_area_level_1')
                  )?.long_name
                  
                  if (city) {
                    bestMatch = { city, source: 'Google Maps', accuracy: 'High' }
                  }
                }
              }
            } catch (e) {
              console.log('Google Maps API failed:', e)
            }
          }
          
          // Method 2: OpenStreetMap Nominatim with higher zoom for better accuracy
          if (!bestMatch) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                {
                  headers: {
                    'User-Agent': 'WeatherApp/1.0'
                  }
                }
              )
              
              if (response.ok) {
                const data = await response.json()
                city = data.address?.city || 
                       data.address?.town || 
                       data.address?.village || 
                       data.address?.suburb ||
                       data.address?.municipality ||
                       data.address?.county ||
                       data.address?.state_district
                
                if (city && !bestMatch) {
                  bestMatch = { city, source: 'OpenStreetMap', accuracy: 'Medium' }
                }
              }
            } catch (e) {
              console.log('Nominatim failed:', e)
            }
          }
          
          // Method 3: BigDataCloud with better precision
          if (!bestMatch) {
            try {
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              )
              
              if (response.ok) {
                const data = await response.json()
                city = data.city || data.locality || data.principalSubdivision
                
                if (city && !bestMatch) {
                  bestMatch = { city, source: 'BigDataCloud', accuracy: 'Medium' }
                }
              }
            } catch (e) {
              console.log('BigDataCloud failed:', e)
            }
          }
          
          // Method 4: Use coordinates with higher precision for wttr.in
          if (bestMatch) {
            console.log(`Found city: ${bestMatch.city} (via ${bestMatch.source}, accuracy: ${bestMatch.accuracy})`)
            onSelectCity(bestMatch.city)
          } else {
            // Use high-precision coordinates - wttr.in supports lat,lon format
            const coordCity = `${latitude.toFixed(6)},${longitude.toFixed(6)}`
            console.log('Using high-precision coordinates:', coordCity, `(accuracy: ${accuracy}m)`)
            onSelectCity(coordCity)
          }
        } catch (err) {
          console.error('Location error:', err)
          setError('Failed to get location. Please try searching manually.')
          setLoading(false)
        }
      },
      (err) => {
        let errorMsg = 'Location access denied.'
        if (err.code === 1) {
          errorMsg = 'Please allow location access in your browser settings.'
        } else if (err.code === 2) {
          errorMsg = 'Location unavailable. Please check your device settings.'
        } else if (err.code === 3) {
          errorMsg = 'Location request timed out. Please try again.'
        }
        setError(errorMsg)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,  // Use GPS if available
        timeout: 15000,  // Increased timeout for better accuracy
        maximumAge: 0  // Don't use cached location
      }
    )
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={getLocationWeather}
        disabled={loading}
        className="px-4 py-2 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 hover:from-emerald-500/40 hover:to-teal-500/40 border-2 border-emerald-400/40 hover:border-emerald-300/60 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>Getting location...</span>
          </>
        ) : (
          <>
            <span>📍</span>
            <span>Use My Location</span>
          </>
        )}
      </button>
      {error && (
        <div className="text-red-300 text-sm animate-fade-in max-w-xs bg-red-500/20 rounded-lg p-2 border border-red-400/30">
          <div className="font-medium">{error}</div>
          <div className="text-xs text-red-200/80 mt-1">
            Tip: You can search by coordinates (e.g., "28.6139,77.2090") or city name
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(LocationWeather)


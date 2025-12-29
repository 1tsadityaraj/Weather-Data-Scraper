/**
 * API service for weather data
 */
import axios from 'axios'

// Use relative path to leverage Vite proxy, or absolute URL if VITE_API_URL is set
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,  // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Get current weather for a city
 * @param {string} city - City name
 * @returns {Promise} Weather data
 */
export const getCurrentWeather = async (city) => {
  try {
    const response = await api.get('/weather', {
      params: { city },
    })
    return response.data
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.detail || 'Failed to fetch weather')
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error. Please check your connection.')
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred')
    }
  }
}

/**
 * Get historical weather data for a city
 * @param {string} city - City name
 * @param {number} days - Number of days of history (default: 7)
 * @returns {Promise} Historical weather data
 */
export const getWeatherHistory = async (city, days = 7) => {
  try {
    const response = await api.get('/weather/history', {
      params: { city, days },
    })
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Failed to fetch weather history')
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}


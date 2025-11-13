import axios from 'axios'
import NodeCache from 'node-cache'
import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local' })

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 })

const API_BASE_URL = process.env.AVIATIONSTACK_BASE_URL || 'http://api.aviationstack.com/v1'
const API_KEY = process.env.AVIATIONSTACK_API_KEY

if (!API_KEY) {
  console.warn('⚠️  AviationStack API key is not configured. City search will not work until it is set.')
}

/**
 * Search for airports using AviationStack API
 * Uses the /airports endpoint with search parameter for better results
 * @param {string} query - Search query (city name, airport name, or IATA code)
 * @returns {Array} Array of airport objects with code, city, name, and country
 */
export async function searchCities(query) {
  const sanitizedQuery = query?.trim()
  if (!sanitizedQuery) {
    return []
  }

  const cacheKey = `airports:${sanitizedQuery.toLowerCase()}`
  const cached = cache.get(cacheKey)
  if (cached) {
    return cached
  }

  if (!API_KEY) {
    console.warn('⚠️  AviationStack API key missing')
    return []
  }

  try {
    // Use /airports endpoint with search parameter for better autocomplete
    const response = await axios.get(`${API_BASE_URL}/airports`, {
      params: {
        access_key: API_KEY,
        search: sanitizedQuery,
        limit: 10
      },
      timeout: 5000
    })

    const data = response.data?.data || []

    // Transform and filter results
    const results = data
      .filter(item => item?.iata_code && item?.iata_code.length === 3)
      .map(item => ({
        code: item.iata_code.toUpperCase(),
        city: item.city_name || item.municipality || '',
        name: item.airport_name || item.name || '',
        country: item.country_name || item.country_iso2 || ''
      }))
      .reduce((unique, item) => {
        // Remove duplicates based on IATA code
        if (!unique.find(entry => entry.code === item.code)) {
          unique.push(item)
        }
        return unique
      }, [])

    cache.set(cacheKey, results)
    return results
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.error('❌ AviationStack API authentication error. Please check your API key and plan.')
    } else {
      console.error('❌ AviationStack airport search error:', error.response?.data || error.message)
    }

    // Return empty array instead of throwing to avoid breaking the UI
    return []
  }
}

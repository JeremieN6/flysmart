import axios from 'axios'

export async function searchAirports(query) {
  if (!query || query.trim().length < 2) {
    return []
  }

  const response = await axios.get('/api/airports/search', {
    params: { query }
  })

  return response.data?.results || []
}

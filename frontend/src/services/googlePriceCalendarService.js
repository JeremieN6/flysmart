import axios from 'axios'

export async function fetchGooglePriceCalendar(params) {
  const response = await axios.get('/api/google/price-calendar', {
    params
  })

  return response.data
}

export const googlePriceCalendarService = {
  fetchGooglePriceCalendar
}

import axios from 'axios'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 })

const ROUNDTRIP_ENDPOINT = '/google/price-calendar/for-roundtrip'

let warnedMissingCredentials = false

function dayDiff(from, to) {
  const diff = to - from
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

function parseDate(value) {
  if (!value || typeof value !== 'string') {
    return null
  }

  const parts = value.split('-').map(part => Number.parseInt(part, 10))
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return null
  }

  const [year, month, day] = parts
  return new Date(Date.UTC(year, month - 1, day))
}

function getRuntimeConfig() {
  const host = process.env.GOOGLE_FLIGHTS_API_HOST
  const key = process.env.GOOGLE_FLIGHTS_API_KEY
  const language = process.env.GOOGLE_FLIGHTS_LANGUAGE || 'en-US'
  const location = process.env.GOOGLE_FLIGHTS_LOCATION || 'US'
  const currency = process.env.GOOGLE_FLIGHTS_CURRENCY || 'USD'

  if ((!host || !key) && !warnedMissingCredentials) {
    console.warn('⚠️  Google Flights API credentials are not configured. The dedicated price calendar will be unavailable.')
    warnedMissingCredentials = true
  }

  return {
    host,
    key,
    language,
    location,
    currency,
    baseURL: host ? `https://${host}` : null
  }
}

function createHttpClient() {
  const { host, key, baseURL } = getRuntimeConfig()
  if (!host || !key || !baseURL) {
    throw new Error('Google Flights API credentials are missing')
  }

  return axios.create({
    baseURL,
    headers: {
      'X-RapidAPI-Key': key,
      'X-RapidAPI-Host': host
    },
    timeout: 15000
  })
}

function buildCacheKey(prefix, params) {
  return `${prefix}:${JSON.stringify(params)}`
}

function normalizeGooglePriceCalendarResponse({
  data,
  currency,
  requestedDepartureDate,
  requestedArrivalDate
}) {
  const list = data?.data

  if (!Array.isArray(list)) {
    throw new Error('Réponse Google Price Calendar invalide')
  }

  const baseDeparture = parseDate(requestedDepartureDate)
  const baseArrival = parseDate(requestedArrivalDate)

  const entries = list
    .map(item => {
      if (!item?.departureDate || !item?.arrivalDate || item.price == null) {
        return null
      }

      const departureDate = String(item.departureDate)
      const arrivalDate = String(item.arrivalDate)
      const departure = parseDate(departureDate)
      const arrival = parseDate(arrivalDate)

      if (!departure || !arrival) {
        return null
      }

      const price = Number(item.price)
      if (!Number.isFinite(price)) {
        return null
      }

      const tripLength = Math.max(0, dayDiff(departure, arrival))

      return {
        departureDate,
        arrivalDate,
        price: Math.round(price),
        tripLengthDays: tripLength,
        departureOffset: baseDeparture ? dayDiff(baseDeparture, departure) : null,
        arrivalOffset: baseArrival ? dayDiff(baseArrival, arrival) : null
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.departureDate === b.departureDate) {
        return a.arrivalDate.localeCompare(b.arrivalDate)
      }
      return a.departureDate.localeCompare(b.departureDate)
    })

  if (!entries.length) {
    throw new Error('Aucune donnée disponible via Google Price Calendar')
  }

  const prices = entries.map(entry => entry.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((sum, value) => sum + value, 0) / prices.length

  return {
    entries,
    meta: {
      count: entries.length,
      currency,
      requestedDepartureDate: requestedDepartureDate || null,
      requestedArrivalDate: requestedArrivalDate || null,
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      avgPrice: Math.round(avgPrice)
    }
  }
}

async function fetchGoogleRoundtripCalendar(params, retries = 2) {
  const client = createHttpClient()
  const cacheKey = buildCacheKey('google-roundtrip', params)
  const cached = cache.get(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const response = await client.get(ROUNDTRIP_ENDPOINT, { params })

    if (response.status === 429) {
      throw Object.assign(new Error('Quota RapidAPI dépassé'), { status: 429 })
    }

    if (response.status >= 400) {
      throw Object.assign(new Error(`Erreur Google Price Calendar ${response.status}`), { status: response.status })
    }

    const normalized = normalizeGooglePriceCalendarResponse({
      data: response.data,
      currency: params.currency,
      requestedDepartureDate: params.departureDate,
      requestedArrivalDate: params.arrivalDate
    })

    cache.set(cacheKey, normalized)
    return normalized
  } catch (error) {
    if (retries > 0 && (!error.status || error.status >= 500)) {
      await new Promise(resolve => setTimeout(resolve, 500 * (3 - retries)))
      return fetchGoogleRoundtripCalendar(params, retries - 1)
    }

    throw error
  }
}

export async function getRoundtripPriceCalendar(options) {
  const runtime = getRuntimeConfig()

  const {
    departureId,
    arrivalId,
    departureDate,
    arrivalDate,
    startDate,
    endDate,
    daysBetween,
    language,
    location,
    currency,
    adults,
    children,
    infantsInSeat,
    infantsOnLap,
    cabinClass
  } = options

  const params = {
    departureId,
    arrivalId,
    departureDate,
    arrivalDate,
    language: language || runtime.language,
    location: location || runtime.location,
    currency: currency || runtime.currency,
    adults: adults ?? '1',
    children: children ?? '0',
    infantsInSeat: infantsInSeat ?? '0',
    infantsOnLap: infantsOnLap ?? '0',
    cabinClass: cabinClass ?? '1'
  }

  if (startDate) {
    params.startDate = startDate
  }

  if (endDate) {
    params.endDate = endDate
  }

  if (daysBetween) {
    params.daysBetween = daysBetween
  }

  return fetchGoogleRoundtripCalendar(params)
}

export const googlePriceCalendarService = {
  getRoundtripPriceCalendar
}

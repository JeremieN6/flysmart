import axios from 'axios'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 })

const CALENDAR_ENDPOINT = '/flights/price-calendar'

let warnedMissingCredentials = false

function getRuntimeConfig() {
  const host = process.env.FLIGHTSKY_API_HOST
  const key = process.env.FLIGHTSKY_API_KEY
  const market = process.env.FLIGHTSKY_MARKET || 'FR'
  const locale = process.env.FLIGHTSKY_LOCALE || 'fr-FR'
  const currency = process.env.FLIGHTSKY_CURRENCY || 'EUR'

  if ((!host || !key) && !warnedMissingCredentials) {
    console.warn('⚠️  FlightSky API credentials are not configured. Real price analysis will be unavailable.')
    warnedMissingCredentials = true
  }

  return {
    host,
    key,
    market,
    locale,
    currency,
    baseURL: host ? `https://${host}` : null
  }
}

function createHttpClient() {
  const { host, key, baseURL } = getRuntimeConfig()
  if (!host || !key || !baseURL) {
    throw new Error('FlightSky API credentials are missing')
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

/**
 * Convert a group label (low/medium/high) to an approximate multiplier.
 * Helps us estimate missing average/max values when only a single price is provided.
 */
function groupToMultiplier(group) {
  switch (group) {
    case 'low':
      return { minFactor: 1, maxFactor: 1.4 }
    case 'medium':
      return { minFactor: 0.9, maxFactor: 1.6 }
    case 'high':
      return { minFactor: 0.8, maxFactor: 1.8 }
    default:
      return { minFactor: 1, maxFactor: 1.5 }
  }
}

function normalizeFlightsCalendarResponse({
  data,
  currency,
  todayDate = new Date(),
  startDate,
  endDate
}) {
  const calendar = data?.data?.flights

  if (!data?.status || !Array.isArray(calendar?.days)) {
    throw new Error('Réponse FlightSky invalide')
  }

  const startFilter = startDate ? new Date(startDate) : null
  const endFilter = endDate ? new Date(endDate) : null
  const entries = calendar.days
    .map(item => {
      if (!item?.day || item.price == null) {
        return null
      }

      const date = new Date(item.day)
      if (Number.isNaN(date.getTime())) {
        return null
      }

      if (startFilter && date < startFilter) {
        return null
      }

      if (endFilter && date > endFilter) {
        return null
      }

      const diffInMs = date - todayDate
      const diffInDays = Math.max(0, Math.round(diffInMs / (1000 * 60 * 60 * 24)))

      return {
        date: item.day,
        price: Number(item.price),
        group: item.group || 'low',
        daysBefore: diffInDays
      }
    })
    .filter(Boolean)

  if (entries.length === 0) {
    throw new Error('Aucune donnée de prix disponible pour cette période')
  }

  entries.sort((a, b) => b.daysBefore - a.daysBefore)

  const prices = entries.map(entry => ({
    daysBefore: entry.daysBefore,
    price: Math.round(entry.price),
    departureDate: entry.date,
    ranking: entry.group,
    recommendation: entry.group === 'low'
      ? 'Prix en dessous de la moyenne historique.'
      : entry.group === 'medium'
        ? 'Prix proche de la moyenne.'
        : 'Prix élevé, envisagez d\'attendre si possible.'
  }))

  const minPrice = Math.min(...entries.map(item => item.price))
  const maxPrice = Math.max(...entries.map(item => item.price))
  const avgPrice = entries.reduce((sum, item) => sum + item.price, 0) / entries.length

  const cheapestEntry = entries.find(item => item.price === minPrice)

  const responseCurrency = currency || calendar?.currencyCode || calendar?.currency || getRuntimeConfig().currency

  let inferredMax = maxPrice
  if (!Number.isFinite(inferredMax) || inferredMax === minPrice) {
    const factors = groupToMultiplier(cheapestEntry?.group)
    inferredMax = minPrice * factors.maxFactor
  }

  return {
    prices,
    summary: {
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(inferredMax),
  avgPrice: Math.round(avgPrice),
  currency: responseCurrency
    },
    cheapestDate: cheapestEntry
      ? { date: cheapestEntry.date, price: Math.round(cheapestEntry.price) }
      : null,
    period: {
      start: startFilter ? startFilter.toISOString().split('T')[0] : calendar?.period?.start || null,
      end: endFilter ? endFilter.toISOString().split('T')[0] : calendar?.period?.end || null
    }
  }
}

async function fetchFlightsCalendar(params, retries = 2) {
  const client = createHttpClient()
  const { startDate, endDate, ...queryParams } = params
  const cacheKey = buildCacheKey('calendar', params)
  const cached = cache.get(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const response = await client.get(CALENDAR_ENDPOINT, { params: queryParams })

    if (response.status === 429) {
      throw Object.assign(new Error('Quota RapidAPI dépassé'), { status: 429 })
    }

    if (response.status >= 400) {
      throw Object.assign(new Error(`Erreur FlightSky ${response.status}`), { status: response.status })
    }

    const normalized = normalizeFlightsCalendarResponse({
      data: response.data,
      currency: params.currency || getRuntimeConfig().currency,
      startDate,
      endDate
    })
    cache.set(cacheKey, normalized)
    return normalized
  } catch (error) {
    if (retries > 0 && (!error.status || error.status >= 500)) {
      await new Promise(resolve => setTimeout(resolve, 500 * (3 - retries)))
      return fetchFlightsCalendar(params, retries - 1)
    }

    throw error
  }
}

export async function analyzePricesWithFlightSky({
  from,
  to,
  startDate,
  endDate,
  currency,
  market,
  locale
}) {
  const runtimeConfig = getRuntimeConfig()
  const resolvedCurrency = currency || runtimeConfig.currency
  const resolvedMarket = market || runtimeConfig.market
  const resolvedLocale = locale || runtimeConfig.locale

  const fromEntityId = from?.trim().toUpperCase()
  const toEntityId = to?.trim().toUpperCase()

  if (!fromEntityId || !toEntityId) {
    throw new Error('Codes aéroport invalides pour FlightSky')
  }

  const params = {
    fromEntityId,
    toEntityId,
    departDate: startDate,
    startDate,
    endDate,
    market: resolvedMarket,
    locale: resolvedLocale,
    currency: resolvedCurrency
  }

  const calendarData = await fetchFlightsCalendar(params)

  return {
    prices: calendarData.prices,
    summary: calendarData.summary,
    cheapestDate: calendarData.cheapestDate,
    period: calendarData.period,
    raw: calendarData
  }
}

export const flightSkyService = {
  analyzePricesWithFlightSky
}

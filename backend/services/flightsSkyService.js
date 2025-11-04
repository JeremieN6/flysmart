import axios from 'axios'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 })

const CALENDAR_ENDPOINT = '/flights/price-calendar'
const GOOGLE_ROUNDTRIP_ENDPOINT = '/google/price-calendar/for-roundtrip'
const AUTO_COMPLETE_ENDPOINT = '/flights/auto-complete'

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

function looksLikeEntityId(value = '') {
  return value.length > 3 || /[=]/.test(value)
}

async function resolveAirportEntityId(code, { market, locale }) {
  if (!code) {
    return null
  }

  if (looksLikeEntityId(code)) {
    return code
  }

  const upperCode = code.toUpperCase()
  const cacheKey = `airport-entity:${upperCode}:${market}:${locale}`
  const cached = cache.get(cacheKey)
  if (cached) {
    return cached
  }

  const client = createHttpClient()

  try {
    const response = await client.get(AUTO_COMPLETE_ENDPOINT, {
      params: {
        query: upperCode,
        placeTypes: 'AIRPORT',
        market,
        locale
      }
    })

    const entries = response.data?.data || []

    const matcher = (entry) => {
      const skyId = entry?.relevantFlightParams?.skyId || entry?.navigation?.relevantFlightParams?.skyId
      return skyId && skyId.toUpperCase() === upperCode
    }

    let match = entries.find(matcher)

    if (!match) {
      match = entries.find(entry => {
        const suggestion = entry?.presentation?.suggestionTitle || ''
        return suggestion.toUpperCase().includes(`(${upperCode})`)
      })
    }

    const resolvedId = match?.presentation?.id || match?.id || match?.navigation?.id
    const fallbackEntityId = match?.navigation?.entityId || match?.relevantFlightParams?.entityId

    if (resolvedId) {
      cache.set(cacheKey, resolvedId, 3600) // cache 1h
      return resolvedId
    }

    if (fallbackEntityId) {
      const entityIdStr = String(fallbackEntityId)
      cache.set(cacheKey, entityIdStr, 3600)
      return entityIdStr
    }

    console.warn(`⚠️  Impossible de résoudre l'identifiant FlightSky pour ${upperCode}`)
    return null
  } catch (error) {
    console.error('❌ FlightSky auto-complete error:', error.response?.data || error.message)
    return null
  }
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
  if (!data?.status || !Array.isArray(data?.data?.days)) {
    throw new Error('Réponse FlightSky invalide')
  }

  const startFilter = startDate ? new Date(startDate) : null
  const endFilter = endDate ? new Date(endDate) : null
  const entries = data.data.days
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
      currency: currency || data.data.currency || getRuntimeConfig().currency
    },
    cheapestDate: cheapestEntry
      ? { date: cheapestEntry.date, price: Math.round(cheapestEntry.price) }
      : null,
    period: {
      start: startFilter ? startFilter.toISOString().split('T')[0] : data.data.period?.start || null,
      end: endFilter ? endFilter.toISOString().split('T')[0] : data.data.period?.end || null
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

  const [fromEntityId, toEntityId] = await Promise.all([
    resolveAirportEntityId(from, { market: resolvedMarket, locale: resolvedLocale }),
    resolveAirportEntityId(to, { market: resolvedMarket, locale: resolvedLocale })
  ])

  if (!fromEntityId || !toEntityId) {
    throw new Error('Impossible de résoudre les identifiants aéroport pour FlightSky')
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

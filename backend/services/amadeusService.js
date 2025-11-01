import axios from 'axios'
import NodeCache from 'node-cache'
import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local' })

// Cache pour les tokens d'authentification (30 minutes)
const tokenCache = new NodeCache({ stdTTL: 1800 })
// Cache pour les résultats de recherche (10 minutes)
const resultCache = new NodeCache({ stdTTL: 600 })

const API_BASE_URL = 'https://test.api.amadeus.com/v1'
const API_KEY = process.env.AMADEUS_API_KEY
const API_SECRET = process.env.AMADEUS_API_SECRET_KEY

if (!API_KEY || !API_SECRET) {
  console.warn('⚠️  Amadeus API credentials are not configured')
}

/**
 * Obtenir un token d'accès Amadeus (OAuth2)
 * Le token est mis en cache pour éviter les appels répétés
 */
async function getAccessToken() {
  const cached = tokenCache.get('access_token')
  if (cached) {
    return cached
  }

  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: API_KEY,
        client_secret: API_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    )

    const token = response.data.access_token
    tokenCache.set('access_token', token)
    console.log('✅ Token Amadeus obtenu')
    return token
  } catch (error) {
    console.error('❌ Erreur d\'authentification Amadeus:', error.response?.data || error.message)
    throw new Error('Impossible de s\'authentifier avec l\'API Amadeus')
  }
}

/**
 * Analyser les prix pour une date spécifique
 * @param {string} origin - Code IATA de l'aéroport de départ (ex: CDG)
 * @param {string} destination - Code IATA de l'aéroport d'arrivée (ex: JFK)
 * @param {string} departureDate - Date de départ (YYYY-MM-DD)
 * @param {string} currencyCode - Code devise (EUR, USD, etc.)
 * @returns {Object} Analyse des prix pour cette date
 */
export async function analyzePriceForDate(origin, destination, departureDate, currencyCode = 'EUR') {
  const cacheKey = `price:${origin}:${destination}:${departureDate}:${currencyCode}`
  const cached = resultCache.get(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const token = await getAccessToken()

    const response = await axios.get(`${API_BASE_URL}/analytics/itinerary-price-metrics`, {
      params: {
        originIataCode: origin,
        destinationIataCode: destination,
        departureDate: departureDate,
        currencyCode: currencyCode
      },
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 10000
    })

    const data = response.data?.data?.[0]

    if (!data) {
      return {
        date: departureDate,
        error: 'Aucune donnée disponible pour cette date',
        available: false
      }
    }

    // Transformer les données pour notre format
    const result = {
      date: departureDate,
      available: true,
      currency: data.currencyCode || currencyCode,
      price: {
        median: data.priceMetrics?.[0]?.quartileRanking === 'MEDIUM' ? parseFloat(data.priceMetrics[0].amount) : null,
        min: data.priceMetrics?.reduce((min, metric) => {
          const price = parseFloat(metric.amount)
          return price < min ? price : min
        }, Infinity),
        max: data.priceMetrics?.reduce((max, metric) => {
          const price = parseFloat(metric.amount)
          return price > max ? price : max
        }, -Infinity)
      },
      analysis: {
        isGoodDeal: data.priceMetrics?.some(m => m.quartileRanking === 'MINIMUM'),
        ranking: data.priceMetrics?.[0]?.quartileRanking || 'UNKNOWN',
        recommendation: getRecommendation(data.priceMetrics?.[0]?.quartileRanking)
      }
    }

    resultCache.set(cacheKey, result)
    return result
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expiré, on le supprime du cache et on réessaie
      tokenCache.del('access_token')
      console.log('🔄 Token expiré, nouvelle tentative...')
      return analyzePriceForDate(origin, destination, departureDate, currencyCode)
    }

    console.error('❌ Erreur API Amadeus:', error.response?.data || error.message)
    return {
      date: departureDate,
      error: error.response?.data?.errors?.[0]?.detail || error.message,
      available: false
    }
  }
}

/**
 * Analyser les prix pour une période (plage de dates)
 * @param {string} origin - Code IATA de l'aéroport de départ
 * @param {string} destination - Code IATA de l'aéroport d'arrivée
 * @param {string} startDate - Date de début (YYYY-MM-DD)
 * @param {string} endDate - Date de fin (YYYY-MM-DD)
 * @param {string} currencyCode - Code devise
 * @returns {Object} Analyse des prix pour toute la période
 */
export async function analyzePricesForPeriod(origin, destination, startDate, endDate, currencyCode = 'EUR') {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const results = []

  console.log(`🔍 Analyse de la période ${startDate} à ${endDate}...`)

  // Générer toutes les dates dans la période
  const currentDate = new Date(start)
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0]
    results.push(dateStr)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Limiter à 30 jours max pour éviter trop de requêtes
  if (results.length > 30) {
    console.warn('⚠️  Période limitée à 30 jours')
    results.splice(30)
  }

  // Analyser chaque date (en parallèle par lots de 5 pour ne pas surcharger l'API)
  const batchSize = 5
  const allResults = []

  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize)
    const batchPromises = batch.map(date =>
      analyzePriceForDate(origin, destination, date, currencyCode)
    )
    const batchResults = await Promise.all(batchPromises)
    allResults.push(...batchResults)

    // Petite pause entre les lots
    if (i + batchSize < results.length) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  // Analyser les résultats pour trouver les meilleures dates
  const validResults = allResults.filter(r => r.available)
  const bestDeals = validResults
    .filter(r => r.analysis.isGoodDeal)
    .sort((a, b) => a.price.min - b.price.min)

  const cheapestDate = validResults.reduce((min, result) => {
    return result.price.min < (min?.price.min || Infinity) ? result : min
  }, null)

  return {
    period: {
      start: startDate,
      end: endDate,
      daysAnalyzed: allResults.length
    },
    allDates: allResults,
    bestDeals: bestDeals.slice(0, 5), // Top 5 meilleures affaires
    cheapestDate: cheapestDate,
    summary: {
      minPrice: cheapestDate?.price.min || null,
      maxPrice: validResults.reduce((max, r) => Math.max(max, r.price.max || 0), 0),
      avgPrice: validResults.length > 0
        ? validResults.reduce((sum, r) => sum + (r.price.median || r.price.min || 0), 0) / validResults.length
        : null,
      currency: currencyCode,
      recommendations: bestDeals.length > 0
        ? `${bestDeals.length} date(s) avec de bonnes affaires détectées`
        : 'Aucune affaire exceptionnelle détectée pour cette période'
    }
  }
}

/**
 * Obtenir une recommandation textuelle basée sur le ranking
 */
function getRecommendation(ranking) {
  switch (ranking) {
    case 'MINIMUM':
      return 'Excellent prix ! C\'est le moment idéal pour acheter.'
    case 'FIRST':
      return 'Très bon prix, en dessous de la moyenne historique.'
    case 'MEDIUM':
      return 'Prix dans la moyenne du marché.'
    case 'THIRD':
      return 'Prix légèrement au-dessus de la moyenne.'
    case 'MAXIMUM':
      return 'Prix élevé. Attendez si possible.'
    default:
      return 'Données insuffisantes pour évaluer.'
  }
}

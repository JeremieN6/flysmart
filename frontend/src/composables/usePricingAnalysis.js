import { computed } from 'vue'

const DAY_IN_MS = 1000 * 60 * 60 * 24

function normalizeFromLegacyStructure(raw) {
  if (!raw?.prices || !Array.isArray(raw.prices) || raw.prices.length === 0) {
    return null
  }

  const routeFallback = {
    from: raw.route?.from || raw.query?.from || '',
    to: raw.route?.to || raw.query?.to || '',
    currency: raw.route?.currency || raw.query?.currency || 'EUR',
    cabin: raw.route?.cabin || raw.query?.cabin || 'Economy',
    date: raw.route?.date || raw.query?.date || raw.query?.startDate || new Date().toISOString().split('T')[0]
  }

  const prices = raw.prices.map(point => ({
    daysBefore: point.daysBefore,
    price: Math.round(point.price),
    departureDate: routeFallback.date
  }))

  return {
    prices,
    route: { ...routeFallback },
    metadata: {
      summary: raw.summary || null,
      period: raw.period || null,
      cheapestDate: raw.cheapestDate || null
    }
  }
}

function normalizeFromPeriodStructure(raw) {
  if (!raw?.allDates || !Array.isArray(raw.allDates) || raw.allDates.length === 0) {
    return null
  }

  const today = new Date()
  const validEntries = raw.allDates.filter(entry => entry.available && entry.price?.min)

  if (validEntries.length === 0) {
    return null
  }

  const prices = validEntries
    .map(entry => {
      const departure = new Date(entry.date)
      if (Number.isNaN(departure.getTime())) {
        return null
      }

      const diffInDays = Math.max(0, Math.round((departure - today) / DAY_IN_MS))

      return {
        daysBefore: diffInDays,
        price: Math.round(entry.price.min),
        departureDate: entry.date,
        ranking: entry.analysis?.ranking || null,
        recommendation: entry.analysis?.recommendation || null
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.daysBefore - a.daysBefore)

  if (prices.length === 0) {
    return null
  }

  const currency = validEntries.find(item => item.currency)?.currency ||
    raw.summary?.currency ||
    raw.query?.currency ||
    raw.route?.currency ||
    'EUR'

  const cheapestPoint = prices.reduce((best, current) => {
    if (!best || current.price < best.price) {
      return current
    }
    return best
  }, null)

  const route = {
    from: raw.route?.from || raw.query?.from || '',
    to: raw.route?.to || raw.query?.to || '',
    currency,
    cabin: raw.route?.cabin || raw.query?.cabin || 'Economy',
    date: raw.cheapestDate?.date || cheapestPoint?.departureDate || raw.period?.start || raw.query?.startDate
  }

  return {
    prices,
    route,
    metadata: {
      summary: raw.summary || null,
      period: raw.period || null,
      cheapestDate: raw.cheapestDate || (cheapestPoint
        ? { date: cheapestPoint.departureDate, price: cheapestPoint.price }
        : null)
    }
  }
}

function normalizePricePayload(raw) {
  if (!raw) {
    return null
  }

  const legacy = normalizeFromLegacyStructure(raw)
  if (legacy) {
    return legacy
  }

  return normalizeFromPeriodStructure(raw)
}

/**
 * Composable for analyzing flight pricing data
 * @param {Object} priceData - The pricing data from the API
 * @returns {Object} Analysis results with recommendations
 */
export function usePricingAnalysis(priceData) {
  const normalized = computed(() => normalizePricePayload(priceData.value))

  const analysis = computed(() => {
    const data = normalized.value

    if (!data || data.prices.length === 0) {
      return null
    }

    // Sort by daysBefore descending (most to least)
    const sortedPrices = [...data.prices].sort((a, b) => b.daysBefore - a.daysBefore)

    // Calculate statistics
    const priceValues = sortedPrices.map(p => p.price)
    const cheapest = Math.min(...priceValues)
    const maxPrice = Math.max(...priceValues)
    const average = priceValues.length > 0
      ? Math.round(priceValues.reduce((a, b) => a + b, 0) / priceValues.length)
      : 0

    // Find cheapest point
    const cheapestPoint = sortedPrices.find(p => p.price === cheapest)
    const bestPurchaseDate = cheapestPoint ? cheapestPoint.daysBefore : 30

    // Calculate optimal purchase window (±3 days around cheapest)
    const windowMin = Math.max(3, bestPurchaseDate - 3)
    const windowMax = Math.min(60, bestPurchaseDate + 3)

    // Determine departure date, fallback to today if missing
    const departureDateRaw = data.route?.date
    const departureDate = departureDateRaw ? new Date(departureDateRaw) : new Date()

    // Calculate score (0-100)
    const optimalDay = 30
    const daysDiff = Math.abs(bestPurchaseDate - optimalDay)
    const dayScore = Math.max(0, 100 - (daysDiff * 2))

    const divisor = average === 0 ? 1 : average
    const priceVariation = ((maxPrice - cheapest) / divisor) * 100
    const stabilityScore = Math.max(0, 100 - priceVariation)

    // Combined score (weighted average)
    const score = Math.round((dayScore * 0.6) + (stabilityScore * 0.4))

    // Determine status and message based on best purchase window
    let status = 'stable'
    let message = 'Les prix semblent stables pour cette route.'
    let recommendation = 'Vous pouvez réserver maintenant ou attendre quelques jours.'

    if (bestPurchaseDate >= 45) {
      status = 'early'
      message = 'Il est encore tôt pour réserver ce vol.'
      recommendation = `Attendez environ ${Math.max(1, bestPurchaseDate - 30)} jours pour des prix optimaux (autour de J-30).`
    } else if (bestPurchaseDate >= 21 && bestPurchaseDate <= 35) {
      status = 'optimal'
      message = 'C\'est le moment idéal pour réserver ce vol!'
      recommendation = `Les meilleurs prix se situent entre J-${windowMax} et J-${windowMin}.`
    } else if (bestPurchaseDate < 14) {
      status = 'late'
      message = 'Attention, les prix risquent d\'augmenter.'
      recommendation = 'Réservez dès maintenant pour éviter une hausse des prix de dernière minute.'
    }

    // Calculate savings potential
    const savingsPotential = maxPrice - cheapest
    const savingsPercentage = maxPrice > 0
      ? Math.round((savingsPotential / maxPrice) * 100)
      : 0

    return {
      // Price statistics
      cheapest,
      average,
      maxPrice,

      // Timing
      bestPurchaseDate,
      windowMin,
      windowMax,
      departureDate,

      // Analysis
      score,
      status,
      message,
      recommendation,

      // Savings
      savingsPotential,
      savingsPercentage,

      // Chart data
      sortedPrices,

      // Route info
      route: {
        ...data.route,
        period: data.metadata?.period || null,
        cheapestDate: data.metadata?.cheapestDate || null
      }
    }
  })

  return {
    analysis
  }
}

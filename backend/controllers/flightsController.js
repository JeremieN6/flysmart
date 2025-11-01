import { analyzePricesForPeriod } from '../services/amadeusService.js'

/**
 * Analyser les prix de vols pour une période donnée
 * Utilise l'API Amadeus Flight Price Analysis pour déterminer les meilleures dates
 */
export async function getPrices(req, res, next) {
  try {
    const {
      from,
      to,
      startDate,
      endDate,
      currency = 'EUR',
      cabin = 'Economy'
    } = req.query

    // Validate required parameters
    if (!from || !to || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        required: ['from', 'to', 'startDate', 'endDate'],
        message: 'Veuillez spécifier les aéroports de départ, d\'arrivée et la période'
      })
    }

    // Validate IATA codes (3 letters)
    if (!/^[A-Z]{3}$/i.test(from) || !/^[A-Z]{3}$/i.test(to)) {
      return res.status(400).json({
        error: 'Codes IATA invalides',
        message: 'Les codes aéroport doivent contenir exactement 3 lettres (ex: CDG, JFK)'
      })
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return res.status(400).json({
        error: 'Format de date invalide',
        message: 'Les dates doivent être au format YYYY-MM-DD'
      })
    }

    // Validate date logic
    if (startDate >= endDate) {
      return res.status(400).json({
        error: 'Période invalide',
        message: 'La date de fin doit être après la date de début'
      })
    }

    // Check period length (max 30 days)
    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

    if (daysDiff > 30) {
      return res.status(400).json({
        error: 'Période trop longue',
        message: 'La période ne peut pas dépasser 30 jours'
      })
    }

    console.log(`📊 Analyse des prix ${from} → ${to} du ${startDate} au ${endDate}`)

    // Analyze prices using Amadeus API
    const result = await analyzePricesForPeriod(
      from.toUpperCase(),
      to.toUpperCase(),
      startDate,
      endDate,
      currency.toUpperCase()
    )

    const now = new Date()
    const timeline = (result.allDates || [])
      .filter(entry => entry?.available && entry.price?.min)
      .map(entry => {
        const departure = new Date(entry.date)
        const diffInDays = Math.max(0, Math.round((departure - now) / (1000 * 60 * 60 * 24)))

        return {
          daysBefore: diffInDays,
          price: Math.round(entry.price.min),
          departureDate: entry.date,
          ranking: entry.analysis?.ranking || null,
          recommendation: entry.analysis?.recommendation || null
        }
      })
      .sort((a, b) => b.daysBefore - a.daysBefore)

    const route = {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      currency: currency.toUpperCase(),
      cabin,
      startDate,
      endDate,
      date: result.cheapestDate?.date || startDate
    }

    const summary = result.summary || {}

    const normalizedSummary = {
      ...summary,
      minPrice: summary.minPrice != null ? Math.round(summary.minPrice) : null,
      maxPrice: summary.maxPrice != null ? Math.round(summary.maxPrice) : null,
      avgPrice: summary.avgPrice != null ? Math.round(summary.avgPrice) : null
    }

    res.json({
      success: true,
      query: {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        startDate,
        endDate,
        currency: currency.toUpperCase(),
        cabin
      },
      route,
      prices: timeline,
      ...result,
      summary: normalizedSummary
    })
  } catch (error) {
    console.error('❌ Erreur dans getPrices:', error.message)

    // Handle specific error types
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        error: error.message
      })
    }

    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'analyse des prix',
      message: error.message
    })
  }
}

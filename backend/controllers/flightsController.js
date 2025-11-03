import { analyzePricesWithFlightSky } from '../services/flightsSkyService.js'
import { fetchFlightPrices } from '../services/flightApiService.js'

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

    console.log(`📊 Analyse FlightSky ${from} → ${to} du ${startDate} au ${endDate}`)

    let timeline = []
    let summary = null
    let cheapestDate = null
    let source = 'flightsky'

    try {
      const result = await analyzePricesWithFlightSky({
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        startDate,
        endDate,
        currency: currency.toUpperCase()
      })

      timeline = result.prices || []
      summary = result.summary || null
      cheapestDate = result.cheapestDate || null

      if (!timeline.length) {
        throw new Error('Aucune donnée FlightSky exploitables pour la période demandée')
      }
    } catch (error) {
      source = 'fallback'
      console.warn('⚠️  FlightSky indisponible, utilisation du fallback local:', error.message)

      const fallback = await fetchFlightPrices(
        from.toUpperCase(),
        to.toUpperCase(),
        endDate,
        {
          currency: currency.toUpperCase(),
          cabin
        }
      )

      const baseDate = new Date(endDate)
      const startPeriod = new Date(startDate)

      timeline = (fallback.prices || []).map(point => {
        const departure = new Date(baseDate)
        departure.setDate(departure.getDate() - point.daysBefore)

        return {
          daysBefore: point.daysBefore,
          price: Math.round(point.price),
          departureDate: departure.toISOString().split('T')[0],
          ranking: null,
          recommendation: null
        }
      })
        .filter(item => {
          const departure = new Date(item.departureDate)
          if (Number.isNaN(departure.getTime())) {
            return false
          }
          return departure >= startPeriod && departure <= baseDate
        })

      if (!timeline.length) {
        throw new Error('Impossible de générer des données de secours pour cette recherche')
      }

      summary = {
        minPrice: Math.round(Math.min(...timeline.map(item => item.price))),
        maxPrice: Math.round(Math.max(...timeline.map(item => item.price))),
        avgPrice: Math.round(timeline.reduce((sum, item) => sum + item.price, 0) / timeline.length),
        currency: currency.toUpperCase()
      }

      cheapestDate = timeline.reduce((best, item) => {
        if (!best || item.price < best.price) {
          return { date: item.departureDate, price: item.price }
        }
        return best
      }, null)
    }

    timeline.sort((a, b) => b.daysBefore - a.daysBefore)

    if (!summary && timeline.length) {
      summary = {
        minPrice: Math.round(Math.min(...timeline.map(item => item.price))),
        maxPrice: Math.round(Math.max(...timeline.map(item => item.price))),
        avgPrice: Math.round(timeline.reduce((sum, item) => sum + item.price, 0) / timeline.length),
        currency: currency.toUpperCase()
      }
    }

    if (!cheapestDate && timeline.length) {
      const bestPoint = timeline.reduce((best, item) => item.price < best.price ? item : best, timeline[0])
      cheapestDate = { date: bestPoint.departureDate, price: bestPoint.price }
    }

    const route = {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      currency: currency.toUpperCase(),
      cabin,
      startDate,
      endDate,
      date: cheapestDate?.date || startDate,
      source
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
      summary,
      cheapestDate
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

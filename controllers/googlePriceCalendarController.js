import { getRoundtripPriceCalendar } from '../services/googlePriceCalendarService.js'

function isDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function sanitizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function sanitizeOptional(value) {
  if (value == null) {
    return undefined
  }
  const trimmed = sanitizeString(value)
  return trimmed === '' ? undefined : trimmed
}

export async function getGoogleRoundtripCalendar(req, res) {
  try {
    const departureId = sanitizeString(req.query.departureId)
    const arrivalId = sanitizeString(req.query.arrivalId)
    const departureDate = sanitizeString(req.query.departureDate)
    const arrivalDate = sanitizeString(req.query.arrivalDate)

    if (!departureId || !arrivalId || !departureDate || !arrivalDate) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants',
        required: ['departureId', 'arrivalId', 'departureDate', 'arrivalDate'],
        message: 'Les identifiants d\'aéroports et les dates de voyage sont nécessaires'
      })
    }

    if (!isDate(departureDate) || !isDate(arrivalDate)) {
      return res.status(400).json({
        success: false,
        error: 'Format de date invalide',
        message: 'Les dates doivent être au format YYYY-MM-DD'
      })
    }

    const departure = new Date(`${departureDate}T00:00:00Z`)
    const arrival = new Date(`${arrivalDate}T00:00:00Z`)

    if (Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime()) || arrival <= departure) {
      return res.status(400).json({
        success: false,
        error: 'Période invalide',
        message: 'La date de retour doit être postérieure à la date de départ'
      })
    }

    const optionalParams = {
      startDate: sanitizeOptional(req.query.startDate),
      endDate: sanitizeOptional(req.query.endDate),
      daysBetween: sanitizeOptional(req.query.daysBetween),
      language: sanitizeOptional(req.query.language),
      location: sanitizeOptional(req.query.location),
      currency: sanitizeOptional(req.query.currency),
      adults: sanitizeOptional(req.query.adults),
      children: sanitizeOptional(req.query.children),
      infantsInSeat: sanitizeOptional(req.query.infantsInSeat),
      infantsOnLap: sanitizeOptional(req.query.infantsOnLap),
      cabinClass: sanitizeOptional(req.query.cabinClass)
    }

    const params = {
      departureId,
      arrivalId,
      departureDate,
      arrivalDate,
      ...optionalParams
    }

    const calendar = await getRoundtripPriceCalendar(params)

    res.json({
      success: true,
      query: params,
      results: calendar.entries,
      meta: calendar.meta
    })
  } catch (error) {
    console.error('❌ Erreur Google Price Calendar:', error.message)

    if (error.status) {
      return res.status(error.status).json({
        success: false,
        error: error.message
      })
    }

    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du calendrier de prix',
      message: error.message
    })
  }
}

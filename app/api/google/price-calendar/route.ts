import { NextRequest, NextResponse } from 'next/server'
import { getRoundtripPriceCalendar } from '@/services-backend/googlePriceCalendarService.js'

export const runtime = 'nodejs'

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function sanitizeOptional(value: string | null) {
  if (value == null) return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams
    const departureId = search.get('departureId')?.trim() ?? ''
    const arrivalId = search.get('arrivalId')?.trim() ?? ''
    const departureDate = search.get('departureDate')?.trim() ?? ''
    const arrivalDate = search.get('arrivalDate')?.trim() ?? ''

    if (!departureId || !arrivalId || !departureDate || !arrivalDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paramètres manquants',
          required: ['departureId', 'arrivalId', 'departureDate', 'arrivalDate'],
          message: 'Les identifiants d\'aéroports et les dates de voyage sont nécessaires'
        },
        { status: 400 }
      )
    }

    if (!isDate(departureDate) || !isDate(arrivalDate)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Format de date invalide',
          message: 'Les dates doivent être au format YYYY-MM-DD'
        },
        { status: 400 }
      )
    }

    const departure = new Date(`${departureDate}T00:00:00Z`)
    const arrival = new Date(`${arrivalDate}T00:00:00Z`)
    if (Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime()) || arrival <= departure) {
      return NextResponse.json(
        {
          success: false,
          error: 'Période invalide',
          message: 'La date de retour doit être postérieure à la date de départ'
        },
        { status: 400 }
      )
    }

    const params = {
      departureId,
      arrivalId,
      departureDate,
      arrivalDate,
      startDate: sanitizeOptional(search.get('startDate')),
      endDate: sanitizeOptional(search.get('endDate')),
      daysBetween: sanitizeOptional(search.get('daysBetween')),
      language: sanitizeOptional(search.get('language')),
      location: sanitizeOptional(search.get('location')),
      currency: sanitizeOptional(search.get('currency')),
      adults: sanitizeOptional(search.get('adults')),
      children: sanitizeOptional(search.get('children')),
      infantsInSeat: sanitizeOptional(search.get('infantsInSeat')),
      infantsOnLap: sanitizeOptional(search.get('infantsOnLap')),
      cabinClass: sanitizeOptional(search.get('cabinClass'))
    }

    const calendar = await getRoundtripPriceCalendar(params)
    return NextResponse.json({
      success: true,
      query: params,
      results: calendar.entries,
      meta: calendar.meta
    })
  } catch (error: unknown) {
    const status = typeof error === 'object' && error && 'status' in error
      ? Number((error as { status?: number }).status) || 500
      : 500
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('❌ Erreur Google Price Calendar:', message)

    return NextResponse.json(
      {
        success: false,
        error: status !== 500 ? message : 'Erreur lors de la récupération du calendrier de prix',
        message
      },
      { status }
    )
  }
}

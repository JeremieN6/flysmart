import { NextRequest, NextResponse } from 'next/server'
import { analyzePricesWithFlightSky } from '@/services-backend/flightsSkyService.js'
import { fetchFlightPrices } from '@/services-backend/flightApiService.js'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams
    const from = search.get('from')?.trim() ?? ''
    const to = search.get('to')?.trim() ?? ''
    const startDate = search.get('startDate')?.trim() ?? ''
    const endDate = search.get('endDate')?.trim() ?? ''
    const currency = search.get('currency')?.trim() || 'EUR'
    const cabin = search.get('cabin')?.trim() || 'Economy'
    const market = search.get('market')?.trim() || process.env.FLIGHTSKY_MARKET || 'FR'
    const locale = search.get('locale')?.trim() || process.env.FLIGHTSKY_LOCALE || 'fr-FR'

    if (!from || !to || !startDate || !endDate) {
      return NextResponse.json(
        {
          error: 'Paramètres manquants',
          required: ['from', 'to', 'startDate', 'endDate'],
          message: 'Veuillez spécifier les aéroports de départ, d\'arrivée et la période'
        },
        { status: 400 }
      )
    }

    if (!/^[A-Z]{3}$/i.test(from) || !/^[A-Z]{3}$/i.test(to)) {
      return NextResponse.json(
        {
          error: 'Codes IATA invalides',
          message: 'Les codes aéroport doivent contenir exactement 3 lettres (ex: CDG, JFK)'
        },
        { status: 400 }
      )
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return NextResponse.json(
        {
          error: 'Format de date invalide',
          message: 'Les dates doivent être au format YYYY-MM-DD'
        },
        { status: 400 }
      )
    }

    if (startDate >= endDate) {
      return NextResponse.json(
        {
          error: 'Période invalide',
          message: 'La date de fin doit être après la date de début'
        },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff > 30) {
      return NextResponse.json(
        {
          error: 'Période trop longue',
          message: 'La période ne peut pas dépasser 30 jours'
        },
        { status: 400 }
      )
    }

    console.log(`📊 Analyse FlightSky ${from} → ${to} du ${startDate} au ${endDate}`)

    let timeline: Array<{
      daysBefore: number
      price: number
      departureDate: string
      ranking: string | null
      recommendation: string | null
      purchaseDate?: string
    }> = []
    let summary: { minPrice: number; maxPrice: number; avgPrice: number; currency: string } | null = null
    let cheapestDate: { date: string; price: number } | null = null
    let source = 'flightsky'

    try {
      const result = await analyzePricesWithFlightSky({
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        startDate,
        endDate,
        currency: currency.toUpperCase(),
        market,
        locale
      })

      timeline = result.prices || []
      summary = result.summary || null
      cheapestDate = result.cheapestDate || null

      if (!timeline.length) {
        throw new Error('Aucune donnée FlightSky exploitables pour la période demandée')
      }
    } catch (error: unknown) {
      source = 'fallback'
      const message = error instanceof Error ? error.message : 'Erreur inconnue'
      console.warn('⚠️  FlightSky indisponible, utilisation du fallback local:', message)

      const fallback = await fetchFlightPrices(
        from.toUpperCase(),
        to.toUpperCase(),
        startDate,
        {
          currency: currency.toUpperCase(),
          cabin
        }
      )

      const departureDate = new Date(startDate)
      const basePoints: Array<{ daysBefore: number; price: number }> =
        (fallback.prices || []) as Array<{ daysBefore: number; price: number }>

      const ensureAnchorAt = (list: Array<{ daysBefore: number; price: number }>, daysBefore: number) => {
        if (!list.find(point => point.daysBefore === daysBefore)) {
          list.push({ daysBefore, price: list.length ? list[list.length - 1].price : 700 })
        }
      }

      const simulatedDays = [120, 105, 90, 75, 60, 50, 45, 40, 35, 30, 25, 21, 18, 15, 14, 12, 10, 7, 5, 3, 2, 1]
      simulatedDays.forEach(day => ensureAnchorAt(basePoints, day))

      const points = basePoints
        .map((point: { daysBefore: number; price: number }) => ({
          daysBefore: point.daysBefore,
          price: Math.round(point.price)
        }))
        .sort((a, b) => b.daysBefore - a.daysBefore)

      timeline = points
        .map(point => {
          const departure = new Date(departureDate)
          const purchaseDate = new Date(departure)
          purchaseDate.setDate(purchaseDate.getDate() - point.daysBefore)

          return {
            daysBefore: point.daysBefore,
            price: point.price,
            departureDate: departure.toISOString().split('T')[0],
            ranking: null,
            recommendation: null,
            purchaseDate: purchaseDate.toISOString().split('T')[0]
          }
        })
        .sort((a, b) => b.daysBefore - a.daysBefore)

      if (!timeline.length) {
        throw new Error('Impossible de générer des données de secours pour cette recherche')
      }

      summary = {
        minPrice: Math.round(Math.min(...timeline.map(item => item.price))),
        maxPrice: Math.round(Math.max(...timeline.map(item => item.price))),
        avgPrice: Math.round(timeline.reduce((sum, item) => sum + item.price, 0) / timeline.length),
        currency: currency.toUpperCase()
      }

      cheapestDate = timeline.reduce<{ date: string; price: number } | null>((best, item) => {
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
      const bestPoint = timeline.reduce((best, item) => (item.price < best.price ? item : best), timeline[0])
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

    return NextResponse.json({
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
  } catch (error: unknown) {
    const status = typeof error === 'object' && error && 'status' in error
      ? Number((error as { status?: number }).status) || 500
      : 500
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('❌ Erreur dans /api/flights/prices:', message)

    return NextResponse.json(
      {
        success: false,
        error: status !== 500 ? message : 'Erreur lors de l\'analyse des prix',
        message
      },
      { status }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getFlightOffers } from '@/lib/amadeus'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const origin         = searchParams.get('origin')?.toUpperCase().trim() ?? ''
  const destination    = searchParams.get('destination')?.toUpperCase().trim() ?? ''
  const departureDate  = searchParams.get('departureDate') ?? ''
  const currencyCode   = searchParams.get('currencyCode') ?? 'EUR'
  const nonStop        = searchParams.get('nonStop') === 'true'
  const max            = Math.min(parseInt(searchParams.get('max') ?? '5', 10), 20)

  if (!origin || !destination || !departureDate) {
    return NextResponse.json(
      { error: 'Paramètres manquants', required: ['origin', 'destination', 'departureDate'] },
      { status: 400 }
    )
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
    return NextResponse.json(
      { error: 'Format de date invalide. Attendu: YYYY-MM-DD' },
      { status: 400 }
    )
  }

  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Amadeus non configuré', message: 'Définissez AMADEUS_API_KEY et AMADEUS_API_SECRET_KEY' },
      { status: 503 }
    )
  }

  try {
    const offers = await getFlightOffers({ origin, destination, departureDate, currencyCode, nonStop, max })
    return NextResponse.json({ data: offers, count: offers.length })
  } catch (err) {
    const e = err as { status?: number; message?: string }
    return NextResponse.json(
      { error: e.message ?? 'Erreur Amadeus' },
      { status: e.status ?? 500 }
    )
  }
}

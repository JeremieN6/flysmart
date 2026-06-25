import { NextRequest, NextResponse } from 'next/server'
import { checkApiKey } from '@/lib/b2b-api'
import { analyzePrice, estimateBasePrice } from '@/lib/price-analysis'
import { getMinPrice } from '@/lib/amadeus'

export const runtime = 'nodejs'

// CORS pour usage cross-origin par les partenaires
const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  const auth = checkApiKey(req.headers)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: CORS_HEADERS })
  }

  let body: { origin?: string; destination?: string; month?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400, headers: CORS_HEADERS })
  }

  const origin      = (body.origin ?? '').toUpperCase().trim()
  const destination = (body.destination ?? '').toUpperCase().trim()
  const month       = body.month // ex: "2025-08"

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Paramètres manquants', required: ['origin', 'destination'] },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  // Construction d'une date de départ approximative à partir du mois
  let departureDate: string | null = null
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    departureDate = `${month}-15`
  }

  // Tentative d'appel Amadeus
  let basePrice: number | null = null
  let source: 'amadeus' | 'model' = 'model'

  if (departureDate) {
    const amadeusResult = await getMinPrice(origin, destination, departureDate)
    if (amadeusResult) {
      basePrice = amadeusResult.price
      source    = 'amadeus'
    }
  }

  if (!basePrice) {
    basePrice = estimateBasePrice(origin, destination)
  }

  const analysis = analyzePrice(origin, destination, basePrice, source)

  return NextResponse.json(
    {
      ...analysis,
      meta: {
        dataSource: analysis.source,
        isFallback: analysis.source === 'model'
      }
    },
    {
      headers: {
        ...CORS_HEADERS,
        'X-FlySmart-Data-Source': analysis.source,
        'X-FlySmart-Fallback': String(analysis.source === 'model')
      }
    }
  )
}

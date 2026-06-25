import { NextRequest, NextResponse } from 'next/server'
import { analyzePrice, estimateBasePrice } from '@/lib/price-analysis'
import { getMinPrice } from '@/lib/amadeus'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const origin      = searchParams.get('origin')?.toUpperCase().trim() ?? ''
  const destination = searchParams.get('destination')?.toUpperCase().trim() ?? ''
  const month       = searchParams.get('month') // ex: "07" ou "2026-07"

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Paramètres manquants', required: ['origin', 'destination'] },
      { status: 400 }
    )
  }

  // Normalise le mois → date approximative
  let departureDate: string | null = null
  if (month) {
    if (/^\d{4}-\d{2}$/.test(month)) {
      departureDate = `${month}-15`
    } else if (/^\d{2}$/.test(month)) {
      const year = new Date().getFullYear()
      const mm   = parseInt(month, 10)
      const y    = mm < new Date().getMonth() + 1 ? year + 1 : year
      departureDate = `${y}-${month.padStart(2, '0')}-15`
    }
  }

  // Appel Amadeus si possible
  let basePrice: number | null = null
  let source: 'amadeus' | 'model' = 'model'

  if (departureDate) {
    const res = await getMinPrice(origin, destination, departureDate)
    if (res) {
      basePrice = res.price
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
        'X-FlySmart-Data-Source': analysis.source,
        'X-FlySmart-Fallback': String(analysis.source === 'model')
      }
    }
  )
}

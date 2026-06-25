import { NextRequest, NextResponse } from 'next/server'
import { searchAirports } from '@/services-backend/airportSearchService.js'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('query')?.trim() ?? ''

    if (query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const results = searchAirports(query, 10)
    return NextResponse.json({ results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('Erreur lors de la recherche d\'aéroports:', message)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche d\'aéroports', message },
      { status: 500 }
    )
  }
}

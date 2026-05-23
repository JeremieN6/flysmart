import { NextResponse } from 'next/server'

export function GET() {
  const docs = {
    version:     '1.0',
    name:        'FlySmart B2B API',
    description: 'Analysez le timing d\'achat optimal pour vos vols. Idéal pour blogs voyage, agences, CE.',
    base_url:    'https://flysmart.app/api',
    auth: {
      type:        'api_key',
      header:      'X-API-Key',
      demo_key:    'flysmart-trailix-test-key',
      rate_limit:  '100 req/h par clé',
    },
    endpoints: [
      {
        method: 'POST',
        path:   '/api/analyze',
        description: 'Analyse complète + courbe de prix 12 semaines',
        auth_required: true,
        body: {
          origin:       'Code IATA (ex: CDG)',
          destination:  'Code IATA (ex: JFK)',
          month:        'Mois de départ (ex: 2026-07) — optionnel',
        },
        response_example: {
          priceLevel:                  'LOW',
          bestBookingWindow:           '6–8 semaines avant',
          potentialSavingsVsLastMinute: 320,
          current_price:               285,
          currency:                    'EUR',
          source:                      'amadeus',
          chart: [{ week: -12, label: 'S-12', price: 480, zone: 'too_early' }, '…12 points total'],
        },
      },
      {
        method: 'GET',
        path:   '/api/price-trends',
        description: 'Analyse de tendances (alternative GET)',
        auth_required: false,
        query_params: {
          origin:      'Code IATA',
          destination: 'Code IATA',
          month:       'Mois (ex: 07 ou 2026-07) — optionnel',
        },
      },
      {
        method: 'GET',
        path:   '/api/flight-prices',
        description: 'Proxy Amadeus — offres de vols en temps réel',
        auth_required: false,
        query_params: {
          origin:        'Code IATA',
          destination:   'Code IATA',
          departureDate: 'Format YYYY-MM-DD',
          adults:        '1 (défaut)',
          currencyCode:  'EUR (défaut)',
          nonStop:       'false (défaut)',
          max:           '5 résultats (max 20)',
        },
      },
    ],
  }

  return NextResponse.json(docs)
}

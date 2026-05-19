/* ─────────────────────────────────────────────────────────────
   Intégration Amadeus — gestion OAuth token + lookups
───────────────────────────────────────────────────────────── */

interface AmadeusToken {
  access_token: string
  expires_at: number
}

let cachedToken: AmadeusToken | null = null

const BASE_URL =
  process.env.AMADEUS_API_BASE_URL ?? 'https://test.api.amadeus.com'

async function getAccessToken(): Promise<string> {
  const key    = process.env.AMADEUS_API_KEY
  const secret = process.env.AMADEUS_API_SECRET_KEY ?? process.env.AMADEUS_API_SECRET

  if (!key || !secret) {
    throw Object.assign(new Error('Amadeus credentials manquantes'), { status: 503 })
  }

  // Retourne le token en cache s'il reste > 60 s de validité
  if (cachedToken && Date.now() < cachedToken.expires_at - 60_000) {
    return cachedToken.access_token
  }

  const body = new URLSearchParams({
    grant_type:    'client_credentials',
    client_id:     key,
    client_secret: secret,
  })

  const res = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    body.toString(),
  })

  if (!res.ok) {
    throw Object.assign(
      new Error(`Amadeus OAuth error ${res.status}`),
      { status: res.status }
    )
  }

  const data = await res.json()
  cachedToken = {
    access_token: data.access_token,
    expires_at:   Date.now() + data.expires_in * 1000,
  }
  return cachedToken.access_token
}

export interface FlightOffer {
  price:     number
  currency:  string
  origin:    string
  destination: string
  departureDate: string
}

/**
 * Récupère des offres de vol depuis l'API Amadeus.
 * Renvoie un tableau trié par prix croissant.
 */
export async function getFlightOffers(params: {
  origin:         string
  destination:    string
  departureDate:  string
  adults?:        number
  currencyCode?:  string
  nonStop?:       boolean
  max?:           number
}): Promise<FlightOffer[]> {
  const token = await getAccessToken()

  const query = new URLSearchParams({
    originLocationCode:      params.origin,
    destinationLocationCode: params.destination,
    departureDate:           params.departureDate,
    adults:                  String(params.adults ?? 1),
    currencyCode:            params.currencyCode ?? 'EUR',
    nonStop:                 String(params.nonStop ?? false),
    max:                     String(params.max ?? 5),
  })

  const res = await fetch(
    `${BASE_URL}/v2/shopping/flight-offers?${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw Object.assign(
      new Error(err?.errors?.[0]?.detail ?? `Amadeus flight-offers error ${res.status}`),
      { status: res.status }
    )
  }

  const data = await res.json()
  return (data.data ?? []).map((offer: Record<string, unknown>) => {
    const pricing = offer.price as { total?: string; currency?: string }
    return {
      price:        parseFloat(pricing?.total ?? '0'),
      currency:     pricing?.currency ?? 'EUR',
      origin:       params.origin,
      destination:  params.destination,
      departureDate: params.departureDate,
    }
  }).sort((a: FlightOffer, b: FlightOffer) => a.price - b.price)
}

/**
 * Récupère le prix minimal pour une route et une date.
 * Renvoie null si Amadeus n'est pas configuré (pas de crash).
 */
export async function getMinPrice(
  origin: string,
  destination: string,
  departureDate: string,
  currencyCode = 'EUR'
): Promise<{ price: number; currency: string } | null> {
  try {
    const offers = await getFlightOffers({ origin, destination, departureDate, currencyCode, max: 3 })
    if (!offers.length) return null
    return { price: offers[0].price, currency: offers[0].currency }
  } catch {
    return null
  }
}

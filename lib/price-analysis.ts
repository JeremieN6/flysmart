/* ─────────────────────────────────────────────────────────────
   Moteur "best time to buy" — FlySmart
   Modèle empirique S-12 → S-1 (12 semaines avant départ)
───────────────────────────────────────────────────────────── */

export interface PricePoint {
  week: number   // ex: -12 … -1
  label: string  // ex: "S-12"
  price: number
  isOptimal?: boolean
  zone: 'too_early' | 'transition' | 'optimal' | 'too_late'
}

export interface PriceAnalysis {
  priceLevel: 'LOW' | 'AVERAGE' | 'HIGH'
  price_level_label: string
  bestBookingWindow: string
  potentialSavingsVsLastMinute: number
  chart: PricePoint[]
  current_price: number
  currency: string
  source: 'amadeus' | 'model'
  recommendation: string
  score: number
  best_window: string
  price_trend: string
  confidence: 'high' | 'medium' | 'low'
  potential_savings: number
  price_level: 'LOW' | 'AVERAGE' | 'HIGH'
  route?: string
}

/* Multiplicateurs relatifs de la courbe empirique (S-12 = index 0, S-1 = index 11) */
const CURVE_MULTIPLIERS = [
  1.28,  // S-12 : trop tôt, prix premium
  1.22,  // S-11
  1.15,  // S-10
  1.07,  // S-9  : descente
  0.95,  // S-8
  0.88,  // S-7  : transition
  0.82,  // S-6  : zone optimale
  0.78,  // S-5  ◀ minimum absolu
  0.80,  // S-4  : encore optimal
  0.92,  // S-3  : remontée
  1.10,  // S-2  : forte remontée
  1.45,  // S-1  : last-minute
]

const ZONE_MAP: PricePoint['zone'][] = [
  'too_early', 'too_early', 'too_early',
  'transition', 'transition',
  'transition',
  'optimal', 'optimal', 'optimal',
  'too_late', 'too_late', 'too_late',
]

/**
 * Génère la courbe de 12 points pour une route donnée.
 * @param basePrice  prix de référence (peut venir d'Amadeus ou estimé par route)
 */
export function buildPriceChart(basePrice: number): PricePoint[] {
  return CURVE_MULTIPLIERS.map((mult, i) => {
    const week = -(12 - i)
    return {
      week,
      label: `S${week}`,
      price: Math.round(basePrice * mult),
      isOptimal: i === 7, // S-5
      zone: ZONE_MAP[i],
    }
  })
}

/**
 * Estime un prix de référence réaliste en fonction de la route.
 */
export function estimateBasePrice(origin: string, destination: string): number {
  const longHaul = new Set(['JFK','EWR','LAX','SFO','ORD','MIA','ATL','NRT','HND','ICN','SYD','MEL','BKK','SIN','DXB','DOH','GRU','GIG','YYZ','YUL','PEK','PVG','DEL','BOM'])
  const mediumHaul = new Set(['BCN','MAD','FCO','MXP','FRA','MUC','BER','AMS','LHR','LGW','ZRH','GVA','ATH','IST','CAI','CMN','ALG','TUN','DXB','DOH'])

  const isLong   = longHaul.has(origin) || longHaul.has(destination)
  const isMedium = mediumHaul.has(origin) || mediumHaul.has(destination)

  if (isLong)   return 420 + Math.floor(Math.random() * 200)
  if (isMedium) return 180 + Math.floor(Math.random() * 120)
  return 90 + Math.floor(Math.random() * 80)
}

/**
 * Produit l'analyse complète à partir d'un prix de base.
 */
export function analyzePrice(
  origin: string,
  destination: string,
  basePrice: number,
  source: 'amadeus' | 'model' = 'model',
  currency = 'EUR'
): PriceAnalysis {
  const chart = buildPriceChart(basePrice)
  const optimal = chart.find((p) => p.isOptimal)!
  const lastMinute = chart[chart.length - 1]
  const savings = lastMinute.price - optimal.price

  const priceVsOptimal = basePrice / optimal.price
  let priceLevel: PriceAnalysis['priceLevel']
  let priceLevelLabel: string
  if (priceVsOptimal <= 1.05) { priceLevel = 'LOW'; priceLevelLabel = 'Bas' }
  else if (priceVsOptimal <= 1.2) { priceLevel = 'AVERAGE'; priceLevelLabel = 'Moyen' }
  else { priceLevel = 'HIGH'; priceLevelLabel = 'Élevé' }

  const score = priceLevel === 'LOW' ? 89 : priceLevel === 'AVERAGE' ? 65 : 42

  return {
    priceLevel,
    price_level_label: priceLevelLabel,
    price_level: priceLevel,
    bestBookingWindow: '6–8 semaines avant',
    best_window: '45–60 jours avant',
    potentialSavingsVsLastMinute: savings,
    potential_savings: savings,
    chart,
    current_price: basePrice,
    currency,
    source,
    recommendation: priceLevel === 'LOW' ? 'Achetez maintenant' : priceLevel === 'AVERAGE' ? 'Attendez si possible' : 'Attendez la fenêtre optimale',
    score,
    price_trend: priceLevel === 'LOW' ? 'hausse imminente' : priceLevel === 'AVERAGE' ? 'stable à court terme' : 'descente attendue',
    confidence: source === 'amadeus' ? 'high' : 'medium',
    route: `${origin} → ${destination}`,
  }
}

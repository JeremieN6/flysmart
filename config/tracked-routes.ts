/* ─────────────────────────────────────────────────────────────
   Routes suivies par la collecte quotidienne de prix.

   POUR AJOUTER UNE ROUTE : ajouter une ligne ci-dessous et relancer
   le job. Rien d autre a modifier. Les codes doivent exister dans
   lib/airports.ts.

   POUR SUSPENDRE UNE ROUTE sans perdre son historique : passer
   enabled a false plutot que de supprimer la ligne.
───────────────────────────────────────────────────────────── */

export interface TrackedRoute {
  origin: string
  destination: string
  label: string
  enabled?: boolean
}

export const TRACKED_ROUTES: TrackedRoute[] = [
  { origin: 'CDG', destination: 'MRS', label: 'Paris - Marseille' },
  { origin: 'CDG', destination: 'NCE', label: 'Paris - Nice' },
  { origin: 'CDG', destination: 'TLS', label: 'Paris - Toulouse' },
  { origin: 'CDG', destination: 'BOD', label: 'Paris - Bordeaux' },
  { origin: 'CDG', destination: 'BCN', label: 'Paris - Barcelone' },
  { origin: 'CDG', destination: 'MXP', label: 'Paris - Milan' },
  { origin: 'CDG', destination: 'AMS', label: 'Paris - Amsterdam' },
  { origin: 'CDG', destination: 'LHR', label: 'Paris - Londres' },
  { origin: 'CDG', destination: 'JFK', label: 'Paris - New York' },
  { origin: 'CDG', destination: 'FRA', label: 'Paris - Francfort' },
]

/**
 * Horizons releves chaque jour, en jours avant le depart.
 * Un snapshot est enregistre par (route x horizon).
 */
export const TRACKED_HORIZONS = [7, 15, 30, 45, 60, 90] as const

/** Identifiant stable d une route, utilise comme cle d index en base. */
export const routeKey = (origin: string, destination: string) =>
  `${origin}-${destination}`

export const activeRoutes = () =>
  TRACKED_ROUTES.filter((route) => route.enabled !== false)

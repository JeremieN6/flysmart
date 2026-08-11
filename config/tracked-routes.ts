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

/* ─────────────────────────────────────────────────────────────
   BUDGET D APPELS — a relire avant toute activation.

   Le plan FlightSky autorise 100 requetes par mois. Une route active
   consomme 1 appel par jour, soit ~30 par mois. Le budget tient donc
   3 routes actives, pas davantage.

     routes actives x 30 <= quota mensuel

   Le collecteur affiche le quota restant a chaque execution. Depasser
   le plafond n arrete pas seulement les nouvelles routes : il coupe
   la collecte de TOUTES les routes jusqu au reset mensuel.
───────────────────────────────────────────────────────────── */

export const TRACKED_ROUTES: TrackedRoute[] = [
  // ── Actives : long-courrier au depart de CDG ────────────────
  // C est la ou l ecart d achat porte sur des centaines d euros et
  // non sur une vingtaine. Hypothese a verifier : aucune mesure
  // long-courrier n existe encore, ces trois routes servent d abord
  // a la tester.
  { origin: 'CDG', destination: 'JFK', label: 'Paris - New York' },
  { origin: 'CDG', destination: 'DXB', label: 'Paris - Dubai' },
  { origin: 'CDG', destination: 'YUL', label: 'Paris - Montreal' },

  // ── Suspendues : court et moyen-courrier ────────────────────
  // Historique conserve en base, collecte arretee faute de quota.
  // Ecarts releves le 11/08/2026 : forts en pourcentage (+40 a +47 %)
  // mais faibles en euros (17 a 27 EUR), trop peu pour justifier
  // l abonnement. A rouvrir si le plan API est releve.
  { origin: 'CDG', destination: 'MRS', label: 'Paris - Marseille', enabled: false },
  { origin: 'CDG', destination: 'NCE', label: 'Paris - Nice', enabled: false },
  { origin: 'CDG', destination: 'TLS', label: 'Paris - Toulouse', enabled: false },
  { origin: 'CDG', destination: 'BOD', label: 'Paris - Bordeaux', enabled: false },
  { origin: 'CDG', destination: 'BCN', label: 'Paris - Barcelone', enabled: false },
  { origin: 'CDG', destination: 'MXP', label: 'Paris - Milan', enabled: false },
  { origin: 'CDG', destination: 'AMS', label: 'Paris - Amsterdam', enabled: false },
  { origin: 'CDG', destination: 'LHR', label: 'Paris - Londres', enabled: false },
  { origin: 'CDG', destination: 'FRA', label: 'Paris - Francfort', enabled: false },
]

/** Appels consommes par mois pour la configuration courante. */
export const monthlyCallBudget = () => activeRoutes().length * 30

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

/* ─────────────────────────────────────────────────────────────
   Logique de collecte, independante de son declencheur.

   Appelee par le worker BullMQ (execution planifiee) comme par
   scripts/collect-prices.ts (lancement manuel). Aucune dependance a
   Redis ici : la collecte reste utilisable si la file est indisponible.

   Un seul appel API par route : le price-calendar FlightSky renvoie
   tout le calendrier, on y lit les six horizons.
───────────────────────────────────────────────────────────── */

import { analyzePricesWithFlightSky, getLastQuota } from '../services-backend/flightsSkyService.js'
import { activeRoutes, monthlyCallBudget, routeKey, TRACKED_HORIZONS, type TrackedRoute } from '../config/tracked-routes.ts'
import { insertPriceSnapshots, type PriceSnapshotInput } from './price-snapshots-db.ts'

const iso = (d: Date) => d.toISOString().split('T')[0]

const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export interface RouteOutcome {
  route: string
  label: string
  collected: number
  /** Horizons sans tarif publie : on note le trou, on n interpole pas. */
  missing: number[]
  error?: string
}

export interface CollectionReport {
  startedAt: string
  durationMs: number
  routesTotal: number
  routesFailed: number
  snapshotsWritten: number
  outcomes: RouteOutcome[]
  quota: { limit: number; remaining: number; resetSeconds: number | null } | null
}

async function collectRoute(route: TrackedRoute, today: Date): Promise<RouteOutcome> {
  const key = routeKey(route.origin, route.destination)
  const outcome: RouteOutcome = { route: key, label: route.label, collected: 0, missing: [] }
  const maxHorizon = Math.max(...TRACKED_HORIZONS)

  let result: { prices?: Array<{ departureDate: string; price: number }> }
  try {
    result = await analyzePricesWithFlightSky({
      from: route.origin,
      to: route.destination,
      startDate: iso(today),
      endDate: iso(addDays(today, maxHorizon + 1)),
      currency: 'EUR',
      market: 'FR',
      locale: 'fr-FR',
    })
  } catch (error) {
    outcome.error = error instanceof Error ? error.message : String(error)
    return outcome
  }

  // Indexation par date de depart : plus fiable que le daysBefore renvoye
  // par l API, qui depend de l heure d execution.
  const byDate = new Map<string, number>()
  for (const p of result.prices ?? []) {
    if (p?.departureDate && Number.isFinite(p.price)) {
      byDate.set(String(p.departureDate).slice(0, 10), Number(p.price))
    }
  }

  const snapshots: PriceSnapshotInput[] = []
  for (const horizon of TRACKED_HORIZONS) {
    const departureDate = iso(addDays(today, horizon))
    const price = byDate.get(departureDate)

    if (price === undefined) {
      outcome.missing.push(horizon)
      continue
    }

    snapshots.push({
      route: key,
      origin: route.origin,
      destination: route.destination,
      departureDate,
      daysUntilDeparture: horizon,
      price,
      currency: 'EUR',
      // price-calendar ne renvoie pas la compagnie : reste null.
      airline: null,
      source: 'flightsky',
    })
  }

  try {
    outcome.collected = await insertPriceSnapshots(snapshots)
  } catch (error) {
    outcome.error = `ecriture en base : ${error instanceof Error ? error.message : String(error)}`
  }

  return outcome
}

/**
 * Releve toutes les routes actives.
 * Un echec sur une route n interrompt pas les autres.
 * @param log recoit une ligne par route, pour affichage console ou logs worker.
 */
export async function collectAllRoutes(
  log: (line: string) => void = () => {},
): Promise<CollectionReport> {
  const started = Date.now()
  const today = new Date()
  const routes = activeRoutes()

  log(`${routes.length} routes x ${TRACKED_HORIZONS.length} horizons (${TRACKED_HORIZONS.join(', ')})`)

  const outcomes: RouteOutcome[] = []
  for (const route of routes) {
    const outcome = await collectRoute(route, today)
    outcomes.push(outcome)

    if (outcome.error) {
      log(`  ✗ ${outcome.label.padEnd(20)} ECHEC — ${outcome.error}`)
    } else {
      const gaps = outcome.missing.length ? `  (sans tarif : J+${outcome.missing.join(', J+')})` : ''
      log(`  ✓ ${outcome.label.padEnd(20)} ${outcome.collected} snapshots${gaps}`)
    }

    // Espacement des appels : evite de saturer le quota RapidAPI.
    await new Promise((r) => setTimeout(r, 500))
  }

  const quota = getLastQuota()

  if (quota && Number.isFinite(quota.remaining)) {
    const budget = monthlyCallBudget()
    const daysLeft = Math.floor(quota.remaining / Math.max(routes.length, 1))
    log(
      `quota API : ${quota.remaining}/${quota.limit} restantes ` +
        `(~${daysLeft} jours au rythme actuel, budget mensuel ${budget} appels)`,
    )

    if (daysLeft <= 3) {
      log(
        `⚠ quota bientot epuise : la collecte s arretera pour TOUTES les routes. ` +
          `Reduire le nombre de routes actives ou relever le plan.`,
      )
    }
  }

  return {
    startedAt: new Date(started).toISOString(),
    durationMs: Date.now() - started,
    routesTotal: routes.length,
    routesFailed: outcomes.filter((o) => o.error).length,
    snapshotsWritten: outcomes.reduce((sum, o) => sum + o.collected, 0),
    outcomes,
    quota,
  }
}

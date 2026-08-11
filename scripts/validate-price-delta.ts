/* ─────────────────────────────────────────────────────────────
   validate-price-delta — mesure l'ecart de prix entre un achat
   a horizon lointain (~J-60) et un achat tardif (~J-15).

   LIMITE METHODOLOGIQUE — a lire avant d'exploiter les chiffres
   ─────────────────────────────────────────────────────────────
   L'API FlightSky (price-calendar) ne renvoie que le prix DU JOUR
   pour chaque date de depart future. Elle n'expose aucun historique
   (toute date anterieure a aujourd'hui est rejetee, et il n'existe
   pas d'endpoint price-history).

   Consequence : en une seule execution on ne peut PAS observer le
   meme vol achete a deux moments differents. Ce script produit donc
   une mesure TRANSVERSALE :

     prix d'un billet dont le depart est dans ~60 jours
     vs prix d'un billet dont le depart est dans ~15 jours

   Ce sont deux vols differents, pas le meme vol suivi dans le temps.
   L'ecart mesure melange l'effet "horizon d'achat" et l'effet
   "saisonnalite / demande propre a chaque date".

   Pour obtenir un vrai delta LONGITUDINAL : ce script ecrit un
   snapshot horodate dans scripts/output/. En le relancant ~45 jours
   plus tard, les dates de depart observees ici a J-60 seront alors a
   J-15, et compare-snapshots (voir README en fin de fichier) donnera
   l'ecart reel sur le meme vol.
───────────────────────────────────────────────────────────── */

import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { analyzePricesWithFlightSky } from '../services-backend/flightsSkyService.js'

/* ── Parametres ─────────────────────────────────────────────── */

const ROUTES = [
  { from: 'CDG', to: 'LYS', label: 'Paris - Lyon' },
  { from: 'CDG', to: 'MRS', label: 'Paris - Marseille' },
  { from: 'CDG', to: 'NCE', label: 'Paris - Nice' },
  { from: 'CDG', to: 'TLS', label: 'Paris - Toulouse' },
  { from: 'CDG', to: 'BOD', label: 'Paris - Bordeaux' },
  { from: 'CDG', to: 'BCN', label: 'Paris - Barcelone' },
  { from: 'CDG', to: 'AMS', label: 'Paris - Amsterdam' },
  { from: 'CDG', to: 'MXP', label: 'Paris - Milan' },
]

const FAR_HORIZON = 60
const NEAR_HORIZON = 15
/** Tolerance autour de l'horizon cible, pour retomber sur un mardi/mercredi. */
const HORIZON_TOLERANCE = 6
/** Nombre de couples (lointain, proche) vises par route. */
const PAIRS_PER_ROUTE = 3

/**
 * Vacances scolaires francaises (zone C / Paris) chevauchant la periode observee.
 * Dates approximatives : a reverifier sur le calendrier officiel education.gouv.fr
 * avant toute publication d'un chiffre qui en depend.
 */
const SCHOOL_HOLIDAYS: Array<{ start: string; end: string; name: string }> = [
  { start: '2026-07-04', end: '2026-08-31', name: 'Vacances d ete' },
  { start: '2026-10-17', end: '2026-11-02', name: 'Toussaint' },
  { start: '2026-12-19', end: '2027-01-04', name: 'Noel' },
]

/* ── Utilitaires ────────────────────────────────────────────── */

const TODAY = new Date()
const iso = (d: Date) => d.toISOString().split('T')[0]
const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Mardi (2) ou mercredi (3) — profil deplacement professionnel. */
const isMidWeek = (dateStr: string) => {
  const day = new Date(dateStr + 'T00:00:00Z').getUTCDay()
  return day === 2 || day === 3
}

const holidayFor = (dateStr: string) =>
  SCHOOL_HOLIDAYS.find((h) => dateStr >= h.start && dateStr <= h.end)?.name ?? null

const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`
const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length

/* ── Types ──────────────────────────────────────────────────── */

interface Observation {
  departureDate: string
  daysBefore: number
  price: number
  holiday: string | null
}

interface Pair {
  far: Observation
  near: Observation
  deltaPct: number
  /** true si les deux dates sont hors vacances scolaires. */
  clean: boolean
}

interface RouteResult {
  route: string
  from: string
  to: string
  error?: string
  pairs: Pair[]
  meanDeltaPct: number | null
  meanDeltaPctClean: number | null
  /** Nombre de dates de depart tarifees renvoyees par l'API. */
  pricedDays: number
  calendarFirst: string | null
  calendarLast: string | null
}

/* ── Collecte ───────────────────────────────────────────────── */

async function measureRoute(route: (typeof ROUTES)[number]): Promise<RouteResult> {
  const base: RouteResult = {
    route: route.label,
    from: route.from,
    to: route.to,
    pairs: [],
    meanDeltaPct: null,
    meanDeltaPctClean: null,
    pricedDays: 0,
    calendarFirst: null,
    calendarLast: null,
  }

  let result
  try {
    result = await analyzePricesWithFlightSky({
      from: route.from,
      to: route.to,
      startDate: iso(TODAY),
      endDate: iso(addDays(TODAY, FAR_HORIZON + HORIZON_TOLERANCE + 1)),
      currency: 'EUR',
      market: 'FR',
      locale: 'fr-FR',
    })
  } catch (error) {
    return { ...base, error: error instanceof Error ? error.message : String(error) }
  }

  const points: Observation[] = (result.prices ?? []).map((p: {
    departureDate: string; daysBefore: number; price: number
  }) => ({
    departureDate: p.departureDate,
    daysBefore: p.daysBefore,
    price: p.price,
    holiday: holidayFor(p.departureDate),
  }))

  base.pricedDays = points.length
  const sorted = [...points].sort((a, b) => a.departureDate.localeCompare(b.departureDate))
  base.calendarFirst = sorted[0]?.departureDate ?? null
  base.calendarLast = sorted[sorted.length - 1]?.departureDate ?? null

  /** Candidats mardi/mercredi autour d'un horizon cible, du plus proche de la cible au plus loin. */
  const candidates = (target: number) =>
    points
      .filter(
        (p) =>
          isMidWeek(p.departureDate) &&
          Math.abs(p.daysBefore - target) <= HORIZON_TOLERANCE,
      )
      .sort((a, b) => Math.abs(a.daysBefore - target) - Math.abs(b.daysBefore - target))

  const far = candidates(FAR_HORIZON)
  const near = candidates(NEAR_HORIZON)

  const pairs: Pair[] = []
  for (let i = 0; i < Math.min(PAIRS_PER_ROUTE, far.length, near.length); i++) {
    const f = far[i]
    const n = near[i]
    pairs.push({
      far: f,
      near: n,
      deltaPct: ((n.price - f.price) / f.price) * 100,
      clean: !f.holiday && !n.holiday,
    })
  }

  base.pairs = pairs
  if (pairs.length) base.meanDeltaPct = mean(pairs.map((p) => p.deltaPct))
  const clean = pairs.filter((p) => p.clean)
  if (clean.length) base.meanDeltaPctClean = mean(clean.map((p) => p.deltaPct))

  return base
}

/* ── Diagnostic de profondeur d'historique ──────────────────── */

async function probeHistoricalDepth() {
  const probe = async (daysOffset: number) => {
    try {
      await analyzePricesWithFlightSky({
        from: 'CDG',
        to: 'LYS',
        startDate: iso(addDays(TODAY, daysOffset)),
        endDate: iso(addDays(TODAY, daysOffset + 5)),
        currency: 'EUR',
        market: 'FR',
        locale: 'fr-FR',
      })
      return { offset: daysOffset, ok: true, message: 'donnees renvoyees' }
    } catch (error) {
      return {
        offset: daysOffset,
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      }
    }
  }

  return {
    minus365: await probe(-365),
    minus30: await probe(-30),
    plus30: await probe(30),
  }
}

/* ── Amadeus : verification de disponibilite ────────────────── */

async function probeAmadeus() {
  const key = process.env.AMADEUS_API_KEY
  const secret = process.env.AMADEUS_API_SECRET_KEY ?? process.env.AMADEUS_API_SECRET
  if (!key || !secret) return { available: false, reason: 'credentials absentes' }

  const base = process.env.AMADEUS_API_BASE_URL ?? 'https://test.api.amadeus.com'
  try {
    const res = await fetch(`${base}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: key,
        client_secret: secret,
      }).toString(),
      signal: AbortSignal.timeout(15_000),
    })
    return res.ok
      ? { available: true, reason: `token obtenu sur ${base}` }
      : { available: false, reason: `HTTP ${res.status} sur ${base}` }
  } catch (error) {
    return {
      available: false,
      reason: `injoignable (${error instanceof Error ? error.message : String(error)}) sur ${base}`,
    }
  }
}

/* ── Rendu console ──────────────────────────────────────────── */

function line(char = '─', n = 78) {
  return char.repeat(n)
}

function report(results: RouteResult[]) {
  console.log('\n' + line('═'))
  console.log('DETAIL PAR ROUTE')
  console.log(line('═'))

  for (const r of results) {
    console.log(`\n▸ ${r.route}  (${r.from} → ${r.to})`)
    if (r.error) {
      console.log(`   ECHEC : ${r.error}`)
      continue
    }
    if (!r.pairs.length) {
      console.log('   Aucun couple mardi/mercredi exploitable sur les horizons vises.')
      continue
    }
    console.log(
      `   ${'depart J-60'.padEnd(22)}${'depart J-15'.padEnd(22)}${'delta'.padEnd(10)}hors vacances`,
    )
    for (const p of r.pairs) {
      const f = `${p.far.departureDate} ${String(p.far.price).padStart(4)}€`
      const n = `${p.near.departureDate} ${String(p.near.price).padStart(4)}€`
      console.log(
        `   ${f.padEnd(22)}${n.padEnd(22)}${pct(p.deltaPct).padEnd(10)}${p.clean ? 'oui' : 'NON'}`,
      )
    }
    console.log(
      `   Moyenne route : ${pct(r.meanDeltaPct!)}` +
        (r.meanDeltaPctClean !== null
          ? `   (hors vacances : ${pct(r.meanDeltaPctClean)})`
          : '   (aucun couple hors vacances)'),
    )
  }

  const ok = results.filter((r) => !r.error && r.pairs.length)
  const allPairs = ok.flatMap((r) => r.pairs)
  const cleanPairs = allPairs.filter((p) => p.clean)

  console.log('\n' + line('═'))
  console.log('SYNTHESE')
  console.log(line('═'))
  console.log(`Routes testees              : ${ROUTES.length}`)
  console.log(`Routes exploitables         : ${ok.length}`)
  console.log(`Couples de dates mesures    : ${allPairs.length}`)
  console.log(`  dont hors vacances        : ${cleanPairs.length}`)
  console.log(
    `\nDELTA MOYEN GLOBAL          : ${allPairs.length ? pct(mean(allPairs.map((p) => p.deltaPct))) : 'n/a'}`,
  )
  console.log(
    `DELTA MOYEN HORS VACANCES   : ${cleanPairs.length ? pct(mean(cleanPairs.map((p) => p.deltaPct))) : 'n/a — aucun couple hors vacances'}`,
  )

  if (cleanPairs.length === 0 && allPairs.length > 0) {
    console.log(
      '\n⚠  Aucun couple hors vacances scolaires : l horizon proche (~J-15) tombe\n' +
        '   mecaniquement dans la periode de vacances en cours. Le delta global est\n' +
        '   donc biaise par la demande loisir et NE DOIT PAS etre publie tel quel.',
    )
  }

  return { allPairs, cleanPairs, ok }
}

/* ── Entree ─────────────────────────────────────────────────── */

async function main() {
  console.log(line('═'))
  console.log('VALIDATION DE L ECART DE PRIX  —  ' + iso(TODAY))
  console.log(line('═'))
  console.log(
    'Mesure TRANSVERSALE : prix observe aujourd hui pour un depart a ~60 jours\n' +
      'vs prix observe aujourd hui pour un depart a ~15 jours. Ce sont deux vols\n' +
      'differents. Voir l entete du fichier pour la portee exacte de ce chiffre.',
  )

  console.log('\n' + line())
  console.log('DISPONIBILITE DES SOURCES')
  console.log(line())
  const amadeus = await probeAmadeus()
  console.log(`Amadeus   : ${amadeus.available ? 'disponible' : 'INDISPONIBLE'} — ${amadeus.reason}`)
  console.log('FlightSky : source utilisee pour toutes les mesures ci-dessous')

  console.log('\n' + line())
  console.log('PROFONDEUR D HISTORIQUE DISPONIBLE')
  console.log(line())
  const depth = await probeHistoricalDepth()
  console.log(`Requete a J-365 : ${depth.minus365.ok ? 'OK' : 'REFUSEE'} — ${depth.minus365.message}`)
  console.log(`Requete a J-30  : ${depth.minus30.ok ? 'OK' : 'REFUSEE'} — ${depth.minus30.message}`)
  console.log(`Requete a J+30  : ${depth.plus30.ok ? 'OK' : 'REFUSEE'} — ${depth.plus30.message}`)
  const historyYears = depth.minus365.ok || depth.minus30.ok ? 'a determiner' : '0 (aucun historique expose)'
  console.log(`\n➜ Profondeur d historique exploitable : ${historyYears}`)

  const results: RouteResult[] = []
  for (const route of ROUTES) {
    process.stdout.write(`\rMesure en cours : ${route.label}`.padEnd(60))
    results.push(await measureRoute(route))
    await new Promise((r) => setTimeout(r, 400))
  }
  process.stdout.write('\r'.padEnd(60) + '\r')

  const { allPairs, cleanPairs, ok } = report(results)

  const snapshot = {
    observedAt: new Date().toISOString(),
    observationDate: iso(TODAY),
    method:
      'transversal — prix du jour pour un depart a ~60j vs ~15j (deux vols differents)',
    source: 'flightsky/price-calendar',
    amadeus,
    historyDepth: { probes: depth, exploitableYears: historyYears },
    parameters: { FAR_HORIZON, NEAR_HORIZON, HORIZON_TOLERANCE, PAIRS_PER_ROUTE },
    schoolHolidays: SCHOOL_HOLIDAYS,
    routesTested: ROUTES.length,
    routesUsable: ok.length,
    globalMeanDeltaPct: allPairs.length ? mean(allPairs.map((p) => p.deltaPct)) : null,
    globalMeanDeltaPctClean: cleanPairs.length ? mean(cleanPairs.map((p) => p.deltaPct)) : null,
    routes: results,
  }

  const outDir = join(process.cwd(), 'scripts', 'output')
  mkdirSync(outDir, { recursive: true })
  const outFile = join(outDir, `price-delta-${iso(TODAY)}.json`)
  writeFileSync(outFile, JSON.stringify(snapshot, null, 2), 'utf8')

  console.log(`\nSnapshot ecrit : ${outFile}`)
  console.log(
    'Relancer ce script vers ' +
      iso(addDays(TODAY, FAR_HORIZON - NEAR_HORIZON)) +
      ' : les departs observes aujourd hui a ~J-60 seront alors a ~J-15,\n' +
      'ce qui donnera un ecart LONGITUDINAL reel sur les memes vols.',
  )
}

main().catch((error) => {
  console.error('\nEchec du script :', error)
  process.exitCode = 1
})

/* ─────────────────────────────────────────────────────────────
   Acces a la table price_snapshots, via Prisma.

   Le schema est gere par prisma/schema.prisma. Il n y a plus de
   CREATE TABLE ici : la table existe en base et Prisma la decrit.
───────────────────────────────────────────────────────────── */

import { prisma } from './prisma.ts'

export interface PriceSnapshotInput {
  route: string
  origin: string
  destination: string
  /** Format YYYY-MM-DD. */
  departureDate: string
  daysUntilDeparture: number
  price: number
  currency?: string
  airline?: string | null
  source?: string
}

/** Les colonnes DATE se comparent en UTC : on evite tout decalage de fuseau. */
const toDateOnly = (value: string) => new Date(`${value}T00:00:00.000Z`)

const todayDateOnly = () => toDateOnly(new Date().toISOString().slice(0, 10))

/**
 * Enregistre un lot de snapshots. Rejouable : un second passage le meme
 * jour met a jour les lignes existantes au lieu de les dupliquer, grace
 * a l index unique (route, departure_date, collected_on).
 * Renvoie le nombre de lignes ecrites.
 *
 * Volontairement SANS $transaction. Le calage precedent groupait les six
 * upserts dans une transaction, et le premier releve du matin echouait sur
 * "Unable to start a transaction in the given time" : le compute Neon
 * dort la nuit, son reveil depasse le maxWait de 2 s que Prisma applique
 * a l ouverture d une transaction. Une requete simple, elle, attend.
 *
 * L atomicite n apportait rien ici : chaque snapshot est un fait
 * independant et l upsert est idempotent. Sans transaction, un echec
 * partiel laisse les lignes deja ecrites en place au lieu de tout perdre.
 */
export async function insertPriceSnapshots(snapshots: PriceSnapshotInput[]) {
  if (!snapshots.length) return 0

  const collectedOn = todayDateOnly()

  let written = 0
  const errors: string[] = []

  for (const s of snapshots) {
    const departureDate = toDateOnly(s.departureDate)

    try {
      await prisma.priceSnapshot.upsert({
        where: {
          route_departureDate_collectedOn: {
            route: s.route,
            departureDate,
            collectedOn,
          },
        },
        create: {
          route: s.route,
          origin: s.origin,
          destination: s.destination,
          departureDate,
          collectedOn,
          daysUntilDeparture: s.daysUntilDeparture,
          price: s.price,
          currency: s.currency ?? 'EUR',
          airline: s.airline ?? null,
          source: s.source ?? 'flightsky',
        },
        update: {
          price: s.price,
          daysUntilDeparture: s.daysUntilDeparture,
          airline: s.airline ?? null,
          collectedAt: new Date(),
        },
      })
      written++
    } catch (error) {
      errors.push(
        `J+${s.daysUntilDeparture} : ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  // Echec total : on remonte l erreur pour que la route soit marquee en
  // echec et que BullMQ rejoue. Echec partiel : on garde ce qui est ecrit.
  if (written === 0 && errors.length) {
    throw new Error(errors[0])
  }

  return written
}

export interface PriceSnapshotRow {
  route: string
  origin: string
  destination: string
  departureDate: string
  collectedOn: string
  daysUntilDeparture: number
  price: number
  currency: string
  airline: string | null
  source: string
}

const asDateString = (d: Date) => d.toISOString().slice(0, 10)

/** Lecture brute, pour inspection manuelle. */
export async function listPriceSnapshots(
  options: { route?: string; limit?: number } = {},
): Promise<PriceSnapshotRow[]> {
  const rows = await prisma.priceSnapshot.findMany({
    where: options.route ? { route: options.route } : undefined,
    orderBy: [{ collectedOn: 'desc' }, { route: 'asc' }, { departureDate: 'asc' }],
    take: options.limit ?? 1000,
  })

  return rows.map((r) => ({
    route: r.route,
    origin: r.origin,
    destination: r.destination,
    departureDate: asDateString(r.departureDate),
    collectedOn: asDateString(r.collectedOn),
    daysUntilDeparture: r.daysUntilDeparture,
    price: Number(r.price),
    currency: r.currency,
    airline: r.airline,
    source: r.source,
  }))
}

/** Compte par jour de releve, pour verifier que la collecte tourne. */
export async function snapshotCoverage() {
  const grouped = await prisma.priceSnapshot.groupBy({
    by: ['collectedOn'],
    _count: { _all: true },
    orderBy: { collectedOn: 'desc' },
    take: 30,
  })

  // groupBy ne sait pas compter des valeurs distinctes : une passe de plus
  // pour le nombre de routes, sur un volume qui reste petit (30 jours).
  return Promise.all(
    grouped.map(async (g) => ({
      collectedOn: asDateString(g.collectedOn),
      rows: g._count._all,
      routes: (
        await prisma.priceSnapshot.findMany({
          where: { collectedOn: g.collectedOn },
          distinct: ['route'],
          select: { route: true },
        })
      ).length,
    })),
  )
}

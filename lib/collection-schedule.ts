/* ─────────────────────────────────────────────────────────────
   Planification de la collecte quotidienne.

   Pur et sans reseau : testable sans base ni API. Remplace la file
   BullMQ, dont le worker se reveillait toutes les 10 s pour un seul
   releve par jour (cf. tasks/lessons.md).
───────────────────────────────────────────────────────────── */

/** Heure du relevé quotidien, au format cron (fuseau ci-dessous). */
export const DAILY_PATTERN = process.env.COLLECT_CRON ?? '0 6 * * *'
export const DAILY_TIMEZONE = process.env.COLLECT_TZ ?? 'Europe/Paris'

export interface ClockTime {
  hour: number
  minute: number
}

/** Lit un motif "M H * * *". Toute autre forme : null (pas de rattrapage possible). */
export function parseDailyPattern(pattern: string): ClockTime | null {
  const match = /^\s*(\d{1,2})\s+(\d{1,2})\s+\*\s+\*\s+\*\s*$/.exec(pattern)
  if (!match) return null

  const minute = Number(match[1])
  const hour = Number(match[2])
  if (minute > 59 || hour > 23) return null

  return { hour, minute }
}

/** Heure et minute courantes dans le fuseau donne. */
export function clockIn(timeZone: string, now: Date = new Date()): ClockTime {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)

  const read = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { hour: read('hour'), minute: read('minute') }
}

/** L'heure planifiee du jour est-elle deja passee ? */
export function isPastDailyTime(scheduled: ClockTime, now: ClockTime): boolean {
  return now.hour * 60 + now.minute >= scheduled.hour * 60 + scheduled.minute
}

export const MAX_ATTEMPTS = 3
export const RETRY_BASE_DELAY_MS = 60_000

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Rejoue une collecte en echec total, avec un delai exponentiel (60 s puis
 * 120 s) : absorbe une panne passagere de FlightSky sans perdre la journee.
 * Un echec partiel (au moins un snapshot ecrit) n est pas rejoue : il
 * consommerait du quota API pour des routes deja collectees.
 * Leve la derniere erreur quand les tentatives sont epuisees.
 */
export async function runWithRetry<T extends { snapshotsWritten: number }>(
  collect: () => Promise<T>,
  options: {
    attempts?: number
    baseDelayMs?: number
    sleep?: (ms: number) => Promise<void>
    log?: (line: string) => void
  } = {},
): Promise<T> {
  const { attempts = MAX_ATTEMPTS, baseDelayMs = RETRY_BASE_DELAY_MS, sleep = defaultSleep, log = () => {} } = options

  let lastError: Error = new Error('aucune tentative')

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const report = await collect()
      if (report.snapshotsWritten > 0) return report
      lastError = new Error('aucune donnee collectee — echec total')
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }

    if (attempt < attempts) {
      const delay = baseDelayMs * 2 ** (attempt - 1)
      log(`tentative ${attempt}/${attempts} en echec (${lastError.message}), nouvel essai dans ${delay / 1000}s`)
      await sleep(delay)
    }
  }

  throw lastError
}

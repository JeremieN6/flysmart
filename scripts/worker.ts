/* ─────────────────────────────────────────────────────────────
   worker — processus resident qui lance la collecte quotidienne
   (npm run worker)

   A garder en vie sur le serveur (pm2, systemd, docker restart...).

   Un simple minuteur (node-cron), sans Redis ni file d attente : le
   worker BullMQ precedent se reveillait toutes les 10 s, 24h/24, pour
   un releve par jour, et epuisait seul le quota gratuit d Upstash.
───────────────────────────────────────────────────────────── */

import cron from 'node-cron'
import { collectAllRoutes } from '../lib/collect-prices.ts'
import {
  DAILY_PATTERN,
  DAILY_TIMEZONE,
  clockIn,
  isPastDailyTime,
  parseDailyPattern,
  runWithRetry,
} from '../lib/collection-schedule.ts'
import { hasCollectedToday } from '../lib/price-snapshots-db.ts'

let running = false

const log = (line: string) => console.log(`[worker] ${line}`)

async function collect(trigger: 'cron' | 'rattrapage') {
  // L API est limitee en quota : jamais deux collectes en parallele.
  if (running) {
    log(`collecte (${trigger}) ignoree : une collecte est deja en cours`)
    return
  }

  running = true
  log(`collecte (${trigger}) demarree`)

  try {
    const report = await runWithRetry(() => collectAllRoutes(log), { log })

    log(
      `collecte terminee : ${report.snapshotsWritten} snapshots, ` +
        `${report.routesFailed}/${report.routesTotal} routes en echec, ` +
        `${(report.durationMs / 1000).toFixed(1)}s`,
    )
  } catch (error) {
    console.error('[worker] collecte abandonnee :', error instanceof Error ? error.message : error)
  } finally {
    running = false
  }
}

/**
 * Si le process etait arrete a l heure du releve (redemarrage, panne), la
 * journee serait perdue : on collecte au demarrage, mais seulement si
 * l heure est passee et qu aucun releve n existe encore pour aujourd hui,
 * pour ne jamais consommer de quota API deux fois le meme jour.
 */
async function catchUpIfMissed() {
  const scheduled = parseDailyPattern(DAILY_PATTERN)
  if (!scheduled) return
  if (!isPastDailyTime(scheduled, clockIn(DAILY_TIMEZONE))) return

  try {
    if (await hasCollectedToday()) return
  } catch (error) {
    console.error('[worker] verification du rattrapage impossible :', error instanceof Error ? error.message : error)
    return
  }

  log('aucun releve aujourd hui alors que l heure est passee : rattrapage')
  await collect('rattrapage')
}

if (!cron.validate(DAILY_PATTERN)) {
  console.error(`[worker] COLLECT_CRON invalide : "${DAILY_PATTERN}"`)
  process.exit(1)
}

const task = cron.schedule(DAILY_PATTERN, () => void collect('cron'), { timezone: DAILY_TIMEZONE })

log(`collecte planifiee "${DAILY_PATTERN}" (${DAILY_TIMEZONE}), sans Redis`)
void catchUpIfMissed()

async function shutdown(signal: string) {
  log(`${signal} recu, arret propre...`)
  await task.stop()
  process.exit(0)
}

process.on('SIGTERM', () => void shutdown('SIGTERM'))
process.on('SIGINT', () => void shutdown('SIGINT'))

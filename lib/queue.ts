/* ─────────────────────────────────────────────────────────────
   File BullMQ de la collecte quotidienne.

   Redis est obligatoire : BullMQ ne sait pas fonctionner sans. Si
   REDIS_URL est absent, on echoue ici avec un message explicite
   plutot que de laisser ioredis boucler sur des reconnexions muettes.

   Le lancement manuel (npm run collect-prices) n importe pas ce
   module : la collecte reste possible sans Redis.
───────────────────────────────────────────────────────────── */

import { Queue, type ConnectionOptions } from 'bullmq'

export const QUEUE_NAME = 'price-collection'
export const JOB_NAME = 'collect-daily-prices'
export const SCHEDULER_ID = 'daily-price-collection'

/** Heure du relevé quotidien, au format cron (fuseau ci-dessous). */
export const DAILY_PATTERN = process.env.COLLECT_CRON ?? '0 6 * * *'
export const DAILY_TIMEZONE = process.env.COLLECT_TZ ?? 'Europe/Paris'

/**
 * Upstash n accepte que le TLS. Une URL en redis:// s y connecte puis se
 * fait fermer la connexion sans message clair ("Connection is closed"),
 * ce qui coute cher a diagnostiquer. On corrige le schema en le signalant.
 */
function normalizeRedisUrl(raw: string): string {
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return raw
  }

  const needsTls = parsed.hostname.endsWith('upstash.io')

  if (needsTls && parsed.protocol === 'redis:') {
    console.warn(
      `[queue] ${parsed.hostname} exige TLS : REDIS_URL corrige en rediss:// pour cette execution.\n` +
        '        Corriger la variable a la source pour eviter cet avertissement.',
    )
    parsed.protocol = 'rediss:'
    return parsed.toString()
  }

  return raw
}

export function redisConnection(): ConnectionOptions {
  const raw = process.env.REDIS_URL
  const url = raw ? normalizeRedisUrl(raw) : raw

  if (!url) {
    throw new Error(
      "REDIS_URL n'est pas configure. BullMQ exige une instance Redis.\n" +
        "  - Redis local   : REDIS_URL=redis://127.0.0.1:6379\n" +
        '  - Upstash/Redis Cloud : coller l URL rediss:// fournie\n' +
        'Sans Redis, utiliser npm run collect-prices (collecte directe, sans file).',
    )
  }

  return {
    url,
    // BullMQ impose cette valeur pour les commandes bloquantes.
    maxRetriesPerRequest: null,
    // Upstash restreint la commande INFO (NOPERM). Deux controles s appuient
    // dessus et doivent etre desactives, sinon la connexion echoue avant
    // d avoir servi : celui d ioredis, et celui de BullMQ qui lit la version
    // de Redis au demarrage.
    enableReadyCheck: false,
    skipVersionCheck: true,
  } as ConnectionOptions
}

let queue: Queue | undefined

export function priceQueue() {
  if (!queue) {
    queue = new Queue(QUEUE_NAME, { connection: redisConnection() })
  }
  return queue
}

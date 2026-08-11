/* ─────────────────────────────────────────────────────────────
   worker — processus resident qui execute les jobs de collecte
   (npm run worker)

   A garder en vie sur le serveur (pm2, systemd, docker restart...).
   Il ne declenche rien seul : c est le job scheduler enregistre par
   npm run schedule qui lui envoie le travail chaque jour.
───────────────────────────────────────────────────────────── */

import { Worker } from 'bullmq'
import { collectAllRoutes } from '../lib/collect-prices.ts'
import { QUEUE_NAME, redisConnection } from '../lib/queue.ts'

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log(`[worker] job ${job.id} (${job.name}) demarre`)

    const report = await collectAllRoutes((line) => console.log(`[worker] ${line}`))

    console.log(
      `[worker] job ${job.id} termine : ${report.snapshotsWritten} snapshots, ` +
        `${report.routesFailed}/${report.routesTotal} routes en echec, ` +
        `${(report.durationMs / 1000).toFixed(1)}s`,
    )

    // Echec total : on laisse BullMQ marquer le job en erreur et rejouer.
    if (report.snapshotsWritten === 0) {
      throw new Error('aucune donnee collectee — echec total')
    }

    return report
  },
  {
    connection: redisConnection(),
    // La collecte parle a une API externe limitee en quota :
    // un seul job a la fois.
    concurrency: 1,
  },
)

worker.on('failed', (job, error) => {
  console.error(`[worker] job ${job?.id} en echec :`, error.message)
})

worker.on('error', (error) => {
  console.error('[worker] erreur de connexion :', error.message)
})

console.log(`[worker] a l ecoute de la file "${QUEUE_NAME}"`)

async function shutdown(signal: string) {
  console.log(`[worker] ${signal} recu, arret propre...`)
  await worker.close()
  process.exit(0)
}

process.on('SIGTERM', () => void shutdown('SIGTERM'))
process.on('SIGINT', () => void shutdown('SIGINT'))

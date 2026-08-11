/* ─────────────────────────────────────────────────────────────
   schedule-collect — enregistre le releve quotidien dans BullMQ
   (npm run schedule)

     npm run schedule            installe / met a jour la planification
     npm run schedule -- --now   declenche en plus un job immediat
     npm run schedule -- --list  affiche la planification en place
     npm run schedule -- --remove supprime la planification

   A lancer une fois. La planification est persistee dans Redis :
   inutile de rejouer cette commande a chaque redemarrage du worker.
───────────────────────────────────────────────────────────── */

import {
  priceQueue,
  JOB_NAME,
  SCHEDULER_ID,
  DAILY_PATTERN,
  DAILY_TIMEZONE,
} from '../lib/queue.ts'

async function main() {
  const queue = priceQueue()

  if (process.argv.includes('--remove')) {
    await queue.removeJobScheduler(SCHEDULER_ID)
    console.log(`Planification "${SCHEDULER_ID}" supprimee.`)
    await queue.close()
    return
  }

  if (!process.argv.includes('--list')) {
    await queue.upsertJobScheduler(
      SCHEDULER_ID,
      { pattern: DAILY_PATTERN, tz: DAILY_TIMEZONE },
      {
        name: JOB_NAME,
        opts: {
          // Trois tentatives espacees : absorbe une panne passagere de
          // FlightSky sans perdre la journee de collecte.
          attempts: 3,
          backoff: { type: 'exponential', delay: 60_000 },
          removeOnComplete: { count: 60 },
          removeOnFail: { count: 60 },
        },
      },
    )
    console.log(`Planification "${SCHEDULER_ID}" enregistree : ${DAILY_PATTERN} (${DAILY_TIMEZONE})`)
  }

  if (process.argv.includes('--now')) {
    const job = await queue.add(JOB_NAME, { trigger: 'manuel' })
    console.log(`Job immediat ajoute : ${job.id}`)
  }

  const schedulers = await queue.getJobSchedulers()
  console.log(`\n${schedulers.length} planification(s) en place :`)
  for (const s of schedulers) {
    console.log(
      `  ${s.key}  pattern=${s.pattern ?? '-'}  tz=${s.tz ?? '-'}  ` +
        `prochain=${s.next ? new Date(s.next).toISOString() : '-'}`,
    )
  }

  await queue.close()
}

main().catch((error) => {
  console.error('[schedule] erreur :', error instanceof Error ? error.message : error)
  process.exitCode = 1
})

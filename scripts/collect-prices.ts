/* ─────────────────────────────────────────────────────────────
   collect-prices — releve immediat, sans attendre l heure planifiee
   (npm run collect-prices)

   Utile pour un rattrapage manuel ou un test. La planification
   quotidienne, elle, est assuree par le worker (npm run worker).

   La logique vit dans lib/collect-prices.ts et est partagee avec le
   worker : les deux chemins produisent exactement le meme resultat.
───────────────────────────────────────────────────────────── */

import { collectAllRoutes } from '../lib/collect-prices.ts'

async function main() {
  console.log(`[collect-prices] ${new Date().toISOString()}`)

  const report = await collectAllRoutes((line) => console.log(`[collect-prices] ${line}`))

  console.log(
    `[collect-prices] ${report.snapshotsWritten} snapshots ecrits, ` +
      `${report.routesFailed}/${report.routesTotal} routes en echec, ` +
      `${(report.durationMs / 1000).toFixed(1)}s`,
  )

  if (report.snapshotsWritten === 0) {
    console.error('[collect-prices] aucune donnee collectee — echec total')
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error('[collect-prices] erreur fatale :', error)
  process.exitCode = 1
})

/* ─────────────────────────────────────────────────────────────
   export-snapshots — inspection manuelle des donnees collectees

     npm run export-snapshots                    resume + CSV complet
     npm run export-snapshots -- --route CDG-MRS filtre sur une route
     npm run export-snapshots -- --limit 5000    plafond de lignes
     npm run export-snapshots -- --stdout        affiche au lieu d ecrire

   Le CSV part dans scripts/output/snapshots-<date>.csv.
───────────────────────────────────────────────────────────── */

import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { listPriceSnapshots, snapshotCoverage } from '../lib/price-snapshots-db.ts'

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 ? process.argv[i + 1] : undefined
}

const toCsv = (rows: Array<Record<string, unknown>>) => {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n')
}

async function main() {
  const route = arg('route')
  const limit = arg('limit') ? Number(arg('limit')) : undefined

  const coverage = await snapshotCoverage()

  console.log('COUVERTURE DE LA COLLECTE (30 derniers jours de releve)')
  console.log('─'.repeat(52))
  if (!coverage.length) {
    console.log('Aucun snapshot en base. Lancer : npm run collect-prices')
  } else {
    console.log('jour de releve   lignes   routes')
    for (const c of coverage) {
      console.log(
        `${String(c.collectedOn).slice(0, 10).padEnd(17)}${String(c.rows).padStart(6)}${String(c.routes).padStart(9)}`,
      )
    }
  }

  const rows = await listPriceSnapshots({ route, limit })
  console.log(`\n${rows.length} lignes exportees${route ? ` pour ${route}` : ''}.`)

  if (!rows.length) return

  const csv = toCsv(rows as unknown as Array<Record<string, unknown>>)

  if (process.argv.includes('--stdout')) {
    console.log('\n' + csv)
    return
  }

  const outDir = join(process.cwd(), 'scripts', 'output')
  mkdirSync(outDir, { recursive: true })
  const outFile = join(outDir, `snapshots-${new Date().toISOString().split('T')[0]}.csv`)
  writeFileSync(outFile, csv, 'utf8')
  console.log(`CSV ecrit : ${outFile}`)
}

main().catch((error) => {
  console.error('[export-snapshots] erreur :', error)
  process.exitCode = 1
})

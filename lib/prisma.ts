/* ─────────────────────────────────────────────────────────────
   Client Prisma partage.

   Prisma 7 impose un driver adapter : on passe par @prisma/adapter-neon,
   qui reutilise le driver serverless deja present dans le projet.

   Pas de 'server-only' ici : ce module est aussi importe par le worker
   BullMQ et les scripts en ligne de commande, hors runtime Next.

   Le singleton evite d epuiser le pool de connexions Neon lors des
   rechargements a chaud en developpement.
───────────────────────────────────────────────────────────── */

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured.')
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient() {
  const adapter = new PrismaNeon({ connectionString })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

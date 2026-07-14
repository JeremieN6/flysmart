import 'server-only'

import { neon } from '@neondatabase/serverless'

export type DemoRequestInput = {
  nom: string
  email: string
  entreprise: string
  structureType: string
  site: string
  message: string
}

export type DemoRequestRecord = DemoRequestInput & {
  id: number
  createdAt: string
  ipAddress: string | null
  userAgent: string | null
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured.')
}

const sql = neon(databaseUrl)

let schemaReadyPromise: Promise<void> | null = null

async function ensureDemoRequestsTable() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS demo_requests (
          id BIGSERIAL PRIMARY KEY,
          nom TEXT NOT NULL,
          email TEXT NOT NULL,
          entreprise TEXT NOT NULL,
          structure_type TEXT NOT NULL,
          site TEXT NOT NULL DEFAULT '',
          message TEXT NOT NULL DEFAULT '',
          ip_address TEXT,
          user_agent TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
    })()
  }

  return schemaReadyPromise
}

export async function insertDemoRequest(
  request: DemoRequestInput,
  metadata: { ipAddress: string | null; userAgent: string | null },
) {
  await ensureDemoRequestsTable()

  const rows = (await sql`
    INSERT INTO demo_requests (
      nom,
      email,
      entreprise,
      structure_type,
      site,
      message,
      ip_address,
      user_agent
    ) VALUES (
      ${request.nom},
      ${request.email},
      ${request.entreprise},
      ${request.structureType},
      ${request.site},
      ${request.message},
      ${metadata.ipAddress},
      ${metadata.userAgent}
    )
    RETURNING id
  `) as Array<{ id: string | number }>

  return Number(rows[0]?.id)
}

export async function listDemoRequests(): Promise<DemoRequestRecord[]> {
  await ensureDemoRequestsTable()

  const rows = (await sql`
    SELECT
      id,
      nom,
      email,
      entreprise,
      structure_type AS "structureType",
      site,
      message,
      ip_address AS "ipAddress",
      user_agent AS "userAgent",
      created_at AS "createdAt"
    FROM demo_requests
    ORDER BY created_at DESC, id DESC
  `) as Array<{
    id: string
    nom: string
    email: string
    entreprise: string
    structureType: string
    site: string
    message: string
    ipAddress: string | null
    userAgent: string | null
    createdAt: string
  }>

  return rows.map((row) => ({
    id: Number(row.id),
    nom: row.nom,
    email: row.email,
    entreprise: row.entreprise,
    structureType: row.structureType,
    site: row.site,
    message: row.message,
    ipAddress: row.ipAddress,
    userAgent: row.userAgent,
    createdAt: row.createdAt,
  }))
}
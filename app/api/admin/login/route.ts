import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionMaxAge,
  hasAdminConfig,
  isValidAdminCredentials,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(req: NextRequest) {
  if (!hasAdminConfig()) {
    return NextResponse.json({ error: 'Configuration admin indisponible cote serveur.' }, { status: 503 })
  }

  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Le corps de la requete est invalide.' }, { status: 400 })
  }

  const payload = (body ?? {}) as Record<string, unknown>
  const username = normalizeText(payload.username)
  const password = normalizeText(payload.password)

  if (!username || !password) {
    return NextResponse.json({ error: 'Identifiants requis.' }, { status: 400 })
  }

  if (!isValidAdminCredentials(username, password)) {
    return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: await createAdminSessionToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: getAdminSessionMaxAge(),
  })

  return response
}
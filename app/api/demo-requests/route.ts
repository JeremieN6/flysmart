import { NextRequest, NextResponse } from 'next/server'
import { insertDemoRequest } from '@/lib/demo-requests-db'

export const runtime = 'nodejs'

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidUrl(value: string) {
  if (!value) {
    return true
  }

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Le corps de la requete est invalide.' }, { status: 400 })
  }

  const payload = (body ?? {}) as Record<string, unknown>
  const nom = normalizeText(payload.nom)
  const email = normalizeText(payload.email).toLowerCase()
  const entreprise = normalizeText(payload.entreprise)
  const structureType = normalizeText(payload.structureType)
  const site = normalizeText(payload.site)
  const message = normalizeText(payload.message)

  if (!nom || !email || !entreprise || !structureType) {
    return NextResponse.json({ error: 'Merci de renseigner les champs obligatoires.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
  }

  if (!isValidUrl(site)) {
    return NextResponse.json({ error: 'URL de site web invalide.' }, { status: 400 })
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: 'Le message est trop long.' }, { status: 400 })
  }

  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = req.headers.get('user-agent')

  await insertDemoRequest(
    {
      nom,
      email,
      entreprise,
      structureType,
      site,
      message,
    },
    {
      ipAddress,
      userAgent,
    },
  )

  return NextResponse.json({ ok: true })
}
import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, isPlanId } from '@/lib/stripe-checkout'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get('plan') ?? ''

  if (!isPlanId(plan)) {
    return NextResponse.json({ error: 'Plan inconnu' }, { status: 400 })
  }

  try {
    const origin = req.nextUrl.origin
    const url    = await createCheckoutSession(plan, origin)
    return NextResponse.redirect(url, 303)
  } catch (err) {
    const e = err as { message?: string }
    return NextResponse.json({ error: e.message ?? 'Erreur Stripe' }, { status: 500 })
  }
}

/* ─────────────────────────────────────────────────────────────
   Logique de checkout Stripe — centralisée ici
───────────────────────────────────────────────────────────── */
import Stripe from 'stripe'

type PlanId = 'blogger' | 'blogger-annual' | 'agence' | 'comite' | 'comite-annual'

interface PlanConfig {
  name:        string
  amount:      number // en centimes EUR
  interval:    'month' | 'year'
  description: string
}

const PLANS: Record<PlanId, PlanConfig> = {
  'blogger': {
    name:        'FlySmart Blogueur — Mensuel',
    amount:      4900,
    interval:    'month',
    description: 'Accès widget intégrable + statistiques + commission 1%',
  },
  'blogger-annual': {
    name:        'FlySmart Blogueur — Annuel',
    amount:      39900,
    interval:    'year',
    description: 'Accès widget intégrable + statistiques + commission 1% (tarif annuel)',
  },
  'agence': {
    name:        'FlySmart Agence — Mensuel',
    amount:      14900,
    interval:    'month',
    description: 'Outil complet pour agences de voyage + commission 1%',
  },
  'comite': {
    name:        'FlySmart CE — Mensuel',
    amount:      19900,
    interval:    'month',
    description: 'Planification multi-destinations CE + commission 1%',
  },
  'comite-annual': {
    name:        'FlySmart CE — Annuel',
    amount:      199000,
    interval:    'year',
    description: 'Planification multi-destinations CE + commission 1% (tarif annuel)',
  },
}

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY manquante')
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' })
}

export function isPlanId(s: string): s is PlanId {
  return s in PLANS
}

/**
 * Crée une session Stripe Checkout et retourne son URL.
 */
export async function createCheckoutSession(
  planId: PlanId,
  origin: string
): Promise<string> {
  const stripe = getStripe()
  const plan   = PLANS[planId]

  const session = await stripe.checkout.sessions.create({
    mode:       'payment',
    line_items: [
      {
        quantity:   1,
        price_data: {
          currency:     'eur',
          unit_amount:  plan.amount,
          product_data: {
            name:        plan.name,
            description: plan.description,
          },
        },
      },
    ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${origin}/tarifs`,
    metadata:    { plan: planId },
  })

  if (!session.url) throw new Error('Stripe n\'a pas retourné d\'URL de paiement')
  return session.url
}

export { PLANS }

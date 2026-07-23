/* ─────────────────────────────────────────────────────────────
   Logique de checkout Stripe — centralisée ici
───────────────────────────────────────────────────────────── */

type PlanId = 'starter' | 'pro'

type EnvFlavor = 'TEST' | 'PROD'

const PLAN_LINK_KEYS: Record<PlanId, { test: string; prod: string }> = {
  // Liens Stripe dédiés au plan Starter.
  starter: {
    test: 'STARTER_STRIPE_PRODUCT_LINK_TEST',
    prod: 'STARTER_STRIPE_PRODUCT_LINK_PROD',
  },
  // Liens Stripe dédiés au plan Pro.
  pro: {
    test: 'PRO_STRIPE_PRODUCT_LINK_TEST',
    prod: 'PRO_STRIPE_PRODUCT_LINK_PROD',
  },
}

export function isPlanId(s: string): s is PlanId {
  return s === 'starter' || s === 'pro'
}

function getEnvFlavor(): EnvFlavor {
  return process.env.NODE_ENV === 'production' ? 'PROD' : 'TEST'
}

function getPlanLink(planId: PlanId): string {
  const envFlavor = getEnvFlavor()
  const envKey = envFlavor === 'PROD' ? PLAN_LINK_KEYS[planId].prod : PLAN_LINK_KEYS[planId].test
  const link = process.env[envKey]

  if (!link) {
    throw new Error(`Lien Stripe manquant: ${envKey}`)
  }

  return link
}

/**
 * Retourne l'URL de checkout Stripe associee au plan.
 */
export async function createCheckoutSession(
  planId: PlanId,
  _origin: string
): Promise<string> {
  return getPlanLink(planId)
}

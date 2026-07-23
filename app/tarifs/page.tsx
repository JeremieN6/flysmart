'use client'

import Header from '@/app/components/Header'
import Reveal from '@/app/components/Reveal'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '99€',
    period: '/mois',
    description: 'Pour les équipes qui organisent des déplacements ponctuels (jusqu\'à environ 10 recherches ou réservations par mois).',
    features: [
      'Recommandation d\'achat en temps réel',
      'Alertes prix par email',
      'Historique des économies estimées réalisées',
    ],
    highlight: false,
    ctaHref: '/checkout?plan=starter',
    ctaLabel: 'Choisir Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '199€',
    period: '/mois',
    description: 'Pour les entreprises avec des déplacements récurrents (séminaires, tournées commerciales, salons).',
    features: [
      'Tout Starter',
      'Partage de recommandation pour validation manager',
      'Multi-utilisateurs',
      'Support prioritaire',
    ],
    highlight: true,
    ctaHref: '/checkout?plan=pro',
    ctaLabel: 'Choisir Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Sur devis',
    period: '',
    description: 'Pour les volumes importants et organisations multi-sites.',
    features: ['Contact commercial dédié'],
    highlight: false,
    ctaHref: '/#contact-demo',
    ctaLabel: 'Contacter l\'équipe',
  },
]

export default function TarifsPage() {
  return (
    <>
      <Header ctaHref="#plans" ctaLabel="Voir les plans" />

      <main className="min-h-screen pt-20" style={{ background: 'var(--midnight)' }}>
        <section className="py-16 px-6 text-center">
          <p className="fade-up text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--amber)' }}>
            Tarifs transparents
          </p>
          <h1 className="fade-up delay-100 text-4xl md:text-5xl font-semibold mb-4 leading-tight" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
            Une offre claire pour les déplacements pro en PME
          </h1>
          <p className="fade-up delay-200 text-lg max-w-2xl mx-auto" style={{ color: 'var(--steel-light)' }}>
            Sans engagement. Annulez à tout moment. Les économies affichées dans le dashboard sont des estimations indicatives.
          </p>
        </section>

        <section id="plans" className="px-6 pb-20">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 100}>
                <div
                  className="rounded-2xl p-7 flex flex-col h-full relative"
                  style={{
                    background: plan.highlight ? 'rgba(26, 40, 71, 0.88)' : 'var(--navy-mid)',
                    border: plan.highlight ? '1px solid rgba(232,163,48,0.5)' : '1px solid rgba(186,199,226,0.12)',
                    boxShadow: plan.highlight ? 'rgba(232, 163, 48, 0.08) 0px 0px 60px' : 'none',
                  }}
                >
                  {plan.highlight ? (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                      style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
                    >
                      Le plus choisi
                    </div>
                  ) : null}

                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                    {plan.name}
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--steel)' }}>{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold" style={{ color: 'var(--amber)' }}>
                      {plan.price}
                    </span>
                    {plan.period ? <span className="text-sm ml-1" style={{ color: 'var(--steel)' }}>{plan.period}</span> : null}
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: 'var(--steel-light)' }}>
                        <span style={{ color: 'var(--green-ok)', flexShrink: 0 }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.ctaHref}
                    className="block text-center py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
                    style={plan.highlight
                      ? { background: 'var(--amber)', color: 'var(--midnight)' }
                      : { background: 'transparent', color: 'var(--amber)', border: '1px solid var(--amber)' }}
                  >
                    {plan.ctaLabel} →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="rounded-2xl p-7" style={{ background: 'rgba(17, 27, 53, 0.7)', border: '1px solid rgba(186,199,226,0.14)' }}>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                  Besoin d\'un cadrage enterprise ?
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--steel-light)' }}>
                  Si vous gérez plusieurs sites, des volumes importants ou un processus de validation complexe, notre équipe construit une offre sur devis adaptée à votre organisation.
                </p>
                <a
                  href="/#contact-demo"
                  className="inline-block px-6 py-3 rounded-lg text-sm font-semibold"
                  style={{ background: 'rgba(232,163,48,0.15)', color: 'var(--amber)', border: '1px solid rgba(232,163,48,0.35)' }}
                >
                  Demander un contact commercial →
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  )
}

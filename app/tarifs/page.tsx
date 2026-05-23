'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Reveal from '@/app/components/Reveal'

const PLANS = [
  {
    id:         'blogger',
    name:       'Blogueur',
    emoji:      '✍️',
    monthlyPrice: 49,
    annualPrice:  33,
    annualPlanId: 'blogger-annual',
    description: 'Pour les créateurs de contenu qui veulent monétiser leur audience voyageur.',
    highlight: false,
    features: [
      '1 widget intégrable',
      'Jusqu\'à 500 analyses/mois',
      'Commission d\'affiliation 1%',
      'Support par e-mail',
      'Tableau de bord stats',
    ],
    missing: [
      'API multi-destinations',
      'Support prioritaire',
      'Label blanc',
    ],
  },
  {
    id:         'agence',
    name:       'Agence',
    emoji:      '✈️',
    monthlyPrice: 149,
    annualPrice:  null,
    annualPlanId: null,
    description: 'L\'outil complet pour proposer la meilleure valeur à vos clients voyageurs.',
    highlight: true,
    features: [
      '5 widgets intégrables',
      'Jusqu\'à 5 000 analyses/mois',
      'Commission d\'affiliation 1%',
      'Support prioritaire',
      'Tableau de bord stats avancé',
      'API multi-destinations',
      'Rapport mensuel PDF',
    ],
    missing: [
      'Label blanc',
    ],
  },
  {
    id:         'comite',
    name:       'CE / Collectivité',
    emoji:      '🏢',
    monthlyPrice: 199,
    annualPrice:  166,
    annualPlanId: 'comite-annual',
    description: 'Planification collective pour les Comités d\'Entreprise et organisations.',
    highlight: false,
    features: [
      'Widgets illimités',
      'Analyses illimitées',
      'Commission d\'affiliation 1%',
      'Support dédié 7j/7',
      'Tableau de bord multi-groupes',
      'API multi-destinations',
      'Label blanc',
      'Rapport mensuel PDF',
    ],
    missing: [],
  },
]

const COMPARISON_ROWS = [
  { label: 'Analyses / mois',       blogger: '500',      agence: '5 000',  comite: 'Illimité' },
  { label: 'Widgets intégrables',   blogger: '1',        agence: '5',      comite: 'Illimité' },
  { label: 'Commission affiliation',blogger: '1%',       agence: '1%',     comite: '1%' },
  { label: 'API multi-destinations',blogger: '✗',        agence: '✓',      comite: '✓' },
  { label: 'Rapport PDF',           blogger: '✗',        agence: '✓',      comite: '✓' },
  { label: 'Label blanc',           blogger: '✗',        agence: '✗',      comite: '✓' },
  { label: 'Support',               blogger: 'E-mail',   agence: 'Prio',   comite: 'Dédié' },
]

export default function TarifsPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  function getPlanId(plan: typeof PLANS[0]) {
    if (isAnnual && plan.annualPlanId) return plan.annualPlanId
    return plan.id
  }

  function getPrice(plan: typeof PLANS[0]) {
    if (isAnnual && plan.annualPrice) return plan.annualPrice
    return plan.monthlyPrice
  }

  return (
    <>
      <Header ctaHref="#plans" ctaLabel="Voir les plans" />

      <main className="min-h-screen pt-20" style={{ background: 'var(--midnight)' }}>

        {/* ── Hero ── */}
        <section className="py-16 px-6 text-center">
          <p className="fade-up text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--amber)' }}>
            Tarifs transparents
          </p>
          <h1 className="fade-up delay-100 text-4xl md:text-5xl font-semibold mb-4 leading-tight" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
            Choisissez votre plan
          </h1>
          <p className="fade-up delay-200 text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--steel-light)' }}>
            Sans engagement. Annulez à tout moment. Commission d'affiliation incluse dans tous les plans.
          </p>

          {/* Toggle mensuel / annuel */}
          <div className="fade-up delay-300 inline-flex items-center gap-3 rounded-full p-1" style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.15)' }}>
            <button
              onClick={() => setIsAnnual(false)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: !isAnnual ? 'var(--amber)' : 'transparent',
                color:      !isAnnual ? 'var(--midnight)' : 'var(--steel-light)',
              }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
              style={{
                background: isAnnual ? 'var(--amber)' : 'transparent',
                color:      isAnnual ? 'var(--midnight)' : 'var(--steel-light)',
              }}
            >
              Annuel
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.2)', color: 'var(--green-ok)' }}>
                −20%
              </span>
            </button>
          </div>
        </section>

        {/* ── Plans ── */}
        <section id="plans" className="px-6 pb-20">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 100}>
                <div
                  className="rounded-2xl p-7 flex flex-col h-full relative"
                  style={{
                    background: plan.highlight ? 'linear-gradient(135deg, rgba(232,163,48,0.12), rgba(17,27,53,0.9))' : 'var(--navy-mid)',
                    border:     plan.highlight ? '1px solid rgba(232,163,48,0.5)' : '1px solid rgba(186,199,226,0.12)',
                  }}
                >
                  {plan.highlight && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                      style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
                    >
                      Recommandé
                    </div>
                  )}

                  <div className="text-3xl mb-3">{plan.emoji}</div>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                    {plan.name}
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--steel)' }}>{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold" style={{ color: 'var(--amber)' }}>
                      {getPrice(plan)}€
                    </span>
                    <span className="text-sm ml-1" style={{ color: 'var(--steel)' }}>/mois</span>
                    {isAnnual && plan.annualPrice && (
                      <p className="text-xs mt-1" style={{ color: 'var(--green-ok)' }}>
                        Facturé {plan.annualPrice * 12}€/an
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--steel-light)' }}>
                        <span style={{ color: 'var(--green-ok)', flexShrink: 0 }}>✓</span>
                        {f}
                      </li>
                    ))}
                    {plan.missing.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--steel)', opacity: 0.5 }}>
                        <span style={{ flexShrink: 0 }}>✗</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`/checkout?plan=${getPlanId(plan)}`}
                    className="block text-center py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
                    style={{
                      background: plan.highlight ? 'var(--amber)' : 'transparent',
                      color:      plan.highlight ? 'var(--midnight)' : 'var(--amber)',
                      border:     plan.highlight ? 'none' : '1px solid var(--amber)',
                    }}
                  >
                    Commencer →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Tableau comparatif ── */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="text-2xl font-semibold text-center mb-10" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                Comparatif détaillé
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(186,199,226,0.12)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--navy-mid)', borderBottom: '1px solid rgba(186,199,226,0.12)' }}>
                      <th className="text-left px-6 py-4" style={{ color: 'var(--steel)' }}>Fonctionnalité</th>
                      <th className="text-center px-4 py-4" style={{ color: 'var(--cream)' }}>Blogueur</th>
                      <th className="text-center px-4 py-4" style={{ color: 'var(--amber)' }}>Agence</th>
                      <th className="text-center px-4 py-4" style={{ color: 'var(--cream)' }}>CE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr
                        key={row.label}
                        style={{
                          background: i % 2 === 0 ? 'var(--navy-deep)' : 'var(--navy-mid)',
                          borderBottom: '1px solid rgba(186,199,226,0.06)',
                        }}
                      >
                        <td className="px-6 py-3" style={{ color: 'var(--steel-light)' }}>{row.label}</td>
                        <td className="text-center px-4 py-3" style={{ color: row.blogger === '✗' ? 'var(--steel)' : 'var(--cream)' }}>{row.blogger}</td>
                        <td className="text-center px-4 py-3" style={{ color: row.agence === '✗' ? 'var(--steel)' : 'var(--amber)' }}>{row.agence}</td>
                        <td className="text-center px-4 py-3" style={{ color: row.comite === '✗' ? 'var(--steel)' : 'var(--green-ok)' }}>{row.comite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ Tarifs ── */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-2xl space-y-4">
            <Reveal>
              <h2 className="text-2xl font-semibold text-center mb-8" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                Questions fréquentes
              </h2>
            </Reveal>
            {[
              { q: 'Comment fonctionne la commission d\'affiliation ?', a: 'Chaque achat de billet effectué via votre widget vous rapporte 1% du montant du billet. Les commissions sont versées chaque mois.' },
              { q: 'Puis-je changer de plan en cours de route ?', a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre tableau de bord. Le changement est effectif immédiatement.' },
              { q: 'Que se passe-t-il si je dépasse mon quota ?', a: 'Au-delà de votre quota mensuel, les analyses sont temporairement limitées. Vous recevez une notification avant d\'atteindre la limite.' },
              { q: 'Y a-t-il une période d\'essai ?', a: 'Vous pouvez tester l\'API avec la clé démo gratuite (flysmart-trailix-test-key, 10 req/j) sans engagement.' },
            ].map(({ q, a }, i) => (
              <Reveal key={i} delay={i * 80}>
                <details
                  className="rounded-xl p-5"
                  style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.12)' }}
                >
                  <summary className="font-medium cursor-pointer" style={{ color: 'var(--cream)' }}>{q}</summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--steel-light)' }}>{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}

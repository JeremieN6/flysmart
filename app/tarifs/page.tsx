'use client'

import Header from '@/app/components/Header'
import Reveal from '@/app/components/Reveal'
import PricingPlans from '@/app/components/landing/PricingPlans'
import LandingFooter from '@/app/components/landing/LandingFooter'

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
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <PricingPlans />
            </Reveal>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="rounded-2xl p-7" style={{ background: 'rgba(17, 27, 53, 0.7)', border: '1px solid rgba(186,199,226,0.14)' }}>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                  Besoin d&apos;un cadrage enterprise ?
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

      <LandingFooter />
    </>
  )
}

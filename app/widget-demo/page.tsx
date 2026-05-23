'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Reveal from '@/app/components/Reveal'

const DEMO_KEY = 'flysmart-trailix-test-key'

const SNIPPET = `<!-- 1. Copiez ce script dans votre <head> -->
<script src="https://flysmart.app/widget.js" async></script>

<!-- 2. Placez le widget où vous voulez -->
<flysmart-widget
  data-api-key="${DEMO_KEY}"
  data-title="Meilleur moment pour acheter"
  data-primary-color="#0D1B2A"
  data-accent-color="#E8A330">
</flysmart-widget>`

export default function WidgetDemoPage() {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(SNIPPET).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <Header ctaHref="/tarifs" ctaLabel="Obtenir ma clé API" />

      <main className="min-h-screen pt-20" style={{ background: 'var(--midnight)' }}>

        {/* ── Hero ── */}
        <section className="py-16 px-6 text-center">
          <p className="fade-up text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--amber)' }}>
            Intégration en 2 minutes
          </p>
          <h1 className="fade-up delay-100 text-4xl md:text-5xl font-semibold mb-4" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
            Widget intégrable
          </h1>
          <p className="fade-up delay-200 text-lg max-w-2xl mx-auto" style={{ color: 'var(--steel-light)' }}>
            Ajoutez la puissance de FlySmart à votre site en collant deux lignes de HTML.
            Aucune dépendance, aucune configuration complexe.
          </p>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* ── Preview du widget ── */}
            <Reveal>
              <div>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--cream)' }}>Aperçu</h2>
                <div
                  className="rounded-2xl p-6"
                  style={{ background: 'var(--navy-mid)', border: '1px solid rgba(232,163,48,0.25)' }}
                >
                  <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--amber)' }}>
                    Meilleur moment pour acheter
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-xs" style={{ color: 'var(--steel)' }}>Départ</label>
                      <div className="mt-1 rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.15)' }}>
                        Paris CDG
                      </div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--steel)' }}>Destination</label>
                      <div className="mt-1 rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.15)' }}>
                        New York JFK
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 mb-4 flex items-center gap-4"
                    style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                      style={{ background: 'var(--green-ok)', color: 'var(--midnight)' }}
                    >
                      89
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--cream)' }}>Achetez maintenant</p>
                      <p className="text-xs" style={{ color: 'var(--steel-light)' }}>Économie potentielle : <strong style={{ color: 'var(--green-ok)' }}>−320 €</strong> vs dernière minute</p>
                    </div>
                  </div>

                  {/* Mini courbe SVG décorative */}
                  <svg viewBox="0 0 280 60" className="w-full" fill="none">
                    <defs>
                      <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E8A330" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#E8A330" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0 50 C20 45 40 38 60 30 S100 15 120 12 S160 10 180 12 S220 30 240 42 S260 52 280 55" stroke="#E8A330" strokeWidth="1.5" fill="none"/>
                    <path d="M0 50 C20 45 40 38 60 30 S100 15 120 12 S160 10 180 12 S220 30 240 42 S260 52 280 55 V60 H0Z" fill="url(#wg)"/>
                    <circle cx="140" cy="11" r="4" fill="#4ADE80"/>
                  </svg>
                  <p className="text-xs text-center mt-1" style={{ color: 'var(--steel)' }}>Fenêtre optimale : 6–8 semaines avant</p>
                </div>

                {/* Attributs de personnalisation */}
                <div className="mt-6 rounded-xl p-5" style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.1)' }}>
                  <h3 className="font-medium mb-3 text-sm" style={{ color: 'var(--cream)' }}>Attributs disponibles</h3>
                  <table className="w-full text-xs">
                    <tbody>
                      {[
                        { attr: 'data-api-key',         desc: 'Votre clé API' },
                        { attr: 'data-title',            desc: 'Titre affiché' },
                        { attr: 'data-primary-color',    desc: 'Fond (#0D1B2A)' },
                        { attr: 'data-accent-color',     desc: 'Accent (#E8A330)' },
                        { attr: 'data-background-color', desc: 'Fond widget' },
                        { attr: 'data-text-color',       desc: 'Couleur texte' },
                      ].map(({ attr, desc }) => (
                        <tr key={attr}>
                          <td className="py-1 pr-4 font-mono" style={{ color: 'var(--amber)' }}>{attr}</td>
                          <td style={{ color: 'var(--steel-light)' }}>{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>

            {/* ── Code snippet ── */}
            <Reveal delay={150}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--cream)' }}>Code d'intégration</h2>
                  <button
                    onClick={copy}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: copied ? 'rgba(74,222,128,0.2)' : 'rgba(232,163,48,0.15)',
                      color:      copied ? 'var(--green-ok)' : 'var(--amber)',
                      border:     `1px solid ${copied ? 'var(--green-ok)' : 'var(--amber)'}40`,
                    }}
                  >
                    {copied ? '✓ Copié !' : 'Copier'}
                  </button>
                </div>

                <pre
                  className="rounded-xl p-5 text-xs leading-relaxed overflow-x-auto"
                  style={{
                    background: 'var(--navy-deep)',
                    border:     '1px solid rgba(186,199,226,0.1)',
                    color:      'var(--cream)',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak:  'break-all',
                  }}
                >
                  {SNIPPET}
                </pre>

                {/* Étapes */}
                <div className="mt-6 space-y-4">
                  {[
                    { n: '1', title: 'Créez un compte', desc: 'Inscrivez-vous et obtenez votre clé API depuis le tableau de bord.' },
                    { n: '2', title: 'Collez le code', desc: 'Ajoutez les deux balises HTML dans vos pages ou articles.' },
                    { n: '3', title: 'Personnalisez', desc: 'Adaptez les couleurs pour correspondre à votre charte graphique.' },
                    { n: '4', title: 'Monetisez', desc: 'Touchez 1% de commission sur chaque billet acheté via votre widget.' },
                  ].map(({ n, title, desc }) => (
                    <div key={n} className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: 'rgba(232,163,48,0.2)', color: 'var(--amber)' }}
                      >
                        {n}
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--cream)' }}>{title}</p>
                        <p className="text-sm" style={{ color: 'var(--steel)' }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="/tarifs"
                  className="mt-8 block text-center py-3 rounded-lg font-semibold"
                  style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
                >
                  Obtenir ma clé API →
                </a>
              </div>
            </Reveal>

          </div>
        </section>

        {/* ── Clé démo ── */}
        <section className="px-6 pb-24">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center rounded-2xl p-8" style={{ background: 'var(--navy-mid)', border: '1px solid rgba(232,163,48,0.2)' }}>
              <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>Clé démo gratuite</p>
              <p className="font-mono text-xl font-bold mb-2" style={{ color: 'var(--cream)' }}>{DEMO_KEY}</p>
              <p className="text-sm mb-6" style={{ color: 'var(--steel-light)' }}>10 requêtes / jour — Idéal pour tester l'intégration avant de s'abonner.</p>
              <a
                href="/tarifs"
                className="inline-block px-8 py-3 rounded-lg font-semibold text-sm"
                style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
              >
                Passer à un plan complet →
              </a>
            </div>
          </Reveal>
        </section>

      </main>
    </>
  )
}

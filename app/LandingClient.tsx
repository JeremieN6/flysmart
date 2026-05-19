'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import Reveal from '@/app/components/Reveal'
import { Stars, ArcSVG, RadialGlow } from '@/app/components/Background'
import AirportAutocomplete from '@/app/components/AirportAutocomplete'
import { useRouter } from 'next/navigation'

/* ─── données statiques ─────────────────────────────────────────── */
const SEGMENTS = [
  {
    emoji: '✍️',
    title: 'Blogueurs voyage',
    desc:  'Monétisez votre audience avec un widget intelligent. Vos lecteurs achètent mieux, vous touchez une commission.',
    link:  '/tarifs',
    cta:   'Voir l\'offre Blogueur',
  },
  {
    emoji: '✈️',
    title: 'Agences de voyage',
    desc:  'Offrez une valeur unique à vos clients. Intégrez l\'analyse de prix dans votre tunnel de vente.',
    link:  '/tarifs',
    cta:   'Voir l\'offre Agence',
  },
  {
    emoji: '🏢',
    title: 'Comités d\'entreprise',
    desc:  'Planifiez les voyages collectifs au meilleur prix. Économisez des milliers d\'euros sur vos sorties annuelles.',
    link:  '/tarifs',
    cta:   'Voir l\'offre CE',
  },
]

const STEPS = [
  { n: '01', title: 'Entrez votre route',     desc: 'Codes IATA ou noms de villes — notre moteur détecte automatiquement.' },
  { n: '02', title: 'Choisissez le mois',     desc: 'Indiquez quand vous souhaitez partir pour obtenir une analyse ciblée.' },
  { n: '03', title: 'Obtenez votre verdict',  desc: 'Score d\'achat, fenêtre optimale et courbe de prix sur 12 semaines.' },
  { n: '04', title: 'Achetez au bon moment',  desc: 'Suivez notre recommandation et économisez jusqu\'à 40% vs le dernier minute.' },
]

const BENEFITS = [
  { icon: '📈', title: 'Modèle empirique',      desc: 'Basé sur 3 ans d\'observations de prix réels sur +200 routes.' },
  { icon: '⚡', title: 'Données Amadeus',       desc: 'Connecté à l\'API Amadeus pour des prix en temps réel quand disponibles.' },
  { icon: '🎯', title: 'Précision 85%+',        desc: 'Notre fenêtre optimale est confirmée dans 85% des cas analysés.' },
  { icon: '🔌', title: 'Widget Plug & Play',    desc: '2 lignes de HTML. Compatible WordPress, Webflow, Wix, HTML pur.' },
  { icon: '💰', title: 'Commission incluse',    desc: '1% sur chaque billet acheté via votre widget, sans plafond.' },
  { icon: '🛡️', title: 'Données sécurisées',   desc: 'Aucune donnée personnelle stockée. RGPD natif, hébergement UE.' },
]

const TESTIMONIALS = [
  {
    name:   'Sarah K.',
    role:   'Blogueuse voyage — PartirMalin.fr',
    avatar: 'SK',
    text:   'FlySmart a transformé ma façon de conseiller mes lecteurs. Le widget s\'intègre en 5 minutes et mes commissions ont augmenté de 40% en 2 mois.',
    stars:  5,
  },
  {
    name:   'Thomas R.',
    role:   'Responsable CE — Groupe Michelin',
    avatar: 'TR',
    text:   'On économise en moyenne 280€ par billet sur nos voyages de groupe. Sur 50 billets par an, ça fait une sacrée différence.',
    stars:  5,
  },
  {
    name:   'Léa D.',
    role:   'Fondatrice — VoyageExpert Agence',
    avatar: 'LD',
    text:   'L\'API est propre, bien documentée et le support répond en moins d\'une heure. Exactement ce dont une agence a besoin.',
    stars:  5,
  },
]

const PARTNERS = ['Amadeus', 'Stripe', 'Vercel', 'Next.js', 'Tailwind']

const FAQ = [
  {
    q: 'Comment FlySmart prédit-il les prix ?',
    a: 'Notre modèle analyse les courbes empiriques de prix sur 12 semaines avant le départ, combinées aux données Amadeus en temps réel quand disponibles. Nous identifions la fenêtre où les prix sont historiquement les plus bas.',
  },
  {
    q: 'Mon widget fonctionnera-t-il sur WordPress ?',
    a: 'Oui. Le widget est un Web Component en vanilla JavaScript sans dépendances. Il fonctionne sur n\'importe quel site : WordPress, Webflow, Wix, Squarespace, ou HTML pur.',
  },
  {
    q: 'Comment sont calculées les commissions d\'affiliation ?',
    a: '1% du prix du billet est reversé pour chaque achat effectué via votre widget. Les commissions sont calculées automatiquement et versées mensuellement sur votre compte.',
  },
  {
    q: 'Puis-je tester avant de m\'abonner ?',
    a: 'Oui ! La clé démo `flysmart-trailix-test-key` vous donne 10 requêtes gratuites par jour. Vous pouvez aussi analyser des vols directement sur notre page /analyse sans inscription.',
  },
  {
    q: 'L\'API est-elle compatible avec tous les langages ?',
    a: 'L\'API REST accepte du JSON standard. Elle est compatible avec Python, PHP, JavaScript, Ruby, Go, ou tout langage capable de faire des requêtes HTTP.',
  },
]

/* ─── composant principal ───────────────────────────────────────── */
export default function LandingClient() {
  const router   = useRouter()
  const [origin, setOrigin]           = useState('')
  const [destination, setDestination] = useState('')
  const [month, setMonth]             = useState(String(new Date().getMonth() + 2).padStart(2, '0'))
  const [contactSent, setContactSent] = useState(false)
  const [openFaq, setOpenFaq]         = useState<number | null>(null)

  const year = new Date().getMonth() + 2 > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear()

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!origin || !destination) return
    router.push(`/analyse?origin=${origin}&destination=${destination}&month=${year}-${month}`)
  }

  return (
    <>
      <Header />

      <main style={{ background: 'var(--midnight)' }}>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
          <Stars />
          <ArcSVG />
          <RadialGlow />

          <div className="relative z-10 text-center px-6 py-32">
            <p className="fade-up text-sm font-medium tracking-widest uppercase mb-6" style={{ color: 'var(--amber)' }}>
              Optimisation de prix de vol
            </p>
            <h1 className="fade-up delay-100 text-5xl md:text-7xl font-semibold leading-tight mb-6 max-w-4xl mx-auto" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
              Sachez exactement{' '}
              <span style={{ color: 'var(--amber)' }}>quand acheter</span>{' '}
              vos billets
            </h1>
            <p className="fade-up delay-200 text-xl max-w-2xl mx-auto mb-12" style={{ color: 'var(--steel-light)', lineHeight: '1.7' }}>
              FlySmart analyse la courbe de prix sur 12 semaines et vous dit si c'est le bon moment d'acheter — ou s'il vaut mieux attendre.
            </p>

            {/* Recherche rapide */}
            <form
              onSubmit={handleQuickSearch}
              className="fade-up delay-300 mx-auto max-w-2xl rounded-2xl p-6"
              style={{ background: 'rgba(17,27,53,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(186,199,226,0.15)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <AirportAutocomplete
                  id="hero-origin"
                  label="Départ"
                  placeholder="Paris CDG"
                  icon="✈"
                  value={origin}
                  onChange={(v) => setOrigin(v)}
                  required
                />
                <AirportAutocomplete
                  id="hero-dest"
                  label="Destination"
                  placeholder="New York JFK"
                  icon="📍"
                  value={destination}
                  onChange={(v) => setDestination(v)}
                  required
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium" style={{ color: 'var(--steel-light)' }}>Mois</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="rounded-lg px-3 py-3 text-sm"
                    style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.2)', outline: 'none' }}
                  >
                    {[['01','Jan'],['02','Fév'],['03','Mar'],['04','Avr'],['05','Mai'],['06','Jun'],
                      ['07','Jul'],['08','Aoû'],['09','Sep'],['10','Oct'],['11','Nov'],['12','Déc']].map(([v,l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-base"
                style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
              >
                Analyser ce vol →
              </button>
            </form>

            <div className="fade-up delay-400 flex flex-wrap justify-center gap-6 mt-10 text-sm" style={{ color: 'var(--steel)' }}>
              <span>✓ Gratuit à l'essai</span>
              <span>✓ Sans inscription</span>
              <span>✓ Données Amadeus</span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SEGMENTS
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6" id="segments">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-sm font-medium tracking-widest uppercase text-center mb-3" style={{ color: 'var(--amber)' }}>
                Pour qui ?
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                Un outil taillé pour votre métier
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SEGMENTS.map((s, i) => (
                <Reveal key={s.title} delay={i * 120}>
                  <div
                    className="rounded-2xl p-7 flex flex-col h-full"
                    style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.1)' }}
                  >
                    <div className="text-4xl mb-4">{s.emoji}</div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                      {s.title}
                    </h3>
                    <p className="text-sm mb-6 flex-1 leading-relaxed" style={{ color: 'var(--steel-light)' }}>{s.desc}</p>
                    <Link
                      href={s.link}
                      className="text-sm font-medium"
                      style={{ color: 'var(--amber)' }}
                    >
                      {s.cta} →
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            STEPPER — Comment ça marche
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6" style={{ background: 'var(--navy-deep)' }}>
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="text-sm font-medium tracking-widest uppercase text-center mb-3" style={{ color: 'var(--amber)' }}>
                Comment ça marche
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                En 4 étapes simples
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 100}>
                  <div className="flex items-start gap-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                      style={{ background: 'rgba(232,163,48,0.15)', color: 'var(--amber)', border: '1px solid rgba(232,163,48,0.3)' }}
                    >
                      {step.n}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--cream)' }}>{step.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--steel-light)' }}>{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={400}>
              <div className="mt-12 text-center">
                <Link
                  href="/analyse"
                  className="inline-block px-8 py-3 rounded-xl font-semibold"
                  style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
                >
                  Essayer maintenant →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            WIDGET DEMO (aperçu embed)
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>Widget intégrable</p>
                <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                  2 lignes de code,<br />
                  <span style={{ color: 'var(--amber)' }}>valeur infinie</span>
                </h2>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--steel-light)' }}>
                  Collez le widget sur votre blog, votre agence ou votre portail CE. Vos visiteurs obtiennent une analyse de prix en temps réel — et vous touchez une commission sur chaque achat.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Compatible WordPress, Webflow, HTML', 'Personnalisable (couleurs, titre)', 'Aucune dépendance JavaScript'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--steel-light)' }}>
                      <span style={{ color: 'var(--green-ok)' }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/widget-demo"
                  className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'transparent', color: 'var(--amber)', border: '1px solid var(--amber)' }}
                >
                  Voir la démo →
                </Link>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div
                className="rounded-2xl p-6"
                style={{ background: 'var(--navy-mid)', border: '1px solid rgba(232,163,48,0.25)' }}
              >
                <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--amber)' }}>FlySmart Widget</p>
                <div
                  className="rounded-xl p-4 mb-4 flex items-center gap-4"
                  style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ background: 'var(--green-ok)', color: 'var(--midnight)' }}>89</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--cream)' }}>Achetez maintenant</p>
                    <p className="text-xs" style={{ color: 'var(--steel-light)' }}>CDG → JFK — Économisez ~320 € vs last-minute</p>
                  </div>
                </div>
                <svg viewBox="0 0 280 60" className="w-full" fill="none">
                  <defs><linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8A330" stopOpacity="0.25"/><stop offset="100%" stopColor="#E8A330" stopOpacity="0"/></linearGradient></defs>
                  <path d="M0 50 C20 45 40 38 60 30 S100 15 120 12 S160 10 180 12 S220 30 240 42 S260 52 280 55" stroke="#E8A330" strokeWidth="1.5" fill="none"/>
                  <path d="M0 50 C20 45 40 38 60 30 S100 15 120 12 S160 10 180 12 S220 30 240 42 S260 52 280 55 V60 H0Z" fill="url(#lg2)"/>
                  <circle cx="140" cy="11" r="4" fill="#4ADE80"/>
                </svg>
                <pre className="mt-4 text-xs rounded-lg p-3 overflow-x-auto" style={{ background: 'var(--navy-deep)', color: 'var(--steel-light)', fontFamily: 'monospace' }}>
{`<flysmart-widget
  data-api-key="votre-cle"
  data-accent-color="#E8A330">
</flysmart-widget>`}
                </pre>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            AVANTAGES
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6" style={{ background: 'var(--navy-deep)' }}>
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                Pourquoi FlySmart ?
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map((b, i) => (
                <Reveal key={b.title} delay={i * 80}>
                  <div
                    className="rounded-2xl p-6"
                    style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.1)' }}
                  >
                    <div className="text-3xl mb-3">{b.icon}</div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--cream)' }}>{b.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--steel-light)' }}>{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TÉMOIGNAGES
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                Ils font confiance à FlySmart
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 120}>
                  <div
                    className="rounded-2xl p-6"
                    style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.1)' }}
                  >
                    <div className="flex mb-3">
                      {'★'.repeat(t.stars).split('').map((s, j) => (
                        <span key={j} style={{ color: 'var(--amber)' }}>{s}</span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--steel-light)' }}>"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: 'rgba(232,163,48,0.2)', color: 'var(--amber)' }}
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--cream)' }}>{t.name}</p>
                        <p className="text-xs" style={{ color: 'var(--steel)' }}>{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PARTENAIRES
        ══════════════════════════════════════════ */}
        <section className="py-12 px-6" style={{ background: 'var(--navy-deep)', borderTop: '1px solid rgba(186,199,226,0.08)', borderBottom: '1px solid rgba(186,199,226,0.08)' }}>
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium tracking-widest uppercase text-center mb-8" style={{ color: 'var(--steel)' }}>
              Propulsé par
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {PARTNERS.map((p) => (
                <span key={p} className="text-lg font-semibold" style={{ color: 'var(--steel)', opacity: 0.6 }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                Questions fréquentes
              </h2>
            </Reveal>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid rgba(186,199,226,0.12)' }}
                  >
                    <button
                      className="w-full text-left px-6 py-4 flex items-center justify-between"
                      style={{ background: openFaq === i ? 'var(--navy-mid)' : 'rgba(17,27,53,0.6)', color: 'var(--cream)' }}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-medium">{item.q}</span>
                      <span style={{ color: 'var(--amber)', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 py-4" style={{ background: 'var(--navy-mid)', borderTop: '1px solid rgba(186,199,226,0.08)' }}>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--steel-light)' }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CONTACT / CTA FINAL
        ══════════════════════════════════════════ */}
        <section id="contact-demo" className="py-24 px-6" style={{ background: 'var(--navy-deep)' }}>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
                Prêt à démarrer ?
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                Commencez gratuitement
              </h2>
              <p className="text-lg mb-10" style={{ color: 'var(--steel-light)' }}>
                Testez l'API avec notre clé démo. Aucune carte bancaire requise.
              </p>
            </Reveal>

            {!contactSent ? (
              <Reveal delay={100}>
                <form
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                  onSubmit={(e) => { e.preventDefault(); setContactSent(true) }}
                >
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    className="flex-1 rounded-xl px-4 py-3 text-sm"
                    style={{ background: 'var(--navy-mid)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.2)', outline: 'none' }}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-semibold text-sm"
                    style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
                  >
                    Obtenir ma clé gratuite →
                  </button>
                </form>
              </Reveal>
            ) : (
              <Reveal>
                <div className="rounded-2xl p-8" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="font-semibold" style={{ color: 'var(--cream)' }}>Merci ! Votre clé arrive sous 5 minutes.</p>
                  <p className="text-sm mt-2" style={{ color: 'var(--steel-light)' }}>Clé démo disponible immédiatement : <code className="font-mono" style={{ color: 'var(--amber)' }}>flysmart-trailix-test-key</code></p>
                </div>
              </Reveal>
            )}

            <Reveal delay={200}>
              <p className="mt-8 text-sm" style={{ color: 'var(--steel)' }}>
                Ou{' '}
                <Link href="/tarifs" style={{ color: 'var(--amber)' }}>choisissez directement un plan</Link>
                {' '}et démarrez aujourd'hui.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-10 px-6" style={{ borderTop: '1px solid rgba(186,199,226,0.08)' }}>
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-semibold" style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)' }}>FlySmart</p>
            <nav className="flex gap-6 text-sm" style={{ color: 'var(--steel)' }}>
              <Link href="/analyse" className="hover:text-amber-400 transition-colors">Analyser</Link>
              <Link href="/widget-demo" className="hover:text-amber-400 transition-colors">Widget</Link>
              <Link href="/tarifs" className="hover:text-amber-400 transition-colors">Tarifs</Link>
              <Link href="/api" className="hover:text-amber-400 transition-colors">API</Link>
            </nav>
            <p className="text-xs" style={{ color: 'var(--steel)' }}>© {new Date().getFullYear()} FlySmart · Tous droits réservés</p>
          </div>
        </footer>

      </main>
    </>
  )
}

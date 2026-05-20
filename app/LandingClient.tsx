'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import Reveal from '@/app/components/Reveal'
import { Stars, ArcSVG, RadialGlow } from '@/app/components/Background'
import AirportAutocomplete from '@/app/components/AirportAutocomplete'
import { useRouter } from 'next/navigation'

/* â”€â”€â”€ donnÃ©es statiques â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SEGMENTS = [
  {
    icon: 'ðŸ¢',
    title: 'Agences de voyage',
    desc: "Offrez une valeur unique Ã  vos clients. IntÃ©grez l'analyse de prix dans votre tunnel de vente et fidÃ©lisez vos voyageurs.",
    bullets: [
      'Widget personnalisÃ© aux couleurs de votre marque',
      "Rapport d'analyse PDF Ã  partager",
      'Support dÃ©diÃ© & onboarding inclus',
    ],
    price: '149â‚¬',
    period: '/mois',
    cta: 'Demander une dÃ©mo',
    link: '/tarifs',
  },
  {
    icon: 'ðŸ‘¥',
    title: "ComitÃ©s d'entreprise",
    desc: "Planifiez les voyages collectifs au meilleur prix. Ã‰conomisez des milliers d'euros sur vos sorties annuelles.",
    bullets: [
      'Analyse multi-destinations simultanÃ©e',
      "Rapports d'Ã©conomies gÃ©nÃ©rÃ©s automatiquement",
      'Facturation entreprise & devis sur-mesure',
    ],
    price: '199â‚¬',
    period: '/mois',
    cta: 'FonctionnalitÃ©s avancÃ©es',
    link: '/tarifs',
  },
  {
    icon: 'âœï¸',
    title: 'Blogueurs & Influenceurs',
    desc: 'MonÃ©tisez votre audience avec un widget intelligent. Vos lecteurs achÃ¨tent mieux, vous touchez une commission.',
    bullets: [
      'Widget intÃ©grable en 2 lignes de code',
      '1% de commission reversÃ©e par billet',
      "Dashboard d'analytiques et suivi en temps rÃ©el",
    ],
    price: '49â‚¬',
    period: '/mois',
    cta: 'Rejoindre gratuitement',
    link: '/tarifs',
  },
]

const STEPS = [
  {
    n: '01',
    icon: 'ðŸ”§',
    title: 'IntÃ©grez votre script pro',
    desc: 'IntÃ©grez notre widget en 5 minutes sur votre site. 2 lignes de HTML, aucune dÃ©pendance JavaScript.',
  },
  {
    n: '02',
    icon: 'âš¡',
    title: 'Activez votre compte en 5 secondes',
    desc: "CrÃ©ez votre compte partenaire, obtenez votre clÃ© API et configurez vos prÃ©fÃ©rences en quelques clics.",
  },
  {
    n: '03',
    icon: 'ðŸ’°',
    title: 'Vos clients analysent, vous gagnez',
    desc: "Ils identifient le bon moment pour acheter. Vous Ãªtes rÃ©fÃ©rent de confiance, vous touchez des commissions.",
  },
]

const STATS = [
  { value: '-47%',  label: 'Ã©conomies de vol',        icon: 'âœˆï¸' },
  { value: '7 ans', label: 'de donnÃ©es historiques',  icon: 'ðŸ“Š' },
  { value: '24/7',  label: 'disponibilitÃ©',            icon: 'ðŸ›¡ï¸' },
  { value: '500+',  label: 'routes analysÃ©es',         icon: 'ðŸŒ' },
]

const TESTIMONIAL_STATS = [
  { value: '150+',  label: 'partenaires actifs' },
  { value: '4.8/5', label: 'note moyenne' },
  { value: '-38%',  label: 'Ã©conomies moyennes' },
]

const TESTIMONIALS = [
  {
    name:   'Sarah K.',
    role:   'Blogueuse voyage â€” PartirMalin.fr',
    avatar: 'SK',
    text:   "FlySmart a transformÃ© ma faÃ§on de conseiller mes lecteurs. Le widget s'intÃ¨gre en 5 minutes et mes commissions ont augmentÃ© de 40% en 2 mois.",
    stars:  5,
  },
  {
    name:   'Thomas R.',
    role:   'Responsable CE â€” Groupe Michelin',
    avatar: 'TR',
    text:   "On Ã©conomise en moyenne 280â‚¬ par billet sur nos voyages de groupe. Sur 50 billets par an, Ã§a fait une sacrÃ©e diffÃ©rence.",
    stars:  5,
  },
  {
    name:   'LÃ©a D.',
    role:   'Fondatrice â€” VoyageExpert Agence',
    avatar: 'LD',
    text:   "L'API est propre, bien documentÃ©e et le support rÃ©pond en moins d'une heure. Exactement ce dont une agence a besoin.",
    stars:  5,
  },
]

const PARTNERS = [
  { name: 'Tixeo',              initial: 'T'  },
  { name: 'Voyage des Fraises', initial: 'VF' },
  { name: 'FlightRange',        initial: 'FR' },
  { name: 'PartirMalin',        initial: 'PM' },
  { name: 'ComitÃ©Voyages',      initial: 'CV' },
]

const FAQ = [
  {
    q: 'Comment FlySmart prÃ©dit-il les prix ?',
    a: "Notre modÃ¨le analyse les courbes empiriques de prix sur 12 semaines avant le dÃ©part, combinÃ©es aux donnÃ©es Amadeus en temps rÃ©el quand disponibles. Nous identifions la fenÃªtre oÃ¹ les prix sont historiquement les plus bas.",
  },
  {
    q: 'Mon widget fonctionnera-t-il sur WordPress ?',
    a: "Oui. Le widget est un Web Component en vanilla JavaScript sans dÃ©pendances. Il fonctionne sur n'importe quel site : WordPress, Webflow, Wix, Squarespace, ou HTML pur.",
  },
  {
    q: "Comment sont calculÃ©es les commissions d'affiliation ?",
    a: "1% du prix du billet est reversÃ© pour chaque achat effectuÃ© via votre widget. Les commissions sont calculÃ©es automatiquement et versÃ©es mensuellement sur votre compte.",
  },
  {
    q: "Puis-je tester avant de m'abonner ?",
    a: "Oui ! La clÃ© dÃ©mo vous donne 10 requÃªtes gratuites par jour. Vous pouvez aussi analyser des vols directement sur notre page /analyse sans inscription.",
  },
  {
    q: 'Quelle est la prÃ©cision des recommandations ?',
    a: "Notre fenÃªtre optimale est confirmÃ©e dans 85% des cas analysÃ©s, sur la base de 3 ans d'observations rÃ©elles sur plus de 200 routes.",
  },
]

/* â”€â”€â”€ composant principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function LandingClient() {
  const router   = useRouter()
  const [origin, setOrigin]           = useState('')
  const [destination, setDestination] = useState('')
  const [month, setMonth]             = useState(String(new Date().getMonth() + 2).padStart(2, '0'))
  const [openFaq, setOpenFaq]         = useState<number | null>(null)
  const [demoForm, setDemoForm]       = useState({ nom: '', email: '', site: '', message: '' })
  const [demoSent, setDemoSent]       = useState(false)

  const year = new Date().getMonth() + 2 > 12
    ? new Date().getFullYear() + 1
    : new Date().getFullYear()

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!origin || !destination) return
    router.push(`/analyse?origin=${origin}&destination=${destination}&month=${year}-${month}`)
  }

  function handleDemoSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDemoSent(true)
  }

  return (
    <>
      <Header />

      <main style={{ background: 'var(--midnight)' }}>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            HERO
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
          <Stars />
          <ArcSVG />
          <RadialGlow />

          <div className="relative z-10 text-center px-6 py-32">
            <p className="fade-up text-xs font-medium tracking-widest uppercase mb-8" style={{ color: 'var(--steel)' }}>
              Pour les professionnels du voyage Â· Comparez Â· Analysez Â· CrÃ©ez l'impact
            </p>
            <h1
              className="fade-up delay-100 text-5xl md:text-7xl font-semibold leading-tight mb-6 max-w-4xl mx-auto"
              style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}
            >
              Vos clients achÃ¨tent leurs billets{' '}
              <span style={{ color: 'var(--amber)' }}>au bon moment,</span>
              {' '}pas au mauvais prix
            </h1>
            <p className="fade-up delay-200 text-xl max-w-2xl mx-auto mb-12" style={{ color: 'var(--steel-light)', lineHeight: '1.7' }}>
              Agences, comitÃ©s d'entreprise et influenceurs â€” offrez l'analyse de prix FlySmart Ã  vos clients. Ils Ã©conomisent, vous faites la diffÃ©rence.
            </p>

            <div className="fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="#contact-demo"
                className="px-8 py-4 rounded-xl font-semibold text-base"
                style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
              >
                Demander une dÃ©mo gratuite
              </a>
              <Link
                href="/analyse"
                className="px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-2 justify-center"
                style={{ background: 'transparent', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.25)' }}
              >
                Analyser un vol maintenant â†—
              </Link>
            </div>

            <div className="fade-up delay-400 flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'var(--steel)' }}>
              <span>âœ“ + de 150 professionnels</span>
              <span>âœ“ 5 ans de recul</span>
              <span>âœ“ DonnÃ©es temps rÃ©el</span>
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SEGMENTS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-6" id="segments">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-xs font-medium tracking-widest uppercase text-center mb-3" style={{ color: 'var(--steel)' }}>
                Pour qui Â· Adaptez Â· Personnalisez
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-16"
                style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}
              >
                FlySmart est fait <span style={{ color: 'var(--amber)' }}>pour vous</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SEGMENTS.map((s, i) => (
                <Reveal key={s.title} delay={i * 120}>
                  <div
                    className="rounded-2xl p-7 flex flex-col h-full"
                    style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.1)' }}
                  >
                    <div className="text-4xl mb-4">{s.icon}</div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                      {s.title}
                    </h3>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--steel-light)' }}>{s.desc}</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {s.bullets.map((b: string) => (
                        <li key={b} className="flex items-start gap-2 text-sm" style={{ color: 'var(--steel-light)' }}>
                          <span style={{ color: 'var(--green-ok)', flexShrink: 0 }}>âœ“</span> {b}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="flex items-end justify-between mt-auto pt-4"
                      style={{ borderTop: '1px solid rgba(186,199,226,0.08)' }}
                    >
                      <div>
                        <span className="text-2xl font-bold" style={{ color: 'var(--amber)' }}>{s.price}</span>
                        <span className="text-sm ml-1" style={{ color: 'var(--steel)' }}>{s.period}</span>
                      </div>
                      <Link href={s.link} className="text-sm font-medium" style={{ color: 'var(--amber)' }}>
                        {s.cta} â†’
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            BANNIÃˆRE COMMISSION
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div
          className="py-4 px-6 text-center text-sm font-medium"
          style={{
            background: 'rgba(232,163,48,0.1)',
            borderTop: '1px solid rgba(232,163,48,0.2)',
            borderBottom: '1px solid rgba(232,163,48,0.2)',
            color: 'var(--amber)',
          }}
        >
          ðŸ’° 1% de commission reversÃ©e avec chaque billet achetÃ© via votre widget â€” sans plafond Â·{' '}
          <Link href="/tarifs" style={{ textDecoration: 'underline', color: 'var(--amber)' }}>
            En savoir plus
          </Link>
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            STEPPER â€” En 3 Ã©tapes
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-6" style={{ background: 'var(--navy-deep)' }}>
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-xs font-medium tracking-widest uppercase text-center mb-3" style={{ color: 'var(--steel)' }}>
                En 3 Ã©tapes Â· Simple Â· Efficace
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-16"
                style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}
              >
                En 3 Ã©tapes, vos clients{' '}
                <span style={{ color: 'var(--amber)' }}>Ã©conomisent</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 130}>
                  <div className="relative">
                    {i < STEPS.length - 1 && (
                      <div
                        className="hidden md:block absolute top-7 left-full w-full h-px"
                        style={{ background: 'rgba(232,163,48,0.18)', zIndex: 0 }}
                      />
                    )}
                    <div
                      className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                      style={{ background: 'rgba(232,163,48,0.12)', border: '1px solid rgba(232,163,48,0.25)', zIndex: 1 }}
                    >
                      {step.icon}
                    </div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
                      {step.n}
                    </p>
                    <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--cream)' }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--steel-light)' }}>{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Exemple de recherche */}
            <Reveal delay={350}>
              <div
                className="rounded-2xl p-5"
                style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.1)' }}
              >
                <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                  <div
                    className="flex items-center gap-2 flex-1 min-w-40 rounded-lg px-3 py-2.5"
                    style={{ background: 'var(--navy-deep)', color: 'var(--steel-light)', border: '1px solid rgba(186,199,226,0.12)' }}
                  >
                    <span>âœˆ</span> CDG â€” Paris Charles de Gaulle
                  </div>
                  <div
                    className="flex items-center gap-2 flex-1 min-w-40 rounded-lg px-3 py-2.5"
                    style={{ background: 'var(--navy-deep)', color: 'var(--steel-light)', border: '1px solid rgba(186,199,226,0.12)' }}
                  >
                    <span>ðŸ“</span> JFK â€” New York John F. Kennedy
                  </div>
                  <div
                    className="rounded-lg px-3 py-2.5"
                    style={{ background: 'var(--navy-deep)', color: 'var(--steel-light)', border: '1px solid rgba(186,199,226,0.12)' }}
                  >
                    Juillet
                  </div>
                  <Link
                    href="/analyse?origin=CDG&destination=JFK&month=2025-07"
                    className="px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2"
                    style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
                  >
                    ðŸ” Analyser
                  </Link>
                </div>
                <p className="text-xs" style={{ color: 'var(--steel)' }}>
                  <span style={{ color: 'var(--amber)' }}>Exemple de rÃ©sultat :</span>{' '}
                  Prix MOYEN Â· 780 â‚¬ Â· RÃ©servez 6â€“8 semaines Ã  l'avance Â· FenÃªtre optimale Â· Ã‰conomisez jusqu'Ã  574 â‚¬
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            WIDGET PREVIEW â€” Ce que voient vos clients
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="text-xs font-medium tracking-widest uppercase text-center mb-3" style={{ color: 'var(--amber)' }}>
                AperÃ§u du produit
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-16"
                style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}
              >
                Ce que voient <span style={{ color: 'var(--amber)' }}>vos clients</span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div
                className="rounded-3xl overflow-hidden"
                style={{ border: '1px solid rgba(186,199,226,0.15)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
              >
                {/* Chrome bar */}
                <div
                  className="flex items-center gap-3 px-5 py-3"
                  style={{ background: 'var(--navy-mid)', borderBottom: '1px solid rgba(186,199,226,0.08)' }}
                >
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F56' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#27C93F' }} />
                  </div>
                  <div
                    className="mx-auto rounded-md px-4 py-1 text-xs"
                    style={{ background: 'var(--navy-deep)', color: 'var(--steel)' }}
                  >
                    flysmart.app/analyse
                  </div>
                  <div className="w-14" />
                </div>

                {/* Dashboard */}
                <div className="p-6 md:p-8" style={{ background: 'var(--midnight)' }}>
                  <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(186,199,226,0.08)' }}>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1" style={{ color: 'var(--cream)' }}>
                      CDG â€” Paris Charles de Gaulle (France) â†’ JFK â€” New York John F. Kennedy (USA)
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--steel)' }}>
                      Analyse de la fenÃªtre de rÃ©servation pour{' '}
                      <span style={{ color: 'var(--amber)', fontWeight: 600 }}>Juillet</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="rounded-xl p-4" style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.08)' }}>
                      <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--steel)' }}>Niveau de prix actuel</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'var(--amber)' }} />
                        <span className="text-sm font-semibold" style={{ color: 'var(--amber)' }}>â†’ Prix MOYEN</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--steel)' }}>dans la normale habituelle</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.08)' }}>
                      <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--steel)' }}>Prix actuel</p>
                      <p className="text-2xl font-bold mb-1" style={{ color: 'var(--cream)' }}>780 â‚¬</p>
                      <p className="text-xs" style={{ color: 'var(--steel)' }}>8 semaines avant le dÃ©part</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.08)' }}>
                      <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--steel)' }}>Ã‰conomies potentielles</p>
                      <p className="text-2xl font-bold mb-1" style={{ color: 'var(--green-ok)' }}>jusqu'Ã  574 â‚¬</p>
                      <p className="text-xs" style={{ color: 'var(--steel)' }}>vs dernier moment (1 354 â‚¬)</p>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-5 mb-4"
                    style={{ background: 'rgba(232,163,48,0.07)', border: '1px solid rgba(232,163,48,0.22)' }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium" style={{ color: 'var(--steel)' }}>RECOMMANDATION FLYSMART</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: 'rgba(74,222,128,0.2)', color: 'var(--green-ok)' }}
                          >
                            FenÃªtre optimale
                          </span>
                        </div>
                        <p className="text-xl font-semibold mb-2" style={{ color: 'var(--amber)' }}>
                          RÃ©servez 6â€“8 semaines Ã  l'avance
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--steel-light)' }}>
                          Les prix atteignent leur niveau le plus bas entre 6 et 8 semaines avant le dÃ©part.
                          Au-delÃ , les tarifs augmentent significativement.
                        </p>
                      </div>
                      <div className="flex gap-3 sm:flex-col sm:text-right shrink-0">
                        <div
                          className="rounded-xl px-5 py-3 text-center"
                          style={{ background: 'var(--amber)', minWidth: '80px' }}
                        >
                          <p className="text-lg font-bold" style={{ color: 'var(--midnight)' }}>729 â‚¬</p>
                          <p className="text-xs font-medium" style={{ color: 'rgba(13,27,42,0.7)' }}>Meilleur prix</p>
                        </div>
                        <div
                          className="rounded-xl px-5 py-3 text-center"
                          style={{ background: 'var(--navy-mid)', minWidth: '80px', border: '1px solid rgba(186,199,226,0.1)' }}
                        >
                          <p className="text-lg font-bold" style={{ color: 'var(--cream)' }}>1 354 â‚¬</p>
                          <p className="text-xs" style={{ color: 'var(--steel)' }}>Dernier moment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-5"
                    style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.08)' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium" style={{ color: 'var(--cream)' }}>
                        Ã‰volution du prix selon le dÃ©lai de rÃ©servation
                      </p>
                      <div className="hidden sm:flex items-center gap-4 text-xs" style={{ color: 'var(--steel)' }}>
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-5 h-0.5 rounded" style={{ background: 'var(--amber)' }} /> Tendance prix
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-3 h-3 rounded" style={{ background: 'rgba(74,222,128,0.3)' }} /> Zone idÃ©ale
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--amber)' }} /> Position actuelle
                        </span>
                      </div>
                    </div>
                    <svg viewBox="0 0 540 100" className="w-full" fill="none">
                      <defs>
                        <linearGradient id="lg-chart" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E8A330" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#E8A330" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <rect x="248" y="0" width="90" height="90" fill="rgba(74,222,128,0.1)" rx="2" />
                      <path
                        d="M0 18 C40 17 80 16 120 15 S170 22 200 35 S235 58 265 70 S295 74 320 76 S360 78 390 82 S430 86 480 90 S510 93 540 96"
                        stroke="#E8A330" strokeWidth="2" fill="none" strokeLinejoin="round"
                      />
                      <path
                        d="M0 18 C40 17 80 16 120 15 S170 22 200 35 S235 58 265 70 S295 74 320 76 S360 78 390 82 S430 86 480 90 S510 93 540 96 V100 H0Z"
                        fill="url(#lg-chart)"
                      />
                      <circle cx="290" cy="73" r="6" fill="#E8A330" stroke="var(--midnight)" strokeWidth="2" />
                      {['S-12','S-11','S-10','S-9','S-8','S-7','S-6','S-5','S-4','S-3','S-2','S-1'].map((l: string, idx: number) => (
                        <text key={l} x={idx * 45 + 2} y="99" fontSize="7" fill="rgba(186,199,226,0.35)">{l}</text>
                      ))}
                    </svg>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    {[
                      { icon: 'ðŸ“…', title: 'Pourquoi 6â€“8 semaines ?', desc: 'Les compagnies remplissent progressivement les appareils. Ã€ 5â€“8 semaines les siÃ¨ges restants sont nombreux mais le dÃ©lai presse.' },
                      { icon: 'ðŸ“', title: 'La flambÃ©e de derniÃ¨re minute', desc: "Ã€ moins de 2 semaines, les prix bondissent de +56% en moyenne. Les voyageurs d'affaires captent les siÃ¨ges Ã  n'importe quel prix." },
                      { icon: 'ðŸ’¡', title: 'Astuce FlySmart', desc: 'Les prix sont dans la moyenne. Surveillez les variations sur les prochains jours pour saisir une opportunitÃ©.' },
                    ].map((tip) => (
                      <div
                        key={tip.title}
                        className="rounded-xl p-4"
                        style={{ background: 'rgba(17,27,53,0.6)', border: '1px solid rgba(186,199,226,0.07)' }}
                      >
                        <p className="text-lg mb-2">{tip.icon}</p>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--cream)' }}>{tip.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--steel)' }}>{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            FORMULAIRE DÃ‰MO
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section id="contact-demo" className="py-24 px-6" style={{ background: 'var(--navy-deep)' }}>
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <p className="text-xs font-medium tracking-widest uppercase text-center mb-3" style={{ color: 'var(--amber)' }}>
                Pour les professionnels
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-4"
                style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}
              >
                Demander une dÃ©mo gratuite
              </h2>
              <p className="text-center mb-10" style={{ color: 'var(--steel-light)' }}>
                Un expert FlySmart vous contacte sous 24h pour configurer votre intÃ©gration.
              </p>
            </Reveal>

            {!demoSent ? (
              <Reveal delay={100}>
                <form
                  onSubmit={handleDemoSubmit}
                  className="rounded-2xl p-8 space-y-4"
                  style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.1)' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium" style={{ color: 'var(--steel-light)' }}>Nom</label>
                      <input
                        type="text"
                        required
                        placeholder="Jean Dupont"
                        value={demoForm.nom}
                        onChange={(e) => setDemoForm({ ...demoForm, nom: e.target.value })}
                        className="rounded-xl px-4 py-3 text-sm"
                        style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.18)', outline: 'none' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium" style={{ color: 'var(--steel-light)' }}>Email</label>
                      <input
                        type="email"
                        required
                        placeholder="jean@exemple.com"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        className="rounded-xl px-4 py-3 text-sm"
                        style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.18)', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: 'var(--steel-light)' }}>Site web</label>
                    <input
                      type="url"
                      placeholder="https://monsite.com"
                      value={demoForm.site}
                      onChange={(e) => setDemoForm({ ...demoForm, site: e.target.value })}
                      className="rounded-xl px-4 py-3 text-sm"
                      style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.18)', outline: 'none' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: 'var(--steel-light)' }}>Message</label>
                    <textarea
                      rows={4}
                      placeholder="DÃ©crivez votre projet, votre audience, vos besoins..."
                      value={demoForm.message}
                      onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                      className="rounded-xl px-4 py-3 text-sm resize-none"
                      style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.18)', outline: 'none' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-semibold"
                    style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
                  >
                    Demander ma dÃ©mo gratuite â†’
                  </button>
                </form>
              </Reveal>
            ) : (
              <Reveal>
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)' }}
                >
                  <p className="text-4xl mb-4">ðŸŽ‰</p>
                  <p className="font-semibold text-xl mb-2" style={{ color: 'var(--cream)' }}>Demande envoyÃ©e !</p>
                  <p className="text-sm" style={{ color: 'var(--steel-light)' }}>
                    Un expert FlySmart vous contacte dans les 24h.
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TÃ‰MOIGNAGES
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-xs font-medium tracking-widest uppercase text-center mb-3" style={{ color: 'var(--steel)' }}>
                Ce que disent nos partenaires
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-12"
                style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}
              >
                Ils font confiance Ã  FlySmart
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <div className="grid grid-cols-3 gap-4 mb-14">
                {TESTIMONIAL_STATS.map((s) => (
                  <div
                    key={s.value}
                    className="text-center rounded-2xl py-7"
                    style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.08)' }}
                  >
                    <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--amber)' }}>{s.value}</p>
                    <p className="text-sm" style={{ color: 'var(--steel-light)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 120}>
                  <div
                    className="rounded-2xl p-6"
                    style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.1)' }}
                  >
                    <div className="flex mb-4">
                      {'â˜…'.repeat(t.stars).split('').map((s: string, j: number) => (
                        <span key={j} style={{ color: 'var(--amber)' }}>{s}</span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--steel-light)' }}>"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
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

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            FAQ
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-6" style={{ background: 'var(--navy-deep)' }}>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-16"
                style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}
              >
                Questions frÃ©quentes
              </h2>
            </Reveal>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(186,199,226,0.12)' }}>
                    <button
                      className="w-full text-left px-6 py-4 flex items-center justify-between"
                      style={{
                        background: openFaq === i ? 'var(--navy-mid)' : 'rgba(17,27,53,0.6)',
                        color: 'var(--cream)',
                      }}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-medium">{item.q}</span>
                      <span style={{ color: 'var(--amber)', flexShrink: 0, marginLeft: '16px' }}>
                        {openFaq === i ? 'âˆ’' : '+'}
                      </span>
                    </button>
                    {openFaq === i && (
                      <div
                        className="px-6 py-4"
                        style={{ background: 'var(--navy-mid)', borderTop: '1px solid rgba(186,199,226,0.08)' }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--steel-light)' }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={350}>
              <div className="text-center mt-12">
                <p className="text-sm mb-3" style={{ color: 'var(--steel)' }}>Vous n'avez pas trouvÃ© votre rÃ©ponse ?</p>
                <a href="#contact-demo" className="text-sm font-medium" style={{ color: 'var(--amber)' }}>
                  Contactez-nous â†’
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            CTA â€” Trouvez le meilleur moment
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <h2
                className="text-3xl md:text-4xl font-semibold mb-4"
                style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}
              >
                Trouvez le meilleur moment{' '}
                <span style={{ color: 'var(--amber)' }}>pour acheter</span>
              </h2>
              <p className="mb-10" style={{ color: 'var(--steel-light)' }}>
                Testez l'analyse sur n'importe quelle route, sans inscription.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <form
                onSubmit={handleQuickSearch}
                className="rounded-2xl p-6 mb-6"
                style={{ background: 'rgba(17,27,53,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(186,199,226,0.15)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <AirportAutocomplete
                    id="cta-origin"
                    label="DÃ©part"
                    placeholder="Nice, Marseille..."
                    icon="âœˆ"
                    value={origin}
                    onChange={(v) => setOrigin(v)}
                    required
                  />
                  <AirportAutocomplete
                    id="cta-dest"
                    label="Destination"
                    placeholder="New York JFK..."
                    icon="ðŸ“"
                    value={destination}
                    onChange={(v) => setDestination(v)}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: 'var(--steel-light)' }}>Mois</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="rounded-lg px-3 py-3 text-sm"
                      style={{ background: 'var(--navy-deep)', color: 'var(--cream)', border: '1px solid rgba(186,199,226,0.2)', outline: 'none' }}
                    >
                      {[['01','Jan'],['02','FÃ©v'],['03','Mar'],['04','Avr'],['05','Mai'],['06','Jun'],
                        ['07','Jul'],['08','AoÃ»'],['09','Sep'],['10','Oct'],['11','Nov'],['12','DÃ©c']].map(([v,l]) => (
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
                  Analyser le vol â†’
                </button>
              </form>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-sm" style={{ color: 'var(--steel)' }}>
                Partagez ce rÃ©sultat avec vos clients Â·{' '}
                <Link href="/tarifs" style={{ color: 'var(--amber)' }}>Voir les tarifs â†’</Link>
              </p>
            </Reveal>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            BARRE DE STATS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <div style={{ background: 'var(--navy-deep)', borderTop: '1px solid rgba(186,199,226,0.08)', borderBottom: '1px solid rgba(186,199,226,0.08)' }}>
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s, i) => (
                <Reveal key={s.value} delay={i * 80}>
                  <div className="text-center">
                    <p className="text-2xl mb-2">{s.icon}</p>
                    <p className="text-3xl font-bold mb-1" style={{ color: 'var(--amber)' }}>{s.value}</p>
                    <p className="text-sm" style={{ color: 'var(--steel-light)' }}>{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            PARTENAIRES
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="text-xs font-medium tracking-widest uppercase mb-8" style={{ color: 'var(--steel)' }}>
                Nos partenaires
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-wrap justify-center items-center gap-4">
                {PARTNERS.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 rounded-xl px-5 py-3"
                    style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.1)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: 'rgba(232,163,48,0.15)', color: 'var(--amber)' }}
                    >
                      {p.initial}
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--steel-light)' }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* â”€â”€ FOOTER â”€â”€ */}
        <footer className="py-10 px-6" style={{ borderTop: '1px solid rgba(186,199,226,0.08)' }}>
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-semibold" style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)' }}>FlySmart</p>
            <nav className="flex gap-6 text-sm" style={{ color: 'var(--steel)' }}>
              <Link href="/analyse" className="hover:text-amber-400 transition-colors">Analyser</Link>
              <Link href="/widget-demo" className="hover:text-amber-400 transition-colors">Widget</Link>
              <Link href="/tarifs" className="hover:text-amber-400 transition-colors">Tarifs</Link>
              <Link href="#contact-demo" className="hover:text-amber-400 transition-colors">Contact</Link>
            </nav>
            <p className="text-xs" style={{ color: 'var(--steel)' }}>Â© {new Date().getFullYear()} FlySmart Â· Tous droits rÃ©servÃ©s</p>
          </div>
        </footer>

      </main>
    </>
  )
}



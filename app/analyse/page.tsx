'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts'
import AirportAutocomplete from '@/app/components/AirportAutocomplete'
import Link from 'next/link'
import { AIRPORTS } from '@/lib/airports'

const MONTHS = [
  { value: '01', label: 'Janvier' },  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },     { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },      { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },{ value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' }, { value: '12', label: 'Décembre' },
]

interface PricePoint {
  week: number
  label: string
  price: number
  zone: string
  isOptimal?: boolean
}

interface Analysis {
  priceLevel: 'LOW' | 'AVERAGE' | 'HIGH'
  price_level_label: string
  bestBookingWindow: string
  potentialSavingsVsLastMinute: number
  chart: PricePoint[]
  current_price: number
  currency: string
  source: 'amadeus' | 'model'
  recommendation: string
  score: number
  confidence: string
  route?: string
}

const LEVEL_CONFIG = {
  LOW: {
    symbol: '✓', label: 'Prix BAS', sub: 'en dessous de la normale',
    dotColor: 'rgb(74, 222, 128)',
    badgeBg: 'rgba(74,222,128,0.1)', badgeBorder: 'rgba(74,222,128,0.25)', textColor: 'rgb(134, 239, 172)',
    cardBg: 'linear-gradient(135deg, rgba(20, 50, 35, 0.9) 0%, rgba(17, 27, 53, 0.9) 100%)',
    cardBorder: 'rgba(74, 222, 128, 0.2)',
  },
  AVERAGE: {
    symbol: '→', label: 'Prix MOYEN', sub: 'dans la normale',
    dotColor: 'rgb(232, 163, 48)',
    badgeBg: 'rgba(232,163,48,0.1)', badgeBorder: 'rgba(232,163,48,0.25)', textColor: 'var(--amber)',
    cardBg: 'linear-gradient(135deg, rgba(26, 40, 71, 0.9) 0%, rgba(17, 27, 53, 0.9) 100%)',
    cardBorder: 'rgba(107, 127, 168, 0.15)',
  },
  HIGH: {
    symbol: '⚠', label: 'Prix ÉLEVÉ', sub: 'au-dessus de la normale',
    dotColor: 'rgb(239, 68, 68)',
    badgeBg: 'rgba(239,68,68,0.1)', badgeBorder: 'rgba(239,68,68,0.25)', textColor: 'rgb(252, 165, 165)',
    cardBg: 'linear-gradient(135deg, rgba(50, 20, 20, 0.9) 0%, rgba(17, 27, 53, 0.9) 100%)',
    cardBorder: 'rgba(239, 68, 68, 0.2)',
  },
}

function getAirportDisplay(iata: string): string {
  if (!iata) return ''
  const a = AIRPORTS.find((ap) => ap.iata === iata.toUpperCase())
  if (!a) return iata
  return `${a.iata} — ${a.city} ${a.name} (${a.country})`
}

function extractIata(display: string): string {
  const m = display.match(/^([A-Z]{3})\s*[\u2014-]/)
  return m ? m[1] : display.slice(0, 3).toUpperCase()
}
// Tooltip personnalisé
function CustomTooltip({
  active, payload, label,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: PricePoint }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div style={{
      background: 'var(--navy-mid)',
      border: '1px solid rgba(232,163,48,0.4)',
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '13px',
    }}>
      <p style={{ color: 'var(--amber)', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ color: 'var(--cream)' }}>{payload[0].value} €</p>
      {point.isOptimal && (
        <p style={{ color: 'rgb(134, 239, 172)', fontSize: '11px', marginTop: 2 }}>✓ Fenêtre optimale</p>
      )}
    </div>
  )
}

/* ─── Contenu principal ────────────────────────────────────────── */
function AnalyseContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const fromParam  = searchParams.get('from')?.toUpperCase() ?? ''
  const toParam    = searchParams.get('to')?.toUpperCase() ?? ''
  const monthParam = (searchParams.get('month') ?? String(new Date().getMonth() + 2).padStart(2, '0')).padStart(2, '0')

  const [origin,      setOrigin]      = useState(() => fromParam ? getAirportDisplay(fromParam) : '')
  const [destination, setDestination] = useState(() => toParam   ? getAirportDisplay(toParam)   : '')
  const [month,       setMonth]       = useState(monthParam)
  const [loading,     setLoading]     = useState(false)
  const [analysis,    setAnalysis]    = useState<Analysis | null>(null)
  const [error,       setError]       = useState('')

  const monthLabel = MONTHS.find((m) => m.value === month)?.label ?? ''

  const runAnalysis = useCallback(async (iataFrom: string, iataTo: string, mm: string) => {
    if (!iataFrom || !iataTo) return
    setLoading(true)
    setError('')
    setAnalysis(null)
    try {
      const res = await fetch(`/api/price-trends?origin=${iataFrom}&destination=${iataTo}&month=${mm}`)
      if (!res.ok) throw new Error('Erreur serveur')
      const data: Analysis = await res.json()
      setAnalysis(data)
    } catch {
      setError('Impossible d\'analyser ce vol. Vérifiez les codes aéroports et réessayez.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (fromParam && toParam) {
      runAnalysis(fromParam, toParam, monthParam)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!origin || !destination) return

    const from = extractIata(origin)
    const to   = extractIata(destination)
    const mm   = month.padStart(2, '0')
    router.push(`/analyse?from=${from}&to=${to}&month=${mm}`)
    runAnalysis(from, to, mm)
  }

  const level           = analysis ? LEVEL_CONFIG[analysis.priceLevel] : null
  const bestPrice       = analysis ? Math.min(...analysis.chart.map((p) => p.price)) : 0
  const lastMinutePrice = analysis ? analysis.current_price + analysis.potentialSavingsVsLastMinute : 0
  const optimalPoints   = analysis?.chart.filter((p) => p.isOptimal) ?? []

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--midnight)' }}>

      {/* ── Nav ── */}
      <nav
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6"
        style={{ borderBottom: '1px solid rgba(107, 127, 168, 0.08)' }}
        aria-label="Navigation analyse"
      >
        <Link href="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="transition-colors duration-200"
            style={{ color: 'var(--steel)' }}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="font-display text-2xl font-semibold tracking-wide" style={{ color: 'var(--amber)' }}>
            Fly<span style={{ color: 'var(--cream)' }}>Smart</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          {analysis && (
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: 'rgba(107, 127, 168, 0.12)',
                border: '1px solid rgba(107, 127, 168, 0.18)',
                color: 'var(--steel-light)',
              }}
            >
              {analysis.source === 'amadeus' ? 'Données Amadeus' : 'Modèle local'}
            </span>
          )}
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded-lg transition-all duration-200"
            style={{ color: 'var(--steel-light)', border: '1px solid rgba(107, 127, 168, 0.2)' }}
          >
            Nouvelle recherche
          </Link>
        </div>

        <Link
          href="/"
          className="md:hidden text-sm px-3 py-1.5 rounded-lg"
          style={{ color: 'var(--steel-light)', border: '1px solid rgba(107, 127, 168, 0.2)' }}
        >
          ← Retour
        </Link>
      </nav>

      {/* ── Contenu ── */}
      <div className="relative z-10 flex-1 px-6 md:px-12 py-10 max-w-5xl mx-auto w-full">

        {/* Titre */}
        {fromParam ? (
          <div className="mb-8 fade-up">
            <h1
              className="font-display leading-tight mb-2"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', fontWeight: 400, color: 'var(--cream)' }}
            >
              {getAirportDisplay(fromParam)}{' '}
              <span style={{ color: 'var(--steel)' }}>→</span>{' '}
              {getAirportDisplay(toParam)}
            </h1>
            <p style={{ color: 'var(--steel-light)', fontSize: '0.95rem' }}>
              Analyse de la fenêtre de réservation pour{' '}
              <span style={{ color: 'var(--cream)' }}>{MONTHS.find((m) => m.value === monthParam)?.label}</span>
            </p>
          </div>
        ) : (
          <div className="mb-8 fade-up text-center">
            <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
              Moteur d&apos;analyse
            </p>
            <h1 className="font-display text-3xl md:text-4xl mb-3" style={{ fontWeight: 300, color: 'var(--cream)' }}>
              Analysez votre vol
            </h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--steel-light)' }}>
              Entrez votre route pour voir la courbe de prix et savoir exactement quand acheter.
            </p>
          </div>
        )}

        {/* ── Formulaire ── */}
        <form
          onSubmit={handleSearch}
          className="rounded-2xl p-4 md:p-5 mb-8"
          style={{
            background: 'rgba(17, 27, 53, 0.72)',
            border: '1px solid rgba(107, 127, 168, 0.16)',
            backdropFilter: 'blur(16px)',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 18px 48px',
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em]" style={{ color: 'var(--steel)' }}>
                Rechercher un trajet
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--steel-light)' }}>
                Autocomplete IATA par ville, aéroport ou code.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_180px] gap-4">
            <AirportAutocomplete
              id="analysis-origin"
              label="Départ"
              placeholder="Paris, CDG"
              icon="✈"
              value={origin}
              onChange={(v) => setOrigin(v)}
              required
            />
            <AirportAutocomplete
              id="analysis-destination"
              label="Arrivée"
              placeholder="New York, JFK"
              icon="📍"
              value={destination}
              onChange={(v) => setDestination(v)}
              required
            />
            <div className="flex flex-col gap-2">
              <label
                htmlFor="analysis-month"
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--steel)' }}
              >
                Mois
              </label>
              <select
                id="analysis-month"
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 text-sm appearance-none cursor-pointer"
                style={{
                  background: 'rgba(8, 12, 24, 0.6)',
                  border: '1px solid rgba(107, 127, 168, 0.15)',
                  color: 'var(--cream)',
                  outline: 'none',
                }}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value} style={{ background: 'rgb(13, 20, 38)' }}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto rounded-xl px-5 py-3.5 font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, rgb(232, 163, 48) 0%, rgb(196, 132, 42) 100%)',
                color: 'rgb(8, 12, 24)',
                boxShadow: 'rgba(232, 163, 48, 0.22) 0px 10px 30px',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Analyse en cours…' : 'Analyser les prix'}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-center text-sm" style={{ color: 'rgb(252, 165, 165)' }}>{error}</p>
          )}
        </form>

        {/* ── Chargement ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
              className="w-12 h-12 rounded-full animate-spin"
              style={{ border: '2px solid rgba(107, 127, 168, 0.2)', borderTopColor: 'var(--amber)' }}
            />
            <p style={{ color: 'var(--steel-light)' }}>Analyse en cours…</p>
          </div>
        )}

        {/* ── Résultats ── */}
        {analysis && level && !loading && (
          <>
            {/* Stats */}
            <div className="fade-up delay-100 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              {/* Niveau de prix */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: level.cardBg, border: `1px solid ${level.cardBorder}` }}
              >
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--steel)' }}>
                  Niveau de prix actuel
                </p>
                <div
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                  style={{ background: level.badgeBg, border: `1px solid ${level.badgeBorder}` }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: level.dotColor }} />
                  <span className="font-semibold text-sm" style={{ color: level.textColor }}>
                    {level.symbol} {level.label}
                  </span>
                  <span className="text-xs opacity-70" style={{ color: level.textColor }}>{level.sub}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--steel-light)' }}>
                  {level.label} — {level.sub}
                </p>
              </div>

              {/* Prix actuel */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(232, 163, 48, 0.08) 0%, rgba(17, 27, 53, 0.9) 100%)',
                  border: '1px solid rgba(232, 163, 48, 0.25)',
                  boxShadow: 'rgba(232, 163, 48, 0.05) 0px 0px 30px',
                }}
              >
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--steel)' }}>
                  Prix actuel
                </p>
                <p className="font-display text-3xl font-semibold" style={{ color: 'var(--amber)' }}>
                  {analysis.current_price}&nbsp;€
                </p>
                <p className="text-xs" style={{ color: 'var(--steel-light)' }}>
                  Pour {monthLabel}
                </p>
              </div>

              {/* Économies */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(26, 40, 71, 0.9) 0%, rgba(17, 27, 53, 0.9) 100%)',
                  border: '1px solid rgba(107, 127, 168, 0.15)',
                }}
              >
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--steel)' }}>
                  Économies potentielles
                </p>
                <p className="font-display text-3xl font-semibold" style={{ color: 'rgb(159, 227, 174)' }}>
                  jusqu&apos;à {analysis.potentialSavingsVsLastMinute}&nbsp;€
                </p>
                <p className="text-xs" style={{ color: 'var(--steel-light)' }}>
                  Réserver maintenant vs. dernier moment ({lastMinutePrice}&nbsp;€)
                </p>
              </div>
            </div>

            {/* Recommandation */}
            <div
              className="fade-up delay-150 rounded-2xl p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 40, 71, 0.95) 0%, rgba(17, 27, 53, 0.95) 100%)',
                border: '1px solid rgba(232, 163, 48, 0.3)',
                boxShadow: 'rgba(232, 163, 48, 0.06) 0px 0px 40px, rgba(232, 163, 48, 0.08) 0px 1px 0px inset',
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--steel)' }}>
                      Recommandation FlySmart
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(232, 163, 48, 0.1)',
                        border: '1px solid rgba(232, 163, 48, 0.2)',
                        color: 'var(--amber)',
                      }}
                    >
                      Fenêtre optimale
                    </span>
                  </div>
                  <h2
                    className="font-display text-2xl md:text-3xl mb-2"
                    style={{ color: 'var(--cream)', fontWeight: 300 }}
                  >
                    Réservez{' '}
                    <span style={{ color: 'var(--amber)', fontWeight: 600, textShadow: 'rgba(232, 163, 48, 0.35) 0px 0px 30px' }}>
                      {analysis.bestBookingWindow}
                    </span>
                  </h2>
                  <p style={{ color: 'var(--steel-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {analysis.recommendation}
                  </p>
                </div>
                <div className="shrink-0 grid grid-cols-2 gap-3 text-center">
                  <div
                    className="rounded-xl px-5 py-3"
                    style={{ background: 'rgba(105, 188, 122, 0.1)', border: '1px solid rgba(105, 188, 122, 0.2)' }}
                  >
                    <p className="font-display text-2xl font-semibold" style={{ color: 'rgb(159, 227, 174)' }}>
                      {bestPrice}&nbsp;€
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--steel)' }}>Meilleur prix</p>
                  </div>
                  <div
                    className="rounded-xl px-5 py-3"
                    style={{ background: 'rgba(220, 80, 80, 0.08)', border: '1px solid rgba(220, 80, 80, 0.15)' }}
                  >
                    <p className="font-display text-2xl font-semibold" style={{ color: 'rgb(240, 144, 144)' }}>
                      {lastMinutePrice}&nbsp;€
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--steel)' }}>Dernier moment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique */}
            <div
              className="fade-up delay-200 rounded-2xl p-6 md:p-8 mb-6"
              style={{
                background: 'rgba(17, 27, 53, 0.6)',
                border: '1px solid rgba(107, 127, 168, 0.12)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-xl mb-1" style={{ color: 'var(--cream)', fontWeight: 500 }}>
                    Évolution du prix selon le délai de réservation
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--steel)' }}>
                    S-12 = 12 semaines avant le départ · Zone verte = fenêtre optimale ({analysis.bestBookingWindow})
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: 'rgb(232, 163, 48)' }} />
                    <span style={{ color: 'var(--steel)' }}>Tendance prix</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: 'rgb(107, 191, 122)' }} />
                    <span style={{ color: 'var(--steel)' }}>Zone idéale</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={analysis.chart} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#E8A330" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E8A330" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 127, 168, 0.08)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: 'var(--steel)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--steel)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}€`}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {optimalPoints.map((p) => (
                    <ReferenceLine
                      key={p.label}
                      x={p.label}
                      stroke="rgba(105, 188, 122, 0.25)"
                      strokeDasharray="4 3"
                      strokeWidth={1}
                    />
                  ))}
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#E8A330"
                    strokeWidth={2.5}
                    fill="url(#priceGradient)"
                    fillOpacity={0.6}
                    dot={(props: Record<string, unknown>) => {
                      const cx = props.cx as number
                      const cy = props.cy as number
                      const payload = props.payload as PricePoint
                      if (payload.isOptimal) {
                        return <circle key={`dot-${payload.week}`} cx={cx} cy={cy} r={4} fill="#6BBF7A" opacity={0.8} />
                      }
                      return <circle key={`dot-${payload.week}`} cx={cx} cy={cy} r={3} fill="rgba(107, 127, 168, 0.5)" />
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ─── Export avec Suspense ─────────────────────────────────────── */
export default function AnalysePage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--midnight)' }}
        >
          <div
            className="w-12 h-12 rounded-full animate-spin"
            style={{ border: '2px solid rgba(107,127,168,0.2)', borderTopColor: 'var(--amber)' }}
          />
        </div>
      }
    >
      <AnalyseContent />
    </Suspense>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts'
import AirportAutocomplete from '@/app/components/AirportAutocomplete'
import Header from '@/app/components/Header'

const MONTHS = [
  { value: '01', label: 'Janvier' }, { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },    { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },     { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' }, { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' }, { value: '10', label: 'Octobre' },
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
  source: string
  recommendation: string
  score: number
  confidence: string
  route?: string
}

const LEVEL_CONFIG = {
  LOW:     { label: 'Prix bas',  color: 'var(--green-ok)',   bg: 'rgba(74,222,128,0.12)',  icon: '✓' },
  AVERAGE: { label: 'Prix moyen', color: 'var(--orange-mid)', bg: 'rgba(249,115,22,0.12)', icon: '~' },
  HIGH:    { label: 'Prix élevé', color: 'var(--red-alert)',  bg: 'rgba(239,68,68,0.12)',  icon: '⚠' },
}

const ZONE_COLOR: Record<string, string> = {
  too_early: 'rgba(107,127,168,0.4)',
  transition:'rgba(249,115,22,0.5)',
  optimal:   'rgba(74,222,128,0.8)',
  too_late:  'rgba(239,68,68,0.5)',
}

// Tooltip personnalisé
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: PricePoint }>; label?: string }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(232,163,48,0.4)', borderRadius: '8px', padding: '10px 14px' }}>
      <p style={{ color: 'var(--amber)', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ color: 'var(--cream)' }}>{payload[0].value} €</p>
      {point.isOptimal && <p style={{ color: 'var(--green-ok)', fontSize: '12px' }}>✓ Fenêtre optimale</p>}
    </div>
  )
}

export default function AnalysePage() {
  const [origin,      setOrigin]      = useState('')
  const [destination, setDestination] = useState('')
  const [month,       setMonth]       = useState(String(new Date().getMonth() + 2).padStart(2, '0'))
  const [loading,     setLoading]     = useState(false)
  const [analysis,    setAnalysis]    = useState<Analysis | null>(null)
  const [error,       setError]       = useState('')

  const year = new Date().getMonth() + 2 > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear()

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!origin || !destination) return

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const res = await fetch(
        `/api/price-trends?origin=${origin}&destination=${destination}&month=${year}-${month}`
      )
      if (!res.ok) throw new Error('Erreur serveur')
      const data: Analysis = await res.json()
      setAnalysis(data)
    } catch {
      setError('Impossible d\'analyser ce vol. Vérifiez les codes aéroports et réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const level = analysis ? LEVEL_CONFIG[analysis.priceLevel] : null

  return (
    <>
      <Header ctaHref="/tarifs" ctaLabel="Voir les offres" />

      <main className="min-h-screen pt-20" style={{ background: 'var(--midnight)' }}>
        {/* ── Hero ── */}
        <section className="py-16 px-6 text-center">
          <p className="fade-up text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--amber)' }}>
            Moteur d'analyse
          </p>
          <h1 className="fade-up delay-100 text-4xl md:text-5xl font-semibold mb-4 leading-tight" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
            Analysez votre vol
          </h1>
          <p className="fade-up delay-200 text-lg max-w-xl mx-auto" style={{ color: 'var(--steel-light)' }}>
            Entrez votre route pour voir la courbe de prix et savoir exactement quand acheter.
          </p>
        </section>

        {/* ── Formulaire ── */}
        <section className="pb-10 px-6">
          <form
            onSubmit={handleSearch}
            className="mx-auto max-w-3xl rounded-2xl p-8"
            style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.12)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <AirportAutocomplete
                id="analyse-origin"
                label="Départ"
                placeholder="Paris CDG"
                icon="✈"
                value={origin}
                onChange={(v) => setOrigin(v)}
                required
              />
              <AirportAutocomplete
                id="analyse-dest"
                label="Destination"
                placeholder="New York JFK"
                icon="📍"
                value={destination}
                onChange={(v) => setDestination(v)}
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" style={{ color: 'var(--steel-light)' }}>Mois de départ</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="rounded-lg px-3 py-3 text-sm"
                  style={{
                    background: 'var(--navy-deep)',
                    color: 'var(--cream)',
                    border: '1px solid rgba(186,199,226,0.2)',
                    outline: 'none',
                  }}
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !origin || !destination}
              className="w-full py-3 rounded-lg font-semibold text-base transition-opacity"
              style={{
                background: 'var(--amber)',
                color: 'var(--midnight)',
                opacity: loading || !origin || !destination ? 0.6 : 1,
              }}
            >
              {loading ? 'Analyse en cours…' : 'Analyser ce vol →'}
            </button>

            {error && (
              <p className="mt-4 text-center text-sm" style={{ color: 'var(--red-alert)' }}>{error}</p>
            )}
          </form>
        </section>

        {/* ── Résultats ── */}
        {analysis && level && (
          <section className="px-6 pb-20">
            <div className="mx-auto max-w-3xl space-y-6">

              {/* Verdict */}
              <div
                className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                style={{ background: level.bg, border: `1px solid ${level.color}40` }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                  style={{ background: level.color, color: 'var(--midnight)' }}
                >
                  {level.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: level.color }}>
                    {analysis.route} — {MONTHS.find((m) => m.value === month)?.label}
                  </p>
                  <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                    {analysis.recommendation}
                  </h2>
                  <p style={{ color: 'var(--steel-light)' }}>
                    Prix actuel&nbsp;: <strong style={{ color: 'var(--amber)' }}>{analysis.current_price} {analysis.currency}</strong>
                    &nbsp;·&nbsp; Fenêtre optimale&nbsp;: <strong style={{ color: 'var(--cream)' }}>{analysis.bestBookingWindow}</strong>
                    &nbsp;·&nbsp; Économie potentielle&nbsp;: <strong style={{ color: 'var(--green-ok)' }}>−{analysis.potentialSavingsVsLastMinute} {analysis.currency}</strong>
                  </p>
                </div>
                <div
                  className="text-center px-4 py-2 rounded-lg flex-shrink-0"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  <p className="text-3xl font-bold" style={{ color: level.color }}>{analysis.score}</p>
                  <p className="text-xs" style={{ color: 'var(--steel)' }}>Score</p>
                </div>
              </div>

              {/* Graphique */}
              <div className="rounded-2xl p-6" style={{ background: 'var(--navy-mid)', border: '1px solid rgba(186,199,226,0.12)' }}>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
                  Évolution du prix — 12 semaines
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--steel)' }}>
                  Source : {analysis.source === 'amadeus' ? 'Amadeus (données réelles)' : 'Modèle FlySmart'}
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={analysis.chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--amber)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--amber)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(186,199,226,0.08)" />
                    <XAxis dataKey="label" tick={{ fill: 'var(--steel)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--steel)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                      x="S-5"
                      stroke="var(--green-ok)"
                      strokeDasharray="4 4"
                      label={{ value: 'Optimal', position: 'top', fill: 'var(--green-ok)', fontSize: 11 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="var(--amber)"
                      strokeWidth={2}
                      fill="url(#areaGrad)"
                      dot={(props: { cx: number; cy: number; payload: PricePoint }) => {
                        const { cx, cy, payload } = props
                        if (payload.isOptimal) {
                          return <circle key={`dot-${payload.week}`} cx={cx} cy={cy} r={6} fill="var(--green-ok)" stroke="var(--navy-mid)" strokeWidth={2} />
                        }
                        return <circle key={`dot-${payload.week}`} cx={cx} cy={cy} r={3} fill={ZONE_COLOR[payload.zone] ?? 'var(--amber)'} />
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>

                {/* Légende zones */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {[
                    { zone: 'too_early', label: 'Trop tôt' },
                    { zone: 'transition', label: 'Transition' },
                    { zone: 'optimal',   label: 'Optimal' },
                    { zone: 'too_late',  label: 'Dernière minute' },
                  ].map(({ zone, label }) => (
                    <div key={zone} className="flex items-center gap-2 text-sm" style={{ color: 'var(--steel-light)' }}>
                      <span className="w-3 h-3 rounded-full" style={{ background: ZONE_COLOR[zone] }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-4">
                <p className="mb-4" style={{ color: 'var(--steel-light)' }}>
                  Intégrez cette analyse sur votre site en quelques lignes de code.
                </p>
                <a
                  href="/tarifs"
                  className="inline-block px-8 py-3 rounded-lg font-semibold"
                  style={{ background: 'var(--amber)', color: 'var(--midnight)' }}
                >
                  Accéder à l'API →
                </a>
              </div>

            </div>
          </section>
        )}
      </main>
    </>
  )
}

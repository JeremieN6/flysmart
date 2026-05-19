/* ─────────────────────────────────────────────────────────────
   Fond étoilé + arc SVG décoratif, réutilisables sur chaque page
───────────────────────────────────────────────────────────── */
export function Stars() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    left: `${((i * 37 + 13) % 100)}%`,
    top:  `${((i * 23 + 7)  % 60)}%`,
    size: 0.5 + (i % 7) * 0.25,
    delay: `${(i % 10) * 0.4}s`,
    duration: `${2 + (i % 30) * 0.1}s`,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: 'white',
            animation: `twinkle ${s.duration} ease-in-out infinite ${s.delay}`,
            opacity: 0.2,
          }}
        />
      ))}
    </div>
  )
}

export function ArcSVG() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute w-full"
        viewBox="0 0 1200 400"
        fill="none"
        preserveAspectRatio="none"
        style={{ top: '-5%', height: '55vh', opacity: 0.12 }}
      >
        <path
          d="M-100 350 C 200 50, 600 20, 900 120 C 1050 170, 1150 200, 1300 180"
          stroke="url(#arcGrad)"
          strokeDasharray="8 6"
          strokeWidth="1.5"
        />
        <path
          d="M-50 380 C 250 80, 650 30, 950 140 C 1100 190, 1200 230, 1350 200"
          stroke="url(#arcGrad2)"
          strokeDasharray="4 8"
          strokeWidth="0.8"
        />
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6B7FA8" stopOpacity="0" />
            <stop offset="40%"  stopColor="#E8A330" stopOpacity="1" />
            <stop offset="100%" stopColor="#6B7FA8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="arcGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6B7FA8" stopOpacity="0" />
            <stop offset="60%"  stopColor="#8A9EC4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6B7FA8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export function RadialGlow() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 100% 70% at 50% -10%, rgba(26,56,103,0.55) 0%, transparent 65%),
          radial-gradient(ellipse 50% 40% at 85% 5%, rgba(232,163,48,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 70% 50% at 10% 90%, rgba(13,20,38,0.6) 0%, transparent 60%)
        `,
      }}
    />
  )
}

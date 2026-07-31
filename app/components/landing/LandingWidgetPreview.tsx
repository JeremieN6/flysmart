"use client";

import { useState } from "react";
import Reveal from "@/app/components/Reveal";

const W_LABELS = ["S-12","S-11","S-10","S-9","S-8","S-7","S-6","S-5","S-4","S-3","S-2","S-1"];

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  const get = (i: number): [number, number] => {
    if (i < 0) return [2 * pts[0][0] - pts[1][0], 2 * pts[0][1] - pts[1][1]];
    if (i >= pts.length) return [2 * pts[pts.length-1][0] - pts[pts.length-2][0], 2 * pts[pts.length-1][1] - pts[pts.length-2][1]];
    return pts[i];
  };
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const prev = get(i-1), p1 = pts[i], p2 = pts[i+1], next2 = get(i+2);
    const cp1x = p1[0] + (p2[0] - prev[0]) / 6, cp1y = p1[1] + (p2[1] - prev[1]) / 6;
    const cp2x = p2[0] - (next2[0] - p1[0]) / 6, cp2y = p2[1] - (next2[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

type RouteData = {
  label: string; title: string; conseil: string; economy: string;
  grid: { y: number; label: string }[];
  points: [number, number][];
  optimalIdx: number; zoneStartIdx: number; zoneEndIdx: number;
  stats: { label: string; value: string; color: string }[];
  legend: { text: string; bg: string; color: string }[];
};

const WIDGET_ROUTES: RouteData[] = [
  {
    label: "Paris → New York", title: "Paris → New York",
    conseil: "Réservez 5 à 7 semaines avant le départ", economy: "52%",
    grid: [{ y: 18, label: "1 020 €" }, { y: 122, label: "740 €" }, { y: 226, label: "460 €" }],
    points: [[62,92],[112.91,102],[163.82,115],[214.73,129],[265.64,142],[316.55,152],[367.45,178],[418.36,219],[469.27,191],[520.18,150],[571.09,100],[622,24]],
    optimalIdx: 7, zoneStartIdx: 6, zoneEndIdx: 8,
    stats: [
      { label: "Prix optimal", value: "480€", color: "var(--amber)" },
      { label: "Prix à S−12", value: "820€", color: "var(--cream)" },
      { label: "Économie vs S−1", value: "–52%", color: "rgb(74, 222, 128)" },
    ],
    legend: [
      { text: "S-12 à S-9 : prix premium, anticipation nécessaire.", bg: "rgba(239, 68, 68, 0.08)", color: "rgb(252, 165, 165)" },
      { text: "S-6 à S-4 : fenêtre idéale pour Paris → New York.", bg: "rgba(74, 222, 128, 0.08)", color: "rgb(134, 239, 172)" },
      { text: "S-2 à S-1 : la hausse peut doubler le tarif.", bg: "rgba(232, 163, 48, 0.08)", color: "rgb(246, 201, 120)" },
    ],
  },
  {
    label: "Lyon → Barcelone", title: "Lyon → Barcelone",
    conseil: "Réservez 8 à 10 semaines avant le départ", economy: "77%",
    grid: [{ y: 18, label: "265 €" }, { y: 122, label: "155 €" }, { y: 226, label: "45 €" }],
    points: [[62,119],[112.91,136],[163.82,150],[214.73,180],[265.64,216],[316.55,209],[367.45,200],[418.36,189],[469.27,179],[520.18,152],[571.09,110],[622,34]],
    optimalIdx: 4, zoneStartIdx: 3, zoneEndIdx: 5,
    stats: [
      { label: "Prix optimal", value: "56€", color: "var(--amber)" },
      { label: "Prix à S−12", value: "158€", color: "var(--cream)" },
      { label: "Économie vs S−1", value: "–77%", color: "rgb(74, 222, 128)" },
    ],
    legend: [
      { text: "S-12 à S-10 : tarifs encore élevés pour une low-cost.", bg: "rgba(239, 68, 68, 0.08)", color: "rgb(252, 165, 165)" },
      { text: "S-9 à S-7 : la zone la plus économique pour cette route.", bg: "rgba(74, 222, 128, 0.08)", color: "rgb(134, 239, 172)" },
      { text: "S-2 à S-1 : dernière minute, les prix explosent.", bg: "rgba(232, 163, 48, 0.08)", color: "rgb(246, 201, 120)" },
    ],
  },
  {
    label: "Paris → Tokyo", title: "Paris → Tokyo",
    conseil: "Réservez 4 à 6 semaines avant le départ", economy: "35%",
    grid: [{ y: 18, label: "1 010 €" }, { y: 119.69, label: "790 €" }, { y: 226, label: "560 €" }],
    points: [[62,91.96],[112.91,105.82],[163.82,122],[214.73,138.18],[265.64,156.67],[316.55,175.16],[367.45,189.02],[418.36,198.27],[469.27,191.33],[520.18,156.67],[571.09,105.82],[622,45.73]],
    optimalIdx: 7, zoneStartIdx: 6, zoneEndIdx: 8,
    stats: [
      { label: "Prix optimal", value: "620€", color: "var(--amber)" },
      { label: "Prix à S−12", value: "850€", color: "var(--cream)" },
      { label: "Économie vs S−1", value: "–35%", color: "rgb(74, 222, 128)" },
    ],
    legend: [
      { text: "S-12 à S-9 : le billet est encore premium.", bg: "rgba(239, 68, 68, 0.08)", color: "rgb(252, 165, 165)" },
      { text: "S-6 à S-4 : la zone d'achat devient la plus intéressante.", bg: "rgba(74, 222, 128, 0.08)", color: "rgb(134, 239, 172)" },
      { text: "S-2 à S-1 : la remontée s'accélère fortement.", bg: "rgba(232, 163, 48, 0.08)", color: "rgb(246, 201, 120)" },
    ],
  },
];

export default function LandingWidgetPreview() {
  const [widgetRoute, setWidgetRoute] = useState(2);

  const wr = WIDGET_ROUTES[widgetRoute];
  const wOptX = wr.points[wr.optimalIdx][0];
  const wOptY = wr.points[wr.optimalIdx][1];
  const wZoneX = wr.points[wr.zoneStartIdx][0];
  const wZoneW = wr.points[wr.zoneEndIdx][0] - wZoneX;
  const wZoneCX = wZoneX + wZoneW / 2;
  const wStroke = smoothPath(wr.points);
  const wFill = wStroke + ` L ${wr.points[wr.points.length - 1][0]} 226 L ${wr.points[0][0]} 226 Z`;

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p
            className="text-xs font-medium tracking-widest uppercase text-center mb-3"
            style={{ color: "var(--amber)" }}
          >
            Aperçu interactif du produit
          </p>
          <h2
            className="text-3xl md:text-4xl font-semibold text-center"
            style={{
              color: "var(--cream)",
              fontFamily: "var(--font-display)",
            }}
          >
            Ce que voit{" "}
            <span style={{ color: "var(--amber)" }}>votre equipe</span>
          </h2>
          <p className="text-sm text-center mt-4 mb-16" style={{ color: "var(--steel-light)" }}>Cet outil s'intègre sur votre site en moins de 2 minutes</p>
        </Reveal>

        <Reveal delay={100}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(107, 127, 168, 0.15)",
              boxShadow: "rgba(0, 0, 0, 0.5) 0px 30px 80px",
            }}
          >
            {/* Chrome bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ background: "rgba(8, 12, 24, 0.9)", borderBottom: "1px solid rgba(107, 127, 168, 0.1)" }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "rgb(255, 95, 87)" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "rgb(255, 189, 46)" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "rgb(40, 200, 64)" }} />
              </div>
              <div
                className="flex-1 mx-4 px-3 py-1 rounded text-xs text-center"
                style={{ background: "rgba(17, 27, 53, 0.8)", color: "var(--steel)", border: "1px solid rgba(107, 127, 168, 0.1)" }}
              >
                intranet.votre-pme.fr/deplacements
              </div>
            </div>

            {/* Dashboard */}
            <div className="p-6 md:p-8" style={{ background: "rgba(17, 27, 53, 0.95)" }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-semibold" style={{ color: "var(--amber)" }}>
                    Fly<span style={{ color: "var(--cream)" }}>Smart</span>
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(232, 163, 48, 0.1)", color: "var(--amber)", border: "1px solid rgba(232, 163, 48, 0.2)" }}
                  >
                    Votre outil
                  </span>
                </div>
                <div className="hidden sm:flex gap-1 p-0.5 rounded-lg" style={{ background: "rgba(8, 12, 24, 0.5)" }}>
                  {WIDGET_ROUTES.map((route, idx) => (
                    <button
                      key={route.label}
                      type="button"
                      onClick={() => setWidgetRoute(idx)}
                      className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                      style={idx === widgetRoute
                        ? { background: "rgba(232, 163, 48, 0.18)", color: "var(--amber)", border: "1px solid rgba(232, 163, 48, 0.3)" }
                        : { background: "transparent", color: "var(--steel)", border: "1px solid transparent" }}
                    >
                      {route.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conseil */}
              <div
                className="rounded-xl px-5 py-4 mb-6 flex items-center gap-4"
                style={{ background: "rgba(232, 163, 48, 0.1)", border: "1px solid rgba(232, 163, 48, 0.25)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(232, 163, 48, 0.15)", border: "1px solid rgba(232, 163, 48, 0.3)" }}
                >
                  <span className="text-lg">💡</span>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--amber)" }}>Conseil FlySmart — {wr.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--cream)" }}>
                    {wr.conseil} — économie potentielle de{" "}
                    <strong style={{ color: "var(--amber)" }}>{wr.economy}</strong> vs dernière minute
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="mb-4">
                <div
                  className="rounded-[26px] p-4 md:p-6"
                  style={{
                    background: "linear-gradient(rgba(6, 10, 21, 0.95) 0%, rgba(10, 18, 34, 0.9) 100%)",
                    border: "1px solid rgba(107, 127, 168, 0.16)",
                    boxShadow: "rgba(255, 255, 255, 0.04) 0px 1px 0px inset, rgba(0, 0, 0, 0.2) 0px 20px 40px",
                  }}
                >
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--steel-light)" }}>Démonstration pédagogique</p>
                      <h3 className="mt-2 text-lg font-semibold" style={{ color: "var(--cream)" }}>{wr.title}</h3>
                      <p className="mt-1 text-sm" style={{ color: "var(--steel)" }}>12 semaines avant départ à gauche, dernière minute à droite.</p>
                    </div>
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
                      style={{ background: "rgba(74, 222, 128, 0.12)", border: "1px solid rgba(74, 222, 128, 0.28)", color: "rgb(134, 239, 172)" }}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgb(74, 222, 128)", boxShadow: "rgba(74, 222, 128, 0.14) 0px 0px 0px 4px" }}></span>
                      Zone optimale d&apos;achat
                    </div>
                  </div>

                  <svg viewBox="0 0 640 280" className="h-auto w-full" role="img" aria-label={`Courbe d'évolution du prix pour ${wr.title}`}>
                    <defs>
                      <linearGradient id="landing-curve-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(232,163,48,0.35)" />
                        <stop offset="100%" stopColor="rgba(232,163,48,0.02)" />
                      </linearGradient>
                      <linearGradient id="landing-zone-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(74,222,128,0.16)" />
                        <stop offset="100%" stopColor="rgba(74,222,128,0.03)" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {wr.grid.map(({ y, label }) => (
                      <g key={label}>
                        <line x1="62" x2="622" y1={y} y2={y} stroke="rgba(107,127,168,0.14)" strokeDasharray="4 6" />
                        <text x="50" y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="rgba(186, 199, 226, 0.74)">{label}</text>
                      </g>
                    ))}
                    {/* Zone verte */}
                    <rect x={wZoneX} y="18" width={wZoneW} height="208" rx="18" fill="url(#landing-zone-fill)" stroke="rgba(74,222,128,0.24)" />
                    <text x={wZoneCX} y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#86EFAC">Fenêtre idéale</text>
                    {/* Courbe fill */}
                    <path d={wFill} fill="url(#landing-curve-fill)" />
                    {/* Courbe stroke */}
                    <path d={wStroke} fill="none" stroke="#E8A330" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Points */}
                    {wr.points.map(([cx, cy], idx) => {
                      const special = idx === wr.optimalIdx ? "optimal" : (idx >= wr.zoneStartIdx && idx <= wr.zoneEndIdx) ? "green" : false;
                      return (
                        <g key={W_LABELS[idx]}>
                          {special === "optimal" ? (
                            <>
                              <circle cx={cx} cy={cy} r="10" fill="none" stroke="rgba(232,163,48,0.35)" strokeWidth="2" />
                              <circle cx={cx} cy={cy} r="6" fill="#E8A330" stroke="#080C18" strokeWidth="2" />
                            </>
                          ) : (
                            <circle cx={cx} cy={cy} r={special === "green" ? 5 : 3.5}
                              fill={special === "green" ? "#4ADE80" : "rgba(186, 199, 226, 0.72)"}
                              stroke={special === "green" ? "#061015" : "rgba(8,12,24,0.55)"}
                              strokeWidth={1.5}
                            />
                          )}
                          <text x={cx} y="250" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgba(242, 237, 228, 0.86)">{W_LABELS[idx]}</text>
                        </g>
                      );
                    })}
                    {/* Label optimal */}
                    <line x1={wOptX} x2={wOptX} y1={wOptY - 32} y2={wOptY - 12} stroke="rgba(232,163,48,0.55)" strokeDasharray="3 4" />
                    <rect x={wOptX - 68} y={wOptY - 62} width="136" height="30" rx="15" fill="rgba(232,163,48,0.14)" stroke="rgba(232,163,48,0.28)" />
                    <text x={wOptX} y={wOptY - 43} textAnchor="middle" fontSize="11" fontWeight="700" fill="#F6C978">Point optimal</text>
                  </svg>

                  <div className="mt-4 grid gap-2 text-xs md:grid-cols-3">
                    {wr.legend.map((l, i) => (
                      <div key={i} className="rounded-xl px-3 py-2" style={{ background: l.bg, color: l.color }}>{l.text}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {wr.stats.map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(8, 12, 24, 0.5)", border: "1px solid rgba(107, 127, 168, 0.1)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--steel)" }}>{label}</p>
                    <p className="font-semibold text-lg" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="text-center mt-8">
            <p className="text-sm mb-4" style={{ color: "var(--steel-light)" }}>
              Cet outil est entièrement personnalisable à vos couleurs et logo
            </p>
            <a
              href="#contact-demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, rgb(232, 163, 48) 0%, rgb(196, 132, 42) 100%)", color: "rgb(8, 12, 24)" }}
            >
              Ajouter cet outil à mon site →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

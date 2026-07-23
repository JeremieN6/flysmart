"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Reveal from "@/app/components/Reveal";
import { Stars, ArcSVG, RadialGlow } from "@/app/components/Background";
import AirportAutocomplete from "@/app/components/AirportAutocomplete";
import { useRouter } from "next/navigation";

const INITIAL_DEMO_FORM = {
  nom: "",
  email: "",
  entreprise: "",
  structureType: "",
  site: "",
  message: "",
};

/* ─── données statiques ─────────────────────────────────────────── */
const ICP_PROBLEMS = [
  {
    title: "Je ne sais jamais si le prix va monter ou descendre ... et je perds un temps fou à comparer",
    response:
      "FlySmart vous donne une recommandation claire : acheter maintenant ou attendre, avec une fenêtre de timing lisible.",
  },
  {
    title: "Le temps que le budget soit validé, le prix a déjà changé",
    response:
      "FlySmart affiche une deadline d'action et vous aide à décider avant que la fenêtre idéale se referme.",
  },
  {
    title: "Je ne suis pas specialiste du voyage, donc je fais au mieux",
    response:
      "FlySmart traduit les données prix en décisions simples, pour éviter de vous tromper même sans expertise voyage.",
  },
];

const LANDING_PRICING = [
  {
    name: "Starter",
    price: "99€",
    period: "/mois",
    subtitle:
      "Pour les équipes qui organisent des déplacements ponctuels (jusqu'à environ 10 recherches ou réservations par mois)",
    features: [
      "Recommandation d'achat en temps reel",
      "Alertes prix par email",
      "Historique des économies estimées réalisées",
    ],
    cta: "Choisir Starter",
    highlight: false,
  },
  {
    name: "Pro",
    price: "199€",
    period: "/mois",
    subtitle:
      "Pour les entreprises avec des déplacements récurrents (séminaires, tournées commerciales, salons)",
    features: [
      "Tout Starter",
      "Partage de recommandation pour validation manager",
      "Multi-utilisateurs",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    period: "",
    subtitle: "Pour les volumes importants et organisations multi-sites",
    features: ["Contact commercial dédié", "Intégration API"],
    cta: "Parler à l'équipe",
    highlight: false,
  },
];

const STEPS = [
  {
    n: "01",
    icon: "🔧",
    title: "Connectez votre recherche de vols",
    desc: "Lancez une analyse en quelques clics sur vos trajets pros et obtenez une recommandation de timing exploitable tout de suite.",
  },
  {
    n: "02",
    icon: "⚡",
    title: "Partagez la recommandation pour validation",
    desc: "Envoyez en un clic le conseil FlySmart à votre manager avec une date limite claire avant variation probable du prix.",
  },
  {
    n: "03",
    icon: "💰",
    title: "Achetez au bon moment sans stress",
    desc: "Votre équipe réserve avec plus de certitude et suit les économies estimées sur un historique centralisé.",
  },
];

const STATS = [
  { value: "-47%", label: "économies de vol", icon: "✈️" },
  { value: "7 ans", label: "de données historiques", icon: "📊" },
  { value: "24/7", label: "disponibilité", icon: "🛡️" },
  { value: "500+", label: "routes analysées", icon: "🌍" },
];

const TESTIMONIAL_STATS = [
  { value: "95%", label: "des PME sans TMC" },
  { value: "4.8/5", label: "note moyenne" },
  { value: "-38%", label: "économies estimées" },
];

const TESTIMONIALS = [
  {
    name: "Claire M.",
    role: "Office manager - PME industrielle",
    avatar: "SK",
    text: "On a déjà vu un billet prendre 300EUR en deux jours. Depuis qu'on a l'alerte timing, on réserve avec beaucoup moins de stress.",
    stars: 5,
  },
  {
    name: "Nicolas T.",
    role: "Coordinateur logistique - PME commerciale",
    avatar: "TR",
    text: "Le vrai gain, c'est la certitude. J'envoie la recommandation au manager, il valide vite et on évite les hausses de dernière minute.",
    stars: 5,
  },
  {
    name: "Sophie R.",
    role: "Assistante de direction - PME multisites",
    avatar: "LD",
    text: "Je ne suis pas experte voyage. FlySmart me dit simplement quand acheter, et l'historique des économies estimées rassure la direction.",
    stars: 5,
  },
];

const FAQ = [
  {
    q: "Comment FlySmart génère sa recommandation d'achat ?",
    a: "FlySmart combine les tendances historiques de prix, les signaux de marché disponibles et votre route pour indiquer une fenêtre d'achat recommandée. L'objectif est de vous aider à décider plus vite, même sans expertise voyage.",
  },
  {
    q: "FlySmart vend-il les billets d'avion ?",
    a: "Non. FlySmart est un outil d'aide à la décision : nous vous aidons à choisir le bon timing d'achat, puis vous finalisez la réservation dans vos canaux habituels.",
  },
  {
    q: "Comment FlySmart calcule les économies affichées ?",
    a: "Nous comparons le prix dans la fenêtre recommandée avec un scénario d'achat plus tardif sur le même trajet. Les montants affichés sont des économies estimées, utiles pour piloter les décisions mais non contractuelles.",
  },
  {
    q: "Que contient le plan Pro par rapport au Starter ?",
    a: "Le plan Pro inclut tout Starter, avec en plus le partage de recommandation pour validation manager, le mode multi-utilisateurs et un support prioritaire.",
  },
  {
    q: "Puis-je tester FlySmart avant abonnement ?",
    a: "Oui. Vous pouvez lancer une première analyse sur la page d'analyse, puis demander une démo guidée sur vos trajets récents pour valider l'usage avec votre équipe.",
  },
];

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
    label: "Paris \u2192 New York", title: "Paris \u2192 New York",
    conseil: "R\u00e9servez 5 \u00e0 7 semaines avant le d\u00e9part", economy: "52%",
    grid: [{ y: 18, label: "1\u202f020\u00a0\u20ac" }, { y: 122, label: "740\u00a0\u20ac" }, { y: 226, label: "460\u00a0\u20ac" }],
    points: [[62,92],[112.91,102],[163.82,115],[214.73,129],[265.64,142],[316.55,152],[367.45,178],[418.36,219],[469.27,191],[520.18,150],[571.09,100],[622,24]],
    optimalIdx: 7, zoneStartIdx: 6, zoneEndIdx: 8,
    stats: [
      { label: "Prix optimal", value: "480\u20ac", color: "var(--amber)" },
      { label: "Prix \u00e0 S\u221212", value: "820\u20ac", color: "var(--cream)" },
      { label: "\u00c9conomie vs S\u22121", value: "\u201352%", color: "rgb(74, 222, 128)" },
    ],
    legend: [
      { text: "S-12 \u00e0 S-9\u00a0: prix premium, anticipation n\u00e9cessaire.", bg: "rgba(239, 68, 68, 0.08)", color: "rgb(252, 165, 165)" },
      { text: "S-6 \u00e0 S-4\u00a0: fen\u00eatre id\u00e9ale pour Paris \u2192 New York.", bg: "rgba(74, 222, 128, 0.08)", color: "rgb(134, 239, 172)" },
      { text: "S-2 \u00e0 S-1\u00a0: la hausse peut doubler le tarif.", bg: "rgba(232, 163, 48, 0.08)", color: "rgb(246, 201, 120)" },
    ],
  },
  {
    label: "Lyon \u2192 Barcelone", title: "Lyon \u2192 Barcelone",
    conseil: "R\u00e9servez 8 \u00e0 10 semaines avant le d\u00e9part", economy: "77%",
    grid: [{ y: 18, label: "265\u00a0\u20ac" }, { y: 122, label: "155\u00a0\u20ac" }, { y: 226, label: "45\u00a0\u20ac" }],
    points: [[62,119],[112.91,136],[163.82,150],[214.73,180],[265.64,216],[316.55,209],[367.45,200],[418.36,189],[469.27,179],[520.18,152],[571.09,110],[622,34]],
    optimalIdx: 4, zoneStartIdx: 3, zoneEndIdx: 5,
    stats: [
      { label: "Prix optimal", value: "56\u20ac", color: "var(--amber)" },
      { label: "Prix \u00e0 S\u221212", value: "158\u20ac", color: "var(--cream)" },
      { label: "\u00c9conomie vs S\u22121", value: "\u201377%", color: "rgb(74, 222, 128)" },
    ],
    legend: [
      { text: "S-12 \u00e0 S-10\u00a0: tarifs encore \u00e9lev\u00e9s pour une low-cost.", bg: "rgba(239, 68, 68, 0.08)", color: "rgb(252, 165, 165)" },
      { text: "S-9 \u00e0 S-7\u00a0: la zone la plus \u00e9conomique pour cette route.", bg: "rgba(74, 222, 128, 0.08)", color: "rgb(134, 239, 172)" },
      { text: "S-2 \u00e0 S-1\u00a0: derni\u00e8re minute, les prix explosent.", bg: "rgba(232, 163, 48, 0.08)", color: "rgb(246, 201, 120)" },
    ],
  },
  {
    label: "Paris \u2192 Tokyo", title: "Paris \u2192 Tokyo",
    conseil: "R\u00e9servez 4 \u00e0 6 semaines avant le d\u00e9part", economy: "35%",
    grid: [{ y: 18, label: "1\u202f010\u00a0\u20ac" }, { y: 119.69, label: "790\u00a0\u20ac" }, { y: 226, label: "560\u00a0\u20ac" }],
    points: [[62,91.96],[112.91,105.82],[163.82,122],[214.73,138.18],[265.64,156.67],[316.55,175.16],[367.45,189.02],[418.36,198.27],[469.27,191.33],[520.18,156.67],[571.09,105.82],[622,45.73]],
    optimalIdx: 7, zoneStartIdx: 6, zoneEndIdx: 8,
    stats: [
      { label: "Prix optimal", value: "620\u20ac", color: "var(--amber)" },
      { label: "Prix \u00e0 S\u221212", value: "850\u20ac", color: "var(--cream)" },
      { label: "\u00c9conomie vs S\u22121", value: "\u201335%", color: "rgb(74, 222, 128)" },
    ],
    legend: [
      { text: "S-12 \u00e0 S-9\u00a0: le billet est encore premium.", bg: "rgba(239, 68, 68, 0.08)", color: "rgb(252, 165, 165)" },
      { text: "S-6 \u00e0 S-4\u00a0: la zone d'achat devient la plus int\u00e9ressante.", bg: "rgba(74, 222, 128, 0.08)", color: "rgb(134, 239, 172)" },
      { text: "S-2 \u00e0 S-1\u00a0: la remont\u00e9e s'acc\u00e9l\u00e8re fortement.", bg: "rgba(232, 163, 48, 0.08)", color: "rgb(246, 201, 120)" },
    ],
  },
];

/* ─── composant principal ───────────────────────────────────────── */
export default function LandingClient() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState(
    String(new Date().getMonth() + 2).padStart(2, "0"),
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoForm, setDemoForm] = useState(INITIAL_DEMO_FORM);
  const [demoStatus, setDemoStatus] = useState<"idle" | "submitting">("idle");
  const [demoToast, setDemoToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [widgetRoute, setWidgetRoute] = useState(2);
  const [searchMode, setSearchMode] = useState<"flexible" | "precise">("flexible");
  const [dateDepart, setDateDepart] = useState("");
  const [dateRetour, setDateRetour] = useState("");

  const wr = WIDGET_ROUTES[widgetRoute];
  const wOptX = wr.points[wr.optimalIdx][0];
  const wOptY = wr.points[wr.optimalIdx][1];
  const wZoneX = wr.points[wr.zoneStartIdx][0];
  const wZoneW = wr.points[wr.zoneEndIdx][0] - wZoneX;
  const wZoneCX = wZoneX + wZoneW / 2;
  const wStroke = smoothPath(wr.points);
  const wFill = wStroke + ` L ${wr.points[wr.points.length - 1][0]} 226 L ${wr.points[0][0]} 226 Z`;

  const year =
    new Date().getMonth() + 2 > 12
      ? new Date().getFullYear() + 1
      : new Date().getFullYear();

  function extractIata(display: string): string {
    const m = display.match(/^([A-Z]{3})\s*[\u2014-]/);
    return m ? m[1] : display.slice(0, 3).toUpperCase();
  }

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!origin || !destination) return;
    const from = extractIata(origin);
    const to = extractIata(destination);
    if (searchMode === "precise") {
      router.push(`/analyse?from=${from}&to=${to}&departDate=${dateDepart}&returnDate=${dateRetour}`);
    } else {
      router.push(`/analyse?from=${from}&to=${to}&month=${month}`);
    }
  }

  function updateDemoForm(field: keyof typeof INITIAL_DEMO_FORM, value: string) {
    setDemoForm((current) => ({ ...current, [field]: value }));
  }

  async function handleDemoSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (demoStatus === "submitting") {
      return;
    }

    setDemoStatus("submitting");
    setDemoToast(null);

    try {
      const response = await fetch("/api/demo-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(demoForm),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "La demande n'a pas pu etre envoyee.");
      }

      setDemoForm(INITIAL_DEMO_FORM);
      setDemoToast({
        type: "success",
        message: "Demande envoyee. Un expert FlySmart vous contacte sous 24h.",
      });

      window.setTimeout(() => {
        setDemoToast((current) => (current?.type === "success" ? null : current));
      }, 4500);
    } catch (error) {
      setDemoToast({
        type: "error",
        message: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi.",
      });
    } finally {
      setDemoStatus("idle");
    }
  }

  return (
    <>
      <Header />

      {demoToast ? (
        <div className="fixed right-4 top-4 z-120 w-[calc(100%-2rem)] max-w-sm">
          <div
            role={demoToast.type === "error" ? "alert" : "status"}
            className="rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur"
            style={{
              background: demoToast.type === "error" ? "rgba(239, 68, 68, 0.12)" : "rgba(74, 222, 128, 0.12)",
              borderColor: demoToast.type === "error" ? "rgba(239, 68, 68, 0.35)" : "rgba(74, 222, 128, 0.35)",
              color: "var(--cream)",
            }}
          >
            <div className="flex items-start gap-3">
              <p className="flex-1 text-sm leading-6">{demoToast.message}</p>
              <button
                type="button"
                aria-label="Fermer la notification"
                onClick={() => setDemoToast(null)}
                className="text-sm font-semibold opacity-80 transition-opacity hover:opacity-100"
                style={{ color: "var(--steel-light)" }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <main style={{ background: "var(--midnight)" }}>
        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
          <Stars />
          <ArcSVG />
          <RadialGlow />

          <div className="relative z-10 text-center px-6 py-32">
            <div className="fade-up delay-100 inline-flex items-center gap-2 mb-8">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
                style={{
                  background: "rgba(232, 163, 48, 0.1)",
                  border: "1px solid rgba(232, 163, 48, 0.25)",
                  color: "var(--amber-light)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "var(--amber)" }}
                ></span>
                Pour les coordinateurs de déplacements pro en PME
              </span>
            </div>
            <h1
              className="fade-up delay-100 text-5xl md:text-7xl font-semibold leading-tight mb-6 max-w-4xl mx-auto"
              style={{
                color: "var(--cream)",
                fontFamily: "var(--font-display)",
              }}
            >
              Sachez enfin si c&apos;est le bon moment d&apos;acheter,
              <span style={{ color: "var(--amber)" }}> sans être expert du voyage</span>
            </h1>
            <p
              className="fade-up delay-200 text-xl max-w-2xl mx-auto mb-12"
              style={{ color: "var(--steel-light)", lineHeight: "1.7" }}
            >
              Comme 95% des PME, vous gérez vos voyages sans agence dédiée.
              FlySmart vous dit quand acheter pour limiter l&apos;incertitude et
              agir avant que le prix ne bouge.
            </p>

            <div className="fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="#contact-demo"
                className="px-8 py-4 rounded-xl font-semibold text-base"
                style={{ background: "var(--amber)", color: "var(--midnight)" }}
              >
                Demander une démo gratuite →
              </a>
              <Link
                href="/analyse"
                className="px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-2 justify-center"
                style={{
                  background: "transparent",
                  color: "var(--cream)",
                  border: "1px solid rgba(186,199,226,0.25)",
                }}
              >
                Auditer mon dernier déplacement ↗
              </Link>
            </div>

            <div
              className="fade-up delay-600 flex flex-wrap items-center justify-center gap-6 mt-10"
              style={{ color: "var(--steel)" }}
            >
              <span className="flex items-center gap-2 text-sm">
                <span style={{ color: "var(--amber)" }}>✓</span> Outil prêt en 2
                minutes
              </span>
              <span
                className="w-px h-4 hidden sm:block"
                style={{ background: "rgba(107, 127, 168, 0.2)" }}
              ></span>
              <span className="flex items-center gap-2 text-sm">
                <span style={{ color: "var(--amber)" }}>✓</span> Recommandation
                claire: acheter ou attendre
              </span>
              <span
                className="w-px h-4 hidden sm:block"
                style={{ background: "rgba(107, 127, 168, 0.2)" }}
              ></span>
              <span className="flex items-center gap-2 text-sm">
                <span style={{ color: "var(--amber)" }}>✓</span> Partage en un
                clic pour validation manager
              </span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            ICP + PROBLEMES + PRICING
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6" id="problemes">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p
                className="text-xs font-medium tracking-widest uppercase text-center mb-3"
                style={{ color: "var(--amber)" }}
              >
                À qui s'adresse FlySmart ?
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-16"
                style={{
                  color: "var(--cream)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Conçu pour le coordinateur de déplacements pro
                <span style={{ color: "var(--amber)" }}> en PME</span>
              </h2>
            </Reveal>

            <div className="flex flex-col lg:flex-col gap-6 mb-10">
              <Reveal delay={80}>
                <div
                  className="rounded-2xl p-7"
                  style={{ background: "var(--navy-mid)", border: "1px solid rgba(232, 163, 48, 0.2)" }}
                >
                  <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "var(--amber)" }}>
                    Qui vous êtes
                  </p>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}>
                    Office manager ou coordinateur logistique dans une PME de 50 à 400 salariés
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--steel-light)" }}>
                    Vous gérez les déplacements à la main entre comparateurs et sites compagnies. FlySmart vous aide à décider rapidement sans expertise technique.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div
                  className="rounded-2xl p-7"
                  style={{ background: "rgba(17, 27, 53, 0.7)", border: "1px solid rgba(107, 127, 168, 0.2)" }}
                >
                  <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "var(--steel)" }}>
                    Preuve terrain
                  </p>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-display)" }}>
                    95% des PME n&apos;ont pas de TMC
                  </p>
                  <p className="text-sm mt-3" style={{ color: "var(--steel-light)" }}>
                    FlySmart est pensé pour ces équipes qui doivent réserver efficacement, avec validation interne et contraintes budgétaires.
                  </p>
                </div>
              </Reveal>
            </div>

            <div>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-16"
                style={{
                  color: "var(--cream)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Vous êtes-vous déjà retrouvé dans ces situations
                <span style={{ color: "var(--amber)" }}> pénibles ?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ICP_PROBLEMS.map((item, i) => (
                <Reveal key={item.title} delay={i * 100}>
                  <div className="rounded-2xl p-6 h-full" style={{ background: "var(--navy-mid)", border: "1px solid rgba(186,199,226,0.12)" }}>
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--cream)" }}>
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--steel-light)" }}>
                      {item.response}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={260}>
              <div className="mt-10 rounded-2xl p-7" style={{ background: "rgba(232, 163, 48, 0.08)", border: "1px solid rgba(232, 163, 48, 0.28)" }}>
                <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "var(--amber)" }}>
                  Fonctionnalité clé
                </p>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}>
                  Partage pour validation manager en un clic
                </h3>
                <p className="text-sm" style={{ color: "var(--steel-light)", lineHeight: "1.7" }}>
                  Partagez la recommandation d&apos;achat avec votre manager, accompagnée d&apos;une deadline claire avant variation probable du prix.
                </p>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-16" id="pricing">
                <p className="text-xs font-medium tracking-widest uppercase text-center mb-3" style={{ color: "var(--amber)" }}>
                  Tarifs
                </p>
                <h3 className="text-3xl md:text-4xl font-semibold text-center mb-10" style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}>
                  Une grille simple pour les déplacements pro en PME
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {LANDING_PRICING.map((plan, i) => (
                    <div
                      key={plan.name}
                      className="rounded-2xl p-7 flex flex-col"
                      style={plan.highlight
                        ? { background: "rgba(26, 40, 71, 0.88)", border: "1px solid rgba(232, 163, 48, 0.35)", boxShadow: "rgba(232, 163, 48, 0.08) 0px 0px 60px" }
                        : { background: "var(--navy-mid)", border: "1px solid rgba(186,199,226,0.12)" }}
                    >
                      {plan.highlight ? (
                        <span className="mb-4 inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(232, 163, 48, 0.2)", color: "var(--amber)" }}>
                          Le plus choisi
                        </span>
                      ) : null}
                      <h4 className="text-xl font-semibold" style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}>
                        {plan.name}
                      </h4>
                      <p className="mt-3 text-3xl font-bold" style={{ color: "var(--amber)" }}>
                        {plan.price}
                        <span className="text-sm font-medium ml-1" style={{ color: "var(--steel)" }}>{plan.period}</span>
                      </p>
                      <p className="text-sm mt-4 mb-6" style={{ color: "var(--steel-light)" }}>{plan.subtitle}</p>
                      <ul className="space-y-2 mb-6 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: "var(--steel-light)" }}>
                            <span style={{ color: "var(--green-ok)", flexShrink: 0 }}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#contact-demo"
                        className="w-full py-3 rounded-xl text-sm font-semibold text-center block"
                        style={i === 1
                          ? { background: "linear-gradient(135deg, rgb(232, 163, 48) 0%, rgb(196, 132, 42) 100%)", color: "rgb(8, 12, 24)" }
                          : { border: "1px solid rgba(232, 163, 48, 0.35)", color: "var(--amber)", background: "rgba(232, 163, 48, 0.08)" }}
                      >
                        {plan.cta} →
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center mt-6" style={{ color: "var(--steel)" }}>
                  Les économies affichées dans le dashboard sont des estimations indicatives et ne constituent pas une base de facturation.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION TRANSITION
        ══════════════════════════════════════════ */}

        {/* ══════════════════════════════════════════
            STEPPER — En 3 étapes
        ══════════════════════════════════════════ */}
        <section
          className="py-24 px-6"
          style={{ background: "var(--navy-deep)" }}
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p
                className="text-xs font-medium tracking-widest uppercase text-center mb-3"
                style={{ color: "var(--steel)" }}
              >
                En 3 étapes · Simple · Efficace
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-16"
                style={{
                  color: "var(--cream)",
                  fontFamily: "var(--font-display)",
                }}
              >
                En 3 etapes, votre équipe{" "}
                <span style={{ color: "var(--amber)" }}>décide mieux</span>
              </h2>
            </Reveal>

            <div className="relative mb-14">
              <div
                className="hidden md:block absolute top-14 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent 10%, rgba(232, 163, 48, 0.15) 30%, rgba(232, 163, 48, 0.15) 70%, transparent 90%)" }}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                {STEPS.map((step, i) => (
                  <Reveal key={step.n} delay={i * 150}>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div
                          className="w-28 h-28 rounded-full flex items-center justify-center"
                          style={{
                            background: "rgba(17, 27, 53, 0.8)",
                            border: "1px solid rgba(232, 163, 48, 0.2)",
                            boxShadow: "rgba(232, 163, 48, 0.05) 0px 0px 40px",
                          }}
                        >
                          <div style={{ color: "var(--amber)" }}>
                            {i === 0 && (
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                            )}
                            {i === 1 && (
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                              </svg>
                            )}
                            {i === 2 && (
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span
                          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: "var(--amber)", color: "rgb(8, 12, 24)" }}
                        >
                          {i + 1}
                        </span>
                      </div>
                      <h3 className="font-semibold text-base mb-3" style={{ color: "var(--cream)" }}>
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--steel-light)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Code snippet */}
            <Reveal delay={400}>
              <div className="text-center mt-14">
                <div
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl"
                  style={{ background: "rgba(17, 27, 53, 0.7)", border: "1px solid rgba(107, 127, 168, 0.15)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--amber)" }}>
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  <code className="text-sm font-mono" style={{ color: "var(--amber)" }}>
                    {`<script src="https://widget.flysmart.app/v1.js?key=YOUR_KEY" defer></script>`}
                  </code>
                </div>
                <p className="text-xs mt-3" style={{ color: "var(--steel)" }}>Une seule ligne. Compatible avec tous les CMS.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            WIDGET PREVIEW — Ce que voit votre equipe
        ══════════════════════════════════════════ */}
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

        {/* ══════════════════════════════════════════
            FORMULAIRE DÉMO
        ══════════════════════════════════════════ */}
        <section
          id="contact-demo"
          className="py-24 px-6"
          style={{ background: "var(--navy-deep)" }}
        >
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <p
                className="text-xs font-medium tracking-widest uppercase text-center mb-3"
                style={{ color: "var(--amber)" }}
              >
                Démarrez maintenant • Pour les professionnels
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center"
                style={{
                  color: "var(--cream)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Demander une {" "}
                <span style={{ color: "var(--amber)" }}>démo gratuite</span>
              </h2>
              <p className="text-center mb-10 mt-4" style={{ color: "var(--steel-light)" }}>
                Réponse sous 24h. Sans engagement. Par un de nos expert FlySmart.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <form
                onSubmit={handleDemoSubmit}
                className="rounded-2xl p-8 space-y-4"
                style={{ background: "var(--navy-mid)", border: "1px solid rgba(186,199,226,0.1)" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Jean Dupont"
                      value={demoForm.nom}
                      onChange={(e) => updateDemoForm("nom", e.target.value)}
                      className="rounded-xl px-4 py-3 text-sm"
                      style={{ background: "var(--navy-deep)", color: "var(--cream)", border: "1px solid rgba(186,199,226,0.18)", outline: "none" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="jean@exemple.com"
                      value={demoForm.email}
                      onChange={(e) => updateDemoForm("email", e.target.value)}
                      className="rounded-xl px-4 py-3 text-sm"
                      style={{ background: "var(--navy-deep)", color: "var(--cream)", border: "1px solid rgba(186,199,226,0.18)", outline: "none" }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Entreprise / Structure *</label>
                    <input
                      required
                      type="text"
                      placeholder="Nom de votre PME"
                      value={demoForm.entreprise}
                      onChange={(e) => updateDemoForm("entreprise", e.target.value)}
                      className="w-full rounded-xl px-4 py-3.5 text-sm"
                      style={{ background: "rgba(8, 12, 24, 0.6)", border: "1px solid rgba(107, 127, 168, 0.15)", color: "var(--cream)", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Type de structure *</label>
                    <select
                      required
                      value={demoForm.structureType}
                      onChange={(e) => updateDemoForm("structureType", e.target.value)}
                      className="w-full rounded-xl px-4 py-3.5 text-sm appearance-none cursor-pointer"
                      style={{ background: "rgba(8, 12, 24, 0.6)", border: "1px solid rgba(107, 127, 168, 0.15)", color: demoForm.structureType ? "var(--cream)" : "var(--steel)", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                    >
                      <option value="" style={{ background: "rgb(13, 20, 38)" }}>Choisir...</option>
                      <option value="office-manager" style={{ background: "rgb(13, 20, 38)" }}>Office manager</option>
                      <option value="coord-logistique" style={{ background: "rgb(13, 20, 38)" }}>Coordinateur logistique</option>
                      <option value="assistante-direction" style={{ background: "rgb(13, 20, 38)" }}>Assistante de direction</option>
                      <option value="autre" style={{ background: "rgb(13, 20, 38)" }}>Autre</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Site web</label>
                  <input
                    type="url"
                    placeholder="https://monsite.com"
                    value={demoForm.site}
                    onChange={(e) => updateDemoForm("site", e.target.value)}
                    className="rounded-xl px-4 py-3 text-sm"
                    style={{ background: "var(--navy-deep)", color: "var(--cream)", border: "1px solid rgba(186,199,226,0.18)", outline: "none" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Message</label>
                  <textarea
                    rows={4}
                    placeholder="Exemple: nous avons 6 a 12 deplacements pro par mois et un delai de validation manager de 24 a 48h."
                    value={demoForm.message}
                    onChange={(e) => updateDemoForm("message", e.target.value)}
                    className="rounded-xl px-4 py-3 text-sm resize-none"
                    style={{ background: "var(--navy-deep)", color: "var(--cream)", border: "1px solid rgba(186,199,226,0.18)", outline: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={demoStatus === "submitting"}
                  className="w-full py-3 rounded-xl font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ background: "var(--amber)", color: "var(--midnight)" }}
                >
                  {demoStatus === "submitting" ? "Envoi en cours..." : "Demander ma démo gratuite →"}
                </button>
                <p className="text-center text-xs mt-4" style={{ color: "var(--steel)" }}>Ou intégrez directement — <a href="/tarifs" style={{ color: "var(--amber)" }}>voir les plans</a></p>
              </form>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TÉMOIGNAGES
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p
                className="text-xs font-medium tracking-widest uppercase text-center mb-3"
                style={{ color: "var(--steel)" }}
              >
                Ce que disent les equipes terrain
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-12"
                style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
              >
                Moins de stress, <span style={{ color: "var(--amber)" }}>plus de certitude</span>
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
                {TESTIMONIAL_STATS.map((s) => (
                  <div
                    key={s.value}
                    className="text-center rounded-2xl py-7"
                    style={{ background: "rgba(17, 27, 53, 0.6)", border: "1px solid rgba(232, 163, 48, 0.15)" }}
                  >
                    <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: "var(--amber)" }}>{s.value}</p>
                    <p className="text-sm" style={{ color: "var(--steel-light)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 120}>
                  <div
                    className="rounded-2xl p-6"
                    style={{ background: "var(--navy-mid)", border: "1px solid rgba(186,199,226,0.1)" }}
                  >
                    <div className="flex mb-4">
                      {"★".repeat(t.stars).split("").map((s: string, j: number) => (
                        <span key={j} style={{ color: "var(--amber)" }}>{s}</span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--cream)", fontStyle: "italic" }}>"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                        style={{ background: "rgba(232,163,48,0.2)", color: "var(--amber)" }}
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "var(--cream)" }}>{t.name}</p>
                        <p className="text-xs" style={{ color: "var(--steel)" }}>{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6" style={{ background: "var(--navy-deep)" }} id="faq">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="text-xs text-center font-medium uppercase tracking-widest mb-4" style={{ color: "var(--amber)" }}>Vous avez des questions ?</p>
              <h2
                className="text-3xl md:text-4xl font-semibold text-center mb-16"
                style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
              >
                Questions <span style={{ color: "var(--amber)" }}>fréquentes</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(186,199,226,0.12)" }}>
                    <button
                      className="w-full text-left px-6 py-4 flex items-center justify-between"
                      style={{
                        background: openFaq === i ? "var(--navy-mid)" : "rgba(17,27,53,0.6)",
                        color: "var(--cream)",
                      }}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-medium">{item.q}</span>
                      <span style={{ color: "var(--amber)", flexShrink: 0, marginLeft: "16px" }}>
                        {openFaq === i ? "−" : "+"}
                      </span>
                    </button>
                    {openFaq === i && (
                      <div
                        className="px-6 py-4"
                        style={{ background: "var(--navy-mid)", borderTop: "1px solid rgba(186,199,226,0.08)" }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: "var(--steel-light)" }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={350}>
              <div className="text-center mt-12">
                <p className="text-sm mb-3" style={{ color: "var(--steel)" }}>
                  Vous n'avez pas trouvé votre réponse ?
                </p>
                <a
                  href="#contact-demo"
                  className="text-sm font-medium"
                  style={{ color: "var(--amber)" }}
                >
                  Contactez-nous →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA — Trouvez le meilleur moment
        ══════════════════════════════════════════ */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="text-center mb-10">
              <h2
                className="text-3xl md:text-4xl font-semibold text-center"
                style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
              >
                Trouvez le meilleur moment <span style={{ color: "var(--amber)" }}>pour acheter</span>
              </h2>
              <p className="text-center mb-10 mt-4" style={{ color: "var(--steel-light)" }}>
                 Testez l&apos;analyse sur n&apos;importe quelle route, sans inscription.
              </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <form className="w-full max-w-3xl mx-auto" onSubmit={handleQuickSearch}>
                <div
                  className="rounded-2xl p-6 md:p-8"
                  style={{
                    background: "rgba(17, 27, 53, 0.7)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(107, 127, 168, 0.18)",
                    boxShadow: "rgba(0, 0, 0, 0.4) 0px 24px 80px, rgba(255, 255, 255, 0.03) 0px 1px 0px inset",
                  }}
                >
                  <div className="flex items-center justify-center mb-6">
                    <div
                      className="flex rounded-xl p-1 gap-1"
                      style={{ background: "rgba(8, 12, 24, 0.5)", border: "1px solid rgba(107, 127, 168, 0.12)" }}
                    >
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        onClick={() => setSearchMode("flexible")}
                        style={searchMode === "flexible"
                          ? { background: "rgba(232, 163, 48, 0.18)", color: "var(--amber)", border: "1px solid rgba(232, 163, 48, 0.3)" }
                          : { background: "transparent", color: "var(--steel-light)", border: "1px solid transparent" }}
                      >
                        📅 Mois flexible
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        onClick={() => setSearchMode("precise")}
                        style={searchMode === "precise"
                          ? { background: "rgba(232, 163, 48, 0.18)", color: "var(--amber)", border: "1px solid rgba(232, 163, 48, 0.3)" }
                          : { background: "transparent", color: "var(--steel-light)", border: "1px solid transparent" }}
                      >
                        📍 Dates précises
                      </button>
                    </div>
                  </div>

                  {searchMode === "flexible" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                      <AirportAutocomplete
                        id="cta-origin"
                        label="Départ"
                        placeholder="Paris, CDG"
                        icon="✈"
                        value={origin}
                        onChange={(v) => setOrigin(v)}
                        required
                      />
                      <AirportAutocomplete
                        id="cta-dest"
                        label="Destination"
                        placeholder="New York, JFK"
                        icon="📍"
                        value={destination}
                        onChange={(v) => setDestination(v)}
                        required
                      />
                      <div className="flex flex-col gap-2">
                        <label
                          className="text-xs font-medium uppercase tracking-widest text-left"
                          style={{ color: "var(--steel)" }}
                        >
                          Mois de voyage
                        </label>
                        <select
                          required
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                          className="w-full rounded-xl px-4 py-3.5 text-sm appearance-none cursor-pointer"
                          style={{
                            background: "rgba(8, 12, 24, 0.6)",
                            border: "1px solid rgba(107, 127, 168, 0.15)",
                            color: "var(--steel)",
                            outline: "none",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                          }}
                        >
                          <option value="" style={{ background: "rgb(13, 20, 38)" }}>Choisir un mois</option>
                          <option value="01" style={{ background: "rgb(13, 20, 38)" }}>Janvier</option>
                          <option value="02" style={{ background: "rgb(13, 20, 38)" }}>Février</option>
                          <option value="03" style={{ background: "rgb(13, 20, 38)" }}>Mars</option>
                          <option value="04" style={{ background: "rgb(13, 20, 38)" }}>Avril</option>
                          <option value="05" style={{ background: "rgb(13, 20, 38)" }}>Mai</option>
                          <option value="06" style={{ background: "rgb(13, 20, 38)" }}>Juin</option>
                          <option value="07" style={{ background: "rgb(13, 20, 38)" }}>Juillet</option>
                          <option value="08" style={{ background: "rgb(13, 20, 38)" }}>Août</option>
                          <option value="09" style={{ background: "rgb(13, 20, 38)" }}>Septembre</option>
                          <option value="10" style={{ background: "rgb(13, 20, 38)" }}>Octobre</option>
                          <option value="11" style={{ background: "rgb(13, 20, 38)" }}>Novembre</option>
                          <option value="12" style={{ background: "rgb(13, 20, 38)" }}>Décembre</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {searchMode === "precise" && (
                    <>
                      <div
                        className="mb-5 px-4 py-3 rounded-xl flex items-start gap-3"
                        style={{ background: "rgba(232, 163, 48, 0.07)", border: "1px solid rgba(232, 163, 48, 0.2)" }}
                      >
                        <span className="text-lg shrink-0">📊</span>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--amber-light)" }}>
                          En mode dates précises, on génère un <strong>graphique de variation de prix</strong> sur toute votre période — les tarifs peuvent varier significativement d&apos;une semaine à l&apos;autre.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <AirportAutocomplete
                          id="cta-origin-precise"
                          label="Départ"
                          placeholder="Paris, CDG"
                          icon="✈"
                          value={origin}
                          onChange={(v) => setOrigin(v)}
                          required
                        />
                        <AirportAutocomplete
                          id="cta-dest-precise"
                          label="Destination"
                          placeholder="New York, JFK"
                          icon="📍"
                          value={destination}
                          onChange={(v) => setDestination(v)}
                          required
                        />
                        <div className="flex flex-col gap-2">
                          <label
                            className="text-xs font-medium uppercase tracking-widest text-left"
                            style={{ color: "var(--steel)" }}
                          >
                            Date de départ
                          </label>
                          <input
                            required
                            type="date"
                            value={dateDepart}
                            onChange={(e) => setDateDepart(e.target.value)}
                            className="w-full rounded-xl px-4 py-3.5 text-sm"
                            style={{
                              background: "rgba(8, 12, 24, 0.6)",
                              border: "1px solid rgba(107, 127, 168, 0.15)",
                              color: "var(--cream)",
                              outline: "none",
                              transition: "border-color 0.2s, box-shadow 0.2s",
                              colorScheme: "dark",
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label
                            className="text-xs font-medium uppercase tracking-widest text-left"
                            style={{ color: "var(--steel)" }}
                          >
                            Date de retour
                          </label>
                          <input
                            type="date"
                            value={dateRetour}
                            onChange={(e) => setDateRetour(e.target.value)}
                            className="w-full rounded-xl px-4 py-3.5 text-sm"
                            style={{
                              background: "rgba(8, 12, 24, 0.6)",
                              border: "1px solid rgba(107, 127, 168, 0.15)",
                              color: "var(--cream)",
                              outline: "none",
                              transition: "border-color 0.2s, box-shadow 0.2s",
                              colorScheme: "dark",
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl py-4 font-semibold text-base tracking-wide"
                    style={{
                      background: "linear-gradient(135deg, rgb(232, 163, 48) 0%, rgb(196, 132, 42) 100%)",
                      color: "rgb(8, 12, 24)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <span className="flex items-center justify-center gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.5 15.5L18 12l3.5-3.5-1.4-1.4L16.6 11H12.8L8.3 3H6l3.3 8H4.5L3 9.5 1.5 11 3 12.5 1.5 14 3 15.5l1.5-2h4.8L6 21.5h2.3l4.5-8h3.8l3.5 3.5 1.4-1.5z"></path>
                      </svg>
                      Analyser les prix
                    </span>
                  </button>
                </div>
              </form>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10">
              <p className="text-center mb-10 mt-4" style={{ color: "var(--steel-light)", fontStyle: "italic" }}>
                Routes populaires
              </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { from: "Paris", to: "New York", economy: "–34%", originDisplay: "CDG — Paris Charles de Gaulle (France)", destDisplay: "JFK — New York John F. Kennedy (USA)" },
                    { from: "Lyon", to: "Barcelone", economy: "–28%", originDisplay: "LYS — Lyon Saint-Exupéry (France)", destDisplay: "BCN — Barcelone El Prat (Espagne)" },
                    { from: "Marseille", to: "Tokyo", economy: "–41%", originDisplay: "MRS — Marseille Provence (France)", destDisplay: "NRT — Tokyo Narita (Japon)" },
                  ].map((route) => (
                    <button
                      key={route.from + route.to}
                      type="button"
                      className="w-full text-left rounded-xl px-5 py-4 transition-all duration-200"
                      style={{ background: "rgba(17, 27, 53, 0.5)", border: "1px solid rgba(107, 127, 168, 0.12)" }}
                      onClick={() => { setOrigin(route.originDisplay); setDestination(route.destDisplay); }}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: "var(--cream)" }}>
                        {route.from}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--steel)" }}>
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                        {route.to}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--amber)" }}>
                        Économie potentielle {route.economy}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BARRE DE STATS
        ══════════════════════════════════════════ */}
        <div
          style={{
            background: "var(--navy-deep)",
            borderTop: "1px solid rgba(186,199,226,0.08)",
            borderBottom: "1px solid rgba(186,199,226,0.08)",
          }}
        >
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s, i) => (
                <Reveal key={s.value} delay={i * 80}>
                  <div className="text-center">
                    <p className="text-2xl mb-2">{s.icon}</p>
                    <p
                      className="text-3xl font-bold mb-1"
                      style={{ color: "var(--amber)" }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--steel-light)" }}
                    >
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer
          className="py-10 px-6"
          style={{ borderTop: "1px solid rgba(186,199,226,0.08)" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8">
                <div>
                  <span className="font-display text-2xl font-semibold" style={{ color: "var(--amber)" }}>Fly<span style={{ color: "var(--cream)" }}>Smart</span></span><p className="text-xs mt-2 max-w-xs" style={{ color: "var(--steel)" }}>La solution pour les coordinateurs de déplacements professionnels en PME.</p></div>
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm" style={{ color: "var(--steel)" }}><a href="#problemes" className="hover:opacity-80 transition-opacity">Problemes</a><a href="#pricing" className="hover:opacity-80 transition-opacity">Tarifs</a><a className="hover:opacity-80 transition-opacity" href="/tarifs">Page tarifs</a><a href="#faq" className="hover:opacity-80 transition-opacity">FAQ</a><a href="#contact-demo" className="hover:opacity-80 transition-opacity">Demander une démo</a><a className="hover:opacity-80 transition-opacity" href="/analyse">Auditer un deplacement</a></div>
            </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs" style={{ borderTop: "1px solid rgba(107, 127, 168, 0.08)", color: "var(--steel)" }}><span>© 2026 FlySmart — La solution pour les deplacements pro en PME</span><span>Les economies affichees sont indicatives.</span></div>
          </div>
        </footer>
      </main>
    </>
  );
}

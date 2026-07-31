import Link from "next/link";
import { Stars, ArcSVG, RadialGlow } from "@/app/components/Background";

export default function LandingHero() {
  return (
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
  );
}

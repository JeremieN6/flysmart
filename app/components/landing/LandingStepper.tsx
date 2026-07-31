import Reveal from "@/app/components/Reveal";

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

export default function LandingStepper() {
  return (
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
  );
}

import Reveal from "@/app/components/Reveal";

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
    text: "On a déjà vu un billet prendre 300€ en deux jours. Depuis qu'on a l'alerte timing, on réserve avec beaucoup moins de stress.",
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

export default function LandingTestimonials() {
  return (
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
  );
}

import Reveal from "@/app/components/Reveal";

const STATS = [
  { value: "-47%", label: "économies de vol", icon: "✈️" },
  { value: "7 ans", label: "de données historiques", icon: "📊" },
  { value: "24/7", label: "disponibilité", icon: "🛡️" },
  { value: "500+", label: "routes analysées", icon: "🌍" },
];

export default function LandingStatsBar() {
  return (
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
  );
}

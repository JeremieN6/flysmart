import Reveal from "@/app/components/Reveal";

/*
  Chiffres issus de scripts/output/price-delta-2026-08-11.json (npm run validate-delta).
  Deux tuiles ont ete supprimees faute de donnee reelle :
   - "7 ans de donnees historiques" : l API FlightSky n expose aucun historique
     (toute date anterieure a aujourd hui est rejetee, pas d endpoint price-history).
   - "500+ routes analysees" : seules 8 routes ont ete verifiees, la couverture
     totale n est pas mesurable. Un chiffre de couverture serait invente.
*/
const STATS = [
  {
    value: "+17,5 %",
    label:
      "ecart moyen entre un depart a 8 semaines et un depart a 2 semaines, mesure sur 8 routes",
    icon: "✈️",
  },
  { value: "24/7", label: "disponibilité", icon: "🛡️" },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
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

        <Reveal delay={160}>
          <p
            className="text-xs text-center mt-8 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--steel)" }}
          >
            Relevé du 11/08/2026 sur 8 routes intérieures et européennes au départ de
            Paris, départs en semaine hors vacances scolaires. Il s&apos;agit d&apos;une
            comparaison entre deux dates de départ observées le même jour, non du suivi
            d&apos;un même vol dans le temps. L&apos;écart varie fortement selon la route :
            de −27 % à +47 %.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

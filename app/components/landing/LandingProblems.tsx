import Reveal from "@/app/components/Reveal";
import PricingPlans from "@/app/components/landing/PricingPlans";

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

export default function LandingProblems() {
  return (
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
            <PricingPlans />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Reveal from "@/app/components/Reveal";

/* ─────────────────────────────────────────────────────────────
   A RENSEIGNER PAR JEREMIE — deux valeurs, aucune ne doit etre devinee.

   1. INTERVIEW_COUNT : nombre exact de personnes reellement interrogees.
      Tant qu il vaut null, le sous-titre n annonce aucun chiffre.
      Des qu il est renseigne, la phrase exacte du brief s affiche.

   2. SOURCE_95_URL : lien vers l etude Swile citee pour le "95 % des PME".
      Tant qu il vaut null, seul le nom de la source est affiche, sans lien.
      Si la source ne peut pas etre retrouvee, supprimer le bloc STAT ci-dessous
      plutot que de laisser un chiffre sans origine verifiable.
───────────────────────────────────────────────────────────── */
const INTERVIEW_COUNT: number | null = null;
const SOURCE_95_URL: string | null = null;

/**
 * Verbatims anonymes. Pas de nom, pas de photo, pas d etoiles :
 * l anonymat est assume (recherche terrain), il n est pas masque.
 */
const VERBATIMS = [
  "Le plus compliqué c'est de savoir quand acheter. Personne ne sait si le prix va encore baisser ou exploser.",
  "On perd beaucoup de temps à comparer les sites.",
  "Les validations. Le temps que tout le monde valide, le prix a déjà changé.",
  "Je ne suis pas spécialiste du voyage donc je fais au mieux.",
  "On a déjà vu un billet prendre 300 € en deux jours.",
  "Le problème c'est qu'on ne sait jamais si c'est vraiment trop tard ou pas.",
];

const subtitle =
  INTERVIEW_COUNT === null
    ? "Propos recueillis auprès de personnes en charge de l'organisation de déplacements professionnels en PME."
    : `Verbatims recueillis lors d'entretiens avec ${INTERVIEW_COUNT} personnes en charge de l'organisation de déplacements professionnels en PME.`;

export default function LandingTestimonials() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p
            className="text-xs font-medium tracking-widest uppercase text-center mb-3"
            style={{ color: "var(--steel)" }}
          >
            Paroles de terrain
          </p>
          <h2
            className="text-3xl md:text-4xl font-semibold text-center"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            Ce que disent les personnes qui{" "}
            <span style={{ color: "var(--amber)" }}>organisent ces déplacements</span>
          </h2>
          <p
            className="text-sm text-center mt-4 mb-14 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--steel-light)" }}
          >
            {subtitle}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {VERBATIMS.map((quote, i) => (
            <Reveal key={quote} delay={i * 80}>
              <div
                className="h-full rounded-2xl px-6 py-6"
                style={{
                  background: "rgba(17, 27, 53, 0.55)",
                  border: "1px solid rgba(186,199,226,0.1)",
                  borderLeft: "2px solid rgba(232, 163, 48, 0.45)",
                }}
              >
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--cream)" }}
                >
                  «&nbsp;{quote}&nbsp;»
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-14 max-w-md mx-auto">
            <div
              className="text-center rounded-2xl py-8 px-6"
              style={{
                background: "rgba(17, 27, 53, 0.6)",
                border: "1px solid rgba(232, 163, 48, 0.15)",
              }}
            >
              <p
                className="text-4xl font-bold mb-1"
                style={{ color: "var(--amber)" }}
              >
                95 %
              </p>
              <p className="text-sm" style={{ color: "var(--steel-light)" }}>
                des PME n&apos;ont pas d&apos;agence de voyage dédiée
              </p>
              <p className="text-xs mt-3" style={{ color: "var(--steel)" }}>
                {SOURCE_95_URL ? (
                  <>
                    Source&nbsp;:{" "}
                    <a
                      href={SOURCE_95_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--amber)" }}
                    >
                      étude Swile
                    </a>
                  </>
                ) : (
                  <>Source&nbsp;: étude Swile</>
                )}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

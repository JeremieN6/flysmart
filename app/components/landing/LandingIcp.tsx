import Reveal from "@/app/components/Reveal";

/*
  Issu de l eclatement de LandingProblems (ICP / douleurs / tarifs).

  La carte "Preuve terrain" qui portait le "95 % des PME sans TMC" a ete
  retiree : le chiffre est deja enonce dans le hero et repris, avec sa
  source, dans la section verbatims. Il apparaissait trois fois sur la
  page, et sans source a cet endroit precis.
*/
export default function LandingIcp() {
  return (
    <section className="py-24 px-6" id="pour-qui">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p
            className="text-xs font-medium tracking-widest uppercase text-center mb-3"
            style={{ color: "var(--amber)" }}
          >
            À qui s&apos;adresse FlySmart
          </p>
          <h2
            className="text-3xl md:text-4xl font-semibold text-center"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            Conçu pour le coordinateur de déplacements pro
            <span style={{ color: "var(--amber)" }}> en PME</span>
          </h2>
          <p
            className="text-sm text-center mt-4 mb-14 max-w-2xl mx-auto"
            style={{ color: "var(--steel-light)" }}
          >
            Ni acheteur, ni agent de voyage : la personne qui réserve en plus du reste.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div
            className="rounded-2xl p-7 max-w-3xl mx-auto"
            style={{
              background: "var(--navy-mid)",
              border: "1px solid rgba(232, 163, 48, 0.2)",
            }}
          >
            <p
              className="text-xs font-medium tracking-widest uppercase mb-3"
              style={{ color: "var(--amber)" }}
            >
              Qui vous êtes
            </p>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
            >
              Office manager ou coordinateur logistique dans une PME de 50 à 400 salariés
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--steel-light)" }}>
              Vous gérez les déplacements à la main entre comparateurs et sites compagnies.
              FlySmart vous aide à décider rapidement sans expertise technique.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

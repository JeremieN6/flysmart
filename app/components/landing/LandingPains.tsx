import Reveal from "@/app/components/Reveal";

/*
  Issu de l eclatement de LandingProblems (ICP / douleurs / tarifs).

  Le bloc "Fonctionnalite cle — Partage pour validation manager en un clic"
  a ete retire d ici : la section "Demo flux de validation" qui suit
  immediatement montre exactement ce meme mecanisme, en quatre etapes.
  L annoncer juste avant de le demontrer faisait doublon.
*/
const PAINS = [
  {
    title:
      "Je ne sais jamais si le prix va monter ou descendre ... et je perds un temps fou à comparer",
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

export default function LandingPains() {
  return (
    <section className="py-24 px-6" id="problemes">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p
            className="text-xs font-medium tracking-widest uppercase text-center mb-3"
            style={{ color: "var(--amber)" }}
          >
            Ce qui coince aujourd&apos;hui
          </p>
          <h2
            className="text-3xl md:text-4xl font-semibold text-center"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            Vous êtes-vous déjà retrouvé dans ces situations
            <span style={{ color: "var(--amber)" }}> pénibles ?</span>
          </h2>
          <p
            className="text-sm text-center mt-4 mb-14 max-w-2xl mx-auto"
            style={{ color: "var(--steel-light)" }}
          >
            Et ce que FlySmart y répond, concrètement.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAINS.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div
                className="rounded-2xl p-6 h-full"
                style={{
                  background: "var(--navy-mid)",
                  border: "1px solid rgba(186,199,226,0.12)",
                }}
              >
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
      </div>
    </section>
  );
}

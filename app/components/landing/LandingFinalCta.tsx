import Reveal from "@/app/components/Reveal";

/*
  Relance finale, entre la FAQ et le bandeau de stats. Reprend la promesse
  du hero sans la reformuler, et pousse vers le formulaire de demande de
  demo situe juste en dessous. Un seul CTA primaire, aucun motif graphique
  nouveau : meme carte arrondie et meme accent ambre que le reste de la page.
*/
export default function LandingFinalCta() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div
            className="rounded-2xl px-8 py-12 text-center"
            style={{
              background: "rgba(232, 163, 48, 0.07)",
              border: "1px solid rgba(232, 163, 48, 0.25)",
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-semibold"
              style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
            >
              Sachez enfin si c&apos;est le bon moment d&apos;acheter,
              <span style={{ color: "var(--amber)" }}> sans être expert du voyage</span>
            </h2>
            <p
              className="text-base mt-5 mb-8 max-w-xl mx-auto"
              style={{ color: "var(--steel-light)", lineHeight: "1.7" }}
            >
              Une démo sur vos trajets récents, et vous voyez tout de suite ce que
              le bon timing change pour votre équipe.
            </p>
            <a
              href="#contact-demo"
              className="inline-block px-8 py-4 rounded-xl font-semibold text-base"
              style={{ background: "var(--amber)", color: "var(--midnight)" }}
            >
              Demander une démo gratuite →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

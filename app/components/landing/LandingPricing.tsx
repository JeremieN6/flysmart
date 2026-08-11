import Reveal from "@/app/components/Reveal";
import PricingPlans from "@/app/components/landing/PricingPlans";

/*
  Issu de l eclatement de LandingProblems (ICP / douleurs / tarifs).
  Descendu apres les demonstrations produit : le prix n arrive qu une fois
  la valeur montree. La grille elle-meme vit dans PricingPlans et reste
  partagee avec la page /tarifs.
*/
export default function LandingPricing() {
  return (
    <section className="py-24 px-6" id="tarifs">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p
            className="text-xs font-medium tracking-widest uppercase text-center mb-3"
            style={{ color: "var(--amber)" }}
          >
            Tarifs
          </p>
          <h2
            className="text-3xl md:text-4xl font-semibold text-center"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            Une grille simple pour les déplacements
            <span style={{ color: "var(--amber)" }}> pro en PME</span>
          </h2>
          <p
            className="text-sm text-center mt-4 mb-14 max-w-2xl mx-auto"
            style={{ color: "var(--steel-light)" }}
          >
            Sans engagement. Annulez à tout moment.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <PricingPlans />
        </Reveal>
      </div>
    </section>
  );
}

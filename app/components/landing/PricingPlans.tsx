export const PRICING_PLANS = [
  {
    name: "Starter",
    price: "99€",
    period: "/mois",
    subtitle:
      "Pour les équipes qui organisent des déplacements ponctuels (jusqu'à environ 10 recherches ou réservations par mois)",
    features: [
      "Recommandation d'achat en temps reel",
      "Alertes prix par email",
      "Historique des économies estimées réalisées",
    ],
    cta: "Choisir Starter",
    ctaHref: "/checkout?plan=starter",
    highlight: false,
  },
  {
    name: "Pro",
    price: "199€",
    period: "/mois",
    subtitle:
      "Pour les entreprises avec des déplacements récurrents (séminaires, tournées commerciales, salons)",
    features: [
      "Tout Starter",
      "Partage de recommandation pour validation manager",
      "Multi-utilisateurs",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
    ctaHref: "/checkout?plan=pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    period: "",
    subtitle: "Pour les volumes importants et organisations multi-sites",
    features: ["Contact commercial dédié", "Intégration API"],
    cta: "Parler à l'équipe",
    ctaHref: "/#contact-demo",
    highlight: false,
  },
];

export default function PricingPlans() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING_PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className="rounded-2xl p-7 flex flex-col"
            style={plan.highlight
              ? { background: "rgba(26, 40, 71, 0.88)", border: "1px solid rgba(232, 163, 48, 0.35)", boxShadow: "rgba(232, 163, 48, 0.08) 0px 0px 60px" }
              : { background: "var(--navy-mid)", border: "1px solid rgba(186,199,226,0.12)" }}
          >
            {plan.highlight ? (
              <span className="mb-4 inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(232, 163, 48, 0.2)", color: "var(--amber)" }}>
                Le plus choisi
              </span>
            ) : null}
            <h4 className="text-xl font-semibold" style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}>
              {plan.name}
            </h4>
            <p className="mt-3 text-3xl font-bold" style={{ color: "var(--amber)" }}>
              {plan.price}
              <span className="text-sm font-medium ml-1" style={{ color: "var(--steel)" }}>{plan.period}</span>
            </p>
            <p className="text-sm mt-4 mb-6" style={{ color: "var(--steel-light)" }}>{plan.subtitle}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: "var(--steel-light)" }}>
                  <span style={{ color: "var(--green-ok)", flexShrink: 0 }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={plan.ctaHref}
              className="w-full py-3 rounded-xl text-sm font-semibold text-center block"
              style={plan.highlight
                ? { background: "linear-gradient(135deg, rgb(232, 163, 48) 0%, rgb(196, 132, 42) 100%)", color: "rgb(8, 12, 24)" }
                : { border: "1px solid rgba(232, 163, 48, 0.35)", color: "var(--amber)", background: "rgba(232, 163, 48, 0.08)" }}
            >
              {plan.cta} →
            </a>
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-6" style={{ color: "var(--steel)" }}>
        Les économies affichées dans le dashboard sont des estimations indicatives et ne constituent pas une base de facturation.
      </p>
    </>
  );
}

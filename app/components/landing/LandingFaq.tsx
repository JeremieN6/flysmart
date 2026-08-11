"use client";

import { useState } from "react";
import Reveal from "@/app/components/Reveal";

const FAQ = [
  {
    q: "Comment FlySmart génère sa recommandation d'achat ?",
    a: "FlySmart combine les tendances historiques de prix, les signaux de marché disponibles et votre route pour indiquer une fenêtre d'achat recommandée. L'objectif est de vous aider à décider plus vite, même sans expertise voyage.",
  },
  {
    q: "FlySmart vend-il les billets d'avion ?",
    a: "Non. FlySmart est un outil d'aide à la décision : nous vous aidons à choisir le bon timing d'achat, puis vous finalisez la réservation dans vos canaux habituels.",
  },
  {
    q: "Comment FlySmart calcule les économies affichées ?",
    a: "Nous comparons le prix dans la fenêtre recommandée avec un scénario d'achat plus tardif sur le même trajet. Les montants affichés sont des économies estimées, utiles pour piloter les décisions mais non contractuelles.",
  },
  {
    q: "Que contient le plan Pro par rapport au Starter ?",
    a: "Le plan Pro inclut tout Starter, avec en plus le partage de recommandation pour validation manager, le mode multi-utilisateurs et un support prioritaire.",
  },
  {
    q: "Puis-je tester FlySmart avant abonnement ?",
    a: "Oui. Vous pouvez lancer une première analyse sur la page d'analyse, puis demander une démo guidée sur vos trajets récents pour valider l'usage avec votre équipe.",
  },
  {
    q: "Sur quelles données reposent vos recommandations ?",
    a: "Sur les historiques de prix de la route et de la période concernées, avec le nombre de tarifs réellement observés affiché à côté de chaque recommandation. Quand le volume est trop faible pour conclure, FlySmart le dit explicitement plutôt que de trancher.",
  },
  {
    q: "Que se passe-t-il si la recommandation se trompe ?",
    a: "FlySmart donne une probabilité, pas une certitude : chaque recommandation affiche son niveau de confiance et la fourchette de prix qui l'entoure. Vous gardez la décision — et l'historique garde la trace de ce qui était connu au moment où vous l'avez prise.",
  },
];

export default function LandingFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-24 px-6" style={{ background: "var(--navy-deep)" }} id="faq">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-xs text-center font-medium uppercase tracking-widest mb-4" style={{ color: "var(--amber)" }}>Vous avez des questions ?</p>
          <h2
            className="text-3xl md:text-4xl font-semibold text-center mb-16"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            Questions <span style={{ color: "var(--amber)" }}>fréquentes</span>
          </h2>
        </Reveal>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(186,199,226,0.12)" }}>
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between"
                  style={{
                    background: openFaq === i ? "var(--navy-mid)" : "rgba(17,27,53,0.6)",
                    color: "var(--cream)",
                  }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium">{item.q}</span>
                  <span style={{ color: "var(--amber)", flexShrink: 0, marginLeft: "16px" }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    className="px-6 py-4"
                    style={{ background: "var(--navy-mid)", borderTop: "1px solid rgba(186,199,226,0.08)" }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: "var(--steel-light)" }}>{item.a}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={350}>
          <div className="text-center mt-12">
            <p className="text-sm mb-3" style={{ color: "var(--steel)" }}>
              Vous n'avez pas trouvé votre réponse ?
            </p>
            <a
              href="#contact-demo"
              className="text-sm font-medium"
              style={{ color: "var(--amber)" }}
            >
              Contactez-nous →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

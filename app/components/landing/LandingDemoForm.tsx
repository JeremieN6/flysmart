"use client";

import { useState } from "react";
import Reveal from "@/app/components/Reveal";

const INITIAL_DEMO_FORM = {
  nom: "",
  email: "",
  entreprise: "",
  structureType: "",
  site: "",
  message: "",
};

export default function LandingDemoForm() {
  const [demoForm, setDemoForm] = useState(INITIAL_DEMO_FORM);
  const [demoStatus, setDemoStatus] = useState<"idle" | "submitting">("idle");
  const [demoToast, setDemoToast] = useState<null | { type: "success" | "error"; message: string }>(null);

  function updateDemoForm(field: keyof typeof INITIAL_DEMO_FORM, value: string) {
    setDemoForm((current) => ({ ...current, [field]: value }));
  }

  async function handleDemoSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (demoStatus === "submitting") {
      return;
    }

    setDemoStatus("submitting");
    setDemoToast(null);

    try {
      const response = await fetch("/api/demo-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(demoForm),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "La demande n'a pas pu être envoyée.");
      }

      setDemoForm(INITIAL_DEMO_FORM);
      setDemoToast({
        type: "success",
        message: "Demande envoyée. Un expert FlySmart vous contacte sous 4h.",
      });

      window.setTimeout(() => {
        setDemoToast((current) => (current?.type === "success" ? null : current));
      }, 4500);
    } catch (error) {
      setDemoToast({
        type: "error",
        message: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi.",
      });
    } finally {
      setDemoStatus("idle");
    }
  }

  return (
    <>
      {demoToast ? (
        <div className="fixed right-4 top-4 z-120 w-[calc(100%-2rem)] max-w-sm">
          <div
            role={demoToast.type === "error" ? "alert" : "status"}
            className="rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur"
            style={{
              background: demoToast.type === "error" ? "rgba(239, 68, 68, 0.12)" : "rgba(74, 222, 128, 0.12)",
              borderColor: demoToast.type === "error" ? "rgba(239, 68, 68, 0.35)" : "rgba(74, 222, 128, 0.35)",
              color: "var(--cream)",
            }}
          >
            <div className="flex items-start gap-3">
              <p className="flex-1 text-sm leading-6">{demoToast.message}</p>
              <button
                type="button"
                aria-label="Fermer la notification"
                onClick={() => setDemoToast(null)}
                className="text-sm font-semibold opacity-80 transition-opacity hover:opacity-100"
                style={{ color: "var(--steel-light)" }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section
        id="contact-demo"
        className="py-24 px-6"
        style={{ background: "var(--navy-deep)" }}
      >
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <p
              className="text-xs font-medium tracking-widest uppercase text-center mb-3"
              style={{ color: "var(--amber)" }}
            >
              Démarrez maintenant • Pour les professionnels
            </p>
            <h2
              className="text-3xl md:text-4xl font-semibold text-center"
              style={{
                color: "var(--cream)",
                fontFamily: "var(--font-display)",
              }}
            >
              Demander une {" "}
              <span style={{ color: "var(--amber)" }}>démo gratuite</span>
            </h2>
            <p className="text-center mb-10 mt-4" style={{ color: "var(--steel-light)" }}>
              Réponse sous 4h ouvrées. Sans engagement. Par un de nos expert FlySmart.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <form
              onSubmit={handleDemoSubmit}
              className="rounded-2xl p-8 space-y-4"
              style={{ background: "var(--navy-mid)", border: "1px solid rgba(186,199,226,0.1)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Nom</label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={demoForm.nom}
                    onChange={(e) => updateDemoForm("nom", e.target.value)}
                    className="rounded-xl px-4 py-3 text-sm"
                    style={{ background: "var(--navy-deep)", color: "var(--cream)", border: "1px solid rgba(186,199,226,0.18)", outline: "none" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jean@exemple.com"
                    value={demoForm.email}
                    onChange={(e) => updateDemoForm("email", e.target.value)}
                    className="rounded-xl px-4 py-3 text-sm"
                    style={{ background: "var(--navy-deep)", color: "var(--cream)", border: "1px solid rgba(186,199,226,0.18)", outline: "none" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Entreprise / Structure *</label>
                  <input
                    required
                    type="text"
                    placeholder="Nom de votre PME"
                    value={demoForm.entreprise}
                    onChange={(e) => updateDemoForm("entreprise", e.target.value)}
                    className="w-full rounded-xl px-4 py-3.5 text-sm"
                    style={{ background: "rgba(8, 12, 24, 0.6)", border: "1px solid rgba(107, 127, 168, 0.15)", color: "var(--cream)", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Type de structure *</label>
                  <select
                    required
                    value={demoForm.structureType}
                    onChange={(e) => updateDemoForm("structureType", e.target.value)}
                    className="w-full rounded-xl px-4 py-3.5 text-sm appearance-none cursor-pointer"
                    style={{ background: "rgba(8, 12, 24, 0.6)", border: "1px solid rgba(107, 127, 168, 0.15)", color: demoForm.structureType ? "var(--cream)" : "var(--steel)", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  >
                    <option value="" style={{ background: "rgb(13, 20, 38)" }}>Choisir...</option>
                    <option value="office-manager" style={{ background: "rgb(13, 20, 38)" }}>Office manager</option>
                    <option value="coord-logistique" style={{ background: "rgb(13, 20, 38)" }}>Coordinateur logistique</option>
                    <option value="assistante-direction" style={{ background: "rgb(13, 20, 38)" }}>Assistante de direction</option>
                    <option value="autre" style={{ background: "rgb(13, 20, 38)" }}>Autre</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Site web</label>
                <input
                  type="url"
                  placeholder="https://monsite.com"
                  value={demoForm.site}
                  onChange={(e) => updateDemoForm("site", e.target.value)}
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "var(--navy-deep)", color: "var(--cream)", border: "1px solid rgba(186,199,226,0.18)", outline: "none" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--steel)" }}>Message</label>
                <textarea
                  rows={4}
                  placeholder="Exemple: nous avons 6 a 12 deplacements pro par mois et un delai de validation manager de 24 a 48h."
                  value={demoForm.message}
                  onChange={(e) => updateDemoForm("message", e.target.value)}
                  className="rounded-xl px-4 py-3 text-sm resize-none"
                  style={{ background: "var(--navy-deep)", color: "var(--cream)", border: "1px solid rgba(186,199,226,0.18)", outline: "none" }}
                />
              </div>
              <button
                type="submit"
                disabled={demoStatus === "submitting"}
                className="w-full py-3 rounded-xl font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: "var(--amber)", color: "var(--midnight)" }}
              >
                {demoStatus === "submitting" ? "Envoi en cours..." : "Demander ma démo gratuite →"}
              </button>
              {/* "Ou integrez directement" : dernier reste du positionnement widget. */}
              <p className="text-center text-xs mt-4" style={{ color: "var(--steel)" }}>Vous préférez démarrer seul ? <a href="/tarifs" style={{ color: "var(--amber)" }}>Voir les plans</a></p>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

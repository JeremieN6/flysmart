"use client";

import { useState } from "react";
import Reveal from "@/app/components/Reveal";

type Step = 1 | 2 | 3 | 4;

const CONFIDENCE = 78;
const SAVINGS = 420;

const PAST_ROWS = [
  { date: "02/10", route: "Lyon → Milan", pax: "3", price: "210 €", reco: "18/08", validator: "Thomas D.", saving: "− 180 €" },
  { date: "21/09", route: "Paris → Lisbonne", pax: "2", price: "265 €", reco: "30/07", validator: "Claire M.", saving: "− 95 €" },
  { date: "09/09", route: "Nantes → Berlin", pax: "4", price: "188 €", reco: "12/08", validator: "Thomas D.", saving: "− 240 €" },
];

function tabStyle(active: boolean): React.CSSProperties {
  return {
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "16px 18px",
    borderRadius: "14px",
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    background: active ? "rgba(245,181,61,.12)" : "rgba(255,255,255,.03)",
    border: active ? "1px solid rgba(245,181,61,.45)" : "1px solid rgba(255,255,255,.07)",
    color: active ? "#ffd98a" : "#8e9bba",
    transition: "background .25s, border-color .25s, color .25s",
  };
}

function Step1({ onNext }: { onNext: () => void }) {
  const barW = CONFIDENCE + "%";
  return (
    <div style={{ animation: "flyIn .45s cubic-bezier(.22,1,.36,1) both", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "32px", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ font: "700 26px/1.2 'Plus Jakarta Sans',sans-serif", color: "#e9edf8" }}>Paris → Barcelone</span>
          <span style={{ font: "500 12px/1 'JetBrains Mono',monospace", color: "#a9b6d4", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", padding: "7px 10px", borderRadius: "7px" }}>6 voyageurs</span>
          <span style={{ font: "500 12px/1 'JetBrains Mono',monospace", color: "#a9b6d4", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", padding: "7px 10px", borderRadius: "7px" }}>départ 14 octobre</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 20px", borderRadius: "14px", background: "rgba(74,222,128,.09)", border: "1px solid rgba(74,222,128,.28)", flexWrap: "wrap" }}>
          <span style={{ flex: "none", width: "10px", height: "10px", borderRadius: "99px", background: "#4ade80", boxShadow: "0 0 0 5px rgba(74,222,128,.16)", animation: "pulseDot 2.2s ease-in-out infinite" }} />
          <span style={{ font: "700 22px/1.2 'Plus Jakarta Sans',sans-serif", color: "#7ff0a6", whiteSpace: "nowrap" }}>Achetez maintenant</span>
          <span style={{ marginLeft: "auto", font: "500 11px/1 'JetBrains Mono',monospace", letterSpacing: ".1em", color: "#8fd8a9", whiteSpace: "nowrap" }}>CONFIANCE {CONFIDENCE} %</span>
        </div>
        <div style={{ height: "5px", borderRadius: "99px", background: "rgba(255,255,255,.07)", overflow: "hidden" }}>
          <div style={{ width: barW, height: "100%", borderRadius: "99px", background: "linear-gradient(90deg,#4ade80,#f5b53d)", transition: "width .6s cubic-bezier(.22,1,.36,1)" }} />
        </div>
        <p style={{ margin: 0, font: "400 15px/1.65 'Plus Jakarta Sans',sans-serif", color: "#c3cde6" }}>Sur cette route, le prix augmente en moyenne de <strong style={{ color: "#fff" }}>22 %</strong> dans les 15 derniers jours. Prix actuel <strong style={{ color: "#fff" }}>340 €/pers</strong>, dans la fourchette basse historique.</p>
        <button onClick={onNext} style={{ alignSelf: "flex-start", marginTop: "4px", cursor: "pointer", border: "none", borderRadius: "12px", background: "#f5b53d", color: "#12172a", font: "700 15px/1 'Plus Jakarta Sans',sans-serif", padding: "16px 22px", boxShadow: "0 14px 30px -14px rgba(245,181,61,.7)" }}>Envoyer au manager pour validation →</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "24px", borderRadius: "16px", background: "rgba(255,255,255,.035)", border: "1px solid rgba(255,255,255,.08)" }}>
        <span style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: ".18em", color: "#f5b53d" }}>SUR QUOI REPOSE CETTE RECO</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", font: "500 13px/1.4 'Plus Jakarta Sans',sans-serif", color: "#93a0bf" }}>
            <span>Fourchette historique</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e9edf8" }}>280 – 520 €</span>
          </div>
          <div style={{ position: "relative", marginTop: "26px", height: "34px", borderRadius: "9px", background: "linear-gradient(90deg,rgba(74,222,128,.22),rgba(245,181,61,.18) 55%,rgba(248,113,113,.22))", border: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ position: "absolute", left: "25%", top: "-7px", bottom: "-7px", width: "3px", borderRadius: "9px", background: "#fff", boxShadow: "0 0 14px rgba(255,255,255,.6)" }} />
            <span style={{ position: "absolute", left: "25%", top: "-24px", transform: "translateX(-50%)", font: "600 11px/1 'JetBrains Mono',monospace", color: "#fff", whiteSpace: "nowrap" }}>340 € actuel</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", font: "500 10px/1 'JetBrains Mono',monospace", color: "#6d7b9c", marginTop: "2px" }}>
            <span>280 €</span><span>520 €</span>
          </div>
        </div>
        <div style={{ height: "1px", background: "rgba(255,255,255,.07)", margin: "6px 0" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ font: "700 24px/1 'Plus Jakarta Sans',sans-serif", color: "#fff" }}>47</span>
            <span style={{ font: "400 12px/1.35 'Plus Jakarta Sans',sans-serif", color: "#8e9bba" }}>tarifs observés sur la route</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ font: "700 24px/1 'Plus Jakarta Sans',sans-serif", color: "#fff" }}>+22 %</span>
            <span style={{ font: "400 12px/1.35 'Plus Jakarta Sans',sans-serif", color: "#8e9bba" }}>hausse moyenne sur les 15 derniers jours</span>
          </div>
        </div>
        <p style={{ margin: "4px 0 0", font: "400 12px/1.5 'Plus Jakarta Sans',sans-serif", color: "#6d7b9c" }}>FlySmart donne une probabilité, pas une certitude — et le signale quand les données sont trop minces.</p>
      </div>
    </div>
  );
}

function Step2({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <div style={{ animation: "flyIn .45s cubic-bezier(.22,1,.36,1) both", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "32px", alignItems: "start" }}>
      <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,.1)", background: "#0f1526" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 18px", background: "rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <span style={{ width: "9px", height: "9px", borderRadius: "99px", background: "#f8717155" }} />
          <span style={{ width: "9px", height: "9px", borderRadius: "99px", background: "#f5b53d66" }} />
          <span style={{ width: "9px", height: "9px", borderRadius: "99px", background: "#4ade8055" }} />
          <span style={{ marginLeft: "10px", font: "500 11px/1 'JetBrains Mono',monospace", color: "#8e9bba" }}>Brouillon prêt à partir</span>
        </div>
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", gap: "12px", font: "400 13px/1.5 'Plus Jakarta Sans',sans-serif" }}>
            <span style={{ color: "#6d7b9c", width: "52px" }}>À</span>
            <span style={{ color: "#e9edf8" }}>Thomas D. · thomas.d@entreprise.fr</span>
          </div>
          <div style={{ display: "flex", gap: "12px", font: "400 13px/1.5 'Plus Jakarta Sans',sans-serif" }}>
            <span style={{ color: "#6d7b9c", width: "52px" }}>Objet</span>
            <span style={{ color: "#fff", fontWeight: 600 }}>Validation — Paris→Barcelone, 6 voyageurs, 14 octobre</span>
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,.07)" }} />
          <p style={{ margin: 0, font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#c3cde6" }}>
            Bonjour Thomas,<br />Je propose de réserver maintenant les 6 billets Paris → Barcelone du 14 octobre, à 340 €/pers.
          </p>
          <div style={{ borderLeft: "2px solid rgba(245,181,61,.5)", padding: "2px 0 2px 16px", display: "flex", flexDirection: "column", gap: "7px" }}>
            <span style={{ font: "400 13px/1.55 'Plus Jakarta Sans',sans-serif", color: "#a9b6d4" }}>· Hausse moyenne de <strong style={{ color: "#fff" }}>22 %</strong> sur les 15 derniers jours avant départ</span>
            <span style={{ font: "400 13px/1.55 'Plus Jakarta Sans',sans-serif", color: "#a9b6d4" }}>· Fourchette historique <strong style={{ color: "#fff" }}>280 – 520 €</strong> — nous sommes dans le bas</span>
            <span style={{ font: "400 13px/1.55 'Plus Jakarta Sans',sans-serif", color: "#a9b6d4" }}>· Recommandation basée sur <strong style={{ color: "#fff" }}>47 tarifs observés</strong>, confiance {CONFIDENCE} %</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "12px", background: "rgba(245,181,61,.1)", border: "1px solid rgba(245,181,61,.3)" }}>
            <span style={{ font: "600 12px/1 'JetBrains Mono',monospace", color: "#12172a", background: "#f5b53d", padding: "6px 8px", borderRadius: "6px" }}>DEADLINE</span>
            <span style={{ font: "600 13.5px/1.45 'Plus Jakarta Sans',sans-serif", color: "#ffd98a" }}>À valider avant le jeudi 12 septembre — au-delà, hausse estimée +18 %</span>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "2px" }}>
            <span style={{ font: "600 13px/1 'Plus Jakarta Sans',sans-serif", color: "#12172a", background: "#4ade80", padding: "12px 16px", borderRadius: "10px" }}>Valider la réservation</span>
            <span style={{ font: "600 13px/1 'Plus Jakarta Sans',sans-serif", color: "#c3cde6", border: "1px solid rgba(255,255,255,.16)", padding: "12px 16px", borderRadius: "10px" }}>Voir le détail des tarifs</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ margin: 0, font: "400 15px/1.65 'Plus Jakarta Sans',sans-serif", color: "#c3cde6" }}>L&apos;email est rédigé pour vous : la justification chiffrée est reprise automatiquement, la deadline est explicite. Votre manager n&apos;a rien à chercher.</p>
        <button onClick={onNext} style={{ cursor: "pointer", border: "none", borderRadius: "12px", background: "#f5b53d", color: "#12172a", font: "700 15px/1 'Plus Jakarta Sans',sans-serif", padding: "16px 20px" }}>Envoyer l&apos;email →</button>
        <button onClick={onPrev} style={{ cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,.14)", borderRadius: "12px", color: "#8e9bba", font: "600 13px/1 'Plus Jakarta Sans',sans-serif", padding: "14px 18px" }}>← Revenir à la reco</button>
      </div>
    </div>
  );
}

function Step3({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ animation: "flyIn .45s cubic-bezier(.22,1,.36,1) both", display: "flex", flexDirection: "column", alignItems: "center", gap: "26px", padding: "40px 0 20px" }}>
      <div style={{ width: "100%", maxWidth: "560px", display: "flex", gap: "16px", padding: "22px", borderRadius: "16px", background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.3)", boxShadow: "0 24px 60px -30px rgba(74,222,128,.4)" }}>
        <span style={{ flex: "none", width: "42px", height: "42px", borderRadius: "99px", background: "#4ade80", color: "#0a2417", display: "flex", alignItems: "center", justifyContent: "center", font: "800 20px/1 'Plus Jakarta Sans',sans-serif" }}>✓</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ font: "700 19px/1.3 'Plus Jakarta Sans',sans-serif", color: "#fff" }}>Validé par Thomas D.</span>
          <span style={{ font: "500 12px/1 'JetBrains Mono',monospace", color: "#8fd8a9" }}>il y a 2 h · Paris→Barcelone · 6 pers · 340 €/pers</span>
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "10px", padding: "18px 22px", borderRadius: "14px", background: "rgba(255,255,255,.035)", border: "1px solid rgba(255,255,255,.08)" }}>
        <span style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: ".16em", color: "#6d7b9c" }}>RÉPONSE</span>
        <span style={{ font: "400 14px/1.6 'Plus Jakarta Sans',sans-serif", color: "#c3cde6" }}>« OK, la fourchette et le volume de données me suffisent. Vas-y. »</span>
      </div>
      <button onClick={onNext} style={{ cursor: "pointer", border: "none", borderRadius: "12px", background: "#f5b53d", color: "#12172a", font: "700 15px/1 'Plus Jakarta Sans',sans-serif", padding: "16px 24px", boxShadow: "0 14px 30px -14px rgba(245,181,61,.7)" }}>Marquer comme réservé</button>
    </div>
  );
}

function Step4({ onReplay }: { onReplay: () => void }) {
  const savingsLabel = "− " + SAVINGS + " €";
  return (
    <div style={{ animation: "flyIn .45s cubic-bezier(.22,1,.36,1) both", display: "flex", flexDirection: "column", gap: "22px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <span style={{ font: "700 22px/1.2 'Plus Jakarta Sans',sans-serif", color: "#e9edf8" }}>Historique des décisions</span>
        <span style={{ font: "500 11px/1 'JetBrains Mono',monospace", letterSpacing: ".1em", color: "#6d7b9c" }}>EXPORTABLE · 12 MOIS D&apos;ARCHIVE</span>
      </div>
      <div style={{ borderRadius: "14px", border: "1px solid rgba(255,255,255,.08)", overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "96px minmax(160px,1.5fr) 88px 108px minmax(120px,1fr) minmax(120px,1.1fr) 128px", gap: "8px", minWidth: "840px", padding: "12px 18px", background: "rgba(255,255,255,.05)", font: "500 10px/1.2 'JetBrains Mono',monospace", letterSpacing: ".1em", color: "#7c8aab" }}>
          <span>DÉPART</span><span>TRAJET</span><span>PERS.</span><span>PRIX/PERS</span><span>RECOMMANDÉ LE</span><span>VALIDÉ PAR</span><span>ÉCONOMIE EST.</span>
        </div>
        <div style={{ animation: "flyRow .7s cubic-bezier(.22,1,.36,1) both", display: "grid", gridTemplateColumns: "96px minmax(160px,1.5fr) 88px 108px minmax(120px,1fr) minmax(120px,1.1fr) 128px", gap: "8px", minWidth: "840px", padding: "16px 18px", background: "rgba(245,181,61,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", font: "500 13px/1.3 'JetBrains Mono',monospace", color: "#fff", alignItems: "center" }}>
          <span>14/10</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }}>Paris → Barcelone</span>
          <span>6</span><span>340 €</span><span>05/09</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Thomas D.</span>
          <span style={{ color: "#7ff0a6" }}>{savingsLabel}</span>
        </div>
        {PAST_ROWS.map((row) => (
          <div key={row.date + row.route} style={{ display: "grid", gridTemplateColumns: "96px minmax(160px,1.5fr) 88px 108px minmax(120px,1fr) minmax(120px,1.1fr) 128px", gap: "8px", minWidth: "840px", padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,.05)", font: "400 13px/1.3 'JetBrains Mono',monospace", color: "#a9b6d4", alignItems: "center" }}>
            <span>{row.date}</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#e9edf8" }}>{row.route}</span>
            <span>{row.pax}</span><span>{row.price}</span><span>{row.reco}</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{row.validator}</span>
            <span style={{ color: "#8fd8a9" }}>{row.saving}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <button onClick={onReplay} style={{ cursor: "pointer", border: "1px solid rgba(245,181,61,.4)", borderRadius: "12px", background: "rgba(245,181,61,.1)", color: "#f5b53d", font: "700 14px/1 'Plus Jakarta Sans',sans-serif", padding: "15px 20px" }}>↻ Rejouer la démo</button>
        <span style={{ font: "400 13px/1.5 'Plus Jakarta Sans',sans-serif", color: "#6d7b9c" }}>Trois mois plus tard, la ligne dit encore ce qui a été recommandé, quand, à quel prix, et qui a validé.</span>
      </div>
    </div>
  );
}

const STEP_LABELS: { step: Step; etape: string; label: string }[] = [
  { step: 1, etape: "ÉTAPE 01", label: "La recommandation" },
  { step: 2, etape: "ÉTAPE 02", label: "L'email généré" },
  { step: 3, etape: "ÉTAPE 03", label: "La validation reçue" },
  { step: 4, etape: "ÉTAPE 04", label: "La trace" },
];

export default function LandingValidationDemo() {
  const [step, setStep] = useState<Step>(1);

  return (
    <section
      style={{ background: "#060a16", color: "#e9edf8", padding: "clamp(72px,10vw,120px) clamp(16px,4vw,24px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(72px,10vw,120px)" }}
    >
      <style>{`
        @keyframes flyIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes flyRow{from{opacity:0;transform:translateY(-8px);background:rgba(245,181,61,.16)}to{opacity:1;transform:translateY(0);background:rgba(245,181,61,.06)}}
        @keyframes pulseDot{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}
      `}</style>

      {/* ── Démo flux de validation ── */}
      <div style={{ width: "100%", maxWidth: "1120px", display: "flex", flexDirection: "column", gap: "44px" }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
            <span style={{ font: "500 11px/1 'JetBrains Mono',monospace", letterSpacing: ".18em", textTransform: "uppercase", color: "#f5b53d", padding: "7px 14px", border: "1px solid rgba(245,181,61,.28)", borderRadius: "999px", background: "rgba(245,181,61,.06)" }}>Démo · flux de validation</span>
            <h2 style={{ margin: 0, font: "700 clamp(28px,5vw,44px)/1.12 'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em", maxWidth: "760px" }}>
              De la recommandation à la validation, <span style={{ color: "#f5b53d" }}>en un fil</span>
            </h2>
            <p style={{ margin: 0, font: "400 17px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8e9bba", maxWidth: "600px" }}>Cliquez pour parcourir les quatre étapes. Chaque décision part avec sa justification chiffrée — et revient signée.</p>
            {/*
              Mention obligatoire : prix, pourcentages, noms de valideurs et voyages passes
              de ce bloc sont fictifs. Le releve du 11/08/2026 donne d ailleurs l inverse
              sur cette route (Paris-Barcelone : -27,3 %, prix 48-66 EUR).
            */}
            <p style={{ margin: 0, font: "400 13px/1.6 'Plus Jakarta Sans',sans-serif", color: "#6d7b9c", maxWidth: "600px" }}>
              Maquette d&apos;interface — tous les montants, pourcentages et noms affichés
              dans cette démo sont des valeurs d&apos;illustration.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "10px" }}>
          {STEP_LABELS.map(({ step: s, etape, label }) => (
            <button key={s} onClick={() => setStep(s)} style={tabStyle(step === s)}>
              <span style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: ".14em", opacity: 0.6 }}>{etape}</span>
              <span style={{ font: "600 14px/1.3 'Plus Jakarta Sans',sans-serif" }}>{label}</span>
            </button>
          ))}
        </div>

        <div style={{ position: "relative", borderRadius: "22px", border: "1px solid rgba(255,255,255,.08)", background: "linear-gradient(180deg,#0a1226 0%,#080e1e 100%)", padding: "clamp(20px,3.5vw,36px) clamp(18px,3.5vw,36px) clamp(24px,4vw,40px)", boxShadow: "0 30px 80px -40px rgba(0,0,0,.9)" }}>
          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {step === 2 && <Step2 onNext={() => setStep(3)} onPrev={() => setStep(1)} />}
          {step === 3 && <Step3 onNext={() => setStep(4)} />}
          {step === 4 && <Step4 onReplay={() => setStep(1)} />}
        </div>
      </div>

      {/* ── Budget cible ── */}
      <div style={{ width: "100%", maxWidth: "1120px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "28px", alignItems: "stretch" }}>
        <Reveal>
          <div style={{ padding: "clamp(26px,4vw,40px)", borderRadius: "20px", background: "linear-gradient(150deg,rgba(245,181,61,.09),rgba(255,255,255,.02))", border: "1px solid rgba(245,181,61,.22)", display: "flex", flexDirection: "column", gap: "18px", height: "100%" }}>
            <span style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: ".18em", color: "#f5b53d" }}>BUDGET CIBLE</span>
            <h3 style={{ margin: 0, font: "700 clamp(24px,3.6vw,32px)/1.2 'Plus Jakarta Sans',sans-serif", letterSpacing: "-.015em", maxWidth: "460px" }}>Fixez votre budget cible. Vous n&apos;êtes alerté que s&apos;il devient atteignable.</h3>
            <p style={{ margin: 0, font: "400 16px/1.65 'Plus Jakarta Sans',sans-serif", color: "#a9b6d4", maxWidth: "480px" }}><strong>Pas à chaque variation de prix.</strong> Une seule alerte, au moment où elle compte — et elle arrive avec sa justification chiffrée.</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ padding: "32px", borderRadius: "20px", background: "#0a1226", border: "1px solid rgba(255,255,255,.08)", display: "flex", flexDirection: "column", gap: "20px", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ font: "500 12px/1 'JetBrains Mono',monospace", color: "#8e9bba" }}>BUDGET CIBLE</span>
              <span style={{ font: "700 26px/1 'Plus Jakarta Sans',sans-serif", color: "#f5b53d" }}>300 €<span style={{ font: "500 12px/1 'JetBrains Mono',monospace", color: "#8e9bba" }}> /pers</span></span>
            </div>
            <div style={{ position: "relative", height: "6px", borderRadius: "99px", background: "rgba(255,255,255,.08)" }}>
              <div style={{ position: "absolute", inset: "0 62% 0 0", borderRadius: "99px", background: "linear-gradient(90deg,#4ade80,#f5b53d)" }} />
              <span style={{ position: "absolute", left: "38%", top: "-6px", width: "18px", height: "18px", borderRadius: "99px", background: "#fff", transform: "translateX(-50%)", boxShadow: "0 2px 10px rgba(0,0,0,.6)" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", padding: "16px", borderRadius: "12px", background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.25)" }}>
              <span style={{ flex: "none", width: "8px", height: "8px", marginTop: "6px", borderRadius: "99px", background: "#4ade80" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ font: "600 14px/1.35 'Plus Jakarta Sans',sans-serif", color: "#fff" }}>1 alerte envoyée ce mois-ci</span>
                <span style={{ font: "400 12.5px/1.45 'Plus Jakarta Sans',sans-serif", color: "#8fd8a9" }}>Paris→Barcelone est passé sous 300 € — 47 tarifs observés.</span>
              </div>
            </div>
            <span style={{ font: "400 12px/1.5 'Plus Jakarta Sans',sans-serif", color: "#6d7b9c" }}>Aperçu d&apos;interface — valeurs d&apos;illustration.</span>
          </div>
        </Reveal>
      </div>

      {/* ── Traçabilité ── */}
      <Reveal>
        <div style={{ width: "100%", maxWidth: "1120px", display: "flex", flexDirection: "column", gap: "28px", alignItems: "center", textAlign: "center" }}>
          <span style={{ font: "500 10px/1 'JetBrains Mono',monospace", letterSpacing: ".18em", color: "#f5b53d" }}>TRAÇABILITÉ</span>
          <h3 style={{ margin: 0, font: "700 clamp(25px,4.2vw,36px)/1.2 'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em", maxWidth: "820px" }}>Chaque décision est tracée : ce qui a été recommandé, quand, à quel prix, et qui a validé.</h3>
          <p style={{ margin: 0, font: "400 17px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8e9bba", maxWidth: "620px" }}>De quoi répondre à n&apos;importe quelle question, trois mois plus tard.</p>
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px", marginTop: "8px", textAlign: "left" }}>
            <div style={{ padding: "26px", borderRadius: "16px", background: "#0a1226", border: "1px solid rgba(255,255,255,.08)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ font: "700 15px/1.3 'Plus Jakarta Sans',sans-serif", color: "#e9edf8" }}>Ce qui a été recommandé</span>
              <span style={{ font: "400 13.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8e9bba" }}>Le verdict, la fourchette historique et le volume de tarifs observés, figés à la date de la reco.</span>
            </div>
            <div style={{ padding: "26px", borderRadius: "16px", background: "#0a1226", border: "1px solid rgba(255,255,255,.08)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ font: "700 15px/1.3 'Plus Jakarta Sans',sans-serif", color: "#e9edf8" }}>Qui a validé, et quand</span>
              <span style={{ font: "400 13.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8e9bba" }}>Le nom du valideur, l&apos;horodatage et la deadline qui figurait dans la demande.</span>
            </div>
            <div style={{ padding: "26px", borderRadius: "16px", background: "#0a1226", border: "1px solid rgba(255,255,255,.08)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ font: "700 15px/1.3 'Plus Jakarta Sans',sans-serif", color: "#e9edf8" }}>L&apos;écart constaté</span>
              <span style={{ font: "400 13.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8e9bba" }}>Le prix payé face à la fourchette du moment : l&apos;économie estimée est vérifiable, pas déclarative.</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "@/app/components/Reveal";
import AirportAutocomplete from "@/app/components/AirportAutocomplete";

function extractIata(display: string): string {
  const m = display.match(/^([A-Z]{3})\s*[—-]/);
  return m ? m[1] : display.slice(0, 3).toUpperCase();
}

export default function LandingPriceFinder() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState(
    String(new Date().getMonth() + 2).padStart(2, "0"),
  );
  const [searchMode, setSearchMode] = useState<"flexible" | "precise">("flexible");
  const [dateDepart, setDateDepart] = useState("");
  const [dateRetour, setDateRetour] = useState("");

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!origin || !destination) return;
    const from = extractIata(origin);
    const to = extractIata(destination);
    if (searchMode === "precise") {
      router.push(`/analyse?from=${from}&to=${to}&departDate=${dateDepart}&returnDate=${dateRetour}`);
    } else {
      router.push(`/analyse?from=${from}&to=${to}&month=${month}`);
    }
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-semibold text-center"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            Trouvez le meilleur moment <span style={{ color: "var(--amber)" }}>pour acheter</span>
          </h2>
          <p className="text-center mb-10 mt-4" style={{ color: "var(--steel-light)" }}>
             Testez l&apos;analyse sur n&apos;importe quelle route, sans inscription.
          </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form className="w-full max-w-3xl mx-auto" onSubmit={handleQuickSearch}>
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "rgba(17, 27, 53, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(107, 127, 168, 0.18)",
                boxShadow: "rgba(0, 0, 0, 0.4) 0px 24px 80px, rgba(255, 255, 255, 0.03) 0px 1px 0px inset",
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <div
                  className="flex rounded-xl p-1 gap-1"
                  style={{ background: "rgba(8, 12, 24, 0.5)", border: "1px solid rgba(107, 127, 168, 0.12)" }}
                >
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    onClick={() => setSearchMode("flexible")}
                    style={searchMode === "flexible"
                      ? { background: "rgba(232, 163, 48, 0.18)", color: "var(--amber)", border: "1px solid rgba(232, 163, 48, 0.3)" }
                      : { background: "transparent", color: "var(--steel-light)", border: "1px solid transparent" }}
                  >
                    📅 Mois flexible
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    onClick={() => setSearchMode("precise")}
                    style={searchMode === "precise"
                      ? { background: "rgba(232, 163, 48, 0.18)", color: "var(--amber)", border: "1px solid rgba(232, 163, 48, 0.3)" }
                      : { background: "transparent", color: "var(--steel-light)", border: "1px solid transparent" }}
                  >
                    📍 Dates précises
                  </button>
                </div>
              </div>

              {searchMode === "flexible" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <AirportAutocomplete
                    id="cta-origin"
                    label="Départ"
                    placeholder="Paris, CDG"
                    icon="✈"
                    value={origin}
                    onChange={(v) => setOrigin(v)}
                    required
                  />
                  <AirportAutocomplete
                    id="cta-dest"
                    label="Destination"
                    placeholder="New York, JFK"
                    icon="📍"
                    value={destination}
                    onChange={(v) => setDestination(v)}
                    required
                  />
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-xs font-medium uppercase tracking-widest text-left"
                      style={{ color: "var(--steel)" }}
                    >
                      Mois de voyage
                    </label>
                    <select
                      required
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full rounded-xl px-4 py-3.5 text-sm appearance-none cursor-pointer"
                      style={{
                        background: "rgba(8, 12, 24, 0.6)",
                        border: "1px solid rgba(107, 127, 168, 0.15)",
                        color: "var(--steel)",
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                    >
                      <option value="" style={{ background: "rgb(13, 20, 38)" }}>Choisir un mois</option>
                      <option value="01" style={{ background: "rgb(13, 20, 38)" }}>Janvier</option>
                      <option value="02" style={{ background: "rgb(13, 20, 38)" }}>Février</option>
                      <option value="03" style={{ background: "rgb(13, 20, 38)" }}>Mars</option>
                      <option value="04" style={{ background: "rgb(13, 20, 38)" }}>Avril</option>
                      <option value="05" style={{ background: "rgb(13, 20, 38)" }}>Mai</option>
                      <option value="06" style={{ background: "rgb(13, 20, 38)" }}>Juin</option>
                      <option value="07" style={{ background: "rgb(13, 20, 38)" }}>Juillet</option>
                      <option value="08" style={{ background: "rgb(13, 20, 38)" }}>Août</option>
                      <option value="09" style={{ background: "rgb(13, 20, 38)" }}>Septembre</option>
                      <option value="10" style={{ background: "rgb(13, 20, 38)" }}>Octobre</option>
                      <option value="11" style={{ background: "rgb(13, 20, 38)" }}>Novembre</option>
                      <option value="12" style={{ background: "rgb(13, 20, 38)" }}>Décembre</option>
                    </select>
                  </div>
                </div>
              )}

              {searchMode === "precise" && (
                <>
                  <div
                    className="mb-5 px-4 py-3 rounded-xl flex items-start gap-3"
                    style={{ background: "rgba(232, 163, 48, 0.07)", border: "1px solid rgba(232, 163, 48, 0.2)" }}
                  >
                    <span className="text-lg shrink-0">📊</span>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--amber-light)" }}>
                      En mode dates précises, on génère un <strong>graphique de variation de prix</strong> sur toute votre période — les tarifs peuvent varier significativement d&apos;une semaine à l&apos;autre.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <AirportAutocomplete
                      id="cta-origin-precise"
                      label="Départ"
                      placeholder="Paris, CDG"
                      icon="✈"
                      value={origin}
                      onChange={(v) => setOrigin(v)}
                      required
                    />
                    <AirportAutocomplete
                      id="cta-dest-precise"
                      label="Destination"
                      placeholder="New York, JFK"
                      icon="📍"
                      value={destination}
                      onChange={(v) => setDestination(v)}
                      required
                    />
                    <div className="flex flex-col gap-2">
                      <label
                        className="text-xs font-medium uppercase tracking-widest text-left"
                        style={{ color: "var(--steel)" }}
                      >
                        Date de départ
                      </label>
                      <input
                        required
                        type="date"
                        value={dateDepart}
                        onChange={(e) => setDateDepart(e.target.value)}
                        className="w-full rounded-xl px-4 py-3.5 text-sm"
                        style={{
                          background: "rgba(8, 12, 24, 0.6)",
                          border: "1px solid rgba(107, 127, 168, 0.15)",
                          color: "var(--cream)",
                          outline: "none",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                          colorScheme: "dark",
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        className="text-xs font-medium uppercase tracking-widest text-left"
                        style={{ color: "var(--steel)" }}
                      >
                        Date de retour
                      </label>
                      <input
                        type="date"
                        value={dateRetour}
                        onChange={(e) => setDateRetour(e.target.value)}
                        className="w-full rounded-xl px-4 py-3.5 text-sm"
                        style={{
                          background: "rgba(8, 12, 24, 0.6)",
                          border: "1px solid rgba(107, 127, 168, 0.15)",
                          color: "var(--cream)",
                          outline: "none",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                          colorScheme: "dark",
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full rounded-xl py-4 font-semibold text-base tracking-wide"
                style={{
                  background: "linear-gradient(135deg, rgb(232, 163, 48) 0%, rgb(196, 132, 42) 100%)",
                  color: "rgb(8, 12, 24)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.5 15.5L18 12l3.5-3.5-1.4-1.4L16.6 11H12.8L8.3 3H6l3.3 8H4.5L3 9.5 1.5 11 3 12.5 1.5 14 3 15.5l1.5-2h4.8L6 21.5h2.3l4.5-8h3.8l3.5 3.5 1.4-1.5z"></path>
                  </svg>
                  Analyser les prix
                </span>
              </button>
            </div>
          </form>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10">
          <p className="text-center mb-10 mt-4" style={{ color: "var(--steel-light)", fontStyle: "italic" }}>
            Routes populaires
          </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/*
                Ecarts issus de scripts/output/price-delta-2026-08-11.json (npm run validate-delta),
                couple hors vacances scolaires : depart 07/10/2026 vs depart 01/09/2026.
                Les anciennes routes (Paris-New York, Lyon-Barcelone, Marseille-Tokyo) n avaient
                jamais ete mesurees et ont ete remplacees par des routes reellement relevees.
              */}
              {[
                { from: "Paris", to: "Milan", economy: "–32%", originDisplay: "CDG — Charles de Gaulle (France)", destDisplay: "MXP — Malpensa (Italie)" },
                { from: "Paris", to: "Bordeaux", economy: "–29%", originDisplay: "CDG — Charles de Gaulle (France)", destDisplay: "BOD — Mérignac (France)" },
                { from: "Paris", to: "Marseille", economy: "–29%", originDisplay: "CDG — Charles de Gaulle (France)", destDisplay: "MRS — Provence (France)" },
              ].map((route) => (
                <button
                  key={route.from + route.to}
                  type="button"
                  className="w-full text-left rounded-xl px-5 py-4 transition-all duration-200"
                  style={{ background: "rgba(17, 27, 53, 0.5)", border: "1px solid rgba(107, 127, 168, 0.12)" }}
                  onClick={() => { setOrigin(route.originDisplay); setDestination(route.destDisplay); }}
                >
                  <div className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: "var(--cream)" }}>
                    {route.from}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--steel)" }}>
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                    {route.to}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "var(--amber)" }}>
                    Économie potentielle {route.economy}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-center mt-6" style={{ color: "var(--steel)" }}>
              Écarts relevés le 11/08/2026 entre un départ à 8 semaines et un départ à
              2 semaines, en semaine et hors vacances scolaires. Une mesure par route.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

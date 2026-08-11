"use client";

import Header from "@/app/components/Header";
import LandingHero from "@/app/components/landing/LandingHero";
import LandingWidgetPreview from "@/app/components/landing/LandingWidgetPreview";
import LandingPriceFinder from "@/app/components/landing/LandingPriceFinder";
import LandingIcp from "@/app/components/landing/LandingIcp";
import LandingPains from "@/app/components/landing/LandingPains";
import LandingValidationDemo from "@/app/components/landing/LandingValidationDemo";
import LandingTestimonials from "@/app/components/landing/LandingTestimonials";
import LandingPricing from "@/app/components/landing/LandingPricing";
import LandingFaq from "@/app/components/landing/LandingFaq";
import LandingFinalCta from "@/app/components/landing/LandingFinalCta";
import LandingDemoForm from "@/app/components/landing/LandingDemoForm";
import LandingStatsBar from "@/app/components/landing/LandingStatsBar";
import LandingFooter from "@/app/components/landing/LandingFooter";

export default function LandingClient() {
  return (
    <>
      <Header />

      <main style={{ background: "var(--midnight)" }}>
        {/* Promesse */}
        <LandingHero />

        {/* Preuve visuelle immediate : le meilleur visuel de la page sert de
            sneak peek produit juste apres la promesse. */}
        <LandingWidgetPreview />
        <LandingPriceFinder />

        {/* A qui ca s adresse, et ce que ca resout */}
        <LandingIcp />
        <LandingPains />

        {/* Demonstration produit : flux de validation, budget cible, tracabilite */}
        <LandingValidationDemo />

        {/* Paroles de terrain, puis seulement le prix */}
        <LandingTestimonials />
        <LandingPricing />

        <LandingFaq />

        {/* Relance finale, suivie du formulaire vers lequel elle pointe */}
        <LandingFinalCta />
        <LandingDemoForm />

        <LandingStatsBar />
      </main>

      <LandingFooter />
    </>
  );
}

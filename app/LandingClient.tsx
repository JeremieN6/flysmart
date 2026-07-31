"use client";

import Header from "@/app/components/Header";
import LandingHero from "@/app/components/landing/LandingHero";
import LandingProblems from "@/app/components/landing/LandingProblems";
// import LandingStepper from "@/app/components/landing/LandingStepper";
import LandingWidgetPreview from "@/app/components/landing/LandingWidgetPreview";
import LandingPriceFinder from "@/app/components/landing/LandingPriceFinder";
import LandingDemoForm from "@/app/components/landing/LandingDemoForm";
import LandingTestimonials from "@/app/components/landing/LandingTestimonials";
import LandingFaq from "@/app/components/landing/LandingFaq";
import LandingStatsBar from "@/app/components/landing/LandingStatsBar";
import LandingFooter from "@/app/components/landing/LandingFooter";

export default function LandingClient() {
  return (
    <>
      <Header />

      <main style={{ background: "var(--midnight)" }}>
        <LandingHero />
        <LandingProblems />
        {/* LandingStepper masquee : mode de livraison du service (plateforme vs script embarque) pas encore tranche */}
        {/* <LandingStepper /> */}
        <LandingWidgetPreview />
        <LandingPriceFinder />
        <LandingDemoForm />
        <LandingTestimonials />
        <LandingFaq />
        <LandingStatsBar />
      </main>

      <LandingFooter />
    </>
  );
}

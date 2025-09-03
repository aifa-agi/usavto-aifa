// @/app/@right/(_service)/(_components)/home-page/home-page.tsx
"use client";

import { HeroSection } from "./(_components)/hero-section";
import { TravelSheetsSection } from "./(_components)/travel-sheets-section";
import { FinesSection } from "./(_components)/fines-section";
import { DocumentControlSection } from "./(_components)/document-control-section";
import { FAQSection } from "./(_components)/faq-section";
import { AdvantagesSection } from "./(_components)/advantages-section";
import { CalculatorSection } from "./(_components)/calculator-section";
import { FooterSection } from "./(_components)/footer-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <HeroSection />
      <TravelSheetsSection />
      <FinesSection />
      <DocumentControlSection />
      <FAQSection />
      <AdvantagesSection />
      <CalculatorSection />
      <FooterSection />
    </div>
  );
}

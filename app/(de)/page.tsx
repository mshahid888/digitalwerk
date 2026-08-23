import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTA } from "@/components/ui/cta";
import { Hero } from "@/components/home/hero";
import { Technologies } from "@/components/home/technologies";
import { Problem } from "@/components/home/problem";
import { SolutionPillars } from "@/components/home/solution-pillars";
import { KomplettCallout } from "@/components/home/komplett-callout";
import { TargetIndustries } from "@/components/home/target-industries";
import { ServicesOverview } from "@/components/home/services-overview";
import { Process } from "@/components/home/process";
import { ReferenzenTeaser } from "@/components/home/referenzen-teaser";
import { FAQ } from "@/components/home/faq";

export const metadata: Metadata = buildMetadata(
  {
    title: "DigitalWerk — KI-Agenten & digitaler Wachstumspartner",
    description:
      "Mehr Kunden, mehr Sichtbarkeit, mehr Wachstum: Website, SEO, Werbeanzeigen und KI-Agenten aus einer Hand – für Unternehmen in ganz Deutschland.",
  },
  "/",
  { hreflang: { de: "/", en: "/en" } }
);

export default function Page() {
  return (
    <>
      <Hero />
      <Technologies />
      <Problem />
      <SolutionPillars />
      <KomplettCallout />
      <TargetIndustries />
      <ServicesOverview />
      <Process />
      <ReferenzenTeaser />
      <FAQ />
      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Bereit für mehr Wachstum?"
          title="Lassen Sie uns Ihr Unternehmen digital voranbringen"
          description="Vereinbaren Sie ein kostenloses, unverbindliches Erstgespräch und erfahren Sie, wie DigitalWerk Ihnen zu mehr Sichtbarkeit und Anfragen verhilft."
          secondaryHref="/kontakt"
        />
      </div>
    </>
  );
}

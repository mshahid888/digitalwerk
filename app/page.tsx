import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
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
    description:
      "Mehr Kunden, mehr Sichtbarkeit, mehr Wachstum: Website, SEO, Werbeanzeigen und KI-Automatisierung aus einer Hand – für Unternehmen in ganz Deutschland.",
  },
  "/",
  { hreflang: { de: "/", en: "/en" } }
);

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.address,
    addressCountry: "DE",
  },
  sameAs: [
    siteConfig.social.instagram,
    siteConfig.social.linkedin,
    siteConfig.social.facebook,
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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

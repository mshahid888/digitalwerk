import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTA } from "@/components/ui/cta";
import { PageIntro } from "@/components/shared/page-intro";
import { KomplettSpotlight } from "@/components/solutions/komplett-spotlight";
import { ComparisonList, type ComparisonItem } from "@/components/shared/comparison-list";
import { RelatedServices } from "@/components/solutions/related-services";

const services: ComparisonItem[] = [
  {
    title: "Webentwicklung",
    description:
      "Moderne, schnelle und conversion-starke Websites, die Besucher in Kunden verwandeln.",
    highlight:
      "Ihre aktuelle Website veraltet ist, langsam lädt oder auf dem Smartphone schlecht funktioniert.",
    href: "/loesungen/webentwicklung",
    price: "ab 1.299 € einmalig",
  },
  {
    title: "SEO",
    description:
      "Lokales SEO, das Sie bei Google und Google Maps sichtbarer macht – mehr Anrufe, mehr Besuche.",
    highlight:
      "Ihre Website zwar existiert, bei Google aber kaum gefunden wird.",
    href: "/loesungen/seo",
    price: "299 € / Monat",
  },
  {
    title: "Google Unternehmensprofil",
    description:
      "Professionelle Optimierung Ihres Google-Profils für bessere Rankings und mehr Bewertungen.",
    highlight:
      "Ihr Google-Profil unvollständig ist oder noch gar nicht eingerichtet wurde.",
    href: "/loesungen/google-unternehmensprofil",
    price: "199 € einmalig",
  },
  {
    title: "Content Creation",
    description:
      "Professionelle Website- und SEO-Inhalte, die überzeugen und ranken.",
    highlight:
      "Ihre Website technisch gut ist, die Texte aber nicht überzeugen oder ganz fehlen.",
    href: "/loesungen/content-creation",
    price: "349 € / Monat",
  },
];

export const metadata: Metadata = buildMetadata(
  {
    title: "Lösungen",
    description:
      "Website, SEO, Google Unternehmensprofil und Content Creation – einzeln buchbar oder als Komplettlösung. Finden Sie die passende Lösung für Ihr Unternehmen.",
  },
  "/loesungen",
  { hreflang: { de: "/loesungen", en: "/en/solutions" } }
);

export default function Page() {
  return (
    <>
      <PageIntro
        badge="Lösungen"
        title="Die richtige Lösung für Ihr Unternehmen"
        description="Ob eine einzelne Leistung oder eine vollständige digitale Betreuung – bei DigitalWerk finden Sie die passende Lösung. Für die meisten Unternehmen empfehlen wir DigitalWerk Komplett, unsere All-in-one-Lösung."
      />

      <KomplettSpotlight />
      <ComparisonList
        title="Einzelne Leistungen im Detail"
        intro="Sie benötigen nicht die Komplettlösung? Jede Leistung ist auch einzeln buchbar."
        highlightLabel="Geeignet, wenn"
        items={services}
      />
      <RelatedServices />

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Nicht sicher, was zu Ihnen passt?"
          title="Wir beraten Sie unverbindlich"
          description="Im kostenlosen Erstgespräch finden wir gemeinsam heraus, welche Lösung für Ihr Unternehmen am meisten bewirkt."
          secondaryHref="/kontakt"
        />
      </div>
    </>
  );
}

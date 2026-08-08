import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { CTA } from "@/components/ui/cta";
import { PageIntro } from "@/components/shared/page-intro";
import { CapabilityGrid, type Capability } from "@/components/shared/capability-grid";

export const metadata: Metadata = buildMetadata(
  {
    title: "Referenzen",
    description:
      "Einblick in die Projektarten, die DigitalWerk umsetzt – von Website-Relaunches bis KI-Automatisierung. Echte Kundenreferenzen folgen in Kürze.",
  },
  "/referenzen"
);

const exampleProjects: Capability[] = [
  {
    title: "Website-Relaunch",
    description:
      "Neugestaltung einer bestehenden Website mit Fokus auf Geschwindigkeit, mobile Nutzung und Conversion.",
    outcome: "Beispielprojekt",
  },
  {
    title: "Local-SEO-Aufbau",
    description:
      "Optimierung von Website und Google-Unternehmensprofil für bessere lokale Sichtbarkeit.",
    outcome: "Beispielprojekt",
  },
  {
    title: "KI-Chatbot-Integration",
    description:
      "Einrichtung eines Chatbots zur automatisierten Beantwortung häufiger Kundenanfragen.",
    outcome: "Beispielprojekt",
  },
  {
    title: "Google Ads-Kampagne",
    description:
      "Aufbau und Betreuung einer zielgerichteten Suchanzeigen-Kampagne.",
    outcome: "Beispielprojekt",
  },
  {
    title: "Online-Shop-Einrichtung",
    description:
      "Einrichtung eines Shopify- oder WooCommerce-Shops inklusive Grundoptimierung.",
    outcome: "Beispielprojekt",
  },
  {
    title: "Google-Unternehmensprofil-Optimierung",
    description:
      "Vollständige Überarbeitung und laufende Pflege eines Google-Unternehmensprofils.",
    outcome: "Beispielprojekt",
  },
];

export default function Page() {
  return (
    <>
      <PageIntro
        tone="default"
        badge="Referenzen"
        title="Unsere Arbeit"
        description="DigitalWerk ist ein junges, wachsendes Unternehmen. An dieser Stelle zeigen wir künftig echte Kundenprojekte und Ergebnisse. Bis dahin erhalten Sie hier einen Einblick, welche Art von Projekten wir umsetzen."
      />

      <CapabilityGrid
        title="Beispielhafte Projektarten"
        intro="Da wir aktuell noch keine abgeschlossenen Kundenprojekte veröffentlichen können, zeigen wir hier beispielhafte Projektarten – keine echten Kundenreferenzen."
        capabilities={exampleProjects}
      />

      <Section>
        <Container className="mx-auto max-w-2xl text-center">
          <Heading level={2}>Echte Projekte folgen in Kürze</Heading>
          <p className="mt-4 text-lg text-slate-600">
            Sobald erste Kundenprojekte abgeschlossen sind, stellen wir sie
            mit den tatsächlichen Ergebnissen an dieser Stelle vor.
          </p>
        </Container>
      </Section>

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Ihr Projekt könnte das nächste sein"
          title="Lassen Sie uns über Ihr Projekt sprechen"
          description="Vereinbaren Sie ein kostenloses, unverbindliches Erstgespräch mit DigitalWerk."
          secondaryHref="/loesungen"
          secondaryLabel="Unsere Lösungen entdecken"
        />
      </div>
    </>
  );
}

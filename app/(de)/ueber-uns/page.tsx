import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { CTA } from "@/components/ui/cta";
import { ServiceHero } from "@/components/service-page/hero";
import { ServiceBenefits } from "@/components/service-page/benefits";
import { ServiceProcess } from "@/components/service-page/process";
import { ServiceWhyDigitalWerk } from "@/components/service-page/why-digitalwerk";

export const metadata: Metadata = buildMetadata(
  {
    title: "Über uns",
    description:
      "DigitalWerk ist Ihr langfristiger digitaler Partner – erfahren Sie mehr über unsere Mission, unsere Werte und wie wir mit Unternehmen zusammenarbeiten.",
  },
  "/ueber-uns",
  { hreflang: { de: "/ueber-uns", en: "/en/about" } }
);

const hero = {
  badge: "Über uns",
  title: "Ihr langfristiger Partner für digitales Wachstum",
  description:
    "DigitalWerk ist keine Agentur, die einzelne Projekte abarbeitet. Wir sind ein Partner, der deutsche Unternehmen dauerhaft beim digitalen Wachstum begleitet – ehrlich, transparent und mit einem klaren Fokus auf Ergebnisse.",
};

const values = {
  title: "Unsere Werte",
  intro: "Das, wofür wir stehen – in jedem Projekt und jeder Partnerschaft.",
  items: [
    {
      title: "Professionell",
      description:
        "Wir arbeiten mit klaren Prozessen und verlässlichen Ergebnissen – ohne leere Versprechen.",
    },
    {
      title: "Premium",
      description:
        "Hochwertige Umsetzung statt Standardlösung von der Stange.",
    },
    {
      title: "Modern",
      description:
        "Wir setzen auf aktuelle Technologien, die wirklich einen Unterschied machen.",
    },
    {
      title: "Schnell",
      description:
        "Wir handeln zügig, ohne bei der Qualität Kompromisse einzugehen.",
    },
    {
      title: "Verlässlich",
      description: "Auf unsere Zusagen können Sie sich verlassen.",
    },
    {
      title: "Transparent",
      description:
        "Klare Kommunikation und nachvollziehbare Ergebnisse, ohne Kleingedrucktes.",
    },
    {
      title: "Ergebnisorientiert",
      description:
        "Jede Maßnahme wird an ihrem tatsächlichen Nutzen für Ihr Unternehmen gemessen.",
    },
    {
      title: "Langfristige Partnerschaft",
      description:
        "Wir denken über das einzelne Projekt hinaus – als Partner, nicht als Dienstleister auf Zeit.",
    },
  ],
};

const process = {
  title: "So arbeiten wir",
  steps: [
    {
      title: "Kennenlernen",
      description:
        "Im kostenlosen Erstgespräch verstehen wir Ihr Unternehmen und Ihre Ziele.",
    },
    {
      title: "Strategie",
      description: "Sie erhalten einen klaren, auf Sie zugeschnittenen Plan.",
    },
    {
      title: "Umsetzung",
      description:
        "Wir setzen die vereinbarten Maßnahmen strukturiert und termingerecht um.",
    },
    {
      title: "Langfristige Betreuung",
      description:
        "Wir bleiben an Ihrer Seite – mit laufender Optimierung und einem festen Ansprechpartner.",
    },
  ],
};

const whyChooseUs = {
  title: "Warum Kunden uns wählen",
  points: [
    {
      title: "Ein Partner statt fünf Dienstleister",
      description:
        "Website, SEO, Werbung und Automatisierung aus einer Hand – abgestimmt statt isoliert.",
    },
    {
      title: "Ehrlichkeit vor Verkaufszahlen",
      description:
        "Wir empfehlen nur, was Ihrem Unternehmen wirklich nutzt – auch wenn das bedeutet, weniger zu verkaufen.",
    },
    {
      title: "Persönliche Betreuung",
      description:
        "Sie haben einen festen Ansprechpartner, der Ihr Unternehmen kennt – keine wechselnden Kontakte.",
    },
  ],
};

export default function Page() {
  return (
    <>
      <ServiceHero hero={hero} />

      <Section>
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <Heading level={2}>Unsere Mission</Heading>
            <p className="mt-4 text-lg text-slate-600">
              Wir helfen deutschen Unternehmen, online sichtbar zu werden,
              mehr Kunden zu gewinnen und Zeit durch smarte Automatisierung
              zurückzugewinnen – mit Lösungen, die zusammenpassen statt
              nebeneinander zu existieren.
            </p>
          </div>
          <div>
            <Heading level={2}>Unsere Vision</Heading>
            <p className="mt-4 text-lg text-slate-600">
              Wir wollen der digitale Partner sein, auf den kleine und
              mittelständische Unternehmen in Deutschland langfristig zählen
              können – statt eine von vielen Agenturen, die nach
              Projektabschluss wieder verschwinden.
            </p>
          </div>
        </Container>
      </Section>

      <ServiceBenefits benefits={values} tone="muted" />
      <ServiceProcess process={process} />
      <ServiceWhyDigitalWerk whyDigitalWerk={whyChooseUs} />

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Lernen Sie uns kennen"
          title="Lassen Sie uns über Ihr Unternehmen sprechen"
          description="Vereinbaren Sie ein kostenloses, unverbindliches Erstgespräch mit DigitalWerk."
          secondaryHref="/kontakt"
        />
      </div>
    </>
  );
}

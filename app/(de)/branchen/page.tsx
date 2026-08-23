import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { CTA } from "@/components/ui/cta";
import { PageIntro } from "@/components/shared/page-intro";
import { CapabilityGrid, type Capability } from "@/components/shared/capability-grid";

export const metadata: Metadata = buildMetadata(
  {
    title: "Branchen",
    description:
      "Digitale Lösungen für Restaurants, Praxen, Hotels, Handwerk, Kanzleien und weitere Branchen – individuell angepasst statt Standardlösung.",
  },
  "/branchen",
  { hreflang: { de: "/branchen", en: "/en/industries" } }
);

const industries: Capability[] = [
  {
    title: "Restaurants & Gastronomie",
    description:
      "Von der Google-Sichtbarkeit bis zur Online-Reservierung – digitale Lösungen für Restaurants, Cafés und Gastronomiebetriebe.",
    outcome: "Mehr Tischreservierungen",
  },
  {
    title: "Ärzte & Zahnärzte",
    description:
      "Professionelle Website, lokales SEO und Terminbuchung für Praxen, die ihren Patienten einen modernen digitalen Auftritt bieten möchten.",
    outcome: "Mehr Terminanfragen",
  },
  {
    title: "Hotels & Ferienwohnungen",
    description:
      "Sichtbarkeit bei Google, ansprechende Präsentation und automatisierte Anfragenbearbeitung für Beherbergungsbetriebe.",
    outcome: "Mehr Direktbuchungen",
  },
  {
    title: "Handwerk & lokale Dienstleister",
    description:
      "Lokale Sichtbarkeit und eine Website, die Vertrauen schafft – für Handwerksbetriebe und Dienstleister vor Ort.",
    outcome: "Mehr Anfragen aus der Region",
  },
  {
    title: "Kanzleien & Berater",
    description:
      "Ein professioneller digitaler Auftritt, der Vertrauen und Kompetenz vermittelt – für Anwälte, Steuerberater und Beratungsunternehmen.",
    outcome: "Mehr qualifizierte Anfragen",
  },
  {
    title: "Beauty & Wellness",
    description:
      "Von der Terminbuchung bis zur Google-Sichtbarkeit – digitale Lösungen für Salons, Studios und Wellness-Anbieter.",
    outcome: "Mehr Buchungen",
  },
  {
    title: "Einzelhandel",
    description:
      "Online-Sichtbarkeit, E-Commerce und lokale Kundengewinnung für Einzelhändler.",
    outcome: "Mehr Laufkundschaft & Online-Umsatz",
  },
  {
    title: "Andere lokale Unternehmen",
    description:
      "Unabhängig von Ihrer Branche: Wenn Kunden Sie online finden sollen, unterstützen wir Sie mit passenden digitalen Lösungen.",
    outcome: "Individuell passend",
  },
];

export default function Page() {
  return (
    <>
      <PageIntro
        badge="Branchen"
        title="Digitale Lösungen für Ihre Branche"
        description="DigitalWerk unterstützt kleine und mittelständische Unternehmen aus unterschiedlichen Branchen dabei, online sichtbar zu werden und mehr Kunden zu gewinnen."
      />

      <Section>
        <Container className="mx-auto max-w-3xl text-center">
          <Heading level={2}>
            Warum branchenspezifische Lösungen zählen
          </Heading>
          <p className="mt-4 text-lg text-slate-600">
            Jede Branche hat unterschiedliche Kunden, ein unterschiedliches
            Suchverhalten und unterschiedliche Anforderungen. Ein Restaurant
            braucht andere Inhalte und eine andere lokale Sichtbarkeit als
            eine Anwaltskanzlei oder ein Hotel. Deshalb passen wir unsere
            Lösungen – Website, lokales SEO, Google-Profil, Werbung und
            Automatisierung – gezielt an die Besonderheiten Ihrer Branche
            an, statt eine Standardlösung für alle anzubieten.
          </p>
        </Container>
      </Section>

      <CapabilityGrid
        title="Branchen, mit denen wir arbeiten"
        intro="Eine Auswahl der Branchen, für die unsere Lösungen besonders geeignet sind."
        capabilities={industries}
      />

      <div className="py-8 text-center">
        <Container>
          <p className="text-slate-600">
            Viele dieser Branchen profitieren besonders von{" "}
            <Link
              href="/ki-agenten"
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              KI-Agenten für Unternehmen
            </Link>
            : automatisierte Terminbuchung und Kundenservice, rund um die
            Uhr.
          </p>
        </Container>
      </div>

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Ihre Branche ist nicht dabei?"
          title="Sprechen Sie mit uns über Ihr Unternehmen"
          description="Unabhängig von Ihrer Branche finden wir gemeinsam die passende digitale Lösung für Sie."
          secondaryHref="/kontakt"
        />
      </div>
    </>
  );
}

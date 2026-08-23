import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { buildServiceJsonLd } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { CTA } from "@/components/ui/cta";
import { ServiceHero } from "@/components/service-page/hero";
import { ServiceProblem } from "@/components/service-page/problem";
import { ServiceSolution } from "@/components/service-page/solution";
import { ServiceBenefits } from "@/components/service-page/benefits";
import { ServiceFAQ } from "@/components/service-page/faq";
import { CapabilityGrid, type Capability } from "@/components/shared/capability-grid";
import type { ServicePageContent } from "@/components/service-page/types";

const path = "/ki-agenten/e-commerce";
const description =
  "KI-Agenten beantworten Produktfragen, Bestellstatus und Support-Anfragen in Ihrem Online-Shop automatisch – für Shopify und WooCommerce. Jetzt Beratung anfragen.";

export const metadata: Metadata = buildMetadata(
  {
    title: "KI-Agenten für E-Commerce: Automatisierter Kundenservice im Shop",
    description,
  },
  path
);

const content: Omit<ServicePageContent, "included" | "process" | "whyDigitalWerk"> = {
  hero: {
    badge: "KI-Agenten für E-Commerce",
    title: "KI-Agenten für Ihren Online-Shop",
    description:
      "KI-Agenten beantworten Produktfragen, geben Auskunft zum Bestellstatus und entlasten Ihr Support-Team – automatisch und rund um die Uhr, für Shopify- und WooCommerce-Shops.",
    pricing: {
      price: "699 €",
      period: "Einrichtung",
      secondaryPrice: "99 €",
      secondaryPeriod: "/ Monat",
      note: "Einmalige Einrichtung und laufende Betreuung.",
    },
  },
  problem: {
    title: "Kundenanfragen im Online-Shop kosten Zeit und Umsatz",
    intro:
      "Je mehr Bestellungen, desto mehr Rückfragen – ohne Automatisierung bleibt vieles liegen.",
    points: [
      {
        title: "Bestellstatus-Anfragen häufen sich",
        description:
          "„Wo ist meine Bestellung?“ ist eine der häufigsten Fragen im Support – oft manuell beantwortet.",
      },
      {
        title: "Produktfragen bleiben unbeantwortet",
        description:
          "Außerhalb der Geschäftszeiten warten Kunden auf Antworten – und kaufen in der Zwischenzeit womöglich woanders.",
      },
      {
        title: "Ihr Support-Team ist ausgelastet",
        description:
          "Wiederkehrende Rückfragen binden Zeit, die für komplexere Anliegen fehlt.",
      },
    ],
  },
  solution: {
    title: "Was ein KI-Agent in Ihrem Online-Shop übernimmt",
    description:
      "Ein KI-Agent beantwortet die häufigsten Kundenfragen automatisch – und übergibt komplexere Anliegen direkt an Ihr Team.",
    points: [
      "Produktfragen in natürlicher Sprache beantworten",
      "Bestellstatus und Versandinformationen automatisch mitteilen",
      "Anfragen vor dem Kauf qualifizieren",
      "Bei Bedarf nahtlos an Ihr Team übergeben",
    ],
  },
  benefits: {
    title: "Der Nutzen für Ihren Online-Shop",
    items: [
      {
        title: "Weniger Support-Tickets",
        description:
          "Wiederkehrende Fragen beantwortet der Agent automatisch – Ihr Team bleibt für komplexe Fälle frei.",
      },
      {
        title: "Rund um die Uhr erreichbar",
        description:
          "Kunden erhalten auch abends und am Wochenende sofort eine Antwort.",
      },
      {
        title: "Höhere Kundenzufriedenheit",
        description: "Schnelle Antworten verbessern das Einkaufserlebnis.",
      },
      {
        title: "Mehr abgeschlossene Bestellungen",
        description:
          "Beantwortete Fragen vor dem Kauf senken Kaufabbrüche.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu KI-Agenten im E-Commerce",
    items: [
      {
        question: "Funktioniert der KI-Agent mit Shopify und WooCommerce?",
        answer:
          "Ja, wir binden den KI-Agenten an Ihr bestehendes Shop-System an, damit er auf aktuelle Bestell- und Produktdaten zugreifen kann.",
      },
      {
        question: "Kann der KI-Agent automatisch über den Bestellstatus informieren?",
        answer:
          "Ja, das ist einer der häufigsten Anwendungsfälle im E-Commerce – der Agent ruft den Status ab und teilt ihn dem Kunden direkt mit.",
      },
      {
        question: "Was passiert bei komplexen Kundenanfragen?",
        answer:
          "Der KI-Agent erkennt, wenn eine Anfrage über Standardfragen hinausgeht, und leitet sie direkt an Ihr Team weiter.",
      },
      {
        question: "Eignet sich das auch für kleinere Online-Shops?",
        answer:
          "Ja. Gerade kleinere Teams profitieren davon, wiederkehrende Anfragen zu automatisieren, statt zusätzliches Personal einzustellen.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit, Ihren Shop zu entlasten?",
    title: "Finden Sie heraus, wie ein KI-Agent Ihrem Shop hilft",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie, welche Automatisierung zu Ihrem Online-Shop passt.",
  },
};

const shopCapabilities: Capability[] = [
  {
    title: "Produktberatung",
    description:
      "Beantwortet Fragen zu Verfügbarkeit, Varianten und Eigenschaften Ihrer Produkte.",
    outcome: "Weniger Kaufhürden",
  },
  {
    title: "Bestellstatus & Versand",
    description: "Informiert Kunden automatisch über den Stand ihrer Bestellung.",
    outcome: "Weniger Support-Tickets",
  },
  {
    title: "Retouren & Rückfragen",
    description: "Beantwortet häufige Fragen zu Rückgabe und Umtausch.",
    outcome: "Schnellere Klärung",
  },
  {
    title: "Lead-Qualifizierung vor dem Kauf",
    description: "Erfasst Kundenbedarf, bevor eine Anfrage an Ihr Team geht.",
    outcome: "Passendere Anfragen",
  },
  {
    title: "Eskalation an Ihr Team",
    description: "Komplexe oder sensible Anliegen werden automatisch weitergeleitet.",
    outcome: "Kein Kunde bleibt hängen",
  },
  {
    title: "Shopify- & WooCommerce-Anbindung",
    description:
      "Der Agent greift auf Bestell- und Produktdaten aus Ihrem Shop-System zu.",
    outcome: "Automatisch aktuell",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildServiceJsonLd({
          path,
          name: "KI-Agenten für E-Commerce",
          description,
          locale: "de",
        })}
      />
      <ServiceHero hero={content.hero} />
      <ServiceProblem problem={content.problem} />
      <ServiceSolution solution={content.solution} />
      <ServiceBenefits benefits={content.benefits} />
      <CapabilityGrid
        title="So unterstützt ein KI-Agent Ihren Shop"
        intro="Von der ersten Frage bis zur Übergabe an Ihr Team – für Shopify- und WooCommerce-Shops."
        capabilities={shopCapabilities}
      />
      <ServiceFAQ faq={content.faq} />
      <div className="mx-auto max-w-3xl px-4 pb-4 text-center text-sm text-slate-600">
        Mehr zum Ablauf, den Kosten und wie wir KI-Agenten grundsätzlich
        erstellen, finden Sie auf unserer{" "}
        <Link
          href="/ki-agenten"
          className="font-semibold text-primary-600 hover:text-primary-700"
        >
          KI-Agenten-Hauptseite
        </Link>
        .
      </div>
      <div className="py-16 md:py-24">
        <CTA
          eyebrow={content.cta.eyebrow}
          title={content.cta.title}
          description={content.cta.description}
          secondaryHref="/kontakt"
        />
      </div>
    </>
  );
}

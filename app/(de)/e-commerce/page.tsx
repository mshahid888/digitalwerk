import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { CTA } from "@/components/ui/cta";
import { Container } from "@/components/ui/container";
import { ServiceHero } from "@/components/service-page/hero";
import { ServiceProblem } from "@/components/service-page/problem";
import { ServiceSolution } from "@/components/service-page/solution";
import { ServiceBenefits } from "@/components/service-page/benefits";
import { ServiceProcess } from "@/components/service-page/process";
import { ServiceWhyDigitalWerk } from "@/components/service-page/why-digitalwerk";
import { ServiceFAQ } from "@/components/service-page/faq";
import { CapabilityGrid, type Capability } from "@/components/shared/capability-grid";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "E-Commerce",
    description:
      "Online-Shop auf Shopify oder WooCommerce, verbunden mit Amazon, eBay und TikTok Shop – mehr verkaufen, weniger Verwaltungsaufwand.",
  },
  "/e-commerce",
  { hreflang: { de: "/e-commerce", en: "/en/e-commerce" } }
);

const content: Omit<ServicePageContent, "included"> = {
  hero: {
    badge: "E-Commerce",
    title: "Mehr verkaufen – online und auf jedem Marktplatz",
    description:
      "Ob eigener Online-Shop oder Verkauf über Amazon, eBay und TikTok Shop: Wir helfen Unternehmen, online mehr zu verkaufen – mit einem Shop, der funktioniert, und Prozessen, die sich nicht verzetteln.",
    pricing: {
      price: "ab 1.499 €",
      period: "einmalig",
      note: "Professioneller Online-Shop für den erfolgreichen Verkauf Ihrer Produkte.",
    },
  },
  problem: {
    title: "Verkaufen online ist komplizierter, als es sein sollte",
    intro:
      "Viele Unternehmen verlieren Umsatz nicht durch schlechte Produkte, sondern durch technische und organisatorische Hürden.",
    points: [
      {
        title: "Der Shop bremst den Verkauf",
        description:
          "Ein langsamer oder unübersichtlicher Shop kostet Bestellungen, bevor der Bezahlvorgang überhaupt beginnt.",
      },
      {
        title: "Marktplätze bleiben ungenutzt",
        description:
          "Amazon, eBay und TikTok Shop bieten zusätzliche Käufer – ohne Integration bleibt dieses Potenzial liegen.",
      },
      {
        title: "Verwaltung frisst Zeit",
        description:
          "Bestände, Bestellungen und Produktdaten über mehrere Kanäle zu pflegen, wird schnell unübersichtlich.",
      },
    ],
  },
  solution: {
    title: "Ein Shop-System, das mit Ihnen wächst",
    description:
      "Wir richten Ihren Online-Shop ein oder optimieren einen bestehenden – und verbinden ihn bei Bedarf mit den Marktplätzen, auf denen Ihre Kunden bereits einkaufen.",
    points: [
      "Shop-Einrichtung auf Shopify oder WooCommerce",
      "Anbindung an Amazon, eBay und TikTok Shop",
      "Optimierung bestehender Shops für mehr Abschlüsse",
      "Automatisierung wiederkehrender Verwaltungsaufgaben",
    ],
  },
  benefits: {
    title: "Was ein optimierter Online-Shop bewirkt",
    items: [
      {
        title: "Mehr abgeschlossene Bestellungen",
        description: "Ein schneller, klarer Checkout senkt Kaufabbrüche.",
      },
      {
        title: "Zusätzliche Verkaufskanäle",
        description:
          "Marktplätze erschließen Käufer, die Ihren eigenen Shop nie besucht hätten.",
      },
      {
        title: "Weniger manueller Aufwand",
        description:
          "Automatisierte Prozesse sparen Zeit bei Bestellungen und Lagerbestand.",
      },
      {
        title: "Bessere Kundenerfahrung",
        description:
          "Ein durchdachter Shop wirkt vertrauenswürdiger und verkauft leichter.",
      },
    ],
  },
  process: {
    title: "So optimieren wir Ihren Online-Verkauf",
    steps: [
      {
        title: "Analyse",
        description: "Wir prüfen Ihren aktuellen Shop und Ihre Verkaufskanäle.",
      },
      {
        title: "Strategie",
        description:
          "Wir empfehlen die passende Plattform und Marktplätze für Ihr Unternehmen.",
      },
      {
        title: "Umsetzung",
        description:
          "Wir richten Shop und Marktplatz-Anbindungen ein oder optimieren Bestehendes.",
      },
      {
        title: "Laufende Betreuung",
        description:
          "Wir überwachen die Performance und entwickeln Ihren Shop weiter.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Plattformunabhängig beraten",
        description:
          "Wir empfehlen die Lösung, die zu Ihrem Unternehmen passt – nicht die, die am einfachsten für uns ist.",
      },
      {
        title: "Verkauf im Blick",
        description:
          "Jede Entscheidung wird daran gemessen, ob sie mehr Verkäufe bringt.",
      },
      {
        title: "Laufende Betreuung",
        description: "Wir optimieren Ihren Shop auch nach dem Launch weiter.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu E-Commerce",
    items: [
      {
        question: "Soll ich Shopify oder WooCommerce nutzen?",
        answer:
          "Das hängt von Ihren Anforderungen ab. Im kostenlosen Erstgespräch empfehlen wir die passende Lösung für Ihr Unternehmen.",
      },
      {
        question:
          "Lohnt sich der Verkauf über Marktplätze zusätzlich zum eigenen Shop?",
        answer:
          "In den meisten Fällen ja – Marktplätze erschließen zusätzliche Käufer, die Sie über den eigenen Shop allein nicht erreichen würden.",
      },
      {
        question: "Übernehmen Sie auch die Optimierung eines bestehenden Shops?",
        answer:
          "Ja, eine Neuentwicklung ist nicht immer nötig – oft reichen gezielte Verbesserungen.",
      },
      {
        question: "Was kostet die Einrichtung eines Online-Shops?",
        answer:
          "Das hängt vom Umfang und den gewünschten Funktionen ab. Im kostenlosen Erstgespräch erhalten Sie ein transparentes Angebot.",
      },
      {
        question: "Ist E-Commerce auch Teil von DigitalWerk Komplett?",
        answer:
          "E-Commerce ist eine eigenständige Leistung. Für Unternehmen mit Online-Shop besprechen wir im Erstgespräch, welche Kombination sinnvoll ist.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit, online mehr zu verkaufen?",
    title: "Lassen Sie uns über Ihren Online-Shop sprechen",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie, wie DigitalWerk Ihren Online-Verkauf voranbringt.",
  },
};

const platforms: Capability[] = [
  {
    title: "Shopify",
    description:
      "Schnell einsatzbereit und einfach zu pflegen – ideal für den Einstieg oder Wechsel.",
    outcome: "Schneller Start",
  },
  {
    title: "WooCommerce",
    description:
      "Volle Flexibilität auf Basis von WordPress – für individuelle Anforderungen.",
    outcome: "Maximale Flexibilität",
  },
  {
    title: "Marktplatz-Integration",
    description:
      "Verkaufen Sie zusätzlich über Amazon, eBay und TikTok Shop – zentral verwaltet, dort wo Ihre Kunden bereits einkaufen.",
    outcome: "Mehr Reichweite",
  },
  {
    title: "Store-Optimierung",
    description:
      "Wir verbessern Ladezeit, Checkout und Struktur bestehender Shops.",
    outcome: "Weniger Kaufabbrüche",
  },
  {
    title: "KI für E-Commerce",
    description:
      "Automatisierte Produktbeschreibungen, Empfehlungen und Kundenservice für Ihren Shop.",
    outcome: "Weniger Aufwand",
  },
];

export default function Page() {
  return (
    <>
      <ServiceHero hero={content.hero} />
      <ServiceProblem problem={content.problem} />
      <ServiceSolution solution={content.solution} />
      <ServiceBenefits benefits={content.benefits} />
      <CapabilityGrid
        title="Plattformen & Marktplätze"
        intro="Wir arbeiten mit den Systemen, die zu Ihrem Unternehmen passen – einzeln oder kombiniert."
        capabilities={platforms}
      />
      <div className="py-8 text-center">
        <Container>
          <p className="text-slate-600">
            Speziell für Online-Shops:{" "}
            <Link
              href="/ki-agenten/e-commerce"
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              KI-Agenten für Ihren Online-Shop
            </Link>
          </p>
        </Container>
      </div>
      <ServiceProcess process={content.process} />
      <ServiceWhyDigitalWerk whyDigitalWerk={content.whyDigitalWerk} />
      <ServiceFAQ faq={content.faq} />
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

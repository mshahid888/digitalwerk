import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { buildServiceJsonLd } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { CTA } from "@/components/ui/cta";
import { ServiceHero } from "@/components/service-page/hero";
import { ServiceProblem } from "@/components/service-page/problem";
import { ServiceSolution } from "@/components/service-page/solution";
import { ServiceIncluded } from "@/components/service-page/included";
import { ServiceProcess } from "@/components/service-page/process";
import { ServiceWhyDigitalWerk } from "@/components/service-page/why-digitalwerk";
import { ServiceFAQ } from "@/components/service-page/faq";
import { CapabilityGrid, type Capability } from "@/components/shared/capability-grid";
import { ComparisonList, type ComparisonItem } from "@/components/shared/comparison-list";
import type { ServicePageContent } from "@/components/service-page/types";

const path = "/ki-agenten/erstellen";
const description =
  "So läuft die Entwicklung eines KI-Agenten ab, was sie kostet und welche Beispiele es gibt. DigitalWerk übernimmt auf Wunsch die komplette Umsetzung.";

export const metadata: Metadata = buildMetadata(
  {
    title: "KI-Agenten erstellen lassen: Ablauf, Kosten & Beispiele",
    description,
  },
  path
);

const content: Omit<ServicePageContent, "benefits"> = {
  hero: {
    badge: "KI-Agenten erstellen",
    title: "KI-Agenten erstellen – so geht's für Ihr Unternehmen",
    description:
      "Ein KI-Agent lässt sich selbst zusammenbauen oder professionell erstellen lassen. Wir zeigen, was dazugehört – und übernehmen auf Wunsch die komplette Umsetzung für Ihr Unternehmen.",
    pricing: {
      price: "699 €",
      period: "Erstellung",
      secondaryPrice: "99 €",
      secondaryPeriod: "/ Monat",
      note: "Einmalige Erstellung und laufende Betreuung.",
    },
  },
  problem: {
    title: "Was braucht man, um einen KI-Agenten zu erstellen?",
    intro:
      "Ein guter KI-Agent entsteht nicht durch Zufall. Drei Dinge entscheiden darüber, ob er im Alltag wirklich funktioniert:",
    points: [
      {
        title: "Ein klar definiertes Ziel",
        description:
          "Soll der Agent Anfragen beantworten, Termine buchen oder beides? Je klarer das Ziel, desto zuverlässiger das Ergebnis.",
      },
      {
        title: "Zugang zu den richtigen Informationen",
        description:
          "Der Agent braucht Zugriff auf relevante Daten – etwa Öffnungszeiten, Leistungen oder einen Kalender.",
      },
      {
        title: "Eine Testphase vor dem Livegang",
        description:
          "Erst im echten Einsatz zeigt sich, ob Antworten und Abläufe wirklich passen – deshalb testen wir jeden Agenten, bevor er live geht.",
      },
    ],
  },
  solution: {
    title: "Was ein KI-Agent leisten kann, wenn er richtig erstellt ist",
    description:
      "Richtig erstellt, ist ein KI-Agent mehr als ein einfacher Chatbot: Er versteht natürliche Sprache, greift auf Ihre Unternehmensdaten zu und kann Aufgaben eigenständig ausführen.",
    points: [
      "Kundenanfragen in natürlicher Sprache verstehen",
      "Auf Ihre Unternehmensdaten und Systeme zugreifen",
      "Aufgaben eigenständig ausführen, z. B. einen Termin buchen",
      "Bei Bedarf automatisch an Ihr Team übergeben",
    ],
  },
  included: {
    title: "Technologie & Anbindungen",
    intro:
      "Wir binden Ihren KI-Agenten an die Kanäle und Systeme an, die Sie bereits nutzen.",
    items: [
      "Website-Chat",
      "WhatsApp Business",
      "Telefonie / Sprachanrufe",
      "Kalender- und Terminsysteme",
      "Ihre Kundendaten",
      "E-Mail",
    ],
  },
  process: {
    title: "So erstellen wir KI-Agenten bei DigitalWerk",
    steps: [
      {
        title: "Analyse & Zieldefinition",
        description:
          "Wir klären, welche Aufgaben der KI-Agent übernehmen soll und welche Informationen er dafür braucht.",
      },
      {
        title: "Konzept & Gesprächsführung",
        description:
          "Wir legen fest, wie der Agent mit Ihren Kunden kommuniziert und wann er an Ihr Team übergibt.",
      },
      {
        title: "Entwicklung & Anbindung",
        description:
          "Wir richten den Agenten ein und verbinden ihn mit den relevanten Systemen, z. B. Kalender oder Kundendaten.",
      },
      {
        title: "Testphase & Livegang",
        description:
          "Wir testen den Agenten gemeinsam mit Ihnen, bevor er live geht – und betreuen ihn danach laufend weiter.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk für die Erstellung Ihres KI-Agenten",
    points: [
      {
        title: "Datenschutz von Anfang an",
        description:
          "Schon bei der Erstellung berücksichtigen wir die Grundsätze der DSGVO – von der Auswahl der Daten bis zur Anbindung Ihrer Systeme.",
      },
      {
        title: "Technologieoffen statt Tool-Bindung",
        description:
          "Wir wählen die passende Technologie für Ihren Anwendungsfall, statt Sie an ein bestimmtes Tool zu binden.",
      },
      {
        title: "Transparente Kosten",
        description:
          "Sie erhalten vor Projektstart ein klares Angebot – ohne versteckte Kosten während der Erstellung.",
      },
      {
        title: "Betreuung nach dem Launch",
        description:
          "Mit dem Livegang endet unsere Arbeit nicht – wir betreuen und erweitern Ihren KI-Agenten laufend.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zur Erstellung von KI-Agenten",
    items: [
      {
        question: "Wie lange dauert die Erstellung eines KI-Agenten?",
        answer:
          "Je nach Umfang dauert die Einrichtung eines KI-Agenten in der Regel wenige Wochen – von der Analyse Ihrer Anforderungen bis zum getesteten Livegang.",
      },
      {
        question:
          "Brauche ich Programmierkenntnisse, um einen KI-Agenten zu erstellen?",
        answer:
          "Nein. Mit No-Code-Werkzeugen lässt sich zwar ein einfacher Agent selbst zusammenstellen, für einen zuverlässigen, an Ihr Unternehmen angepassten KI-Agenten übernehmen wir bei DigitalWerk die technische Umsetzung vollständig.",
      },
      {
        question:
          "Welche Informationen benötigt DigitalWerk, um einen KI-Agenten zu erstellen?",
        answer:
          "Wir benötigen im Wesentlichen Informationen zu Ihren häufigsten Kundenanfragen, den Systemen, die angebunden werden sollen – etwa Kalender oder Kundendaten – und Ihren gewünschten Abläufen. Den Rest erarbeiten wir gemeinsam im Erstgespräch.",
      },
      {
        question: "Kann ein bestehender KI-Agent später erweitert werden?",
        answer:
          "Ja. KI-Agenten lassen sich nachträglich um neue Funktionen, Kanäle oder Anbindungen erweitern – wir passen sie im Rahmen der laufenden Betreuung kontinuierlich an.",
      },
      {
        question: "Was passiert, wenn eine Anfrage zu komplex für den KI-Agenten ist?",
        answer:
          "Komplexe oder sensible Anliegen leitet der KI-Agent direkt an Ihr Team weiter, statt eine unpassende Antwort zu geben.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit für Ihren eigenen KI-Agenten?",
    title: "Lassen Sie uns Ihren KI-Agenten gemeinsam erstellen",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie, wie DigitalWerk einen KI-Agenten für Ihr Unternehmen erstellt.",
  },
};

const examples: Capability[] = [
  {
    title: "Terminbuchung für eine Zahnarztpraxis",
    description:
      "Patienten vereinbaren Termine automatisch, auch außerhalb der Sprechzeiten.",
    outcome: "Weniger Anrufe",
  },
  {
    title: "Reservierungsanfragen für ein Restaurant",
    description:
      "Gäste erhalten sofort eine Antwort auf Reservierungsanfragen – auch am Wochenende.",
    outcome: "Keine verpasste Reservierung",
  },
  {
    title: "Erstgespräch-Qualifizierung für eine Kanzlei",
    description:
      "Der Agent erfasst das Anliegen und leitet nur passende Anfragen an das Team weiter.",
    outcome: "Weniger unpassende Anfragen",
  },
  {
    title: "Bestellstatus im Online-Shop",
    description:
      "Kunden erhalten automatisch Auskunft zu Bestellungen und Versand.",
    outcome: "Weniger Support-Tickets",
  },
];

const buildOrHire: ComparisonItem[] = [
  {
    title: "Selbst erstellen",
    description:
      "Mit No-Code-Tools lässt sich ein einfacher KI-Agent auch ohne Entwicklerteam zusammenstellen – mit Einschränkungen bei Anbindung, Zuverlässigkeit und laufender Pflege.",
    highlight: "Kleine, einfache Anwendungsfälle mit Zeit zum Experimentieren.",
    href: "/kontakt",
  },
  {
    title: "Erstellen lassen",
    description:
      "DigitalWerk übernimmt Analyse, Einrichtung, Anbindung an Ihre Systeme und die laufende Betreuung – für einen KI-Agenten, der zuverlässig läuft, ohne dass Sie sich technisch einarbeiten müssen.",
    highlight:
      "Unternehmen, die einen zuverlässigen KI-Agenten ohne eigenen Aufwand wollen.",
    href: "/kontakt",
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildServiceJsonLd({
          path,
          name: "KI-Agenten erstellen",
          description,
          locale: "de",
        })}
      />
      <ServiceHero hero={content.hero} />
      <ServiceProblem problem={content.problem} />
      <ServiceSolution solution={content.solution} />
      <ComparisonList
        title="Selbst erstellen oder erstellen lassen?"
        intro="Es gibt beide Wege – welcher passt, hängt von Zeit, technischem Anspruch und den Anforderungen Ihres Unternehmens ab."
        highlightLabel="Am besten geeignet für"
        items={buildOrHire}
        tone="default"
      />
      <ServiceProcess process={content.process} />
      <CapabilityGrid
        title="Beispiele für KI-Agenten in der Praxis"
        intro="So setzen Unternehmen KI-Agenten heute bereits ein – als Orientierung für Ihr eigenes Projekt."
        capabilities={examples}
      />
      <ServiceIncluded included={content.included} />
      <ServiceWhyDigitalWerk whyDigitalWerk={content.whyDigitalWerk} />
      <ServiceFAQ faq={content.faq} />
      <div className="mx-auto max-w-3xl px-4 pb-4 text-center text-sm text-slate-600">
        Mehr zu unseren KI-Lösungen und den Einsatzmöglichkeiten für Ihr
        Unternehmen finden Sie auf unserer{" "}
        <Link
          href="/ki-agenten"
          className="font-semibold text-primary-600 hover:text-primary-700"
        >
          KI-Agenten-Übersichtsseite
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

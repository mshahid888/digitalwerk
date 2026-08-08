import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTA } from "@/components/ui/cta";
import { ServiceHero } from "@/components/service-page/hero";
import { ServiceProblem } from "@/components/service-page/problem";
import { ServiceSolution } from "@/components/service-page/solution";
import { ServiceBenefits } from "@/components/service-page/benefits";
import { ServiceProcess } from "@/components/service-page/process";
import { ServiceWhyDigitalWerk } from "@/components/service-page/why-digitalwerk";
import { ServiceFAQ } from "@/components/service-page/faq";
import { CapabilityGrid, type Capability } from "@/components/shared/capability-grid";
import { PrivacyTrust } from "@/components/ki-agenten/privacy-trust";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata({
  title: "KI-Agenten",
  description:
    "KI-Agenten für Restaurants, Praxen, Kanzleien und mehr: Anrufe, Terminbuchung und Kundenanfragen automatisch bearbeiten – Zeit und Kosten sparen.",
});

const content: Omit<ServicePageContent, "included"> = {
  hero: {
    badge: "KI-Agenten",
    title: "Weniger Aufwand, mehr Kunden – automatisch",
    description:
      "KI-Agenten beantworten Anfragen, nehmen Anrufe entgegen und vereinbaren Termine – rund um die Uhr. So sparen Sie Zeit, senken Kosten und verpassen keine Anfrage mehr.",
  },
  problem: {
    title: "Jede verpasste Anfrage ist ein verlorener Kunde",
    intro:
      "Ob Restaurant, Praxis oder Kanzlei – die Herausforderung ist überall dieselbe: zu viele Anfragen, zu wenig Zeit.",
    points: [
      {
        title: "Anrufe bleiben unbeantwortet",
        description:
          "Während des Tagesgeschäfts oder außerhalb der Öffnungszeiten gehen Anrufe verloren – und mit ihnen potenzielle Kunden.",
      },
      {
        title: "Nachrichten stapeln sich",
        description:
          "WhatsApp, E-Mail, Kontaktformular – Anfragen kommen aus allen Richtungen und bleiben liegen.",
      },
      {
        title: "Mitarbeiter sind mit Routineaufgaben gebunden",
        description:
          "Terminanfragen und Standardfragen kosten Zeit, die für das Kerngeschäft fehlt.",
      },
    ],
  },
  solution: {
    title: "KI-Agenten übernehmen, was Zeit kostet",
    description:
      "KI-Agenten beantworten Anfragen, nehmen Anrufe entgegen, buchen Termine und qualifizieren Anfragen – automatisch und rund um die Uhr. Sie und Ihr Team gewinnen Zeit für das, was wirklich zählt: Ihre Kunden vor Ort.",
    points: [
      "Rund um die Uhr erreichbar – auch außerhalb der Öffnungszeiten",
      "Sofortige Antworten statt Wartezeit",
      "Weniger Verwaltungsaufwand für Ihr Team",
      "Mehr abgeschlossene Anfragen statt verlorener Kontakte",
    ],
  },
  benefits: {
    title: "Was KI-Automatisierung für Ihr Unternehmen bewirkt",
    items: [
      {
        title: "Zeitersparnis",
        description:
          "Ihr Team wird von Routineanfragen entlastet und hat mehr Zeit für Kunden vor Ort.",
      },
      {
        title: "Geringere Kosten",
        description:
          "Automatisierung reduziert den Bedarf an zusätzlichem Personal für Anfragen und Terminvergabe.",
      },
      {
        title: "Mehr Kunden",
        description:
          "Keine verpasste Anfrage mehr – auch nachts und am Wochenende nicht.",
      },
      {
        title: "Zufriedenere Kunden",
        description:
          "Sofortige Antworten sorgen für ein besseres Kundenerlebnis.",
      },
    ],
  },
  process: {
    title: "So führen wir KI-Agenten bei Ihnen ein",
    steps: [
      {
        title: "Analyse",
        description:
          "Wir identifizieren, wo Automatisierung in Ihrem Unternehmen den größten Nutzen bringt.",
      },
      {
        title: "Einrichtung",
        description:
          "Wir richten die passenden KI-Agenten für Ihre Anforderungen ein.",
      },
      {
        title: "Testphase",
        description: "Wir testen gemeinsam mit Ihnen, bevor alles live geht.",
      },
      {
        title: "Betreuung & Optimierung",
        description:
          "Wir überwachen die Ergebnisse und passen die Automatisierung laufend an.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Business zuerst",
        description:
          "Wir setzen KI nur dort ein, wo sie echten wirtschaftlichen Nutzen bringt – nicht, weil es ein Trend ist.",
      },
      {
        title: "Einfach erklärt",
        description:
          "Sie müssen nichts über KI wissen – wir erklären alles in verständlicher Sprache.",
      },
      {
        title: "Mensch + KI",
        description:
          "Unsere KI-Lösungen automatisieren wiederkehrende Aufgaben. Die persönliche Beratung und die Beziehung zu Ihren Kunden bleiben in der Verantwortung Ihres Teams.",
      },
      {
        title: "Laufende Betreuung",
        description: "Wir überwachen und verbessern Ihre KI-Agenten dauerhaft.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu KI-Agenten",
    items: [
      {
        question: "Ersetzt KI-Automatisierung mein Team?",
        answer:
          "Nein. KI-Agenten übernehmen Routineaufgaben und entlasten Ihr Team – für den persönlichen Kontakt mit Ihren Kunden bleiben Ihre Mitarbeiter unersetzlich.",
      },
      {
        question: "Ist das nicht sehr kompliziert einzurichten?",
        answer:
          "Nein. Wir übernehmen die vollständige Einrichtung und Betreuung – Sie müssen sich um nichts Technisches kümmern.",
      },
      {
        question: "Wirkt das nicht unpersönlich auf meine Kunden?",
        answer:
          "Gut eingerichtete KI-Agenten beantworten einfache Anfragen schnell und leiten komplexere Anliegen direkt an Ihr Team weiter – für ein besseres, nicht unpersönlicheres Erlebnis.",
      },
      {
        question: "Für welche Unternehmen eignen sich KI-Agenten?",
        answer:
          "Für alle Unternehmen mit wiederkehrenden Anfragen – etwa Restaurants, Praxen, Kanzleien, Hotels oder Beauty-Salons.",
      },
      {
        question: "Was kostet der Einsatz von KI-Agenten?",
        answer:
          "Die Kosten richten sich nach Umfang und gewünschten Funktionen. Im kostenlosen Erstgespräch erhalten Sie ein transparentes Angebot.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit, Zeit und Kosten zu sparen?",
    title: "Finden Sie heraus, wo Automatisierung Ihnen am meisten bringt",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie, welche KI-Agenten zu Ihrem Unternehmen passen.",
  },
};

const aiSolutions: Capability[] = [
  {
    title: "AI Chatbots",
    description:
      "Beantwortet Fragen auf Ihrer Website in Echtzeit – auch nachts und am Wochenende.",
    outcome: "Keine verpasste Anfrage mehr",
  },
  {
    title: "AI Voice Agents",
    description:
      "Führt natürliche Telefongespräche und beantwortet häufige Fragen automatisch.",
    outcome: "Entlastet Ihr Team",
  },
  {
    title: "AI Phone Receptionists",
    description:
      "Nimmt eingehende Anrufe entgegen, wenn niemand ans Telefon gehen kann.",
    outcome: "Nie wieder ein verpasster Anruf",
  },
  {
    title: "WhatsApp AI",
    description:
      "Beantwortet Kundenanfragen dort, wo viele Ihrer Kunden ohnehin schon sind.",
    outcome: "Schnellere Antworten",
  },
  {
    title: "Terminbuchung",
    description:
      "Kunden buchen Termine selbstständig – ganz ohne Anruf oder E-Mail-Verkehr.",
    outcome: "Voller Kalender, weniger Aufwand",
  },
  {
    title: "Kundensupport-Automatisierung",
    description:
      "Beantwortet wiederkehrende Fragen automatisch und leitet komplexere Anliegen weiter.",
    outcome: "Mehr Zeit für wichtige Fälle",
  },
  {
    title: "Lead-Qualifizierung",
    description:
      "Filtert und sortiert Anfragen automatisch, bevor sie bei Ihnen landen.",
    outcome: "Nur noch passende Anfragen",
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
        title="Unsere KI-Lösungen im Überblick"
        intro="Jede Lösung löst ein konkretes Problem in Ihrem Tagesgeschäft – einzeln oder kombiniert einsetzbar."
        capabilities={aiSolutions}
      />
      <PrivacyTrust />
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

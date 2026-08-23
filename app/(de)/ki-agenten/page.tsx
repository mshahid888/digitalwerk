import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { CTA } from "@/components/ui/cta";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { ServiceHero } from "@/components/service-page/hero";
import { ServiceProblem } from "@/components/service-page/problem";
import { ServiceSolution } from "@/components/service-page/solution";
import { ServiceBenefits } from "@/components/service-page/benefits";
import { ServiceProcess } from "@/components/service-page/process";
import { ServiceWhyDigitalWerk } from "@/components/service-page/why-digitalwerk";
import { ServiceFAQ } from "@/components/service-page/faq";
import { CapabilityGrid, type Capability } from "@/components/shared/capability-grid";
import { PrivacyTrust } from "@/components/ki-agenten/privacy-trust";
import { ComparisonList, type ComparisonItem } from "@/components/shared/comparison-list";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "KI-Agenten für Unternehmen: Kundenservice & Termine automatisieren",
    description:
      "KI-Agenten übernehmen Anrufe, Chats und Terminbuchung für Ihr Unternehmen – rund um die Uhr. Jetzt Kosten & Möglichkeiten im kostenlosen Erstgespräch erfahren.",
  },
  "/ki-agenten",
  { hreflang: { de: "/ki-agenten", en: "/en/ai-agents" } }
);

const content: Omit<ServicePageContent, "included"> = {
  hero: {
    badge: "KI-Agenten",
    title: "KI-Agenten für Ihr Unternehmen: Weniger Aufwand, mehr Kunden",
    description:
      "KI-Agenten beantworten Anfragen, nehmen Anrufe entgegen und vereinbaren Termine – rund um die Uhr. So sparen Sie Zeit, senken Kosten und verpassen keine Anfrage mehr.",
    pricing: {
      price: "699 €",
      period: "Einrichtung",
      secondaryPrice: "99 €",
      secondaryPeriod: "/ Monat",
      note: "Einmalige Einrichtung und laufende Betreuung.",
    },
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
      {
        question: "Sind KI-Agenten auch Teil von DigitalWerk Komplett?",
        answer:
          "Ja, KI-Agenten sind Bestandteil von DigitalWerk Komplett und zusätzlich einzeln buchbar.",
      },
      {
        question: "Was ist ein KI-Agent?",
        answer:
          "Ein KI-Agent ist ein Software-System, das mithilfe künstlicher Intelligenz eigenständig Aufgaben übernimmt – zum Beispiel Kundenanfragen beantworten, Informationen nachschlagen oder einen Termin buchen. Im Gegensatz zu einfachen, regelbasierten Programmen versteht ein KI-Agent natürliche Sprache und kann innerhalb klar definierter Regeln selbstständig handeln, statt nur vorgefertigte Antworten auszugeben.",
      },
      {
        question:
          "Was ist der Unterschied zwischen einem KI-Agenten und einem Chatbot?",
        answer:
          "Ein klassischer Chatbot folgt vordefinierten Dialogpfaden und liefert Antworten aus einem festen Skript – bei unerwarteten oder komplexeren Fragen stößt er schnell an Grenzen. Ein KI-Agent versteht natürliche Sprache, zieht bei Bedarf relevanten Kontext heran und kann eigenständig handeln, etwa einen Termin buchen oder eine Anfrage qualifizieren, statt nur zu antworten. Kurz gesagt: Ein Chatbot antwortet, ein KI-Agent erledigt.",
      },
      {
        question: "Wie baut man einen KI-Agenten?",
        answer:
          "Die Entwicklung beginnt mit einer Analyse: Welche Aufgaben soll der KI-Agent übernehmen, welche Informationen benötigt er, und wie soll er mit Kunden kommunizieren? Darauf folgen Einrichtung, Anbindung an bestehende Systeme wie Kalender oder Kundendaten sowie eine Testphase, bevor der Agent live geht. Bei DigitalWerk übernehmen wir diesen gesamten Prozess für Sie – von der Analyse bis zur laufenden Betreuung.",
      },
      {
        question: "Was kostet ein KI-Agent?",
        answer:
          "Die Kosten hängen vom Funktionsumfang und den gewünschten Anbindungen ab. Bei DigitalWerk startet die Einrichtung eines KI-Agenten bei 699 € einmalig, zzgl. 99 € monatlich für Betreuung und laufende Optimierung. Im kostenlosen Erstgespräch erhalten Sie ein transparentes Angebot, das genau auf Ihr Unternehmen zugeschnitten ist.",
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

const chatbotVsAgent: ComparisonItem[] = [
  {
    title: "Klassischer Chatbot",
    description:
      "Folgt vordefinierten Dialogpfaden und beantwortet Fragen aus einem festen Skript. Stößt bei individuellen oder komplexeren Anfragen schnell an Grenzen.",
    highlight:
      "Einfache, wiederkehrende Standardfragen mit klar vorhersehbaren Antworten.",
    href: "/kontakt",
  },
  {
    title: "KI-Agent",
    description:
      "Versteht natürliche Sprache, zieht bei Bedarf Kontext heran und kann eigenständig handeln – etwa einen Termin buchen oder eine Anfrage qualifizieren, statt nur zu antworten.",
    highlight:
      "Kundenservice, Terminbuchung und Anfragen, die echtes Verständnis und eigenständiges Handeln erfordern.",
    href: "/kontakt",
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
      <ComparisonList
        title="KI-Agent oder Chatbot – was passt zu Ihrem Unternehmen?"
        intro="Beide automatisieren Kommunikation – aber auf unterschiedliche Weise. Der Unterschied entscheidet, welche Lösung wirklich zu Ihren Anfragen passt."
        highlightLabel="Am besten geeignet für"
        items={chatbotVsAgent}
        linkLabel="Kostenlose Beratung anfragen"
        tone="muted"
      />
      <ServiceProcess process={content.process} />
      <ServiceWhyDigitalWerk whyDigitalWerk={content.whyDigitalWerk} />
      <ServiceFAQ faq={content.faq} />
      <Section tone="muted">
        <Container className="flex flex-col items-center gap-10">
          <div className="max-w-2xl text-center">
            <Heading level={2}>Mehr zum Thema KI-Agenten</Heading>
            <p className="mt-4 text-lg text-slate-600">
              Vertiefende Informationen zu zwei häufigen Anwendungsfällen.
            </p>
          </div>

          <div className="grid w-full gap-6 sm:grid-cols-2">
            <Link href="/ki-agenten/erstellen" className="group">
              <Card hoverable className="flex h-full flex-col">
                <Heading level={3} size={4} className="group-hover:text-primary-600">
                  KI-Agenten erstellen lassen
                </Heading>
                <p className="mt-3 flex-1 text-sm text-slate-600">
                  Ablauf, Kosten und Beispiele: So entsteht ein KI-Agent für
                  Ihr Unternehmen – selbst gebaut oder professionell
                  umgesetzt.
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                  Mehr erfahren
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </Link>
            <Link href="/ki-agenten/e-commerce" className="group">
              <Card hoverable className="flex h-full flex-col">
                <Heading level={3} size={4} className="group-hover:text-primary-600">
                  KI-Agenten für Ihren Online-Shop
                </Heading>
                <p className="mt-3 flex-1 text-sm text-slate-600">
                  Produktfragen, Bestellstatus und Support automatisch
                  beantworten – für Shopify- und WooCommerce-Shops.
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                  Mehr erfahren
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </Link>
          </div>
        </Container>
      </Section>
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

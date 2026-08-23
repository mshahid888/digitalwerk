import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Leadgenerierung",
    description:
      "Leadgenerierung Agentur mit KI-Agenten: automatisierte Erstansprache, Qualifizierung und Übergabe an Ihr Vertriebsteam – für planbar mehr Anfragen.",
  },
  "/loesungen/leadgenerierung",
  {
    hreflang: {
      de: "/loesungen/leadgenerierung",
      en: "/en/solutions/lead-generation",
    },
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "Leadgenerierung",
    title: "Leadgenerierung Agentur mit KI-Agenten – planbar mehr Anfragen",
    description:
      "KI-Agenten übernehmen die Erstansprache, qualifizieren Interessenten automatisch und sorgen für einen stetigen Strom an echten Anfragen – rund um die Uhr, ohne zusätzliches Personal.",
  },
  problem: {
    title: "Unregelmäßige Anfragen, hoher Aufwand",
    intro:
      "Viele Unternehmen kennen das Problem: mal zu wenige Anfragen, mal zu viele unqualifizierte Leads, die Zeit kosten statt Umsatz zu bringen.",
    points: [
      {
        title: "Leads bleiben unbearbeitet",
        description:
          "Ohne automatisierte Erstansprache gehen Anfragen unter oder werden zu spät beantwortet.",
      },
      {
        title: "Viel manueller Aufwand",
        description: "Qualifizierung von Leads bindet wertvolle Zeit Ihres Teams.",
      },
      {
        title: "Kein planbarer Zufluss",
        description: "Ohne System schwankt die Zahl neuer Anfragen unvorhersehbar.",
      },
    ],
  },
  solution: {
    title: "KI-gestützte Leadgenerierung",
    description:
      "Wir kombinieren gezielte Kampagnen mit KI-Agenten, die Interessenten automatisch ansprechen, qualifizieren und an Ihr Team übergeben – für einen planbaren, automatisierten Anfragenfluss ohne zusätzlichen manuellen Aufwand.",
    points: [
      "Automatisierte Erstansprache durch KI-Agenten",
      "Qualifizierung von Leads nach Ihren Kriterien",
      "Nahtlose Übergabe an Ihr Vertriebsteam",
      "Rund um die Uhr erreichbar – auch außerhalb der Geschäftszeiten",
    ],
  },
  benefits: {
    title: "Was KI-gestützte Leadgenerierung bewirkt",
    items: [
      {
        title: "Planbarer Anfragenfluss",
        description:
          "Ein System statt Zufall – Sie wissen, wie viele qualifizierte Anfragen Sie erwarten können.",
      },
      {
        title: "Weniger manueller Aufwand",
        description:
          "KI-Agenten übernehmen die Vorqualifizierung, Ihr Team konzentriert sich auf den Abschluss.",
      },
      {
        title: "Schnellere Reaktionszeit",
        description: "Anfragen werden sofort beantwortet – auch nachts und am Wochenende.",
      },
      {
        title: "Höhere Abschlussquote",
        description: "Vorqualifizierte Leads sind wertvoller als unqualifizierte Masse.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Unsere Leadgenerierung im Überblick.",
    items: [
      "Analyse Ihrer Zielgruppe und Kanäle",
      "Einrichtung eines KI-Agenten für Erstansprache und Qualifizierung",
      "Anbindung an Ihren Vertriebsprozess",
      "Monatliches Reporting zu Anfragen und Qualität",
      "Laufende Optimierung der Qualifizierungskriterien",
    ],
  },
  process: {
    title: "So gehen wir vor",
    steps: [
      {
        title: "Analyse",
        description:
          "Wir prüfen Ihre Zielgruppe, bestehenden Kanäle und Qualifizierungskriterien.",
      },
      {
        title: "Einrichtung",
        description:
          "Wir konfigurieren Ihren KI-Agenten für Erstansprache und Qualifizierung.",
      },
      {
        title: "Umsetzung",
        description:
          "Der KI-Agent übernimmt die Ansprache und übergibt qualifizierte Anfragen an Ihr Team.",
      },
      {
        title: "Monitoring & Optimierung",
        description:
          "Wir beobachten Anfragequalität und -menge und passen die Kriterien laufend an.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "KI-Agenten statt Massenware",
        description:
          "Wir setzen auf individuell konfigurierte KI-Agenten statt generischer Formulare – für echte Qualifizierung statt Datensammlung.",
      },
      {
        title: "Ehrlich statt versprechend",
        description:
          "Wir versprechen keine fixe Lead-Zahl, sondern ein System, das nachweislich mehr qualifizierte Anfragen bringt.",
      },
      {
        title: "Ein System, nicht nur eine Kampagne",
        description:
          "Leadgenerierung ist bei uns dauerhaft eingerichtet, nicht nur eine einmalige Aktion.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zur Leadgenerierung",
    items: [
      {
        question: "Was ist der Unterschied zwischen Leadgenerierung und klassischer Werbung?",
        answer:
          "Klassische Werbeanzeigen erzeugen Sichtbarkeit und Klicks. Leadgenerierung geht einen Schritt weiter: Interessenten werden aktiv angesprochen, qualifiziert und als konkrete Anfrage an Ihr Team übergeben.",
      },
      {
        question: "Wie funktioniert die KI-gestützte Qualifizierung genau?",
        answer:
          "Ein KI-Agent führt mit Interessenten ein automatisiertes Erstgespräch, stellt gezielte Fragen nach Ihren Kriterien und übergibt nur die Anfragen an Ihr Team, die tatsächlich zu Ihrem Angebot passen.",
      },
      {
        question: "Eignet sich Leadgenerierung auch für B2B?",
        answer:
          "Ja – gerade im B2B-Bereich, wo Entscheidungsprozesse länger dauern, hilft eine systematische Vorqualifizierung dabei, Vertriebszeit auf die vielversprechendsten Anfragen zu konzentrieren.",
      },
      {
        question:
          "Ist Leadgenerierung auch einzeln buchbar, oder nur mit DigitalWerk Komplett?",
        answer:
          "Leadgenerierung ist eigenständig buchbar. In Kombination mit KI-Agenten und SEO lässt sich der Effekt oft weiter steigern.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit für planbare Anfragen?",
    title: "Starten Sie mit einer kostenlosen Leadgenerierungs-Einschätzung",
    description:
      "Im unverbindlichen Erstgespräch zeigen wir Ihnen, wie KI-gestützte Leadgenerierung für Ihr Unternehmen aussehen könnte.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}

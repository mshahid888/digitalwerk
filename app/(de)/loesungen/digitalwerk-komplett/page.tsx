import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "DigitalWerk Komplett",
    description:
      "Website, SEO, Google-Profil, Content und KI-Automatisierung aus einer Hand – mit einem festen Ansprechpartner statt fünf Dienstleistern.",
  },
  "/loesungen/digitalwerk-komplett",
  { hreflang: { de: "/loesungen/digitalwerk-komplett", en: "/en/solutions/complete" } }
);

const content: ServicePageContent = {
  hero: {
    badge: "DigitalWerk Komplett",
    title: "Ihre komplette digitale Abteilung – aus einer Hand",
    description:
      "Website, SEO, Google-Profil, Content, KI-Automatisierung und laufende Betreuung – gebündelt in einer Partnerschaft, die sich um Ihr digitales Wachstum kümmert, während Sie sich um Ihr Kerngeschäft kümmern.",
  },
  problem: {
    title: "Digitales Wachstum braucht mehr als eine Website",
    intro:
      "Die meisten Unternehmen scheitern nicht an einzelnen Maßnahmen, sondern am Fehlen einer zusammenhängenden Strategie.",
    points: [
      {
        title: "Zu viele Ansprechpartner",
        description:
          "Website-Agentur, SEO-Freelancer, Social-Media-Manager – nichts ist aufeinander abgestimmt.",
      },
      {
        title: "Keine Zeit für Koordination",
        description:
          "Zwischen Tagesgeschäft und mehreren Dienstleistern bleibt die digitale Strategie auf der Strecke.",
      },
      {
        title: "Unklare Ergebnisse",
        description:
          "Ohne zusammenhängendes Reporting ist schwer erkennbar, was tatsächlich wirkt.",
      },
    ],
  },
  solution: {
    title: "Eine Partnerschaft statt einzelner Projekte",
    description:
      "DigitalWerk Komplett bündelt alle relevanten digitalen Leistungen in einer Betreuung – mit einer Strategie, einem Ansprechpartner und einem klaren Ziel: mehr Kunden, mehr Sichtbarkeit, mehr Wachstum.",
    points: [
      "Eine Strategie für Website, SEO, Content und Automatisierung",
      "Ein Ansprechpartner für alle Leistungen",
      "Ein Reporting statt fünf unterschiedlicher Berichte",
      "Ein monatlicher Rhythmus aus Umsetzung und Optimierung",
    ],
  },
  benefits: {
    title: "Ihre Vorteile mit DigitalWerk Komplett",
    items: [
      {
        title: "Ein fester Ansprechpartner",
        description:
          "Keine Koordination zwischen mehreren Dienstleistern nötig.",
      },
      {
        title: "Abgestimmte Maßnahmen",
        description:
          "Website, SEO, Content und Werbung greifen ineinander statt isoliert zu wirken.",
      },
      {
        title: "Transparentes Reporting",
        description:
          "Sie sehen jederzeit, was funktioniert – nachvollziehbar und verständlich.",
      },
      {
        title: "Planbare Kosten",
        description:
          "Eine monatliche Partnerschaft statt wiederkehrender Einzelprojekte und Verhandlungen.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Alle Leistungen, die Sie für digitales Wachstum brauchen.",
    items: [
      "Website Development",
      "Local SEO",
      "Google Unternehmensprofil-Optimierung",
      "Content Creation",
      "KI-Automatisierung",
      "Analytics & Reporting",
      "Monatliche Optimierung",
      "Technische Wartung",
      "Laufender Support",
    ],
  },
  process: {
    title: "So starten wir Ihre Partnerschaft",
    steps: [
      {
        title: "Kennenlernen & Analyse",
        description:
          "Im kostenlosen Erstgespräch analysieren wir Ihren aktuellen digitalen Auftritt.",
      },
      {
        title: "Strategie & Onboarding",
        description:
          "Sie erhalten einen klaren Fahrplan mit definierten Zielen.",
      },
      {
        title: "Umsetzung",
        description:
          "Website, SEO, Content und Automatisierung werden strukturiert aufgebaut.",
      },
      {
        title: "Laufende Betreuung",
        description:
          "Monatliche Optimierung, Reporting und kontinuierliche Weiterentwicklung.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Ergebnisorientiert",
        description:
          "Wir verkaufen keine Leistungen um ihrer selbst willen, sondern Ergebnisse: mehr Kunden, mehr Sichtbarkeit, mehr Wachstum.",
      },
      {
        title: "Transparent & ehrlich",
        description:
          "Klare Prozesse, nachvollziehbare Ergebnisse, keine versteckten Kosten.",
      },
      {
        title: "Ein echter Partner",
        description:
          "Wir denken langfristig – als Teil Ihres Unternehmens, nicht als externer Dienstleister.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu DigitalWerk Komplett",
    items: [
      {
        question: "Für wen eignet sich DigitalWerk Komplett?",
        answer:
          "Für Unternehmen, die digitales Wachstum ernsthaft angehen möchten, aber keine Zeit oder Kapazität haben, mehrere Dienstleister zu koordinieren.",
      },
      {
        question: "Was kostet DigitalWerk Komplett?",
        answer:
          "Die Kosten richten sich nach Umfang und Zielen Ihres Unternehmens. Im kostenlosen Erstgespräch erhalten Sie ein transparentes Angebot.",
      },
      {
        question: "Kann ich später zu einzelnen Leistungen wechseln?",
        answer:
          "Ja, jede Leistung ist auch einzeln buchbar – für die meisten Unternehmen ist die Komplettlösung jedoch die wirtschaftlichste Wahl.",
      },
      {
        question: "Wie schnell sehe ich erste Ergebnisse?",
        answer:
          "Erste Verbesserungen wie ein optimiertes Google-Profil sind oft innerhalb weniger Wochen sichtbar, nachhaltiges SEO-Wachstum braucht mehrere Monate.",
      },
      {
        question: "Muss ich mich technisch auskennen?",
        answer: "Nein. Wir übernehmen die technische Umsetzung vollständig.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit für Ihre digitale Abteilung?",
    title: "Starten Sie Ihre Partnerschaft mit DigitalWerk",
    description:
      "Vereinbaren Sie ein kostenloses, unverbindliches Erstgespräch und erfahren Sie, wie DigitalWerk Komplett Ihrem Unternehmen zu mehr Wachstum verhilft.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}

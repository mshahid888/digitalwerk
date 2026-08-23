import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Digital Marketing",
    description:
      "Digital Marketing Agentur für Unternehmen in Ansbach, Mittelfranken und ganz Bayern: SEO, Werbeanzeigen und Content als abgestimmte Strategie – ergänzt durch KI-Agenten.",
  },
  "/loesungen/digital-marketing",
  {
    hreflang: {
      de: "/loesungen/digital-marketing",
      en: "/en/solutions/digital-marketing",
    },
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "Digital Marketing",
    title: "Digital Marketing Agentur für mehr Kunden – abgestimmt statt zusammengewürfelt",
    description:
      "Eine Digital Marketing Agentur, die SEO, Werbeanzeigen, Content und KI-Automatisierung als ein Ganzes denkt – nicht als lose Einzelmaßnahmen. So wissen Sie jederzeit, was wirkt und warum.",
  },
  problem: {
    title: "Viele Kanäle, kein roter Faden",
    intro:
      "Viele Unternehmen investieren in Werbeanzeigen, SEO oder Social Media – aber ohne gemeinsame Strategie verpufft ein großer Teil des Budgets.",
    points: [
      {
        title: "Maßnahmen ohne Zusammenhang",
        description:
          "SEO, Ads und Content laufen nebeneinander statt zusammen – Streuverluste sind die Folge.",
      },
      {
        title: "Unklar, was wirklich wirkt",
        description:
          "Ohne saubere Erfolgsmessung bleibt unklar, welche Maßnahme tatsächlich neue Kunden bringt.",
      },
      {
        title: "Zu viele Ansprechpartner",
        description:
          "Verschiedene Dienstleister für verschiedene Kanäle erschweren eine einheitliche Strategie.",
      },
    ],
  },
  solution: {
    title: "Digital Marketing aus einer Hand",
    description:
      "Wir entwickeln eine abgestimmte Digital-Marketing-Strategie für Ihr Unternehmen – von SEO über Werbeanzeigen bis Content, ergänzt durch KI-Agenten, die Anfragen automatisch bearbeiten. Sie erhalten einen Ansprechpartner statt fünf.",
    points: [
      "Kanalübergreifende Strategie statt Einzelmaßnahmen",
      "Transparentes Reporting, das echte Ergebnisse zeigt",
      "KI-Agenten für automatisierte Anfragenbearbeitung",
      "Ein Ansprechpartner für alle digitalen Maßnahmen",
    ],
  },
  benefits: {
    title: "Was eine abgestimmte Digital-Marketing-Strategie bewirkt",
    items: [
      {
        title: "Mehr qualifizierte Anfragen",
        description:
          "Kanäle, die zusammenspielen, bringen mehr echte Kundenanfragen statt bloßer Klicks.",
      },
      {
        title: "Klare Erfolgsmessung",
        description: "Sie sehen genau, welche Maßnahme welches Ergebnis bringt.",
      },
      {
        title: "Weniger Streuverluste",
        description: "Budget fließt dorthin, wo es nachweislich wirkt.",
      },
      {
        title: "Effizienz durch KI-Agenten",
        description:
          "Automatisierte Anfragenbearbeitung entlastet Ihr Team, ohne Qualität zu verlieren.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Unsere Digital-Marketing-Betreuung im Überblick.",
    items: [
      "Analyse der aktuellen digitalen Präsenz",
      "Kanalübergreifende Strategie",
      "Koordinierte Umsetzung von SEO, Ads und Content",
      "Monatliches Reporting",
      "Laufende Optimierung",
      "Beratung zum Einsatz von KI-Agenten",
    ],
  },
  process: {
    title: "So gehen wir vor",
    steps: [
      {
        title: "Analyse",
        description:
          "Wir prüfen Ihre aktuelle digitale Präsenz und identifizieren die größten Potenziale.",
      },
      {
        title: "Strategie",
        description:
          "Sie erhalten eine kanalübergreifende Strategie mit klaren Prioritäten.",
      },
      {
        title: "Umsetzung",
        description:
          "Wir setzen SEO, Werbeanzeigen und Content koordiniert um – inklusive KI-Agenten, wo sinnvoll.",
      },
      {
        title: "Monitoring & Optimierung",
        description:
          "Wir beobachten die Ergebnisse und passen die Strategie laufend an.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Ehrlich statt versprechend",
        description:
          "Wir versprechen keine Wunder – wir zeigen, was realistisch möglich ist.",
      },
      {
        title: "Ein Ansprechpartner",
        description:
          "Statt fünf Dienstleister zu koordinieren, haben Sie einen festen Ansprechpartner bei DigitalWerk.",
      },
      {
        title: "Regional verwurzelt",
        description:
          "Mit Sitz in Ansbach kennen wir die Herausforderungen von Unternehmen in Mittelfranken und ganz Bayern.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu Digital Marketing",
    items: [
      {
        question: "Was ist der Unterschied zwischen Digital Marketing und Online Marketing?",
        answer:
          "In der Praxis werden beide Begriffe meist synonym verwendet – beide meinen die Vermarktung über digitale Kanäle wie Google, Social Media und E-Mail. Wir sprechen von Digital Marketing, wenn wir die Gesamtstrategie über mehrere Kanäle meinen.",
      },
      {
        question:
          "Ist Digital Marketing auch einzeln buchbar, oder nur mit DigitalWerk Komplett?",
        answer:
          "Digital Marketing ist eigenständig buchbar. Für Unternehmen, die zusätzlich Website und KI-Automatisierung benötigen, ist DigitalWerk Komplett oft die wirtschaftlichere Wahl.",
      },
      {
        question: "Betreuen Sie auch Unternehmen außerhalb von Ansbach?",
        answer:
          "Ja. Unser Sitz ist in Ansbach, wir betreuen aber Unternehmen in ganz Mittelfranken, Bayern und darüber hinaus – digitale Zusammenarbeit funktioniert unabhängig vom Standort.",
      },
      {
        question: "Wie schnell sehe ich erste Ergebnisse?",
        answer:
          "Das hängt von den gewählten Kanälen ab: Werbeanzeigen liefern oft innerhalb weniger Tage erste Daten, SEO und Content brauchen mehrere Monate für nachhaltige Ergebnisse.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit für eine abgestimmte Strategie?",
    title: "Starten Sie mit einer kostenlosen Digital-Marketing-Einschätzung",
    description:
      "Im unverbindlichen Erstgespräch analysieren wir Ihre aktuelle digitale Präsenz und zeigen konkrete Ansatzpunkte.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata({
  title: "Google Ads",
  description:
    "Google Ads-Kampagnen für Kunden, die bereits aktiv nach Ihrer Leistung suchen – ehrlich beraten, transparent abgerechnet, klar reportet.",
});

const content: ServicePageContent = {
  hero: {
    badge: "Google Ads",
    title: "Erreichen Sie Kunden genau dann, wenn sie suchen",
    description:
      "Google Ads zeigt Ihr Unternehmen Menschen, die aktiv nach Ihrer Leistung suchen – nicht erst, wenn sie zufällig scrollen. Das macht Google Ads zu einem der direktesten Wege zu neuen Anfragen.",
  },
  problem: {
    title: "Sichtbarkeit, die zu langsam kommt",
    intro:
      "Lokales SEO wirkt langfristig – aber manchmal brauchen Sie schneller Ergebnisse.",
    points: [
      {
        title: "Lange Wartezeit bis SEO wirkt",
        description:
          "Bis organisches Wachstum spürbar wird, vergehen oft Monate.",
      },
      {
        title: "Unsichtbar bei dringenden Suchanfragen",
        description:
          "Kunden mit akutem Bedarf finden zuerst, wer bei Google Ads sichtbar ist.",
      },
      {
        title: "Ungenutztes Potenzial bestehender Nachfrage",
        description:
          "Menschen suchen bereits nach Ihrer Leistung – ohne Anzeigen verpassen Sie diese Anfragen.",
      },
    ],
  },
  solution: {
    title: "Sichtbarkeit, sobald jemand sucht",
    description:
      "Wir schalten Google-Ads-Kampagnen, die genau dann erscheinen, wenn potenzielle Kunden aktiv nach Ihrer Leistung suchen – zielgerichtet nach Region, Suchbegriff und Budget.",
    points: [
      "Kampagnen für lokale und überregionale Sichtbarkeit",
      "Zielgerichtete Suchbegriffe statt Streuverlust",
      "Laufende Optimierung des Budgets",
      "Klares Reporting zu Anfragen und Kosten",
    ],
  },
  benefits: {
    title: "Was Google Ads für Ihr Unternehmen bewirkt",
    items: [
      {
        title: "Schnelle Sichtbarkeit",
        description:
          "Im Gegensatz zu SEO wirken Google-Ads-Kampagnen ab dem Start.",
      },
      {
        title: "Planbares Budget",
        description:
          "Sie bestimmen, wie viel Sie täglich investieren möchten.",
      },
      {
        title: "Messbare Ergebnisse",
        description: "Jeder Klick und jede Anfrage ist nachvollziehbar.",
      },
      {
        title: "Gezielte Reichweite",
        description: "Ihre Anzeige erscheint nur bei relevanten Suchanfragen.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Vollständige Betreuung Ihrer Google-Ads-Kampagnen.",
    items: [
      "Kampagnenstrategie und Keyword-Recherche",
      "Erstellung und Einrichtung der Anzeigen",
      "Zielgruppen- und Budgetsteuerung",
      "Laufende Optimierung",
      "Conversion-Tracking",
      "Monatliches Reporting",
    ],
  },
  process: {
    title: "So starten Ihre Kampagnen",
    steps: [
      {
        title: "Analyse",
        description:
          "Wir prüfen Ihr Angebot, Ihre Zielgruppe und den Wettbewerb.",
      },
      {
        title: "Strategie",
        description:
          "Wir definieren Kampagnenstruktur, Keywords und Budget.",
      },
      {
        title: "Umsetzung",
        description: "Wir richten die Kampagnen ein und schalten sie live.",
      },
      {
        title: "Optimierung",
        description:
          "Wir werten Ergebnisse aus und verbessern die Kampagnen laufend.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Ehrliche Erwartungen",
        description:
          "Wir versprechen keine unrealistischen Ergebnisse, sondern arbeiten mit nachvollziehbaren Kennzahlen.",
      },
      {
        title: "Budget im Blick",
        description:
          "Wir behandeln Ihr Werbebudget so sorgfältig wie unser eigenes.",
      },
      {
        title: "Klares Reporting",
        description:
          "Sie sehen jederzeit, wohin Ihr Budget fließt und was es bewirkt.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu Google Ads",
    items: [
      {
        question: "Können Sie mir einen bestimmten ROI garantieren?",
        answer:
          "Nein. Ergebnisse hängen von Branche, Wettbewerb und Budget ab. Wir arbeiten mit klaren Kennzahlen und transparentem Reporting, statt unrealistische Versprechen zu machen.",
      },
      {
        question: "Wie viel Budget brauche ich für Google Ads?",
        answer:
          "Das hängt von Ihrer Branche und Ihren Zielen ab. Im kostenlosen Erstgespräch empfehlen wir ein realistisches Startbudget.",
      },
      {
        question: "Wie schnell sehe ich Ergebnisse?",
        answer:
          "Erste Daten liegen meist innerhalb weniger Tage vor, belastbare Ergebnisse nach zwei bis vier Wochen Optimierung.",
      },
      {
        question: "Was ist der Unterschied zu SEO?",
        answer:
          "Google Ads bringt sofortige, aber kostenpflichtige Sichtbarkeit. SEO baut organische Sichtbarkeit auf, die auch ohne laufendes Budget bestehen bleibt.",
      },
      {
        question: "Kann ich das Budget jederzeit anpassen?",
        answer:
          "Ja, das Budget lässt sich jederzeit erhöhen, senken oder pausieren.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit für mehr sichtbare Nachfrage?",
    title: "Starten Sie Ihre erste Google-Ads-Kampagne",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie, welches Potenzial in Google Ads für Ihr Unternehmen steckt.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}

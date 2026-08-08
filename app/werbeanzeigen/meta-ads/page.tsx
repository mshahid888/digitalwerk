import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Meta Ads",
    description:
      "Facebook- und Instagram-Kampagnen, die neue Zielgruppen erreichen, statt nur bestehende Nachfrage zu bedienen – ehrlich beraten, kreativ umgesetzt.",
  },
  "/werbeanzeigen/meta-ads"
);

const content: ServicePageContent = {
  hero: {
    badge: "Meta Ads",
    title: "Zeigen Sie sich Kunden, bevor sie aktiv danach suchen",
    description:
      "Meta Ads erreicht Menschen auf Facebook und Instagram genau nach Interessen, Region und Verhalten – ideal, um neue Zielgruppen auf Ihr Unternehmen aufmerksam zu machen, bevor der Bedarf akut wird.",
  },
  problem: {
    title: "Gute Angebote, die niemand sieht",
    intro:
      "Viele Unternehmen verlassen sich allein auf Kunden, die bereits aktiv suchen – und verpassen alle anderen.",
    points: [
      {
        title: "Nur bestehende Nachfrage wird erreicht",
        description:
          "Wer nicht aktiv sucht, erfährt nichts von Ihrem Angebot.",
      },
      {
        title: "Keine visuelle Präsenz",
        description:
          "Ohne Anzeigen bleibt Ihr Unternehmen für neue Zielgruppen unsichtbar.",
      },
      {
        title: "Verpasste Wiederansprache",
        description:
          "Interessenten, die einmal auf Ihrer Website waren, gehen ohne erneuten Kontakt verloren.",
      },
    ],
  },
  solution: {
    title: "Sichtbarkeit dort, wo Ihre Zielgruppe Zeit verbringt",
    description:
      "Wir erstellen Meta-Ads-Kampagnen, die Ihre Zielgruppe gezielt nach Interessen, Standort und Verhalten ansprechen – mit Bildern und Videos, die im Feed auffallen.",
    points: [
      "Zielgruppenansprache nach Interessen und Region",
      "Kampagnen für Facebook und Instagram",
      "Wiederansprache von Website-Besuchern",
      "Kreative Anzeigenformate, die auffallen",
    ],
  },
  benefits: {
    title: "Was Meta Ads für Ihr Unternehmen bewirkt",
    items: [
      {
        title: "Neue Zielgruppen",
        description:
          "Sie erreichen Menschen, die Sie sonst nie gefunden hätten.",
      },
      {
        title: "Höhere Markenbekanntheit",
        description:
          "Regelmäßige Sichtbarkeit im Feed stärkt Wiedererkennung.",
      },
      {
        title: "Gezielte Wiederansprache",
        description:
          "Interessenten, die schon Kontakt hatten, werden erneut erreicht.",
      },
      {
        title: "Visuelle Wirkung",
        description:
          "Bilder und Videos überzeugen oft stärker als reiner Text.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Vollständige Betreuung Ihrer Meta-Ads-Kampagnen.",
    items: [
      "Zielgruppenstrategie",
      "Erstellung von Anzeigen und Creatives",
      "Kampagnen für Facebook und Instagram",
      "Retargeting-Kampagnen",
      "Laufende Optimierung",
      "Monatliches Reporting",
    ],
  },
  process: {
    title: "So starten Ihre Kampagnen",
    steps: [
      {
        title: "Analyse",
        description: "Wir definieren Ihre Zielgruppe und Kampagnenziele.",
      },
      {
        title: "Kreation",
        description:
          "Wir entwickeln Anzeigen, die auffallen und überzeugen.",
      },
      {
        title: "Umsetzung",
        description: "Wir richten die Kampagnen ein und schalten sie live.",
      },
      {
        title: "Optimierung",
        description: "Wir passen Zielgruppen und Anzeigen laufend an.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Kreativ und zielgerichtet",
        description:
          "Wir verbinden auffällige Gestaltung mit präziser Zielgruppenansprache.",
      },
      {
        title: "Ehrliche Erwartungen",
        description:
          "Wir versprechen keine garantierten Ergebnisse, sondern arbeiten transparent mit echten Kennzahlen.",
      },
      {
        title: "Laufende Betreuung",
        description:
          "Wir beobachten und optimieren Ihre Kampagnen kontinuierlich.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu Meta Ads",
    items: [
      {
        question: "Können Sie mir einen bestimmten ROI garantieren?",
        answer:
          "Nein. Ergebnisse hängen von Branche, Zielgruppe und Budget ab. Wir arbeiten mit klaren Kennzahlen statt Versprechen.",
      },
      {
        question: "Brauche ich eigene Fotos oder Videos?",
        answer:
          "Nicht zwingend – wir können passende Creatives für Sie erstellen, eigenes Bildmaterial ist aber immer willkommen.",
      },
      {
        question: "Ist Meta Ads auch für lokale Unternehmen sinnvoll?",
        answer:
          "Ja, Kampagnen lassen sich sehr präzise auf Ihre Region eingrenzen.",
      },
      {
        question: "Was ist der Unterschied zu Google Ads?",
        answer:
          "Google Ads erreicht Menschen mit akutem Suchbedarf, Meta Ads erreicht Menschen anhand von Interessen – oft bevor der Bedarf überhaupt entsteht.",
      },
      {
        question: "Wie schnell sehe ich Ergebnisse?",
        answer:
          "Erste Daten liegen meist nach wenigen Tagen vor, aussagekräftige Ergebnisse nach zwei bis vier Wochen.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit, neue Zielgruppen zu erreichen?",
    title: "Starten Sie Ihre erste Meta-Ads-Kampagne",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie, wie Meta Ads Ihr Unternehmen sichtbarer macht.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}

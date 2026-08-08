import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "TikTok Ads",
    description:
      "Kreative Kurzvideo-Kampagnen für ein großes, aktives Publikum – ehrlich beraten, ob TikTok wirklich zu Ihrem Unternehmen passt.",
  },
  "/werbeanzeigen/tiktok-ads"
);

const content: ServicePageContent = {
  hero: {
    badge: "TikTok Ads",
    title: "Erreichen Sie eine Zielgruppe, die klassische Werbung kaum noch sieht",
    description:
      "TikTok Ads erreicht ein großes, aktives Publikum mit kurzen, kreativen Videos – besonders wirkungsvoll für Unternehmen mit visuell ansprechenden Produkten oder Leistungen.",
  },
  problem: {
    title: "Eine Zielgruppe, die anders erreicht werden will",
    intro:
      "Klassische Werbeformate erreichen ein jüngeres, mobiles Publikum immer seltener.",
    points: [
      {
        title: "Sinkende Wirkung klassischer Werbung",
        description:
          "Viele jüngere Zielgruppen nehmen klassische Anzeigenformate kaum noch wahr.",
      },
      {
        title: "Fehlende Präsenz auf TikTok",
        description:
          "Ohne eigene Präsenz bleibt ein wachsender Kanal komplett ungenutzt.",
      },
      {
        title: "Unklar, wie man auf TikTok wirbt",
        description:
          "Die Plattform funktioniert anders als klassische Werbekanäle – ohne Erfahrung schnell frustrierend.",
      },
    ],
  },
  solution: {
    title: "Kreative Kurzvideos, die auffallen",
    description:
      "Wir entwickeln TikTok-Ads-Kampagnen mit kurzen, authentischen Videos, die zur Plattform passen – statt klassischer Werbung, die dort als Fremdkörper wirkt.",
    points: [
      "Kampagnenstrategie für Ihre Zielgruppe",
      "Kurzvideo-Content, der zur Plattform passt",
      "Ausspielung nach Interessen, Altersgruppe und Region",
      "Laufende Optimierung der Kampagnen",
    ],
  },
  benefits: {
    title: "Was TikTok Ads für Ihr Unternehmen bewirkt",
    items: [
      {
        title: "Zugang zu einem wachsenden Publikum",
        description:
          "Sie erreichen Zielgruppen, die auf anderen Kanälen kaum noch aktiv sind.",
      },
      {
        title: "Hohe Aufmerksamkeit",
        description:
          "Kurzvideos erzeugen oft mehr Interaktion als klassische Anzeigen.",
      },
      {
        title: "Authentische Wirkung",
        description:
          "Content im TikTok-Stil wirkt weniger wie klassische Werbung.",
      },
      {
        title: "Neue Markenbekanntheit",
        description:
          "Eine Plattform, auf der viele Unternehmen noch kaum präsent sind.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Vollständige Betreuung Ihrer TikTok-Ads-Kampagnen.",
    items: [
      "Zielgruppenstrategie",
      "Konzept und Produktion kurzer Videoinhalte",
      "Kampagnen-Einrichtung",
      "Laufende Optimierung",
      "Monatliches Reporting",
    ],
  },
  process: {
    title: "So starten Ihre Kampagnen",
    steps: [
      {
        title: "Analyse",
        description: "Wir prüfen, ob und wie TikTok zu Ihrem Unternehmen passt.",
      },
      {
        title: "Content-Konzept",
        description:
          "Wir entwickeln Videoideen, die zur Plattform und Ihrer Marke passen.",
      },
      {
        title: "Umsetzung",
        description:
          "Wir richten die Kampagnen ein und veröffentlichen die ersten Videos.",
      },
      {
        title: "Optimierung",
        description:
          "Wir passen Content und Zielgruppen anhand der Ergebnisse an.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Plattformgerechter Content",
        description:
          "Wir erstellen Inhalte, die zu TikTok passen, statt klassische Werbung einfach zu übertragen.",
      },
      {
        title: "Ehrliche Einschätzung",
        description:
          "Wir empfehlen TikTok Ads nur, wenn sie wirklich zu Ihrem Unternehmen passen.",
      },
      {
        title: "Laufende Betreuung",
        description:
          "Wir passen Content und Zielgruppen laufend an aktuelle Trends auf der Plattform an.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu TikTok Ads",
    items: [
      {
        question: "Ist TikTok Ads für jedes Unternehmen geeignet?",
        answer:
          "Nein, nicht jede Branche profitiert gleichermaßen. Im kostenlosen Erstgespräch prüfen wir ehrlich, ob TikTok zu Ihrem Unternehmen passt.",
      },
      {
        question: "Können Sie mir einen bestimmten ROI garantieren?",
        answer:
          "Nein. Ergebnisse hängen von Branche, Content und Budget ab. Wir arbeiten mit klaren Kennzahlen statt Versprechen.",
      },
      {
        question: "Brauche ich professionelle Videos?",
        answer:
          "Nein – auf TikTok wirken oft einfache, authentische Videos besser als aufwendige Werbeproduktionen.",
      },
      {
        question: "Wie unterscheidet sich TikTok Ads von Meta Ads?",
        answer:
          "TikTok setzt stärker auf kurze, unterhaltsame Videoinhalte und erreicht ein tendenziell jüngeres Publikum.",
      },
      {
        question: "Wie schnell sehe ich Ergebnisse?",
        answer:
          "Erste Daten liegen meist nach wenigen Tagen vor. Da der Algorithmus Zeit braucht, um die passende Zielgruppe zu finden, sind belastbare Aussagen oft erst nach zwei bis drei Wochen möglich.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit für eine neue Zielgruppe?",
    title: "Starten Sie Ihre erste TikTok-Ads-Kampagne",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie, ob TikTok Ads zu Ihrem Unternehmen passt.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}

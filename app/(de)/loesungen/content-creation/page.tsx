import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Content Creation",
    description:
      "Professionelle Website- und SEO-Inhalte, die überzeugen und bei Google ranken – verständlich geschrieben, individuell auf Ihre Branche zugeschnitten.",
  },
  "/loesungen/content-creation",
  { hreflang: { de: "/loesungen/content-creation", en: "/en/solutions/content-creation" } }
);

const content: ServicePageContent = {
  hero: {
    badge: "Content Creation",
    title: "Worte, die überzeugen – und gefunden werden",
    description:
      "Die beste Website nützt wenig, wenn die Inhalte nicht überzeugen. Wir schreiben Texte, die Ihre Leistungen verständlich erklären, Vertrauen aufbauen und gleichzeitig bei Google gut ankommen.",
  },
  problem: {
    title: "Gute Leistung, schlecht erklärt",
    intro:
      "Viele Unternehmen bieten hervorragende Arbeit – ihre Website erklärt das nur nicht überzeugend genug.",
    points: [
      {
        title: "Generische Texte",
        description:
          "Austauschbare Formulierungen wirken wie jede andere Agentur-Website.",
      },
      {
        title: "Zu technisch oder zu vage",
        description:
          "Kunden verstehen nicht auf den ersten Blick, was Sie eigentlich anbieten.",
      },
      {
        title: "Fehlende Inhalte für Google",
        description:
          "Ohne relevante Inhalte hat Google wenig, worüber es Sie finden könnte.",
      },
    ],
  },
  solution: {
    title: "Inhalte mit doppeltem Zweck",
    description:
      "Wir schreiben Texte, die zwei Dinge gleichzeitig leisten: Menschen überzeugen und Google zeigen, dass Ihre Seite relevant ist. Klar, verständlich und auf Ihre Zielgruppe zugeschnitten.",
    points: [
      "Verständliche Sprache statt Fachjargon",
      "Inhalte, die auf Ihre Zielgruppe zugeschnitten sind",
      "SEO-relevante Struktur und Keywords",
      "Konsistente Tonalität über alle Seiten hinweg",
    ],
  },
  benefits: {
    title: "Was gute Inhalte bewirken",
    items: [
      {
        title: "Höhere Verweildauer",
        description:
          "Überzeugende Texte halten Besucher länger auf Ihrer Website.",
      },
      {
        title: "Mehr Vertrauen",
        description:
          "Klare, ehrliche Sprache wirkt glaubwürdiger als leere Werbefloskeln.",
      },
      {
        title: "Bessere Sichtbarkeit bei Google",
        description:
          "Relevante Inhalte sind eine Grundvoraussetzung für gutes Ranking.",
      },
      {
        title: "Einheitlicher Markenauftritt",
        description:
          "Eine konsistente Tonalität stärkt Wiedererkennung und Vertrauen.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Von der Startseite bis zum Blogartikel.",
    items: [
      "Texte für Website-Seiten",
      "SEO-optimierte Inhalte",
      "Leistungsbeschreibungen und Angebotstexte",
      "Blogartikel und Ratgebertexte",
      "Content-Strategie für Ihre Branche",
      "Tonalitäts- und Stilrichtlinien",
      "Regelmäßige neue Inhalte",
    ],
  },
  process: {
    title: "So entstehen Ihre Inhalte",
    steps: [
      {
        title: "Kennenlernen",
        description:
          "Wir verstehen Ihr Angebot, Ihre Zielgruppe und Ihre Tonalität.",
      },
      {
        title: "Recherche",
        description:
          "Wir recherchieren relevante Themen und Suchbegriffe für Ihre Branche.",
      },
      {
        title: "Texterstellung",
        description:
          "Wir schreiben Inhalte, die überzeugen und bei Google ankommen.",
      },
      {
        title: "Abstimmung & Veröffentlichung",
        description:
          "Sie geben Feedback, wir passen an – bis alles passt.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Kein Buzzword-Bingo",
        description: "Wir schreiben verständlich statt austauschbar.",
      },
      {
        title: "SEO und Sprache aus einer Hand",
        description:
          "Unsere Texte überzeugen Menschen und funktionieren bei Google.",
      },
      {
        title: "Auf Ihre Branche abgestimmt",
        description:
          "Jeder Text wird individuell für Ihr Unternehmen erstellt, nicht aus der Vorlage.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu Content Creation",
    items: [
      {
        question: "Schreiben Sie auch branchenspezifische Inhalte?",
        answer:
          "Ja, wir passen Sprache und Inhalte individuell an Ihre Branche und Zielgruppe an.",
      },
      {
        question: "Wie viele Texte sind in einem Projekt enthalten?",
        answer:
          "Der Umfang richtet sich nach Ihrer Website und Ihren Zielen. Im kostenlosen Erstgespräch besprechen wir den genauen Bedarf.",
      },
      {
        question: "Kann ich eigene Texte einbringen oder überarbeiten lassen?",
        answer:
          "Ja, wir überarbeiten auch bestehende Inhalte, statt zwingend alles neu zu schreiben.",
      },
      {
        question: "Schreiben Sie auch regelmäßig neue Blogartikel?",
        answer:
          "Ja, das bieten wir als laufende Leistung an – ideal für langfristige Sichtbarkeit bei Google.",
      },
      {
        question: "Ist Content Creation Teil von DigitalWerk Komplett?",
        answer:
          "Ja, Content Creation ist Bestandteil von DigitalWerk Komplett und zusätzlich einzeln buchbar.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit für Texte, die überzeugen?",
    title: "Lassen Sie uns über Ihre Inhalte sprechen",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie, wie überzeugende Inhalte Ihr Unternehmen voranbringen.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}

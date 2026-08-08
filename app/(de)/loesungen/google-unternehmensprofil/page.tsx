import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Google Unternehmensprofil",
    description:
      "Professionelle Optimierung Ihres Google Unternehmensprofils für bessere Rankings, mehr Bewertungen und mehr Anfragen aus Ihrer Region.",
  },
  "/loesungen/google-unternehmensprofil"
);

const content: ServicePageContent = {
  hero: {
    badge: "Google Unternehmensprofil",
    title: "Der schnellste Weg zu mehr lokaler Sichtbarkeit",
    description:
      "Ihr Google Unternehmensprofil ist oft der erste Kontakt zwischen Ihnen und neuen Kunden – noch bevor sie Ihre Website besuchen. Wir sorgen dafür, dass es vollständig, aktuell und überzeugend ist.",
  },
  problem: {
    title: "Ihr Google-Profil arbeitet nicht für Sie",
    intro:
      "Ein unvollständiges oder falsch gepflegtes Profil kostet Sie Sichtbarkeit – und Vertrauen.",
    points: [
      {
        title: "Unvollständige Angaben",
        description:
          "Fehlende Öffnungszeiten, Fotos oder Kategorien wirken unprofessionell.",
      },
      {
        title: "Wenige oder keine Bewertungen",
        description:
          "Ohne Bewertungen entscheiden sich Kunden eher für die Konkurrenz.",
      },
      {
        title: "Falsche oder veraltete Informationen",
        description:
          "Nichts wirkt unseriöser als ein Profil mit veralteten Öffnungszeiten.",
      },
    ],
  },
  solution: {
    title: "Ein Profil, das Vertrauen schafft",
    description:
      "Wir optimieren jeden Bestandteil Ihres Google Unternehmensprofils – von den Grunddaten über Fotos bis zur Bewertungsstrategie –, damit Kunden Sie finden, Ihnen vertrauen und Kontakt aufnehmen.",
    points: [
      "Vollständige und korrekte Grunddaten",
      "Professionelle Fotos und Beiträge",
      "Strategie für mehr echte Bewertungen",
      "Regelmäßige Pflege und Aktualisierung",
    ],
  },
  benefits: {
    title: "Was ein optimiertes Profil bewirkt",
    items: [
      {
        title: "Mehr Anrufe & Wegbeschreibungen",
        description: "Ein vollständiges Profil wird häufiger kontaktiert.",
      },
      {
        title: "Höheres Vertrauen",
        description:
          "Bewertungen und Fotos überzeugen, bevor Kunden Ihre Website überhaupt sehen.",
      },
      {
        title: "Bessere Platzierung bei Google Maps",
        description:
          "Ein gepflegtes Profil ist ein wichtiges Signal für lokale Rankings.",
      },
      {
        title: "Schnell sichtbare Verbesserungen",
        description:
          "Änderungen am Profil wirken oft schneller als klassisches SEO.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Vollständige Betreuung Ihres Google Unternehmensprofils.",
    items: [
      "Einrichtung oder vollständige Überarbeitung",
      "Optimierung von Kategorien und Beschreibung",
      "Professionelle Foto-Auswahl und -Beratung",
      "Strategie für Kundenbewertungen",
      "Regelmäßige Beiträge und Aktualisierungen",
      "Monitoring auf falsche Fremdeinträge",
      "Monatliches Reporting",
    ],
  },
  process: {
    title: "So optimieren wir Ihr Profil",
    steps: [
      {
        title: "Bestandsaufnahme",
        description:
          "Wir prüfen Ihr aktuelles Profil auf Vollständigkeit und Fehler.",
      },
      {
        title: "Optimierung",
        description:
          "Wir überarbeiten alle relevanten Angaben, Kategorien und Inhalte.",
      },
      {
        title: "Bewertungsstrategie",
        description:
          "Wir entwickeln einen Weg, wie Sie mehr echte Bewertungen erhalten.",
      },
      {
        title: "Laufende Pflege",
        description: "Wir halten Ihr Profil dauerhaft aktuell und aktiv.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Details, die andere übersehen",
        description:
          "Wir kennen die kleinen Stellschrauben, die den Unterschied machen.",
      },
      {
        title: "Nur echte Bewertungen",
        description:
          "Wir setzen auf ehrliche Bewertungsstrategien statt fragwürdiger Abkürzungen.",
      },
      {
        title: "Dauerhafte Betreuung",
        description: "Ihr Profil bleibt aktuell, auch Monate nach dem Start.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zum Google Unternehmensprofil",
    items: [
      {
        question: "Was ist ein Google Unternehmensprofil überhaupt?",
        answer:
          "Das ist der kostenlose Eintrag, der bei der Google-Suche und Google Maps erscheint – mit Öffnungszeiten, Bewertungen, Fotos und Kontaktdaten.",
      },
      {
        question: "Wie schnell sehe ich Ergebnisse?",
        answer:
          "Grundlegende Verbesserungen sind oft innerhalb weniger Wochen sichtbar. Wie stark sich das auf Anfragen auswirkt, hängt von Branche und Wettbewerb ab.",
      },
      {
        question: "Können Sie mir gefälschte Bewertungen besorgen?",
        answer:
          "Nein. Gekaufte Bewertungen verstoßen gegen die Google-Richtlinien und schaden langfristig mehr, als sie nutzen. Wir setzen ausschließlich auf echte Kundenbewertungen.",
      },
      {
        question: "Brauche ich zusätzlich SEO?",
        answer:
          "Google Unternehmensprofil und lokales SEO ergänzen sich. Für maximale Wirkung empfehlen wir beides – einzeln buchbar oder als Teil von DigitalWerk Komplett.",
      },
      {
        question: "Ich habe noch kein Profil – können Sie es einrichten?",
        answer: "Ja, wir übernehmen die vollständige Ersteinrichtung für Sie.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit für ein Profil, das überzeugt?",
    title: "Holen Sie mehr aus Ihrem Google-Profil heraus",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch – wir zeigen Ihnen, welches Potenzial in Ihrem Google Unternehmensprofil steckt.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}

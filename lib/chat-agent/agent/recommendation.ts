import { serviceCatalog } from "../knowledge/sources";
import type { Language, ServiceRecommendation } from "./types";

// Service recommendation matrix from 06_SERVICE_RECOMMENDATION_MATRIX.md.
// Rule: never recommend a service from a single bare keyword. Each rule
// needs a *problem signal* (something is wrong / a goal is stated), and the
// recommendation is always framed as a hypothesis with a follow-up question.

type MatrixRule = {
  id: string;
  serviceSlug: string;
  alternativeSlug?: string;
  /** Problem-signal phrases — at least one must be present. */
  problemSignals: string[];
  /** Diagnostic signal described in the matrix (for the "reason"). */
  diagnostic: { de: string; en: string };
  followUp: { de: string; en: string };
};

const MATRIX: MatrixRule[] = [
  {
    id: "outdated-website",
    serviceSlug: "webentwicklung",
    alternativeSlug: "seo",
    problemSignals: [
      "veraltete website", "alte website", "website sieht", "outdated website",
      "old website", "website looks", "keine anfragen über die website",
      "website converts", "niemand meldet sich über die website",
      "website bringt nichts", "schlechte website", "website is slow",
      "langsame website", "nicht mobil", "not mobile",
      "jahre alt", "zehn jahre", "sieht schlecht aus", "auf dem handy",
      "on mobile", "bringt kaum anfragen", "kaum anfragen", "bringt wenig",
      "website ist alt", "website veraltet", "hardly any inquiries",
      "no inquiries from", "few inquiries",
    ],
    diagnostic: {
      de: "Besucher kommen auf die Website, aber es entstehen kaum Anfragen daraus.",
      en: "Visitors reach the website but few inquiries come from it.",
    },
    followUp: {
      de: "Was passiert aktuell, wenn jemand auf Ihrer Website landet – wo brechen die Besucher ab?",
      en: "What happens today when someone lands on your website — where do visitors drop off?",
    },
  },
  {
    id: "not-found-locally",
    serviceSlug: "seo",
    alternativeSlug: "google-unternehmensprofil",
    problemSignals: [
      "werde nicht gefunden", "nicht bei google", "keiner findet uns",
      "not found on google", "can't be found", "don't show up",
      "unsichtbar bei google", "kunden finden uns nicht", "low local visibility",
      "nicht auf seite 1", "not on page 1", "konkurrenz steht vor uns",
      "nobody finds us", "no one finds us", "nobody can find", "can't find us",
      "cannot find us", "finden uns nicht", "niemand findet uns",
      "findet uns niemand", "not showing up on google", "when they search",
      "search for a dentist", "search for a", "gefunden werden bei google",
    ],
    diagnostic: {
      de: "Bei lokalen Suchanfragen taucht das Unternehmen kaum auf, die Konkurrenz schon.",
      en: "The business barely appears for local searches while competitors do.",
    },
    followUp: {
      de: "Nach welchen Begriffen sollten Kunden Sie idealerweise finden – und in welcher Region?",
      en: "What terms should customers ideally find you by — and in which area?",
    },
  },
  {
    id: "incomplete-gbp",
    serviceSlug: "google-unternehmensprofil",
    alternativeSlug: "seo",
    problemSignals: [
      "google profil", "google unternehmensprofil", "maps eintrag",
      "business profile", "google listing", "wenige bewertungen",
      "few reviews", "falsche öffnungszeiten", "wrong information on google",
      "profil unvollständig", "profile incomplete",
    ],
    diagnostic: {
      de: "Das Google Unternehmensprofil ist unvollständig, veraltet oder hat kaum Bewertungen.",
      en: "The Google Business Profile is incomplete, outdated or has almost no reviews.",
    },
    followUp: {
      de: "Haben Sie schon ein Google Unternehmensprofil, und was steht dort aktuell nicht richtig drin?",
      en: "Do you already have a Google Business Profile, and what's currently wrong or missing on it?",
    },
  },
  {
    id: "content-gap",
    serviceSlug: "content-creation",
    problemSignals: [
      "keine texte", "brauche texte", "brauche inhalte", "need content",
      "need copy", "texte sind schlecht", "generische texte", "kein blog",
      "website hat kaum inhalt", "not enough content", "content for google",
    ],
    diagnostic: {
      de: "Es fehlen überzeugende, auffindbare Inhalte für Website und Google.",
      en: "There is a gap in persuasive, findable content for the website and Google.",
    },
    followUp: {
      de: "Für welche Seiten oder Themen brauchen Sie am dringendsten gute Inhalte?",
      en: "Which pages or topics most urgently need good content?",
    },
  },
  {
    id: "disconnected-channels",
    serviceSlug: "digital-marketing",
    alternativeSlug: "digitalwerk-komplett",
    problemSignals: [
      "verschiedene kanäle", "kein roter faden", "alles einzeln",
      "mehrere dienstleister", "disconnected", "no strategy",
      "keine gesamtstrategie", "zusammengewürfelt", "nichts greift ineinander",
      "multiple agencies", "coordinated growth",
    ],
    diagnostic: {
      de: "Mehrere Marketing-Maßnahmen laufen nebeneinander ohne gemeinsame Strategie.",
      en: "Several marketing activities run in parallel without a shared strategy.",
    },
    followUp: {
      de: "Welche Kanäle nutzen Sie heute schon, und wo sehen Sie den größten blinden Fleck?",
      en: "Which channels are you already using, and where's the biggest blind spot?",
    },
  },
  {
    id: "not-enough-leads",
    serviceSlug: "leadgenerierung",
    alternativeSlug: "digital-marketing",
    problemSignals: [
      "zu wenige anfragen", "brauchen mehr kunden", "mehr leads",
      "not enough leads", "need more inquiries", "planbar mehr anfragen",
      "auftragslage schwankt", "unregelmäßige anfragen", "pipeline is empty",
      "neukunden fehlen",
    ],
    diagnostic: {
      de: "Die Zahl qualifizierter Anfragen ist zu niedrig oder zu unregelmäßig.",
      en: "The number of qualified inquiries is too low or too irregular.",
    },
    followUp: {
      de: "Wie viele Anfragen bekommen Sie aktuell pro Monat, und wie viele davon passen wirklich?",
      en: "How many inquiries do you get per month right now, and how many are actually a good fit?",
    },
  },
  {
    id: "repetitive-questions",
    serviceSlug: "ki-agenten",
    alternativeSlug: "leadgenerierung",
    problemSignals: [
      "immer die gleichen fragen", "wiederkehrende fragen", "gleiche fragen",
      "same questions", "repetitive questions", "answer the same thing",
      "viele anfragen gleichzeitig", "team kommt nicht hinterher",
      "verpasste anrufe", "missed calls", "anrufe außerhalb", "after hours",
      "nachrichten stapeln sich", "kundenservice ausgelastet",
    ],
    diagnostic: {
      de: "Vorhersehbare, wiederkehrende Anfragen binden viel Zeit im Team.",
      en: "Predictable, recurring inquiries take up a lot of the team's time.",
    },
    followUp: {
      de: "Welche Fragen stellen Ihre Kunden am häufigsten, und worüber kommen sie herein (Telefon, WhatsApp, E-Mail, Website)?",
      en: "Which questions do your customers ask most often, and through which channel do they come in (phone, WhatsApp, email, website)?",
    },
  },
  {
    id: "appointment-handling",
    serviceSlug: "ki-agenten",
    problemSignals: [
      "termine buchen", "terminvergabe", "terminanfragen", "appointment booking",
      "scheduling", "kalender", "buchungen", "terminchaos",
      "terminbuchung", "termin buchen", "termine automatisch", "online termin",
      "book appointments", "appointment", "terminvereinbarung",
    ],
    diagnostic: {
      de: "Die Terminvereinbarung läuft manuell und kostet Zeit.",
      en: "Appointment scheduling is manual and time-consuming.",
    },
    followUp: {
      de: "Wie werden Termine bei Ihnen aktuell vereinbart, und nutzen Sie schon ein Kalendersystem?",
      en: "How are appointments arranged today, and do you already use a calendar system?",
    },
  },
  {
    id: "shop-support",
    serviceSlug: "ki-agenten-e-commerce",
    alternativeSlug: "ki-agenten",
    problemSignals: [
      "bestellstatus", "produktfragen", "shop support", "order status",
      "product questions", "shopify support", "woocommerce support",
      "retouren fragen", "kundenfragen im shop",
    ],
    diagnostic: {
      de: "Produkt-, Bestell- und Supportfragen im Online-Shop häufen sich.",
      en: "Product, order and support questions in the online shop are piling up.",
    },
    followUp: {
      de: "Auf welchem Shop-System läuft Ihr Store, und welche Fragen kommen am häufigsten?",
      en: "Which shop system runs your store, and which questions come up most?",
    },
  },
  {
    id: "search-demand",
    serviceSlug: "werbeanzeigen",
    alternativeSlug: "seo",
    problemSignals: [
      "google ads", "schnell sichtbar", "sofort kunden", "aktive nachfrage",
      "paid search", "need results fast", "sofortige sichtbarkeit",
      "kampagne starten", "run ads",
    ],
    diagnostic: {
      de: "Es gibt aktive Suchnachfrage, aber SEO würde zu lange dauern.",
      en: "There is active search demand, but SEO would take too long.",
    },
    followUp: {
      de: "Bis wann möchten Sie erste Ergebnisse sehen, und gibt es schon ein Werbebudget?",
      en: "By when do you want to see first results, and is there an advertising budget already?",
    },
  },
  {
    id: "social-discovery",
    serviceSlug: "werbeanzeigen",
    problemSignals: [
      "instagram", "facebook ads", "tiktok", "social media werbung",
      "zielgruppe jünger", "brand awareness", "sichtbar auf social",
    ],
    diagnostic: {
      de: "Die Zielgruppe wird eher über Social Media als über die Google-Suche erreicht.",
      en: "The audience is reached through social media rather than Google search.",
    },
    followUp: {
      de: "Welche Plattform nutzt Ihre Zielgruppe am meisten, und haben Sie schon Bild-/Videomaterial?",
      en: "Which platform does your audience use most, and do you already have photo/video material?",
    },
  },
  {
    id: "wants-online-shop",
    serviceSlug: "e-commerce",
    problemSignals: [
      "online verkaufen", "online shop erstellen", "webshop bauen",
      "sell online", "build an online store", "produkte online anbieten",
      "marktplatz anbinden",
    ],
    diagnostic: {
      de: "Es besteht der Wunsch, Produkte online zu verkaufen.",
      en: "There is a need to sell products online.",
    },
    followUp: {
      de: "Was möchten Sie verkaufen, und verkaufen Sie heute schon irgendwo online?",
      en: "What do you want to sell, and are you selling anywhere online today?",
    },
  },
  {
    id: "multiple-gaps",
    serviceSlug: "digitalwerk-komplett",
    problemSignals: [
      "alles zusammen", "komplettpaket", "brauchen alles", "one partner",
      "everything from one", "website und seo und", "rundum-sorglos",
      "nicht mit mehreren agenturen",
    ],
    diagnostic: {
      de: "Mehrere digitale Baustellen gleichzeitig, Wunsch nach einem einzigen Partner.",
      en: "Several digital gaps at once, wanting a single partner.",
    },
    followUp: {
      de: "Welche Themen brennen bei Ihnen am meisten – Website, Sichtbarkeit, Anfragen oder Automatisierung?",
      en: "Which areas are most pressing for you — website, visibility, inquiries or automation?",
    },
  },
];

function serviceName(slug: string, language: Language): string {
  const svc = serviceCatalog.find((s) => s.slug === slug);
  if (!svc) return slug;
  return language === "de" ? svc.nameDe : svc.nameEn;
}

export type RecommendationInput = {
  /** Combined recent visitor text (this + prior turns). */
  conversationText: string;
  language: Language;
  /** Whether the visitor has described an actual problem/goal (not just a keyword). */
  hasProblemContext: boolean;
};

export function recommendService(
  input: RecommendationInput,
): ServiceRecommendation | null {
  const hay = ` ${input.conversationText.toLowerCase()} `;

  let best: { rule: MatrixRule; hits: number } | null = null;
  for (const rule of MATRIX) {
    const hits = rule.problemSignals.filter((s) => hay.includes(s)).length;
    if (hits === 0) continue;
    if (!best || hits > best.hits) best = { rule, hits };
  }

  if (!best) return null;

  const { rule, hits } = best;
  // Confidence rewards multiple problem signals and real described context.
  const contextSupported = input.hasProblemContext || hits >= 2;
  const confidence = Math.min(
    0.9,
    0.35 + hits * 0.18 + (input.hasProblemContext ? 0.2 : 0),
  );

  return {
    problem: rule.diagnostic[input.language],
    recommendedServiceSlug: rule.serviceSlug,
    recommendedServiceName: serviceName(rule.serviceSlug, input.language),
    reason:
      input.language === "de"
        ? `Diagnostisches Signal: ${rule.diagnostic.de}`
        : `Diagnostic signal: ${rule.diagnostic.en}`,
    alternativeServiceSlug: rule.alternativeSlug,
    alternativeServiceName: rule.alternativeSlug
      ? serviceName(rule.alternativeSlug, input.language)
      : undefined,
    followUpQuestion: rule.followUp[input.language],
    confidence: Number(confidence.toFixed(2)),
    contextSupported,
  };
}

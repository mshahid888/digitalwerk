import type { IntentCategory, IntentResult } from "./types";

// Rule-based intent detection. Deterministic and fully testable without an
// LLM. Each category has weighted signal phrases; the highest-scoring
// category wins, with confidence derived from the margin.

type Rule = {
  category: IntentCategory;
  signals: { phrase: string; weight: number }[];
};

const RULES: Rule[] = [
  {
    category: "HUMAN_REQUEST",
    signals: [
      { phrase: "mit einem menschen", weight: 5 },
      { phrase: "echten menschen", weight: 5 },
      { phrase: "mitarbeiter sprechen", weight: 5 },
      { phrase: "berater sprechen", weight: 4 },
      { phrase: "talk to a human", weight: 5 },
      { phrase: "speak to someone", weight: 4 },
      { phrase: "real person", weight: 4 },
      { phrase: "rückruf", weight: 3 },
      { phrase: "call me", weight: 3 },
      { phrase: "kein bot", weight: 3 },
    ],
  },
  {
    category: "EXISTING_CLIENT",
    signals: [
      { phrase: "laufendes projekt", weight: 5 },
      { phrase: "mein projekt", weight: 3 },
      { phrase: "bestandskunde", weight: 5 },
      { phrase: "bin kunde", weight: 4 },
      { phrase: "existing client", weight: 5 },
      { phrase: "current project", weight: 4 },
      { phrase: "already a customer", weight: 4 },
      { phrase: "rechnung", weight: 3 },
      { phrase: "invoice", weight: 3 },
      { phrase: "ansprechpartner", weight: 2 },
    ],
  },
  {
    category: "SUPPORT",
    signals: [
      { phrase: "funktioniert nicht", weight: 4 },
      { phrase: "fehler", weight: 3 },
      { phrase: "problem mit", weight: 3 },
      { phrase: "not working", weight: 4 },
      { phrase: "bug", weight: 3 },
      { phrase: "broken", weight: 3 },
      { phrase: "hilfe bei", weight: 2 },
    ],
  },
  {
    category: "PRICING",
    signals: [
      { phrase: "was kostet", weight: 7 },
      { phrase: "wie viel kostet", weight: 7 },
      { phrase: "was kosten", weight: 7 },
      { phrase: "kostet", weight: 4 },
      { phrase: "preis", weight: 4 },
      { phrase: "kosten", weight: 3 },
      { phrase: "preise", weight: 4 },
      { phrase: "how much", weight: 7 },
      { phrase: "what does it cost", weight: 7 },
      { phrase: "cost", weight: 4 },
      { phrase: "pricing", weight: 4 },
      { phrase: "price", weight: 4 },
      { phrase: "per month", weight: 3 },
      { phrase: "im monat", weight: 2 },
      { phrase: "budget", weight: 2 },
      { phrase: "angebot", weight: 2 },
      { phrase: "quote", weight: 2 },
    ],
  },
  {
    category: "PROJECT_REQUEST",
    signals: [
      { phrase: "angebot erstellen", weight: 4 },
      { phrase: "projekt anfragen", weight: 5 },
      { phrase: "zusammenarbeiten", weight: 4 },
      { phrase: "beauftragen", weight: 4 },
      { phrase: "loslegen", weight: 3 },
      { phrase: "start a project", weight: 5 },
      { phrase: "work with you", weight: 4 },
      { phrase: "hire you", weight: 4 },
      { phrase: "get started", weight: 3 },
      { phrase: "proposal", weight: 3 },
      { phrase: "erstgespräch", weight: 3 },
      { phrase: "consultation", weight: 3 },
    ],
  },
  {
    category: "AI_AUTOMATION",
    signals: [
      { phrase: "ki-agent", weight: 5 },
      { phrase: "ki agent", weight: 5 },
      { phrase: "ki-agenten", weight: 5 },
      { phrase: "chatbot", weight: 4 },
      { phrase: "automatisieren", weight: 3 },
      { phrase: "automatisierung", weight: 4 },
      { phrase: "künstliche intelligenz", weight: 3 },
      { phrase: "ai agent", weight: 5 },
      { phrase: "automation", weight: 3 },
      { phrase: "voice agent", weight: 4 },
      { phrase: "telefon-ki", weight: 4 },
      { phrase: "wiederkehrende fragen", weight: 3 },
      { phrase: "repetitive questions", weight: 3 },
      { phrase: "same questions", weight: 3 },
      { phrase: "dieselben fragen", weight: 3 },
      { phrase: "die gleichen fragen", weight: 3 },
      { phrase: "immer die gleichen", weight: 3 },
      { phrase: "ständig fragen", weight: 3 },
      { phrase: "kommt nicht hinterher", weight: 2 },
      { phrase: "kommen nicht hinterher", weight: 2 },
      { phrase: "termine automatisch", weight: 3 },
      { phrase: "terminbuchung", weight: 3 },
    ],
  },
  {
    category: "SEO",
    signals: [
      { phrase: "seo", weight: 4 },
      { phrase: "bei google gefunden", weight: 5 },
      { phrase: "google ranking", weight: 4 },
      { phrase: "sichtbarkeit bei google", weight: 5 },
      { phrase: "suchmaschine", weight: 3 },
      { phrase: "google maps", weight: 3 },
      { phrase: "get found on google", weight: 5 },
      { phrase: "found on google", weight: 4 },
      { phrase: "finds us on google", weight: 5 },
      { phrase: "find us on google", weight: 5 },
      { phrase: "nobody finds us", weight: 4 },
      { phrase: "search ranking", weight: 4 },
      { phrase: "not showing up on google", weight: 4 },
      { phrase: "when they search", weight: 3 },
      { phrase: "local search", weight: 3 },
      { phrase: "gefunden werden", weight: 3 },
    ],
  },
  {
    category: "GOOGLE_BUSINESS_PROFILE",
    signals: [
      { phrase: "google unternehmensprofil", weight: 5 },
      { phrase: "google business profile", weight: 5 },
      { phrase: "google my business", weight: 5 },
      { phrase: "maps eintrag", weight: 4 },
      { phrase: "bewertungen", weight: 3 },
      { phrase: "reviews on google", weight: 3 },
      { phrase: "business listing", weight: 3 },
    ],
  },
  {
    category: "WEBSITE",
    signals: [
      { phrase: "neue website", weight: 5 },
      { phrase: "webseite erstellen", weight: 5 },
      { phrase: "website erstellen", weight: 5 },
      { phrase: "homepage", weight: 3 },
      { phrase: "webdesign", weight: 4 },
      { phrase: "webentwicklung", weight: 4 },
      { phrase: "relaunch", weight: 4 },
      { phrase: "new website", weight: 5 },
      { phrase: "build a website", weight: 5 },
      { phrase: "build websites", weight: 5 },
      { phrase: "build me a website", weight: 5 },
      { phrase: "you build website", weight: 4 },
      { phrase: "make a website", weight: 4 },
      { phrase: "develop a website", weight: 4 },
      { phrase: "web design", weight: 4 },
      { phrase: "websites", weight: 2 },
      { phrase: "redesign", weight: 3 },
      { phrase: "veraltete website", weight: 4 },
      { phrase: "outdated website", weight: 4 },
    ],
  },
  {
    category: "CONTENT",
    signals: [
      { phrase: "content erstellen", weight: 4 },
      { phrase: "texte schreiben", weight: 4 },
      { phrase: "texte für", weight: 3 },
      { phrase: "blogartikel", weight: 4 },
      { phrase: "copywriting", weight: 4 },
      { phrase: "website texte", weight: 4 },
      { phrase: "content creation", weight: 4 },
      { phrase: "write content", weight: 4 },
      { phrase: "blog posts", weight: 4 },
    ],
  },
  {
    category: "ADVERTISING",
    signals: [
      { phrase: "google ads", weight: 5 },
      { phrase: "meta ads", weight: 5 },
      { phrase: "facebook ads", weight: 5 },
      { phrase: "instagram ads", weight: 5 },
      { phrase: "tiktok ads", weight: 5 },
      { phrase: "werbeanzeigen", weight: 5 },
      { phrase: "anzeigen schalten", weight: 4 },
      { phrase: "bezahlte werbung", weight: 4 },
      { phrase: "paid ads", weight: 4 },
      { phrase: "run ads", weight: 4 },
      { phrase: "ppc", weight: 3 },
      { phrase: "kampagne", weight: 2 },
    ],
  },
  {
    category: "LEAD_GENERATION",
    signals: [
      { phrase: "mehr anfragen", weight: 4 },
      { phrase: "mehr leads", weight: 5 },
      { phrase: "leadgenerierung", weight: 5 },
      { phrase: "neukundengewinnung", weight: 4 },
      { phrase: "neukunden gewinnen", weight: 4 },
      { phrase: "more leads", weight: 5 },
      { phrase: "lead generation", weight: 5 },
      { phrase: "generate leads", weight: 5 },
      { phrase: "more inquiries", weight: 4 },
      { phrase: "new customers", weight: 3 },
    ],
  },
  {
    category: "DIGITAL_MARKETING",
    signals: [
      { phrase: "digital marketing", weight: 5 },
      { phrase: "online marketing", weight: 5 },
      { phrase: "marketing strategie", weight: 4 },
      { phrase: "marketing strategy", weight: 4 },
      { phrase: "mehrere kanäle", weight: 3 },
      { phrase: "gesamtstrategie", weight: 3 },
      { phrase: "grow online", weight: 3 },
    ],
  },
  {
    category: "E_COMMERCE",
    signals: [
      { phrase: "online shop", weight: 5 },
      { phrase: "onlineshop", weight: 5 },
      { phrase: "e-commerce", weight: 5 },
      { phrase: "shop erstellen", weight: 5 },
      { phrase: "produkte verkaufen", weight: 4 },
      { phrase: "shopify", weight: 4 },
      { phrase: "woocommerce", weight: 4 },
      { phrase: "sell products online", weight: 4 },
      { phrase: "webshop", weight: 5 },
      { phrase: "marktplatz", weight: 3 },
    ],
  },
  {
    category: "SERVICE_INFORMATION",
    signals: [
      { phrase: "welche leistungen", weight: 4 },
      { phrase: "was bietet ihr", weight: 4 },
      { phrase: "was bietet digitalwerk", weight: 4 },
      { phrase: "eure services", weight: 4 },
      { phrase: "what services", weight: 4 },
      { phrase: "what do you offer", weight: 4 },
      { phrase: "your services", weight: 3 },
      { phrase: "leistungsübersicht", weight: 3 },
      { phrase: "digitalwerk komplett", weight: 4 },
      { phrase: "digitalwerk complete", weight: 4 },
    ],
  },
  {
    category: "GENERAL_INFORMATION",
    signals: [
      { phrase: "wer ist digitalwerk", weight: 4 },
      { phrase: "wer seid ihr", weight: 4 },
      { phrase: "über digitalwerk", weight: 4 },
      { phrase: "about digitalwerk", weight: 4 },
      { phrase: "who are you", weight: 3 },
      { phrase: "who is digitalwerk", weight: 4 },
      { phrase: "wo sitzt", weight: 3 },
      { phrase: "where are you based", weight: 3 },
      { phrase: "öffnungszeiten", weight: 3 },
      { phrase: "kontakt", weight: 2 },
      { phrase: "contact", weight: 2 },
      { phrase: "erreiche ich euch", weight: 3 },
    ],
  },
];

export function detectIntent(text: string): IntentResult {
  const hay = ` ${text.toLowerCase()} `;
  const scores = new Map<IntentCategory, number>();
  const matched: string[] = [];

  for (const rule of RULES) {
    let score = 0;
    for (const signal of rule.signals) {
      if (hay.includes(signal.phrase)) {
        score += signal.weight;
        matched.push(signal.phrase);
      }
    }
    if (score > 0) scores.set(rule.category, score);
  }

  if (scores.size === 0) {
    return {
      category: "OTHER",
      confidence: 0.2,
      alternatives: [],
      matchedSignals: [],
    };
  }

  const ranked = [...scores.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  const [topCategory, topScore] = ranked[0];
  const secondScore = ranked[1]?.[1] ?? 0;
  const margin = (topScore - secondScore) / topScore;
  const confidence = Math.min(1, 0.45 + margin * 0.4 + Math.min(topScore, 10) / 40);

  return {
    category: topCategory,
    confidence: Number(confidence.toFixed(2)),
    alternatives: ranked.slice(1, 4).map(([c]) => c),
    matchedSignals: [...new Set(matched)],
  };
}

// Maps an intent category to the primary service slug it concerns, when
// there is a direct one. Used by the recommender and prompt builder.
export const INTENT_TO_SERVICE: Partial<Record<IntentCategory, string>> = {
  AI_AUTOMATION: "ki-agenten",
  WEBSITE: "webentwicklung",
  SEO: "seo",
  GOOGLE_BUSINESS_PROFILE: "google-unternehmensprofil",
  CONTENT: "content-creation",
  DIGITAL_MARKETING: "digital-marketing",
  ADVERTISING: "werbeanzeigen",
  LEAD_GENERATION: "leadgenerierung",
  E_COMMERCE: "e-commerce",
};

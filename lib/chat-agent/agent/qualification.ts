import type {
  IntentResult,
  Language,
  LeadBand,
  LeadFacts,
  LeadScore,
  LeadScoreBreakdown,
  QualificationState,
  ServiceRecommendation,
} from "./types";

// Progressive lead qualification and 0–100 internal scoring per
// 05_LEAD_QUALIFICATION_AND_SCORING.md. The score is INTERNAL — it is never
// shown to the visitor and never sent in an outbound reply.

const EMAIL_RE = /\b[^\s@]+@[^\s@]+\.[^\s@]{2,}\b/;
const PHONE_RE = /(?:\+?\d[\d\s()/-]{6,}\d)/;

const TIMELINE_SIGNALS: { re: RegExp; value: string; weight: "active" | "soon" | "vague" }[] = [
  { re: /\b(sofort|dringend|asap|so schnell wie möglich|diese woche|urgent|right away|immediately)\b/i, value: "active need", weight: "active" },
  { re: /\b(diesen monat|nächsten monat|in den nächsten wochen|kurzfristig|within a month|next month|q[1-4])\b/i, value: "next few weeks", weight: "soon" },
  { re: /\b(nächste(s|n)? (quartal|monate)|in ein paar monaten|next quarter|in a few months|later this year)\b/i, value: "next few months", weight: "soon" },
  { re: /\b(irgendwann|später|kein zeitdruck|nur mal schauen|just looking|no rush|someday)\b/i, value: "no fixed timeline", weight: "vague" },
];

const IMPACT_SIGNALS: { re: RegExp; level: "high" | "medium" }[] = [
  { re: /\b(verlieren kunden|umsatz|verlieren wir|kostet uns|können nicht mehr|team überlastet|verpassen (viele )?anfragen|losing customers|losing revenue|can't keep up|overwhelmed|missing (many )?leads)\b/i, level: "high" },
  { re: /\b(ineffizient|kostet zeit|aufwendig|nervt|time-consuming|inefficient|frustrating|takes too long)\b/i, level: "medium" },
];

const DECISION_MAKER_RE =
  /\b(ich bin (der |die )?(inhaber|geschäftsführer|gründer|chef)|mein unternehmen|unsere firma|wir sind ein|i (own|run) (a|the)|i'm the (owner|founder|ceo|manager)|my company|our business)\b/i;

const CONTACT_WILLING_RE =
  /\b(rufen sie mich an|kontaktieren sie mich|melden sie sich|schicken sie mir|hier ist meine|call me|contact me|reach out|get in touch|here's my|you can email me)\b/i;

// Leading word boundary only — so compounds like "Zahnarztpraxis" or
// "Restaurantkette" still match. Order matters: first hit wins.
const INDUSTRY_HINTS: { re: RegExp; label: string }[] = [
  { re: /\b(restaurant|gastronom|café|cafe|imbiss|bäckerei|metzgerei)/i, label: "Gastronomie" },
  { re: /\b(zahnarzt|zahnärzt|arztpraxis|arzt|ärzt|praxis|dentist|doctor|medical practice|physio)/i, label: "Praxis / Gesundheit" },
  { re: /\b(anwalt|anwält|kanzlei|rechtsanwalt|steuerberat|lawyer|law firm|attorney|notar)/i, label: "Kanzlei / Beratung" },
  { re: /\b(hotel|pension|ferienwohnung|gästehaus|guesthouse|beherbergung)/i, label: "Hotellerie" },
  { re: /\b(handwerk|elektriker|maler|installateur|schreiner|dachdecker|tradesman|electrician|plumber|sanitär)/i, label: "Handwerk" },
  { re: /\b(friseur|frisör|kosmetik|beauty|salon|spa|nagelstudio|wellness)/i, label: "Beauty & Wellness" },
  { re: /\b(einzelhandel|boutique|retail|e-commerce|online-shop|onlineshop|webshop|laden)/i, label: "Einzelhandel / E-Commerce" },
  { re: /\b(immobilien|makler|real estate)/i, label: "Immobilien" },
];

export function createQualificationState(): QualificationState {
  return {
    facts: {},
    score: emptyScore(),
    nextField: null,
    askedFields: [],
    contactRequested: false,
  };
}

function emptyScore(): LeadScore {
  return {
    total: 0,
    band: "informational",
    breakdown: {
      fit: 0,
      problemClarity: 0,
      intent: 0,
      timing: 0,
      impact: 0,
      contactWillingness: 0,
    },
  };
}

// Extract any facts the visitor volunteered in this message. Never guesses
// a name/company from thin evidence — only clear patterns.
export function extractFacts(message: string, existing: LeadFacts): LeadFacts {
  const facts: LeadFacts = { ...existing };

  const email = message.match(EMAIL_RE)?.[0];
  if (email && !facts.email) facts.email = email;

  // Only treat a number as a phone if it isn't the email's local part etc.
  const withoutEmail = message.replace(EMAIL_RE, " ");
  const phone = withoutEmail.match(PHONE_RE)?.[0]?.trim();
  if (phone && phone.replace(/\D/g, "").length >= 8 && !facts.phone) {
    facts.phone = phone;
  }

  const nameMatch =
    message.match(/\b(?:mein name ist|ich heiße|ich bin|my name is|i am|i'm)\s+([A-ZÄÖÜ][\p{L}-]+(?:\s+[A-ZÄÖÜ][\p{L}-]+)?)/u);
  if (nameMatch && !facts.name) {
    const candidate = nameMatch[1].trim();
    // avoid "I am the owner" style false positives
    if (!/^(der|die|the|owner|inhaber|gründer|founder|ceo)$/i.test(candidate)) {
      facts.name = candidate;
    }
  }

  const companyMatch = message.match(
    /\b(?:meine firma|mein unternehmen|unsere firma|wir sind|firma|unternehmen|my company|our company|we are|company)\s*(?:heißt|ist|:)?\s*["']?([A-ZÄÖÜ][\p{L}0-9 .&-]{1,40})["']?/u,
  );
  if (companyMatch && !facts.company) {
    facts.company = companyMatch[1].trim().replace(/\s+(und|and)$/i, "");
  }

  if (!facts.industry) {
    const industry = INDUSTRY_HINTS.find((h) => h.re.test(message));
    if (industry) facts.industry = industry.label;
  }

  const timeline = TIMELINE_SIGNALS.find((t) => t.re.test(message));
  if (timeline && !facts.timeline) facts.timeline = timeline.value;

  return facts;
}

type ScoreInput = {
  facts: LeadFacts;
  intent: IntentResult;
  recommendation: ServiceRecommendation | null;
  conversationText: string;
  problemDescribed: boolean;
  turnsFromVisitor: number;
};

export function scoreLead(input: ScoreInput): LeadScore {
  const hay = ` ${input.conversationText.toLowerCase()} `;
  const b: LeadScoreBreakdown = {
    fit: 0,
    problemClarity: 0,
    intent: 0,
    timing: 0,
    impact: 0,
    contactWillingness: 0,
  };

  // Fit (0–25): does this map to a DigitalWerk service?
  const serviceIntents = new Set([
    "AI_AUTOMATION", "WEBSITE", "SEO", "GOOGLE_BUSINESS_PROFILE", "CONTENT",
    "DIGITAL_MARKETING", "ADVERTISING", "LEAD_GENERATION", "E_COMMERCE",
    "SERVICE_INFORMATION", "PROJECT_REQUEST",
  ]);
  if (input.recommendation?.contextSupported) b.fit = 25;
  else if (input.recommendation) b.fit = 20;
  else if (serviceIntents.has(input.intent.category)) b.fit = 12;
  else if (input.intent.category === "PRICING") b.fit = 10;
  else b.fit = 3;

  // Problem clarity (0–20)
  if (input.problemDescribed && (input.facts.currentProcess || input.recommendation?.contextSupported)) {
    b.problemClarity = 20;
  } else if (input.problemDescribed || input.recommendation) {
    b.problemClarity = 10;
  } else {
    b.problemClarity = 2;
  }

  // Intent (0–20) — includes decision-maker/authority as a modifier, per
  // the "decision-maker / access" qualification dimension in spec 05.
  const decisionMaker = DECISION_MAKER_RE.test(input.conversationText);
  if (input.intent.category === "PROJECT_REQUEST" || /\b(angebot|beauftragen|loslegen|proposal|hire you|get started)\b/i.test(hay)) {
    b.intent = 20;
  } else if (input.intent.category === "PRICING" || /\b(vergleiche|evaluating|thinking about|überlege|wie viel kostet)\b/i.test(hay)) {
    b.intent = decisionMaker ? 13 : 10;
  } else {
    b.intent = decisionMaker ? 6 : 3;
  }

  // Timing (0–15)
  const timeline = TIMELINE_SIGNALS.find((t) => t.re.test(input.conversationText));
  if (timeline?.weight === "active") b.timing = 15;
  else if (timeline?.weight === "soon") b.timing = 8;
  else b.timing = 0;

  // Impact (0–10)
  const impact = IMPACT_SIGNALS.find((s) => s.re.test(input.conversationText));
  if (impact?.level === "high") b.impact = 10;
  else if (impact?.level === "medium") b.impact = 5;
  else b.impact = 0;

  // Contact willingness (0–10)
  if (input.facts.email || input.facts.phone) b.contactWillingness = 10;
  else if (CONTACT_WILLING_RE.test(input.conversationText) || input.intent.category === "HUMAN_REQUEST") {
    b.contactWillingness = 5;
  } else b.contactWillingness = 0;

  const total =
    b.fit + b.problemClarity + b.intent + b.timing + b.impact + b.contactWillingness;

  return { total, band: bandFor(total), breakdown: b };
}

function bandFor(total: number): LeadBand {
  if (total >= 75) return "high_intent";
  if (total >= 55) return "qualified";
  if (total >= 30) return "nurture";
  return "informational";
}

// Ordered priority of facts to obtain. Problem understanding comes before
// any contact detail — the agent must not front-load a contact form.
const FIELD_PRIORITY: (keyof LeadFacts)[] = [
  "problem",
  "currentProcess",
  "desiredOutcome",
  "company",
  "industry",
  "timeline",
  "name",
  "email",
];

export function decideNextField(
  state: QualificationState,
  opts: { problemDescribed: boolean; readyForContact: boolean },
): keyof LeadFacts | null {
  for (const field of FIELD_PRIORITY) {
    if (state.facts[field]) continue;
    if (state.askedFields.includes(field)) continue;

    // Gate contact-detail asks until there is a real reason.
    if ((field === "name" || field === "email") && !opts.readyForContact) {
      return null;
    }
    if (field === "currentProcess" && !opts.problemDescribed) return null;
    if (field === "desiredOutcome" && !opts.problemDescribed) return null;

    return field;
  }
  return null;
}

export const FIELD_QUESTIONS: Record<
  keyof LeadFacts,
  { de: string; en: string }
> = {
  problem: {
    de: "Was möchten Sie mit DigitalWerk erreichen – was ist gerade das größte Thema?",
    en: "What would you like to achieve with DigitalWerk — what's the biggest issue right now?",
  },
  currentProcess: {
    de: "Wie lösen Sie das heute?",
    en: "How do you handle that today?",
  },
  desiredOutcome: {
    de: "Wie sähe für Sie ein gutes Ergebnis aus?",
    en: "What would a good outcome look like for you?",
  },
  company: {
    de: "Um welches Unternehmen geht es?",
    en: "Which business is this for?",
  },
  industry: {
    de: "In welcher Branche sind Sie tätig?",
    en: "What industry are you in?",
  },
  timeline: {
    de: "Haben Sie einen zeitlichen Rahmen im Kopf?",
    en: "Do you have a timeframe in mind?",
  },
  name: {
    de: "Wie ist Ihr Name, damit sich das Team gezielt bei Ihnen melden kann?",
    en: "What's your name, so the team can get back to you directly?",
  },
  email: {
    de: "Unter welcher E-Mail-Adresse erreichen wir Sie am besten?",
    en: "What's the best email address to reach you at?",
  },
  phone: {
    de: "Gibt es eine Telefonnummer, unter der wir Sie erreichen können?",
    en: "Is there a phone number we can reach you on?",
  },
  relevantTools: {
    de: "Welche Systeme oder Tools sind dabei im Einsatz?",
    en: "Which systems or tools are involved?",
  },
  budget: {
    de: "Gibt es einen groben Budgetrahmen für das Vorhaben?",
    en: "Is there a rough budget range for this?",
  },
  notes: { de: "", en: "" },
};

export function fieldQuestion(
  field: keyof LeadFacts,
  language: Language,
): string {
  return FIELD_QUESTIONS[field][language];
}

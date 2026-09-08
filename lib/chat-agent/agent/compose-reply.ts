import type { RetrievedChunk } from "../knowledge/types";
import { fieldQuestion } from "./qualification";
import type {
  HandoffDecision,
  IntentResult,
  Language,
  LeadFacts,
  QualificationState,
  ServiceRecommendation,
} from "./types";

// Deterministic reply composer. It turns the agent's computed turn state
// into a spec-aligned natural reply WITHOUT an LLM. Used:
//   - by the mock provider (so dev + every test has a real, sensible reply);
//   - as the graceful-degradation fallback if a live provider errors.
//
// It follows the problem -> diagnosis -> recommendation -> next-step pattern
// and never states a price or fact that is not in `retrieved`.

type ComposeArgs = {
  language: Language;
  intent: IntentResult;
  retrieved: RetrievedChunk[];
  recommendation: ServiceRecommendation | null;
  qualification: QualificationState;
  nextField: keyof LeadFacts | null;
  handoff: HandoffDecision;
  problemDescribed: boolean;
  isFirstTurn: boolean;
};

const T = {
  de: {
    greeting:
      "Hallo! Wie kann ich Ihnen bei Ihrem digitalen Auftritt oder bei der Automatisierung in Ihrem Unternehmen helfen?",
    noInfo:
      "Dazu möchte ich Ihnen keine ungenauen Angaben machen. Das lässt sich am besten direkt mit dem DigitalWerk-Team klären – ich kann Sie gerne weiterleiten.",
    handoffLead:
      "Das bespreche ich am besten mit einem Menschen aus dem Team.",
    handoffReasons: {
      visitor_requested: "Sie möchten direkt mit jemandem sprechen.",
      custom_quote: "Dafür braucht es ein individuelles Angebot.",
      complex_project: "Das klingt nach einer komplexeren Umsetzung.",
      contractual_or_legal: "Das ist eine vertragliche bzw. rechtliche Frage.",
      sensitive_complaint: "Das ist ein Anliegen, das eine Person übernehmen sollte.",
      existing_client_issue:
        "Für ein laufendes Projekt kümmert sich Ihr fester Ansprechpartner darum.",
      uncertain_information: "Dazu habe ich keine gesicherte Information.",
      high_intent: "Sie sind offenbar bereit für den nächsten Schritt.",
    } as Record<string, string>,
    handoffAsk:
      "Wenn Sie mir kurz Ihren Namen und eine E-Mail-Adresse hinterlassen, meldet sich das Team in der Regel innerhalb eines Werktages – oder Sie erreichen es direkt unter info@digitalwerkk.de bzw. per WhatsApp.",
    recommendationLead: (name: string) =>
      `Auf Basis dessen, was Sie beschrieben haben, könnte „${name}“ eine gute Option sein.`,
    recommendationAlt: (name: string) =>
      `Alternativ wäre „${name}“ einen Blick wert.`,
    hypothesis: "Das ist eine erste Einschätzung, keine feste Empfehlung.",
    askProblem:
      "Erzählen Sie mir kurz, worum es geht – was möchten Sie erreichen?",
  },
  en: {
    greeting:
      "Hi! How can I help with your online presence or with automating something in your business?",
    noInfo:
      "I don't want to give you inaccurate information on that. It's best confirmed directly with the DigitalWerk team — I can hand you over.",
    handoffLead: "This is best discussed with a person from the team.",
    handoffReasons: {
      visitor_requested: "You'd like to speak with someone directly.",
      custom_quote: "This needs a custom quote.",
      complex_project: "This sounds like a more complex build.",
      contractual_or_legal: "This is a contractual or legal question.",
      sensitive_complaint: "This is something a person should take on.",
      existing_client_issue:
        "For an ongoing project your dedicated contact will handle it.",
      uncertain_information: "I don't have reliable information on that.",
      high_intent: "It sounds like you're ready for the next step.",
    } as Record<string, string>,
    handoffAsk:
      "If you leave your name and an email address, the team usually gets back within one business day — or reach them directly at info@digitalwerkk.de or on WhatsApp.",
    recommendationLead: (name: string) =>
      `Based on what you've described, ${name} could be a good fit.`,
    recommendationAlt: (name: string) => `${name} would also be worth a look.`,
    hypothesis: "That's an initial read, not a fixed recommendation.",
    askProblem: "Tell me briefly what this is about — what do you want to achieve?",
  },
} as const;

function knowledgeAnswer(retrieved: RetrievedChunk[]): string {
  if (retrieved.length === 0) return "";
  // Use the single best chunk's body as the grounded answer core, trimmed.
  const best = retrieved[0].entry.body.replace(/\s+/g, " ").trim();
  // Keep it short: first 2 sentences.
  const sentences = best.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
  return sentences;
}

export function composeReply(args: ComposeArgs): string {
  const t = T[args.language];
  const parts: string[] = [];

  if (args.isFirstTurn && !args.problemDescribed && args.retrieved.length === 0 && !args.handoff.handoff) {
    return t.greeting;
  }

  // 1. Answer from knowledge if we have it. When a well-supported
  // recommendation is coming, skip the generic knowledge paragraph unless
  // the visitor asked an information/pricing question directly — the
  // diagnosis + recommendation should lead.
  const grounded = knowledgeAnswer(args.retrieved);
  const infoIntent =
    args.intent.category === "GENERAL_INFORMATION" ||
    args.intent.category === "SERVICE_INFORMATION" ||
    args.intent.category === "PRICING";
  if (
    grounded &&
    (infoIntent || !args.recommendation || !args.recommendation.contextSupported)
  ) {
    parts.push(grounded);
  } else if (!grounded && !args.handoff.handoff && !args.recommendation && infoIntent) {
    parts.push(t.noInfo);
  }

  // 2. Handoff framing.
  if (args.handoff.handoff) {
    const reason = args.handoff.reason
      ? t.handoffReasons[args.handoff.reason]
      : "";
    parts.push([t.handoffLead, reason].filter(Boolean).join(" "));
    parts.push(t.handoffAsk);
    return parts.join("\n\n");
  }

  // 3. Recommendation (hypothesis + why + follow-up question).
  if (args.recommendation) {
    parts.push(t.recommendationLead(args.recommendation.recommendedServiceName));
    if (
      args.recommendation.alternativeServiceName &&
      args.recommendation.confidence < 0.7
    ) {
      parts.push(t.recommendationAlt(args.recommendation.alternativeServiceName));
    }
    if (!args.recommendation.contextSupported) {
      parts.push(t.hypothesis);
    }
    parts.push(args.recommendation.followUpQuestion);
    return parts.join("\n\n");
  }

  // 4. Otherwise, progress the diagnosis with the next useful question.
  if (args.nextField) {
    parts.push(fieldQuestion(args.nextField, args.language));
  } else if (!grounded) {
    parts.push(args.problemDescribed ? t.askProblem : t.greeting);
  }

  return parts.join("\n\n").trim() || t.greeting;
}

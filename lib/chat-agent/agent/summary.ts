import type {
  AgentSession,
  IntentResult,
  Language,
  LeadFacts,
  LeadScore,
  ServiceRecommendation,
} from "./types";

// Structured internal conversation summary for the human handoff payload
// (Flow G / 05_LEAD_QUALIFICATION_AND_SCORING.md). Deterministic — built
// from the agent's own computed state, not by asking the LLM, so it is
// reliable and testable.

export type ConversationSummary = {
  language: Language;
  intent: string;
  business: string;
  industry: string;
  problem: string;
  currentProcess: string;
  desiredOutcome: string;
  recommendedService: string;
  requirements: string;
  timeline: string;
  contact: string;
  leadScore: number;
  leadBand: string;
  openQuestions: string[];
  transcriptDigest: string;
};

const NA = "—";

function firstMeaningfulUserMessage(session: AgentSession): string {
  const msg = session.messages.find((m) => m.role === "user" && m.content.trim().length > 12);
  return msg?.content.trim() ?? session.messages.find((m) => m.role === "user")?.content.trim() ?? NA;
}

function contactLine(facts: LeadFacts): string {
  const parts = [
    facts.name && `Name: ${facts.name}`,
    facts.email && `E-Mail: ${facts.email}`,
    facts.phone && `Telefon: ${facts.phone}`,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : NA;
}

export function buildConversationSummary(args: {
  session: AgentSession;
  intent: IntentResult;
  recommendation: ServiceRecommendation | null;
  leadScore: LeadScore;
  openQuestions: string[];
}): ConversationSummary {
  const { session, intent, recommendation, leadScore, openQuestions } = args;
  const facts = session.qualification.facts;

  const transcriptDigest = session.messages
    .slice(-8)
    .map((m) => `${m.role === "user" ? "Besucher" : "Agent"}: ${m.content.replace(/\s+/g, " ").trim()}`)
    .join("\n");

  return {
    language: session.language,
    intent: intent.category,
    business: facts.company ?? NA,
    industry: facts.industry ?? NA,
    problem: facts.problem ?? firstMeaningfulUserMessage(session),
    currentProcess: facts.currentProcess ?? NA,
    desiredOutcome: facts.desiredOutcome ?? NA,
    recommendedService: recommendation
      ? `${recommendation.recommendedServiceName}${
          recommendation.alternativeServiceName
            ? ` (Alternative: ${recommendation.alternativeServiceName})`
            : ""
        }`
      : NA,
    requirements: facts.relevantTools ?? NA,
    timeline: facts.timeline ?? NA,
    contact: contactLine(facts),
    leadScore: leadScore.total,
    leadBand: leadScore.band,
    openQuestions,
    transcriptDigest,
  };
}

export function renderSummaryText(summary: ConversationSummary): string {
  const lines = [
    `Sprache: ${summary.language.toUpperCase()}`,
    `Intent: ${summary.intent}`,
    `Unternehmen: ${summary.business}`,
    `Branche: ${summary.industry}`,
    `Problem: ${summary.problem}`,
    `Aktueller Prozess: ${summary.currentProcess}`,
    `Gewünschtes Ergebnis: ${summary.desiredOutcome}`,
    `Empfohlene Leistung: ${summary.recommendedService}`,
    `Systeme/Anforderungen: ${summary.requirements}`,
    `Zeithorizont: ${summary.timeline}`,
    `Kontakt: ${summary.contact}`,
    `Lead-Score (intern): ${summary.leadScore}/100 (${summary.leadBand})`,
    summary.openQuestions.length
      ? `Offene Fragen: ${summary.openQuestions.join("; ")}`
      : `Offene Fragen: —`,
    ``,
    `Gesprächsauszug:`,
    summary.transcriptDigest,
  ];
  return lines.join("\n");
}

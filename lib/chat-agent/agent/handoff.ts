import { buildConversationSummary, renderSummaryText } from "./summary";
import type {
  AgentSession,
  HandoffDecision,
  HandoffPayload,
  IntentResult,
  LeadScore,
  ServiceRecommendation,
} from "./types";

// Human-handoff decision + payload (Flow H). The delivery channel is NOT
// implemented here — this module only decides *whether* to hand off and
// produces the structured payload. lib/chat-agent/persistence stores it;
// a notification channel (email/Slack/CRM) is connected later behind
// dispatchHandoff() in the API layer.

const HUMAN_REQUEST_RE =
  /\b(mit (einem )?menschen|echten menschen|mitarbeiter sprechen|berater sprechen|kein bot|talk to (a )?human|speak to (a person|someone|somebody)|real person|human agent)\b/i;

const CUSTOM_QUOTE_RE =
  /\b(individuelles angebot|maßgeschneidert|custom (quote|proposal|offer)|angebot für mein|proposal for|detailliertes angebot|kostenvoranschlag)\b/i;

const LEGAL_RE =
  /\b(vertrag|vertragsbedingungen|agb|kündigen|kündigung|rechtlich|dsgvo-vereinbarung|av-vertrag|contract|terms|cancel my contract|legal|liability|nda)\b/i;

const COMPLAINT_RE =
  /\b(beschwerde|unzufrieden|schlechte erfahrung|enttäuscht|complaint|unhappy|disappointed|not happy with|bad experience|refund)\b/i;

const COMPLEXITY_RE =
  /\b(mehrere systeme|komplexe integration|individuelle schnittstelle|erp|salesforce anbinden|custom integration|complex integration|multiple systems|legacy system|api entwicklung)\b/i;

export function decideHandoff(args: {
  latestMessage: string;
  intent: IntentResult;
  leadScore: LeadScore;
  recommendation: ServiceRecommendation | null;
  uncertainAnswer: boolean;
}): HandoffDecision {
  const { latestMessage, intent, leadScore, recommendation, uncertainAnswer } = args;
  const text = latestMessage;

  if (HUMAN_REQUEST_RE.test(text) || intent.category === "HUMAN_REQUEST") {
    return { handoff: true, reason: "visitor_requested", urgency: "normal" };
  }
  if (COMPLAINT_RE.test(text)) {
    return { handoff: true, reason: "sensitive_complaint", urgency: "high" };
  }
  if (LEGAL_RE.test(text)) {
    return { handoff: true, reason: "contractual_or_legal", urgency: "normal" };
  }
  if (intent.category === "EXISTING_CLIENT" || intent.category === "SUPPORT") {
    return { handoff: true, reason: "existing_client_issue", urgency: "normal" };
  }
  if (CUSTOM_QUOTE_RE.test(text)) {
    return { handoff: true, reason: "custom_quote", urgency: "normal" };
  }
  if (COMPLEXITY_RE.test(text)) {
    return { handoff: true, reason: "complex_project", urgency: "normal" };
  }
  if (leadScore.band === "high_intent") {
    return { handoff: true, reason: "high_intent", urgency: "normal" };
  }
  if (uncertainAnswer && recommendation === null && intent.category !== "OTHER") {
    return { handoff: true, reason: "uncertain_information", urgency: "low" };
  }

  return { handoff: false, reason: null, urgency: "low" };
}

export function buildHandoffPayload(args: {
  session: AgentSession;
  decision: HandoffDecision;
  intent: IntentResult;
  recommendation: ServiceRecommendation | null;
  leadScore: LeadScore;
  openQuestions: string[];
}): HandoffPayload {
  const { session, decision, intent, recommendation, leadScore, openQuestions } = args;

  const summary = buildConversationSummary({
    session,
    intent,
    recommendation,
    leadScore,
    openQuestions,
  });

  return {
    reason: decision.reason ?? "uncertain_information",
    urgency: decision.urgency,
    language: session.language,
    intent: intent.category,
    leadFacts: session.qualification.facts,
    leadScore,
    recommendation,
    conversationSummary: renderSummaryText(summary),
    openQuestions,
    confidence: intent.confidence,
    createdAt: new Date().toISOString(),
  };
}

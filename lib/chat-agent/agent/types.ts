import type { RetrievedChunk } from "../knowledge/types";

export type Language = "de" | "en";

// 16 intent categories from 01_MASTER_SPECIFICATION.md §5.
export type IntentCategory =
  | "GENERAL_INFORMATION"
  | "SERVICE_INFORMATION"
  | "AI_AUTOMATION"
  | "WEBSITE"
  | "SEO"
  | "GOOGLE_BUSINESS_PROFILE"
  | "CONTENT"
  | "DIGITAL_MARKETING"
  | "ADVERTISING"
  | "LEAD_GENERATION"
  | "E_COMMERCE"
  | "PRICING"
  | "PROJECT_REQUEST"
  | "EXISTING_CLIENT"
  | "SUPPORT"
  | "HUMAN_REQUEST"
  | "OTHER";

export type IntentResult = {
  category: IntentCategory;
  confidence: number; // 0..1
  /** Other categories that also matched, strongest first. */
  alternatives: IntentCategory[];
  /** Signal phrases that drove the classification (for eval transparency). */
  matchedSignals: string[];
};

export type ConversationRole = "user" | "assistant";

export type ConversationMessage = {
  role: ConversationRole;
  content: string;
  at: string; // ISO timestamp
};

// Progressively filled as the visitor volunteers information. Never asked
// all at once.
export type LeadFacts = {
  name?: string;
  company?: string;
  industry?: string;
  email?: string;
  phone?: string;
  problem?: string;
  currentProcess?: string;
  desiredOutcome?: string;
  relevantTools?: string;
  timeline?: string;
  budget?: string;
  notes?: string;
};

export type LeadScoreBreakdown = {
  fit: number; // 0..25
  problemClarity: number; // 0..20
  intent: number; // 0..20
  timing: number; // 0..15
  impact: number; // 0..10
  contactWillingness: number; // 0..10
};

export type LeadBand = "informational" | "nurture" | "qualified" | "high_intent";

export type LeadScore = {
  total: number; // 0..100
  band: LeadBand;
  breakdown: LeadScoreBreakdown;
};

export type ServiceRecommendation = {
  problem: string;
  recommendedServiceSlug: string;
  recommendedServiceName: string;
  reason: string;
  alternativeServiceSlug?: string;
  alternativeServiceName?: string;
  followUpQuestion: string;
  confidence: number; // 0..1
  /** True only when context (not a bare keyword) supported the match. */
  contextSupported: boolean;
};

export type HandoffReason =
  | "visitor_requested"
  | "custom_quote"
  | "complex_project"
  | "contractual_or_legal"
  | "sensitive_complaint"
  | "existing_client_issue"
  | "uncertain_information"
  | "high_intent";

export type HandoffDecision = {
  handoff: boolean;
  reason: HandoffReason | null;
  urgency: "low" | "normal" | "high";
};

export type HandoffPayload = {
  reason: HandoffReason;
  urgency: "low" | "normal" | "high";
  language: Language;
  intent: IntentCategory;
  leadFacts: LeadFacts;
  leadScore: LeadScore;
  recommendation: ServiceRecommendation | null;
  conversationSummary: string;
  openQuestions: string[];
  confidence: number;
  createdAt: string;
};

export type GuardrailFinding = {
  kind:
    | "prompt_injection"
    | "system_prompt_probe"
    | "secret_probe"
    | "oversized_input"
    | "empty_input"
    | "repetition_flood"
    | "output_leak";
  severity: "low" | "medium" | "high";
  detail: string;
};

export type QualificationState = {
  facts: LeadFacts;
  score: LeadScore;
  /** Which fact the agent should try to obtain next, if any. */
  nextField: keyof LeadFacts | null;
  /** Fields already asked about, so the agent never repeats a question. */
  askedFields: (keyof LeadFacts)[];
  contactRequested: boolean;
};

export type AgentSession = {
  id: string;
  language: Language;
  messages: ConversationMessage[];
  qualification: QualificationState;
  lastIntent: IntentResult | null;
  lastRecommendation: ServiceRecommendation | null;
  handoffRequested: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AgentTurnInput = {
  session: AgentSession;
  message: string;
};

export type AgentTurnResult = {
  reply: string;
  language: Language;
  intent: IntentResult;
  recommendation: ServiceRecommendation | null;
  retrieved: RetrievedChunk[];
  guardrailFindings: GuardrailFinding[];
  handoff: HandoffPayload | null;
  /** Internal, never sent to the visitor. */
  leadScore: LeadScore;
  usage?: { inputTokens?: number; outputTokens?: number; provider: string; model: string };
  /** Directive block passed to the LLM for transparency in logs/evals. */
  directives: string;
};

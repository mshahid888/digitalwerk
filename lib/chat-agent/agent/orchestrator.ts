import { getChatAgentConfig } from "../config";
import { retrieveForPrompt } from "../knowledge";
import { getLlmProvider, LlmProviderUnavailableError } from "../llm";
import type { LlmMessage, LlmProvider } from "../llm";
import { composeReply } from "./compose-reply";
import { checkInput, checkOutput } from "./guardrails";
import { decideHandoff, buildHandoffPayload } from "./handoff";
import { detectIntent } from "./intent";
import { resolveLanguage } from "./language";
import {
  createQualificationState,
  decideNextField,
  extractFacts,
  scoreLead,
} from "./qualification";
import { recommendService } from "./recommendation";
import { buildSystemPrompt } from "./system-prompt";
import type {
  AgentSession,
  AgentTurnResult,
  Language,
  LeadFacts,
} from "./types";

// The orchestrator runs one visitor turn end to end. Deterministic logic
// (guardrails, language, intent, retrieval, recommendation, scoring,
// handoff) is computed first; the LLM only phrases the final reply, and if
// it is unavailable the deterministic composer's text is used verbatim.

export function createSession(id: string, localeHint: Language = "de"): AgentSession {
  const now = new Date().toISOString();
  return {
    id,
    language: localeHint,
    messages: [],
    qualification: createQualificationState(),
    lastIntent: null,
    lastRecommendation: null,
    handoffRequested: false,
    createdAt: now,
    updatedAt: now,
  };
}

function conversationText(session: AgentSession, latest: string): string {
  const priorUser = session.messages
    .filter((m) => m.role === "user")
    .map((m) => m.content);
  return [...priorUser, latest].join("\n");
}

function problemLooksDescribed(text: string): boolean {
  // A "problem" is described when the visitor states a situation/goal in a
  // full clause, not just a keyword. Heuristic: reasonable length + a verb
  // of wanting/having/struggling.
  if (text.trim().length < 25) return false;
  return /\b(möchten?|will|wollen|brauchen?|haben|hätte|ist|sind|bekommen|verlieren|verpassen|schaffen|kämpfen|kommt|kommen|stellen|suchen|struggl|want|need|have|are|is|get|getting|losing|missing|trying to|can't|cannot|nobody|nothing)\b/i.test(
    text,
  );
}

function buildDirectives(args: {
  language: Language;
  result: Pick<AgentTurnResult, "intent" | "recommendation">;
  nextField: keyof LeadFacts | null;
  handoffReason: string | null;
  fallbackText: string;
}): string {
  const lines = [
    `Detected intent: ${args.result.intent.category} (confidence ${args.result.intent.confidence}).`,
  ];
  if (args.result.recommendation) {
    lines.push(
      `Candidate service: ${args.result.recommendation.recommendedServiceName} — ${args.result.recommendation.reason} Frame it as a hypothesis and ask: "${args.result.recommendation.followUpQuestion}"`,
    );
  }
  if (args.nextField) {
    lines.push(`If natural, work toward learning the visitor's ${args.nextField} — ask at most one question.`);
  }
  if (args.handoffReason) {
    lines.push(
      `Hand off to a human. Reason: ${args.handoffReason}. Briefly say why, then invite the visitor to leave name + email or use info@digitalwerkk.de / WhatsApp.`,
    );
  }
  lines.push(
    `A safe deterministic version of this reply is: "${args.fallbackText}". Stay within the same facts and intent; do not add information beyond the approved knowledge block.`,
  );
  return lines.join("\n");
}

async function generate(
  provider: LlmProvider,
  args: {
    system: string;
    directives: string;
    messages: LlmMessage[];
    fallbackText: string;
  },
): Promise<{ text: string; usage?: AgentTurnResult["usage"] }> {
  const config = getChatAgentConfig();
  try {
    const res = await provider.generate({
      system: args.system,
      directives: args.directives,
      messages: args.messages,
      fallbackText: args.fallbackText,
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens,
    });
    const text = res.text?.trim();
    return {
      text: text && text.length > 0 ? text : args.fallbackText,
      usage: {
        inputTokens: res.usage?.inputTokens,
        outputTokens: res.usage?.outputTokens,
        provider: res.provider,
        model: res.model,
      },
    };
  } catch (error) {
    if (error instanceof LlmProviderUnavailableError) {
      // Graceful degradation — the deterministic composer already produced
      // a spec-aligned reply.
      return {
        text: args.fallbackText,
        usage: { provider: `${provider.id}:unavailable`, model: provider.model },
      };
    }
    throw error;
  }
}

export async function runAgentTurn(
  session: AgentSession,
  rawMessage: string,
  localeHint?: Language,
): Promise<AgentTurnResult> {
  const now = new Date().toISOString();
  const isFirstTurn = session.messages.filter((m) => m.role === "user").length === 0;

  const language = resolveLanguage(rawMessage, localeHint ?? session.language);
  session.language = language;

  const recentUser = session.messages
    .filter((m) => m.role === "user")
    .slice(-4)
    .map((m) => m.content);

  // --- Guardrails (input) ---
  const inputGuard = checkInput(rawMessage, language, recentUser);
  if (inputGuard.block) {
    const safe = inputGuard.safeReply ?? "";
    session.messages.push({ role: "user", content: rawMessage, at: now });
    session.messages.push({ role: "assistant", content: safe, at: now });
    session.updatedAt = now;
    const emptyIntent = detectIntent("");
    return {
      reply: safe,
      language,
      intent: emptyIntent,
      recommendation: null,
      retrieved: [],
      guardrailFindings: inputGuard.findings,
      handoff: null,
      leadScore: session.qualification.score,
      directives: "blocked-by-input-guardrail",
    };
  }

  // --- Understanding ---
  const intent = detectIntent(rawMessage);
  const convText = conversationText(session, rawMessage);
  const problemDescribed =
    problemLooksDescribed(rawMessage) ||
    problemLooksDescribed(convText) ||
    Boolean(session.qualification.facts.problem);

  const { chunks, contextBlock } = retrieveForPrompt(rawMessage, language, 4);

  const recommendation = recommendService({
    conversationText: convText,
    language,
    hasProblemContext: problemDescribed,
  });

  // --- Qualification (progressive) ---
  const facts = extractFacts(rawMessage, session.qualification.facts);
  if (!facts.problem && problemDescribed && rawMessage.trim().length >= 25) {
    facts.problem = rawMessage.trim().slice(0, 400);
  }
  session.qualification.facts = facts;

  const leadScore = scoreLead({
    facts,
    intent,
    recommendation,
    conversationText: convText,
    problemDescribed,
    turnsFromVisitor: recentUser.length + 1,
  });
  session.qualification.score = leadScore;

  const readyForContact =
    intent.category === "PROJECT_REQUEST" ||
    intent.category === "HUMAN_REQUEST" ||
    leadScore.band === "qualified" ||
    leadScore.band === "high_intent" ||
    /\b(kontakt|melden|angebot|call me|contact me|reach out)\b/i.test(rawMessage);

  const nextField = decideNextField(session.qualification, {
    problemDescribed,
    readyForContact,
  });

  // --- Handoff decision ---
  const uncertainAnswer = chunks.length === 0 && intent.category !== "OTHER";
  const handoffDecision = decideHandoff({
    latestMessage: rawMessage,
    intent,
    leadScore,
    recommendation,
    uncertainAnswer,
  });

  // --- Compose deterministic reply (fallback + mock provider source) ---
  const fallbackText = composeReply({
    language,
    intent,
    retrieved: chunks,
    recommendation,
    qualification: session.qualification,
    nextField,
    handoff: handoffDecision,
    problemDescribed,
    isFirstTurn,
  });

  // --- LLM phrasing ---
  const system = buildSystemPrompt({ language, knowledgeContext: contextBlock });
  const directives = buildDirectives({
    language,
    result: { intent, recommendation },
    nextField,
    handoffReason: handoffDecision.handoff ? handoffDecision.reason : null,
    fallbackText,
  });

  const config = getChatAgentConfig();
  const history: LlmMessage[] = session.messages
    .slice(-config.maxHistoryTurns)
    .map((m) => ({ role: m.role, content: m.content }));
  history.push({ role: "user", content: rawMessage });

  const provider = getLlmProvider();
  const generated = await generate(provider, {
    system,
    directives,
    messages: history,
    fallbackText,
  });

  // --- Guardrails (output) ---
  const outputGuard = checkOutput(generated.text, language);
  const reply = outputGuard.text;

  // --- Handoff payload ---
  const openQuestions: string[] = [];
  if (nextField) openQuestions.push(`Missing: ${nextField}`);
  if (!facts.company && intent.category !== "GENERAL_INFORMATION") {
    openQuestions.push("Missing: company");
  }

  let handoffPayload = null;
  if (handoffDecision.handoff) {
    session.handoffRequested = true;
    handoffPayload = buildHandoffPayload({
      session: { ...session, messages: [...session.messages, { role: "user", content: rawMessage, at: now }] },
      decision: handoffDecision,
      intent,
      recommendation,
      leadScore,
      openQuestions,
    });
  }

  // --- Persist turn on the session object ---
  session.messages.push({ role: "user", content: rawMessage, at: now });
  session.messages.push({ role: "assistant", content: reply, at: now });
  session.lastIntent = intent;
  session.lastRecommendation = recommendation;
  if (nextField && !session.qualification.askedFields.includes(nextField)) {
    session.qualification.askedFields.push(nextField);
  }
  if (readyForContact) session.qualification.contactRequested = true;
  session.updatedAt = now;

  return {
    reply,
    language,
    intent,
    recommendation,
    retrieved: chunks,
    guardrailFindings: [...inputGuard.findings, ...outputGuard.findings],
    handoff: handoffPayload,
    leadScore,
    usage: generated.usage,
    directives,
  };
}

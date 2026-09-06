import { randomUUID } from "node:crypto";
import { buildHandoffPayload, createSession, runAgentTurn } from "./agent";
import type {
  AgentSession,
  AgentTurnResult,
  HandoffPayload,
  HandoffReason,
  Language,
  LeadFacts,
} from "./agent/types";
import { getChatAgentConfig } from "./config";
import { getChatAgentStore } from "./persistence";
import type { StoredHandoff, StoredLead } from "./persistence/types";

// Application service layer used by the API routes. Wires the pure agent
// orchestrator to the persistence store and to (future) outbound
// notification. Nothing here calls a paid service directly.

export type StartSessionResult = {
  sessionId: string;
  language: Language;
  greeting: string;
};

export async function startSession(localeHint?: Language): Promise<StartSessionResult> {
  const store = getChatAgentStore();
  const id = randomUUID();
  const session = createSession(id, localeHint ?? "de");
  await store.conversations.create(session);
  await store.events.record({
    id: randomUUID(),
    sessionId: id,
    at: new Date().toISOString(),
    type: "session_started",
    metadata: { locale: localeHint ?? "de" },
  });

  const greeting =
    (localeHint ?? "de") === "en"
      ? "Hi! I'm the DigitalWerk assistant. What can I help you with — a question about DigitalWerk, or a challenge in your business?"
      : "Hallo! Ich bin der DigitalWerk-Assistent. Womit kann ich helfen – eine Frage zu DigitalWerk oder eine Herausforderung in Ihrem Unternehmen?";

  return { sessionId: id, language: localeHint ?? "de", greeting };
}

export type HandleMessageResult = {
  reply: string;
  language: Language;
  handoffRequested: boolean;
  messageCount: number;
  /** True once the session hits its message cap (abuse guard). */
  limitReached: boolean;
};

export async function handleMessage(
  sessionId: string,
  message: string,
  localeHint?: Language,
): Promise<HandleMessageResult | { error: "session_not_found" }> {
  const store = getChatAgentStore();
  const config = getChatAgentConfig();
  const session = await store.conversations.get(sessionId);
  if (!session) return { error: "session_not_found" };

  const visitorMessages = session.messages.filter((m) => m.role === "user").length;
  if (visitorMessages >= config.maxMessagesPerSession) {
    return {
      reply:
        session.language === "en"
          ? "We've covered a lot here. To take this further, the DigitalWerk team can pick it up directly — reach them at info@digitalwerkk.de or on WhatsApp."
          : "Wir haben hier schon viel besprochen. Für die nächsten Schritte übernimmt am besten das DigitalWerk-Team direkt – erreichbar unter info@digitalwerkk.de oder per WhatsApp.",
      language: session.language,
      handoffRequested: session.handoffRequested,
      messageCount: visitorMessages,
      limitReached: true,
    };
  }

  const result = await runAgentTurn(session, message, localeHint);
  await store.conversations.save(session);

  await store.events.record({
    id: randomUUID(),
    sessionId,
    at: new Date().toISOString(),
    type: "message_handled",
    metadata: {
      intent: result.intent.category,
      language: result.language,
      leadBand: result.leadScore.band,
      recommended: result.recommendation?.recommendedServiceSlug ?? "",
      guardrail: result.guardrailFindings.map((f) => f.kind).join(",") || "none",
      provider: result.usage?.provider ?? "unknown",
    },
  });

  // Auto-capture a lead once there is enough signal, and auto-create a
  // handoff record when the agent decided to escalate.
  if (result.leadScore.band !== "informational") {
    await upsertLeadFromSession(session, result);
  }
  if (result.handoff) {
    await createHandoffRecord(session, result.handoff);
  }

  return {
    reply: result.reply,
    language: result.language,
    handoffRequested: Boolean(result.handoff) || session.handoffRequested,
    messageCount: visitorMessages + 1,
    limitReached: false,
  };
}

async function upsertLeadFromSession(
  session: AgentSession,
  result: AgentTurnResult,
): Promise<StoredLead> {
  const store = getChatAgentStore();
  const existing = await store.leads.getBySession(session.id);
  const now = new Date().toISOString();

  const lead: StoredLead = {
    id: existing?.id ?? randomUUID(),
    sessionId: session.id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    facts: session.qualification.facts,
    score: result.leadScore,
    intent: result.intent.category,
    recommendedServiceSlug: result.recommendation?.recommendedServiceSlug ?? null,
    conversationSummary: result.handoff?.conversationSummary ?? existing?.conversationSummary ?? "",
    status: existing?.status ?? "new",
  };
  return store.leads.upsert(lead);
}

async function createHandoffRecord(
  session: AgentSession,
  payload: HandoffPayload,
): Promise<StoredHandoff> {
  const store = getChatAgentStore();
  const lead = await store.leads.getBySession(session.id);
  const handoff: StoredHandoff = {
    id: randomUUID(),
    sessionId: session.id,
    leadId: lead?.id ?? null,
    createdAt: new Date().toISOString(),
    payload,
    dispatched: false,
    dispatchChannel: null,
  };
  const created = await store.handoffs.create(handoff);
  await store.events.record({
    id: randomUUID(),
    sessionId: session.id,
    at: created.createdAt,
    type: "handoff_created",
    metadata: { reason: payload.reason, urgency: payload.urgency },
  });
  await dispatchHandoff(created);
  return created;
}

// Outbound notification seam. Not connected to a channel yet — a future
// implementation sends the payload by email (reuse the Resend pattern in
// app/api/kontakt/route.ts), Slack, or a CRM. Until then the handoff is
// durably recorded and visible via the admin/handoff listing.
export async function dispatchHandoff(handoff: StoredHandoff): Promise<void> {
  const channel = process.env.CHAT_AGENT_HANDOFF_CHANNEL?.trim();
  if (!channel) {
    // No channel configured — the record stands, nothing is sent.
    return;
  }
  // Placeholder: real dispatch is implemented when a channel + credentials
  // are provided. Deliberately a no-op that only marks intent.
  await getChatAgentStore().handoffs.markDispatched(
    handoff.id,
    `pending:${channel}`,
  );
}

export type RequestHandoffResult = {
  handoffId: string;
  status: "recorded" | "recorded_pending_dispatch";
  message: string;
};

// Explicit "talk to a human" action from the widget. Forces a handoff from
// the session's current computed state without needing a new visitor turn.
export async function requestHandoff(
  sessionId: string,
  opts?: { reason?: HandoffReason; note?: string },
): Promise<RequestHandoffResult | { error: "session_not_found" }> {
  const store = getChatAgentStore();
  const session = await store.conversations.get(sessionId);
  if (!session) return { error: "session_not_found" };

  if (opts?.note) {
    session.qualification.facts.notes = [
      session.qualification.facts.notes,
      opts.note.slice(0, 1000),
    ]
      .filter(Boolean)
      .join(" | ");
  }
  session.handoffRequested = true;
  await store.conversations.save(session);

  const payload = buildHandoffPayload({
    session,
    decision: {
      handoff: true,
      reason: opts?.reason ?? "visitor_requested",
      urgency: "normal",
    },
    intent: session.lastIntent ?? {
      category: "HUMAN_REQUEST",
      confidence: 1,
      alternatives: [],
      matchedSignals: [],
    },
    recommendation: session.lastRecommendation,
    leadScore: session.qualification.score,
    openQuestions: [],
  });

  const record = await createHandoffRecord(session, payload);
  return {
    handoffId: record.id,
    status: record.dispatched ? "recorded_pending_dispatch" : "recorded",
    message:
      session.language === "en"
        ? "Thanks — I've passed your conversation to the DigitalWerk team. They usually reply within one business day. You can also reach them at info@digitalwerkk.de or on WhatsApp."
        : "Danke – ich habe Ihr Gespräch an das DigitalWerk-Team übergeben. Es meldet sich in der Regel innerhalb eines Werktages. Sie erreichen es auch unter info@digitalwerkk.de oder per WhatsApp.",
  };
}

export type UpdateLeadInput = {
  sessionId: string;
  facts: Partial<LeadFacts>;
};

export async function updateLeadFacts(
  input: UpdateLeadInput,
): Promise<StoredLead | { error: "session_not_found" }> {
  const store = getChatAgentStore();
  const session = await store.conversations.get(input.sessionId);
  if (!session) return { error: "session_not_found" };

  session.qualification.facts = { ...session.qualification.facts, ...input.facts };
  await store.conversations.save(session);

  const existing = await store.leads.getBySession(input.sessionId);
  const now = new Date().toISOString();
  const lead: StoredLead = {
    id: existing?.id ?? randomUUID(),
    sessionId: input.sessionId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    facts: session.qualification.facts,
    score: session.qualification.score,
    intent: session.lastIntent?.category ?? "OTHER",
    recommendedServiceSlug: session.lastRecommendation?.recommendedServiceSlug ?? null,
    conversationSummary: existing?.conversationSummary ?? "",
    status: existing?.status ?? "new",
  };
  return store.leads.upsert(lead);
}

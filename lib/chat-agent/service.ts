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
import {
  getNotificationChannel,
  renderHandoffNotification,
  renderLeadNotification,
} from "./notifications";
import { getChatAgentStore } from "./persistence";
import type { ChatAgentStore, StoredHandoff, StoredLead } from "./persistence/types";

// Application service used by the API routes. Wires the pure agent
// orchestrator to the persistence store and the notification channel.
// Nothing here calls a paid service directly — the LLM provider and the
// notification channel each degrade safely when their credentials are absent.

// A repeat "talk to a human" within this window reuses the existing handoff
// record instead of creating (and notifying about) a duplicate.
const HANDOFF_DEDUP_WINDOW_MS = 10 * 60 * 1000;

// --------------------------------------------------------------- sessions

export type StartSessionResult = {
  sessionId: string;
  language: Language;
  greeting: string;
};

export async function startSession(localeHint?: Language): Promise<StartSessionResult> {
  const store = await getChatAgentStore();
  const id = randomUUID();
  const session = createSession(id, localeHint ?? "de");
  await store.conversations.create(session);
  await recordEvent(store, id, "session_started", { locale: localeHint ?? "de" });

  const greeting =
    (localeHint ?? "de") === "en"
      ? "Hi! I'm the DigitalWerk assistant. What can I help you with — a question about DigitalWerk, or a challenge in your business?"
      : "Hallo! Ich bin der DigitalWerk-Assistent. Womit kann ich helfen – eine Frage zu DigitalWerk oder eine Herausforderung in Ihrem Unternehmen?";

  return { sessionId: id, language: localeHint ?? "de", greeting };
}

// ---------------------------------------------------------------- messages

export type HandleMessageResult = {
  reply: string;
  language: Language;
  handoffRequested: boolean;
  messageCount: number;
  limitReached: boolean;
};

export async function handleMessage(
  sessionId: string,
  message: string,
  localeHint?: Language,
): Promise<HandleMessageResult | { error: "session_not_found" }> {
  const store = await getChatAgentStore();
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

  await recordEvent(store, sessionId, "message_handled", {
    intent: result.intent.category,
    language: result.language,
    leadBand: result.leadScore.band,
    recommended: result.recommendation?.recommendedServiceSlug ?? "",
    guardrail: result.guardrailFindings.map((f) => f.kind).join(",") || "none",
    provider: result.usage?.provider ?? "unknown",
  });

  // Capture / update the lead once there is enough signal.
  if (result.leadScore.band !== "informational") {
    const lead = await upsertLeadFromSession(store, session, result);
    // Notify only when the lead is genuinely qualified, and only once.
    if (
      (result.leadScore.band === "qualified" || result.leadScore.band === "high_intent") &&
      !(await alreadyNotified(store, sessionId, "lead_notification_sent"))
    ) {
      await sendLeadNotification(store, lead);
    }
  }

  // Create + dispatch a handoff when the agent decided to escalate.
  if (result.handoff) {
    await ensureHandoff(store, session, result.handoff);
  }

  return {
    reply: result.reply,
    language: result.language,
    handoffRequested: Boolean(result.handoff) || session.handoffRequested,
    messageCount: visitorMessages + 1,
    limitReached: false,
  };
}

// ------------------------------------------------------------- explicit handoff

export type RequestHandoffResult = {
  handoffId: string;
  status: "recorded" | "sent" | "queued";
  message: string;
};

export async function requestHandoff(
  sessionId: string,
  opts?: { reason?: HandoffReason; note?: string },
): Promise<RequestHandoffResult | { error: "session_not_found" }> {
  const store = await getChatAgentStore();
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

  const record = await ensureHandoff(store, session, payload);

  return {
    handoffId: record.id,
    status: record.dispatched ? "sent" : "queued",
    message:
      session.language === "en"
        ? "Thanks — I've passed your conversation to the DigitalWerk team. They usually reply within one business day. You can also reach them at info@digitalwerkk.de or on WhatsApp."
        : "Danke – ich habe Ihr Gespräch an das DigitalWerk-Team übergeben. Es meldet sich in der Regel innerhalb eines Werktages. Sie erreichen es auch unter info@digitalwerkk.de oder per WhatsApp.",
  };
}

// ------------------------------------------------------------------- leads

export type UpdateLeadInput = {
  sessionId: string;
  facts: Partial<LeadFacts>;
};

export async function updateLeadFacts(
  input: UpdateLeadInput,
): Promise<StoredLead | { error: "session_not_found" }> {
  const store = await getChatAgentStore();
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

// --------------------------------------------------------------- retention

export async function purgeExpiredData(): Promise<{
  transcriptsPurged: number;
  eventsPurged: number;
  retentionDays: number;
}> {
  const store = await getChatAgentStore();
  const config = getChatAgentConfig();
  const result = await store.conversations.purgeExpired({
    transcriptRetentionDays: config.transcriptRetentionDays,
    eventRetentionDays: config.eventRetentionDays,
  });
  return { ...result, retentionDays: config.transcriptRetentionDays };
}

// ------------------------------------------------------------ dispatch / retry

export async function retryPendingHandoffs(limit = 25): Promise<{
  attempted: number;
  sent: number;
  stillPending: number;
  skipped?: "channel_not_ready";
}> {
  const store = await getChatAgentStore();
  const config = getChatAgentConfig();

  // Nothing to retry against if there is no working channel — the records
  // stay queued and visible in the admin listing until one is configured.
  if (!getNotificationChannel().ready) {
    const pendingCount = (await store.handoffs.listPendingDispatch({ limit: 500 })).length;
    return { attempted: 0, sent: 0, stillPending: pendingCount, skipped: "channel_not_ready" };
  }

  const pending = await store.handoffs.listPendingDispatch({
    maxAttempts: config.notificationMaxAttempts,
    limit,
  });
  let sent = 0;
  for (const handoff of pending) {
    const ok = await dispatchHandoffRecord(store, handoff);
    if (ok) sent += 1;
  }
  return {
    attempted: pending.length,
    sent,
    stillPending: pending.length - sent,
  };
}

/**
 * Backwards-compatible export. Attempts delivery of a single handoff record.
 */
export async function dispatchHandoff(handoff: StoredHandoff): Promise<void> {
  const store = await getChatAgentStore();
  await dispatchHandoffRecord(store, handoff);
}

// ------------------------------------------------------------ admin listing

export async function listLeads(opts?: {
  limit?: number;
  status?: StoredLead["status"];
}): Promise<StoredLead[]> {
  const store = await getChatAgentStore();
  return store.leads.list(opts);
}

export async function listHandoffs(opts?: { limit?: number }): Promise<StoredHandoff[]> {
  const store = await getChatAgentStore();
  return store.handoffs.list(opts);
}

// ----------------------------------------------------------------- internals

async function recordEvent(
  store: ChatAgentStore,
  sessionId: string,
  type: string,
  metadata: Record<string, string | number | boolean>,
): Promise<void> {
  try {
    await store.events.record({
      id: randomUUID(),
      sessionId,
      at: new Date().toISOString(),
      type,
      metadata,
    });
  } catch (error) {
    // Analytics must never break a conversation turn.
    console.error(`Chat agent: failed to record event ${type}:`, error);
  }
}

async function alreadyNotified(
  store: ChatAgentStore,
  sessionId: string,
  eventType: string,
): Promise<boolean> {
  try {
    const events = await store.events.list(sessionId);
    return events.some((e) => e.type === eventType);
  } catch {
    return false;
  }
}

async function upsertLeadFromSession(
  store: ChatAgentStore,
  session: AgentSession,
  result: AgentTurnResult,
): Promise<StoredLead> {
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
    conversationSummary:
      result.handoff?.conversationSummary ?? existing?.conversationSummary ?? "",
    status: existing?.status ?? "new",
  };
  return store.leads.upsert(lead);
}

/**
 * Create a handoff record (deduplicating repeats within a short window) and
 * attempt to deliver its notification. Retry-safe: a failed send leaves the
 * record queued (listPendingDispatch) rather than losing it.
 */
async function ensureHandoff(
  store: ChatAgentStore,
  session: AgentSession,
  payload: HandoffPayload,
): Promise<StoredHandoff> {
  const since = new Date(Date.now() - HANDOFF_DEDUP_WINDOW_MS).toISOString();
  const existing = await store.handoffs.findRecentForSession(session.id, since);
  if (existing && existing.reason === payload.reason) {
    // Duplicate request — do not create a second record or send again.
    return existing;
  }

  const lead = await store.leads.getBySession(session.id);
  const created = await store.handoffs.create({
    id: randomUUID(),
    sessionId: session.id,
    leadId: lead?.id ?? null,
    createdAt: new Date().toISOString(),
    reason: payload.reason,
    payload,
    dispatched: false,
    dispatchChannel: null,
    dispatchAttempts: 0,
    dispatchedAt: null,
    lastDispatchError: null,
  });

  await recordEvent(store, session.id, "handoff_created", {
    handoffId: created.id,
    reason: payload.reason,
    urgency: payload.urgency,
  });

  await dispatchHandoffRecord(store, created);
  return (await store.handoffs.get(created.id)) ?? created;
}

async function dispatchHandoffRecord(
  store: ChatAgentStore,
  handoff: StoredHandoff,
): Promise<boolean> {
  if (handoff.dispatched) return true;

  const channel = getNotificationChannel();
  const message = renderHandoffNotification(handoff.id, handoff.payload);
  const result = await channel.send(message);

  if (result.ok) {
    await store.handoffs.recordDispatchAttempt(handoff.id, {
      ok: true,
      channel: result.channel,
      at: result.at,
    });
    await recordEvent(store, handoff.sessionId, "handoff_dispatched", {
      handoffId: handoff.id,
      channel: result.channel,
    });
    return true;
  }

  await store.handoffs.recordDispatchAttempt(handoff.id, {
    ok: false,
    error: result.error,
  });
  return false;
}

async function sendLeadNotification(
  store: ChatAgentStore,
  lead: StoredLead,
): Promise<void> {
  const channel = getNotificationChannel();
  const result = await channel.send(renderLeadNotification(lead));

  // Exactly one lead-notification attempt per lead, ever. The
  // `lead_notification_sent` event is the idempotency marker and is
  // recorded regardless of outcome — the durable lead record and the admin
  // listing are the source of truth, so a failed ping is not retried and
  // never becomes a duplicate. (Handoffs, which are the critical path, do
  // have a retry queue — see dispatchHandoffRecord / retryPendingHandoffs.)
  await recordEvent(store, lead.sessionId, "lead_notification_sent", {
    leadId: lead.id,
    channel: result.channel,
    ok: result.ok,
  });
}

import { beforeEach, describe, expect, it } from "vitest";
import {
  handleMessage,
  purgeExpiredData,
  requestHandoff,
  startSession,
  updateLeadFacts,
} from "@/lib/chat-agent/service";
import {
  getChatAgentStore,
  resetChatAgentStore,
} from "@/lib/chat-agent/persistence";
import { resetLlmProviderCache } from "@/lib/chat-agent/llm";
import { resetNotificationChannelCache } from "@/lib/chat-agent/notifications";

beforeEach(() => {
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.CHAT_AGENT_PROVIDER;
  delete process.env.CHAT_AGENT_HANDOFF_CHANNEL;
  delete process.env.RESEND_API_KEY;
  delete process.env.CHAT_AGENT_DATABASE_URL;
  delete process.env.DATABASE_URL;
  resetLlmProviderCache();
  resetNotificationChannelCache();
  resetChatAgentStore();
});

describe("chat agent service layer", () => {
  it("starts a session and persists it", async () => {
    const { sessionId, greeting } = await startSession("de");
    expect(sessionId).toHaveLength(36);
    expect(greeting).toBeTruthy();
    const store = await getChatAgentStore();
    expect(store.kind).toBe("memory");
    expect(await store.conversations.get(sessionId)).not.toBeNull();
  });

  it("handles a message and records an analytics event", async () => {
    const { sessionId } = await startSession("de");
    const result = await handleMessage(sessionId, "Welche Leistungen bietet ihr an?");
    expect("reply" in result && result.reply.length).toBeTruthy();
    const events = await (await getChatAgentStore()).events.list(sessionId);
    expect(events.some((e) => e.type === "message_handled")).toBe(true);
  });

  it("auto-captures a lead once the score leaves the informational band", async () => {
    const { sessionId } = await startSession("de");
    await handleMessage(
      sessionId,
      "Wir wollen so schnell wie möglich einen KI-Agenten für Terminbuchung, bitte ein Angebot. Ich bin Inhaber, E-Mail: chef@example.com",
    );
    const lead = await (await getChatAgentStore()).leads.getBySession(sessionId);
    expect(lead).not.toBeNull();
    expect(lead?.facts.email).toBe("chef@example.com");
    expect(lead?.recommendedServiceSlug).toBe("ki-agenten");
  });

  it("creates a durable handoff record on escalation, queued when no channel is set", async () => {
    const { sessionId } = await startSession("de");
    await handleMessage(sessionId, "Ich will mit einem echten Menschen sprechen.");
    const handoffs = await (await getChatAgentStore()).handoffs.list();
    expect(handoffs).toHaveLength(1);
    expect(handoffs[0].reason).toBe("visitor_requested");
    expect(handoffs[0].payload.conversationSummary).toContain("Intent");
    expect(handoffs[0].dispatched).toBe(false);
    expect(handoffs[0].dispatchAttempts).toBeGreaterThanOrEqual(1);
    expect(handoffs[0].lastDispatchError).toContain("not configured");
  });

  it("does not create a duplicate handoff for a repeated request", async () => {
    const { sessionId } = await startSession("de");
    await handleMessage(sessionId, "Ich möchte mit einem Menschen sprechen.");
    await requestHandoff(sessionId, { reason: "visitor_requested" });
    await requestHandoff(sessionId, { reason: "visitor_requested" });
    const handoffs = await (await getChatAgentStore()).handoffs.list();
    expect(handoffs).toHaveLength(1);
  });

  it("enforces the per-session message cap", async () => {
    const { sessionId } = await startSession("en");
    let last: Awaited<ReturnType<typeof handleMessage>> | null = null;
    for (let i = 0; i < 41; i += 1) {
      last = await handleMessage(sessionId, `question number ${i}`);
    }
    expect(last && "limitReached" in last && last.limitReached).toBe(true);
  });

  it("updateLeadFacts merges explicit form input", async () => {
    const { sessionId } = await startSession("de");
    const result = await updateLeadFacts({
      sessionId,
      facts: { name: "Anna Muster", email: "anna@example.com", company: "Muster GmbH" },
    });
    expect("id" in result).toBe(true);
    const lead = await (await getChatAgentStore()).leads.getBySession(sessionId);
    expect(lead?.facts.company).toBe("Muster GmbH");
  });

  it("requestHandoff forces an escalation from current state", async () => {
    const { sessionId } = await startSession("en");
    await handleMessage(sessionId, "We need a new website, it's very outdated.");
    const result = await requestHandoff(sessionId, {
      reason: "custom_quote",
      note: "prefers a call",
    });
    expect("handoffId" in result).toBe(true);
    const handoffs = await (await getChatAgentStore()).handoffs.list();
    expect(handoffs.length).toBeGreaterThanOrEqual(1);
    expect(handoffs.at(0)?.payload.leadFacts.notes).toContain("prefers a call");
  });

  it("records a lead notification attempt exactly once for a qualified lead", async () => {
    const { sessionId } = await startSession("de");
    const strong =
      "Wir verlieren Kunden, weil niemand ans Telefon geht. Wir brauchen dringend einen KI-Agenten und ein Angebot. Ich bin Geschäftsführer, E-Mail: chef@example.com";
    await handleMessage(sessionId, strong);
    await handleMessage(sessionId, "Können Sie mir dazu mehr sagen?");
    const events = await (await getChatAgentStore()).events.list(sessionId);
    const notified = events.filter((e) => e.type === "lead_notification_sent");
    expect(notified).toHaveLength(1);
  });

  it("purgeExpiredData clears old transcripts but keeps the lead record", async () => {
    const { sessionId } = await startSession("de");
    await handleMessage(
      sessionId,
      "Wir brauchen dringend einen KI-Agenten, ich bin Inhaber, E-Mail: a@b.de",
    );
    const store = await getChatAgentStore();

    // Age the session past the 30-day window.
    const session = await store.conversations.get(sessionId);
    if (session) {
      session.createdAt = new Date(Date.now() - 40 * 864e5).toISOString();
      await store.conversations.save(session);
    }

    const result = await purgeExpiredData();
    expect(result.transcriptsPurged).toBe(1);
    expect(result.retentionDays).toBe(30);

    const after = await store.conversations.get(sessionId);
    expect(after?.messages).toHaveLength(0);
    const lead = await store.leads.getBySession(sessionId);
    expect(lead?.facts.email).toBe("a@b.de");
  });

  it("returns session_not_found for an unknown session", async () => {
    const result = await handleMessage("does-not-exist-123456", "hi");
    expect(result).toEqual({ error: "session_not_found" });
  });
});

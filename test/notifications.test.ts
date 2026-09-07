import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getNotificationChannel,
  resetNotificationChannelCache,
} from "@/lib/chat-agent/notifications";
import { NoopNotificationChannel } from "@/lib/chat-agent/notifications/noop-channel";
import { ResendNotificationChannel } from "@/lib/chat-agent/notifications/resend-channel";
import {
  renderHandoffNotification,
  renderLeadNotification,
} from "@/lib/chat-agent/notifications/templates";
import type { HandoffPayload } from "@/lib/chat-agent/agent/types";
import type { StoredLead } from "@/lib/chat-agent/persistence/types";

const ENV = ["CHAT_AGENT_HANDOFF_CHANNEL", "RESEND_API_KEY", "CHAT_AGENT_NOTIFY_TO", "CHAT_AGENT_NOTIFY_FROM"];
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const k of ENV) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  resetNotificationChannelCache();
});
afterEach(() => {
  for (const k of ENV) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  resetNotificationChannelCache();
  vi.restoreAllMocks();
});

const payload: HandoffPayload = {
  reason: "visitor_requested",
  urgency: "high",
  language: "de",
  intent: "AI_AUTOMATION",
  leadFacts: { name: "Anna Muster", company: "Muster GmbH", email: "anna@muster.de", problem: "zu viele Anrufe" },
  leadScore: {
    total: 72,
    band: "qualified",
    breakdown: { fit: 25, problemClarity: 20, intent: 10, timing: 8, impact: 5, contactWillingness: 4 },
  },
  recommendation: {
    problem: "x",
    recommendedServiceSlug: "ki-agenten",
    recommendedServiceName: "KI-Agenten",
    reason: "y",
    followUpQuestion: "z",
    confidence: 0.8,
    contextSupported: true,
  },
  conversationSummary: "Intent: AI_AUTOMATION\nUnternehmen: Muster GmbH",
  openQuestions: ["Missing: timeline"],
  confidence: 0.8,
  createdAt: new Date().toISOString(),
};

describe("notification channel selection", () => {
  it("is a no-op channel when nothing is configured", () => {
    const channel = getNotificationChannel();
    expect(channel).toBeInstanceOf(NoopNotificationChannel);
    expect(channel.ready).toBe(false);
  });

  it("is a no-op channel when channel=resend but no key is set", () => {
    process.env.CHAT_AGENT_HANDOFF_CHANNEL = "resend";
    resetNotificationChannelCache();
    const channel = getNotificationChannel();
    expect(channel.ready).toBe(false);
    expect(channel.id).toBe("noop");
  });

  it("is a live Resend channel when channel=resend and a key is set", () => {
    process.env.CHAT_AGENT_HANDOFF_CHANNEL = "resend";
    process.env.RESEND_API_KEY = "re_test_not_real";
    resetNotificationChannelCache();
    const channel = getNotificationChannel();
    expect(channel).toBeInstanceOf(ResendNotificationChannel);
    expect(channel.ready).toBe(true);
  });
});

describe("NoopNotificationChannel", () => {
  it("never throws and returns a retryable failure", async () => {
    const result = await new NoopNotificationChannel("test").send({
      kind: "handoff",
      subject: "s",
      text: "t",
      referenceId: "ref-1",
    });
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.retryable).toBe(true);
  });
});

describe("ResendNotificationChannel", () => {
  it("returns a retryable failure without a key and never calls fetch", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = await new ResendNotificationChannel({
      apiKey: undefined,
      to: "a@b.de",
      from: "c@d.de",
    }).send({ kind: "lead", subject: "s", text: "t", referenceId: "ref" });
    expect(result.ok).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("posts to the Resend API and reports success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "email_123" }), { status: 200 }),
    );
    const channel = new ResendNotificationChannel({
      apiKey: "re_test",
      to: "team@digitalwerkk.de",
      from: "bot@digitalwerkk.de",
    });
    const result = await channel.send({
      kind: "handoff",
      subject: "s",
      text: "t",
      referenceId: "h1",
      replyTo: "visitor@x.de",
    });
    expect(result.ok).toBe(true);
    expect(result.ok && result.id).toBe("email_123");
  });

  it("treats a 500 as retryable and a 422 as non-retryable", async () => {
    const channel = new ResendNotificationChannel({ apiKey: "re_test", to: "a@b.de", from: "c@d.de" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("boom", { status: 500 }));
    const r1 = await channel.send({ kind: "lead", subject: "s", text: "t", referenceId: "r" });
    expect(r1.ok === false && r1.retryable).toBe(true);

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("bad", { status: 422 }));
    const r2 = await channel.send({ kind: "lead", subject: "s", text: "t", referenceId: "r" });
    expect(r2.ok === false && r2.retryable).toBe(false);
  });
});

// A realistic stored summary: structured fields, then the verbatim excerpt
// block that buildConversationSummary / renderSummaryText actually append.
const SECRET_VISITOR_PHRASE = "unsere Umsätze sind letztes Quartal eingebrochen";
const SUMMARY_WITH_TRANSCRIPT = [
  "Sprache: DE",
  "Intent: PRICING",
  "Unternehmen: Muster GmbH",
  "Lead-Score (intern): 72/100 (qualified)",
  "",
  "Gesprächsauszug:",
  `Besucher: ${SECRET_VISITOR_PHRASE}, könnt ihr helfen?`,
  "Agent: KI-Agenten: 699 € Einrichtung ...",
].join("\n");

describe("notification templates", () => {
  it("renders a handoff email with the minimal fields and NO verbatim transcript", () => {
    const msg = renderHandoffNotification("h-1", {
      ...payload,
      conversationSummary: SUMMARY_WITH_TRANSCRIPT,
    });
    expect(msg.subject).toContain("Anna Muster");
    expect(msg.subject).toContain("DRINGEND");
    expect(msg.text).toContain("Muster GmbH");
    expect(msg.text).toContain("72/100");
    // structured summary kept, verbatim visitor messages stripped
    expect(msg.text).toContain("Intent: PRICING");
    expect(msg.text).not.toContain("Gesprächsauszug:");
    expect(msg.text).not.toContain(SECRET_VISITOR_PHRASE);
    expect(msg.replyTo).toBe("anna@muster.de");
    expect(msg.referenceId).toBe("h-1");
  });

  it("renders a lead email without the verbatim transcript block", () => {
    const lead: StoredLead = {
      id: "lead-1",
      sessionId: "s-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      facts: { name: "Ben", email: "ben@x.de", company: "X" },
      score: {
        total: 60,
        band: "qualified",
        breakdown: { fit: 20, problemClarity: 15, intent: 10, timing: 8, impact: 3, contactWillingness: 4 },
      },
      intent: "SEO",
      recommendedServiceSlug: "seo",
      conversationSummary: SUMMARY_WITH_TRANSCRIPT,
      status: "new",
    };
    const msg = renderLeadNotification(lead);
    expect(msg.subject).toContain("Ben");
    expect(msg.subject).toContain("60");
    expect(msg.text).toContain("seo");
    expect(msg.text).not.toContain("Gesprächsauszug:");
    expect(msg.text).not.toContain(SECRET_VISITOR_PHRASE);
  });
});

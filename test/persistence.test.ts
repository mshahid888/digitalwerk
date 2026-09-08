import { beforeEach, describe, expect, it } from "vitest";
import { createSession } from "@/lib/chat-agent/agent/orchestrator";
import { createMemoryStore } from "@/lib/chat-agent/persistence/memory-store";
import { PostgresChatAgentStore } from "@/lib/chat-agent/persistence/postgres/store";
import { SCHEMA_STATEMENTS } from "@/lib/chat-agent/persistence/postgres/schema";
import type { SqlClient, SqlRow } from "@/lib/chat-agent/persistence/postgres/client";
import {
  getChatAgentStore,
  resetChatAgentStore,
} from "@/lib/chat-agent/persistence";
import type { StoredHandoff, StoredLead } from "@/lib/chat-agent/persistence/types";

// -------------------------------------------------------------- fake client

type Call = { text: string; params: unknown[] };

class FakeSqlClient implements SqlClient {
  calls: Call[] = [];
  private stubs: { needle: string; rows: SqlRow[] }[] = [];
  ended = false;

  stub(needle: string, rows: SqlRow[]): this {
    this.stubs.push({ needle, rows });
    return this;
  }

  async query<T = SqlRow>(text: string, params: unknown[] = []): Promise<T[]> {
    this.calls.push({ text, params });
    const normalized = text.replace(/\s+/g, " ").trim();
    for (const stub of this.stubs) {
      if (normalized.includes(stub.needle)) return stub.rows as unknown as T[];
    }
    return [] as unknown as T[];
  }

  async end(): Promise<void> {
    this.ended = true;
  }

  find(needle: string): Call | undefined {
    return this.calls.find((c) => c.text.replace(/\s+/g, " ").includes(needle));
  }
}

// ----------------------------------------------------------------- fixtures

const now = new Date().toISOString();

const leadRow: SqlRow = {
  id: "11111111-1111-1111-1111-111111111111",
  session_id: "22222222-2222-2222-2222-222222222222",
  created_at: now,
  updated_at: now,
  name: "Anna Muster",
  company: "Muster GmbH",
  industry: null,
  email: "anna@muster.de",
  phone: null,
  problem: "zu viele Anrufe",
  current_process: null,
  desired_outcome: null,
  relevant_tools: null,
  timeline: "asap",
  budget: null,
  notes: null,
  score_total: 72,
  score_band: "qualified",
  score_breakdown: { fit: 25, problemClarity: 20, intent: 10, timing: 8, impact: 5, contactWillingness: 4 },
  intent: "AI_AUTOMATION",
  recommended_service_slug: "ki-agenten",
  conversation_summary: "Intent: AI_AUTOMATION",
  status: "new",
};

// -------------------------------------------------------------------- tests

describe("PostgresChatAgentStore (fake SQL client)", () => {
  it("init runs SELECT 1 and every migration statement, once", async () => {
    const sql = new FakeSqlClient();
    const store = new PostgresChatAgentStore(sql);
    await store.init();
    await store.init(); // memoized

    expect(sql.calls[0].text).toContain("SELECT 1");
    for (const statement of SCHEMA_STATEMENTS) {
      expect(sql.calls.some((c) => c.text === statement)).toBe(true);
    }
    // SELECT 1 issued exactly once despite two init() calls
    expect(sql.calls.filter((c) => c.text.includes("SELECT 1"))).toHaveLength(1);
    expect(store.kind).toBe("postgres");
  });

  it("ping() runs a fresh SELECT 1 on every call and propagates failure", async () => {
    const sql = new FakeSqlClient();
    const store = new PostgresChatAgentStore(sql);
    await store.init();
    await store.ping();
    await store.ping();
    // one from init + two from ping
    expect(sql.calls.filter((c) => c.text.includes("SELECT 1"))).toHaveLength(3);

    sql.query = async () => {
      throw new Error("connection terminated unexpectedly");
    };
    await expect(store.ping()).rejects.toThrow(/connection terminated/);
  });

  it("conversations.create issues a parameterised INSERT", async () => {
    const sql = new FakeSqlClient();
    const store = new PostgresChatAgentStore(sql);
    const session = createSession("22222222-2222-2222-2222-222222222222", "de");
    await store.conversations.create(session);

    const call = sql.find("INSERT INTO chat_sessions");
    expect(call).toBeDefined();
    expect(call?.params[0]).toBe(session.id);
    // no raw values interpolated into the SQL text
    expect(call?.text).not.toContain(session.id);
  });

  it("conversations.get maps a row to an AgentSession", async () => {
    const sql = new FakeSqlClient().stub("FROM chat_sessions WHERE id", [
      {
        id: "22222222-2222-2222-2222-222222222222",
        locale: "en",
        created_at: now,
        updated_at: now,
        messages: [{ role: "user", content: "hi", at: now }],
        qualification: { facts: {}, score: { total: 0, band: "informational", breakdown: {} }, nextField: null, askedFields: [], contactRequested: false },
        last_intent: null,
        last_recommendation: null,
        handoff_requested: false,
      },
    ]);
    const store = new PostgresChatAgentStore(sql);
    const session = await store.conversations.get("22222222-2222-2222-2222-222222222222");
    expect(session?.language).toBe("en");
    expect(session?.messages).toHaveLength(1);
  });

  it("leads.upsert uses INSERT ... ON CONFLICT (session_id) and maps RETURNING", async () => {
    const sql = new FakeSqlClient().stub("INSERT INTO chat_leads", [leadRow]);
    const store = new PostgresChatAgentStore(sql);
    const lead: StoredLead = {
      id: leadRow.id as string,
      sessionId: leadRow.session_id as string,
      createdAt: now,
      updatedAt: now,
      facts: { name: "Anna Muster", company: "Muster GmbH", email: "anna@muster.de" },
      score: { total: 72, band: "qualified", breakdown: { fit: 25, problemClarity: 20, intent: 10, timing: 8, impact: 5, contactWillingness: 4 } },
      intent: "AI_AUTOMATION",
      recommendedServiceSlug: "ki-agenten",
      conversationSummary: "Intent: AI_AUTOMATION",
      status: "new",
    };
    const saved = await store.leads.upsert(lead);
    const call = sql.find("INSERT INTO chat_leads");
    expect(call?.text).toContain("ON CONFLICT (session_id) DO UPDATE");
    expect(saved.facts.email).toBe("anna@muster.de");
    expect(saved.score.band).toBe("qualified");
  });

  it("handoffs.create maps the payload into columns and back", async () => {
    const handoffRow: SqlRow = {
      id: "33333333-3333-3333-3333-333333333333",
      session_id: leadRow.session_id,
      lead_id: leadRow.id,
      created_at: now,
      reason: "visitor_requested",
      urgency: "normal",
      language: "de",
      intent: "AI_AUTOMATION",
      lead_facts: { name: "Anna Muster" },
      lead_score: { total: 72, band: "qualified", breakdown: {} },
      recommendation: null,
      conversation_summary: "Intent: AI_AUTOMATION",
      open_questions: [],
      confidence: 0.8,
      dispatched: false,
      dispatch_channel: null,
      dispatch_attempts: 0,
      dispatched_at: null,
      last_dispatch_error: null,
    };
    const sql = new FakeSqlClient().stub("INSERT INTO chat_handoffs", [handoffRow]);
    const store = new PostgresChatAgentStore(sql);
    const handoff: StoredHandoff = {
      id: handoffRow.id as string,
      sessionId: leadRow.session_id as string,
      leadId: leadRow.id as string,
      createdAt: now,
      reason: "visitor_requested",
      payload: {
        reason: "visitor_requested",
        urgency: "normal",
        language: "de",
        intent: "AI_AUTOMATION",
        leadFacts: { name: "Anna Muster" },
        leadScore: { total: 72, band: "qualified", breakdown: { fit: 0, problemClarity: 0, intent: 0, timing: 0, impact: 0, contactWillingness: 0 } },
        recommendation: null,
        conversationSummary: "Intent: AI_AUTOMATION",
        openQuestions: [],
        confidence: 0.8,
        createdAt: now,
      },
      dispatched: false,
      dispatchChannel: null,
      dispatchAttempts: 0,
      dispatchedAt: null,
      lastDispatchError: null,
    };
    const created = await store.handoffs.create(handoff);
    expect(created.reason).toBe("visitor_requested");
    expect(created.payload.leadFacts.name).toBe("Anna Muster");
  });

  it("recordDispatchAttempt writes success and failure paths differently", async () => {
    const sql = new FakeSqlClient();
    const store = new PostgresChatAgentStore(sql);
    await store.handoffs.recordDispatchAttempt("h1", { ok: true, channel: "resend", at: now });
    await store.handoffs.recordDispatchAttempt("h1", { ok: false, error: "boom" });
    expect(sql.calls[0].text).toContain("dispatched = true");
    expect(sql.calls[1].text).toContain("last_dispatch_error = $2");
    expect(sql.calls[1].params[1]).toBe("boom");
  });

  it("purgeExpired issues one UPDATE for transcripts and one DELETE for events", async () => {
    const sql = new FakeSqlClient()
      .stub("UPDATE chat_sessions SET messages = '[]'", [{ count: "3" }])
      .stub("DELETE FROM chat_events", [{ count: "7" }]);
    const store = new PostgresChatAgentStore(sql);
    const result = await store.conversations.purgeExpired({
      transcriptRetentionDays: 30,
      eventRetentionDays: 30,
    });
    expect(result.transcriptsPurged).toBe(3);
    expect(result.eventsPurged).toBe(7);
    expect(sql.find("make_interval(days => $1)")?.params[0]).toBe(30);
  });

  it("close() ends the client", async () => {
    const sql = new FakeSqlClient();
    await new PostgresChatAgentStore(sql).close();
    expect(sql.ended).toBe(true);
  });
});

describe("store factory", () => {
  beforeEach(() => {
    delete process.env.CHAT_AGENT_DATABASE_URL;
    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;
    resetChatAgentStore();
  });

  it("returns the in-memory store when no connection string is set", async () => {
    const store = await getChatAgentStore();
    expect(store.kind).toBe("memory");
  });

  it("memoizes the store across calls", async () => {
    const a = await getChatAgentStore();
    const b = await getChatAgentStore();
    expect(a).toBe(b);
  });
});

describe("memory store retention", () => {
  it("purges transcripts + events older than retention, keeps leads", async () => {
    const store = createMemoryStore();
    const old = createSession("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "de");
    old.createdAt = new Date(Date.now() - 45 * 864e5).toISOString();
    old.messages = [{ role: "user", content: "old", at: old.createdAt }];
    await store.conversations.create(old);
    await store.events.record({
      id: "e1",
      sessionId: old.id,
      at: old.createdAt,
      type: "message_handled",
      metadata: {},
    });
    await store.leads.upsert({
      id: "l1",
      sessionId: old.id,
      createdAt: old.createdAt,
      updatedAt: old.createdAt,
      facts: { email: "keep@me.de" },
      score: { total: 40, band: "nurture", breakdown: { fit: 10, problemClarity: 10, intent: 10, timing: 0, impact: 5, contactWillingness: 5 } },
      intent: "SEO",
      recommendedServiceSlug: "seo",
      conversationSummary: "s",
      status: "new",
    });

    const fresh = createSession("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "de");
    fresh.messages = [{ role: "user", content: "recent", at: new Date().toISOString() }];
    await store.conversations.create(fresh);

    const result = await store.conversations.purgeExpired({
      transcriptRetentionDays: 30,
      eventRetentionDays: 30,
    });

    expect(result.transcriptsPurged).toBe(1);
    expect(result.eventsPurged).toBe(1);
    expect((await store.conversations.get(old.id))?.messages).toHaveLength(0);
    expect((await store.conversations.get(fresh.id))?.messages).toHaveLength(1);
    expect((await store.leads.getBySession(old.id))?.facts.email).toBe("keep@me.de");
  });
});

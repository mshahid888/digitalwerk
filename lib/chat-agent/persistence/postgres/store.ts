import type {
  AgentSession,
  ConversationMessage,
  IntentResult,
  LeadFacts,
  LeadScore,
  ServiceRecommendation,
} from "../../agent/types";
import { createQualificationState } from "../../agent/qualification";
import type {
  AnalyticsEvent,
  ChatAgentStore,
  ConversationStore,
  EventStore,
  HandoffStore,
  LeadStore,
  PurgeResult,
  StoredHandoff,
  StoredLead,
} from "../types";
import type { SqlClient, SqlRow } from "./client";
import { createPgClient } from "./client";
import { migrate } from "./schema";

// Postgres implementation of ChatAgentStore. Rows map 1:1 to the interface
// types via the small helpers below. All queries are parameterised.

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return new Date(String(value)).toISOString();
}
function isoOrNull(value: unknown): string | null {
  return value === null || value === undefined ? null : iso(value);
}
function asJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value as T;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------- sessions

function rowToSession(row: SqlRow): AgentSession {
  const qualification = asJson(row.qualification, createQualificationState());
  return {
    id: String(row.id),
    language: (row.locale === "en" ? "en" : "de"),
    messages: asJson<ConversationMessage[]>(row.messages, []),
    qualification,
    lastIntent: asJson<IntentResult | null>(row.last_intent, null),
    lastRecommendation: asJson<ServiceRecommendation | null>(
      row.last_recommendation,
      null,
    ),
    handoffRequested: Boolean(row.handoff_requested),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

class PgConversationStore implements ConversationStore {
  constructor(private readonly sql: SqlClient) {}

  async create(session: AgentSession): Promise<void> {
    await this.sql.query(
      `INSERT INTO chat_sessions
         (id, locale, created_at, updated_at, messages, qualification,
          last_intent, last_recommendation, handoff_requested)
       VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7::jsonb,$8::jsonb,$9)
       ON CONFLICT (id) DO NOTHING`,
      [
        session.id,
        session.language,
        session.createdAt,
        session.updatedAt,
        JSON.stringify(session.messages),
        JSON.stringify(session.qualification),
        JSON.stringify(session.lastIntent),
        JSON.stringify(session.lastRecommendation),
        session.handoffRequested,
      ],
    );
  }

  async get(id: string): Promise<AgentSession | null> {
    const rows = await this.sql.query(
      `SELECT * FROM chat_sessions WHERE id = $1`,
      [id],
    );
    return rows[0] ? rowToSession(rows[0]) : null;
  }

  async save(session: AgentSession): Promise<void> {
    await this.sql.query(
      `UPDATE chat_sessions SET
         locale = $2,
         updated_at = $3,
         messages = $4::jsonb,
         qualification = $5::jsonb,
         last_intent = $6::jsonb,
         last_recommendation = $7::jsonb,
         handoff_requested = $8
       WHERE id = $1`,
      [
        session.id,
        session.language,
        new Date().toISOString(),
        JSON.stringify(session.messages),
        JSON.stringify(session.qualification),
        JSON.stringify(session.lastIntent),
        JSON.stringify(session.lastRecommendation),
        session.handoffRequested,
      ],
    );
  }

  async purgeExpired(opts: {
    transcriptRetentionDays: number;
    eventRetentionDays: number;
  }): Promise<PurgeResult> {
    const transcripts = await this.sql.query<{ count: string }>(
      `WITH purged AS (
         UPDATE chat_sessions
            SET messages = '[]'::jsonb,
                transcript_purged_at = now()
          WHERE transcript_purged_at IS NULL
            AND messages <> '[]'::jsonb
            AND created_at < now() - make_interval(days => $1)
          RETURNING id
       )
       SELECT count(*)::text AS count FROM purged`,
      [opts.transcriptRetentionDays],
    );
    const events = await this.sql.query<{ count: string }>(
      `WITH purged AS (
         DELETE FROM chat_events
          WHERE at < now() - make_interval(days => $1)
          RETURNING id
       )
       SELECT count(*)::text AS count FROM purged`,
      [opts.eventRetentionDays],
    );
    return {
      transcriptsPurged: Number(transcripts[0]?.count ?? 0),
      eventsPurged: Number(events[0]?.count ?? 0),
    };
  }
}

// ------------------------------------------------------------------- leads

function rowToLead(row: SqlRow): StoredLead {
  const facts: LeadFacts = {};
  const put = (k: keyof LeadFacts, v: unknown) => {
    if (typeof v === "string" && v.length > 0) facts[k] = v;
  };
  put("name", row.name);
  put("company", row.company);
  put("industry", row.industry);
  put("email", row.email);
  put("phone", row.phone);
  put("problem", row.problem);
  put("currentProcess", row.current_process);
  put("desiredOutcome", row.desired_outcome);
  put("relevantTools", row.relevant_tools);
  put("timeline", row.timeline);
  put("budget", row.budget);
  put("notes", row.notes);

  const score: LeadScore = {
    total: Number(row.score_total ?? 0),
    band: (String(row.score_band) as LeadScore["band"]) || "informational",
    breakdown: asJson(row.score_breakdown, {
      fit: 0,
      problemClarity: 0,
      intent: 0,
      timing: 0,
      impact: 0,
      contactWillingness: 0,
    }),
  };

  return {
    id: String(row.id),
    sessionId: String(row.session_id),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    facts,
    score,
    intent: String(row.intent) as StoredLead["intent"],
    recommendedServiceSlug: (row.recommended_service_slug as string | null) ?? null,
    conversationSummary: String(row.conversation_summary ?? ""),
    status: (String(row.status) as StoredLead["status"]) || "new",
  };
}

class PgLeadStore implements LeadStore {
  constructor(private readonly sql: SqlClient) {}

  async upsert(lead: StoredLead): Promise<StoredLead> {
    const f = lead.facts;
    const rows = await this.sql.query(
      `INSERT INTO chat_leads
         (id, session_id, created_at, updated_at, name, company, industry,
          email, phone, problem, current_process, desired_outcome,
          relevant_tools, timeline, budget, notes, score_total, score_band,
          score_breakdown, intent, recommended_service_slug,
          conversation_summary, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
               $19::jsonb,$20,$21,$22,$23)
       ON CONFLICT (session_id) DO UPDATE SET
         updated_at = EXCLUDED.updated_at,
         name = EXCLUDED.name, company = EXCLUDED.company,
         industry = EXCLUDED.industry, email = EXCLUDED.email,
         phone = EXCLUDED.phone, problem = EXCLUDED.problem,
         current_process = EXCLUDED.current_process,
         desired_outcome = EXCLUDED.desired_outcome,
         relevant_tools = EXCLUDED.relevant_tools,
         timeline = EXCLUDED.timeline, budget = EXCLUDED.budget,
         notes = EXCLUDED.notes, score_total = EXCLUDED.score_total,
         score_band = EXCLUDED.score_band,
         score_breakdown = EXCLUDED.score_breakdown,
         intent = EXCLUDED.intent,
         recommended_service_slug = EXCLUDED.recommended_service_slug,
         conversation_summary = EXCLUDED.conversation_summary,
         status = chat_leads.status
       RETURNING *`,
      [
        lead.id, lead.sessionId, lead.createdAt, lead.updatedAt,
        f.name ?? null, f.company ?? null, f.industry ?? null, f.email ?? null,
        f.phone ?? null, f.problem ?? null, f.currentProcess ?? null,
        f.desiredOutcome ?? null, f.relevantTools ?? null, f.timeline ?? null,
        f.budget ?? null, f.notes ?? null, lead.score.total, lead.score.band,
        JSON.stringify(lead.score.breakdown), lead.intent,
        lead.recommendedServiceSlug, lead.conversationSummary, lead.status,
      ],
    );
    return rowToLead(rows[0]);
  }

  async get(id: string): Promise<StoredLead | null> {
    const rows = await this.sql.query(`SELECT * FROM chat_leads WHERE id = $1`, [id]);
    return rows[0] ? rowToLead(rows[0]) : null;
  }
  async getBySession(sessionId: string): Promise<StoredLead | null> {
    const rows = await this.sql.query(
      `SELECT * FROM chat_leads WHERE session_id = $1`,
      [sessionId],
    );
    return rows[0] ? rowToLead(rows[0]) : null;
  }
  async list(opts?: { limit?: number; status?: StoredLead["status"] }): Promise<StoredLead[]> {
    const limit = Math.min(500, Math.max(1, opts?.limit ?? 100));
    const rows = opts?.status
      ? await this.sql.query(
          `SELECT * FROM chat_leads WHERE status = $1 ORDER BY created_at DESC LIMIT $2`,
          [opts.status, limit],
        )
      : await this.sql.query(
          `SELECT * FROM chat_leads ORDER BY created_at DESC LIMIT $1`,
          [limit],
        );
    return rows.map(rowToLead);
  }
}

// ---------------------------------------------------------------- handoffs

function rowToHandoff(row: SqlRow): StoredHandoff {
  return {
    id: String(row.id),
    sessionId: String(row.session_id),
    leadId: (row.lead_id as string | null) ?? null,
    createdAt: iso(row.created_at),
    reason: String(row.reason) as StoredHandoff["reason"],
    payload: {
      reason: String(row.reason) as StoredHandoff["reason"],
      urgency: String(row.urgency) as "low" | "normal" | "high",
      language: (row.language === "en" ? "en" : "de"),
      intent: String(row.intent) as StoredHandoff["payload"]["intent"],
      leadFacts: asJson<LeadFacts>(row.lead_facts, {}),
      leadScore: asJson<LeadScore>(row.lead_score, {
        total: 0,
        band: "informational",
        breakdown: {
          fit: 0, problemClarity: 0, intent: 0, timing: 0, impact: 0,
          contactWillingness: 0,
        },
      }),
      recommendation: asJson<ServiceRecommendation | null>(row.recommendation, null),
      conversationSummary: String(row.conversation_summary ?? ""),
      openQuestions: asJson<string[]>(row.open_questions, []),
      confidence: Number(row.confidence ?? 0),
      createdAt: iso(row.created_at),
    },
    dispatched: Boolean(row.dispatched),
    dispatchChannel: (row.dispatch_channel as string | null) ?? null,
    dispatchAttempts: Number(row.dispatch_attempts ?? 0),
    dispatchedAt: isoOrNull(row.dispatched_at),
    lastDispatchError: (row.last_dispatch_error as string | null) ?? null,
  };
}

class PgHandoffStore implements HandoffStore {
  constructor(private readonly sql: SqlClient) {}

  async create(handoff: StoredHandoff): Promise<StoredHandoff> {
    const p = handoff.payload;
    const rows = await this.sql.query(
      `INSERT INTO chat_handoffs
         (id, session_id, lead_id, created_at, reason, urgency, language,
          intent, lead_facts, lead_score, recommendation, conversation_summary,
          open_questions, confidence, dispatched, dispatch_channel,
          dispatch_attempts, dispatched_at, last_dispatch_error)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12,
               $13::jsonb,$14,$15,$16,$17,$18,$19)
       RETURNING *`,
      [
        handoff.id, handoff.sessionId, handoff.leadId, handoff.createdAt,
        handoff.reason, p.urgency, p.language, p.intent,
        JSON.stringify(p.leadFacts), JSON.stringify(p.leadScore),
        JSON.stringify(p.recommendation), p.conversationSummary,
        JSON.stringify(p.openQuestions), p.confidence, handoff.dispatched,
        handoff.dispatchChannel, handoff.dispatchAttempts, handoff.dispatchedAt,
        handoff.lastDispatchError,
      ],
    );
    return rowToHandoff(rows[0]);
  }

  async get(id: string): Promise<StoredHandoff | null> {
    const rows = await this.sql.query(`SELECT * FROM chat_handoffs WHERE id = $1`, [id]);
    return rows[0] ? rowToHandoff(rows[0]) : null;
  }

  async findRecentForSession(
    sessionId: string,
    sinceIso: string,
  ): Promise<StoredHandoff | null> {
    const rows = await this.sql.query(
      `SELECT * FROM chat_handoffs
        WHERE session_id = $1 AND created_at >= $2
        ORDER BY created_at DESC LIMIT 1`,
      [sessionId, sinceIso],
    );
    return rows[0] ? rowToHandoff(rows[0]) : null;
  }

  async recordDispatchAttempt(
    id: string,
    outcome:
      | { ok: true; channel: string; at: string }
      | { ok: false; error: string },
  ): Promise<void> {
    if (outcome.ok) {
      await this.sql.query(
        `UPDATE chat_handoffs SET
           dispatch_attempts = dispatch_attempts + 1,
           dispatched = true,
           dispatch_channel = $2,
           dispatched_at = $3,
           last_dispatch_error = NULL
         WHERE id = $1`,
        [id, outcome.channel, outcome.at],
      );
    } else {
      await this.sql.query(
        `UPDATE chat_handoffs SET
           dispatch_attempts = dispatch_attempts + 1,
           last_dispatch_error = $2
         WHERE id = $1`,
        [id, outcome.error.slice(0, 500)],
      );
    }
  }

  async listPendingDispatch(opts?: {
    maxAttempts?: number;
    limit?: number;
  }): Promise<StoredHandoff[]> {
    const maxAttempts = opts?.maxAttempts ?? 1_000_000;
    const limit = Math.min(200, Math.max(1, opts?.limit ?? 50));
    const rows = await this.sql.query(
      `SELECT * FROM chat_handoffs
        WHERE dispatched = false AND dispatch_attempts < $1
        ORDER BY created_at ASC LIMIT $2`,
      [maxAttempts, limit],
    );
    return rows.map(rowToHandoff);
  }

  async list(opts?: { limit?: number }): Promise<StoredHandoff[]> {
    const limit = Math.min(500, Math.max(1, opts?.limit ?? 100));
    const rows = await this.sql.query(
      `SELECT * FROM chat_handoffs ORDER BY created_at DESC LIMIT $1`,
      [limit],
    );
    return rows.map(rowToHandoff);
  }
}

// ------------------------------------------------------------------ events

class PgEventStore implements EventStore {
  constructor(private readonly sql: SqlClient) {}

  async record(event: AnalyticsEvent): Promise<void> {
    await this.sql.query(
      `INSERT INTO chat_events (id, session_id, at, type, metadata)
       VALUES ($1,$2,$3,$4,$5::jsonb)
       ON CONFLICT (id) DO NOTHING`,
      [event.id, event.sessionId, event.at, event.type, JSON.stringify(event.metadata)],
    );
  }

  async list(sessionId?: string): Promise<AnalyticsEvent[]> {
    const rows = sessionId
      ? await this.sql.query(
          `SELECT * FROM chat_events WHERE session_id = $1 ORDER BY at ASC`,
          [sessionId],
        )
      : await this.sql.query(`SELECT * FROM chat_events ORDER BY at ASC LIMIT 1000`);
    return rows.map((row) => ({
      id: String(row.id),
      sessionId: String(row.session_id),
      at: iso(row.at),
      type: String(row.type),
      metadata: asJson(row.metadata, {}),
    }));
  }
}

// ------------------------------------------------------------------- store

export class PostgresChatAgentStore implements ChatAgentStore {
  readonly kind = "postgres" as const;
  conversations: ConversationStore;
  leads: LeadStore;
  handoffs: HandoffStore;
  events: EventStore;
  private initialized: Promise<void> | null = null;

  constructor(private readonly sql: SqlClient) {
    this.conversations = new PgConversationStore(sql);
    this.leads = new PgLeadStore(sql);
    this.handoffs = new PgHandoffStore(sql);
    this.events = new PgEventStore(sql);
  }

  /** Idempotent: SELECT 1 + CREATE TABLE IF NOT EXISTS. Runs once per instance. */
  init(): Promise<void> {
    if (!this.initialized) {
      this.initialized = (async () => {
        await this.sql.query("SELECT 1");
        await migrate(this.sql);
      })().catch((error) => {
        this.initialized = null; // allow a retry on the next call
        throw error;
      });
    }
    return this.initialized;
  }

  /** Live probe — always a fresh round-trip, never memoised. */
  async ping(): Promise<void> {
    await this.sql.query("SELECT 1");
  }

  async close(): Promise<void> {
    await this.sql.end();
  }
}

/** Build a PostgresChatAgentStore from a connection string. Does not connect yet. */
export async function createPostgresStore(
  connectionString: string,
): Promise<PostgresChatAgentStore> {
  const client = await createPgClient(connectionString);
  return new PostgresChatAgentStore(client);
}

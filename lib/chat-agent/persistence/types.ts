import type {
  AgentSession,
  HandoffPayload,
  HandoffReason,
  IntentCategory,
  LeadFacts,
  LeadScore,
} from "../agent/types";

// Persistence interfaces. Two implementations ship:
//   - memory-store.ts  (dev, tests, preview without a database)
//   - postgres/store.ts (Neon Postgres, activated by a connection string)
// The agent and API layers depend only on these interfaces.

export type StoredLead = {
  id: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  facts: LeadFacts;
  score: LeadScore;
  intent: IntentCategory;
  recommendedServiceSlug: string | null;
  conversationSummary: string;
  status: "new" | "contacted" | "closed";
};

export type StoredHandoff = {
  id: string;
  sessionId: string;
  leadId: string | null;
  createdAt: string;
  reason: HandoffReason;
  payload: HandoffPayload;
  /** Delivery state of the outbound notification for this handoff. */
  dispatched: boolean;
  dispatchChannel: string | null;
  dispatchAttempts: number;
  dispatchedAt: string | null;
  lastDispatchError: string | null;
};

export type AnalyticsEvent = {
  id: string;
  sessionId: string;
  at: string;
  type: string;
  metadata: Record<string, string | number | boolean>;
};

export type PurgeResult = {
  transcriptsPurged: number;
  eventsPurged: number;
};

export interface ConversationStore {
  create(session: AgentSession): Promise<void>;
  get(id: string): Promise<AgentSession | null>;
  save(session: AgentSession): Promise<void>;
  /**
   * Delete raw transcripts older than `transcriptRetentionDays` and raw
   * events older than `eventRetentionDays`. Session metadata and lead
   * records are kept. Idempotent and safe to call repeatedly.
   */
  purgeExpired(opts: {
    transcriptRetentionDays: number;
    eventRetentionDays: number;
  }): Promise<PurgeResult>;
}

export interface LeadStore {
  upsert(lead: StoredLead): Promise<StoredLead>;
  get(id: string): Promise<StoredLead | null>;
  getBySession(sessionId: string): Promise<StoredLead | null>;
  list(opts?: { limit?: number; status?: StoredLead["status"] }): Promise<StoredLead[]>;
}

export interface HandoffStore {
  create(handoff: StoredHandoff): Promise<StoredHandoff>;
  get(id: string): Promise<StoredHandoff | null>;
  /** Most recent handoff for a session created at/after `sinceIso`, or null. */
  findRecentForSession(sessionId: string, sinceIso: string): Promise<StoredHandoff | null>;
  /** Record the outcome of a delivery attempt (retry-safe; never loses the record). */
  recordDispatchAttempt(
    id: string,
    outcome:
      | { ok: true; channel: string; at: string }
      | { ok: false; error: string },
  ): Promise<void>;
  /** Handoffs still awaiting successful delivery (for retry). */
  listPendingDispatch(opts?: { maxAttempts?: number; limit?: number }): Promise<StoredHandoff[]>;
  list(opts?: { limit?: number }): Promise<StoredHandoff[]>;
}

export interface EventStore {
  record(event: AnalyticsEvent): Promise<void>;
  list(sessionId?: string): Promise<AnalyticsEvent[]>;
}

export interface ChatAgentStore {
  readonly kind: "memory" | "postgres";
  conversations: ConversationStore;
  leads: LeadStore;
  handoffs: HandoffStore;
  events: EventStore;
  /** Best-effort readiness check (memory: always ready; postgres: SELECT 1 + migrate). */
  init(): Promise<void>;
  /**
   * Live liveness probe. Unlike init() this is never memoised: it runs a
   * real round-trip every call (postgres: `SELECT 1`), so a health endpoint
   * can detect a database that went away after a successful startup. Memory:
   * always resolves.
   */
  ping(): Promise<void>;
  /** Release resources (postgres: close the pool). No-op for memory. */
  close(): Promise<void>;
}

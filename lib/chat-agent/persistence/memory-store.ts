import type { AgentSession } from "../agent/types";
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
} from "./types";

// In-memory implementation. Used for local development, tests and any
// deployment without a database connection string. NOT durable: data is
// lost on cold start / redeploy and is not shared across instances. A
// deployment that needs persistence sets a Postgres connection string and
// gets postgres/store.ts instead, with no other change.

function clone<T>(value: T): T {
  return structuredClone(value);
}

function olderThan(iso: string, days: number, now: number): boolean {
  return Date.parse(iso) < now - days * 24 * 60 * 60 * 1000;
}

class MemoryConversationStore implements ConversationStore {
  constructor(private readonly events: AnalyticsEvent[]) {}
  private readonly map = new Map<string, AgentSession>();

  async create(session: AgentSession): Promise<void> {
    this.map.set(session.id, clone(session));
  }
  async get(id: string): Promise<AgentSession | null> {
    const found = this.map.get(id);
    return found ? clone(found) : null;
  }
  async save(session: AgentSession): Promise<void> {
    this.map.set(session.id, clone(session));
  }
  async purgeExpired(opts: {
    transcriptRetentionDays: number;
    eventRetentionDays: number;
  }): Promise<PurgeResult> {
    const now = Date.now();
    let transcriptsPurged = 0;
    for (const session of this.map.values()) {
      if (
        session.messages.length > 0 &&
        olderThan(session.createdAt, opts.transcriptRetentionDays, now)
      ) {
        session.messages = [];
        transcriptsPurged += 1;
      }
    }
    const before = this.events.length;
    for (let i = this.events.length - 1; i >= 0; i -= 1) {
      if (olderThan(this.events[i].at, opts.eventRetentionDays, now)) {
        this.events.splice(i, 1);
      }
    }
    return { transcriptsPurged, eventsPurged: before - this.events.length };
  }
}

class MemoryLeadStore implements LeadStore {
  private readonly map = new Map<string, StoredLead>();
  private readonly bySession = new Map<string, string>();

  async upsert(lead: StoredLead): Promise<StoredLead> {
    this.map.set(lead.id, clone(lead));
    this.bySession.set(lead.sessionId, lead.id);
    return clone(lead);
  }
  async get(id: string): Promise<StoredLead | null> {
    const found = this.map.get(id);
    return found ? clone(found) : null;
  }
  async getBySession(sessionId: string): Promise<StoredLead | null> {
    const id = this.bySession.get(sessionId);
    return id ? this.get(id) : null;
  }
  async list(opts?: { limit?: number; status?: StoredLead["status"] }): Promise<StoredLead[]> {
    let rows = [...this.map.values()].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
    if (opts?.status) rows = rows.filter((r) => r.status === opts.status);
    if (opts?.limit) rows = rows.slice(0, opts.limit);
    return rows.map(clone);
  }
}

class MemoryHandoffStore implements HandoffStore {
  private readonly map = new Map<string, StoredHandoff>();

  async create(handoff: StoredHandoff): Promise<StoredHandoff> {
    this.map.set(handoff.id, clone(handoff));
    return clone(handoff);
  }
  async get(id: string): Promise<StoredHandoff | null> {
    const found = this.map.get(id);
    return found ? clone(found) : null;
  }
  async findRecentForSession(
    sessionId: string,
    sinceIso: string,
  ): Promise<StoredHandoff | null> {
    const since = Date.parse(sinceIso);
    const match = [...this.map.values()]
      .filter(
        (h) => h.sessionId === sessionId && Date.parse(h.createdAt) >= since,
      )
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
    return match ? clone(match) : null;
  }
  async recordDispatchAttempt(
    id: string,
    outcome:
      | { ok: true; channel: string; at: string }
      | { ok: false; error: string },
  ): Promise<void> {
    const found = this.map.get(id);
    if (!found) return;
    found.dispatchAttempts += 1;
    if (outcome.ok) {
      found.dispatched = true;
      found.dispatchChannel = outcome.channel;
      found.dispatchedAt = outcome.at;
      found.lastDispatchError = null;
    } else {
      found.lastDispatchError = outcome.error.slice(0, 500);
    }
  }
  async listPendingDispatch(opts?: {
    maxAttempts?: number;
    limit?: number;
  }): Promise<StoredHandoff[]> {
    const maxAttempts = opts?.maxAttempts ?? Number.POSITIVE_INFINITY;
    let rows = [...this.map.values()]
      .filter((h) => !h.dispatched && h.dispatchAttempts < maxAttempts)
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    if (opts?.limit) rows = rows.slice(0, opts.limit);
    return rows.map(clone);
  }
  async list(opts?: { limit?: number }): Promise<StoredHandoff[]> {
    let rows = [...this.map.values()].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
    if (opts?.limit) rows = rows.slice(0, opts.limit);
    return rows.map(clone);
  }
}

class MemoryEventStore implements EventStore {
  constructor(private readonly events: AnalyticsEvent[]) {}

  async record(event: AnalyticsEvent): Promise<void> {
    this.events.push(clone(event));
  }
  async list(sessionId?: string): Promise<AnalyticsEvent[]> {
    const all = this.events.map(clone);
    return sessionId ? all.filter((e) => e.sessionId === sessionId) : all;
  }
}

export function createMemoryStore(): ChatAgentStore {
  // The event array is shared between the event store and the conversation
  // store so purgeExpired can prune it.
  const events: AnalyticsEvent[] = [];
  return {
    kind: "memory",
    conversations: new MemoryConversationStore(events),
    leads: new MemoryLeadStore(),
    handoffs: new MemoryHandoffStore(),
    events: new MemoryEventStore(events),
    async init() {},
    async close() {},
  };
}

import type { AgentSession } from "../agent/types";
import type {
  AnalyticsEvent,
  ChatAgentStore,
  ConversationStore,
  EventStore,
  HandoffStore,
  LeadStore,
  StoredHandoff,
  StoredLead,
} from "./types";

// In-memory implementation. Suitable for local development, tests and a
// single-instance preview deployment. NOT suitable for production:
//   - data is lost on every cold start / redeploy;
//   - it is not shared across serverless invocations or regions.
// Production must swap in a durable ChatAgentStore (see
// docs/CHAT-AGENT/PERSISTENCE.md). The interface is identical.

function clone<T>(value: T): T {
  return structuredClone(value);
}

class MemoryConversationStore implements ConversationStore {
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
  async list(): Promise<StoredLead[]> {
    return [...this.map.values()].map(clone);
  }
}

class MemoryHandoffStore implements HandoffStore {
  private readonly map = new Map<string, StoredHandoff>();

  async create(handoff: StoredHandoff): Promise<StoredHandoff> {
    this.map.set(handoff.id, clone(handoff));
    return clone(handoff);
  }
  async markDispatched(id: string, channel: string): Promise<void> {
    const found = this.map.get(id);
    if (found) {
      found.dispatched = true;
      found.dispatchChannel = channel;
    }
  }
  async list(): Promise<StoredHandoff[]> {
    return [...this.map.values()].map(clone);
  }
}

class MemoryEventStore implements EventStore {
  private readonly events: AnalyticsEvent[] = [];

  async record(event: AnalyticsEvent): Promise<void> {
    this.events.push(clone(event));
  }
  async list(sessionId?: string): Promise<AnalyticsEvent[]> {
    const all = this.events.map(clone);
    return sessionId ? all.filter((e) => e.sessionId === sessionId) : all;
  }
}

export function createMemoryStore(): ChatAgentStore {
  return {
    conversations: new MemoryConversationStore(),
    leads: new MemoryLeadStore(),
    handoffs: new MemoryHandoffStore(),
    events: new MemoryEventStore(),
  };
}

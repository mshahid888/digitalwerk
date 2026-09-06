import type {
  AgentSession,
  HandoffPayload,
  IntentCategory,
  LeadFacts,
  LeadScore,
} from "../agent/types";

// Persistence interfaces. The MVP ships an in-memory implementation
// (memory-store.ts). A production store (Postgres/KV — decision pending,
// see docs/CHAT-AGENT/PERSISTENCE.md) implements the same interfaces with
// no change to the agent or API layer.

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
  payload: HandoffPayload;
  dispatched: boolean;
  dispatchChannel: string | null;
};

export type AnalyticsEvent = {
  id: string;
  sessionId: string;
  at: string;
  type: string;
  metadata: Record<string, string | number | boolean>;
};

export interface ConversationStore {
  create(session: AgentSession): Promise<void>;
  get(id: string): Promise<AgentSession | null>;
  save(session: AgentSession): Promise<void>;
}

export interface LeadStore {
  upsert(lead: StoredLead): Promise<StoredLead>;
  get(id: string): Promise<StoredLead | null>;
  getBySession(sessionId: string): Promise<StoredLead | null>;
  list(): Promise<StoredLead[]>;
}

export interface HandoffStore {
  create(handoff: StoredHandoff): Promise<StoredHandoff>;
  markDispatched(id: string, channel: string): Promise<void>;
  list(): Promise<StoredHandoff[]>;
}

export interface EventStore {
  record(event: AnalyticsEvent): Promise<void>;
  list(sessionId?: string): Promise<AnalyticsEvent[]>;
}

export interface ChatAgentStore {
  conversations: ConversationStore;
  leads: LeadStore;
  handoffs: HandoffStore;
  events: EventStore;
}

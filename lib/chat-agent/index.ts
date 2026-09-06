// Public entry point for the DigitalWerk chat agent subsystem.
//
// Layout (documented in docs/CHAT-AGENT/ARCHITECTURE.md):
//   config.ts        env-driven configuration, cost-free defaults
//   llm/             provider-independent LLM interface + mock + Anthropic adapter
//   knowledge/       approved knowledge base + lexical retrieval
//   agent/           orchestration, intent, language, guardrails,
//                    recommendation, qualification/scoring, handoff, summary
//   persistence/     store interfaces + in-memory + Postgres (Neon) implementations
//   notifications/   channel abstraction + Resend adapter
//   service.ts       application service used by the API routes

export { getChatAgentConfig, type ChatAgentConfig } from "./config";
export { checkAdminAuth, type AdminAuth } from "./admin-auth";

export {
  getLlmProvider,
  resetLlmProviderCache,
  MockLlmProvider,
  AnthropicLlmProvider,
  LlmProviderUnavailableError,
  type LlmProvider,
} from "./llm";

export {
  knowledgeBase,
  knowledgeStats,
  serviceCatalog,
  priceRecords,
  getKnowledgeRetriever,
  retrieveForPrompt,
} from "./knowledge";

export * from "./agent";

export {
  getChatAgentStore,
  resetChatAgentStore,
  setChatAgentStore,
  createMemoryStore,
  createPostgresStore,
  PostgresChatAgentStore,
  SCHEMA_STATEMENTS,
  type ChatAgentStore,
  type StoredLead,
  type StoredHandoff,
} from "./persistence";

export {
  getNotificationChannel,
  resetNotificationChannelCache,
  ResendNotificationChannel,
  NoopNotificationChannel,
  renderHandoffNotification,
  renderLeadNotification,
  type NotificationChannel,
  type NotificationResult,
} from "./notifications";

export {
  startSession,
  handleMessage,
  requestHandoff,
  updateLeadFacts,
  dispatchHandoff,
  retryPendingHandoffs,
  purgeExpiredData,
  listLeads,
  listHandoffs,
} from "./service";

import { getChatAgentConfig } from "./config";
import { knowledgeStats } from "./knowledge";
import { getLlmProvider } from "./llm";
import { getNotificationChannel } from "./notifications";
import { getChatAgentStore } from "./persistence";

// Health snapshot for a status endpoint / the checkpoint report. Contains
// no secrets — only whether a key/connection is present, never its value.
export async function chatAgentHealth() {
  const config = getChatAgentConfig();
  const provider = getLlmProvider();
  const channel = getNotificationChannel();

  let storeKind: "memory" | "postgres" | "error" = "memory";
  try {
    storeKind = (await getChatAgentStore()).kind;
  } catch {
    storeKind = "error";
  }

  return {
    provider: {
      configured: config.provider,
      active: provider.id,
      model: provider.model,
      anthropicKeyPresent: config.anthropicKeyPresent,
      liveLlm: provider.id === "anthropic",
    },
    persistence: {
      configured: config.databaseConfigured ? "postgres" : "memory",
      active: storeKind,
      durable: storeKind === "postgres",
    },
    notifications: {
      configuredChannel: config.handoffChannel ?? null,
      activeChannel: channel.id,
      ready: channel.ready,
      resendKeyPresent: config.resendKeyPresent,
    },
    retention: {
      transcriptRetentionDays: config.transcriptRetentionDays,
      eventRetentionDays: config.eventRetentionDays,
    },
    knowledge: knowledgeStats(),
    limits: {
      maxInputChars: config.maxInputChars,
      maxMessagesPerSession: config.maxMessagesPerSession,
      maxHistoryTurns: config.maxHistoryTurns,
    },
  };
}

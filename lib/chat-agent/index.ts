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

export {
  getChatAgentConfig,
  type ChatAgentConfig,
  type LlmConfig,
  type LlmProviderKind,
} from "./config";
export { checkAdminAuth, type AdminAuth } from "./admin-auth";

export {
  getLlmProvider,
  resetLlmProviderCache,
  MockLlmProvider,
  OpenAiCompatibleLlmProvider,
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
  let dbReachable: boolean | null = null;
  try {
    const store = await getChatAgentStore();
    storeKind = store.kind;
    if (store.kind === "postgres") {
      try {
        // init() self-applies the schema (memoised); ping() is a live
        // round-trip every call, so a DB that dropped after startup is
        // reported as unreachable instead of a stale "ok".
        await store.init();
        await store.ping();
        dbReachable = true;
      } catch {
        dbReachable = false;
      }
    }
  } catch {
    storeKind = "error";
  }

  const llm = config.llm;
  // openai-compatible needs a base URL + key + model; anthropic needs a key.
  const llmConfigured =
    llm.kind === "mock"
      ? true
      : llm.kind === "openai-compatible"
        ? Boolean(llm.baseUrl && llm.apiKeyPresent && llm.model)
        : llm.apiKeyPresent;
  const llmLive = provider.id !== "mock";

  // Overall status: "ok" unless something configured is unreachable.
  const status =
    storeKind === "error" || dbReachable === false
      ? "degraded"
      : "ok";

  return {
    status,
    llm: {
      // Free-text label from LLM_PROVIDER — "omniroute", "openai", "mock", …
      provider: llm.label,
      kind: llm.kind,
      model: provider.model,
      active: provider.id,
      baseUrlConfigured: Boolean(llm.baseUrl),
      apiKeyPresent: llm.apiKeyPresent,
      configured: llmConfigured ? "configured" : "unconfigured",
      live: llmLive,
    },
    // Back-compat shape for older callers / the previous health consumers.
    provider: {
      configured: llm.label,
      active: provider.id,
      model: provider.model,
      liveLlm: llmLive,
    },
    database: dbReachable === null ? (storeKind === "memory" ? "memory" : storeKind) : dbReachable ? "ok" : "unavailable",
    persistence: {
      configured: config.databaseConfigured ? "postgres" : "memory",
      active: storeKind,
      durable: storeKind === "postgres",
      reachable: dbReachable,
    },
    notifications: {
      configuredChannel: config.handoffChannel ?? null,
      activeChannel: channel.id,
      ready: channel.ready,
      configured: channel.ready ? "configured" : "unconfigured",
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
      llmTimeoutMs: llm.timeoutMs,
      llmMaxRetries: llm.maxRetries,
    },
  };
}

// Public entry point for the DigitalWerk chat agent subsystem.
//
// Layout (documented in docs/CHAT-AGENT/ARCHITECTURE.md):
//   config.ts        env-driven configuration, cost-free defaults
//   llm/             provider-independent LLM interface + mock + Anthropic adapter
//   knowledge/       approved knowledge base + lexical retrieval
//   agent/           orchestration, intent, language, guardrails,
//                    recommendation, qualification/scoring, handoff, summary
//   persistence/     store interfaces + in-memory implementation
//   service.ts       application service used by the API routes

export { getChatAgentConfig, type ChatAgentConfig } from "./config";

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
  createMemoryStore,
} from "./persistence";

export {
  startSession,
  handleMessage,
  requestHandoff,
  updateLeadFacts,
  dispatchHandoff,
} from "./service";

import { getChatAgentConfig } from "./config";
import { knowledgeStats } from "./knowledge";
import { getLlmProvider } from "./llm";

// Health snapshot for a status endpoint / the checkpoint report. Contains
// no secrets — only whether a key is present, never its value.
export function chatAgentHealth() {
  const config = getChatAgentConfig();
  const provider = getLlmProvider();
  return {
    provider: {
      configured: config.provider,
      active: provider.id,
      model: provider.model,
      anthropicKeyPresent: config.anthropicKeyPresent,
      liveLlm: provider.id === "anthropic",
    },
    knowledge: knowledgeStats(),
    limits: {
      maxInputChars: config.maxInputChars,
      maxMessagesPerSession: config.maxMessagesPerSession,
      maxHistoryTurns: config.maxHistoryTurns,
    },
  };
}

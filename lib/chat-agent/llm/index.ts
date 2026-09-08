import { getChatAgentConfig } from "../config";
import { AnthropicLlmProvider } from "./anthropic-provider";
import { MockLlmProvider } from "./mock-provider";
import { OpenAiCompatibleLlmProvider } from "./openai-compatible-provider";
import type { LlmProvider } from "./types";

export type {
  LlmProvider,
  LlmMessage,
  LlmResponse,
  LlmGenerateOptions,
  LlmUsage,
} from "./types";
export { LlmProviderUnavailableError } from "./types";
export { MockLlmProvider } from "./mock-provider";
export { OpenAiCompatibleLlmProvider } from "./openai-compatible-provider";
export { AnthropicLlmProvider } from "./anthropic-provider";

// Factory — resolves the configured provider. The agent depends only on
// getLlmProvider(); it never imports a concrete adapter. Provider selection
// is entirely configuration-driven (see lib/chat-agent/config.ts →
// resolveLlm). If a provider is selected but its credentials are missing,
// this returns the deterministic MOCK provider rather than a broken one, so
// dev / CI / unconfigured environments keep working — the health endpoint
// reports which provider is actually live.
//
//   LLM_PROVIDER=omniroute   LLM_BASE_URL=…/v1   LLM_API_KEY=…   LLM_MODEL=…
//        -> openai-compatible adapter (production default: OmniRoute)
//   LLM_PROVIDER=anthropic   ANTHROPIC_API_KEY=…    -> optional direct adapter
//   LLM_PROVIDER=mock  (or nothing configured)     -> deterministic mock

let cached: { key: string; provider: LlmProvider } | null = null;

export function getLlmProvider(): LlmProvider {
  const { llm, temperature } = getChatAgentConfig();
  const cacheKey = `${llm.kind}:${llm.label}:${llm.model}:${llm.baseUrl ?? ""}:${llm.apiKeyPresent}:${temperature}`;
  if (cached && cached.key === cacheKey) return cached.provider;

  let provider: LlmProvider;

  if (llm.kind === "openai-compatible" && llm.baseUrl && llm.apiKeyPresent && llm.model) {
    provider = new OpenAiCompatibleLlmProvider({
      label: llm.label,
      baseUrl: llm.baseUrl,
      apiKey: process.env.LLM_API_KEY,
      model: llm.model,
      timeoutMs: llm.timeoutMs,
      maxRetries: llm.maxRetries,
    });
  } else if (llm.kind === "anthropic" && llm.apiKeyPresent) {
    provider = new AnthropicLlmProvider({ model: llm.model || "claude-sonnet-5" });
  } else {
    provider = new MockLlmProvider(llm.model && llm.kind === "mock" ? llm.model : "mock-1");
  }

  cached = { key: cacheKey, provider };
  return provider;
}

/** Test helper — drop the memoized provider so env changes take effect. */
export function resetLlmProviderCache(): void {
  cached = null;
}

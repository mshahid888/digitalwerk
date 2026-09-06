import { getChatAgentConfig } from "../config";
import { AnthropicLlmProvider } from "./anthropic-provider";
import { MockLlmProvider } from "./mock-provider";
import type { LlmProvider } from "./types";

export type { LlmProvider, LlmMessage, LlmResponse, LlmGenerateOptions, LlmUsage } from "./types";
export { LlmProviderUnavailableError } from "./types";
export { MockLlmProvider } from "./mock-provider";
export { AnthropicLlmProvider } from "./anthropic-provider";

// Factory: resolves the configured provider. If "anthropic" is selected
// but no key is present, this returns the mock provider instead of a
// broken one — the agent stays usable in every environment, and the
// checkpoint report / health endpoint surface which provider is live.

let cached: { key: string; provider: LlmProvider } | null = null;

export function getLlmProvider(): LlmProvider {
  const config = getChatAgentConfig();
  const cacheKey = `${config.provider}:${config.model}:${config.anthropicKeyPresent}`;
  if (cached && cached.key === cacheKey) return cached.provider;

  let provider: LlmProvider;
  if (config.provider === "anthropic" && config.anthropicKeyPresent) {
    provider = new AnthropicLlmProvider({ model: config.model });
  } else {
    provider = new MockLlmProvider(
      config.provider === "anthropic" ? "mock-1" : config.model,
    );
  }

  cached = { key: cacheKey, provider };
  return provider;
}

/** Test helper — drop the memoized provider so env changes take effect. */
export function resetLlmProviderCache(): void {
  cached = null;
}

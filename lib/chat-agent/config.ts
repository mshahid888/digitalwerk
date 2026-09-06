// Central configuration for the chat agent. Everything here is read from
// environment variables with safe, cost-free defaults so the whole system
// runs locally and in tests without any external account.
//
// No secret is ever hard-coded. When a real provider key is absent the
// agent falls back to the deterministic mock provider (see lib/chat-agent/llm).

export type LlmProviderId = "mock" | "anthropic";

export type ChatAgentConfig = {
  /** Which LLM provider to use. Defaults to "mock" unless a key makes "anthropic" viable. */
  provider: LlmProviderId;
  /** Model identifier passed to the provider. */
  model: string;
  /** Sampling temperature for response generation. */
  temperature: number;
  /** Upper bound on generated tokens per turn. */
  maxOutputTokens: number;
  /** Max characters accepted in a single visitor message (guardrail). */
  maxInputChars: number;
  /** Max messages a single session may send before it must hand off / reset (abuse guard). */
  maxMessagesPerSession: number;
  /** Max conversation turns kept in the model context window. */
  maxHistoryTurns: number;
  /** Whether an Anthropic key is present in the environment. */
  anthropicKeyPresent: boolean;
};

function readInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readFloat(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function getChatAgentConfig(): ChatAgentConfig {
  const anthropicKeyPresent = Boolean(process.env.ANTHROPIC_API_KEY?.trim());

  // Explicit override wins; otherwise use Anthropic only if a key exists.
  const requested = process.env.CHAT_AGENT_PROVIDER?.trim().toLowerCase();
  let provider: LlmProviderId = "mock";
  if (requested === "anthropic" || requested === "mock") {
    provider = requested;
  } else if (anthropicKeyPresent) {
    provider = "anthropic";
  }

  return {
    provider,
    model:
      process.env.CHAT_AGENT_MODEL?.trim() ||
      (provider === "anthropic" ? "claude-sonnet-5" : "mock-1"),
    temperature: readFloat("CHAT_AGENT_TEMPERATURE", 0.4),
    maxOutputTokens: readInt("CHAT_AGENT_MAX_OUTPUT_TOKENS", 700),
    maxInputChars: readInt("CHAT_AGENT_MAX_INPUT_CHARS", 4000),
    maxMessagesPerSession: readInt("CHAT_AGENT_MAX_MESSAGES_PER_SESSION", 40),
    maxHistoryTurns: readInt("CHAT_AGENT_MAX_HISTORY_TURNS", 16),
    anthropicKeyPresent,
  };
}

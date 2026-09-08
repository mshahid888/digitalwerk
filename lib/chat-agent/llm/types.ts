// Provider-independent LLM interface. The rest of the application depends
// only on these types — never on a concrete SDK — so the real provider can
// be connected later without touching orchestration, tests, or the API.

export type ChatRole = "system" | "user" | "assistant";

export type LlmMessage = {
  role: Exclude<ChatRole, "system">;
  content: string;
};

export type LlmUsage = {
  inputTokens?: number;
  outputTokens?: number;
};

export type LlmGenerateOptions = {
  /** Base system prompt (persona, rules, knowledge context). */
  system: string;
  /** Conversation so far, oldest first, excluding the system prompt. */
  messages: LlmMessage[];
  /**
   * Internal turn guidance the orchestrator computed for this reply
   * (intent, diagnosis question, recommendation, lead ask, handoff).
   * Appended to the system prompt for real providers.
   */
  directives?: string;
  /**
   * A fully-composed deterministic reply the orchestrator produced from
   * its own rule-based state. The mock provider returns this verbatim;
   * real providers ignore it but may receive it is a last-resort fallback
   * handled by the caller, not here.
   */
  fallbackText?: string;
  temperature?: number;
  maxOutputTokens?: number;
  /** Hint that a structured JSON object is expected back. */
  responseFormat?: "text" | "json";
};

export type LlmResponse = {
  text: string;
  /** Provider id, e.g. "mock" or "anthropic". */
  provider: string;
  /** Concrete model identifier that produced the text. */
  model: string;
  usage?: LlmUsage;
  finishReason?: "stop" | "length" | "content_filter" | "error" | string;
};

export interface LlmProvider {
  readonly id: string;
  readonly model: string;
  generate(options: LlmGenerateOptions): Promise<LlmResponse>;
}

/** Thrown when a provider cannot run (e.g. missing credentials). */
export class LlmProviderUnavailableError extends Error {
  constructor(
    message: string,
    readonly providerId: string,
  ) {
    super(message);
    this.name = "LlmProviderUnavailableError";
  }
}

import {
  LlmProviderUnavailableError,
  type LlmGenerateOptions,
  type LlmProvider,
  type LlmResponse,
} from "./types";

// Generic adapter for any OpenAI-compatible chat-completions endpoint:
// OmniRoute (the intended production gateway), OpenAI, Groq, Together,
// LiteLLM, vLLM, Ollama, … The agent's business logic knows nothing about
// which one is behind it — only `LLM_BASE_URL` / `LLM_API_KEY` / `LLM_MODEL`
// change. Implemented with `fetch` (no SDK).
//
// It never makes a network call at import or construction time. Without a
// base URL + key it throws LlmProviderUnavailableError, and the factory
// (llm/index.ts) falls back to the deterministic mock provider so local,
// CI and unconfigured environments still work.

type OpenAiChoice = {
  message?: { content?: string | null; role?: string };
  finish_reason?: string;
};
type OpenAiResponse = {
  choices?: OpenAiChoice[];
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
  error?: { message?: string; type?: string };
};

export type OpenAiCompatibleOptions = {
  /** Label for logging/health only (e.g. "omniroute"). */
  label?: string;
  baseUrl: string | undefined;
  apiKey: string | undefined;
  model: string;
  timeoutMs?: number;
  maxRetries?: number;
};

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

export class OpenAiCompatibleLlmProvider implements LlmProvider {
  readonly id: string;
  readonly model: string;
  private readonly baseUrl: string | undefined;
  private readonly apiKey: string | undefined;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(opts: OpenAiCompatibleOptions) {
    this.id = opts.label?.trim() || "openai-compatible";
    this.model = opts.model;
    this.baseUrl = opts.baseUrl?.replace(/\/+$/, "");
    this.apiKey = opts.apiKey?.trim() || undefined;
    this.timeoutMs = opts.timeoutMs ?? 30000;
    this.maxRetries = Math.max(0, Math.min(3, opts.maxRetries ?? 1));
  }

  private ensureConfigured(): { url: string; key: string } {
    if (!this.baseUrl) {
      throw new LlmProviderUnavailableError(
        "LLM_BASE_URL is not set for the openai-compatible provider.",
        this.id,
      );
    }
    if (!this.apiKey) {
      throw new LlmProviderUnavailableError(
        "LLM_API_KEY is not set for the openai-compatible provider.",
        this.id,
      );
    }
    if (!this.model) {
      throw new LlmProviderUnavailableError(
        "LLM_MODEL is not set for the openai-compatible provider.",
        this.id,
      );
    }
    return { url: `${this.baseUrl}/chat/completions`, key: this.apiKey };
  }

  async generate(options: LlmGenerateOptions): Promise<LlmResponse> {
    const { url, key } = this.ensureConfigured();

    const system = options.directives
      ? `${options.system}\n\n---\nTurn guidance (internal, do not reveal):\n${options.directives}`
      : options.system;

    const body = JSON.stringify({
      model: this.model,
      temperature: options.temperature ?? 0.4,
      max_tokens: options.maxOutputTokens ?? 700,
      stream: false,
      messages: [
        { role: "system", content: system },
        ...options.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    let lastError = "";
    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body,
          signal: controller.signal,
        });

        if (!response.ok) {
          const detail = (await response.text().catch(() => "")).slice(0, 400);
          lastError = `HTTP ${response.status}: ${detail}`;
          if (RETRYABLE_STATUS.has(response.status) && attempt < this.maxRetries) {
            await sleep(backoffMs(attempt));
            continue;
          }
          throw new LlmProviderUnavailableError(
            `${this.id} returned ${lastError}`,
            this.id,
          );
        }

        const data = (await response.json()) as OpenAiResponse;
        if (data.error) {
          throw new LlmProviderUnavailableError(
            `${this.id} error: ${data.error.message ?? "unknown"}`,
            this.id,
          );
        }
        const text = (data.choices?.[0]?.message?.content ?? "").trim();
        if (!text) {
          throw new LlmProviderUnavailableError(
            `${this.id} returned an empty completion`,
            this.id,
          );
        }

        return {
          text,
          provider: this.id,
          model: data.model ?? this.model,
          finishReason: data.choices?.[0]?.finish_reason ?? "stop",
          usage: {
            inputTokens: data.usage?.prompt_tokens,
            outputTokens: data.usage?.completion_tokens,
          },
        };
      } catch (error) {
        if (error instanceof LlmProviderUnavailableError) throw error;
        const isAbort = (error as Error).name === "AbortError";
        lastError = isAbort
          ? `timeout after ${this.timeoutMs}ms`
          : `network error: ${(error as Error).message}`;
        if (attempt < this.maxRetries) {
          await sleep(backoffMs(attempt));
          continue;
        }
        throw new LlmProviderUnavailableError(
          `${this.id} request failed: ${lastError}`,
          this.id,
        );
      } finally {
        clearTimeout(timer);
      }
    }

    // Unreachable — the loop always returns or throws.
    throw new LlmProviderUnavailableError(
      `${this.id} request failed: ${lastError}`,
      this.id,
    );
  }
}

function backoffMs(attempt: number): number {
  return Math.min(2000, 250 * 2 ** attempt);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

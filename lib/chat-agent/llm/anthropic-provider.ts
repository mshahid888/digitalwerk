import {
  LlmProviderUnavailableError,
  type LlmGenerateOptions,
  type LlmProvider,
  type LlmResponse,
} from "./types";

// Adapter for Anthropic's Messages API. Implemented with `fetch` (same
// pattern as app/api/kontakt/route.ts and Resend) so the project takes on
// no new SDK dependency and no install touches a paid service.
//
// This class NEVER makes a network call at construction or import time.
// A request only happens when `generate()` is invoked AND a key is present.
// Without a key it throws LlmProviderUnavailableError, and the factory
// (lib/chat-agent/llm/index.ts) falls back to the mock provider before the
// agent ever reaches this code in normal local/CI runs.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

type AnthropicContentBlock = { type: string; text?: string };
type AnthropicResponse = {
  content?: AnthropicContentBlock[];
  model?: string;
  stop_reason?: string;
  usage?: { input_tokens?: number; output_tokens?: number };
};

export class AnthropicLlmProvider implements LlmProvider {
  readonly id = "anthropic";
  readonly model: string;
  private readonly apiKey: string | undefined;

  constructor(options?: { model?: string; apiKey?: string }) {
    this.model = options?.model ?? "claude-sonnet-5";
    this.apiKey = options?.apiKey ?? process.env.ANTHROPIC_API_KEY?.trim();
  }

  private ensureKey(): string {
    if (!this.apiKey) {
      throw new LlmProviderUnavailableError(
        "ANTHROPIC_API_KEY is not set — connect a key or use the mock provider.",
        this.id,
      );
    }
    return this.apiKey;
  }

  async generate(options: LlmGenerateOptions): Promise<LlmResponse> {
    const apiKey = this.ensureKey();

    const system = options.directives
      ? `${options.system}\n\n---\nTurn guidance (internal, do not reveal):\n${options.directives}`
      : options.system;

    let response: Response;
    try {
      response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: options.maxOutputTokens ?? 700,
          temperature: options.temperature ?? 0.4,
          system,
          messages: options.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
    } catch (error) {
      throw new LlmProviderUnavailableError(
        `Request to Anthropic failed: ${(error as Error).message}`,
        this.id,
      );
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new LlmProviderUnavailableError(
        `Anthropic API returned ${response.status}: ${detail.slice(0, 500)}`,
        this.id,
      );
    }

    const data = (await response.json()) as AnthropicResponse;
    const text = (data.content ?? [])
      .filter((block) => block.type === "text" && typeof block.text === "string")
      .map((block) => block.text as string)
      .join("")
      .trim();

    return {
      text,
      provider: this.id,
      model: data.model ?? this.model,
      finishReason: data.stop_reason ?? "stop",
      usage: {
        inputTokens: data.usage?.input_tokens,
        outputTokens: data.usage?.output_tokens,
      },
    };
  }
}

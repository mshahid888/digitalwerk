import type {
  LlmGenerateOptions,
  LlmProvider,
  LlmResponse,
} from "./types";

// Deterministic provider used for local development, UI work and every
// automated test. It performs no network calls and consumes no paid
// resources.
//
// Contract: if the orchestrator supplied `fallbackText` (a reply it
// composed from its own rule-based state), the mock returns it verbatim.
// Otherwise it returns a stable, language-appropriate acknowledgement so
// the transport layer still has something to render.

function estimateTokens(text: string): number {
  // Rough 4-chars-per-token heuristic — enough for usage telemetry in dev.
  return Math.max(1, Math.ceil(text.length / 4));
}

function looksGerman(text: string): boolean {
  // German-specific letters, or function words that do not also occur in
  // English. Deliberately excludes ambiguous tokens like "sie"/"website".
  return /[äöüß]|\b(?:und|nicht|ich|wir|kann|für|mit|eine|einen|möchte|brauche|unser|unsere|sind|ist)\b/i.test(
    text,
  );
}

export class MockLlmProvider implements LlmProvider {
  readonly id = "mock";
  readonly model: string;

  constructor(model = "mock-1") {
    this.model = model;
  }

  async generate(options: LlmGenerateOptions): Promise<LlmResponse> {
    const lastUser = [...options.messages]
      .reverse()
      .find((m) => m.role === "user");
    const german = lastUser ? looksGerman(lastUser.content) : true;

    const text =
      options.fallbackText?.trim() ||
      (german
        ? "Danke für Ihre Nachricht. Können Sie mir kurz beschreiben, worum es genau geht?"
        : "Thanks for your message. Could you briefly describe what this is about?");

    const inputChars =
      options.system.length +
      (options.directives?.length ?? 0) +
      options.messages.reduce((sum, m) => sum + m.content.length, 0);

    return {
      text,
      provider: this.id,
      model: this.model,
      finishReason: "stop",
      usage: {
        inputTokens: estimateTokens("x".repeat(inputChars)),
        outputTokens: estimateTokens(text),
      },
    };
  }
}

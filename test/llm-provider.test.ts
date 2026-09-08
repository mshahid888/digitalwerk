import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AnthropicLlmProvider,
  getLlmProvider,
  LlmProviderUnavailableError,
  MockLlmProvider,
  OpenAiCompatibleLlmProvider,
  resetLlmProviderCache,
} from "@/lib/chat-agent/llm";

const ENV_KEYS = [
  "LLM_PROVIDER", "LLM_BASE_URL", "LLM_API_KEY", "LLM_MODEL",
  "LLM_TIMEOUT_MS", "LLM_MAX_RETRIES",
  "ANTHROPIC_API_KEY", "CHAT_AGENT_PROVIDER", "CHAT_AGENT_MODEL",
];
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  resetLlmProviderCache();
});
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  resetLlmProviderCache();
  vi.restoreAllMocks();
});

describe("MockLlmProvider", () => {
  it("returns the supplied fallback text verbatim", async () => {
    const res = await new MockLlmProvider().generate({
      system: "s",
      messages: [{ role: "user", content: "Hallo" }],
      fallbackText: "Guten Tag, wie kann ich helfen?",
    });
    expect(res.text).toBe("Guten Tag, wie kann ich helfen?");
    expect(res.provider).toBe("mock");
    expect(res.usage?.outputTokens).toBeGreaterThan(0);
  });

  it("is deterministic for identical input", async () => {
    const p = new MockLlmProvider();
    const opts = {
      system: "s",
      messages: [{ role: "user" as const, content: "Test message here" }],
      fallbackText: "Stable reply",
    };
    expect((await p.generate(opts)).text).toBe((await p.generate(opts)).text);
  });
});

describe("OpenAiCompatibleLlmProvider", () => {
  it("throws a typed error and never calls the network without a base URL / key", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    const provider = new OpenAiCompatibleLlmProvider({
      label: "omniroute",
      baseUrl: undefined,
      apiKey: undefined,
      model: "x/y",
    });
    await expect(
      provider.generate({ system: "s", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toBeInstanceOf(LlmProviderUnavailableError);
    expect(spy).not.toHaveBeenCalled();
  });

  it("POSTs an OpenAI-shaped body to {baseUrl}/chat/completions with a Bearer key", async () => {
    let seenUrl = "";
    let seenBody: Record<string, unknown> = {};
    let seenAuth = "";
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
      seenUrl = String(url);
      seenAuth = String((init?.headers as Record<string, string>)?.Authorization ?? "");
      seenBody = JSON.parse(String(init?.body));
      return new Response(
        JSON.stringify({
          model: "cc/claude-sonnet-4-6",
          choices: [{ message: { content: "Guten Tag." }, finish_reason: "stop" }],
          usage: { prompt_tokens: 42, completion_tokens: 3 },
        }),
        { status: 200 },
      );
    });

    const provider = new OpenAiCompatibleLlmProvider({
      label: "omniroute",
      baseUrl: "https://gw.example.com/v1/",
      apiKey: "or-secret",
      model: "cc/claude-sonnet-4-6",
    });
    const res = await provider.generate({
      system: "SYS",
      directives: "DIR",
      messages: [{ role: "user", content: "Hallo" }],
      temperature: 0.3,
      maxOutputTokens: 500,
    });

    expect(seenUrl).toBe("https://gw.example.com/v1/chat/completions");
    expect(seenAuth).toBe("Bearer or-secret");
    expect(seenBody.model).toBe("cc/claude-sonnet-4-6");
    expect(seenBody.stream).toBe(false);
    expect((seenBody.messages as { role: string }[])[0].role).toBe("system");
    expect(String((seenBody.messages as { content: string }[])[0].content)).toContain("DIR");
    expect(res.text).toBe("Guten Tag.");
    expect(res.provider).toBe("omniroute");
    expect(res.usage).toEqual({ inputTokens: 42, outputTokens: 3 });
  });

  it("retries a 503 then succeeds", async () => {
    let calls = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      calls += 1;
      if (calls === 1) return new Response("upstream busy", { status: 503 });
      return new Response(
        JSON.stringify({ choices: [{ message: { content: "ok" } }] }),
        { status: 200 },
      );
    });
    const provider = new OpenAiCompatibleLlmProvider({
      baseUrl: "https://x/v1", apiKey: "k", model: "m", maxRetries: 1,
    });
    const res = await provider.generate({ system: "s", messages: [{ role: "user", content: "hi" }] });
    expect(calls).toBe(2);
    expect(res.text).toBe("ok");
  });

  it("gives up after retries on a persistent 500", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("boom", { status: 500 }));
    const provider = new OpenAiCompatibleLlmProvider({
      baseUrl: "https://x/v1", apiKey: "k", model: "m", maxRetries: 1,
    });
    await expect(
      provider.generate({ system: "s", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toBeInstanceOf(LlmProviderUnavailableError);
  });

  it("treats a timeout as retryable then a typed failure", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      (_u, init) =>
        new Promise((_res, rej) => {
          init?.signal?.addEventListener("abort", () => {
            const e = new Error("aborted");
            e.name = "AbortError";
            rej(e);
          });
        }),
    );
    const provider = new OpenAiCompatibleLlmProvider({
      baseUrl: "https://x/v1", apiKey: "k", model: "m", maxRetries: 0, timeoutMs: 20,
    });
    await expect(
      provider.generate({ system: "s", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toThrow(/timeout/);
  });

  it("rejects a malformed (empty) completion", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [] }), { status: 200 }),
    );
    const provider = new OpenAiCompatibleLlmProvider({
      baseUrl: "https://x/v1", apiKey: "k", model: "m", maxRetries: 0,
    });
    await expect(
      provider.generate({ system: "s", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toBeInstanceOf(LlmProviderUnavailableError);
  });
});

describe("AnthropicLlmProvider (optional adapter)", () => {
  it("throws a typed error when no key is present and never calls the network", async () => {
    await expect(
      new AnthropicLlmProvider({ apiKey: undefined }).generate({
        system: "s",
        messages: [{ role: "user", content: "hi" }],
      }),
    ).rejects.toBeInstanceOf(LlmProviderUnavailableError);
  });
});

describe("getLlmProvider factory (configuration-driven)", () => {
  it("defaults to mock with no configuration", () => {
    expect(getLlmProvider().id).toBe("mock");
  });

  it("selects the openai-compatible adapter for LLM_PROVIDER=omniroute + base url + key + model", () => {
    process.env.LLM_PROVIDER = "omniroute";
    process.env.LLM_BASE_URL = "https://gw.example.com/v1";
    process.env.LLM_API_KEY = "or-secret";
    process.env.LLM_MODEL = "cc/claude-sonnet-4-6";
    resetLlmProviderCache();
    const p = getLlmProvider();
    expect(p).toBeInstanceOf(OpenAiCompatibleLlmProvider);
    expect(p.id).toBe("omniroute");
    expect(p.model).toBe("cc/claude-sonnet-4-6");
  });

  it("falls back to mock when omniroute is selected but the base url / key is missing", () => {
    process.env.LLM_PROVIDER = "omniroute";
    resetLlmProviderCache();
    expect(getLlmProvider().id).toBe("mock");
  });

  it("switching LLM_PROVIDER changes the adapter without touching agent code", () => {
    process.env.LLM_PROVIDER = "openai";
    process.env.LLM_API_KEY = "sk-x";
    process.env.LLM_MODEL = "gpt-4o-mini";
    resetLlmProviderCache();
    // "openai" without an explicit base URL defaults to api.openai.com/v1
    expect(getLlmProvider()).toBeInstanceOf(OpenAiCompatibleLlmProvider);

    process.env.LLM_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-ant-x";
    resetLlmProviderCache();
    expect(getLlmProvider().id).toBe("anthropic");

    process.env.LLM_PROVIDER = "mock";
    resetLlmProviderCache();
    expect(getLlmProvider().id).toBe("mock");
  });

  it("honours the legacy CHAT_AGENT_PROVIDER / ANTHROPIC_API_KEY combo", () => {
    process.env.CHAT_AGENT_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-ant-legacy";
    resetLlmProviderCache();
    expect(getLlmProvider().id).toBe("anthropic");
  });
});

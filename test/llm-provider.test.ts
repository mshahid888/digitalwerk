import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  AnthropicLlmProvider,
  getLlmProvider,
  LlmProviderUnavailableError,
  MockLlmProvider,
  resetLlmProviderCache,
} from "@/lib/chat-agent/llm";

const ENV_KEYS = ["ANTHROPIC_API_KEY", "CHAT_AGENT_PROVIDER", "CHAT_AGENT_MODEL"];
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const k of ENV_KEYS) saved[k] = process.env[k];
  for (const k of ENV_KEYS) delete process.env[k];
  resetLlmProviderCache();
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  resetLlmProviderCache();
});

describe("MockLlmProvider", () => {
  it("returns the supplied fallback text verbatim", async () => {
    const provider = new MockLlmProvider();
    const res = await provider.generate({
      system: "s",
      messages: [{ role: "user", content: "Hallo" }],
      fallbackText: "Guten Tag, wie kann ich helfen?",
    });
    expect(res.text).toBe("Guten Tag, wie kann ich helfen?");
    expect(res.provider).toBe("mock");
    expect(res.usage?.outputTokens).toBeGreaterThan(0);
  });

  it("is deterministic for identical input", async () => {
    const provider = new MockLlmProvider();
    const opts = {
      system: "s",
      messages: [{ role: "user" as const, content: "Test message here" }],
      fallbackText: "Stable reply",
    };
    const a = await provider.generate(opts);
    const b = await provider.generate(opts);
    expect(a.text).toBe(b.text);
    expect(a.usage).toEqual(b.usage);
  });

  it("falls back to a language-appropriate default with no fallback text", async () => {
    const provider = new MockLlmProvider();
    const de = await provider.generate({
      system: "s",
      messages: [{ role: "user", content: "Ich brauche eine neue Website für mein Unternehmen" }],
    });
    const en = await provider.generate({
      system: "s",
      messages: [{ role: "user", content: "I need a new website for my business" }],
    });
    expect(de.text).toMatch(/beschreiben|worum/i);
    expect(en.text).toMatch(/describe|about/i);
  });
});

describe("AnthropicLlmProvider", () => {
  it("throws a typed error when no key is present and never calls the network", async () => {
    const provider = new AnthropicLlmProvider({ apiKey: undefined });
    await expect(
      provider.generate({ system: "s", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toBeInstanceOf(LlmProviderUnavailableError);
  });
});

describe("getLlmProvider factory", () => {
  it("defaults to the mock provider with no configuration", () => {
    expect(getLlmProvider().id).toBe("mock");
  });

  it("still returns mock when provider=anthropic but no key is set", () => {
    process.env.CHAT_AGENT_PROVIDER = "anthropic";
    resetLlmProviderCache();
    expect(getLlmProvider().id).toBe("mock");
  });

  it("selects the anthropic adapter when a key is present", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test-not-real";
    process.env.CHAT_AGENT_PROVIDER = "anthropic";
    resetLlmProviderCache();
    expect(getLlmProvider().id).toBe("anthropic");
  });
});

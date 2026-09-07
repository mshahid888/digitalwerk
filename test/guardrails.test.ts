import { describe, expect, it } from "vitest";
import { checkInput, checkOutput } from "@/lib/chat-agent/agent/guardrails";
import { PROMPT_INJECTION, SECRET_PROBES } from "./fixtures";

describe("input guardrails", () => {
  it("blocks every prompt-injection fixture and returns a safe refusal", () => {
    for (const text of PROMPT_INJECTION) {
      const result = checkInput(text, "en");
      expect(result.block).toBe(true);
      expect(result.safeReply).toBeTruthy();
      expect(
        result.findings.some(
          (f) => f.kind === "prompt_injection" || f.kind === "system_prompt_probe",
        ),
      ).toBe(true);
    }
  });

  it("blocks secret-extraction attempts", () => {
    for (const text of SECRET_PROBES) {
      const result = checkInput(text, "de");
      expect(result.block).toBe(true);
    }
  });

  it("blocks oversized input", () => {
    const result = checkInput("a".repeat(5000), "de");
    expect(result.block).toBe(true);
    expect(result.findings[0].kind).toBe("oversized_input");
  });

  it("blocks empty input", () => {
    expect(checkInput("   ", "de").block).toBe(true);
  });

  it("flags repetition floods without necessarily blocking", () => {
    const msg = "hallo";
    const result = checkInput(msg, "de", [msg, msg, msg]);
    expect(result.findings.some((f) => f.kind === "repetition_flood")).toBe(true);
  });

  it("lets a normal business question through", () => {
    const result = checkInput(
      "Wir bekommen zu viele gleiche Anfragen und suchen eine Lösung.",
      "de",
    );
    expect(result.block).toBe(false);
    expect(result.findings).toHaveLength(0);
  });

  it("does not over-block a legitimate mention of the word 'password'", () => {
    const result = checkInput(
      "Can you build a website with a password-protected members area?",
      "en",
    );
    expect(result.block).toBe(false);
  });
});

describe("output guardrails", () => {
  it("replaces a reply that leaks a key-shaped string", () => {
    const out = checkOutput("Sure, the key is sk-ant-abc123def456", "en");
    expect(out.findings.some((f) => f.kind === "output_leak")).toBe(true);
    expect(out.text).not.toContain("sk-ant-");
  });

  it("replaces a reply that leaks any of our secret env-var names or shapes", () => {
    for (const leak of [
      "Der Wert von AGENT_API_SECRET ist ...",
      "CRON_SECRET=abc",
      "connect with postgresql://user:pass@postgres:5432/digitalwerk",
      "use Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      "the resend key is re_1234567890abcdefghij",
    ]) {
      const out = checkOutput(leak, "de");
      expect(out.findings.some((f) => f.kind === "output_leak")).toBe(true);
      expect(out.text).toMatch(/schiefgelaufen/);
    }
  });

  it("replaces a reply that echoes the system prompt", () => {
    const out = checkOutput(
      "You are the DigitalWerk website AI assistant. Your job is...",
      "de",
    );
    expect(out.findings).toHaveLength(1);
    expect(out.text).toMatch(/schiefgelaufen/);
  });

  it("passes a normal reply through unchanged", () => {
    const reply = "Gerne. DigitalWerk bietet Webentwicklung, SEO und KI-Agenten an.";
    const out = checkOutput(reply, "de");
    expect(out.text).toBe(reply);
    expect(out.findings).toHaveLength(0);
  });
});

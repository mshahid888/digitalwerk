import { beforeEach, describe, expect, it } from "vitest";
import { createSession, runAgentTurn } from "@/lib/chat-agent/agent/orchestrator";
import { resetLlmProviderCache } from "@/lib/chat-agent/llm";
import {
  BUSINESS_PROBLEMS,
  HALLUCINATION_BAIT,
  HUMAN_REQUESTS,
  NORMAL_QUESTIONS,
  PRICING_QUESTIONS,
  PROMPT_INJECTION,
} from "./fixtures";

beforeEach(() => {
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.CHAT_AGENT_PROVIDER;
  resetLlmProviderCache();
});

describe("orchestrator — end to end on the mock provider", () => {
  it("answers a company question from grounded knowledge", async () => {
    const session = createSession("s1", "de");
    const result = await runAgentTurn(session, NORMAL_QUESTIONS[0].text, "de");
    expect(result.reply.length).toBeGreaterThan(0);
    expect(result.retrieved.length).toBeGreaterThan(0);
    expect(result.language).toBe("de");
    expect(session.messages).toHaveLength(2);
  });

  it("states the KI-Agent price only from the knowledge base", async () => {
    const session = createSession("s2", "de");
    const result = await runAgentTurn(session, PRICING_QUESTIONS[0].text, "de");
    expect(result.reply).toContain("699");
    expect(result.intent.category).toBe("PRICING");
  });

  it("runs the problem -> recommendation flow for a described problem", async () => {
    const session = createSession("s3", "de");
    const result = await runAgentTurn(session, BUSINESS_PROBLEMS[0].text, "de");
    expect(result.recommendation?.recommendedServiceSlug).toBe("ki-agenten");
    // reply should include the recommender's follow-up question
    expect(result.reply).toContain("?");
    expect(result.leadScore.total).toBeGreaterThan(0);
  });

  it("replies in English when the visitor writes in English on a German session", async () => {
    const session = createSession("s4", "de");
    const result = await runAgentTurn(
      session,
      "Hello, we are a hotel and nobody finds us on Google. Can you help?",
      "de",
    );
    expect(result.language).toBe("en");
    expect(["seo", "google-unternehmensprofil"]).toContain(
      result.recommendation?.recommendedServiceSlug,
    );
  });

  it("hands off on an explicit human request", async () => {
    const session = createSession("s5", "de");
    const result = await runAgentTurn(session, HUMAN_REQUESTS[0].text, "de");
    expect(result.handoff).not.toBeNull();
    expect(result.handoff?.reason).toBe("visitor_requested");
    expect(result.handoff?.conversationSummary).toContain("Lead-Score");
  });

  it("hands off to a human for existing-client project issues", async () => {
    const session = createSession("s6", "de");
    const result = await runAgentTurn(
      session,
      "Ich bin Bestandskunde und habe ein Problem mit meinem laufenden Projekt.",
      "de",
    );
    expect(result.handoff?.reason).toBe("existing_client_issue");
  });

  it("blocks prompt injection and never calls the model", async () => {
    const session = createSession("s7", "en");
    for (const attack of PROMPT_INJECTION) {
      const result = await runAgentTurn(session, attack, "en");
      expect(result.reply).not.toMatch(/You are the DigitalWerk website AI assistant/);
      expect(result.reply).not.toMatch(/sk-ant-/);
      expect(result.directives).toBe("blocked-by-input-guardrail");
    }
  });

  it("does not fabricate services, customers, guarantees or case studies", async () => {
    for (const bait of HALLUCINATION_BAIT) {
      const session = createSession(`h-${bait.kind}`, "de");
      const result = await runAgentTurn(session, bait.text, "de");
      const reply = result.reply.toLowerCase();
      // must not affirm invented brands / customers
      expect(reply).not.toMatch(/\b(bmw|siemens)\b/);
      // must not make an affirmative promise of a guaranteed outcome
      expect(reply).not.toMatch(
        /wir garantieren ihnen|garantieren wir ihnen|ja,? .*garantier|garantiert platz 1|500\s*%|verdoppel|doubled your revenue/,
      );
      // must not quote a price for an invented product
      expect(reply).not.toMatch(/enterprise cloud hosting/);
      expect(result.reply.length).toBeGreaterThan(0);
    }
  });

  it("degrades gracefully to the composed reply if the provider errors", async () => {
    // Force the anthropic adapter with a key that will fail the network call,
    // then confirm we still get the deterministic fallback (no throw).
    process.env.ANTHROPIC_API_KEY = "sk-ant-invalid-key-for-test";
    process.env.CHAT_AGENT_PROVIDER = "anthropic";
    resetLlmProviderCache();
    const session = createSession("s8", "de");
    const result = await runAgentTurn(session, "Welche Leistungen bietet ihr an?", "de");
    expect(result.reply.length).toBeGreaterThan(0);
    expect(result.usage?.provider).toMatch(/anthropic/);
  }, 15000);

  it("keeps the internal lead score out of the reply text", async () => {
    const session = createSession("s9", "de");
    const result = await runAgentTurn(
      session,
      "Wir wollen dringend ein Angebot für einen KI-Agenten, ich bin Geschäftsführer.",
      "de",
    );
    expect(result.leadScore.total).toBeGreaterThan(0);
    expect(result.reply).not.toMatch(/\b\d{1,3}\s*\/\s*100\b/);
    expect(result.reply.toLowerCase()).not.toContain("lead score");
  });
});

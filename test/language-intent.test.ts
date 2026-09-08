import { describe, expect, it } from "vitest";
import { detectLanguage, resolveLanguage } from "@/lib/chat-agent/agent/language";
import { detectIntent } from "@/lib/chat-agent/agent/intent";
import {
  BUSINESS_PROBLEMS,
  HUMAN_REQUESTS,
  PRICING_QUESTIONS,
  SERVICE_QUESTIONS,
} from "./fixtures";

describe("language detection", () => {
  it("detects German", () => {
    expect(detectLanguage("Ich möchte eine neue Website für mein Unternehmen")).toBe("de");
  });
  it("detects English", () => {
    expect(detectLanguage("I would like a new website for my business")).toBe("en");
  });
  it("uses the fallback for ambiguous short text", () => {
    expect(detectLanguage("SEO", "en")).toBe("en");
    expect(detectLanguage("ok", "de")).toBe("de");
  });
  it("lets a strong visitor signal override the locale hint", () => {
    // German page visitor writing clearly in English
    expect(
      resolveLanguage("Hello, I need help with my website and getting more customers", "de"),
    ).toBe("en");
  });
  it("keeps the locale hint when the message gives no strong signal", () => {
    expect(resolveLanguage("SEO?", "de")).toBe("de");
  });
});

describe("intent detection", () => {
  it("classifies pricing questions", () => {
    for (const q of PRICING_QUESTIONS) {
      expect(detectIntent(q.text).category).toBe("PRICING");
    }
  });
  it("classifies human requests", () => {
    for (const q of HUMAN_REQUESTS) {
      expect(detectIntent(q.text).category).toBe("HUMAN_REQUEST");
    }
  });
  it("classifies service-information questions", () => {
    for (const q of SERVICE_QUESTIONS) {
      const result = detectIntent(q.text);
      expect([q.intent, "SERVICE_INFORMATION", "WEBSITE"]).toContain(result.category);
    }
  });
  it("routes business problems to a plausible service intent", () => {
    const first = detectIntent(BUSINESS_PROBLEMS[0].text);
    expect(["AI_AUTOMATION", "LEAD_GENERATION"]).toContain(first.category);
    const second = detectIntent(BUSINESS_PROBLEMS[1].text);
    expect(["SEO", "GOOGLE_BUSINESS_PROFILE"]).toContain(second.category);
  });
  it("returns OTHER with low confidence for unrelated text", () => {
    const result = detectIntent("What's the weather like today?");
    expect(result.category).toBe("OTHER");
    expect(result.confidence).toBeLessThan(0.5);
  });
  it("exposes matched signals for transparency", () => {
    const result = detectIntent("Was kostet eine neue Website?");
    expect(result.matchedSignals.length).toBeGreaterThan(0);
  });
});

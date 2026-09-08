import { describe, expect, it } from "vitest";
import { recommendService } from "@/lib/chat-agent/agent/recommendation";
import {
  createQualificationState,
  decideNextField,
  extractFacts,
  scoreLead,
} from "@/lib/chat-agent/agent/qualification";
import { detectIntent } from "@/lib/chat-agent/agent/intent";
import { BUSINESS_PROBLEMS } from "./fixtures";

describe("service recommendation", () => {
  it("does not recommend from a bare keyword without a problem signal", () => {
    const rec = recommendService({
      conversationText: "SEO",
      language: "de",
      hasProblemContext: false,
    });
    expect(rec).toBeNull();
  });

  it("recommends KI-Agenten for repetitive-question problems with context", () => {
    const rec = recommendService({
      conversationText: BUSINESS_PROBLEMS[0].text,
      language: "de",
      hasProblemContext: true,
    });
    expect(rec?.recommendedServiceSlug).toBe("ki-agenten");
    expect(rec?.contextSupported).toBe(true);
    expect(rec?.followUpQuestion).toBeTruthy();
  });

  it("recommends SEO for a local-visibility problem", () => {
    const rec = recommendService({
      conversationText: BUSINESS_PROBLEMS[1].text,
      language: "en",
      hasProblemContext: true,
    });
    expect(rec?.recommendedServiceSlug).toBe("seo");
    expect(rec?.reason).toMatch(/signal/i);
  });

  it("recommends Webentwicklung for an outdated-website problem", () => {
    const rec = recommendService({
      conversationText: BUSINESS_PROBLEMS[2].text,
      language: "de",
      hasProblemContext: true,
    });
    expect(rec?.recommendedServiceSlug).toBe("webentwicklung");
  });

  it("marks a single weak keyword hit as an unsupported hypothesis", () => {
    const rec = recommendService({
      conversationText: "wir brauchen mehr leads",
      language: "de",
      hasProblemContext: false,
    });
    expect(rec?.recommendedServiceSlug).toBe("leadgenerierung");
    expect(rec?.contextSupported).toBe(false);
    expect(rec?.confidence).toBeLessThan(0.7);
  });
});

describe("progressive qualification", () => {
  it("extracts an email and phone only when clearly present", () => {
    const facts = extractFacts(
      "Sie erreichen mich unter anna@example.com oder 0151 23456789",
      {},
    );
    expect(facts.email).toBe("anna@example.com");
    expect(facts.phone).toContain("0151");
  });

  it("extracts an industry hint", () => {
    const facts = extractFacts("Wir sind eine Zahnarztpraxis in Fürth", {});
    expect(facts.industry).toMatch(/Praxis/);
  });

  it("does not invent a name from 'I am the owner'", () => {
    const facts = extractFacts("I am the owner and we need help", {});
    expect(facts.name).toBeUndefined();
  });

  it("asks for the problem before any contact detail", () => {
    const state = createQualificationState();
    const next = decideNextField(state, { problemDescribed: false, readyForContact: false });
    expect(next).toBe("problem");
  });

  it("never asks for a field twice", () => {
    const state = createQualificationState();
    state.askedFields.push("problem");
    state.facts.problem = "x";
    const next = decideNextField(state, { problemDescribed: true, readyForContact: false });
    expect(next).not.toBe("problem");
  });

  it("gates contact details until the visitor is ready", () => {
    const state = createQualificationState();
    state.facts.problem = "We need more leads";
    state.facts.currentProcess = "manual";
    state.facts.desiredOutcome = "predictable";
    state.facts.company = "ACME";
    state.facts.industry = "Retail";
    state.facts.timeline = "soon";
    const gated = decideNextField(state, { problemDescribed: true, readyForContact: false });
    expect(gated).toBeNull();
    const open = decideNextField(state, { problemDescribed: true, readyForContact: true });
    expect(open).toBe("name");
  });
});

describe("lead scoring", () => {
  it("puts a browsing visitor in the informational band", () => {
    const score = scoreLead({
      facts: {},
      intent: detectIntent("Just browsing, thanks"),
      recommendation: null,
      conversationText: "Just browsing, thanks",
      problemDescribed: false,
      turnsFromVisitor: 1,
    });
    expect(score.band).toBe("informational");
    expect(score.total).toBeLessThan(30);
  });

  it("scores a high-intent, urgent, decision-maker request highly", () => {
    const text =
      "Wir wollen so schnell wie möglich einen KI-Agenten für die Terminbuchung. Können Sie uns ein Angebot machen? Ich bin die Inhaberin, hier ist meine E-Mail: chefin@example.com";
    const rec = recommendService({
      conversationText: text,
      language: "de",
      hasProblemContext: true,
    });
    const score = scoreLead({
      facts: { email: "chefin@example.com" },
      intent: detectIntent(text),
      recommendation: rec,
      conversationText: text,
      problemDescribed: true,
      turnsFromVisitor: 2,
    });
    expect(score.total).toBeGreaterThanOrEqual(75);
    expect(score.band).toBe("high_intent");
  });

  it("keeps the breakdown within each dimension's cap", () => {
    const score = scoreLead({
      facts: { email: "a@b.co" },
      intent: detectIntent("Wir brauchen dringend ein Angebot, wir verlieren Kunden"),
      recommendation: null,
      conversationText: "Wir brauchen dringend ein Angebot, wir verlieren Kunden",
      problemDescribed: true,
      turnsFromVisitor: 1,
    });
    const b = score.breakdown;
    expect(b.fit).toBeLessThanOrEqual(25);
    expect(b.problemClarity).toBeLessThanOrEqual(20);
    expect(b.intent).toBeLessThanOrEqual(20);
    expect(b.timing).toBeLessThanOrEqual(15);
    expect(b.impact).toBeLessThanOrEqual(10);
    expect(b.contactWillingness).toBeLessThanOrEqual(10);
    expect(score.total).toBe(
      b.fit + b.problemClarity + b.intent + b.timing + b.impact + b.contactWillingness,
    );
  });
});

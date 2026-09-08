import { describe, expect, it } from "vitest";
import { knowledgeBase, knowledgeStats } from "@/lib/chat-agent/knowledge/sources";
import { LexicalRetriever, getKnowledgeRetriever } from "@/lib/chat-agent/knowledge/retrieval";
import { retrieveForPrompt } from "@/lib/chat-agent/knowledge";

describe("knowledge base integrity", () => {
  it("has entries across every collection", () => {
    const stats = knowledgeStats();
    expect(stats.total).toBeGreaterThan(30);
    for (const collection of ["company", "services", "ai_solutions", "pricing", "faq", "policies"]) {
      expect(stats.byCollection[collection] ?? 0).toBeGreaterThan(0);
    }
  });

  it("every entry carries source + verification metadata", () => {
    for (const entry of knowledgeBase) {
      expect(entry.metadata.source).toBeTruthy();
      expect(entry.metadata.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(["approved", "provisional", "draft"]).toContain(entry.metadata.approvalStatus);
      expect(entry.metadata.version).toBeGreaterThanOrEqual(1);
    }
  });

  it("has unique ids", () => {
    const ids = new Set(knowledgeBase.map((e) => e.id));
    expect(ids.size).toBe(knowledgeBase.length);
  });
});

describe("lexical retrieval", () => {
  const retriever = new LexicalRetriever();

  it("finds pricing entries for a pricing query", () => {
    const hits = retriever.retrieve({ query: "Was kostet ein KI-Agent?", language: "de" });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.entry.collection === "pricing")).toBe(true);
    expect(hits[0].entry.body).toContain("699");
  });

  it("respects the language filter", () => {
    const hits = retriever.retrieve({ query: "how much does SEO cost", language: "en", limit: 5 });
    expect(hits.length).toBeGreaterThan(0);
    for (const h of hits) {
      expect(["en", "both"]).toContain(h.entry.language);
    }
  });

  it("excludes draft entries when minApproval is provisional", () => {
    const hits = retriever.retrieve({
      query: "welche daten sammelt ihr datenschutz",
      language: "de",
      minApproval: "provisional",
      limit: 10,
    });
    for (const h of hits) {
      expect(h.entry.metadata.approvalStatus).not.toBe("draft");
    }
  });

  it("returns nothing for an empty query", () => {
    expect(retriever.retrieve({ query: "   " })).toEqual([]);
  });

  it("is deterministic across calls", () => {
    const a = retriever.retrieve({ query: "neue website erstellen", language: "de" });
    const b = retriever.retrieve({ query: "neue website erstellen", language: "de" });
    expect(a.map((x) => x.entry.id)).toEqual(b.map((x) => x.entry.id));
  });

  it("getKnowledgeRetriever returns a working singleton", () => {
    expect(getKnowledgeRetriever().id).toBe("lexical");
  });
});

describe("retrieveForPrompt", () => {
  it("formats a context block with sources", () => {
    const { chunks, contextBlock } = retrieveForPrompt("Was bietet DigitalWerk an?", "de");
    expect(chunks.length).toBeGreaterThan(0);
    expect(contextBlock).toContain("Source:");
  });

  it("returns an empty block for an unanswerable query", () => {
    const { contextBlock } = retrieveForPrompt("xyzzy quux nonsense token", "de");
    expect(contextBlock).toBe("");
  });
});

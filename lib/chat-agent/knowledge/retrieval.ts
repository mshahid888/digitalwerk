import { knowledgeBase } from "./sources";
import type {
  ApprovalStatus,
  KnowledgeEntry,
  KnowledgeRetriever,
  RetrievedChunk,
  RetrieveOptions,
} from "./types";

// Lexical retriever — deliberately simple. The knowledge base is small
// (dozens of entries), so a keyword/token-overlap scorer with light
// stemming is reliable, fast, dependency-free and fully deterministic for
// tests. The KnowledgeRetriever interface lets a vector/embedding retriever
// replace this later if conversation data ever justifies it
// (see docs/CHAT-AGENT/ARCHITECTURE.md — "Retrieval").

const APPROVAL_RANK: Record<ApprovalStatus, number> = {
  draft: 0,
  provisional: 1,
  approved: 2,
};

// Query-cue -> collection affinity. When the raw query clearly signals a
// pricing or definition question, nudge the matching collection up so a
// broad service entry doesn't outrank the specific answer.
const PRICE_CUE = /\b(kost(e|en|et)|preis|price|pricing|cost|how much|wie viel|budget|teuer|monatlich|per month)\b/i;
const DEFINITION_CUE = /\b(was ist|what is|unterschied|difference|wie lange|how long|garant|guarantee)\b/i;
const CONTACT_CUE = /\b(kontakt|contact|telefon|phone|erreich|reach you|adresse|address|email)\b/i;

function affinityMultiplier(rawQuery: string, collection: string): number {
  if (collection === "pricing" && PRICE_CUE.test(rawQuery)) return 1.6;
  if (collection === "faq" && DEFINITION_CUE.test(rawQuery)) return 1.35;
  if (collection === "company" && CONTACT_CUE.test(rawQuery)) return 1.3;
  return 1;
}

const STOPWORDS = new Set([
  // German
  "der", "die", "das", "ein", "eine", "und", "oder", "ist", "sind", "im", "in",
  "an", "auf", "für", "mit", "von", "zu", "wie", "was", "wo", "wer", "ich", "wir",
  "sie", "mein", "unser", "euer", "es", "den", "dem", "des", "ob", "man", "auch",
  "nicht", "kann", "können", "haben", "hat", "wird", "werden", "bei",
  // English
  "the", "a", "an", "and", "or", "is", "are", "of", "to", "for", "with", "on",
  "in", "at", "how", "what", "where", "who", "i", "we", "you", "my", "our", "it",
  "do", "does", "can", "could", "would", "have", "has", "will", "be",
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, " ");
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[\s-]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t))
    // crude stemming: drop common German/English plural & inflection endings
    .map((t) => t.replace(/(ungen|ung|en|er|es|te|st|s)$/g, (m) => (t.length - m.length >= 3 ? "" : m)));
}

function entryTokens(item: KnowledgeEntry): Map<string, number> {
  const weights = new Map<string, number>();
  const add = (tokens: string[], weight: number) => {
    for (const token of tokens) {
      weights.set(token, (weights.get(token) ?? 0) + weight);
    }
  };
  add(tokenize(item.title), 3);
  add(item.keywords.flatMap((k) => tokenize(k)), 4);
  add(tokenize(item.body), 1);
  return weights;
}

// Precompute once at module load — the base is static.
const INDEX: { item: KnowledgeEntry; tokens: Map<string, number>; norm: number }[] =
  knowledgeBase.map((item) => {
    const tokens = entryTokens(item);
    let sumSq = 0;
    for (const w of tokens.values()) sumSq += w * w;
    return { item, tokens, norm: Math.sqrt(sumSq) || 1 };
  });

export class LexicalRetriever implements KnowledgeRetriever {
  readonly id = "lexical";

  retrieve(options: RetrieveOptions): RetrievedChunk[] {
    const queryTokens = tokenize(options.query);
    if (queryTokens.length === 0) return [];

    const queryWeights = new Map<string, number>();
    for (const token of queryTokens) {
      queryWeights.set(token, (queryWeights.get(token) ?? 0) + 1);
    }
    let qSumSq = 0;
    for (const w of queryWeights.values()) qSumSq += w * w;
    const qNorm = Math.sqrt(qSumSq) || 1;

    const minApprovalRank = APPROVAL_RANK[options.minApproval ?? "draft"];
    const limit = options.limit ?? 4;

    const scored: RetrievedChunk[] = [];
    for (const { item, tokens, norm } of INDEX) {
      if (
        options.language &&
        item.language !== "both" &&
        item.language !== options.language
      ) {
        continue;
      }
      if (options.collections && !options.collections.includes(item.collection)) {
        continue;
      }
      if (APPROVAL_RANK[item.metadata.approvalStatus] < minApprovalRank) {
        continue;
      }

      let dot = 0;
      for (const [token, qw] of queryWeights) {
        const ew = tokens.get(token);
        if (ew) dot += qw * ew;
      }
      if (dot === 0) continue;

      const score =
        (dot / (qNorm * norm)) *
        affinityMultiplier(options.query, item.collection);
      scored.push({ entry: item, score });
    }

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // deterministic tie-break: higher approval, then id
      const approvalDiff =
        APPROVAL_RANK[b.entry.metadata.approvalStatus] -
        APPROVAL_RANK[a.entry.metadata.approvalStatus];
      if (approvalDiff !== 0) return approvalDiff;
      return a.entry.id.localeCompare(b.entry.id);
    });

    return scored.slice(0, limit);
  }
}

let defaultRetriever: KnowledgeRetriever | null = null;

export function getKnowledgeRetriever(): KnowledgeRetriever {
  if (!defaultRetriever) defaultRetriever = new LexicalRetriever();
  return defaultRetriever;
}

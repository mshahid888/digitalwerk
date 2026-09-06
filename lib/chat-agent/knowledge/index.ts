export type {
  KnowledgeEntry,
  KnowledgeCollection,
  KnowledgeLanguage,
  KnowledgeMetadata,
  KnowledgeRetriever,
  RetrievedChunk,
  RetrieveOptions,
  ApprovalStatus,
} from "./types";

export {
  knowledgeBase,
  knowledgeStats,
  serviceCatalog,
  priceRecords,
  type PriceRecord,
} from "./sources";

export { LexicalRetriever, getKnowledgeRetriever } from "./retrieval";

import { getKnowledgeRetriever } from "./retrieval";
import type { RetrievedChunk } from "./types";

// Convenience wrapper used by the orchestrator: retrieve visitor-safe
// knowledge (never `draft`) in the conversation language, and format it
// for injection into the system prompt with explicit source lines so the
// model can cite/attribute and so we can tell fabrication from grounded
// answers in evals.
export function retrieveForPrompt(
  query: string,
  language: "de" | "en",
  limit = 4,
): { chunks: RetrievedChunk[]; contextBlock: string } {
  const chunks = getKnowledgeRetriever().retrieve({
    query,
    language,
    limit,
    minApproval: "provisional",
  });

  if (chunks.length === 0) {
    return { chunks, contextBlock: "" };
  }

  const contextBlock = chunks
    .map((chunk, i) => {
      const m = chunk.entry.metadata;
      return [
        `[${i + 1}] ${chunk.entry.title} (${chunk.entry.collection}, ${m.approvalStatus}, verified ${m.lastVerified})`,
        chunk.entry.body,
        `Source: ${m.source}`,
      ].join("\n");
    })
    .join("\n\n");

  return { chunks, contextBlock };
}

// Knowledge base types. Every fact the agent may state about DigitalWerk
// lives in a KnowledgeEntry with source + verification metadata, per
// 03_KNOWLEDGE_BASE_SPECIFICATION.md. The agent must not assert
// DigitalWerk-specific facts that are not backed by an entry.

export type KnowledgeCollection =
  | "company"
  | "services"
  | "ai_solutions"
  | "pricing"
  | "faq"
  | "case_studies"
  | "policies";

export type ApprovalStatus =
  | "approved" // cleared for customer-facing use
  | "provisional" // derived from the public site snapshot, needs DigitalWerk sign-off
  | "draft"; // internal only, never shown to visitors

export type KnowledgeLanguage = "de" | "en" | "both";

export type KnowledgeMetadata = {
  /** Where this fact came from (URL or internal doc reference). */
  source: string;
  /** ISO date the fact was last checked against its source. */
  lastVerified: string;
  approvalStatus: ApprovalStatus;
  /** Monotonic version for this entry; bump on any content change. */
  version: number;
  /** "low" for public marketing facts, "high" for anything sensitive. */
  sensitivity: "low" | "medium" | "high";
};

export type KnowledgeEntry = {
  id: string;
  collection: KnowledgeCollection;
  language: KnowledgeLanguage;
  title: string;
  /** The retrievable text. Keep each entry to a single coherent fact/topic. */
  body: string;
  /** Free-form tags used by the lexical retriever for matching. */
  keywords: string[];
  metadata: KnowledgeMetadata;
};

export type RetrievedChunk = {
  entry: KnowledgeEntry;
  /** 0..1 lexical relevance for this query. */
  score: number;
};

export type RetrieveOptions = {
  query: string;
  language?: Exclude<KnowledgeLanguage, "both">;
  collections?: KnowledgeCollection[];
  limit?: number;
  /** Exclude entries below this approval level from results. */
  minApproval?: ApprovalStatus;
};

export interface KnowledgeRetriever {
  readonly id: string;
  retrieve(options: RetrieveOptions): RetrievedChunk[];
}

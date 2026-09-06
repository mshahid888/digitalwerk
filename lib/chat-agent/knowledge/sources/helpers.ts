import type {
  ApprovalStatus,
  KnowledgeCollection,
  KnowledgeEntry,
  KnowledgeLanguage,
} from "../types";

const SNAPSHOT_DATE = "2026-09-06";

type EntryInput = {
  id: string;
  collection: KnowledgeCollection;
  language: KnowledgeLanguage;
  title: string;
  body: string;
  keywords: string[];
  source: string;
  approvalStatus?: ApprovalStatus;
  lastVerified?: string;
  sensitivity?: "low" | "medium" | "high";
  version?: number;
};

// Small constructor so the source files stay readable. Defaults reflect the
// current reality: content transcribed from the public site is `provisional`
// until DigitalWerk signs off.
export function entry(input: EntryInput): KnowledgeEntry {
  return {
    id: input.id,
    collection: input.collection,
    language: input.language,
    title: input.title,
    body: input.body,
    keywords: input.keywords.map((k) => k.toLowerCase()),
    metadata: {
      source: input.source,
      lastVerified: input.lastVerified ?? SNAPSHOT_DATE,
      approvalStatus: input.approvalStatus ?? "provisional",
      version: input.version ?? 1,
      sensitivity: input.sensitivity ?? "low",
    },
  };
}

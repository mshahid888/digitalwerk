import { createMemoryStore } from "./memory-store";
import type { ChatAgentStore } from "./types";

export * from "./types";
export { createMemoryStore } from "./memory-store";

// Single process-wide store instance. On Vercel serverless this is a
// per-instance in-memory store — fine for development and the first
// preview, replaced by a durable store for production (the getChatAgentStore
// seam is the only place that changes). See docs/CHAT-AGENT/PERSISTENCE.md.

declare global {
  var __chatAgentStore: ChatAgentStore | undefined;
}

export function getChatAgentStore(): ChatAgentStore {
  if (!globalThis.__chatAgentStore) {
    globalThis.__chatAgentStore = createMemoryStore();
  }
  return globalThis.__chatAgentStore;
}

/** Test helper — reset all in-memory data. */
export function resetChatAgentStore(): void {
  globalThis.__chatAgentStore = createMemoryStore();
}

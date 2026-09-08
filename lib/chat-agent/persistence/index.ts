import { getChatAgentConfig } from "../config";
import { createMemoryStore } from "./memory-store";
import type { ChatAgentStore } from "./types";

export * from "./types";
export { createMemoryStore } from "./memory-store";
export { PostgresChatAgentStore, createPostgresStore } from "./postgres/store";
export { SCHEMA_STATEMENTS, migrate } from "./postgres/schema";
export type { SqlClient, SqlRow } from "./postgres/client";

// Store selection:
//   - a Postgres connection string in the environment  -> PostgresChatAgentStore
//   - otherwise                                        -> in-memory store
//
// The result is memoized per process. On a serverless cold start the
// Postgres store lazily connects + runs `CREATE TABLE IF NOT EXISTS` on
// first use (idempotent). If the database is unreachable, callers get the
// error from that operation — the agent's own turn logic still runs (the
// orchestrator degrades gracefully); only persistence is affected.

declare global {
  var __chatAgentStore: Promise<ChatAgentStore> | undefined;
}

async function build(): Promise<ChatAgentStore> {
  const config = getChatAgentConfig();
  if (!config.databaseUrl) {
    return createMemoryStore();
  }
  // Imported lazily so the postgres driver is never loaded in mock mode.
  const { createPostgresStore } = await import("./postgres/store");
  const store = await createPostgresStore(config.databaseUrl);
  try {
    await store.init();
  } catch (error) {
    console.error(
      "Chat agent: Postgres store failed to initialise, falling back to in-memory for this instance:",
      error,
    );
    return createMemoryStore();
  }
  return store;
}

export function getChatAgentStore(): Promise<ChatAgentStore> {
  if (!globalThis.__chatAgentStore) {
    globalThis.__chatAgentStore = build();
  }
  return globalThis.__chatAgentStore;
}

/** Test helper — reset to a fresh in-memory store. */
export function resetChatAgentStore(): void {
  globalThis.__chatAgentStore = Promise.resolve(createMemoryStore());
}

/** Test helper — inject a specific store (e.g. Postgres over a fake client). */
export function setChatAgentStore(store: ChatAgentStore): void {
  globalThis.__chatAgentStore = Promise.resolve(store);
}

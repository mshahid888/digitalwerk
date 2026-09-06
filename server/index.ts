import { serve } from "@hono/node-server";
import { getChatAgentConfig } from "../lib/chat-agent";
import { createApp } from "./app";

// Entry point for the standalone DigitalWerk Agent API (Hetzner).
// Run with:  node --import tsx server/index.ts   (see server/Dockerfile)

const port = Number.parseInt(process.env.PORT ?? "8080", 10);
const config = getChatAgentConfig();

if (!config.agentApiSecret) {
  console.warn(
    "Agent API: AGENT_API_SECRET is not set — the shared-secret gate is OPEN. Set it in production.",
  );
}
console.info(
  JSON.stringify({
    t: new Date().toISOString(),
    msg: "agent-api starting",
    port,
    llm: { provider: config.llm.label, kind: config.llm.kind, model: config.llm.model },
    db: config.databaseConfigured ? "postgres" : "memory",
    notifications: config.handoffChannel ?? "none",
    rateLimitPerMinute: config.rateLimitPerMinute,
    corsOrigins: config.agentApiAllowedOrigins,
  }),
);

const app = createApp();

serve({ fetch: app.fetch, port }, (info) => {
  console.info(`agent-api listening on :${info.port}`);
});

// Graceful shutdown so Postgres connections close cleanly.
for (const sig of ["SIGTERM", "SIGINT"] as const) {
  process.on(sig, () => {
    console.info(`agent-api received ${sig}, exiting`);
    process.exit(0);
  });
}

import { randomUUID } from "node:crypto";
import { Hono, type Context, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { getChatAgentConfig } from "../lib/chat-agent";
import {
  adminHandoffsHandler,
  adminHandoffsRetryHandler,
  adminLeadsHandler,
  adminPurgeHandler,
  cronPurgeHandler,
  handoffHandler,
  healthHandler,
  leadHandler,
  messageHandler,
  sessionHandler,
  type HttpResult,
} from "../lib/chat-agent/http/handlers";
import { allow } from "./rate-limit";

// The DigitalWerk Agent API — a thin HTTP transport over lib/chat-agent.
// It runs on Hetzner in front of the private Postgres; the Vercel-hosted
// website proxies /api/chat/* here. The browser never talks to it directly.
//
// Same handlers as the Next.js routes (lib/chat-agent/http/handlers) — no
// duplicated logic. Adds: shared-secret gate, CORS, per-IP rate limiting,
// structured request logging.

function clientIp(c: Context): string {
  const xff = c.req.header("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return c.req.header("x-real-ip") ?? "unknown";
}

// Return a plain Response so we are not constrained by Hono's StatusCode union.
function send(r: HttpResult): Response {
  return new Response(JSON.stringify(r.body), {
    status: r.status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function createApp(): Hono {
  const config = getChatAgentConfig();
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: (origin) =>
        config.agentApiAllowedOrigins.includes(origin) ? origin : "",
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400,
    }),
  );

  // Request id + structured log (no bodies, no secrets, no PII).
  app.use("*", async (c, next) => {
    const id = c.req.header("x-request-id") ?? randomUUID();
    const started = Date.now();
    c.header("x-request-id", id);
    await next();
    console.info(
      JSON.stringify({
        t: new Date().toISOString(),
        id,
        method: c.req.method,
        path: new URL(c.req.url).pathname,
        status: c.res.status,
        ms: Date.now() - started,
        ip: clientIp(c),
      }),
    );
  });

  // Shared-secret gate — everything except the health check. Caddy / the
  // Vercel proxy send `X-Agent-Auth`. If AGENT_API_SECRET is unset the gate
  // is open (local dev) and a warning is logged once at startup.
  app.use("/api/*", async (c, next) => {
    const path = new URL(c.req.url).pathname;
    if (path === "/api/chat/health") return next();
    const secret = config.agentApiSecret;
    if (secret && c.req.header("x-agent-auth") !== secret) {
      return c.json({ error: "Forbidden." }, 403);
    }
    return next();
  });

  // Per-IP rate limit on the LLM-invoking endpoints.
  app.use("/api/chat/session", rateLimit(config.rateLimitPerMinute));
  app.use("/api/chat/message", rateLimit(config.rateLimitPerMinute));

  // ---- routes ----
  app.get("/", (c) => c.json({ service: "digitalwerk-agent-api", ok: true }));

  app.post("/api/chat/session", async (c) =>
    send(await sessionHandler(await safeJson(c))),
  );
  app.post("/api/chat/message", async (c) =>
    send(await messageHandler(await safeJson(c))),
  );
  app.post("/api/chat/lead", async (c) =>
    send(await leadHandler(await safeJson(c))),
  );
  app.post("/api/chat/handoff", async (c) =>
    send(await handoffHandler(await safeJson(c))),
  );
  app.get("/api/chat/health", async () => send(await healthHandler()));

  app.get("/api/chat/admin/leads", async (c) =>
    send(await adminLeadsHandler({
      authHeader: c.req.header("authorization") ?? null,
      limit: c.req.query("limit") ?? null,
      status: c.req.query("status") ?? null,
    })),
  );
  app.get("/api/chat/admin/handoffs", async (c) =>
    send(await adminHandoffsHandler({
      authHeader: c.req.header("authorization") ?? null,
      limit: c.req.query("limit") ?? null,
    })),
  );
  app.post("/api/chat/admin/handoffs", async (c) =>
    send(await adminHandoffsRetryHandler({
      authHeader: c.req.header("authorization") ?? null,
    })),
  );
  app.post("/api/chat/admin/purge", async (c) =>
    send(await adminPurgeHandler({
      authHeader: c.req.header("authorization") ?? null,
    })),
  );

  const cron = async (c: Context) =>
    send(await cronPurgeHandler({ authHeader: c.req.header("authorization") ?? null }));
  app.get("/api/cron/purge-transcripts", cron);
  app.post("/api/cron/purge-transcripts", cron);

  app.notFound((c) => c.json({ error: "Not found." }, 404));
  app.onError((err, c) => {
    console.error("Agent API unhandled error:", err);
    return c.json({ error: "Internal error." }, 500);
  });

  return app;
}

function rateLimit(perMinute: number): MiddlewareHandler {
  return async (c, next) => {
    if (!allow(`rl:${clientIp(c)}`, perMinute)) {
      return c.json(
        { error: "Zu viele Anfragen. Bitte warten Sie einen Moment." },
        429,
      );
    }
    await next();
  };
}

async function safeJson(c: Context): Promise<unknown> {
  try {
    return await c.req.json();
  } catch {
    return {};
  }
}

import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../server/app";
import { resetChatAgentStore } from "@/lib/chat-agent/persistence";
import { resetLlmProviderCache } from "@/lib/chat-agent/llm";
import { resetNotificationChannelCache } from "@/lib/chat-agent/notifications";
import { resetRateLimiter } from "../server/rate-limit";

const ENV = [
  "AGENT_API_SECRET", "AGENT_API_ALLOWED_ORIGINS", "CHAT_AGENT_ADMIN_TOKEN",
  "CHAT_AGENT_RATE_LIMIT_PER_MINUTE", "LLM_PROVIDER", "LLM_BASE_URL",
  "LLM_API_KEY", "CHAT_AGENT_DATABASE_URL", "DATABASE_URL", "CRON_SECRET",
  "CHAT_AGENT_HANDOFF_CHANNEL", "RESEND_API_KEY",
];

beforeEach(() => {
  for (const k of ENV) delete process.env[k];
  resetChatAgentStore();
  resetLlmProviderCache();
  resetNotificationChannelCache();
  resetRateLimiter();
});

function app() {
  return createApp();
}
const json = (body: unknown) => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

describe("DigitalWerk Agent API", () => {
  it("health is reachable without the shared secret", async () => {
    process.env.AGENT_API_SECRET = "s3cret";
    const res = await app().request("/api/chat/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { llm: { provider: string }; status: string };
    expect(body.llm.provider).toBe("mock");
  });

  it("rejects other endpoints without X-Agent-Auth when the secret is set", async () => {
    process.env.AGENT_API_SECRET = "s3cret";
    const res = await app().request("/api/chat/session", json({ locale: "de" }));
    expect(res.status).toBe(403);
  });

  it("accepts requests carrying the correct X-Agent-Auth", async () => {
    process.env.AGENT_API_SECRET = "s3cret";
    const res = await app().request("/api/chat/session", {
      ...json({ locale: "de" }),
      headers: { "content-type": "application/json", "x-agent-auth": "s3cret" },
    });
    expect(res.status).toBe(201);
  });

  it("runs a full session -> message flow (no secret configured = open, dev mode)", async () => {
    const a = app();
    const s = await a.request("/api/chat/session", json({ locale: "de" }));
    const { sessionId } = (await s.json()) as { sessionId: string };
    expect(sessionId).toHaveLength(36);

    const m = await a.request(
      "/api/chat/message",
      json({ sessionId, message: "Was kostet ein KI-Agent?", locale: "de" }),
    );
    expect(m.status).toBe(200);
    const reply = (await m.json()) as { reply: string };
    expect(reply.reply).toContain("699");
  });

  it("rate-limits the message endpoint per IP", async () => {
    process.env.CHAT_AGENT_RATE_LIMIT_PER_MINUTE = "3";
    const a = app();
    const headers = { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" };
    let last = 0;
    for (let i = 0; i < 5; i += 1) {
      const r = await a.request("/api/chat/session", {
        method: "POST",
        headers,
        body: JSON.stringify({ locale: "de" }),
      });
      last = r.status;
    }
    expect(last).toBe(429);
  });

  it("admin endpoints are 503 without a token, 200 with the right bearer", async () => {
    const a = app();
    expect((await a.request("/api/chat/admin/leads")).status).toBe(503);

    process.env.CHAT_AGENT_ADMIN_TOKEN = "admin-tok";
    const b = app();
    expect((await b.request("/api/chat/admin/leads")).status).toBe(401);
    const ok = await b.request("/api/chat/admin/leads", {
      headers: { authorization: "Bearer admin-tok" },
    });
    expect(ok.status).toBe(200);
  });

  it("the cron endpoint runs and reports a purge result", async () => {
    const res = await app().request("/api/cron/purge-transcripts", { method: "POST" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; purge: { retentionDays: number } };
    expect(body.ok).toBe(true);
    expect(body.purge.retentionDays).toBe(30);
  });

  it("rejects a malformed message body with 400", async () => {
    const a = app();
    const s = await a.request("/api/chat/session", json({}));
    const { sessionId } = (await s.json()) as { sessionId: string };
    const res = await a.request("/api/chat/message", json({ sessionId, message: "" }));
    expect(res.status).toBe(400);
  });

  it("rejects a non-UUID sessionId with 400, not 500 (Postgres uuid guard)", async () => {
    const a = app();
    const res = await a.request(
      "/api/chat/message",
      json({ sessionId: "does-not-exist-1234567", message: "hi" }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 404 for a well-formed but unknown sessionId", async () => {
    const a = app();
    const res = await a.request(
      "/api/chat/message",
      json({ sessionId: "00000000-0000-4000-8000-000000000000", message: "hi" }),
    );
    expect(res.status).toBe(404);
  });
});

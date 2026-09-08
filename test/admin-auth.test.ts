import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkAdminAuth } from "@/lib/chat-agent/admin-auth";

const saved = process.env.CHAT_AGENT_ADMIN_TOKEN;

beforeEach(() => {
  delete process.env.CHAT_AGENT_ADMIN_TOKEN;
});
afterEach(() => {
  if (saved === undefined) delete process.env.CHAT_AGENT_ADMIN_TOKEN;
  else process.env.CHAT_AGENT_ADMIN_TOKEN = saved;
});

function req(auth?: string): Request {
  return new Request("https://x/api/chat/admin/leads", {
    headers: auth ? { authorization: auth } : {},
  });
}

describe("checkAdminAuth", () => {
  it("returns 503 when no admin token is configured", () => {
    const result = checkAdminAuth(req("Bearer anything"));
    expect(result).toEqual({
      ok: false,
      status: 503,
      error: expect.stringContaining("disabled"),
    });
  });

  it("returns 401 when the token is configured but no bearer is sent", () => {
    process.env.CHAT_AGENT_ADMIN_TOKEN = "s3cret-token";
    expect(checkAdminAuth(req()).ok).toBe(false);
    expect(checkAdminAuth(req())).toMatchObject({ status: 401 });
  });

  it("returns 403 for a wrong token", () => {
    process.env.CHAT_AGENT_ADMIN_TOKEN = "s3cret-token";
    expect(checkAdminAuth(req("Bearer wrong-token"))).toMatchObject({ status: 403 });
  });

  it("accepts the exact configured token", () => {
    process.env.CHAT_AGENT_ADMIN_TOKEN = "s3cret-token";
    expect(checkAdminAuth(req("Bearer s3cret-token"))).toEqual({ ok: true });
  });

  it("is not fooled by a token that is a prefix of the real one", () => {
    process.env.CHAT_AGENT_ADMIN_TOKEN = "s3cret-token";
    expect(checkAdminAuth(req("Bearer s3cret")).ok).toBe(false);
  });
});

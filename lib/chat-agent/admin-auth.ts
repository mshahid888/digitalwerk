import { getChatAgentConfig } from "./config";

// Shared guard for /api/chat/admin/*. These endpoints expose lead PII, so
// they are DISABLED unless CHAT_AGENT_ADMIN_TOKEN is set, and then require
// that exact token as a Bearer credential. The token is compared in
// constant time and never logged.

export type AdminAuth =
  | { ok: true }
  | { ok: false; status: 401 | 403 | 503; error: string };

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function checkAdminAuth(request: Request): AdminAuth {
  const configured = getChatAgentConfig().adminToken;
  if (!configured) {
    return {
      ok: false,
      status: 503,
      error:
        "Admin API is disabled. Set CHAT_AGENT_ADMIN_TOKEN to enable it.",
    };
  }

  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { ok: false, status: 401, error: "Missing bearer token." };
  }
  if (!timingSafeEqual(match[1].trim(), configured)) {
    return { ok: false, status: 403, error: "Invalid token." };
  }
  return { ok: true };
}

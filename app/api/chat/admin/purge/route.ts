import { adminPurgeHandler } from "@/lib/chat-agent/http/handlers";
import { proxyToAgentApi } from "@/lib/chat-agent/http/proxy";
import { toResponse } from "@/lib/chat-agent/http/next-route";

// POST /api/chat/admin/purge — run the retention sweep on demand.
// Requires: Authorization: Bearer <CHAT_AGENT_ADMIN_TOKEN>.

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const proxied = await proxyToAgentApi("/api/chat/admin/purge", {
    method: "POST",
    authHeader,
    body: {},
  });
  if (proxied) return toResponse(proxied);
  return toResponse(await adminPurgeHandler({ authHeader }));
}

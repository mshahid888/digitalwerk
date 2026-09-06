import { adminLeadsHandler } from "@/lib/chat-agent/http/handlers";
import { proxyToAgentApi } from "@/lib/chat-agent/http/proxy";
import { toResponse } from "@/lib/chat-agent/http/next-route";

// GET /api/chat/admin/leads?limit=100&status=new
// Requires: Authorization: Bearer <CHAT_AGENT_ADMIN_TOKEN>. 503 when unset.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const authHeader = request.headers.get("authorization");

  const proxied = await proxyToAgentApi("/api/chat/admin/leads", {
    method: "GET",
    authHeader,
    search: search.toString(),
  });
  if (proxied) return toResponse(proxied);

  return toResponse(
    await adminLeadsHandler({
      authHeader,
      limit: search.get("limit"),
      status: search.get("status"),
    }),
  );
}

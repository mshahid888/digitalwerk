import {
  adminHandoffsHandler,
  adminHandoffsRetryHandler,
} from "@/lib/chat-agent/http/handlers";
import { proxyToAgentApi } from "@/lib/chat-agent/http/proxy";
import { toResponse } from "@/lib/chat-agent/http/next-route";

// GET  /api/chat/admin/handoffs?limit=100  — list handoff records
// POST /api/chat/admin/handoffs            — retry pending notification deliveries

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const search = new URL(request.url).searchParams;
  const proxied = await proxyToAgentApi("/api/chat/admin/handoffs", {
    method: "GET",
    authHeader,
    search: search.toString(),
  });
  if (proxied) return toResponse(proxied);
  return toResponse(await adminHandoffsHandler({ authHeader, limit: search.get("limit") }));
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const proxied = await proxyToAgentApi("/api/chat/admin/handoffs", {
    method: "POST",
    authHeader,
    body: {},
  });
  if (proxied) return toResponse(proxied);
  return toResponse(await adminHandoffsRetryHandler({ authHeader }));
}

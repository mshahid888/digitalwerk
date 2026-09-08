import { healthHandler } from "@/lib/chat-agent/http/handlers";
import { proxyOrLocal } from "@/lib/chat-agent/http/next-route";

// GET /api/chat/health — non-secret status: LLM provider, database
// reachability, notification channel, retention. When AGENT_API_URL is set
// this reflects the Hetzner Agent API's own health.

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return proxyOrLocal(request, "/api/chat/health", () => healthHandler());
}

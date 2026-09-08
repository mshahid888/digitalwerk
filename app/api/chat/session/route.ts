import { sessionHandler } from "@/lib/chat-agent/http/handlers";
import { proxyOrLocal } from "@/lib/chat-agent/http/next-route";

// POST /api/chat/session — start a chat session.
// Proxies to the Hetzner Agent API when AGENT_API_URL is set; otherwise
// runs the agent in-process. The browser only ever calls this same-origin.

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return proxyOrLocal(request, "/api/chat/session", sessionHandler);
}

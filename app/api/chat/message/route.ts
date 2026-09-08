import { messageHandler } from "@/lib/chat-agent/http/handlers";
import { proxyOrLocal } from "@/lib/chat-agent/http/next-route";

// POST /api/chat/message — send a visitor message, get the agent's reply.

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return proxyOrLocal(request, "/api/chat/message", messageHandler);
}

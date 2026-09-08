import { handoffHandler } from "@/lib/chat-agent/http/handlers";
import { proxyOrLocal } from "@/lib/chat-agent/http/next-route";

// POST /api/chat/handoff — visitor explicitly asks to be handed to a human.

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return proxyOrLocal(request, "/api/chat/handoff", handoffHandler);
}

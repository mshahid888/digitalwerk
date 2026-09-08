import { leadHandler } from "@/lib/chat-agent/http/handlers";
import { proxyOrLocal } from "@/lib/chat-agent/http/next-route";

// POST /api/chat/lead — attach / update contact + lead details on a session.

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return proxyOrLocal(request, "/api/chat/lead", leadHandler);
}

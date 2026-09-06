import { chatAgentHealth } from "@/lib/chat-agent";

// GET /api/chat/health — non-secret status of the chat agent: which LLM
// provider is active (mock vs. anthropic), knowledge base size and limits.
// Used by the checkpoint report and for a quick post-deploy smoke check.
// Contains no secrets — only whether a key is present.

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ ok: true, ...chatAgentHealth() });
  } catch (error) {
    console.error("Chat health: failed to build snapshot:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}

import { checkAdminAuth, listHandoffs, retryPendingHandoffs } from "@/lib/chat-agent";

// GET  /api/chat/admin/handoffs?limit=100   — list handoff records
// POST /api/chat/admin/handoffs             — retry pending notification deliveries
// Requires: Authorization: Bearer <CHAT_AGENT_ADMIN_TOKEN>

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const url = new URL(request.url);
  const limitParam = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  const limit = Number.isFinite(limitParam)
    ? Math.min(500, Math.max(1, limitParam))
    : 100;

  try {
    const handoffs = await listHandoffs({ limit });
    return Response.json({
      count: handoffs.length,
      pendingDispatch: handoffs.filter((h) => !h.dispatched).length,
      handoffs,
    });
  } catch (error) {
    console.error("Chat admin handoffs: query failed:", error);
    return Response.json({ error: "Failed to load handoffs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const result = await retryPendingHandoffs();
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("Chat admin handoffs: retry failed:", error);
    return Response.json({ error: "Retry failed." }, { status: 500 });
  }
}

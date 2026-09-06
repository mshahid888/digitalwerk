import { checkAdminAuth, listLeads } from "@/lib/chat-agent";

// GET /api/chat/admin/leads?limit=100&status=new
// Requires: Authorization: Bearer <CHAT_AGENT_ADMIN_TOKEN>
// Disabled (503) when the token env var is unset.

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "closed"] as const;

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
  const statusParam = url.searchParams.get("status");
  const status = STATUSES.includes(statusParam as (typeof STATUSES)[number])
    ? (statusParam as (typeof STATUSES)[number])
    : undefined;

  try {
    const leads = await listLeads({ limit, status });
    return Response.json({ count: leads.length, leads });
  } catch (error) {
    console.error("Chat admin leads: query failed:", error);
    return Response.json({ error: "Failed to load leads." }, { status: 500 });
  }
}

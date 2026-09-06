import { checkAdminAuth, purgeExpiredData } from "@/lib/chat-agent";

// POST /api/chat/admin/purge
// Manually run the retention sweep (also runs daily via Vercel Cron —
// see app/api/cron/purge-transcripts/route.ts).
// Requires: Authorization: Bearer <CHAT_AGENT_ADMIN_TOKEN>

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const result = await purgeExpiredData();
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("Chat admin purge: failed:", error);
    return Response.json({ error: "Purge failed." }, { status: 500 });
  }
}

import { getChatAgentConfig, purgeExpiredData, retryPendingHandoffs } from "@/lib/chat-agent";

// Daily maintenance, invoked by Vercel Cron (see vercel.json). Runs only in
// production deployments.
//   1. Purge raw transcripts + events past the retention window.
//   2. Retry any handoff notifications that failed to send.
//
// Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when
// CRON_SECRET is configured. If it is not set (local dev), the endpoint
// runs unauthenticated and logs a warning.

export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = getChatAgentConfig().cronSecret;
  if (!secret) {
    console.warn(
      "Cron purge-transcripts: CRON_SECRET is not set — running without auth.",
    );
    return true;
  }
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function run(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const purge = await purgeExpiredData();
    const retry = await retryPendingHandoffs();
    console.info(
      `Cron purge-transcripts: purged ${purge.transcriptsPurged} transcripts / ${purge.eventsPurged} events (retention ${purge.retentionDays}d); retried ${retry.attempted} handoffs, ${retry.sent} sent.`,
    );
    return Response.json({ ok: true, purge, retry });
  } catch (error) {
    console.error("Cron purge-transcripts: failed:", error);
    return Response.json({ error: "Maintenance run failed." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return run(request);
}

// Vercel Cron uses GET; POST is accepted too for manual triggering in tools.
export async function POST(request: Request) {
  return run(request);
}

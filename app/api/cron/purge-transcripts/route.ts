import { cronPurgeHandler } from "@/lib/chat-agent/http/handlers";
import { proxyToAgentApi } from "@/lib/chat-agent/http/proxy";
import { toResponse } from "@/lib/chat-agent/http/next-route";

// Daily maintenance (purge expired transcripts/events + retry failed handoff
// notifications). Invoked by Vercel Cron while the agent runs on Vercel; if
// the agent has moved to Hetzner, this proxies there — but the Hetzner
// deployment also has its own systemd timer (see deploy/digitalwerk/), so
// the Vercel cron becomes optional then.
//
// Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.

export const dynamic = "force-dynamic";

async function run(request: Request) {
  const authHeader = request.headers.get("authorization");
  const proxied = await proxyToAgentApi("/api/cron/purge-transcripts", {
    method: "POST",
    authHeader,
    body: {},
  });
  if (proxied) return toResponse(proxied);
  return toResponse(await cronPurgeHandler({ authHeader }));
}

export function GET(request: Request) {
  return run(request);
}
export function POST(request: Request) {
  return run(request);
}

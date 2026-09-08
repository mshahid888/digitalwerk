import { getChatAgentConfig } from "../index";
import type { HttpResult } from "./handlers";

// When AGENT_API_URL is configured, the Vercel-hosted Next.js /api/chat/*
// routes forward the request to the Hetzner Agent API (which sits in front
// of the private Postgres) instead of running the agent in-process. The
// browser only ever talks to our own same-origin endpoint — it never sees
// the Agent API URL or any credential.

export async function proxyToAgentApi(
  path: string,
  init: {
    method: "GET" | "POST";
    body?: unknown;
    authHeader?: string | null;
    search?: string;
  },
): Promise<HttpResult | null> {
  const config = getChatAgentConfig();
  if (!config.agentApiUrl) return null;

  const url = `${config.agentApiUrl}${path}${init.search ? `?${init.search}` : ""}`;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (config.agentApiSecret) headers["X-Agent-Auth"] = config.agentApiSecret;
  if (init.authHeader) headers["Authorization"] = init.authHeader;
  if (init.method === "POST") headers["Content-Type"] = "application/json";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 35000);
  try {
    const res = await fetch(url, {
      method: init.method,
      headers,
      body: init.method === "POST" ? JSON.stringify(init.body ?? {}) : undefined,
      signal: controller.signal,
    });
    const body = await res.json().catch(() => ({}));
    return { status: res.status, body };
  } catch (error) {
    console.error(`Agent API proxy to ${path} failed:`, error);
    return {
      status: 502,
      body: {
        error:
          "Der Assistent ist gerade nicht erreichbar. Bitte versuchen Sie es in Kürze erneut.",
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

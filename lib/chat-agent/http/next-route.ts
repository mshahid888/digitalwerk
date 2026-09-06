import type { HttpResult } from "./handlers";
import { proxyToAgentApi } from "./proxy";

// Glue for the Next.js App Router route handlers. Each app/api/chat/* route
// is a two-liner: try proxying to the Hetzner Agent API, otherwise run the
// shared handler locally.

export function toResponse(result: HttpResult): Response {
  return Response.json(result.body, { status: result.status });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    const text = await request.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return undefined;
  }
}

export async function proxyOrLocal(
  request: Request,
  path: string,
  local: (body: unknown) => Promise<HttpResult>,
): Promise<Response> {
  const method = request.method as "GET" | "POST";
  const body = method === "POST" ? await readJson(request) : undefined;
  const search = new URL(request.url).searchParams.toString();

  const proxied = await proxyToAgentApi(path, {
    method,
    body,
    authHeader: request.headers.get("authorization"),
    search,
  });
  if (proxied) return toResponse(proxied);

  return toResponse(await local(body));
}

import { startSession } from "@/lib/chat-agent";
import type { Language } from "@/lib/chat-agent";

// POST /api/chat/session — start a new chat session.
// Body (optional): { locale?: "de" | "en" }
// Returns: { sessionId, language, greeting }

export const dynamic = "force-dynamic";

function parseLocale(value: unknown): Language | undefined {
  return value === "de" || value === "en" ? value : undefined;
}

export async function POST(request: Request) {
  let body: unknown = {};
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    // An empty or invalid body is fine here — locale is optional.
    body = {};
  }

  const locale = parseLocale(
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).locale
      : undefined,
  );

  try {
    const result = await startSession(locale);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Chat session: failed to start session:", error);
    return Response.json(
      { error: "Die Sitzung konnte nicht gestartet werden." },
      { status: 500 },
    );
  }
}

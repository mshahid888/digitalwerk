import { getChatAgentConfig, handleMessage } from "@/lib/chat-agent";
import type { Language } from "@/lib/chat-agent";

// POST /api/chat/message — send a visitor message, get the agent's reply.
// Body: { sessionId: string, message: string, locale?: "de" | "en" }
// Returns: { reply, language, handoffRequested, messageCount, limitReached }

export const dynamic = "force-dynamic";

type Parsed =
  | { ok: true; sessionId: string; message: string; locale?: Language }
  | { ok: false; error: string };

function parse(body: unknown): Parsed {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Ungültige Anfrage." };
  }
  const { sessionId, message, locale } = body as Record<string, unknown>;
  const config = getChatAgentConfig();

  if (typeof sessionId !== "string" || sessionId.length < 8 || sessionId.length > 100) {
    return { ok: false, error: "Ungültige Sitzung." };
  }
  if (typeof message !== "string" || message.trim().length === 0) {
    return { ok: false, error: "Bitte geben Sie eine Nachricht ein." };
  }
  if (message.length > config.maxInputChars) {
    return {
      ok: false,
      error: `Ihre Nachricht ist zu lang (max. ${config.maxInputChars} Zeichen).`,
    };
  }
  return {
    ok: true,
    sessionId,
    message,
    locale: locale === "de" || locale === "en" ? locale : undefined,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = parse(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await handleMessage(
      parsed.sessionId,
      parsed.message,
      parsed.locale,
    );
    if ("error" in result) {
      return Response.json(
        { error: "Sitzung nicht gefunden. Bitte laden Sie die Seite neu." },
        { status: 404 },
      );
    }
    return Response.json(result);
  } catch (error) {
    console.error("Chat message: failed to handle message:", error);
    return Response.json(
      { error: "Die Nachricht konnte nicht verarbeitet werden." },
      { status: 500 },
    );
  }
}

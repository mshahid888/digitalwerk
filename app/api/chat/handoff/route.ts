import { requestHandoff } from "@/lib/chat-agent";
import type { HandoffReason } from "@/lib/chat-agent";

// POST /api/chat/handoff — visitor explicitly asks to be handed to a human.
// Body: { sessionId: string, reason?: HandoffReason, note?: string }
// Returns: { handoffId, status, message }

export const dynamic = "force-dynamic";

const REASONS: HandoffReason[] = [
  "visitor_requested",
  "custom_quote",
  "complex_project",
  "contractual_or_legal",
  "sensitive_complaint",
  "existing_client_issue",
  "uncertain_information",
  "high_intent",
];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const { sessionId, reason, note } = body as Record<string, unknown>;
  if (typeof sessionId !== "string" || sessionId.length < 8) {
    return Response.json({ error: "Ungültige Sitzung." }, { status: 400 });
  }

  const safeReason =
    typeof reason === "string" && REASONS.includes(reason as HandoffReason)
      ? (reason as HandoffReason)
      : undefined;
  const safeNote =
    typeof note === "string" && note.trim().length > 0
      ? note.trim().slice(0, 1000)
      : undefined;

  try {
    const result = await requestHandoff(sessionId, {
      reason: safeReason,
      note: safeNote,
    });
    if ("error" in result) {
      return Response.json({ error: "Sitzung nicht gefunden." }, { status: 404 });
    }
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Chat handoff: failed to record handoff:", error);
    return Response.json(
      { error: "Die Weiterleitung konnte nicht erstellt werden." },
      { status: 500 },
    );
  }
}

import { updateLeadFacts } from "@/lib/chat-agent";
import type { LeadFacts } from "@/lib/chat-agent";

// POST /api/chat/lead — attach or update contact/lead details on a session
// (e.g. from an explicit "leave your details" step in the widget).
// Body: { sessionId: string, facts: Partial<LeadFacts> }
// Returns: { leadId, status }

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_FIELDS: (keyof LeadFacts)[] = [
  "name",
  "company",
  "industry",
  "email",
  "phone",
  "problem",
  "currentProcess",
  "desiredOutcome",
  "relevantTools",
  "timeline",
  "budget",
  "notes",
];

type Parsed =
  | { ok: true; sessionId: string; facts: Partial<LeadFacts> }
  | { ok: false; error: string };

function parse(body: unknown): Parsed {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Ungültige Anfrage." };
  }
  const { sessionId, facts } = body as Record<string, unknown>;
  if (typeof sessionId !== "string" || sessionId.length < 8) {
    return { ok: false, error: "Ungültige Sitzung." };
  }
  if (typeof facts !== "object" || facts === null) {
    return { ok: false, error: "Keine Angaben übermittelt." };
  }

  const clean: Partial<LeadFacts> = {};
  for (const field of ALLOWED_FIELDS) {
    const value = (facts as Record<string, unknown>)[field];
    if (typeof value === "string" && value.trim().length > 0) {
      clean[field] = value.trim().slice(0, 1000);
    }
  }
  if (clean.email && !EMAIL_RE.test(clean.email)) {
    return { ok: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse an." };
  }
  if (Object.keys(clean).length === 0) {
    return { ok: false, error: "Keine gültigen Angaben übermittelt." };
  }
  return { ok: true, sessionId, facts: clean };
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
    const result = await updateLeadFacts({
      sessionId: parsed.sessionId,
      facts: parsed.facts,
    });
    if ("error" in result) {
      return Response.json({ error: "Sitzung nicht gefunden." }, { status: 404 });
    }
    return Response.json({ leadId: result.id, status: result.status });
  } catch (error) {
    console.error("Chat lead: failed to update lead:", error);
    return Response.json(
      { error: "Die Angaben konnten nicht gespeichert werden." },
      { status: 500 },
    );
  }
}

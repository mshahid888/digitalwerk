// Framework-agnostic HTTP handlers for the chat agent.
//
// One implementation, two transports: the Next.js route handlers
// (app/api/chat/*) and the standalone Agent API server (server/) both call
// these — there is no duplicated validation or business logic. Each handler
// takes plain input and returns { status, body }.

import {
  checkAdminAuth,
  chatAgentHealth,
  getChatAgentConfig,
  handleMessage,
  listHandoffs,
  listLeads,
  purgeExpiredData,
  requestHandoff,
  retryPendingHandoffs,
  startSession,
  updateLeadFacts,
} from "../index";
import type { HandoffReason, Language, LeadFacts } from "../agent/types";

export type HttpResult = { status: number; body: unknown };

function parseLocale(v: unknown): Language | undefined {
  return v === "de" || v === "en" ? v : undefined;
}
function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

// ---------------------------------------------------------------- session

export async function sessionHandler(body: unknown): Promise<HttpResult> {
  const locale = isObj(body) ? parseLocale(body.locale) : undefined;
  try {
    const result = await startSession(locale);
    return { status: 201, body: result };
  } catch (error) {
    console.error("chat/session: failed:", error);
    return { status: 500, body: { error: "Die Sitzung konnte nicht gestartet werden." } };
  }
}

// ---------------------------------------------------------------- message

export async function messageHandler(body: unknown): Promise<HttpResult> {
  if (!isObj(body)) return { status: 400, body: { error: "Ungültige Anfrage." } };
  const config = getChatAgentConfig();
  const { sessionId, message, locale } = body;

  if (typeof sessionId !== "string" || sessionId.length < 8 || sessionId.length > 100) {
    return { status: 400, body: { error: "Ungültige Sitzung." } };
  }
  if (typeof message !== "string" || message.trim().length === 0) {
    return { status: 400, body: { error: "Bitte geben Sie eine Nachricht ein." } };
  }
  if (message.length > config.maxInputChars) {
    return {
      status: 400,
      body: { error: `Ihre Nachricht ist zu lang (max. ${config.maxInputChars} Zeichen).` },
    };
  }

  try {
    const result = await handleMessage(sessionId, message, parseLocale(locale));
    if ("error" in result) {
      return {
        status: 404,
        body: { error: "Sitzung nicht gefunden. Bitte laden Sie die Seite neu." },
      };
    }
    return { status: 200, body: result };
  } catch (error) {
    console.error("chat/message: failed:", error);
    return { status: 500, body: { error: "Die Nachricht konnte nicht verarbeitet werden." } };
  }
}

// ------------------------------------------------------------------- lead

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEAD_FIELDS: (keyof LeadFacts)[] = [
  "name", "company", "industry", "email", "phone", "problem",
  "currentProcess", "desiredOutcome", "relevantTools", "timeline", "budget", "notes",
];

export async function leadHandler(body: unknown): Promise<HttpResult> {
  if (!isObj(body)) return { status: 400, body: { error: "Ungültige Anfrage." } };
  const { sessionId, facts } = body;
  if (typeof sessionId !== "string" || sessionId.length < 8) {
    return { status: 400, body: { error: "Ungültige Sitzung." } };
  }
  if (!isObj(facts)) return { status: 400, body: { error: "Keine Angaben übermittelt." } };

  const clean: Partial<LeadFacts> = {};
  for (const field of LEAD_FIELDS) {
    const value = facts[field];
    if (typeof value === "string" && value.trim().length > 0) {
      clean[field] = value.trim().slice(0, 1000);
    }
  }
  if (clean.email && !EMAIL_RE.test(clean.email)) {
    return { status: 400, body: { error: "Bitte geben Sie eine gültige E-Mail-Adresse an." } };
  }
  if (Object.keys(clean).length === 0) {
    return { status: 400, body: { error: "Keine gültigen Angaben übermittelt." } };
  }

  try {
    const result = await updateLeadFacts({ sessionId, facts: clean });
    if ("error" in result) {
      return { status: 404, body: { error: "Sitzung nicht gefunden." } };
    }
    return { status: 200, body: { leadId: result.id, status: result.status } };
  } catch (error) {
    console.error("chat/lead: failed:", error);
    return { status: 500, body: { error: "Die Angaben konnten nicht gespeichert werden." } };
  }
}

// ---------------------------------------------------------------- handoff

const HANDOFF_REASONS: HandoffReason[] = [
  "visitor_requested", "custom_quote", "complex_project", "contractual_or_legal",
  "sensitive_complaint", "existing_client_issue", "uncertain_information", "high_intent",
];

export async function handoffHandler(body: unknown): Promise<HttpResult> {
  if (!isObj(body)) return { status: 400, body: { error: "Ungültige Anfrage." } };
  const { sessionId, reason, note } = body;
  if (typeof sessionId !== "string" || sessionId.length < 8) {
    return { status: 400, body: { error: "Ungültige Sitzung." } };
  }
  const safeReason =
    typeof reason === "string" && HANDOFF_REASONS.includes(reason as HandoffReason)
      ? (reason as HandoffReason)
      : undefined;
  const safeNote =
    typeof note === "string" && note.trim().length > 0 ? note.trim().slice(0, 1000) : undefined;

  try {
    const result = await requestHandoff(sessionId, { reason: safeReason, note: safeNote });
    if ("error" in result) return { status: 404, body: { error: "Sitzung nicht gefunden." } };
    return { status: 201, body: result };
  } catch (error) {
    console.error("chat/handoff: failed:", error);
    return { status: 500, body: { error: "Die Weiterleitung konnte nicht erstellt werden." } };
  }
}

// ---------------------------------------------------------------- health

export async function healthHandler(): Promise<HttpResult> {
  try {
    const snapshot = await chatAgentHealth();
    const status = snapshot.status === "degraded" ? 503 : 200;
    return { status, body: { ok: snapshot.status !== "degraded", ...snapshot } };
  } catch (error) {
    console.error("chat/health: failed:", error);
    return { status: 500, body: { ok: false, status: "error" } };
  }
}

// ------------------------------------------------------------------ admin

const STATUSES = ["new", "contacted", "closed"] as const;

export async function adminLeadsHandler(req: {
  authHeader: string | null;
  limit?: string | null;
  status?: string | null;
}): Promise<HttpResult> {
  const auth = checkAdminAuth(fakeRequest(req.authHeader));
  if (!auth.ok) return { status: auth.status, body: { error: auth.error } };

  const parsed = Number.parseInt(req.limit ?? "", 10);
  const limit = Number.isFinite(parsed) ? Math.min(500, Math.max(1, parsed)) : 100;
  const status = STATUSES.includes(req.status as (typeof STATUSES)[number])
    ? (req.status as (typeof STATUSES)[number])
    : undefined;
  try {
    const leads = await listLeads({ limit, status });
    return { status: 200, body: { count: leads.length, leads } };
  } catch (error) {
    console.error("chat/admin/leads: failed:", error);
    return { status: 500, body: { error: "Failed to load leads." } };
  }
}

export async function adminHandoffsHandler(req: {
  authHeader: string | null;
  limit?: string | null;
}): Promise<HttpResult> {
  const auth = checkAdminAuth(fakeRequest(req.authHeader));
  if (!auth.ok) return { status: auth.status, body: { error: auth.error } };
  const parsed = Number.parseInt(req.limit ?? "", 10);
  const limit = Number.isFinite(parsed) ? Math.min(500, Math.max(1, parsed)) : 100;
  try {
    const handoffs = await listHandoffs({ limit });
    return {
      status: 200,
      body: {
        count: handoffs.length,
        pendingDispatch: handoffs.filter((h) => !h.dispatched).length,
        handoffs,
      },
    };
  } catch (error) {
    console.error("chat/admin/handoffs: failed:", error);
    return { status: 500, body: { error: "Failed to load handoffs." } };
  }
}

export async function adminHandoffsRetryHandler(req: {
  authHeader: string | null;
}): Promise<HttpResult> {
  const auth = checkAdminAuth(fakeRequest(req.authHeader));
  if (!auth.ok) return { status: auth.status, body: { error: auth.error } };
  try {
    return { status: 200, body: { ok: true, ...(await retryPendingHandoffs()) } };
  } catch (error) {
    console.error("chat/admin/handoffs retry: failed:", error);
    return { status: 500, body: { error: "Retry failed." } };
  }
}

export async function adminPurgeHandler(req: {
  authHeader: string | null;
}): Promise<HttpResult> {
  const auth = checkAdminAuth(fakeRequest(req.authHeader));
  if (!auth.ok) return { status: auth.status, body: { error: auth.error } };
  try {
    return { status: 200, body: { ok: true, ...(await purgeExpiredData()) } };
  } catch (error) {
    console.error("chat/admin/purge: failed:", error);
    return { status: 500, body: { error: "Purge failed." } };
  }
}

// -------------------------------------------------------------------- cron

export async function cronPurgeHandler(req: {
  authHeader: string | null;
}): Promise<HttpResult> {
  const secret = getChatAgentConfig().cronSecret;
  if (secret) {
    if (req.authHeader !== `Bearer ${secret}`) {
      return { status: 401, body: { error: "Unauthorized." } };
    }
  } else {
    console.warn("cron/purge: CRON_SECRET not set — running without auth.");
  }
  try {
    const purge = await purgeExpiredData();
    const retry = await retryPendingHandoffs();
    console.info(
      `cron/purge: ${purge.transcriptsPurged} transcripts / ${purge.eventsPurged} events purged (retention ${purge.retentionDays}d); ${retry.sent}/${retry.attempted} handoffs re-sent.`,
    );
    return { status: 200, body: { ok: true, purge, retry } };
  } catch (error) {
    console.error("cron/purge: failed:", error);
    return { status: 500, body: { error: "Maintenance run failed." } };
  }
}

// checkAdminAuth() takes a Request only for its `authorization` header;
// build a minimal one so both transports can reuse it unchanged.
function fakeRequest(authHeader: string | null): Request {
  return new Request("https://internal/", {
    headers: authHeader ? { authorization: authHeader } : {},
  });
}

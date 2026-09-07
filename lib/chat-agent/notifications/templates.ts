import type { HandoffPayload } from "../agent/types";
import type { StoredLead } from "../persistence/types";
import type { NotificationMessage } from "./types";

// Plain-text notification bodies built from the agent's own structured
// state.
//
// Privacy note: the stored conversation summary ends with a "Gesprächsauszug:"
// block — the last few messages verbatim — which is useful in the durable
// handoff/lead record (the team sees it in the admin API) but should NOT
// leave the retention boundary in an e-mail inbox. `withoutTranscript()`
// strips that block so the notification carries only the structured fields
// (problem, intent, contact, score, recommendation).

/** Drop the trailing verbatim-transcript block from a rendered summary. */
export function withoutTranscript(summary: string): string {
  return summary.replace(/\n*Gesprächsauszug:[\s\S]*$/u, "").trimEnd();
}

const REASON_LABEL: Record<string, string> = {
  visitor_requested: "Besucher möchte mit einem Menschen sprechen",
  custom_quote: "Individuelles Angebot angefragt",
  complex_project: "Komplexes Projekt / Integration",
  contractual_or_legal: "Vertragliche oder rechtliche Frage",
  sensitive_complaint: "Beschwerde / sensibles Anliegen",
  existing_client_issue: "Anliegen eines Bestandskunden",
  uncertain_information: "Frage konnte nicht sicher beantwortet werden",
  high_intent: "Hohe Kaufabsicht erkannt",
};

function factsBlock(facts: HandoffPayload["leadFacts"]): string {
  const line = (label: string, value?: string) =>
    value ? `${label}: ${value}` : null;
  return [
    line("Name", facts.name),
    line("Unternehmen", facts.company),
    line("Branche", facts.industry),
    line("E-Mail", facts.email),
    line("Telefon", facts.phone),
    line("Problem/Bedarf", facts.problem),
    line("Aktueller Prozess", facts.currentProcess),
    line("Gewünschtes Ergebnis", facts.desiredOutcome),
    line("Relevante Systeme", facts.relevantTools),
    line("Zeithorizont", facts.timeline),
    line("Budget", facts.budget),
    line("Notiz", facts.notes),
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

export function renderHandoffNotification(
  handoffId: string,
  payload: HandoffPayload,
): NotificationMessage {
  const reason = REASON_LABEL[payload.reason] ?? payload.reason;
  const contactName = payload.leadFacts.name ?? "Website-Besucher";
  const urgencyTag = payload.urgency === "high" ? "[DRINGEND] " : "";

  const text = [
    `${urgencyTag}Neue Übergabe aus dem Website-Chat`,
    ``,
    `Grund: ${reason}`,
    `Sprache: ${payload.language.toUpperCase()}`,
    `Erkanntes Anliegen: ${payload.intent}`,
    `Lead-Score (intern): ${payload.leadScore.total}/100 (${payload.leadScore.band})`,
    payload.recommendation
      ? `Empfohlene Leistung: ${payload.recommendation.recommendedServiceName}`
      : `Empfohlene Leistung: —`,
    ``,
    `— Angaben des Besuchers —`,
    factsBlock(payload.leadFacts) || "keine Angaben",
    ``,
    payload.openQuestions.length
      ? `Offene Punkte: ${payload.openQuestions.join("; ")}`
      : `Offene Punkte: —`,
    ``,
    `— Gesprächszusammenfassung —`,
    withoutTranscript(payload.conversationSummary),
    ``,
    `Der vollständige Chat-Verlauf liegt in der Übergabe-Akte (Admin-API).`,
    `Referenz: handoff ${handoffId}`,
  ].join("\n");

  return {
    kind: "handoff",
    subject: `${urgencyTag}Chat-Übergabe: ${contactName} (${reason})`,
    text,
    replyTo: payload.leadFacts.email,
    referenceId: handoffId,
  };
}

export function renderLeadNotification(lead: StoredLead): NotificationMessage {
  const contactName = lead.facts.name ?? "Website-Besucher";
  const text = [
    `Neuer qualifizierter Lead aus dem Website-Chat`,
    ``,
    `Lead-Score (intern): ${lead.score.total}/100 (${lead.score.band})`,
    `Erkanntes Anliegen: ${lead.intent}`,
    lead.recommendedServiceSlug
      ? `Empfohlene Leistung: ${lead.recommendedServiceSlug}`
      : `Empfohlene Leistung: —`,
    `Status: ${lead.status}`,
    ``,
    `— Angaben des Besuchers —`,
    factsBlock(lead.facts) || "keine Angaben",
    ``,
    lead.conversationSummary
      ? `— Gesprächszusammenfassung —\n${withoutTranscript(lead.conversationSummary)}`
      : ``,
    ``,
    `Referenz: lead ${lead.id}`,
  ].join("\n");

  return {
    kind: "lead",
    subject: `Neuer Lead: ${contactName} (Score ${lead.score.total}, ${lead.score.band})`,
    text,
    replyTo: lead.facts.email,
    referenceId: lead.id,
  };
}

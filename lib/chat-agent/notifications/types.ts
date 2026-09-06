import type { HandoffPayload } from "../agent/types";
import type { StoredLead } from "../persistence/types";

// Outbound notification abstraction. The agent/service layer depends only
// on NotificationChannel; concrete channels (Resend today, Slack/CRM later)
// implement it without any change to the handoff flow.

export type NotificationKind = "handoff" | "lead";

export type NotificationMessage = {
  kind: NotificationKind;
  subject: string;
  text: string;
  html?: string;
  /** Optional reply-to (the visitor's email, when known). */
  replyTo?: string;
  /** Stable id used for idempotency / logging (the handoff or lead id). */
  referenceId: string;
};

export type NotificationResult =
  | { ok: true; channel: string; at: string; id?: string }
  | { ok: false; channel: string; error: string; retryable: boolean };

export interface NotificationChannel {
  readonly id: string;
  /** True when the channel has everything it needs to actually send. */
  readonly ready: boolean;
  send(message: NotificationMessage): Promise<NotificationResult>;
}

export type HandoffNotificationInput = {
  handoffId: string;
  payload: HandoffPayload;
};

export type LeadNotificationInput = {
  lead: StoredLead;
};

import type {
  NotificationChannel,
  NotificationMessage,
  NotificationResult,
} from "./types";

// Used when no notification channel is configured, or when the configured
// channel is missing its credentials. It never sends and never throws —
// the handoff / lead record is still stored durably and shows up in the
// admin listing and the pending-dispatch queue for later delivery.

export class NoopNotificationChannel implements NotificationChannel {
  readonly id: string;
  readonly ready = false;

  constructor(private readonly whyDisabled: string, id = "noop") {
    this.id = id;
  }

  async send(message: NotificationMessage): Promise<NotificationResult> {
    console.info(
      `Chat agent: notification channel disabled (${this.whyDisabled}); ` +
        `"${message.subject}" recorded but not sent (ref ${message.referenceId}).`,
    );
    return {
      ok: false,
      channel: this.id,
      error: `channel not configured: ${this.whyDisabled}`,
      retryable: true,
    };
  }
}

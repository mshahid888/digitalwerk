import type {
  NotificationChannel,
  NotificationMessage,
  NotificationResult,
} from "./types";

// Resend email channel. Same fetch-based pattern as app/api/kontakt/route.ts
// (no SDK). The API key is read from the environment server-side only and
// is never logged or returned.
//
// Stays SAFELY DISABLED until RESEND_API_KEY is set: `ready` is false and
// send() returns a non-throwing retryable failure, exactly like the no-op
// channel, so nothing breaks and the record is queued for later delivery.

const RESEND_API_URL = "https://api.resend.com/emails";

export type ResendChannelOptions = {
  apiKey: string | undefined;
  to: string;
  from: string;
};

export class ResendNotificationChannel implements NotificationChannel {
  readonly id = "resend";
  readonly ready: boolean;
  private readonly apiKey: string | undefined;
  private readonly to: string;
  private readonly from: string;

  constructor(opts: ResendChannelOptions) {
    this.apiKey = opts.apiKey?.trim() || undefined;
    this.to = opts.to;
    this.from = opts.from;
    this.ready = Boolean(this.apiKey);
  }

  async send(message: NotificationMessage): Promise<NotificationResult> {
    if (!this.apiKey) {
      return {
        ok: false,
        channel: this.id,
        error: "RESEND_API_KEY is not set",
        retryable: true,
      };
    }

    let response: Response;
    try {
      response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.from,
          to: this.to,
          reply_to: message.replyTo,
          subject: message.subject,
          text: message.text,
          html: message.html,
          headers: {
            // Lets the mail server collapse accidental duplicates of the
            // same handoff/lead notification.
            "X-Entity-Ref-ID": `${message.kind}:${message.referenceId}`,
          },
        }),
      });
    } catch (error) {
      return {
        ok: false,
        channel: this.id,
        error: `network error: ${(error as Error).message}`,
        retryable: true,
      };
    }

    if (response.ok) {
      const body = (await response.json().catch(() => ({}))) as { id?: string };
      return {
        ok: true,
        channel: this.id,
        at: new Date().toISOString(),
        id: body.id,
      };
    }

    const detail = (await response.text().catch(() => "")).slice(0, 300);
    // 4xx (except 429) means the request itself is wrong — not worth retrying.
    const retryable = response.status === 429 || response.status >= 500;
    return {
      ok: false,
      channel: this.id,
      error: `Resend API ${response.status}: ${detail}`,
      retryable,
    };
  }
}

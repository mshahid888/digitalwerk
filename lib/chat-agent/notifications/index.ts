import { getChatAgentConfig } from "../config";
import { NoopNotificationChannel } from "./noop-channel";
import { ResendNotificationChannel } from "./resend-channel";
import type { NotificationChannel } from "./types";

export type {
  NotificationChannel,
  NotificationMessage,
  NotificationResult,
  NotificationKind,
} from "./types";
export { NoopNotificationChannel } from "./noop-channel";
export { ResendNotificationChannel } from "./resend-channel";
export {
  renderHandoffNotification,
  renderLeadNotification,
} from "./templates";

// Channel selection:
//   CHAT_AGENT_HANDOFF_CHANNEL unset            -> no-op (record only)
//   = "resend" and RESEND_API_KEY present       -> Resend, live
//   = "resend" and RESEND_API_KEY absent        -> no-op (record + queue)
//   = anything else                             -> no-op (unknown channel)
//
// Adapter-based on purpose: adding "slack" / a CRM later is a new file plus
// one branch here — no change to the handoff flow.

let cached: { key: string; channel: NotificationChannel } | null = null;

export function getNotificationChannel(): NotificationChannel {
  const config = getChatAgentConfig();
  const key = `${config.handoffChannel ?? "-"}:${config.resendKeyPresent}:${config.notificationRecipient}:${config.notificationFrom}`;
  if (cached && cached.key === key) return cached.channel;

  let channel: NotificationChannel;
  if (!config.handoffChannel) {
    channel = new NoopNotificationChannel("no CHAT_AGENT_HANDOFF_CHANNEL set");
  } else if (config.handoffChannel === "resend") {
    channel = config.resendKeyPresent
      ? new ResendNotificationChannel({
          apiKey: process.env.RESEND_API_KEY,
          to: config.notificationRecipient,
          from: config.notificationFrom,
        })
      : new NoopNotificationChannel(
          "channel is 'resend' but RESEND_API_KEY is not set",
        );
  } else {
    channel = new NoopNotificationChannel(
      `unknown channel '${config.handoffChannel}'`,
    );
  }

  cached = { key, channel };
  return channel;
}

/** Test helper. */
export function resetNotificationChannelCache(): void {
  cached = null;
}

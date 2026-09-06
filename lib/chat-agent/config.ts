// Central configuration for the chat agent. Everything here is read from
// environment variables with safe, cost-free defaults so the whole system
// runs locally and in tests without any external account.
//
// No secret is ever hard-coded. When a real provider key is absent the
// agent falls back to the deterministic mock provider (see lib/chat-agent/llm).

export type LlmProviderId = "mock" | "anthropic";

export type ChatAgentConfig = {
  /** Which LLM provider to use. Defaults to "mock" unless a key makes "anthropic" viable. */
  provider: LlmProviderId;
  /** Model identifier passed to the provider. */
  model: string;
  /** Sampling temperature for response generation. */
  temperature: number;
  /** Upper bound on generated tokens per turn. */
  maxOutputTokens: number;
  /** Max characters accepted in a single visitor message (guardrail). */
  maxInputChars: number;
  /** Max messages a single session may send before it must hand off / reset (abuse guard). */
  maxMessagesPerSession: number;
  /** Max conversation turns kept in the model context window. */
  maxHistoryTurns: number;
  /** Whether an Anthropic key is present in the environment. */
  anthropicKeyPresent: boolean;

  // --- Persistence ---
  /** Postgres connection string, if configured. Absent -> in-memory store. */
  databaseUrl: string | undefined;
  /** Whether a database connection string is present. */
  databaseConfigured: boolean;

  // --- Retention (privacy) — the single source of truth for retention. ---
  /**
   * Days to keep raw conversation transcripts before automatic deletion.
   * Hard-capped at 30 (privacy decision). The permanent lead record is
   * unaffected and remains useful after the transcript is purged.
   */
  transcriptRetentionDays: number;
  /** Days to keep raw analytics events. Also capped at 30. */
  eventRetentionDays: number;

  // --- Notifications / handoff ---
  /** Configured handoff notification channel id, e.g. "resend". Unset -> no-op. */
  handoffChannel: string | undefined;
  /** Whether a Resend API key is present in the environment. */
  resendKeyPresent: boolean;
  /** Recipient for lead / handoff notification emails. */
  notificationRecipient: string;
  /** From address for notification emails (must be verified with Resend). */
  notificationFrom: string;
  /** Max delivery attempts before a notification is left for manual follow-up. */
  notificationMaxAttempts: number;

  // --- Admin API ---
  /** Bearer token that guards the /api/chat/admin/* endpoints. Unset -> endpoints disabled. */
  adminToken: string | undefined;
  /** Secret Vercel Cron sends in the Authorization header. Unset -> cron auth is skipped (dev). */
  cronSecret: string | undefined;
};

const RETENTION_MAX_DAYS = 30;

function readInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readFloat(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

/** Retention days: at least 1, never more than the privacy cap of 30. */
function readRetentionDays(name: string, fallback: number): number {
  const value = readInt(name, fallback);
  return Math.min(RETENTION_MAX_DAYS, Math.max(1, value));
}

function firstEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function getChatAgentConfig(): ChatAgentConfig {
  const anthropicKeyPresent = Boolean(process.env.ANTHROPIC_API_KEY?.trim());

  // Explicit override wins; otherwise use Anthropic only if a key exists.
  const requested = process.env.CHAT_AGENT_PROVIDER?.trim().toLowerCase();
  let provider: LlmProviderId = "mock";
  if (requested === "anthropic" || requested === "mock") {
    provider = requested;
  } else if (anthropicKeyPresent) {
    provider = "anthropic";
  }

  // Accept the common Vercel/Neon connection-string names as well as our own.
  const databaseUrl = firstEnv(
    "CHAT_AGENT_DATABASE_URL",
    "DATABASE_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
  );

  const resendKeyPresent = Boolean(process.env.RESEND_API_KEY?.trim());
  const handoffChannel = process.env.CHAT_AGENT_HANDOFF_CHANNEL?.trim().toLowerCase() || undefined;

  return {
    provider,
    model:
      process.env.CHAT_AGENT_MODEL?.trim() ||
      (provider === "anthropic" ? "claude-sonnet-5" : "mock-1"),
    temperature: readFloat("CHAT_AGENT_TEMPERATURE", 0.4),
    maxOutputTokens: readInt("CHAT_AGENT_MAX_OUTPUT_TOKENS", 700),
    maxInputChars: readInt("CHAT_AGENT_MAX_INPUT_CHARS", 4000),
    maxMessagesPerSession: readInt("CHAT_AGENT_MAX_MESSAGES_PER_SESSION", 40),
    maxHistoryTurns: readInt("CHAT_AGENT_MAX_HISTORY_TURNS", 16),
    anthropicKeyPresent,

    databaseUrl,
    databaseConfigured: Boolean(databaseUrl),

    transcriptRetentionDays: readRetentionDays(
      "CHAT_AGENT_TRANSCRIPT_RETENTION_DAYS",
      RETENTION_MAX_DAYS,
    ),
    eventRetentionDays: readRetentionDays(
      "CHAT_AGENT_EVENT_RETENTION_DAYS",
      RETENTION_MAX_DAYS,
    ),

    handoffChannel,
    resendKeyPresent,
    notificationRecipient: firstEnv("CHAT_AGENT_NOTIFY_TO", "CONTACT_TO_EMAIL") ?? "info@digitalwerkk.de",
    notificationFrom: firstEnv("CHAT_AGENT_NOTIFY_FROM", "CONTACT_FROM_EMAIL") ?? "onboarding@resend.dev",
    notificationMaxAttempts: readInt("CHAT_AGENT_NOTIFY_MAX_ATTEMPTS", 5),

    adminToken: process.env.CHAT_AGENT_ADMIN_TOKEN?.trim() || undefined,
    cronSecret: process.env.CRON_SECRET?.trim() || undefined,
  };
}

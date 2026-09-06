// Central configuration for the chat agent. Everything here is read from
// environment variables with safe, cost-free defaults so the whole system
// runs locally and in tests without any external account.
//
// No secret is ever hard-coded. When a real provider key is absent the
// agent falls back to the deterministic mock provider (see lib/chat-agent/llm).

/**
 * LLM provider *kinds* the agent knows how to talk to. This is NOT a list of
 * vendors — "openai-compatible" is the generic HTTP shape that OmniRoute
 * (the intended production gateway), OpenAI, Groq, Together, LiteLLM, vLLM
 * and most others speak. The agent's business logic never sees this.
 */
export type LlmProviderKind = "mock" | "openai-compatible" | "anthropic";

export type LlmConfig = {
  /** How to talk to the provider. */
  kind: LlmProviderKind;
  /**
   * Free-text label for logging/health (e.g. "omniroute", "openai", "groq").
   * Comes straight from LLM_PROVIDER; has no effect on behaviour.
   */
  label: string;
  /** Model id passed through verbatim (e.g. "cc/claude-opus-4-6" for OmniRoute). */
  model: string;
  /** Base URL for the openai-compatible endpoint (…/v1). Undefined for mock/anthropic-default. */
  baseUrl: string | undefined;
  /** Whether an API key is configured (never the value). */
  apiKeyPresent: boolean;
  /** Per-request timeout, ms. */
  timeoutMs: number;
  /** Retry attempts on timeout / 5xx / network error. */
  maxRetries: number;
};

export type ChatAgentConfig = {
  /** Resolved LLM provider configuration. */
  llm: LlmConfig;
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

  // --- Agent API split (frontend on Vercel, agent backend on Hetzner) ---
  /**
   * When set, the Next.js /api/chat/* routes forward to this base URL (the
   * Hetzner Agent API in front of the private Postgres) instead of handling
   * the request in-process. Unset -> the Next routes run the agent locally
   * (dev, and the deployment model before the split).
   */
  agentApiUrl: string | undefined;
  /** Shared secret sent as `X-Agent-Auth` on proxied requests; the Agent API rejects requests without it. */
  agentApiSecret: string | undefined;
  /** CORS allow-list for the standalone Agent API (comma-separated origins). */
  agentApiAllowedOrigins: string[];
  /** Requests per IP per window for the Agent API's lightweight rate limiter. */
  rateLimitPerMinute: number;
};

const RETENTION_MAX_DAYS = 30;

function readInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Like readInt but 0 is a valid value (e.g. "no retries"). */
function readIntMin0(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
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

/** Resolve the LLM provider config from env, provider-agnostically. */
function resolveLlm(): LlmConfig {
  const genericKey = firstEnv("LLM_API_KEY");
  const genericBase = firstEnv("LLM_BASE_URL", "OPENAI_BASE_URL");
  const anthropicKey = firstEnv("ANTHROPIC_API_KEY");

  // LLM_PROVIDER is the single knob. Anything that isn't "mock" or
  // "anthropic" is treated as an openai-compatible gateway label.
  const requested = firstEnv("LLM_PROVIDER", "CHAT_AGENT_PROVIDER")?.toLowerCase();

  let kind: LlmProviderKind;
  let label: string;
  if (requested === "mock") {
    kind = "mock";
    label = "mock";
  } else if (requested === "anthropic") {
    kind = "anthropic";
    label = "anthropic";
  } else if (requested) {
    kind = "openai-compatible";
    label = requested; // "omniroute", "openai", "groq", …
  } else if (genericBase && genericKey) {
    kind = "openai-compatible";
    label = "openai-compatible";
  } else if (anthropicKey) {
    // Legacy: a bare ANTHROPIC_API_KEY still activates the optional direct adapter.
    kind = "anthropic";
    label = "anthropic";
  } else {
    kind = "mock";
    label = "mock";
  }

  const defaultBase =
    label === "openai" ? "https://api.openai.com/v1" : undefined;
  const baseUrl =
    kind === "openai-compatible"
      ? (genericBase ?? defaultBase)?.replace(/\/+$/, "")
      : undefined;

  const model =
    firstEnv("LLM_MODEL", "CHAT_AGENT_MODEL") ??
    (kind === "anthropic" ? "claude-sonnet-5" : kind === "mock" ? "mock-1" : "");

  const apiKeyPresent =
    kind === "anthropic" ? Boolean(anthropicKey) : Boolean(genericKey);

  return {
    kind,
    label,
    model,
    baseUrl,
    apiKeyPresent,
    timeoutMs: readInt("LLM_TIMEOUT_MS", 30000),
    maxRetries: Math.min(3, readIntMin0("LLM_MAX_RETRIES", 1)),
  };
}

export function getChatAgentConfig(): ChatAgentConfig {
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
    llm: resolveLlm(),
    temperature: readFloat("LLM_TEMPERATURE", readFloat("CHAT_AGENT_TEMPERATURE", 0.4)),
    maxOutputTokens: readInt("LLM_MAX_OUTPUT_TOKENS", readInt("CHAT_AGENT_MAX_OUTPUT_TOKENS", 700)),
    maxInputChars: readInt("CHAT_AGENT_MAX_INPUT_CHARS", 4000),
    maxMessagesPerSession: readInt("CHAT_AGENT_MAX_MESSAGES_PER_SESSION", 40),
    maxHistoryTurns: readInt("CHAT_AGENT_MAX_HISTORY_TURNS", 16),

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

    agentApiUrl: firstEnv("AGENT_API_URL")?.replace(/\/+$/, ""),
    agentApiSecret: firstEnv("AGENT_API_SECRET"),
    agentApiAllowedOrigins: (
      firstEnv("AGENT_API_ALLOWED_ORIGINS") ??
      "https://www.digitalwerkk.de,https://digitalwerkk.de"
    )
      .split(",")
      .map((s) => s.trim().replace(/\/+$/, ""))
      .filter(Boolean),
    rateLimitPerMinute: readInt("CHAT_AGENT_RATE_LIMIT_PER_MINUTE", 20),
  };
}

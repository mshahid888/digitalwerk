import { getChatAgentConfig } from "../config";
import type { GuardrailFinding, Language } from "./types";

// Input and output guardrails per 09_DATA_PRIVACY_SECURITY_AND_GUARDRAILS.md.
// Visitor text and retrieved content are both treated as untrusted.

const INJECTION_PATTERNS: RegExp[] = [
  /ignore (all )?(previous|prior|above) (instructions|prompts|rules)/i,
  /disregard (the )?(system|previous) (prompt|instructions|message)/i,
  /forget (everything|all previous|your instructions)/i,
  /you are now (a|an|dan|developer mode)/i,
  /pretend (to be|you are)/i,
  /(act|behave) as (if you are|an unrestricted)/i,
  /jailbreak/i,
  /vergiss (alle |deine )?(bisherigen |vorherigen )?(anweisungen|regeln|instruktionen)/i,
  /ignoriere (alle |die )?(vorherigen |bisherigen )?(anweisungen|regeln)/i,
  /neue anweisung(en)?:/i,
  /new instructions?:/i,
  /system prompt override/i,
];

const SYSTEM_PROMPT_PROBES: RegExp[] = [
  /(show|print|reveal|repeat|display|output|tell me) (me )?(your |the )?(system )?(prompt|instructions|rules|guidelines)/i,
  /what (is|are) your (system )?(prompt|instructions|initial instructions)/i,
  /what were you told (to do|before this)/i,
  /(zeig|nenne|gib) mir (deinen |den )?(system[- ]?)?(prompt|anweisungen|regeln)/i,
  /wie lautet dein system[- ]?prompt/i,
  /repeat the text above/i,
  /everything above this line/i,
];

const SECRET_PROBES: RegExp[] = [
  /\bapi[_ -]?key\b/i,
  /\b(secret|token|credential|password|passwort)\b/i,
  /environment variable/i,
  /\bprocess\.env\b/i,
  /\banthropic[_ -]?api[_ -]?key\b/i,
  /\bsk-ant-/i,
];

// Patterns that must NEVER appear in an outbound reply. The model is never
// given a secret (the system prompt and knowledge base carry none), so this
// is defence in depth against a future prompt-injection or a mistaken
// knowledge entry — a match replaces the whole reply.
const OUTPUT_LEAK_PATTERNS: RegExp[] = [
  // provider / API key shapes
  /sk-ant-[a-z0-9-]+/i,
  /\bsk-[a-z0-9]{16,}\b/i, // OpenAI-style
  /\bre_[A-Za-z0-9]{16,}\b/, // Resend
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/,
  /\bBearer\s+[A-Za-z0-9._\-]{20,}/,
  // any of our own secret env-var names, or a generic process.env read
  /process\.env\.[A-Z_]+/,
  /\b(ANTHROPIC_API_KEY|RESEND_API_KEY|LLM_API_KEY|AGENT_API_SECRET|CHAT_AGENT_ADMIN_TOKEN|CRON_SECRET|POSTGRES_PASSWORD|CHAT_AGENT_DATABASE_URL|DATABASE_URL)\b/,
  // a Postgres connection string (would carry the password)
  /\bpostgres(?:ql)?:\/\/[^\s]+/i,
  /You are the DigitalWerk website AI assistant/i, // our own system-prompt opener
];

export type InputGuardResult = {
  findings: GuardrailFinding[];
  /** True when we should NOT call the LLM and should return a safe canned reply. */
  block: boolean;
  /** Safe reply to use when blocked. */
  safeReply?: string;
};

function safeRefusal(language: Language): string {
  return language === "de"
    ? "Ich kann dabei nicht helfen. Ich beantworte gerne Fragen zu DigitalWerk, den Leistungen und dazu, wie wir Ihnen weiterhelfen können."
    : "I can't help with that. I'm happy to answer questions about DigitalWerk, our services and how we can help you.";
}

export function checkInput(
  message: string,
  language: Language,
  recentUserMessages: string[] = [],
): InputGuardResult {
  const config = getChatAgentConfig();
  const findings: GuardrailFinding[] = [];
  const trimmed = message.trim();

  if (trimmed.length === 0) {
    findings.push({ kind: "empty_input", severity: "low", detail: "Empty message." });
    return {
      findings,
      block: true,
      safeReply:
        language === "de"
          ? "Wie kann ich Ihnen helfen?"
          : "How can I help you?",
    };
  }

  if (message.length > config.maxInputChars) {
    findings.push({
      kind: "oversized_input",
      severity: "medium",
      detail: `Message is ${message.length} chars (limit ${config.maxInputChars}).`,
    });
    return {
      findings,
      block: true,
      safeReply:
        language === "de"
          ? "Ihre Nachricht ist sehr lang. Können Sie sie in ein bis zwei Sätzen zusammenfassen?"
          : "Your message is very long. Could you sum it up in one or two sentences?",
    };
  }

  const identicalRepeats = recentUserMessages.filter(
    (m) => m.trim().toLowerCase() === trimmed.toLowerCase(),
  ).length;
  if (identicalRepeats >= 3) {
    findings.push({
      kind: "repetition_flood",
      severity: "medium",
      detail: `Identical message repeated ${identicalRepeats + 1} times.`,
    });
  }

  const injection = INJECTION_PATTERNS.some((re) => re.test(message));
  const systemProbe = SYSTEM_PROMPT_PROBES.some((re) => re.test(message));
  const secretProbe = SECRET_PROBES.some((re) => re.test(message));

  if (injection) {
    findings.push({
      kind: "prompt_injection",
      severity: "high",
      detail: "Message contains an instruction-override pattern.",
    });
  }
  if (systemProbe) {
    findings.push({
      kind: "system_prompt_probe",
      severity: "high",
      detail: "Message attempts to extract the system prompt.",
    });
  }
  if (secretProbe && (injection || systemProbe || /reveal|show|give me|tell me|nenne|zeig/i.test(message))) {
    findings.push({
      kind: "secret_probe",
      severity: "high",
      detail: "Message attempts to extract secrets/credentials.",
    });
  }

  const block = injection || systemProbe || findings.some((f) => f.kind === "secret_probe");
  return {
    findings,
    block,
    safeReply: block ? safeRefusal(language) : undefined,
  };
}

export type OutputGuardResult = {
  text: string;
  findings: GuardrailFinding[];
};

// Last line of defence on the model's output. If a leak pattern matches we
// replace the whole reply rather than trying to redact in place.
export function checkOutput(text: string, language: Language): OutputGuardResult {
  const findings: GuardrailFinding[] = [];
  for (const re of OUTPUT_LEAK_PATTERNS) {
    if (re.test(text)) {
      findings.push({
        kind: "output_leak",
        severity: "high",
        detail: `Reply matched a leak pattern: ${re}`,
      });
    }
  }

  if (findings.length > 0) {
    return {
      text:
        language === "de"
          ? "Entschuldigung, dabei ist etwas schiefgelaufen. Können Sie Ihre Frage anders formulieren?"
          : "Sorry, something went wrong there. Could you rephrase your question?",
      findings,
    };
  }

  return { text, findings };
}

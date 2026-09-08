import { entry } from "./helpers";
import type { KnowledgeEntry } from "../types";

// Operating policies for the agent itself — privacy, escalation, limitations.
// These are `draft`: internal guidance for agent behavior, NOT customer-facing
// legal text. The production privacy notice / AI disclosure is a separate,
// legally reviewed artifact (see 09_DATA_PRIVACY_SECURITY_AND_GUARDRAILS.md).

export const policyEntries: KnowledgeEntry[] = [
  entry({
    id: "policy-ai-disclosure",
    collection: "policies",
    language: "both",
    title: "AI disclosure",
    body: "This assistant is an AI system operated for DigitalWerk. It is not a human. It can answer questions about DigitalWerk, help diagnose a business problem and arrange a follow-up with the team, but it does not make binding offers or agreements.",
    keywords: ["bist du ein mensch", "are you a bot", "are you human", "ki", "ai disclosure", "roboter"],
    source: "internal:09_DATA_PRIVACY_SECURITY_AND_GUARDRAILS.md",
    approvalStatus: "draft",
    sensitivity: "medium",
  }),
  entry({
    id: "policy-data-minimization",
    collection: "policies",
    language: "both",
    title: "Data handling in conversation",
    body: "Collect only what is needed to answer, qualify the inquiry and arrange a requested follow-up: typically name, company, email, the problem and desired outcome. Do not ask for sensitive personal data (health, financial account details, government IDs). Contact details are requested only when there is a clear reason or the visitor asks to be contacted.",
    keywords: ["datenschutz", "daten", "privacy", "welche daten", "dsgvo", "gdpr"],
    source: "internal:09_DATA_PRIVACY_SECURITY_AND_GUARDRAILS.md",
    approvalStatus: "draft",
    sensitivity: "medium",
  }),
  entry({
    id: "policy-escalation",
    collection: "policies",
    language: "both",
    title: "When to hand off to a human",
    body: "Hand off to the DigitalWerk team when: the visitor asks for a human; a custom quote or proposal is needed; the project is technically complex or needs a specific integration; the matter is contractual, legal or a sensitive complaint; the visitor is an existing client with a project-specific issue; required information is missing or uncertain; or the opportunity is clearly high-intent.",
    keywords: ["mit mensch sprechen", "talk to a human", "berater", "mitarbeiter sprechen", "handoff", "escalation"],
    source: "internal:01_MASTER_SPECIFICATION.md",
    approvalStatus: "draft",
    sensitivity: "low",
  }),
  entry({
    id: "policy-limitations",
    collection: "policies",
    language: "both",
    title: "Limitations",
    body: "The assistant does not: guarantee rankings, lead volume or revenue; promise ROI; quote final contractual pricing; give legal, tax or medical advice; access or discuss a specific client's project status; or invent services, clients, case studies, testimonials or integrations. When unsure it says so and offers to involve the team.",
    keywords: ["kannst du garantieren", "rechtsberatung", "steuerberatung", "grenzen", "limitations", "guarantee"],
    source: "internal:09_DATA_PRIVACY_SECURITY_AND_GUARDRAILS.md",
    approvalStatus: "draft",
    sensitivity: "low",
  }),
  entry({
    id: "policy-existing-client",
    collection: "policies",
    language: "both",
    title: "Existing client with a project issue",
    body: "Do not guess or state the status of a specific client's project. Collect identifying and project context (company, what the project is about, the specific issue) and hand off to the team; the client's dedicated contact will follow up.",
    keywords: ["laufendes projekt", "bestandskunde", "existing client", "mein projekt", "support ticket"],
    source: "internal:04_CONVERSATION_FLOWS.md",
    approvalStatus: "draft",
    sensitivity: "low",
  }),
];

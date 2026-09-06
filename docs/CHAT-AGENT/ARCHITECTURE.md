# DigitalWerk Chat Agent — Architecture

Status: **Phase 1 foundation** (provider-independent, mock LLM). No paid
resource is required to run, develop or test any of this.

## Where it lives

The chat agent is part of the existing Next.js 16 app — no separate service,
no second deployment. It follows the repo's conventions (`Request`/`Response`
route handlers like `app/api/kontakt`, `lib/*` modules, `@/` path alias).

```
lib/chat-agent/
  config.ts            env-driven config; safe cost-free defaults
  index.ts             public surface + chatAgentHealth()
  service.ts           application service used by the API routes

  llm/                  provider-independent LLM interface
    types.ts             LlmProvider, LlmMessage, LlmResponse, ...
    mock-provider.ts     deterministic, offline, no cost
    anthropic-provider.ts  fetch adapter for the Messages API (no SDK)
    index.ts             getLlmProvider() factory (falls back to mock)

  knowledge/           approved knowledge base + retrieval
    types.ts             KnowledgeEntry + source/verification metadata
    sources/             company, services, ai-solutions, pricing, faq, policies
    retrieval.ts         LexicalRetriever (dependency-free, deterministic)
    index.ts             retrieveForPrompt()

  agent/               orchestration + business logic
    types.ts             all shared types
    language.ts          DE/EN detection + locale-hint resolution
    intent.ts            16-category rule-based intent detection
    guardrails.ts        input + output guardrails
    recommendation.ts    service recommendation matrix (spec 06)
    qualification.ts     progressive fact capture + 0–100 lead scoring (spec 05)
    handoff.ts           handoff decision + structured payload
    summary.ts           deterministic conversation summary
    system-prompt.ts     persona + rules (no facts, no secrets)
    compose-reply.ts     deterministic reply composer (mock + fallback)
    orchestrator.ts      runAgentTurn() — one visitor turn, end to end

  persistence/         store interfaces + in-memory implementation
    types.ts             ConversationStore, LeadStore, HandoffStore, EventStore
    memory-store.ts      in-memory (dev / preview only)
    index.ts             getChatAgentStore()

app/api/chat/
  session/route.ts      POST  start a session
  message/route.ts      POST  send a message, get the reply
  lead/route.ts         POST  attach/update lead facts
  handoff/route.ts      POST  explicit "talk to a human"
  health/route.ts       GET   non-secret status snapshot

components/chat/
  chat-widget.tsx       launcher + panel, mounted once in site-shell.tsx
  use-chat.ts           client hook (session, messages, send, handoff)
  strings.ts            DE/EN widget chrome copy
```

## One turn, end to end (`runAgentTurn`)

Deterministic logic runs first; the LLM only phrases the final reply.

1. **Language** — `resolveLanguage()` combines the widget's locale hint with
   detection on the visitor's words; a strong signal in the message wins.
2. **Input guardrails** — `checkInput()`. Prompt-injection, system-prompt
   probes and secret probes → the turn is blocked and a safe refusal is
   returned *without calling the model*. Oversized/empty input is rejected.
3. **Intent** — `detectIntent()`, rule-based, 16 categories + `OTHER`.
4. **Retrieval** — `retrieveForPrompt()` returns approved/provisional
   knowledge in the conversation language, formatted with source lines.
5. **Recommendation** — `recommendService()` maps *problem signals* (never a
   bare keyword) to a service, as a hypothesis + follow-up question.
6. **Qualification** — `extractFacts()` pulls any volunteered facts;
   `scoreLead()` computes the internal 0–100 score; `decideNextField()`
   picks the next useful question (problem understanding before contact
   details; never repeats a question).
7. **Handoff** — `decideHandoff()` checks explicit requests, complaints,
   legal/contract topics, existing-client issues, custom quotes, complex
   projects, high intent, and unanswerable questions.
8. **Compose** — `composeReply()` builds a spec-aligned reply purely from
   the computed state (problem → diagnosis → recommendation → next step).
9. **LLM phrasing** — the system prompt (persona + rules + retrieved
   knowledge) plus a per-turn directive block and the deterministic reply
   as `fallbackText` go to `getLlmProvider().generate()`. The mock returns
   the fallback verbatim; a real provider rephrases within the same facts.
   If the provider errors, the fallback text is used — the agent never
   hard-fails a turn.
10. **Output guardrails** — `checkOutput()` replaces any reply that leaks a
    key, an env var name or the system prompt.
11. **Persist** — the turn is appended to the session; `service.ts` records
    an analytics event, upserts a lead once the score leaves the
    `informational` band, and creates a durable handoff record on
    escalation.

## Design decisions

- **No SDK for Anthropic.** The adapter uses `fetch`, matching the Resend
  pattern already in `app/api/kontakt/route.ts`. Zero new runtime deps.
- **Deterministic core.** Intent, language, scoring, recommendation and
  guardrails are pure rule-based functions — testable without an LLM and
  stable for regression evals.
- **Retrieval is lexical, not vector.** The knowledge base is dozens of
  entries; a token-overlap scorer with a light stemmer is reliable, fast
  and dependency-free. `KnowledgeRetriever` is an interface — a vector
  retriever can replace `LexicalRetriever` later without touching the agent.
- **The lead score is internal.** It is never in a reply and never sent to
  the visitor; `checkOutput` and a regression test both enforce this.
- **Pricing is data, not prompt.** Prices live in
  `knowledge/sources/pricing.ts` with `effectiveDate` / `approvalStatus` and
  are retrieved per turn. The system prompt contains no prices.

## What is deliberately deferred (decisions pending — see 13_OPEN_DECISIONS)

| Area | Now | Later |
|---|---|---|
| LLM provider | mock | Anthropic (needs a funded key) |
| Persistence | in-memory | durable store (Postgres/KV) — `PERSISTENCE.md` |
| Handoff delivery | recorded only | email / Slack / CRM behind `dispatchHandoff()` |
| Retrieval | lexical | vector, only if conversation data justifies it |
| Rate limiting | per-session message cap | edge rate limit + WAF |
| Widget component tests | none | jsdom + Testing Library |

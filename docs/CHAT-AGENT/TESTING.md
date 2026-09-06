# Chat Agent — Testing

```bash
npm test          # vitest run, once
npm run test:watch
```

Node-environment tests only (no browser, no network). The mock LLM provider
keeps every test deterministic and cost-free.

## Coverage map (against 10_TESTING_AND_ACCEPTANCE_CRITERIA.md)

| Spec category | Test file |
|---|---|
| A. Factual accuracy (company, services, pricing, contact) | `knowledge.test.ts`, `orchestrator.test.ts` |
| B. Hallucination resistance (invented service/price/customer/guarantee/case study) | `orchestrator.test.ts` → "does not fabricate…" |
| C. Sales conversations (vague, clear, high-intent, low-intent, human) | `orchestrator.test.ts`, `recommendation-qualification.test.ts` |
| D. Language (DE/EN parity, Sie-default, mid-conversation switch) | `language-intent.test.ts`, `orchestrator.test.ts` |
| E. Lead qualification (no premature form, no repeat questions, score band) | `recommendation-qualification.test.ts` |
| F. Handoff (explicit request, complex, unknown, existing client) | `orchestrator.test.ts`, `service.test.ts`, `handoff` cases |
| G. Security (prompt injection, system-prompt/secret extraction, oversized, repetition, output leak) | `guardrails.test.ts`, `orchestrator.test.ts` |
| Provider abstraction / graceful degradation | `llm-provider.test.ts`, `orchestrator.test.ts` |
| Persistence + service layer (session, message, lead capture, handoff record, dedup, retention, message cap) | `service.test.ts` |
| Postgres store — mappers, parameterised SQL, migrations, purge queries (fake `SqlClient`) + store factory + memory retention | `persistence.test.ts` |
| Notification channels — selection, no-op safety, Resend adapter (mocked `fetch`), retryable vs. permanent failure, email templates | `notifications.test.ts` |
| Admin API auth — 503 when disabled, 401/403/200, constant-time compare | `admin-auth.test.ts` |

`test/fixtures.ts` holds the shared conversation fixtures grouped by
category — extend these first when adding cases.

## Regression rule

Per spec 10, re-run `npm test` after any change to: the system prompt, the
knowledge base, pricing data, intent rules, the recommendation matrix,
scoring, guardrails, or the provider layer.

## Not yet covered

- React widget component tests (needs jsdom + Testing Library).
- Live-provider contract tests for Anthropic (needs a key).
- **Integration tests against a real Postgres.** The Postgres store is
  tested via a fake `SqlClient` that verifies the SQL shape and row
  mapping, not against a live database. Run a smoke test against a real
  Neon instance once `CHAT_AGENT_DATABASE_URL` is available.
- Live Resend delivery (needs `RESEND_API_KEY` + a verified domain).

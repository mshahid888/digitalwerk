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
| Persistence + service layer (session, message, lead capture, handoff record, message cap) | `service.test.ts` |

`test/fixtures.ts` holds the shared conversation fixtures grouped by
category — extend these first when adding cases.

## Regression rule

Per spec 10, re-run `npm test` after any change to: the system prompt, the
knowledge base, pricing data, intent rules, the recommendation matrix,
scoring, guardrails, or the provider layer.

## Not yet covered

- React widget component tests (needs jsdom + Testing Library).
- Live-provider contract tests (needs a key; deferred with the cost gate).

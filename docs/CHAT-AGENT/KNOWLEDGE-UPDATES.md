# Chat Agent — Updating the Knowledge Base

The agent may only state DigitalWerk-specific facts that are backed by a
`KnowledgeEntry`. Everything the agent "knows" lives in
`lib/chat-agent/knowledge/sources/`.

## Files

| File | Collection | Contains |
|---|---|---|
| `company.ts` | `company` | overview, mission, values, working model, geography, contact, response time |
| `services.ts` | `services` | one entry per service (DE + EN); also exports `serviceCatalog` |
| `ai-solutions.ts` | `ai_solutions` | specific AI use cases (chatbot, voice, booking, WhatsApp, integrations, …) |
| `pricing.ts` | `pricing` | see `PRICING-UPDATES.md` |
| `faq.ts` | `faq` | question + approved answer, from the live service pages |
| `policies.ts` | `policies` | agent operating policy (AI disclosure, data handling, escalation, limitations) — `draft`, internal only |

## Adding or changing an entry

1. Edit the relevant source file. Use the `entry()` helper.
2. Every entry needs `metadata`:
   - `source` — a real URL or `internal:<doc>` reference
   - `lastVerified` — ISO date you checked it against the source
   - `approvalStatus` — `approved` | `provisional` | `draft`
   - `version` — bump on any content change
   - `sensitivity` — `low` | `medium` | `high`
3. Keep one entry to one coherent fact/topic. Add good `keywords` (the
   lexical retriever weights them heavily) — include the phrasings a
   visitor would actually type, in both languages where relevant.
4. `npm test` — `knowledge.test.ts` checks integrity (unique ids, metadata
   present, collections populated) and retrieval behaviour.

## Approval status

- `approved` — cleared by DigitalWerk for customer-facing use.
- `provisional` — transcribed from the public site / repo content, **not
  yet signed off**. The retriever includes it, but it should be reviewed
  before launch.
- `draft` — internal only. The visitor-facing retrieval path
  (`retrieveForPrompt`, `minApproval: "provisional"`) never returns it.

Most entries are currently `provisional`. Part of production readiness is a
DigitalWerk review that flips the verified ones to `approved`.

## What NOT to add

Do not add case studies, testimonials, client names, guarantees or
integration promises unless DigitalWerk has explicitly verified them. The
`case_studies` collection exists in the type system but ships empty on
purpose.

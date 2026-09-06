# DigitalWerk Chat Agent

A consultative website assistant for DigitalWerk: understands visitor
intent, answers from approved knowledge, diagnoses business problems,
recommends a relevant DigitalWerk service, qualifies leads, and hands off
to the team when appropriate — in German and English.

Built to the planning package in the `DigitalWerk_Chat_Agent_Project`
folder (specs `01`–`15`, gap analysis `16`).

## Status

**Phase 2 — foundation + Neon Postgres persistence + Resend notifications +
retention + admin API.** Still runs, develops and tests with **zero cost**:
a deterministic mock LLM, an in-memory store and a no-op notification
channel. Each external dependency (Anthropic, Neon, Resend) activates only
when its credential is present and degrades safely otherwise — no
application code change needed.

## Docs

| File | Topic |
|---|---|
| `ARCHITECTURE.md` | module layout, one-turn flow, persistence, notifications, retention, admin |
| `LOCAL-SETUP.md` | run it, try the API |
| `ENVIRONMENT.md` | every env var (all optional) |
| `PERSISTENCE.md` | store selection, schema, provisioning Neon |
| `PRIVACY.md` | data flow, retention, what needs legal sign-off |
| `TESTING.md` | `npm test`, coverage map, regression rule |
| `KNOWLEDGE-UPDATES.md` | editing the knowledge base |
| `PRICING-UPDATES.md` | editing pricing (mutable business data) |
| `PROVIDER-SETUP.md` | connecting a real LLM later |

## Quick start

```bash
npm install
npm run dev      # chat launcher appears bottom-right on every page
npm test         # deterministic, offline test suite
```

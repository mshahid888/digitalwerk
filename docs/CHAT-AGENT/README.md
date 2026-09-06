# DigitalWerk Chat Agent

A consultative website assistant for DigitalWerk: understands visitor
intent, answers from approved knowledge, diagnoses business problems,
recommends a relevant DigitalWerk service, qualifies leads, and hands off
to the team when appropriate — in German and English.

Built to the planning package in the `DigitalWerk_Chat_Agent_Project`
folder (specs `01`–`15`, gap analysis `16`).

## Status

**Phase 1 — provider-independent foundation.** Runs, develops and tests
with **zero cost**: a deterministic mock LLM provider and an in-memory
store. A real model (Anthropic) and a durable datastore slot in later
behind stable interfaces, with no application code changes.

## Docs

| File | Topic |
|---|---|
| `ARCHITECTURE.md` | module layout, one-turn flow, design decisions |
| `LOCAL-SETUP.md` | run it, try the API |
| `ENVIRONMENT.md` | every env var (all optional) |
| `TESTING.md` | `npm test`, coverage map, regression rule |
| `KNOWLEDGE-UPDATES.md` | editing the knowledge base |
| `PRICING-UPDATES.md` | editing pricing (mutable business data) |
| `PROVIDER-SETUP.md` | connecting a real LLM later |
| `PERSISTENCE.md` | the store seam, production options |

## Quick start

```bash
npm install
npm run dev      # chat launcher appears bottom-right on every page
npm test         # 71 tests, deterministic, offline
```

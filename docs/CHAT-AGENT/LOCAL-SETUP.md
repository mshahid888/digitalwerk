# Chat Agent — Local Setup

## Run it

```bash
npm install
npm run dev
```

Open the site; the chat launcher is bottom-right on every page, in both
locales (`/` and `/en`). No environment variables are needed — the agent
uses the mock LLM provider and an in-memory store.

## Try the API directly

```bash
# start a session
curl -sX POST localhost:3000/api/chat/session -H 'content-type: application/json' -d '{"locale":"de"}'

# send a message (use the sessionId from above)
curl -sX POST localhost:3000/api/chat/message -H 'content-type: application/json' \
  -d '{"sessionId":"<id>","message":"Was kostet ein KI-Agent?","locale":"de"}'

# status snapshot
curl -s localhost:3000/api/chat/health
```

## What "mock mode" does

The mock provider returns the orchestrator's own deterministic, spec-aligned
reply (problem → diagnosis → recommendation → next step). It is enough to
develop the widget, exercise every flow, and run the full regression suite.
Wire a real model later per `PROVIDER-SETUP.md` — no application code
changes.

## Notes

- The in-memory store resets on every dev-server restart. That is expected
  for local work; production needs a durable store (`PERSISTENCE.md`).
- `AGENTS.md` in the repo root: this is Next.js 16 — check
  `node_modules/next/dist/docs/` before changing Next-specific code.

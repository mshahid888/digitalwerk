# Chat Agent — Environment Variables

Every variable is **optional**. With none set, the agent runs on the
deterministic mock provider with in-memory storage — no external account,
no cost. See `.env.example` for the canonical list.

| Variable | Default | Purpose |
|---|---|---|
| `CHAT_AGENT_PROVIDER` | `mock` (or `anthropic` if a key is present) | `mock` or `anthropic`. |
| `ANTHROPIC_API_KEY` | — | Anthropic Messages API key. **Only read when the provider resolves to `anthropic`.** Setting this incurs usage cost — do not set it for mock-based development. Never commit it. |
| `CHAT_AGENT_MODEL` | `claude-sonnet-5` (anthropic) / `mock-1` (mock) | Model id override. |
| `CHAT_AGENT_TEMPERATURE` | `0.4` | Sampling temperature. |
| `CHAT_AGENT_MAX_OUTPUT_TOKENS` | `700` | Cap on generated tokens per turn. |
| `CHAT_AGENT_MAX_INPUT_CHARS` | `4000` | Max chars in one visitor message (guardrail). |
| `CHAT_AGENT_MAX_MESSAGES_PER_SESSION` | `40` | Abuse guard — session then routes to the team. |
| `CHAT_AGENT_MAX_HISTORY_TURNS` | `16` | Turns kept in the model context window. |
| `CHAT_AGENT_HANDOFF_CHANNEL` | — | e.g. `email`, `slack`. Unset → handoffs are recorded but not dispatched. |

## Where to set them

- **Local:** `.env.local` (git-ignored). Copy from `.env.example`.
- **Vercel:** Project → Settings → Environment Variables. Add
  `ANTHROPIC_API_KEY` only when moving past mock development, and scope it
  to the environments that should incur cost.

## Verifying

`GET /api/chat/health` returns which provider is active, whether a key is
present (never the value), the knowledge-base size and the configured
limits. Use it after any deploy.

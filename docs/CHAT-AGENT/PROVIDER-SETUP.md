# Chat Agent — Connecting a Real LLM Provider

The agent runs on the deterministic **mock provider** by default. Connecting
Anthropic requires no application code changes.

## The interface

`lib/chat-agent/llm/types.ts` defines `LlmProvider`:

```ts
interface LlmProvider {
  readonly id: string;
  readonly model: string;
  generate(options: LlmGenerateOptions): Promise<LlmResponse>;
}
```

`getLlmProvider()` (`llm/index.ts`) resolves the active provider from
config and memoizes it. If the provider is `anthropic` but no key is
present, it returns the **mock** provider instead of a broken one.

## Connecting Anthropic

> This incurs usage cost. Do it only when the cost gate is cleared.

1. Create an Anthropic account and API key (this is the human/business step
   — the agent code never does this).
2. Set environment variables (locally in `.env.local`, on Vercel in Project
   Settings):
   ```
   CHAT_AGENT_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-...
   # optional:
   CHAT_AGENT_MODEL=claude-sonnet-5
   ```
3. Redeploy / restart. `GET /api/chat/health` should show
   `provider.active: "anthropic"` and `provider.liveLlm: true`.
4. Run `npm test` — the suite still passes on the mock (tests clear the key
   in `beforeEach`); add live contract tests separately if wanted.

The adapter (`anthropic-provider.ts`) calls the Messages API with `fetch`
(no SDK). It sends the system prompt + per-turn directives + conversation
and returns the text. On any failure it throws
`LlmProviderUnavailableError`, and the orchestrator falls back to the
deterministic composed reply — a provider outage degrades quality, it does
not break the chat.

## Adding a different provider

Implement `LlmProvider` in a new file under `llm/`, add a branch to
`getLlmProvider()`, and a `CHAT_AGENT_PROVIDER` value. Nothing else changes.

## Cost controls already in place

- `CHAT_AGENT_MAX_OUTPUT_TOKENS` (default 700) caps tokens per reply.
- `CHAT_AGENT_MAX_INPUT_CHARS` (default 4000) caps input size.
- `CHAT_AGENT_MAX_MESSAGES_PER_SESSION` (default 40) caps a session, then
  routes to the team.
- `CHAT_AGENT_MAX_HISTORY_TURNS` (default 16) caps context sent per turn.
- Prompt-injection / probe messages are answered **without** calling the
  model.

Before a public launch, add an edge rate limit and Vercel WAF rules — see
`16_GAP_ANALYSIS.md` (planning package) risk table.

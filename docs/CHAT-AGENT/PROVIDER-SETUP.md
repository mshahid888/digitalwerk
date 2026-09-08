# Chat Agent — LLM Provider (provider-agnostic)

The agent is **not tied to any vendor.** Its business logic depends only on
`getLlmProvider()`; it never imports an SDK. Which model provider is used is
**configuration only.**

## The interface

`lib/chat-agent/llm/types.ts`:

```ts
interface LlmProvider {
  readonly id: string;
  readonly model: string;
  generate(options: LlmGenerateOptions): Promise<LlmResponse>;
}
```

Adapters that ship:

| Adapter | File | For |
|---|---|---|
| `MockLlmProvider` | `mock-provider.ts` | dev, CI, any env without credentials — deterministic, no network |
| `OpenAiCompatibleLlmProvider` | `openai-compatible-provider.ts` | **OmniRoute** (the production gateway), OpenAI, Groq, Together, LiteLLM, vLLM, Ollama, … — anything speaking the OpenAI `/v1/chat/completions` shape |
| `AnthropicLlmProvider` | `anthropic-provider.ts` | optional direct Anthropic (kept clean as a fallback; **not** the production path) |

`getLlmProvider()` resolves the adapter from env and memoizes it. If a
provider is selected but its credentials are missing it returns the **mock**
provider, so nothing is ever broken — `GET /api/chat/health` shows which is
actually live (`llm.provider`, `llm.configured`, `llm.live`).

## Configuration

| Var | Meaning |
|---|---|
| `LLM_PROVIDER` | A label. `mock` / `anthropic` pick those adapters; **any other value** (`omniroute`, `openai`, `groq`, …) selects the OpenAI-compatible adapter. |
| `LLM_BASE_URL` | The `…/v1` base of the OpenAI-compatible endpoint. |
| `LLM_API_KEY` | Gateway API key. **Server-side only — never a `NEXT_PUBLIC_` var, never sent to the browser.** |
| `LLM_MODEL` | Model id, passed through verbatim (e.g. `cc/claude-sonnet-4-6`). |
| `LLM_TIMEOUT_MS` | Per-request timeout (default 30000). |
| `LLM_MAX_RETRIES` | Retries on timeout / 5xx / network error (default 1, max 3). |
| `LLM_TEMPERATURE`, `LLM_MAX_OUTPUT_TOKENS` | Generation tuning. |

Legacy aliases still honoured (the `LLM_*` names win): `CHAT_AGENT_PROVIDER`,
`CHAT_AGENT_MODEL`, `CHAT_AGENT_TEMPERATURE`, `CHAT_AGENT_MAX_OUTPUT_TOKENS`.

## Connecting OmniRoute (production default)

> **BLOCKED until an OmniRoute deployment + API key exist.** Until then
> `LLM_PROVIDER=mock` and the agent runs fully on the mock provider.

1. Stand up / obtain access to an OmniRoute instance (it is an
   OpenAI-compatible gateway — self-hostable via npm/Docker, or a hosted
   one). Create an API key in its dashboard.
2. On the **Hetzner Agent API** (`deploy/digitalwerk/.env`):
   ```
   LLM_PROVIDER=omniroute
   LLM_BASE_URL=https://<omniroute-host>/v1
   LLM_API_KEY=<key>
   LLM_MODEL=<provider/model-id>
   ```
   `docker compose up -d agent-api`. That's it — no code change.
3. `GET https://agent.digitalwerkk.de/api/chat/health` →
   `llm.provider: "omniroute"`, `llm.configured: "configured"`, `llm.live: true`.
4. Switching provider later (OpenAI, Gemini via OmniRoute, direct Anthropic)
   is the same three env vars.

On any gateway failure the adapter throws `LlmProviderUnavailableError` and
the orchestrator returns the deterministic composed reply — an outage
degrades quality, it never breaks the chat.

## Optional: direct Anthropic

```
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
LLM_MODEL=claude-sonnet-5   # optional
```

## Resend email channel

Built; off until credentialed.

```
CHAT_AGENT_HANDOFF_CHANNEL=resend
RESEND_API_KEY=re_...
CHAT_AGENT_NOTIFY_TO=team@digitalwerkk.de
CHAT_AGENT_NOTIFY_FROM=chat@digitalwerkk.de   # a Resend-verified domain
```

`GET …/api/chat/health` → `notifications.configured: "configured"`. Handoffs
recorded while it was a no-op are queued; `POST /api/chat/admin/handoffs`
(or the daily maintenance timer) delivers them. Slack / CRM later = a new
file under `notifications/` + one branch — the handoff flow is unchanged.

## Postgres

Production Postgres is **self-hosted on the existing Hetzner server**
(`deploy/digitalwerk/`), reached only by the Hetzner Agent API over a
private Docker network — never exposed to Vercel. See `DEPLOYMENT.md` and
`PERSISTENCE.md`. Any standard `postgresql://` connection string works via
`CHAT_AGENT_DATABASE_URL`.

## Cost / abuse controls in place

- `LLM_MAX_OUTPUT_TOKENS` (700), `CHAT_AGENT_MAX_INPUT_CHARS` (4000),
  `CHAT_AGENT_MAX_MESSAGES_PER_SESSION` (40), `CHAT_AGENT_MAX_HISTORY_TURNS` (16).
- Prompt-injection / probe messages are answered **without** calling the model.
- The Agent API applies a per-IP rate limit (`CHAT_AGENT_RATE_LIMIT_PER_MINUTE`,
  default 20) on `session` + `message`.
- The Agent API only accepts requests carrying the `X-Agent-Auth` shared
  secret (from the Vercel proxy) — the browser never reaches it directly.

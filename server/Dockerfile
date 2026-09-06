# DigitalWerk Agent API — runs on Hetzner in front of the private Postgres.
#
# The agent logic is plain TypeScript in lib/chat-agent/. It is executed
# directly with tsx (no build step, no bundler) — the surface is small and
# this keeps the image and the maintenance burden minimal. Only the four
# runtime packages the agent actually needs are installed (not next/react).
#
# Build context = the repo root:
#   docker build -f server/Dockerfile -t digitalwerk-agent-api:<sha> .

FROM node:22-alpine

# Pinned to match the repo's package.json.
ARG HONO_VERSION=4.13.7
ARG HONO_NODE_SERVER_VERSION=1.19.17
ARG POSTGRES_VERSION=3.4.9
ARG TSX_VERSION=4.20.3

WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app

# Every import (hono from server/, postgres from lib/chat-agent/) resolves
# to this one node_modules.
RUN npm init -y >/dev/null 2>&1 \
 && npm install --omit=dev --no-audit --no-fund \
      "hono@${HONO_VERSION}" \
      "@hono/node-server@${HONO_NODE_SERVER_VERSION}" \
      "postgres@${POSTGRES_VERSION}" \
      "tsx@${TSX_VERSION}"

COPY server ./server
COPY lib/chat-agent ./lib/chat-agent
COPY tsconfig.json ./

USER app
EXPOSE 8080
ENV PORT=8080

# Container liveness only — "is the process serving HTTP". GET / returns
# {ok:true} unconditionally. Full readiness (DB reachable, LLM configured,
# …) is GET /api/chat/health, which returns 503 when degraded and is what
# the Vercel proxy / monitoring watch — a DB blip should not flap the
# container to "unhealthy".
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:8080/" || exit 1

CMD ["node", "--import", "tsx", "server/index.ts"]

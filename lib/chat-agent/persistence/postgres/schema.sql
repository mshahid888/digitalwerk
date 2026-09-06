-- DigitalWerk chat agent — Postgres schema (reference DDL).
--
-- This file is documentation. The authoritative source is
-- lib/chat-agent/persistence/postgres/schema.ts (SCHEMA_STATEMENTS), which
-- the store applies automatically on first use. Keep the two in sync.
--
-- Privacy model:
--   chat_sessions.messages   raw transcript. Purged after
--                            CHAT_AGENT_TRANSCRIPT_RETENTION_DAYS (max 30).
--   chat_leads               permanent lead record. Minimum fields only.
--   chat_handoffs            handoff records + notification delivery state.
--   chat_events              raw analytics events. Purged on the same schedule.

CREATE TABLE IF NOT EXISTS chat_sessions (
  id                   uuid PRIMARY KEY,
  locale               text NOT NULL DEFAULT 'de',
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  messages             jsonb NOT NULL DEFAULT '[]'::jsonb,
  qualification        jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_intent          jsonb,
  last_recommendation  jsonb,
  handoff_requested    boolean NOT NULL DEFAULT false,
  transcript_purged_at timestamptz
);
CREATE INDEX IF NOT EXISTS chat_sessions_created_at_idx ON chat_sessions (created_at);

CREATE TABLE IF NOT EXISTS chat_leads (
  id                       uuid PRIMARY KEY,
  session_id               uuid NOT NULL,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  name                     text,
  company                  text,
  industry                 text,
  email                    text,
  phone                    text,
  problem                  text,
  current_process          text,
  desired_outcome          text,
  relevant_tools           text,
  timeline                 text,
  budget                   text,
  notes                    text,
  score_total              integer NOT NULL DEFAULT 0,
  score_band               text NOT NULL DEFAULT 'informational',
  score_breakdown          jsonb NOT NULL DEFAULT '{}'::jsonb,
  intent                   text NOT NULL DEFAULT 'OTHER',
  recommended_service_slug text,
  conversation_summary     text NOT NULL DEFAULT '',
  status                   text NOT NULL DEFAULT 'new'
);
CREATE UNIQUE INDEX IF NOT EXISTS chat_leads_session_idx ON chat_leads (session_id);
CREATE INDEX IF NOT EXISTS chat_leads_created_at_idx ON chat_leads (created_at);
CREATE INDEX IF NOT EXISTS chat_leads_status_idx ON chat_leads (status);

CREATE TABLE IF NOT EXISTS chat_handoffs (
  id                   uuid PRIMARY KEY,
  session_id           uuid NOT NULL,
  lead_id              uuid,
  created_at           timestamptz NOT NULL DEFAULT now(),
  reason               text NOT NULL,
  urgency              text NOT NULL DEFAULT 'normal',
  language             text NOT NULL DEFAULT 'de',
  intent               text NOT NULL DEFAULT 'OTHER',
  lead_facts           jsonb NOT NULL DEFAULT '{}'::jsonb,
  lead_score           jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommendation       jsonb,
  conversation_summary text NOT NULL DEFAULT '',
  open_questions       jsonb NOT NULL DEFAULT '[]'::jsonb,
  confidence           real NOT NULL DEFAULT 0,
  dispatched           boolean NOT NULL DEFAULT false,
  dispatch_channel     text,
  dispatch_attempts    integer NOT NULL DEFAULT 0,
  dispatched_at        timestamptz,
  last_dispatch_error  text
);
CREATE INDEX IF NOT EXISTS chat_handoffs_session_idx ON chat_handoffs (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS chat_handoffs_pending_idx ON chat_handoffs (dispatched, created_at) WHERE dispatched = false;

CREATE TABLE IF NOT EXISTS chat_events (
  id         uuid PRIMARY KEY,
  session_id uuid NOT NULL,
  at         timestamptz NOT NULL DEFAULT now(),
  type       text NOT NULL,
  metadata   jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS chat_events_session_idx ON chat_events (session_id);
CREATE INDEX IF NOT EXISTS chat_events_at_idx ON chat_events (at);

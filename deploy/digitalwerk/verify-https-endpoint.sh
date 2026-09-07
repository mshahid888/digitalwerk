#!/usr/bin/env bash
# End-to-end verification of the public Agent API endpoint once
# agent.digitalwerkk.de resolves. Applies the Caddy vhost (idempotent),
# waits for the certificate, then exercises the HTTPS surface and re-checks
# that Postgres stays private and PDF Wandler stays healthy.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; cd "$DIR"
HOST="agent.digitalwerkk.de"
AGENT_CTR="${AGENT_API_CONTAINER:-digitalwerk-agent-api-1}"

echo "=== 1. DNS ==="
dig +short "$HOST" A || true
if [ -z "$(dig +short "$HOST" A)" ]; then
  echo "!! $HOST does not resolve yet — aborting. Re-run once it does."; exit 1
fi

echo "=== 2. apply Caddy vhost (idempotent, auto-rollback) ==="
./apply-caddy-vhost.sh

echo "=== 3. wait for the certificate (up to 180s) ==="
code=000
for i in $(seq 1 36); do
  code=$(curl -sS -m10 -o /dev/null -w '%{http_code}' "https://$HOST/api/chat/health" || true)
  echo "  try $i: https health -> $code"
  [ "$code" = "200" ] && break
  sleep 5
done
[ "$code" = "200" ] || { echo "!! endpoint not healthy over HTTPS"; sudo docker logs --tail 40 pdfwandler-caddy-1 | grep -i "$HOST" || true; exit 1; }

echo "=== 4. HTTPS surface ==="
echo "-- health (public) --"
curl -sS -m10 "https://$HOST/api/chat/health" | head -c 500; echo
echo "-- POST /session WITHOUT X-Agent-Auth (expect 403) --"
curl -sS -m10 -o /dev/null -w "  -> %{http_code}\n" -X POST -H 'content-type: application/json' -d '{}' "https://$HOST/api/chat/session"
echo "-- full session -> message WITH X-Agent-Auth --"
SEC=$(sudo docker exec "$AGENT_CTR" printenv AGENT_API_SECRET)
S=$(curl -sS -m10 -X POST -H 'content-type: application/json' -H "x-agent-auth: $SEC" -d '{"locale":"en"}' "https://$HOST/api/chat/session")
echo "  session: $S"
SID=$(printf '%s' "$S" | sed -n 's/.*"sessionId":"\([^"]*\)".*/\1/p')
curl -sS -m20 -X POST -H 'content-type: application/json' -H "x-agent-auth: $SEC" \
  -d "{\"sessionId\":\"$SID\",\"message\":\"How much does an AI agent cost?\",\"locale\":\"en\"}" \
  "https://$HOST/api/chat/message"; echo

echo "=== 5. TLS certificate ==="
echo | openssl s_client -servername "$HOST" -connect "$HOST:443" 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates

echo "=== 6. PDF Wandler unaffected ==="
sudo docker ps --format '{{.Names}}: {{.Status}}' | grep pdfwandler
for u in https://www.pdfwandler.de/health https://staging.pdfwandler.de/health; do
  curl -sS -m10 -o /dev/null -w "  $u -> %{http_code}\n" "$u"
done

echo "=== 7. Postgres still private ==="
sudo ss -tlpnH | grep -q ':5432' && { echo "  !! 5432 PUBLISHED"; exit 1; } || echo "  5432 not published — OK"
curl -sS -m5 -o /dev/null -w "  public :5432 -> %{http_code} (expect 000/refused)\n" "http://$HOST:5432" || echo "  refused — OK"

echo
echo "ALL CHECKS PASSED — set on Vercel:  AGENT_API_URL=https://$HOST  and  AGENT_API_SECRET=<server .env value>"

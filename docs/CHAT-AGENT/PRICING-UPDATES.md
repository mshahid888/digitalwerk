# Chat Agent — Updating Pricing

Pricing is **mutable business data**. It is not in the system prompt. The
agent retrieves it per turn from `lib/chat-agent/knowledge/sources/pricing.ts`.

## The `priceRecords` array

Each record:

```ts
{
  id: "price-seo",
  service: "Local SEO",
  amount: "299 € / Monat",
  billing: "monthly",              // one_time | monthly | from_monthly | from_one_time | project
  advertisingBudgetIncluded: null, // true | false | null (n/a)
  effectiveDate: "2026-09-06",
  source: "https://www.digitalwerkk.de/loesungen/seo",
  approvalStatus: "provisional",   // approved | provisional | draft
  note: "…",
}
```

`pricingEntries` is generated from these records into DE + EN
`KnowledgeEntry` objects automatically — you only edit `priceRecords`.

## To change a price

1. Edit the record's `amount` (and `billing` / `advertisingBudgetIncluded`
   if they changed).
2. Set `effectiveDate` to today.
3. Update `source` if it moved.
4. Set `approvalStatus`:
   - `approved` once DigitalWerk has confirmed the figure;
   - `provisional` if it's from the public site and not yet signed off.
5. `npm test` — `knowledge.test.ts` and `orchestrator.test.ts` cover
   pricing retrieval; a pricing test asserts the KI-Agent figure.

## Current state (2026-09-06)

**Every price is `provisional`** — transcribed from the public website
snapshot and the repo's service-page content. Before production, each must
be verified against an approved DigitalWerk source and flipped to
`approved`. Values on file:

| Service | Amount | Budget included |
|---|---|---|
| DigitalWerk Komplett | 699 € / Monat | no |
| Local SEO | 299 € / Monat | n/a |
| Google Unternehmensprofil | 199 € einmalig | n/a |
| Content-Erstellung | 349 € / Monat | n/a |
| Webentwicklung | ab 1.299 € einmalig | n/a |
| E-Commerce | ab 1.499 € einmalig | n/a |
| KI-Agenten | 699 € Einrichtung + 99 € / Monat | n/a |
| Werbeanzeigen (je Kanal) | ab 249 € / Monat | no |
| Leadgenerierung | individuell | n/a |
| Digital Marketing | individuell | n/a |

## Agent behaviour

The agent states a price only if it is in a retrieved entry, always notes
that the final price can depend on scope, and never estimates a figure
itself. This is enforced by the system prompt (rule 7 + Pricing section)
and covered by the hallucination tests.

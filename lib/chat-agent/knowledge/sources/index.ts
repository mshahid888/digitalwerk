import type { KnowledgeEntry } from "../types";
import { aiSolutionEntries } from "./ai-solutions";
import { companyEntries } from "./company";
import { faqEntries } from "./faq";
import { policyEntries } from "./policies";
import { pricingEntries } from "./pricing";
import { serviceEntries } from "./services";

export { serviceCatalog } from "./services";
export { priceRecords, type PriceRecord } from "./pricing";

// The full approved-and-provisional knowledge base. Ordering is stable so
// retrieval scoring ties break deterministically (important for tests).
export const knowledgeBase: KnowledgeEntry[] = [
  ...companyEntries,
  ...serviceEntries,
  ...aiSolutionEntries,
  ...pricingEntries,
  ...faqEntries,
  ...policyEntries,
];

// Guard against duplicate ids (a common copy/paste bug when adding entries).
const seen = new Set<string>();
for (const item of knowledgeBase) {
  if (seen.has(item.id)) {
    throw new Error(`Duplicate knowledge entry id: ${item.id}`);
  }
  seen.add(item.id);
}

export function knowledgeStats() {
  const byCollection: Record<string, number> = {};
  const byApproval: Record<string, number> = {};
  for (const item of knowledgeBase) {
    byCollection[item.collection] = (byCollection[item.collection] ?? 0) + 1;
    byApproval[item.metadata.approvalStatus] =
      (byApproval[item.metadata.approvalStatus] ?? 0) + 1;
  }
  return { total: knowledgeBase.length, byCollection, byApproval };
}

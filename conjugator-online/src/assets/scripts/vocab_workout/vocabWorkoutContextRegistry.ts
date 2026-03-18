export type ContextHit = { source_page: string; text: string };
export type ContextIndex = Record<string, ContextHit[]>;

async function fetchContextJson(fileName: string): Promise<ContextIndex> {
  const url = `/data/vocab_workout_context/${fileName}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load context JSON (${url}): ${res.status}`);
  return (await res.json()) as ContextIndex;
}

/**
 * Keys MUST match props.gameSettings.listKey
 * Values are the JSON filename inside public/data/vocab_workout_context/
 */
export const contextByListKey: Record<string, () => Promise<ContextIndex>> = {
  irregular_verbs: () => fetchContextJson("usage_irregularVerbs.json"),
  phrasal_verbs: () => fetchContextJson("usage_PhrasalVerbs.json"),
  useful_regular_verbs: () => fetchContextJson("usage_UsefulRegularVerbs.json"),

  // BUSINESS
  RegularVerbsBusiness: () => fetchContextJson("usage_RegularVerbsBusiness.json"),
  product_marketing: () => fetchContextJson("usage_productMarketing.json"),
  promotion_and_business_development: () =>
    fetchContextJson("usage_promotionAndBusinessDevelopment.json"),
  business_ethics: () => fetchContextJson("usage_businessEthics.json"),
  sustainability: () => fetchContextJson("usage_sustainability.json"),
  meetings: () => fetchContextJson("usage_meetings.json"),

  // add the rest...
};

export function normalizeContextKey(s: string): string {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");
};

export const contextApprovedListKeys = new Set<string>([
  // Only add listKeys you have vetted / approved:
  // "irregular_verbs",
  "phrasal_verbs",
  "business_ethics",
]);
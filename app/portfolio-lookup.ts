import type { Localized } from "../content/resume";

export const directoryFragment = "#portfolio-directory";
export type LookupKind = "case" | "output" | "example" | "workflow" | "map" | "page";
export type LookupEntry = {
  href: string;
  kind: LookupKind;
  title: Localized;
  context?: Localized;
  aliases?: readonly string[];
  focus?: string;
};

export function normalizeLookup(query: string) {
  return query.normalize("NFKC").toLowerCase()
    .replace(/\bu\.\s*s\.?\s*(?:a\.)?(?=\s|$|[^a-z0-9])/g, "us ")
    .normalize("NFD").replace(/\p{M}/gu, "")
    .replace(/[’']/g, "").replace(/[^\p{L}\p{N}%]+/gu, " ").trim();
}

export function searchPortfolio(entries: readonly LookupEntry[], query: string) {
  const phrase = normalizeLookup(query);
  if (!phrase) return [];
  const terms = phrase.split(" ");
  const matches = (field: string, term: string) => /^[a-z]{1,2}$/.test(term)
    ? field.split(" ").includes(term) : field.includes(term);
  return entries.flatMap((entry, index) => {
    const titles = [entry.title.zh, entry.title.en].map(normalizeLookup);
    const context = entry.context ? [entry.context.zh, entry.context.en].map(normalizeLookup) : [];
    const aliases = (entry.aliases ?? []).map(normalizeLookup);
    const fields = [...titles, ...aliases, ...context];
    if (!terms.every(term => fields.some(field => matches(field, term)))) return [];
    const titleRank = titles.includes(phrase) ? 100
      : titles.some(field => matches(field, phrase)) ? 68
      : terms.every(term => titles.some(field => matches(field, term))) ? 50 : 0;
    const aliasRank = aliases.includes(phrase) ? 34 : 0;
    const kindRank = { case: 8, example: 7, output: 6, map: 5, workflow: 4, page: 3 }[entry.kind];
    return [{ entry, index, rank: titleRank + aliasRank + kindRank }];
  }).sort((a, b) => b.rank - a.rank || a.index - b.index).map(({ entry }) => entry);
}

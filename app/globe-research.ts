// These are case identities, not matching country names to unrelated work.
// The standalone search-experience study has no featured-work equivalent.
export const caseWorkIndices = [0, 3, null, 2] as const;
export const mapStudyIds = ["content-tracking", "search-tracking", "us-search-experience", "us-content"] as const;
export type MarketStudyOrigin = { market: string; studyIndex: number; fromMapLink?: boolean };

// Lead with the multi-country project and the independently owned U.S. study.
const marketStudyOrder: readonly number[] = [0, 3, 1, 2];

export function researchForMarket<T extends { markets: readonly string[] }>(studies: readonly T[], market: string) {
  return studies.map((item, index) => ({ item, index }))
    .filter(({ item, index }) => market === "CN" ? index < 2 : item.markets.includes(market));
}

export function marketStudyIndex<T extends { markets: readonly string[] }>(studies: readonly T[], market: string) {
  const matches = researchForMarket(studies, market);
  return marketStudyOrder.flatMap(index => matches.filter(study => study.index === index));
}

export function preferredMarketStudyIndex<T extends { markets: readonly string[] }>(studies: readonly T[], market: string) {
  const choices = marketStudyIndex(studies, market);
  return (market === "US" ? choices.find(choice => choice.index === 3) : undefined)?.index ?? choices[0]?.index ?? null;
}

export function mapMarketForStudy<T extends { markets: readonly string[] }>(studies: readonly T[], index: number, currentMarket: string) {
  if (researchForMarket(studies, currentMarket).some(entry => entry.index === index)) return currentMarket;
  return researchForMarket(studies, "CN").some(entry => entry.index === index) ? "CN" : studies[index]?.markets[0] ?? "CN";
}

// Reveal just the short case index, not the entire (possibly tall) evidence panel.
export function marketIndexScrollDelta(rect: { top: number; bottom: number }, viewportTop: number, viewportBottom: number) {
  if (rect.top < viewportTop || rect.bottom - rect.top > viewportBottom - viewportTop) return rect.top - viewportTop;
  return Math.max(0, rect.bottom - viewportBottom);
}

// These are case identities, not matching country names to unrelated work.
// The standalone search-experience study has no featured-work equivalent.
export const caseWorkIndices = [0, 3, null, 2] as const;
export type MarketStudyOrigin = { market: string; studyIndex: number };

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

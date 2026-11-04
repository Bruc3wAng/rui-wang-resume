// These are case identities, not matching country names to unrelated work.
// The standalone search-experience study has no featured-work equivalent.
export const caseWorkIndices = [0, 3, null, 2] as const;

export function researchForMarket<T extends { markets: readonly string[] }>(studies: readonly T[], market: string) {
  return studies.map((item, index) => ({ item, index }))
    .filter(({ item, index }) => market === "CN" ? index < 2 : item.markets.includes(market));
}

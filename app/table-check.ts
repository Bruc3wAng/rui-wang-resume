export const tableCheckFragment = "#example-table-check";
export const tableCheckOutput = { study: "search-tracking", output: "validation-tools" } as const;

export const reviewGroups = ["a", "b", "c"] as const;
export type ReviewGroup = typeof reviewGroups[number];
type Scope = "recent" | "all";
type Response = {
  group: ReviewGroup;
  id: string;
  used_last_7d: boolean;
  found_in_search: boolean;
};
type Cell = { group: ReviewGroup; scope: Scope; hits: number; base: number };
export const requiredScope: Scope = "recent";

// Constructed binary answers, independent of the three supplied report cells.
// The question is asked of everyone; only the analysis base is filtered.
const examples: Record<ReviewGroup, readonly (readonly [0 | 1, 0 | 1])[]> = {
  a: [[1, 1], [1, 0], [1, 1], [0, 1], [1, 1], [0, 0]],
  b: [[1, 0], [0, 0], [1, 1], [1, 1], [0, 1], [1, 1]],
  c: [[1, 1], [1, 0], [0, 1], [1, 1], [0, 0], [1, 0]],
};
export const exampleResponses: readonly Response[] = reviewGroups.flatMap(group =>
  examples[group].map(([recent, found], i) => ({
    group,
    id: `${group.toUpperCase()}0${i + 1}`,
    used_last_7d: Boolean(recent),
    found_in_search: Boolean(found),
  })),
);
const exampleReport: readonly Cell[] = [
  { group: "a", scope: "recent", hits: 3, base: 4 },
  { group: "b", scope: "recent", hits: 2, base: 4 },
  { group: "c", scope: "all", hits: 3, base: 6 },
];

export function reviewReportCell(responses: readonly Response[], report: Cell) {
  const records = responses.filter(response => response.group === report.group);
  const included = records.filter(record => record.used_last_7d);
  const check: Omit<Cell, "group"> = { scope: requiredScope, hits: included.filter(record => record.found_in_search).length, base: included.length };
  const verdict = report.scope !== check.scope ? "scope"
    : !check.base ? "empty"
    : report.base !== check.base || report.hits !== check.hits ? "mismatch"
    : "match";
  return { report, check, records, verdict } as const;
}

export const tableReview = exampleReport.map(report => reviewReportCell(exampleResponses, report));

import type { Localized } from "../content/resume";

export const audienceOverlapTarget = {
  study: "us-content", output: "preferences-and-habits", fragment: "#example-audience-overlap",
} as const;
export const audienceOverlapLabel: Localized = { zh: "查看观众重合示例", en: "See the audience overlap example" };

// Fictional, mutually exclusive groups. This is not a project dataset.
export const audienceGroups = [
  { id: "a-only", size: 48, preferShort: 36, label: { zh: "只看 A", en: "A only" } },
  { id: "both", size: 32, preferShort: 16, label: { zh: "两类都看", en: "Both" } },
  { id: "b-only", size: 80, preferShort: 20, label: { zh: "只看 B", en: "B only" } },
  { id: "neither", size: 40, preferShort: null, label: { zh: "两类都没看", en: "Neither" } },
] as const;
type Group = typeof audienceGroups[number]["id"];
const baseGroups = [
  { id: "a", groups: ["a-only", "both"], label: { zh: "看过 A", en: "Watched A" } },
  { id: "b", groups: ["both", "b-only"], label: { zh: "看过 B", en: "Watched B" } },
  { id: "all", groups: ["a-only", "both", "b-only", "neither"], label: { zh: "全体受访者", en: "Everyone" } },
] as const satisfies readonly { id: string; groups: readonly Group[]; label: Localized }[];

export function audienceOverlapExample() {
  const total = audienceGroups.reduce((n, group) => n + group.size, 0);
  const overlap = audienceGroups.find(group => group.id === "both")!.size;
  const bases = baseGroups.map(base => {
    const members = new Set<Group>(base.groups);
    const start = audienceGroups.slice(0, audienceGroups.findIndex(group => members.has(group.id))).reduce((n, group) => n + group.size, 0);
    const size = audienceGroups.filter(group => members.has(group.id)).reduce((n, group) => n + group.size, 0);
    return { ...base, start: start / total, width: size / total, size, overlap, share: overlap / size };
  });
  const preferences = audienceGroups.flatMap(group => group.preferShort === null ? [] : [
    { ...group, preferShort: group.preferShort, share: group.preferShort / group.size },
  ]);
  return { total, groups: audienceGroups, bases, preferences };
}

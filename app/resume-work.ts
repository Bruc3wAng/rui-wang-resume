import type { Localized } from "../content/resume";

export const resumeWorkFragment = "#resume-work";
export const resumeDownloadFragment = "#resume-downloads";

export function resumeSectionFragment(fragment: string | null) {
  return fragment === resumeWorkFragment || fragment === resumeDownloadFragment ? fragment : "";
}

// Concise entries from the verified work summaries. Titles, responsibility
// and exact output links are resolved from the existing public case catalogue.
export const resumeWorkEntries = [
  {
    id: "content-tracking",
    contribution: {
      zh: "统筹多市场研究执行，确认人群和期次可比，再用 Codex 批量计算和独立复算，核对满意度因素排序。",
      en: "Coordinated fieldwork across markets, set audience and wave criteria, and used Codex to calculate and independently check the satisfaction-factor rankings.",
    },
  },
  {
    id: "brand-tracking",
    contribution: {
      zh: "核对各期的指标和来源，用 Codex 批量更新受影响的图表和文字，保留仍然有效的历史结果。",
      en: "Checked measures and sources across waves, then used Codex to update affected charts and text in batches while retaining valid historical results.",
    },
  },
  {
    id: "us-content",
    contribution: {
      zh: "在美国市场按同一套人群划分比较内容偏好、消费习惯和受众重合，为内容定位研究提供依据。",
      en: "Used consistent audience segments to compare preferences, habits, and audience overlap in the U.S., informing content-positioning research.",
    },
  },
] as const satisfies readonly { id: string; contribution: Localized }[];

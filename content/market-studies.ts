import type { Localized } from "./resume";

type MarketStudyPresentation = {
  shortTitle: Localized;
  scope: Localized;
  contribution?: Localized;
  ai?: Localized;
  delivery?: Localized;
};

const tracking = { zh: "多国追踪", en: "Multi-country tracking" };
const usStudy = { zh: "美国专项", en: "U.S. study" };

// Indexed by the four verified cases, not by a featured-work position or country.
export const marketStudyPresentation: readonly MarketStudyPresentation[] = [
  {
    shortTitle: { zh: "内容体验追踪", en: "Content experience" },
    scope: tracking,
    contribution: {
      zh: "统筹调研和分析，确定用户分组、加权和跨期比较条件，复核不同方法得出的因素排序。",
      en: "Coordinated fieldwork and analysis, set audience groups, weights, and wave-comparison criteria, and checked factor rankings across methods.",
    },
    ai: {
      zh: "借助 Codex 批量运行相对权重与相关分析，把重复计算和核验做成可复跑流程。",
      en: "Used Codex to batch-run relative weight and correlation analyses and make repeated calculations and checks rerunnable.",
    },
    delivery: {
      zh: "跨市场分析报告、跨期对照和分析方法 SOP，用于解释体验差异并提出研究建议。",
      en: "A cross-market report, wave comparisons, and an analysis guide to explain differences and support research recommendations.",
    },
  },
  {
    shortTitle: { zh: "搜索心智追踪", en: "Search perceptions" },
    scope: tracking,
    contribution: {
      zh: "开展用户分层、交叉分析与趋势比较，把问卷、数据字段和分析表的对应关系写成复核规则。",
      en: "Segmented users, compared cross-tabs and trends, and mapped survey items, data fields, and analysis tables into review rules.",
    },
    ai: {
      zh: "设计并验证 Codex 辅助工具，批量核对各国与汇总结果，帮助团队追溯并确认差异。",
      en: "Designed and validated a Codex-assisted tool to check country-level and combined results in batches and trace discrepancies for team review.",
    },
    delivery: {
      zh: "跨市场搜索认知与行为比较，以及可追溯到源数据的批量复核工具。",
      en: "Cross-market comparisons of search awareness and behavior, and a batch review tool that traces issues to the source data.",
    },
  },
  { shortTitle: { zh: "搜索体验研究", en: "Search experience" }, scope: usStudy },
  { shortTitle: { zh: "内容消费研究", en: "Content consumption" }, scope: usStudy },
];

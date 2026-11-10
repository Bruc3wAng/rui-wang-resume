import type { Localized } from "../content/resume";

export const resumeWorkFragment = "#resume-work";
export const resumeDownloadFragment = "#resume-downloads";
export const resumeAnalyticsFragment = "#resume-work-analytics";
export const resumeOperationsFragment = "#resume-work-operations";

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

type WorkEvidence = {
  id: string;
  contribution: Localized;
  output?: string;
  example?: { fragment: `#${string}`; title: Localized };
};

type ResumeWorkView = {
  id: "research" | "analytics" | "operations";
  fragment: typeof resumeWorkFragment | typeof resumeAnalyticsFragment | typeof resumeOperationsFragment;
  title: Localized;
  summary: Localized;
  entries: readonly WorkEvidence[];
};

// The default résumé remains unchanged. The two alternative views select
// already public responsibilities and link to their matching deliverables.
export const resumeWorkViews: readonly ResumeWorkView[] = [
  {
    id: "research",
    fragment: resumeWorkFragment,
    title: { zh: "市场研究", en: "Market research" },
    summary: { zh: "多市场追踪、品牌表现与美国专项研究。", en: "Multi-market tracking, brand performance, and a U.S. audience study." },
    entries: resumeWorkEntries,
  },
  {
    id: "analytics",
    fragment: resumeAnalyticsFragment,
    title: { zh: "数据分析", en: "Data analytics" },
    summary: { zh: "满意度因素排序、报表复核与人群划分。", en: "Satisfaction-factor rankings, table checks, and audience segmentation." },
    entries: [
      {
        id: "content-tracking",
        contribution: {
          zh: "先确认哪些人群、指标和期次可比，再用 Codex 批量计算、独立复算，对照相对权重与相关分析的排序。",
          en: "I checked which audiences, measures, and waves were comparable, then used Codex for batch calculations and independent checks to compare relative weight and correlation rankings.",
        },
        output: "cross-market-report",
        example: { fragment: "#example-relative-weights", title: { zh: "试因素排序对照", en: "Try the ranking comparison" } },
      },
      {
        id: "search-tracking",
        contribution: {
          zh: "我设计并验证了 Codex 辅助复核工具，把问卷题目、数据字段和分析表对应起来，发现差异后可回到源数据核对。",
          en: "I designed and validated a Codex-assisted review tool linking survey questions, data fields, and analysis tables, so discrepancies could be checked against the source data.",
        },
        output: "validation-tools",
        example: { fragment: "#example-table-check", title: { zh: "试表格复核", en: "Try the table check" } },
      },
      { ...resumeWorkEntries[2], output: "audience-segments" },
    ],
  },
  {
    id: "operations",
    fragment: resumeOperationsFragment,
    title: { zh: "研究运营", en: "Research ops" },
    summary: { zh: "跨市场执行、报告更新与实地研究协调。", en: "Cross-market fieldwork, report updates, and field-research coordination." },
    entries: [
      {
        id: "content-tracking",
        contribution: {
          zh: "我统筹问卷落地、跨市场执行和数据交付，把分市场计算、独立复算和跨期对照做成可复跑的流程。",
          en: "I coordinated questionnaire rollout, fieldwork across markets, and data delivery, and made market-level calculations, independent checks, and wave comparisons rerunnable.",
        },
        output: "analysis-guide",
      },
      {
        id: "brand-tracking",
        contribution: {
          zh: "我核对数据、平台和报告所用的指标与期次，把更新规则写进程序，用 Codex 批量更新受影响的表格、图表和文字。",
          en: "I checked the measures and waves across data, the tracking platform, and reports, then encoded update rules and used Codex to update affected tables, charts, and text in batches.",
        },
        output: "metric-mapping",
        example: { fragment: "#practice-tracking-delivery", title: { zh: "看批量更新流程", en: "See the batch-update workflow" } },
      },
      {
        id: "qualitative",
        contribution: {
          zh: "我参与协调跨语言的研究执行，结合访谈和定量资料，把用户描述的场景对应到产品使用与采购问题。",
          en: "I helped coordinate research across languages and used interviews and related survey evidence to connect users’ situations to product use and purchasing questions.",
        },
        output: "field-evidence",
      },
    ],
  },
];

export function resumeWorkViewForFragment(fragment: string | null) {
  return resumeWorkViews.find(view => view.fragment === fragment) ?? resumeWorkViews[0];
}

export function resumeSectionFragment(fragment: string | null) {
  return fragment === resumeDownloadFragment ? fragment : resumeWorkViews.find(view => view.fragment === fragment)?.fragment ?? "";
}

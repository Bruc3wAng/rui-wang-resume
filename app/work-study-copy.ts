import type { Localized } from "../content/resume";

type StudyCopy = {
  context: Localized;
  action: Localized;
  contribution: Localized;
  outputs: readonly [Localized, Localized, Localized];
  output: 0 | 1 | 2;
  ai?: Localized;
};

// Public case summaries; titles, roles and deliverable descriptions still come
// from the existing study and folio sources.
export const workStudyCopy: Record<string, StudyCopy> = {
  "content-tracking": {
    context: {
      zh: "持续比较各市场的内容体验，分析哪些体验因素与满意度关联更强。",
      en: "A multi-country tracker examining which aspects of the content experience are most closely linked to satisfaction.",
    },
    action: {
      zh: "我统筹问卷落地、跨市场执行和数据交付。",
      en: "I coordinated questionnaire rollout, fieldwork across markets, and data delivery.",
    },
    contribution: {
      zh: "分析时，我先确认哪些人群、指标和期次可比，再对照相对权重与相关分析的排序，排查方法或样本变化能否解释差异。",
      en: "I checked which audiences, measures, and waves were comparable, then compared factor rankings from relative weight and correlation analyses to see whether method or sample changes could explain differences.",
    },
    ai: {
      zh: "我用 Codex 把分市场计算、独立复算和跨期对照做成可复跑的流程。后续能沿用计算规则，把精力用在解释差异上。",
      en: "I used Codex to make market-level calculations, independent checks, and wave comparisons rerunnable. The same rules can be reused, leaving more time to interpret differences.",
    },
    outputs: [
      { zh: "跨市场分析报告", en: "Cross-market report" },
      { zh: "跨期比较", en: "Wave comparisons" },
      { zh: "分析方法 SOP", en: "Analysis guide" },
    ],
    output: 0,
  },
  "brand-tracking": {
    context: {
      zh: "长期追踪不同客群和品类的品牌认知、评价与形象。",
      en: "A long-running tracker of brand awareness, perceptions, and image across audiences and categories.",
    },
    action: {
      zh: "我追查数据、监测平台、图表与报告正文之间的差异。",
      en: "I traced discrepancies across the source data, tracking platform, charts, and report text.",
    },
    contribution: {
      zh: "核对各处使用的指标和期次后，我区分了需要修正的内容与应保留的历史结果。",
      en: "I checked the measure and wave each source used before deciding what needed correction and which historical results to retain.",
    },
    ai: {
      zh: "我把更新规则写进程序，让 Codex 批量比对多期文件、更新受影响的表格、图表和文字。逐份查找和复制改成批量处理，我集中复核差异。",
      en: "I encoded the update rules and used Codex to compare files across waves and update affected tables, charts, and text. I could review discrepancies together instead of searching and copying file by file.",
    },
    outputs: [
      { zh: "多期数据与报告", en: "Multi-wave data and reports" },
      { zh: "来源与指标映射", en: "Source and metric mapping" },
      { zh: "复用程序", en: "Reusable tools" },
    ],
    output: 0,
  },
  "us-content": {
    context: {
      zh: "一项美国定量研究，比较两类内容用户的偏好、消费习惯和重合情况。",
      en: "A U.S. quantitative study comparing the preferences, consumption habits, and overlap of two content audiences.",
    },
    action: {
      zh: "我独立推进研究执行、数据检查和分析交付。",
      en: "I independently coordinated fieldwork, data checks, and analytical delivery.",
    },
    contribution: {
      zh: "我按同一套人群划分比较内容偏好与习惯，辨别哪些用户有重合、哪些人群需要分开看。",
      en: "I compared preferences and habits using the same audience segments to identify where users overlapped and where their differences mattered.",
    },
    outputs: [
      { zh: "用户分层", en: "Audience segments" },
      { zh: "偏好与习惯比较", en: "Preferences and habits" },
      { zh: "分析交付", en: "Analytical delivery" },
    ],
    output: 1,
  },
  "search-tracking": {
    context: {
      zh: "多国搜索追踪，比较用户想到哪些平台、在不同场景里又实际怎么搜。",
      en: "A multi-country tracker on which platforms people think of and how they actually search in different situations.",
    },
    action: {
      zh: "我按市场、人群和场景拆分搜索行为。",
      en: "I broke down search behavior by market, audience, and context.",
    },
    contribution: {
      zh: "把平台认知与实际使用分开比较，再对照不同期次，判断哪些差异值得进一步解释。",
      en: "I compared platform awareness and actual use separately, then checked across waves to identify differences worth explaining.",
    },
    outputs: [
      { zh: "跨市场比较", en: "Market comparisons" },
      { zh: "用户与场景分析", en: "Audience and context analysis" },
      { zh: "批量核验工具", en: "Batch-validation tools" },
    ],
    ai: {
      zh: "我设计并验证了 Codex 辅助复核工具，把问卷、数据字段和分析表连起来。发现差异后，团队可以回到对应的源数据核对。",
      en: "I designed and validated a Codex-assisted review tool that links survey questions, data fields, and analysis tables. When a discrepancy appears, the team can trace it back to the source data.",
    },
    output: 0,
  },
  qualitative: {
    context: {
      zh: "海外实地研究与用户画像，关注产品怎么用、采购时看重什么。",
      en: "International field research and user profiling on how people use products and what they consider when buying them.",
    },
    action: {
      zh: "我参与协调跨语言的研究执行。",
      en: "I helped coordinate research across languages.",
    },
    contribution: {
      zh: "结合访谈和相关定量资料，把用户描述的场景对应到具体的产品使用和采购问题。",
      en: "I used interview and related survey evidence to connect users’ situations with specific questions about product use and purchasing.",
    },
    outputs: [
      { zh: "实地研究资料", en: "Field-research evidence" },
      { zh: "用户画像", en: "User profiles" },
      { zh: "需求与决策分析", en: "Needs and decision analysis" },
    ],
    output: 2,
  },
};

export function workStudyCopyFor(id: string) {
  if (!Object.hasOwn(workStudyCopy, id)) throw new RangeError("Unknown study identity");
  return workStudyCopy[id];
}

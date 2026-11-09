import type { Localized } from "../content/resume";

type StudyCopy = { context: Localized; contribution: Localized; output: 0 | 1 | 2; ai?: Localized };

// Public case summaries; titles, roles and deliverable descriptions still come
// from the existing study and folio sources.
export const workStudyCopy: Record<string, StudyCopy> = {
  "content-tracking": {
    context: {
      zh: "持续追踪多个市场的内容体验，比较不同用户群和期次的满意度。",
      en: "An ongoing tracker comparing content experience and satisfaction across markets, audiences, and waves.",
    },
    contribution: {
      zh: "我先确认哪些人群、指标和期次能直接比较，再对照相对权重与相关分析的排序，判断差异是否来自分析方法或样本变化。",
      en: "I set the criteria for comparing audiences, measures, and waves. I then checked factor rankings from relative weight and correlation analyses to see whether differences could reflect the method or sample.",
    },
    ai: {
      zh: "我用 Codex 把分市场计算、独立复算和跨期对照做成可复跑的流程。后续能沿用计算规则，把精力用在解释差异上。",
      en: "I used Codex to make market-level calculations, independent checks, and wave comparisons rerunnable. The same rules can be reused, leaving more time to interpret differences.",
    },
    output: 0,
  },
  "brand-tracking": {
    context: {
      zh: "跨客群、多品类的长期品牌追踪。多期数据、监测平台和报告需要对得上。",
      en: "A long-running brand tracker spanning audiences, categories, and waves. The source data, tracking platform, and report had to agree.",
    },
    contribution: {
      zh: "我沿着数据、平台、图表和正文追查差异。先核对各处用的指标和期次，再决定哪些需要修正，哪些历史结果应保留。",
      en: "I traced discrepancies from the source data to the platform, charts, and report text. I checked which measure and wave each used before deciding what to correct and what history to retain.",
    },
    ai: {
      zh: "我把确认的更新规则写进程序，用 Codex 批量比对多期文件，更新受影响的表格、图表和文字。原本逐份查找、复制的工作变成批量处理，再集中复核差异。",
      en: "I used Codex to turn the agreed rules into tools that compare files across waves and update affected tables, charts, and text. This replaced file-by-file searches and copying with batch processing and targeted review.",
    },
    output: 0,
  },
  "us-content": {
    context: {
      zh: "美国市场的定量研究，关注内容偏好、消费习惯和不同用户群的重合。",
      en: "A U.S. quantitative study of content preferences, consumption habits, and overlap between audiences.",
    },
    contribution: {
      zh: "我把内容偏好和消费习惯放在同一套人群划分下比较，判断哪些用户有重合，哪些人群在内容定位上需要分开看。",
      en: "I compared preferences and consumption habits across the same audience segments to see where groups overlapped and where content positioning needed to account for their differences.",
    },
    output: 1,
  },
  "search-tracking": {
    context: {
      zh: "多国搜索追踪，同时看用户想到哪些平台，以及他们在不同场景里怎么搜。",
      en: "A multi-country tracker on which search platforms come to mind and how people search in different situations.",
    },
    contribution: {
      zh: "我按人群和场景做交叉分析，把平台认知和实际使用分开看，再用跨期对照判断哪些差异值得解释。",
      en: "I compared audiences and search contexts to separate platform awareness from actual use, then compared waves to see which differences warranted interpretation.",
    },
    ai: {
      zh: "我设计并验证了 Codex 辅助复核工具，把问卷、数据字段和分析表连起来。发现差异后，团队可以回到对应的源数据核对。",
      en: "I designed and validated a Codex-assisted review tool that links survey questions, data fields, and analysis tables. When a discrepancy appears, the team can trace it back to the source data.",
    },
    output: 0,
  },
  qualitative: {
    context: {
      zh: "海外实地研究与用户画像，关注产品怎么用、使用者需要什么，以及采购时考虑什么。",
      en: "International field research and user profiling on how people use products, what they need, and what they consider when purchasing.",
    },
    contribution: {
      zh: "我参与协调跨语言研究执行，并结合访谈与定量资料，把用户描述的场景对应到具体的产品使用和采购问题。",
      en: "I helped coordinate research across languages and brought interview and survey evidence together to connect users’ situations with specific product-use and purchasing questions.",
    },
    output: 2,
  },
};

export function workStudyCopyFor(id: string) {
  if (!Object.hasOwn(workStudyCopy, id)) throw new RangeError("Unknown study identity");
  return workStudyCopy[id];
}

import type { Localized } from "../content/resume";

type WorkflowProof = readonly [Localized, Localized, Localized];

export const aiWorkflowProofs = {
  "research-analysis": [
    {
      zh: "先核对市场、人群和指标，再判断方法或样本的变化会不会影响比较。",
      en: "Check markets, audiences, and measures. Decide if a method or sample change affects comparison.",
    },
    {
      zh: "用 Codex 把分市场计算、独立复算和跨期对照写成可重复运行的脚本。",
      en: "Use Codex for repeatable market calculations, independent checks, and wave comparisons.",
    },
    {
      zh: "交付跨市场报告、跨期对照和方法 SOP，后续可沿用同一套计算与检查规则。",
      en: "Deliver a cross-market report, wave comparisons, and a guide with reusable calculation and review rules.",
    },
  ],
  "tracking-delivery": [
    {
      zh: "沿着指标、来源和期次追查差异，判断哪些需要更新，哪些历史结果要保留。",
      en: "Trace differences to their measures, sources, and waves. Decide what to update and what history to retain.",
    },
    {
      zh: "将确认的规则写进程序，批量比对文件并同步更新表格、图表和对应文字。",
      en: "Use Codex to compare files and update tables, charts, and report text in batches using agreed rules.",
    },
    {
      zh: "交付同步后的多期数据与报告，把逐份查找和复制改为批量处理与重点复核。",
      en: "Deliver aligned data and reports. Replace file-by-file copying with batch work and targeted review.",
    },
  ],
  "research-platform": [
    {
      zh: "从研究问题出发，定义要比较的品类、指标和资料来源。",
      en: "Define the product categories, measures, and sources needed to answer the research question.",
    },
    {
      zh: "用 Codex 实现 SQLite 数据结构，以及筛选、图表与明细联动。",
      en: "Use Codex to implement the SQLite schema, filters, and linked charts and detail views.",
    },
    {
      zh: "做出支持查询、产品比较和导出的个人原型；资料仍可追溯到来源。",
      en: "Build a personal prototype for queries, product comparisons, and exports, with source records retained.",
    },
  ],
} satisfies Record<string, WorkflowProof>;

export function aiWorkflowProofFor(id: string): WorkflowProof {
  if (!Object.hasOwn(aiWorkflowProofs, id)) throw new RangeError("Unknown AI practice");
  return aiWorkflowProofs[id as keyof typeof aiWorkflowProofs];
}

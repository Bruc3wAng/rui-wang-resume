import type { Localized } from "../content/resume";

export const heroBrief = {
  headline: {
    zh: "多国用户研究与品牌追踪",
    en: "Cross-market research and brand tracking",
  },
  summary: {
    zh: "在益普索服务字节跳动与联想。用定量分析和访谈理解用户行为，用 Codex 把重复计算和核验做成可复用流程。",
    en: "At Ipsos, I serve ByteDance and Lenovo. I combine quantitative analysis with interviews and use Codex to make recurring calculations and checks reusable.",
  },
} satisfies Record<string, Localized>;

export const heroCases = [
  {
    id: "content-tracking",
    title: { zh: "多国内容体验追踪", en: "Content experience tracking" },
    note: {
      zh: "主要负责 · 分析哪些体验与满意度关联更强",
      en: "Led coordination and satisfaction analysis",
    },
  },
  {
    id: "brand-tracking",
    title: { zh: "品牌表现追踪", en: "Brand performance tracking" },
    note: {
      zh: "用 Codex 批量核对多期数据与报告",
      en: "Cross-checked data and reports with Codex",
    },
  },
  {
    id: "us-content",
    title: { zh: "美国内容消费研究", en: "U.S. content consumption study" },
    note: {
      zh: "独立负责 · 比较内容偏好与人群重合",
      en: "Independently studied preferences and audience overlap",
    },
  },
] as const satisfies readonly { id: string; title: Localized; note: Localized }[];

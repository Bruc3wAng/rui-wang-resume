import type { Language, Localized } from "./resume";

export const atlasProjectPath = "/overseas/";

type ProjectStory = {
  id: string;
  action: Localized;
  summary: Localized;
  contribution: Localized;
  preview?: 0 | 1 | 2;
};

// Describe only what visitors can see or use in these public exhibits.
export const personalProjectStories = {
  [atlasProjectPath]: {
    id: "atlas",
    action: { zh: "比较发展指标", en: "Compare development indicators" },
    summary: {
      zh: "用世界银行公开数据比较同一年各国的表现，也可查看长期趋势并导出 CSV。",
      en: "Compare countries in the same year with public World Bank data, explore long-term trends, and export the results as CSV.",
    },
    contribution: {
      zh: "我按国家、指标和年份组织数据，让比较结果能回查来源，并把缺失值和零值分开呈现。",
      en: "I structured the data by country, indicator, and year, kept source references with the results, and made missing values distinct from zero.",
    },
  },
  "/projects/resume/": {
    id: "resume",
    preview: 0,
    action: { zh: "查看双语履历", en: "View the bilingual résumé" },
    summary: {
      zh: "按市场研究、数据分析或研究运营浏览经历，中英文简历均可在线阅读和下载。",
      en: "Browse my experience in market research, analytics, or research operations. Both résumés can be read online or downloaded.",
    },
    contribution: {
      zh: "我设计了职业视角的切换方式，并借助 Codex 把经历和双语 PDF 阅读器整合到同一页。",
      en: "I designed the perspective switcher and used Codex to bring the experience timeline and bilingual PDF reader onto one page.",
    },
  },
  "/projects/photo-workbench/": {
    id: "photo-workbench",
    preview: 1,
    action: { zh: "体验图片调色", en: "Try the photo editor" },
    summary: {
      zh: "为照片试几种光色风格，拖动查看调整前后，不用上传原图。",
      en: "Try different looks and drag to compare before and after, without uploading your photo.",
    },
    contribution: {
      zh: "我设计了风格、亮度和对比度的调节方式，用 Canvas 在浏览器里完成处理和 PNG 导出。",
      en: "I designed the look, brightness, and contrast controls and used Canvas to process and export images in the browser.",
    },
  },
  "/projects/dinner-notes/": {
    id: "dinner-notes",
    preview: 2,
    action: { zh: "试选今晚的餐厅", en: "Pick a place for dinner" },
    summary: {
      zh: "按城区、菜系和双人预算找餐厅，查看点菜建议，选定后保存一张晚餐便签。",
      en: "Find restaurants by area, cuisine, and budget for two, explore menu ideas, and save a note for the evening.",
    },
    contribution: {
      zh: "我设计了餐厅资料字段和预算筛选规则，把找店、收藏和生成晚餐便签接在一起。",
      en: "I designed the restaurant data and budget filters, then connected browsing, shortlisting, and creating a dinner note.",
    },
  },
} satisfies Record<`/${string}/`, ProjectStory>;

export function personalProjectStory(path?: string): ProjectStory | undefined {
  return path && Object.hasOwn(personalProjectStories, path)
    ? personalProjectStories[path as keyof typeof personalProjectStories]
    : undefined;
}

export function personalProjectHref(path: string, language: Language, base: string) {
  const projectBase = path === atlasProjectPath && !base ? "https://bruc3wang.github.io/rui-wang-resume" : base;
  return `${projectBase}${language === "en" ? "/en" : ""}${path}`;
}

export type SocialKind = "profile" | "resume" | "photo-workbench" | "dinner-notes" | "atlas";
export type SocialLanguage = "zh" | "en";
export type SocialCardKey = `${SocialKind}-${SocialLanguage}`;
export type SocialCard = {
  kind: SocialKind;
  language: SocialLanguage;
  route: string;
  title: string;
  description: string;
  heading: string[];
  subtitle: string;
  footer: string;
  alt: string;
};

export const socialCards: Record<SocialCardKey, SocialCard> = {
  "profile-zh": {
    kind: "profile", language: "zh", route: "/",
    title: "王睿 — 市场研究与数据分析",
    description: "王睿，益普索 Research Executive，服务字节跳动与联想。定量研究、多市场分析、消费者洞察、AI研究工作流与研究数据产品。",
    heading: ["研究用户如何选择、", "使用与评价产品。"],
    subtitle: "市场研究 · 用户洞察 · 数据分析",
    footer: "多国研究 · 品牌追踪 · AI 研究工作流",
    alt: "王睿的市场研究与数据分析主页，配有中国视角的地球影像。",
  },
  "profile-en": {
    kind: "profile", language: "en", route: "/en/",
    title: "Rui Wang — Market & User Research",
    description: "Research Executive at Ipsos serving ByteDance and Lenovo. Quantitative research, multi-market insights, AI-assisted workflows, and research-data prototypes.",
    heading: ["How people choose, use,", "and experience products."],
    subtitle: "Market Research · User Insights · Data Analysis",
    footer: "Multi-country research · Brand tracking · AI workflows",
    alt: "Rui Wang’s market and user research portfolio, with an Earth view centered on China.",
  },
  "resume-zh": {
    kind: "resume", language: "zh", route: "/projects/resume/",
    title: "个人履历 — 王睿",
    description: "王睿的研究、分析与研究运营经历，一页中文简历与英文职业档案。",
    heading: ["中英双语", "个人履历"],
    subtitle: "研究经历、分析方法与实际交付。",
    footer: "一页中文简历 · 英文职业档案",
    alt: "王睿的个人履历入口，展示研究经历、中文简历与英文职业档案。",
  },
  "resume-en": {
    kind: "resume", language: "en", route: "/en/projects/resume/",
    title: "Bilingual Résumé — Rui Wang",
    description: "Research, analytics and research-operations experience, with a Chinese résumé and an English profile.",
    heading: ["Bilingual", "Résumé"],
    subtitle: "Research, analytics and delivery.",
    footer: "Chinese résumé · English profile",
    alt: "Rui Wang’s résumé and professional profile, with a typographic résumé illustration.",
  },
  "photo-workbench-zh": {
    kind: "photo-workbench", language: "zh", route: "/projects/photo-workbench/",
    title: "光影工坊 — 王睿",
    description: "浏览器中的色彩与明暗调整、前后对比和图像导出。",
    heading: ["光影工坊"],
    subtitle: "调光调色 · 前后对比 · 图像导出",
    footer: "Photo Workbench · 王睿",
    alt: "光影工坊，配有花瓶与水果静物，展示色彩与明暗调整主题。",
  },
  "photo-workbench-en": {
    kind: "photo-workbench", language: "en", route: "/en/projects/photo-workbench/",
    title: "Photo Workbench — Rui Wang",
    description: "Adjust color and light, compare before and after, and export an image in the browser.",
    heading: ["Photo", "Workbench"],
    subtitle: "Color, light, compare and export.",
    footer: "An image experiment by Rui Wang",
    alt: "Photo Workbench, with a vase-and-fruit still life illustrating color and light.",
  },
  "dinner-notes-zh": {
    kind: "dinner-notes", language: "zh", route: "/projects/dinner-notes/",
    title: "Dinner Notes — 王睿",
    description: "按城区、菜系与双人预算选择餐厅，收藏候选并生成晚餐便签。",
    heading: ["Dinner Notes", "今晚吃什么"],
    subtitle: "按城区、菜系与预算，选一顿晚餐。",
    footer: "北京餐厅 · 双人预算 · 晚餐便签",
    alt: "Dinner Notes 餐厅选择作品，配有米白与酒红色的餐桌图形。",
  },
  "dinner-notes-en": {
    kind: "dinner-notes", language: "en", route: "/en/projects/dinner-notes/",
    title: "Dinner Notes — Rui Wang",
    description: "Choose a restaurant by area, cuisine and budget, save a shortlist and create an evening note.",
    heading: ["Dinner", "Notes"],
    subtitle: "Find a place for the evening.",
    footer: "Beijing · Shortlists · Evening notes",
    alt: "Dinner Notes restaurant project, with an ivory-and-burgundy table setting.",
  },
  "atlas-zh": {
    kind: "atlas", language: "zh", route: "/overseas/",
    title: "全球发展数据查询 — Rui Wang",
    description: "按国家、指标与年份探索世界银行公开数据，查看跨国比较、年度趋势、数据来源并导出 CSV。",
    heading: ["全球发展", "数据查询"],
    subtitle: "国家、指标与年份，多维查看公开数据。",
    footer: "World Bank · World Development Indicators",
    alt: "全球发展数据查询作品，配有地球影像及国家、指标、年份三个查询维度。",
  },
  "atlas-en": {
    kind: "atlas", language: "en", route: "/en/overseas/",
    title: "Global Development Atlas — Rui Wang",
    description: "Explore World Development Indicators across markets, years and sources.",
    heading: ["Global Development", "Atlas"],
    subtitle: "Explore countries, indicators and years.",
    footer: "World Bank · World Development Indicators",
    alt: "Global Development Atlas, with an Earth image and country, indicator and year query dimensions.",
  },
};

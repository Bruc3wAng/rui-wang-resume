export type Language = "zh" | "en";

export type Localized = Record<Language, string>;

export const profile = {
  name: { zh: "王睿", en: "Rui Wang" } satisfies Localized,
  namePair: { zh: "王睿 · Rui Wang", en: "Rui Wang · 王睿" } satisfies Localized,
  role: {
    zh: "Ipsos Research Executive",
    en: "Research Executive at Ipsos",
  } satisfies Localized,
  headline: {
    zh: "用定量研究与数据分析，回答产品、品牌与用户问题。",
    en: "Research and data for product, brand, and audience decisions.",
  } satisfies Localized,
  positioning: {
    zh: "定量研究｜数据分析｜多市场洞察｜AI 研究工作流",
    en: "Quantitative Research | Data Analytics | Multi-market Insights | AI Research Workflows",
  } satisfies Localized,
  summary: {
    zh: "现任 Ipsos Research Executive，以定量研究为主、定性为辅，服务字节跳动、联想等核心客户。工作覆盖海外用户研究、品牌 Tracking、人群洞察与产品体验，能够从研究设计、多市场执行、分析诊断到交付审核推进完整研究链路，并将研究标准沉淀为已用于正式项目的人机协作工作流。",
    en: "Research Executive at Ipsos, primarily focused on quantitative research with complementary qualitative experience. I support core clients including ByteDance and Lenovo across international user research, brand tracking, audience insights, and product experience—spanning research design, multi-market execution, analytical diagnosis, and delivery review. I also turn research standards into reusable human–AI workflows used in live projects.",
  } satisfies Localized,
  location: { zh: "北京，中国", en: "Beijing, China" } satisfies Localized,
  email: "w274398243@hotmail.com",
  phone: {
    display: "+86 137 1880 1573",
    href: "+8613718801573",
  },
};

export const projects = [
  {
    index: "01",
    type: {
      zh: "个人网站 · 交互作品",
      en: "Personal site · Interactive work",
    } satisfies Localized,
    title: {
      zh: "Rui Wang Research Portfolio",
      en: "Rui Wang Research Portfolio",
    } satisfies Localized,
    summary: {
      zh: "将简历、研究案例与人机协作方法整合为一套中英双语个人作品系统，而不是把纸质简历简单搬到网页上。",
      en: "A bilingual portfolio system that brings together my résumé, research cases, and human–AI method instead of simply moving a paper CV onto the web.",
    } satisfies Localized,
    problem: {
      zh: "如何让招聘方快速理解我的研究能力，同时看到我对产品、信息结构与交互体验的判断。",
      en: "Help recruiters understand my research capability quickly while making my product, information-architecture, and interaction judgment visible.",
    } satisfies Localized,
    contribution: {
      zh: "独立完成内容架构、双语表达、视觉系统、交互设计、前端实现与持续发布。",
      en: "Independently shaped the content architecture, bilingual narrative, visual system, interaction design, front-end implementation, and ongoing release process.",
    } satisfies Localized,
    outcome: {
      zh: "形成可持续更新、可按岗位扩展、兼顾桌面与移动端体验的个人主页。",
      en: "Created a professional portfolio that is continuously maintainable, adaptable by role, and designed for both desktop and mobile.",
    } satisfies Localized,
    tags: ["Next.js", "TypeScript", "Bilingual UX", "GitHub Pages"],
    liveUrl: "https://bruc3wang.github.io/rui-wang-resume/",
    sourceUrl: "https://github.com/Bruc3wAng/rui-wang-resume",
  },
];

export const experiences = [
  {
    period: { zh: "2026.03 — 至今", en: "Mar 2026 — Present" } satisfies Localized,
    company: { zh: "益普索 Ipsos", en: "Ipsos" } satisfies Localized,
    title: {
      zh: "Research Executive（数据研究分析）",
      en: "Research Executive",
    } satisfies Localized,
    meta: { zh: "北京 · 驻场", en: "Beijing, China · On-site" } satisfies Localized,
    summary: {
      zh: "服务字节跳动、联想等核心客户，主责海外搜索体验与美国内容消费研究的关键工作流，并深度参与品牌 Tracking、AI 产品海外用研、用户画像及欧洲实地研究。",
      en: "Partner with core clients including ByteDance and Lenovo, leading key workstreams in international search experience and U.S. content-consumption research while contributing deeply to brand tracking, overseas AI product research, audience profiling, and European field studies.",
    } satisfies Localized,
    bullets: [
      {
        label: { zh: "研究问题建模", en: "Research framing" },
        text: {
          zh: "将开放性业务问题拆解为研究假设、指标体系、测量设计与可执行方案，明确研究边界与决策路径。",
          en: "Translate open-ended business questions into research hypotheses, measurement frameworks, study designs, and decision-ready plans.",
        },
      },
      {
        label: { zh: "多市场项目统筹", en: "Multi-market leadership" },
        text: {
          zh: "统筹问卷与测量、抽样与配额、跨市场执行、数据分析及汇报交付，协调客户、供应商与内部团队的关键口径与风险。",
          en: "Coordinate survey design, sampling and quotas, multi-market execution, analysis, and reporting while aligning clients, vendors, and internal teams on definitions and risk.",
        },
      },
      {
        label: { zh: "分析与质量治理", en: "Analytics & governance" },
        text: {
          zh: "围绕人群分层、跨市场比较、趋势判断与差异诊断设计分析路径，并建立贯穿研究设计至最终输出的质量治理机制。",
          en: "Design analytical approaches for segmentation, cross-market comparison, trend interpretation, and difference diagnosis, supported by end-to-end quality governance.",
        },
      },
      {
        label: { zh: "AI 方法资产化", en: "AI method development" },
        text: {
          zh: "将研究标准、校验规则与异常处理沉淀为 Codex Skills、SOP 与辅助工具，覆盖 4 个核心研究阶段和 7 类关键节点，已用于正式交付并被同事复用。",
          en: "Operationalize research standards, validation rules, and exception handling through Codex Skills, SOPs, and supporting tools spanning four research stages and seven workflow-node types; adopted in live delivery and by colleagues.",
        },
      },
    ],
  },
  {
    period: { zh: "2024.05 — 2024.08", en: "May 2024 — Aug 2024" } satisfies Localized,
    company: { zh: "久谦咨询", en: "Meritco Services" } satisfies Localized,
    title: {
      zh: "数据分析师（项目制 / 实习）",
      en: "Data Analyst Intern",
    } satisfies Localized,
    meta: { zh: "北京", en: "Beijing, China" } satisfies Localized,
    summary: {
      zh: "整合交易、SKU、用户与竞争证据，支持消费健康与宠物营养领域的产品机会评估、新品定位与 Go-to-Market 规划。",
      en: "Integrated transaction, SKU, user, and competitive evidence to support product opportunity assessment, new-product positioning, and go-to-market planning in consumer health and pet nutrition.",
    } satisfies Localized,
    bullets: [],
  },
];

export const cases = [
  {
    index: "01",
    title: {
      zh: "多市场品牌追踪与差异诊断",
      en: "Multi-market Brand Tracking & Difference Diagnosis",
    } satisfies Localized,
    scope: { zh: "定量研究 · 7 个海外市场", en: "Quantitative · Seven markets" } satisfies Localized,
    role: {
      zh: "深度参与 · 多市场分析与质量治理",
      en: "Deep involvement · Multi-market analysis and quality governance",
    } satisfies Localized,
    problem: {
      zh: "在多市场、多层级口径并存的条件下，识别趋势与差异背后的真实信号，并保证汇总结论能够被复核。",
      en: "Separate genuine signals from definition and aggregation effects across markets while keeping consolidated conclusions reviewable.",
    } satisfies Localized,
    approach: {
      zh: "围绕人群分层、跨市场比较与异常诊断设计分析路径，建立市场级与汇总口径的交叉验证机制。",
      en: "Designed segmentation, cross-market comparison, and anomaly-diagnosis paths with cross-validation between market-level and consolidated definitions.",
    } satisfies Localized,
    value: {
      zh: "将复杂数据转化为可解释的品牌、人群与产品判断，并把质量检查从末端动作前置为分析机制。",
      en: "Translated complex data into explainable brand, audience, and product decisions while moving quality control upstream into the analytical design.",
    } satisfies Localized,
  },
  {
    index: "02",
    title: {
      zh: "国际搜索体验与用户心智研究",
      en: "International Search Experience & User Mindset",
    } satisfies Localized,
    scope: { zh: "定量主导 · 产品与用户研究", en: "Quantitative-led · Product & user research" } satisfies Localized,
    role: {
      zh: "主要负责 · 项目统筹、执行与数据交付",
      en: "Primary ownership · Coordination, execution, and data delivery",
    } satisfies Localized,
    problem: {
      zh: "理解不同使用情境下的搜索需求、认知与行为路径，为产品体验与策略优先级提供证据。",
      en: "Understand search needs, perceptions, and behavior paths across use contexts to inform product experience and strategic priorities.",
    } satisfies Localized,
    approach: {
      zh: "从研究假设、任务与测量设计出发，统筹执行、数据验证与分析解释，连接用户行为和产品决策。",
      en: "Connected hypotheses, task and measurement design, field execution, validation, and interpretation to bridge user behavior and product decisions.",
    } satisfies Localized,
    value: {
      zh: "把分散的体验反馈组织为结构化的用户心智与机会框架，使洞察能够进入后续决策。",
      en: "Organized fragmented experience signals into a structured mindset and opportunity framework that could travel into decision-making.",
    } satisfies Localized,
  },
  {
    index: "03",
    title: {
      zh: "美国内容消费与人群洞察",
      en: "U.S. Content Consumption & Audience Insights",
    } satisfies Localized,
    scope: { zh: "定量研究 · 内容与人群策略", en: "Quantitative · Content & audience strategy" } satisfies Localized,
    role: {
      zh: "主要负责 · 研究执行、分析框架与交付协调",
      en: "Primary ownership · Execution, analytical framing, and delivery",
    } satisfies Localized,
    problem: {
      zh: "在内容类型、用户特征与消费行为之间建立可解释的联系，识别关键人群及其需求差异。",
      en: "Build explainable links among content genres, audience characteristics, and consumption behavior to identify priority segments and unmet needs.",
    } satisfies Localized,
    approach: {
      zh: "设计人群分层与交叉分析框架，结合行为、偏好和使用情境识别差异，并对关键结论进行一致性验证。",
      en: "Designed segmentation and cross-analysis frameworks across behavior, preference, and context, with consistency checks around decision-critical findings.",
    } satisfies Localized,
    value: {
      zh: "将数据结果转译为内容定位、目标人群与增长机会判断，而非停留在描述性统计。",
      en: "Moved beyond descriptive statistics to inform content positioning, priority audiences, and opportunity assessment.",
    } satisfies Localized,
  },
  {
    index: "04",
    title: {
      zh: "AI 产品海外用研与欧洲实地研究",
      en: "Overseas AI Product Research & European Fieldwork",
    } satisfies Localized,
    scope: { zh: "混合研究 · 跨文化执行", en: "Mixed methods · Cross-cultural execution" } satisfies Localized,
    role: {
      zh: "深度参与 · 定量 / 定性研究与跨文化执行",
      en: "Deep involvement · Mixed-method and cross-cultural execution",
    } satisfies Localized,
    problem: {
      zh: "在语言、文化与使用环境差异下理解产品认知、真实使用体验与潜在进入障碍。",
      en: "Understand product perceptions, lived usage experience, and adoption barriers across language, culture, and context.",
    } satisfies Localized,
    approach: {
      zh: "结合定量测量与定性观察，协调多方执行并统一口径，重点保留不同市场语境中的真实差异。",
      en: "Combined quantitative measurement with qualitative observation, coordinating execution while preserving meaningful contextual differences.",
    } satisfies Localized,
    value: {
      zh: "在保证跨市场可比性的同时避免过度标准化，为产品本地化与用户体验优化提供更具情境的证据。",
      en: "Balanced comparability with contextual nuance to support localization and product-experience decisions.",
    } satisfies Localized,
  },
];

export const workflow = [
  {
    number: "01",
    title: { zh: "研究设计", en: "Research Design" } satisfies Localized,
    human: {
      zh: "定义业务问题、研究边界、指标口径与例外",
      en: "Define the business question, scope, metrics, and exceptions",
    } satisfies Localized,
    ai: {
      zh: "辅助框架展开、逻辑扫描与规范调用",
      en: "Support framework expansion, logic scans, and standard retrieval",
    } satisfies Localized,
  },
  {
    number: "02",
    title: { zh: "执行验证", en: "Execution Validation" } satisfies Localized,
    human: {
      zh: "判断现场影响、协调资源并处理非标准情境",
      en: "Judge field impact, coordinate resources, and resolve non-standard cases",
    } satisfies Localized,
    ai: {
      zh: "批量读取、规则比对与异常定位",
      en: "Batch-read materials, compare rules, and surface anomalies",
    } satisfies Localized,
  },
  {
    number: "03",
    title: { zh: "数据质量", en: "Data Quality" } satisfies Localized,
    human: {
      zh: "解释异常的业务意义，决定修正、豁免或披露",
      en: "Interpret business impact and decide correction, exception, or disclosure",
    } satisfies Localized,
    ai: {
      zh: "执行计算、交叉验证、追溯与结构化留痕",
      en: "Run calculations, cross-validation, traceability, and structured logs",
    } satisfies Localized,
  },
  {
    number: "04",
    title: { zh: "交付审核", en: "Delivery Review" } satisfies Localized,
    human: {
      zh: "形成洞察、吸收客户反馈并批准最终输出",
      en: "Shape the insight, incorporate client feedback, and approve final delivery",
    } satisfies Localized,
    ai: {
      zh: "检查表格、叙事、口径与版本一致性",
      en: "Check table, narrative, definition, and version consistency",
    } satisfies Localized,
  },
];

export const capabilities = [
  {
    title: { zh: "研究与洞察", en: "Research & Insights" } satisfies Localized,
    items: {
      zh: "定量研究、定性研究、多市场研究、问卷与测量、抽样与配额、品牌 Tracking、用户画像",
      en: "Quantitative Research, Qualitative Research, Multi-market Research, Survey & Measurement Design, Sampling & Quotas, Brand Tracking, Audience Profiling",
    } satisfies Localized,
  },
  {
    title: { zh: "分析与决策", en: "Analytics & Decisions" } satisfies Localized,
    items: {
      zh: "指标体系、人群分层、交叉分析、趋势与差异诊断、数据质量治理、洞察提炼",
      en: "Measurement Frameworks, Segmentation, Cross-tab Analysis, Trend & Difference Diagnosis, Data Quality Governance, Insight Synthesis",
    } satisfies Localized,
  },
  {
    title: { zh: "研究运营", en: "Research Operations" } satisfies Localized,
    items: {
      zh: "多市场项目管理、客户沟通、跨团队与供应商协作、风险管理、研究交付",
      en: "Multi-market Project Management, Client Communication, Cross-functional & Vendor Collaboration, Risk Management, Research Delivery",
    } satisfies Localized,
  },
  {
    title: { zh: "数据与 AI", en: "Data & AI" } satisfies Localized,
    items: {
      zh: "Excel、SQL、R、Tableau、Codex、Prompt Engineering、AI Workflow Automation、Python / JavaScript 工作流设计与验证",
      en: "Excel, SQL, R, Tableau, Codex, Prompt Engineering, AI Workflow Automation, Python / JavaScript Workflow Design & Validation",
    } satisfies Localized,
  },
];

export const education = {
  period: "2021.09 — 2025.06",
  institution: { zh: "多伦多大学", en: "University of Toronto" } satisfies Localized,
  degree: {
    zh: "荣誉理学学士（BSc, Honours）",
    en: "Bachelor of Science (BSc), Honours",
  } satisfies Localized,
  focus: {
    zh: "统计学、经济学双专业｜计算机科学辅修",
    en: "Statistics and Economics Majors | Computer Science Minor",
  } satisfies Localized,
  coursework: {
    zh: "调查与抽样、概率与统计数据分析、计量经济学、数据分析方法",
    en: "Survey Sampling, Probability and Statistical Data Analysis, Econometrics, Data Analysis Methods",
  } satisfies Localized,
};

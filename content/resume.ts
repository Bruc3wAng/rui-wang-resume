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
    zh: "我在益普索从事定量研究，服务字节跳动与联想。工作覆盖多市场品牌追踪、海外用户研究与产品体验；同时搭建用于正式交付的 AI 研究工具，并将研究经验延伸至数据库设计与数据产品原型开发。",
    en: "I am a Research Executive at Ipsos, serving ByteDance and Lenovo across multi-market brand tracking, international user research, and product experience. Alongside quantitative research, I build AI-assisted tools used in live delivery and develop research databases and data-product prototypes.",
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
    visual: "database",
    type: {
      zh: "个人研究产品原型",
      en: "Personal research-product prototype",
    } satisfies Localized,
    title: {
      zh: "市场研究全链路模型与数据平台",
      en: "Market Research Model & Data Platform",
    } satisfies Localized,
    summary: {
      zh: "以消费品研究为场景，把分散的市场与商品资料组织成可查询、可比较的研究数据库，并实现网页交互。",
      en: "A consumer-goods research prototype that organizes scattered market and product information into a queryable research database with an interactive web interface.",
    } satisfies Localized,
    problem: {
      zh: "不同来源的品类、时间和指标定义不一致，资料很难直接用于研究比较。",
      en: "Category, time, and metric definitions differ across sources, making research comparisons difficult.",
    } satisfies Localized,
    contribution: {
      zh: "设计 SQLite 数据结构，统一品类、渠道、商品与时间维度，建立来源追溯和指标校验规则；借助 Codex 完成数据库与网页原型。",
      en: "Designed a SQLite data structure with consistent category, channel, product, and time dimensions, source traceability, and metric validation. Used Codex to build the database and web prototype.",
    } satisfies Localized,
    outcome: {
      zh: "实现多维筛选、图表与明细联动及结果导出；围绕品类比较、价格规格分析等需求，形成数据要求、验收标准和产品可行性评估方案。",
      en: "Implemented multi-dimensional filters, linked charts and detail views, and result exports. Defined data requirements, acceptance criteria, and feasibility plans for category comparisons and price-pack analysis.",
    } satisfies Localized,
    tags: ["SQLite", "Data Modelling", "Research Design", "Codex"],
  },
  {
    index: "02",
    visual: "photo",
    type: {
      zh: "个人产品案例 · 影像工作流",
      en: "Personal product case · Image workflow",
    } satisfies Localized,
    title: {
      zh: "光影工坊 / Photo Workbench",
      en: "Photo Workbench / 光影工坊",
    } satisfies Localized,
    summary: {
      zh: "围绕照片筛选、精修、版本比较与拼图输出，设计一套本地优先的影像工作台，将可逆调色与生成式编辑纳入同一验收流程。",
      en: "A local-first image workspace for selection, retouching, version comparison, and collage output, bringing reversible grading and generative editing into one review flow.",
    } satisfies Localized,
    problem: {
      zh: "照片处理工具彼此割裂，版本比较、身份一致性与最终验收缺少统一工作区。",
      en: "Photo tools are fragmented, leaving version comparison, identity consistency, and final review without a shared workspace.",
    } satisfies Localized,
    contribution: {
      zh: "定义处理模块、版本结构与分轮验收机制，完成桌面、平板和手机端工作台及多方案对比交互。",
      en: "Defined the processing modules, version structure, and staged review system, then built responsive workspaces and multi-option comparison flows.",
    } satisfies Localized,
    outcome: {
      zh: "已形成照片选择、风格对比、版本记录与拼图输出的交互原型。",
      en: "Built an interactive prototype for photo selection, style comparison, version history, and collage output.",
    } satisfies Localized,
    tags: ["Next.js", "AI Image Workflow", "Local-first", "Responsive UX"],
  },
  {
    index: "03",
    visual: "dining",
    type: {
      zh: "个人产品案例 · 决策工具",
      en: "Personal product case · Decision tool",
    } satisfies Localized,
    title: {
      zh: "Dinner Notes / 今晚吃什么",
      en: "Dinner Notes / 今晚吃什么",
    } satisfies Localized,
    summary: {
      zh: "把餐厅选择、在家做饭与饭后安排组织成一套轻量决策系统，让距离、口味、预算与近期记录共同参与推荐。",
      en: "A lightweight decision system that connects restaurant choice, home cooking, and after-dinner plans through distance, taste, budget, and recent history.",
    } satisfies Localized,
    problem: {
      zh: "日常选择容易被信息过载和重复讨论拖慢，偏好、收藏与近期体验也难以持续积累。",
      en: "Everyday choices slow down under information overload, while preferences, saved places, and recent experiences remain scattered.",
    } satisfies Localized,
    contribution: {
      zh: "设计餐厅数据结构、筛选规则、偏好权重与本地记录逻辑，并完成移动端优先的推荐和收藏交互。",
      en: "Designed the restaurant schema, filtering rules, preference weighting, and local history logic, then built a mobile-first recommendation and saving experience.",
    } satisfies Localized,
    outcome: {
      zh: "已形成餐厅筛选、偏好记录、菜谱和饭后安排的本地交互原型。",
      en: "Built a local interactive prototype for restaurant filtering, preference history, recipes, and after-dinner plans.",
    } satisfies Localized,
    tags: ["JavaScript", "Decision Rules", "Local Storage", "Mobile UX"],
  },
  {
    index: "04",
    visual: "portfolio",
    type: {
      zh: "个人网站 · 交互作品",
      en: "Personal site · Interactive work",
    } satisfies Localized,
    title: {
      zh: "Rui Wang Research Portfolio",
      en: "Rui Wang Research Portfolio",
    } satisfies Localized,
    summary: {
      zh: "将工作经历、研究案例与人机协作方法整合为一套中英双语职业主页。",
      en: "A bilingual professional site bringing together work experience, research cases, and a human–AI research method.",
    } satisfies Localized,
    problem: {
      zh: "让招聘方快速理解研究能力，同时看到我对信息结构、产品表达与交互体验的判断。",
      en: "Help recruiters understand my research capability quickly while making my information-architecture, product, and interaction judgment visible.",
    } satisfies Localized,
    contribution: {
      zh: "负责内容架构、双语表达、视觉与交互设计，借助 Codex 完成前端实现、测试和持续更新。",
      en: "Shaped the content architecture, bilingual copy, visual design, and interactions, using Codex for front-end implementation, testing, and ongoing updates.",
    } satisfies Localized,
    outcome: {
      zh: "形成可持续更新、可按岗位扩展并兼顾桌面与移动端体验的个人主页。",
      en: "Created a maintainable portfolio that can adapt by role and works across desktop and mobile.",
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
      zh: "Research Executive（定量研究）",
      en: "Research Executive",
    } satisfies Localized,
    meta: { zh: "北京 · 现场办公", en: "Beijing, China · On-site" } satisfies Localized,
    summary: {
      zh: "负责两项海外研究的核心环节，协调客户、供应商与内部团队推进研究设计、执行和交付；深度参与多市场品牌追踪、AI 产品海外用研、企业用户画像及海外实地研究。",
      en: "Own core workstreams across two international studies, coordinating clients, vendors, and internal teams through design, fieldwork, and delivery. Contribute substantially to multi-market brand tracking, international AI product research, business-user profiling, and overseas field studies.",
    } satisfies Localized,
    bullets: [
      {
        label: { zh: "研究设计与洞察", en: "Research design & insights" },
        text: {
          zh: "将品牌认知、用户需求和产品体验问题转化为研究方案；结合定量数据、定性资料和案头研究，识别用户群体间的需求差异。",
          en: "Turn questions about brand perceptions, user needs, and product experience into research designs. Combine quantitative data, qualitative findings, and desk research to identify differences between audience groups.",
        },
      },
      {
        label: { zh: "跨团队项目推进", en: "Research coordination" },
        text: {
          zh: "协调研究设计、执行与交付中的衔接问题，明确各方任务和判断标准，推动研究口径分歧、样本与数据问题得到解决。",
          en: "Coordinate the handoffs between study design, execution, and delivery. Clarify responsibilities and research definitions, and work with teams to resolve sampling and data issues.",
        },
      },
      {
        label: { zh: "多市场数据分析", en: "Cross-market analysis" },
        text: {
          zh: "参与覆盖美、英、德、日、韩、印尼及巴西 7 个海外市场的追踪研究，开展用户分层、交叉分析和趋势比较，复核市场结果与整体汇总。",
          en: "Analyze a tracking program across seven markets: the US, UK, Germany, Japan, South Korea, Indonesia, and Brazil. Use segmentation, cross-tab analysis, and trend comparison, reconciling market-level and consolidated results.",
        },
      },
      {
        label: { zh: "AI 研究工作流", en: "AI-assisted research workflows" },
        text: {
          zh: "将研究校验规则做成可复用工具和 Skills 库，明确自动处理范围、例外判断与验收要求。工具已用于正式交付，并被同事采用。",
          en: "Build reusable tools and a Skills library from research validation rules, defining the scope of automation, exception handling, and acceptance criteria. The tools are used in live delivery and have been adopted by colleagues.",
        },
      },
    ],
  },
  {
    period: { zh: "2024.05 — 2024.08", en: "May 2024 — Aug 2024" } satisfies Localized,
    company: { zh: "久谦咨询", en: "Meritco Services" } satisfies Localized,
    title: {
      zh: "数据分析实习生",
      en: "Data Analyst Intern",
    } satisfies Localized,
    meta: { zh: "北京", en: "Beijing, China" } satisfies Localized,
    summary: {
      zh: "整合行业资料、竞品、电商数据和用户反馈，比较价格带、SKU 组合、产品卖点与渠道表现；输出分析表和项目备忘录，支持新品定位与产品升级讨论。",
      en: "Integrated industry research, competitor evidence, e-commerce data, and user feedback to compare price bands, SKU portfolios, product claims, and channel performance. Produced analysis tables and project memos to support positioning and product-upgrade discussions.",
    } satisfies Localized,
    bullets: [],
  },
];

export const cases = [
  {
    index: "01",
    title: {
      zh: "多市场品牌追踪与比较",
      en: "Multi-market Brand Tracking & Comparison",
    } satisfies Localized,
    scope: { zh: "定量研究 · 7 个海外市场", en: "Quantitative · Seven markets" } satisfies Localized,
    role: {
      zh: "深度参与 · 多市场分析与结果复核",
      en: "Substantial contribution · Cross-market analysis and review",
    } satisfies Localized,
    problem: {
      zh: "不同市场的品牌表现为什么不同？变化来自用户差异，还是指标定义和统计方式？",
      en: "Why does brand performance differ across markets? Do changes reflect audience differences or the way metrics are defined and calculated?",
    } satisfies Localized,
    approach: {
      zh: "按人群和市场拆分结果，进行交叉分析和趋势比较；核对指标定义，并将逐市场结果与整体汇总相互复核。",
      en: "Break down results by audience and market, compare trends and cross-tabs, check metric definitions, and reconcile each market with the consolidated view.",
    } satisfies Localized,
    value: {
      zh: "使品牌和用户差异建立在一致的比较标准上，减少口径问题对研究判断的干扰。",
      en: "Provide a consistent basis for interpreting brand and audience differences, reducing the influence of mismatched definitions.",
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
      zh: "将使用情境转化为研究任务与问卷，协调执行，并结合行为反馈与问卷结果分析需求和体验差异。",
      en: "Translate use contexts into research tasks and survey questions, coordinate fieldwork, and combine behavioral feedback with survey results to examine needs and experience differences.",
    } satisfies Localized,
    value: {
      zh: "把分散的反馈整理为可比较的使用需求和体验问题，为后续产品讨论提供依据。",
      en: "Organize fragmented feedback into comparable needs and experience issues that inform subsequent product discussions.",
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
      zh: "呈现不同人群的内容偏好与消费差异，为目标人群选择和内容定位提供研究依据。",
      en: "Explain differences in content preferences and consumption across audience groups to inform audience selection and content positioning.",
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
      zh: "整理研究资料、检查问卷逻辑并调用已有规则",
      en: "Organize research material, check survey logic, and apply existing rules",
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
      zh: "重新计算指标、比对结果并记录问题位置与依据",
      en: "Recalculate metrics, compare results, and record issues with their supporting evidence",
    } satisfies Localized,
  },
  {
    number: "04",
    title: { zh: "交付审核", en: "Delivery Review" } satisfies Localized,
    human: {
      zh: "提炼研究发现、回应客户反馈并复核最终结果",
      en: "Develop findings, address client feedback, and review final outputs",
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
      zh: "定量研究、定性研究、研究设计、品牌追踪、用户研究、消费者洞察",
      en: "Quantitative Research, Qualitative Research, Research Design, Brand Tracking, User Research, Consumer Insights",
    } satisfies Localized,
  },
  {
    title: { zh: "分析与决策", en: "Analytics & Decisions" } satisfies Localized,
    items: {
      zh: "Excel、SQL、R、Tableau；用户分层、交叉分析、趋势比较、跨市场分析",
      en: "Excel, SQL, R, Tableau; Audience Segmentation, Cross-tab Analysis, Trend Comparison, Cross-market Analysis",
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
    title: { zh: "数据库与数据产品", en: "Databases & Data Products" } satisfies Localized,
    items: {
      zh: "SQLite 数据结构设计、指标定义与来源追溯、多维查询、交互原型、数据需求与验收标准",
      en: "SQLite Data Modelling, Metric Definitions, Source Traceability, Multi-dimensional Queries, Interactive Prototyping, Data Requirements",
    } satisfies Localized,
  },
  {
    title: { zh: "AI 研究工作流", en: "AI Research Workflows" } satisfies Localized,
    items: {
      zh: "Codex、可复用 Skills 库、研究规则配置、工作流设计、异常判断与结果验证",
      en: "Codex, Reusable Skills Libraries, Research Rule Configuration, Workflow Design, Exception Handling, Output Validation",
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

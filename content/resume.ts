export type Language = "zh" | "en";

export type Localized = Record<Language, string>;

export const profile = {
  name: { zh: "王睿", en: "Rui Wang" } satisfies Localized,
  namePair: { zh: "王睿", en: "Rui Wang" } satisfies Localized,
  role: {
    zh: "Ipsos Research Executive",
    en: "Research Executive at Ipsos",
  } satisfies Localized,
  headline: {
    zh: "跨市场研究，理解用户与产品。",
    en: "Cross-market research. Understanding people and products.",
  } satisfies Localized,
  positioning: {
    zh: "定量研究｜数据分析｜多市场洞察｜AI 研究工作流",
    en: "Quantitative Research | Data Analytics | Multi-market Insights | AI Research Workflows",
  } satisfies Localized,
  summary: {
    "zh": "益普索 Research Executive，服务字节跳动与联想，具备多国研究经验。主要负责大型内容生态追踪，开展用户分层、满意度因素及趋势分析；设计可复用的 AI 研究工作流，并开发研究数据库与交互原型。",
    "en": "Research Executive at Ipsos, serving ByteDance and Lenovo, with multi-country research experience. Lead delivery of a large-scale content-experience tracker, combining audience segmentation, satisfaction analysis, and trend comparisons. Design reusable AI research workflows and develop research databases and interactive prototypes."
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
      zh: "研究数据平台",
      en: "Research Data Platform",
    } satisfies Localized,
    summary: {
      zh: "围绕品类、价格与规格研究，将数据需求转化为可查询的研究数据库和网页原型。",
      en: "A research database and web prototype for exploring consumer-goods categories, prices, and product specifications.",
    } satisfies Localized,
    problem: {
      zh: "不同来源的品类、时间和指标定义不一致，资料很难直接用于研究比较。",
      en: "Category, time, and metric definitions differ across sources, making research comparisons difficult.",
    } satisfies Localized,
    contribution: {
      zh: "定义研究所需的数据和比较标准，设计 SQLite 数据库及来源追溯规则；完成网页功能设计，使用 Codex 实现查询与比较交互。",
      en: "Defined research data requirements and comparison criteria, designed a SQLite database with source traceability, and specified the web interface. Used Codex to implement the query and comparison interactions.",
    } satisfies Localized,
    outcome: {
      zh: "原型支持多维筛选、商品比较、图表与明细联动及导出；结合数据来源与研究用途，形成数据采购和产品可行性评估方案。",
      en: "The prototype supports filters, product comparisons, linked charts and detail views, and exports. Assessed data sources and research use cases to develop data-procurement and product-feasibility plans.",
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
    "period": {
      "zh": "2026.03 - 至今",
      "en": "Mar 2026 - Present"
    },
    "company": {
      "zh": "益普索 Ipsos",
      "en": "Ipsos"
    },
    "title": {
      "zh": "Research Executive",
      "en": "Research Executive"
    },
    "meta": {
      "zh": "北京 · 现场办公",
      "en": "Beijing, China · On-site"
    },
    "summary": {
      "zh": "服务字节跳动与联想，定量研究为主，定性研究为辅。具备多国追踪与专项研究经验，研究主题涵盖内容体验、搜索行为、品牌表现与产品需求。",
      "en": "Serve ByteDance and Lenovo through quantitative-led research with qualitative support. Multi-country tracking and focused studies span content experience, search behavior, brand performance, and product needs."
    },
    "bullets": [
      {
        "label": {
          "zh": "多国内容生态追踪",
          "en": "Multi-country content tracking"
        },
        "text": {
          "zh": "主要负责覆盖7国的内容生态与满意度追踪研究，统筹跨国执行、样本管理及分析交付；协调研究与数据团队，统一跨平台用户分组及加权口径，确保市场和平台间的比较标准一致。",
          "en": "Lead execution and analytical delivery for a seven-country content-experience and satisfaction tracker. Coordinate international fieldwork, sampling, and research and data teams, aligning audience definitions and weighting for consistent comparisons across markets and platforms."
        }
      },
      {
        "label": {
          "zh": "满意度与关键因素分析",
          "en": "Satisfaction and relative importance"
        },
        "text": {
          "zh": "完成满意度相对权重分析、相关分析与跨期比较，评估关键体验因素；核验不同方法的排名差异及样本、加权口径，形成跨市场分析报告与后续研究建议。",
          "en": "Conduct relative weight and correlation analyses to assess key aspects of user experience, alongside wave-on-wave comparisons. Review ranking differences across methods, sample definitions, and weighting, and produce a cross-market report with findings and recommendations for further research."
        }
      },
      {
        "label": {
          "zh": "搜索心智与行为研究",
          "en": "Search awareness and behavior"
        },
        "text": {
          "zh": "深度参与7国搜索心智追踪，通过用户分层、交叉分析与趋势比较，研究平台认知、搜索场景和使用习惯，识别不同市场与人群的搜索行为差异。",
          "en": "Conduct audience segmentation, cross-tabulation, and trend analysis as a key contributor to a separate seven-country search-awareness tracker, examining how platform awareness, search contexts, and usage habits vary by market and user group."
        }
      },
      {
        "label": {
          "zh": "美国搜索与内容研究",
          "en": "U.S. search and content research"
        },
        "text": {
          "zh": "主要负责美国搜索体验与内容消费研究，结合搜索任务与问卷分析用户体验；比较短剧及网文用户的内容偏好、消费习惯与人群重合，支持目标用户和内容定位判断。",
          "en": "Lead core workstreams in U.S. search-experience and content-consumption studies. Use search tasks and surveys to assess user experience, and compare short-form drama and web-fiction audiences by preferences, habits, and overlap to inform audience and content positioning."
        }
      },
      {
        "label": {
          "zh": "品牌与产品研究",
          "en": "Brand and product research"
        },
        "text": {
          "zh": "深度参与品牌健康度追踪、中小企业用户画像、AI 创作产品海外用研与德国实地研究，结合案头资料及定量、定性研究，分析品牌表现、购买需求和产品使用体验。",
          "en": "Contribute to brand-health tracking, small-business user profiling, overseas research on AI creative tools, and German field research. Combine desk research with quantitative and qualitative findings to examine brand performance, purchasing needs, and product experience."
        }
      },
      {
        "label": {
          "zh": "AI 研究工作流",
          "en": "AI research workflows"
        },
        "text": {
          "zh": "设计问卷验证、数据分析与交付复核工作流，使用 Codex 开发可复用工具与技能库；编写操作手册、开展团队分享，工具已用于正式交付并被同事采用。",
          "en": "Design AI workflows for questionnaire validation, data analysis, and delivery checks, developing reusable tools and a skills library with Codex. Document the workflows and share them with the team; the tools are used in live project delivery and have been adopted by colleagues."
        }
      }
    ]
  },
  {
    "period": {
      "zh": "2024.05 - 2024.08",
      "en": "May 2024 - Aug 2024"
    },
    "company": {
      "zh": "久谦咨询",
      "en": "Meritco Services"
    },
    "title": {
      "zh": "数据分析实习生",
      "en": "Data Analyst Intern"
    },
    "meta": {
      "zh": "北京",
      "en": "Beijing, China"
    },
    "summary": {
      "zh": "参与健康产品升级与宠物食品新品孵化研究，结合电商、竞品与用户资料，支持产品组合、新品定位及上市准备。",
      "en": "Supported health product upgrades and pet-food product development, combining e-commerce, competitor, and user research to inform product mix, positioning, and launch preparation."
    },
    "bullets": [
      {
        "label": { "zh": "健康产品升级", "en": "Health product upgrades" },
        "text": {
          "zh": "整合电商交易、竞品与用户研究资料，形成产品规格、组合及价格带的对比分析；结合购买需求分析产品卖点，为产品组合优化和升级方向提供依据。",
          "en": "Combined e-commerce transaction data with competitor and user research to produce comparisons across pack sizes, bundles, and price tiers. Assessed product benefits against purchasing needs to inform product mix and upgrade recommendations."
        }
      },
      {
        "label": { "zh": "宠物食品新品孵化", "en": "Pet food product development" },
        "text": {
          "zh": "研究头部品牌的产品布局、主力单品与渠道策略，结合行业访谈形成竞争格局和典型品牌案例分析，提炼差异化卖点，为新品定位与上市准备提供依据。",
          "en": "Produced competitive landscape and brand case analyses for pet-food product development, comparing leading brands' portfolios, flagship products, and channel strategies. Drew on industry interviews to identify differentiating product benefits and inform positioning and launch preparation."
        }
      }
    ]
  }
];

export const cases = [
  {
    "index": "01",
    "visual": "markets",
    "markets": [
      "US",
      "UK",
      "DE",
      "JP",
      "ID",
      "BR",
      "SA"
    ],
    "title": {
      "zh": "七国内容生态与满意度追踪",
      "en": "Seven-country Content Experience Tracker"
    },
    "scope": {
      "zh": "Tracking · 7 个海外市场",
      "en": "Tracking · Seven international markets"
    },
    "role": {
      "zh": "研究统筹 · 跨国执行与分析交付",
      "en": "Research coordination · International execution and analytical delivery"
    },
    "problem": {
      "zh": "持续追踪内容体验与满意度，比较不同市场、平台和用户群体的表现。",
      "en": "Track content experience and satisfaction over time, comparing markets, platforms, and audience groups."
    },
    "approach": {
      "zh": "统筹跨国执行、样本管理与分析交付；完成满意度相对权重分析、相关分析与跨期比较，核验方法排名差异、用户分组及加权口径。",
      "en": "Coordinate international fieldwork, sampling, and analytical delivery. Conduct relative weight, correlation, and wave-on-wave analyses, checking ranking differences across methods, audience definitions, and weighting."
    },
    "value": {
      "zh": "形成跨市场分析报告，比较关键体验因素和跨期变化，提出后续研究建议；区分用户体验差异与方法、样本口径变化对结果的影响。",
      "en": "Produce a cross-market report comparing key experience factors and changes over time, with recommendations for further research. Distinguish experience differences from effects of changing methods and sample definitions."
    }
  },
  {
    "index": "02",
    "visual": "markets",
    "markets": [
      "US",
      "UK",
      "DE",
      "JP",
      "KR",
      "ID",
      "BR"
    ],
    "title": {
      "zh": "七国搜索心智追踪",
      "en": "Seven-country Search Awareness Tracker"
    },
    "scope": {
      "zh": "Tracking · 7 个海外市场",
      "en": "Tracking · Seven international markets"
    },
    "role": {
      "zh": "深度参与 · 用户分析、趋势比较与结果复核",
      "en": "Substantial contribution · Audience analysis, trends, and review"
    },
    "problem": {
      "zh": "追踪用户的平台认知、搜索习惯与使用场景，比较不同市场和用户群体的差异。",
      "en": "Track platform awareness, search habits, and usage contexts across markets and audience groups."
    },
    "approach": {
      "zh": "开展用户分层、交叉分析与趋势比较，对齐指标定义和统计口径，复核逐国结果与整体汇总。",
      "en": "Analyze segments, cross-tabs, and trends; align metric definitions and calculation rules, and reconcile country-level and consolidated results."
    },
    "value": {
      "zh": "形成跨市场搜索认知与行为的比较依据，减少统计口径差异对趋势判断的干扰。",
      "en": "Provide a comparable view of search perceptions and behavior, reducing inconsistencies in metric definitions that can distort trend interpretation."
    }
  },
  {
    "index": "03",
    "visual": "journey",
    "markets": [
      "US"
    ],
    "title": {
      "zh": "美国搜索体验研究",
      "en": "U.S. Search Experience Research"
    },
    "scope": {
      "zh": "任务研究与定量问卷 · 美国",
      "en": "Task-based research and surveys · United States"
    },
    "role": {
      "zh": "主要负责 · 研究执行与数据交付",
      "en": "Primary responsibility · Execution and data delivery"
    },
    "problem": {
      "zh": "通过实际搜索任务，理解用户的操作过程和主观体验。",
      "en": "Understand users' actions and reported experiences through real search tasks."
    },
    "approach": {
      "zh": "组织移动端搜索任务、问卷及录屏资料的采集与整理，协调执行和数据交付。",
      "en": "Coordinate mobile search tasks, surveys, and screen-recording collection, organizing the evidence and data delivery."
    },
    "value": {
      "zh": "将用户操作过程与问卷反馈结合，为分析搜索体验中的需求和问题提供依据。",
      "en": "Connect observed task behavior with survey feedback to support analysis of search needs and experience issues."
    }
  },
  {
    "index": "04",
    "visual": "segments",
    "markets": [
      "US"
    ],
    "title": {
      "zh": "美国内容消费研究",
      "en": "U.S. Content Consumption Research"
    },
    "scope": {
      "zh": "定量研究 · 美国",
      "en": "Quantitative research · United States"
    },
    "role": {
      "zh": "主要负责 · 研究执行、分析表与交付",
      "en": "Primary responsibility · Execution, analysis tables, and delivery"
    },
    "problem": {
      "zh": "比较不同内容类型的用户画像、消费习惯与人群重合关系。",
      "en": "Compare audience profiles, consumption habits, and overlap across content genres."
    },
    "approach": {
      "zh": "围绕内容偏好、使用习惯和用户特征组织分析表，协调样本、研究执行与数据交付。",
      "en": "Structure analysis tables around content preferences, usage habits, and audience characteristics; coordinate sampling, execution, and delivery."
    },
    "value": {
      "zh": "呈现不同内容类型的用户差异，为目标人群与内容定位讨论提供研究依据。",
      "en": "Describe audience differences across content genres to support target-audience and content-positioning discussions."
    }
  }
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
      zh: "Excel、SQL、R；用户分层、交叉分析、相关与相对权重分析、跨期与跨市场比较",
      en: "Excel, SQL, R; Audience Segmentation, Cross-tabs, Correlation & Relative Weight Analysis, Cross-wave & Cross-market Comparisons",
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

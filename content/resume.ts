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
    zh: "海外用户与内容体验研究。",
    en: "International user and content experience research.",
  } satisfies Localized,
  positioning: {
    zh: "定量研究｜数据分析｜多市场洞察｜AI 研究工作流",
    en: "Quantitative Research | Data Analytics | Multi-market Insights | AI Research Workflows",
  } satisfies Localized,
  summary: {
    "zh": "益普索 Research Executive，服务字节跳动与联想。研究覆盖8个海外国家，具备大型追踪研究、用户洞察与满意度因素分析经验；将研究方法转化为可复用的 AI 工具，并开展研究数据库与产品原型开发。",
    "en": "Research Executive at Ipsos, serving ByteDance and Lenovo, with research experience across eight countries. Combine large-scale tracking, audience research, and satisfaction-factor analysis with reusable AI research tools and hands-on research-data product development."
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
      "zh": "服务字节跳动与联想，定量研究为主、定性研究为辅。海外研究经历覆盖美国、英国、德国、日本、韩国、印度尼西亚、巴西及沙特阿拉伯8国。",
      "en": "Serve ByteDance and Lenovo through quantitative-led research with qualitative support. Project experience spans the US, UK, Germany, Japan, South Korea, Indonesia, Brazil, and Saudi Arabia."
    },
    "bullets": [
      {
        "label": {
          "zh": "多国内容生态追踪",
          "en": "Multi-country content tracking"
        },
        "text": {
          "zh": "负责覆盖7国的内容生态与满意度追踪研究，统筹多平台研究的样本管理、跨国执行与分析交付；协调执行及数据团队，将复杂研究要求转化为一致的实施与分析标准。",
          "en": "Lead execution and analytical delivery for a seven-country content-experience and satisfaction tracking study. Coordinate sampling, international fieldwork, and data teams, translating complex research requirements into consistent implementation and analysis standards."
        }
      },
      {
        "label": {
          "zh": "满意度因素分析",
          "en": "Satisfaction-factor analysis"
        },
        "text": {
          "zh": "完成相对权重分析及跨期对比，比较不同体验维度的重要性与变化；复核历史方法、样本范围和跨平台加权口径，为识别关键体验因素、解释满意度差异提供分析依据。",
          "en": "Produce relative-weight analyses and wave-on-wave comparisons of experience dimensions. Review historical methods, sample scope, and cross-platform weighting to support interpretation of satisfaction differences and the identification of important experience factors."
        }
      },
      {
        "label": {
          "zh": "搜索心智与行为研究",
          "en": "Search awareness and behavior"
        },
        "text": {
          "zh": "深度参与独立的7国搜索心智追踪研究，围绕平台认知、搜索场景和使用习惯开展用户分层、交叉分析与趋势比较，建立跨市场、跨人群的一致比较依据。",
          "en": "Contribute substantially to a separate seven-country search-awareness tracker. Analyze audience segments, cross-tabs, and trends in platform awareness, search contexts, and usage habits, maintaining comparable definitions across markets and audiences."
        }
      },
      {
        "label": {
          "zh": "海外用户与内容洞察",
          "en": "International audience research"
        },
        "text": {
          "zh": "主要负责美国搜索体验与内容消费研究，以任务操作、问卷与行为资料分析用户体验；比较短剧及网文用户的内容偏好、消费习惯与人群重合，支持目标用户和内容定位判断。",
          "en": "Take primary responsibility for U.S. search-experience and content-consumption studies. Combine search tasks, surveys, and behavioral evidence, and analyze short-form drama and web-fiction audiences by preference, consumption habits, and overlap to support audience and content-positioning research."
        }
      },
      {
        "label": {
          "zh": "品牌与产品研究",
          "en": "Brand and product research"
        },
        "text": {
          "zh": "深度参与品牌健康度追踪、企业用户画像、AI 产品海外用研与德国实地研究，结合案头研究及定量、定性资料，支持品牌表现、企业需求与产品体验分析。",
          "en": "Contribute substantially to brand-health tracking, business-user profiling, overseas AI product research, and German fieldwork. Combine desk research with quantitative and qualitative evidence to examine brand performance, business needs, and product experience."
        }
      },
      {
        "label": {
          "zh": "AI 研究方法与工具",
          "en": "AI research tools and methods"
        },
        "text": {
          "zh": "将问卷、样本、指标与分析交付中的研究规则转化为可复用工具和技能库，借助 Codex 实现批量处理、异常定位与结果复核；工具已用于正式交付并被同事采用，完成团队分享与使用推广。",
          "en": "Turn research rules across questionnaires, samples, metrics, and analytical delivery into reusable tools and a skills library. Use Codex for batch processing, exception detection, and output checks; the tools are used in live delivery and adopted by colleagues, supported by internal training and sharing."
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
      "zh": "整合行业、竞品、电商数据与用户反馈，比较价格带、SKU组合、产品卖点和渠道表现，支持新品定位与产品升级讨论。建立竞品分析框架，输出分析表、项目备忘录与汇报材料，支持项目组比较商品和渠道策略。",
      "en": "Combined industry, competitor, e-commerce, and user evidence to compare price bands, SKU portfolios, product claims, and channel performance, supporting product positioning and upgrades. Built competitive-analysis frameworks and produced analysis tables, project memos, and presentations to support comparisons of product and channel strategies."
    },
    "bullets": []
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
      "zh": "统筹多国执行、样本管理与分析交付；完成满意度相对权重分析和跨期对比，复核历史方法、用户分组及跨平台加权口径。",
      "en": "Coordinate international fieldwork, sampling, and analytical delivery. Produce satisfaction relative-weight analyses and wave-on-wave comparisons, reviewing historical methods, audience definitions, and cross-platform weighting."
    },
    "value": {
      "zh": "形成体验维度重要性与跨期变化的分析结果，为识别关键体验因素、解释平台与人群差异提供依据。",
      "en": "Deliver comparisons of experience-dimension importance and changes over time, supporting analysis of important experience factors and differences between platforms and audiences."
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

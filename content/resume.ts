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
    zh: "研究用户如何选择、使用与评价产品。",
    en: "How people choose, use, and experience products.",
  } satisfies Localized,
  positioning: {
    zh: "市场研究 · 用户洞察 · 数据分析",
    en: "Market Research · User Insights · Data Analysis",
  } satisfies Localized,
  summary: {
    "zh": "我在益普索从事市场与用户研究，服务字节跳动与联想。主要负责七国内容生态与满意度追踪的项目推进和分析交付，深度参与多国搜索与品牌研究；将统计分析、跨期比较和数据复核做成可复用的 AI 工作流，把更多精力放在方法判断、结果解释与研究建议上。",
    "en": "I’m a Research Executive at Ipsos, working with ByteDance and Lenovo. I lead project coordination and analytical delivery for a seven-country content and satisfaction tracker, alongside multi-country search and brand research. I build reusable AI workflows for statistical analysis, wave comparisons, and data checks, making more room for methodological judgment and interpretation."
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
      zh: "把分散的产品资料整理成可查询、可比较的研究数据库，并通过网页查看品类、价格与规格差异。",
      en: "A database and web prototype for comparing consumer products by category, price, and specifications.",
    } satisfies Localized,
    problem: {
      zh: "研究一个品类时，资料来自不同渠道，产品分类、时间和指标定义往往对不上。",
      en: "Research sources often use different product categories, time periods, and metric definitions, making comparisons unreliable.",
    } satisfies Localized,
    contribution: {
      zh: "确定研究所需的数据、分类和比较标准，设计 SQLite 数据结构并保留来源记录；设计查询与比较功能，借助 Codex 完成网页实现。",
      en: "Defined data requirements and comparison criteria, designed the SQLite schema with source traceability, and built the query and comparison interface with Codex.",
    } satisfies Localized,
    outcome: {
      zh: "已实现多维筛选、商品比较、图表与明细联动及导出，并完成数据来源、采购需求和产品可行性的初步评估。",
      en: "The prototype supports filters, product comparisons, linked charts and detail views, and exports. Also assessed data sources, procurement needs, and initial product feasibility.",
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
      zh: "在同一个界面中筛选照片、比较修图方案并输出拼图，探索调色与 AI 编辑如何配合使用。",
      en: "A local-first photo workspace for selecting images, comparing edits, and creating collages, exploring how color grading and AI editing can work together.",
    } satisfies Localized,
    problem: {
      zh: "修图过程中需要反复切换工具和版本，难以同时比较效果与人物细节。",
      en: "Switching between editing tools and versions makes it difficult to compare results and check fine details in portraits.",
    } satisfies Localized,
    contribution: {
      zh: "设计照片处理步骤、版本记录和多方案比较方式，完成桌面、平板与手机端的交互原型。",
      en: "Designed the editing steps, version history, and side-by-side comparisons, then built interactive prototypes for desktop, tablet, and mobile.",
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
      zh: "根据距离、口味、预算和近期记录筛选餐厅，也把在家做饭与饭后安排放进同一个选择流程。",
      en: "A personal tool for choosing restaurants by distance, taste, budget, and recent visits, with options for home cooking and after-dinner plans.",
    } satisfies Localized,
    problem: {
      zh: "想吃什么、附近有什么、最近吃过什么，往往分散在不同应用和记录里。",
      en: "Food preferences, nearby places, and recent meals tend to be scattered across apps and notes.",
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
      zh: "用中英文介绍研究经历、分析方法与个人作品，让文字、案例图和交互共同讲清楚我的工作。",
      en: "A bilingual site presenting my research experience, methods, and personal projects through writing, diagrams, and interaction.",
    } satisfies Localized,
    problem: {
      zh: "一页简历难以展开研究过程，需要一个能展示案例和实际作品的空间。",
      en: "A one-page résumé leaves little room to explain research decisions or demonstrate working prototypes.",
    } satisfies Localized,
    contribution: {
      zh: "负责内容架构、双语表达、视觉与交互设计，借助 Codex 完成前端实现、测试和持续更新。",
      en: "Shaped the content architecture, bilingual copy, visual design, and interactions, using Codex for front-end implementation, testing, and ongoing updates.",
    } satisfies Localized,
    outcome: {
      zh: "已上线中英双语主页，集中展示工作经历、研究案例、个人作品与简历下载。",
      en: "Published a bilingual site with work experience, research cases, personal projects, and a downloadable résumé.",
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
      "zh": "服务字节跳动与联想，具备多国研究经验。以定量研究为主，结合定性资料，研究用户如何使用内容与搜索产品，以及品牌表现和产品需求。",
      "en": "Serve ByteDance and Lenovo through multi-country research, combining quantitative analysis with qualitative evidence. Studies cover content and search experiences, brand performance, and product needs."
    },
    "bullets": [
      {
        "label": {
          "zh": "多国内容生态追踪",
          "en": "Multi-country content tracking"
        },
        "text": {
          "zh": "主要负责7国内容生态与满意度 Tracking，从跨国调研推进到分析交付承担核心工作；协调研究与数据团队，统一用户分组、样本和加权标准，解决不同市场、平台间的比较问题。",
          "en": "Lead fieldwork coordination and analytical delivery for a seven-country content and satisfaction tracker. Work with research and data teams to align audience groups, sample definitions, and weighting across markets and platforms."
        }
      },
      {
        "label": {
          "zh": "满意度与关键因素分析",
          "en": "Satisfaction and relative importance"
        },
        "text": {
          "zh": "确认统计方法与跨期比较条件，借助 Codex 完成相对权重分析、相关分析与结果复算；核查因素排名、样本与加权变化，完成跨市场分析报告、后续研究建议及可复用的方法 SOP。",
          "en": "Define statistical methods and conditions for wave comparisons, using Codex for relative weight and correlation analyses and independent recalculation. Review factor rankings, sample definitions, and weights, then deliver a cross-market report, further-research recommendations, and a reusable analysis guide."
        }
      },
      {
        "label": {
          "zh": "搜索心智与行为研究",
          "en": "Search awareness and behavior"
        },
        "text": {
          "zh": "深度参与另一项7国搜索心智追踪，通过用户分层、交叉分析与趋势比较，分析平台认知、搜索场景和使用习惯在不同市场、人群中的差异。",
          "en": "Contribute audience segmentation, cross-tabulation, and trend analysis to a separate seven-country search-awareness tracker, examining differences in platform awareness, search contexts, and usage habits by market and user group."
        }
      },
      {
        "label": {
          "zh": "美国搜索与内容研究",
          "en": "U.S. search and content research"
        },
        "text": {
          "zh": "主要负责美国搜索体验与内容消费研究。将实际搜索任务与问卷反馈结合，分析用户需求与体验问题；比较短剧、网文用户的内容偏好、消费习惯及人群重合，为目标用户和内容定位提供分析结果。",
          "en": "Lead core workstreams in U.S. search-experience and content-consumption studies. Combine search tasks with survey feedback to examine user needs and experience issues; compare short-form drama and web-fiction audiences by preferences, habits, and overlap."
        }
      },
      {
        "label": {
          "zh": "品牌与产品研究",
          "en": "Brand and product research"
        },
        "text": {
          "zh": "深度参与品牌健康度追踪、中小企业用户画像、AI 创作产品海外用研与德国实地研究，结合案头资料、问卷与访谈结果，分析品牌表现、购买需求和使用体验。",
          "en": "Contribute to brand-health tracking, small-business user profiling, overseas research on AI creative tools, and field research in Germany. Combine desk research, survey data, and interview findings to examine brand performance, purchasing needs, and product experience."
        }
      },
      {
        "label": {
          "zh": "AI 研究工作流",
          "en": "AI research workflows"
        },
        "text": {
          "zh": "将研究规则转化为 Codex 可执行的工具与 Skills 库，用批量计算、跨文件比对和自动定位问题替代反复手工处理；负责规则设定、异常判断与结果验收，工具已用于正式交付并被同事采用，配套完成操作手册和团队分享。",
          "en": "Build reusable Codex tools and a skills library that replace repeated manual calculations and file-by-file checks with batch processing and issue detection. Define the rules, assess exceptions, and validate outputs. The tools are used in live project delivery and have been adopted by colleagues, supported by user guides and team sharing."
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
          "zh": "结合电商交易、竞品与用户研究资料，比较产品规格、组合和价格带；从购买需求出发分析产品卖点，参与产品组合与升级方向建议。",
          "en": "Compared product specifications, bundles, and price tiers using e-commerce, competitor, and user research. Assessed product benefits against purchasing needs and contributed recommendations on product mix and upgrades."
        }
      },
      {
        "label": { "zh": "宠物食品新品孵化", "en": "Pet food product development" },
        "text": {
          "zh": "比较头部品牌的产品布局、主力单品与渠道策略，结合行业访谈完成竞争格局和品牌案例分析；梳理差异化卖点，参与新品定位与上市准备。",
          "en": "Analyzed leading brands’ portfolios, flagship products, and channel strategies, drawing on industry interviews to produce competitive landscape and brand case analyses. Identified differentiating benefits to support product positioning and launch preparation."
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
      "zh": "主要负责 · 研究统筹与分析交付",
      "en": "Primary responsibility · Study coordination and analysis"
    },
    "problem": {
      "zh": "不同市场和平台的用户如何评价内容体验？哪些体验因素与整体满意度的关系更紧密，表现又如何随时间变化？",
      "en": "How do audiences rate content across markets and platforms? Which aspects of the experience are most closely associated with satisfaction, and how do results change over time?"
    },
    "approach": {
      "zh": "主要承担7国调研推进与分析交付，确认用户分组、加权和跨期比较条件；借助 Codex 批量完成相对权重与相关分析，再核查不同方法的因素排名和结果差异。",
      "en": "Take primary responsibility for seven-country fieldwork coordination and analytical delivery. Define audience groups, weighting, and wave-comparison conditions; use Codex to batch-run relative weight and correlation analyses, then review factor rankings and differences between methods."
    },
    "value": {
      "zh": "交付跨市场分析报告、跨期对照与分析方法 SOP。把重复计算和核验保留为可复跑流程，后续追踪可沿用，研究精力集中在解释差异与提出建议。",
      "en": "Deliver a cross-market report, wave comparisons, and an analysis guide. Preserve calculations and validation as a rerunnable workflow for subsequent tracking, keeping attention on interpreting differences and developing recommendations."
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
      "zh": "深度参与 · 用户分层与趋势分析",
      "en": "Key contribution · Audience and trend analysis"
    },
    "problem": {
      "zh": "用户会想到哪些搜索平台，在什么场景使用？这些习惯在不同国家和人群中有何差异，又如何变化？",
      "en": "Which platforms come to mind for search, and when do people use them? How do these habits differ across countries and audiences, and change over time?"
    },
    "approach": {
      "zh": "开展用户分层、交叉分析与趋势比较；把问卷、数据字段和分析表的对应关系整理为检查规则，设计并验证 Codex 辅助复核工具，批量核对分国和汇总结果。",
      "en": "Conduct segmentation, cross-tabulation, and trend analysis. Map questionnaire items, data fields, and analysis tables into checking rules, then design and validate Codex-assisted tools to review country-level and consolidated results in batches."
    },
    "value": {
      "zh": "完成跨市场搜索认知与行为比较，并将反复逐表检查转为有规则、可追溯的批量复核；发现问题后能定位对应数据，便于团队确认与修正。",
      "en": "Produce cross-market comparisons of search perceptions and behavior. Replace repeated table-by-table checks with rule-based batch review that traces issues to their source data for team review and correction."
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
      "zh": "主要负责 · 任务研究与数据交付",
      "en": "Primary responsibility · Task research and data delivery"
    },
    "problem": {
      "zh": "用户实际搜索时怎样操作，又如何评价这段体验？操作过程与问卷反馈能揭示哪些需求和问题？",
      "en": "What do users do during a search, and how do they describe the experience? What needs and issues emerge when task behavior is considered alongside survey feedback?"
    },
    "approach": {
      "zh": "协调移动端搜索任务与问卷执行，整理录屏和反馈资料，将用户的操作过程与体验评价对应起来。",
      "en": "Coordinate mobile search tasks and surveys, organizing screen recordings and feedback so that users’ actions can be reviewed alongside their experience ratings."
    },
    "value": {
      "zh": "交付搜索任务、录屏及问卷资料，用于分析用户需求和搜索体验问题。",
      "en": "Deliver task, screen-recording, and survey evidence for analysis of user needs and search-experience issues."
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
      "zh": "主要负责 · 用户比较与分析交付",
      "en": "Primary responsibility · Audience comparisons and delivery"
    },
    "problem": {
      "zh": "短剧和网文分别吸引哪些用户？他们的内容偏好、消费习惯和人群重合有哪些异同？",
      "en": "Who consumes short-form drama and web fiction? How do their preferences and habits compare, and where do the audiences overlap?"
    },
    "approach": {
      "zh": "协调样本与研究执行，按内容偏好、使用习惯和用户特征组织分析表，比较两类内容用户的差异与重合。",
      "en": "Coordinate sampling and fieldwork, and structure analysis tables to compare the two audiences by preferences, habits, characteristics, and overlap."
    },
    "value": {
      "zh": "交付内容偏好、消费习惯和人群重合分析，用于目标用户与内容定位讨论。",
      "en": "Deliver analyses of content preferences, consumption habits, and audience overlap for discussions about audience and content positioning."
    }
  }
];

export const workflow = [
  {
    number: "01",
    title: { zh: "定义问题与方法", en: "Questions & Methods" } satisfies Localized,
    human: {
      zh: "明确要回答的问题、研究对象和指标定义",
      en: "Define the research question, audience, and measures",
    } satisfies Localized,
    ai: {
      zh: "整理资料，按研究规则检查问卷逻辑",
      en: "Organize material and check survey logic against research rules",
    } satisfies Localized,
  },
  {
    number: "02",
    title: { zh: "批量分析与比较", en: "Analysis & Comparison" } satisfies Localized,
    human: {
      zh: "确定分析方法、样本范围和跨期比较条件",
      en: "Choose the methods, sample scope, and conditions for wave comparisons",
    } satisfies Localized,
    ai: {
      zh: "按规则完成统计计算、多市场与跨期对照",
      en: "Run statistical calculations and market and wave comparisons to specification",
    } satisfies Localized,
  },
  {
    number: "03",
    title: { zh: "复核与解释", en: "Validation & Interpretation" } satisfies Localized,
    human: {
      zh: "评估样本与方法变化的影响，解释结果差异",
      en: "Assess the effects of sample and method changes when interpreting differences",
    } satisfies Localized,
    ai: {
      zh: "重算指标、交叉比对结果，并保留检查依据",
      en: "Recalculate metrics, cross-check results, and retain supporting evidence",
    } satisfies Localized,
  },
  {
    number: "04",
    title: { zh: "交付与复用", en: "Delivery & Reuse" } satisfies Localized,
    human: {
      zh: "形成研究建议、确认交付，并整理可复用的方法",
      en: "Develop recommendations, approve deliverables, and document reusable methods",
    } satisfies Localized,
    ai: {
      zh: "生成分析表与报告图表，保留脚本和核验记录",
      en: "Produce analysis tables and report charts, retaining scripts and validation records",
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

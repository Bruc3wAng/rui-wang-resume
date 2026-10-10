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
    "zh": "在益普索服务字节跳动与联想，专注多国用户研究与品牌追踪。用统计分析解释用户行为，也用 AI 将重复的分析与核验做成可复用工具。",
    "en": "At Ipsos, I work with ByteDance and Lenovo on multi-country user research and brand tracking. I use statistical analysis to understand user behavior and AI to build reusable tools for analysis and validation."
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
      zh: "设计中英双语内容与研究案例的呈现方式，借助 Codex 实现 WebGL 动效、滚动联动与交互，并根据实际浏览效果迭代。",
      en: "Shape the bilingual content and research-case presentation, then use Codex to implement WebGL motion, scroll-linked transitions, and interactions, refining the result through browser review.",
    } satisfies Localized,
    outcome: {
      zh: "已上线中英双语主页，集中展示工作经历、研究案例、个人作品与简历下载。",
      en: "Published a bilingual site with work experience, research cases, personal projects, and a downloadable résumé.",
    } satisfies Localized,
    tags: ["Next.js", "WebGL", "Bilingual UX", "GitHub Pages"],
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
      "zh": "服务字节跳动与联想，具备多国研究经验。以定量研究为主，结合定性资料，承担项目推进、分析判断与研究交付。",
      "en": "Serve ByteDance and Lenovo through multi-country research. Combine quantitative and qualitative evidence, with responsibilities across study coordination, analysis, and delivery."
    },
    "bullets": [
      {
        "label": {
          "zh": "七国内容生态与满意度追踪",
          "en": "Seven-country content and satisfaction tracking"
        },
        "text": {
          "zh": "主要负责7国内容生态与满意度追踪的项目推进和分析交付，比较不同市场、平台的用户体验；结合相对权重分析与跨期比较，识别与满意度关联更强的体验因素，形成研究报告与后续建议。",
          "en": "Lead study coordination and analytical delivery for a seven-country content and satisfaction tracker. Compare experiences across markets and platforms, using relative weight analysis and wave comparisons to identify factors associated with satisfaction and develop research recommendations."
        }
      },
      {
        "label": {
          "zh": "品牌健康度追踪",
          "en": "Brand-health tracking"
        },
        "text": {
          "zh": "深度参与多期品牌追踪，分析品牌认知、评价与形象变化；统一不同客群、期次和报告中的指标定义，完成数据与报告更新，支持品牌表现判断。",
          "en": "Contribute to ongoing brand tracking, examining changes in awareness, brand evaluations, and image. Align metric definitions across audiences, waves, and reports, and update the data and reporting used to assess brand performance."
        }
      },
      {
        "label": {
          "zh": "美国短剧与网文消费研究",
          "en": "U.S. short-form drama and web-fiction research"
        },
        "text": {
          "zh": "独立负责美国短剧与网文消费研究，组织研究执行、用户分层和分析交付；比较内容偏好、消费习惯与人群重合，为目标用户和内容定位提供依据。",
          "en": "Independently manage a U.S. study of short-form drama and web-fiction consumption, from fieldwork coordination to audience segmentation and analytical delivery. Compare preferences, habits, and audience overlap to inform audience and content positioning."
        }
      },
      {
        "label": {
          "zh": "七国搜索心智追踪",
          "en": "Seven-country search-awareness tracking"
        },
        "text": {
          "zh": "深度参与另一项7国搜索心智追踪，通过用户分层、交叉分析与趋势比较，解释平台认知、搜索场景和使用习惯在不同市场、人群中的差异。",
          "en": "Contribute to a separate seven-country search-awareness tracker, using segmentation, cross-tabulation, and trend analysis to understand differences in platform awareness, search contexts, and habits across markets and audiences."
        }
      },
      {
        "label": {
          "zh": "定性与用户研究",
          "en": "Qualitative and user research"
        },
        "text": {
          "zh": "深度参与德国实地用研及中小企业用户画像研究，结合访谈与定量资料理解使用场景、产品需求和采购决策，并协调跨语言研究执行。",
          "en": "Contribute to field research in Germany and small-business user profiling. Combine interview and survey evidence to understand use cases, product needs, and purchasing decisions, alongside cross-language research coordination."
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
      "zh": "独立负责 · 研究执行与分析交付",
      "en": "Independent project responsibility · Fieldwork and analysis"
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
  {
    title: { zh: "AI 辅助设计与创作", en: "AI-assisted Design & Creation" } satisfies Localized,
    items: {
      zh: "借助 Codex 与 AI 工具设计和实现交互网站、网页动效与动态短片；开展 Blender、Three.js 三维视觉及 AI 视频创作实践，负责创意方向、需求拆解与效果迭代。",
      en: "Use Codex and AI tools to design and build interactive websites, web motion, and motion-graphics pieces. Explore 3D visuals with Blender and Three.js and AI video creation, guiding creative direction, requirements, and visual refinement.",
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

// A single work section replaces the repeated experience / case narrative.
export const selectedWork = [
  {
    id: "content-tracking", index: "01",
    title: experiences[0].bullets[0].label,
    scope: { zh: "Tracking · 7 个海外市场", en: "Tracking · Seven international markets" } satisfies Localized,
    role: { zh: "主要负责 · 项目推进与分析交付", en: "Primary responsibility · Coordination and analysis" } satisfies Localized,
    summary: experiences[0].bullets[0].text,
    markets: [...cases[0].markets],
  },
  {
    id: "brand-tracking", index: "02",
    title: experiences[0].bullets[1].label,
    scope: { zh: "持续追踪 · 品牌表现", en: "Ongoing tracking · Brand performance" } satisfies Localized,
    role: { zh: "深度参与 · 分析与报告交付", en: "Key contribution · Analysis and reporting" } satisfies Localized,
    summary: experiences[0].bullets[1].text,
    markets: [] as string[],
  },
  {
    id: "us-content", index: "03",
    title: experiences[0].bullets[2].label,
    scope: { zh: "定量研究 · 美国", en: "Quantitative research · United States" } satisfies Localized,
    role: { zh: "独立负责 · 研究执行与分析交付", en: "Independent project responsibility · Fieldwork and analysis" } satisfies Localized,
    summary: experiences[0].bullets[2].text,
    markets: ["US"],
  },
  {
    id: "search-tracking", index: "04",
    title: experiences[0].bullets[3].label,
    scope: { zh: "Tracking · 7 个海外市场", en: "Tracking · Seven international markets" } satisfies Localized,
    role: { zh: "深度参与 · 用户分层与趋势分析", en: "Key contribution · Audience and trend analysis" } satisfies Localized,
    summary: experiences[0].bullets[3].text,
    markets: [...cases[1].markets],
  },
  {
    id: "qualitative", index: "05",
    title: experiences[0].bullets[4].label,
    scope: { zh: "实地研究 · 用户画像", en: "Field research · User profiling" } satisfies Localized,
    role: { zh: "深度参与 · 定性与定量结合", en: "Key contribution · Mixed-method research" } satisfies Localized,
    summary: experiences[0].bullets[4].text,
    // Germany belongs to one study, not every study in this grouped entry.
    markets: [] as string[],
  },
];

export const aiPractice = [
  {
    id: "research-analysis",
    title: { zh: "跨市场统计分析", en: "Cross-market statistical analysis" } satisfies Localized,
    context: {
      zh: "多市场追踪既要反复计算，也要判断不同方法、样本和期次能否比较。",
      en: "Multi-market tracking calls for repeated calculations and careful judgment about whether methods, samples, and waves are comparable.",
    } satisfies Localized,
    decision: {
      zh: "我确定分析方法和比较条件，判断排名差异是否来自方法或样本变化，并解释研究结果。",
      en: "I choose the methods and comparison criteria, assess whether ranking differences reflect methodological or sample changes, and interpret the findings.",
    } satisfies Localized,
    execution: {
      zh: "借助 Codex 批量完成相对权重与相关分析、独立复算及跨期对照，将分析规则写成可复跑脚本。",
      en: "Use Codex to batch-run relative weight and correlation analyses, independent recalculations, and wave comparisons, with the rules captured in rerunnable scripts.",
    } satisfies Localized,
    output: {
      zh: "已交付跨市场分析报告、跨期对照与方法 SOP。重复计算可沿用同一流程，减少逐次重做，把时间用于解释差异与提出建议。",
      en: "Delivered a cross-market report, wave comparisons, and an analysis guide. Reusable calculations reduce repeated setup, leaving more time for interpretation and recommendations.",
    } satisfies Localized,
    inputLabels: [
      { zh: "分市场数据", en: "Market data" },
      { zh: "分析方法", en: "Methods" },
      { zh: "比较条件", en: "Comparison criteria" },
    ] satisfies Localized[],
    outputLabels: [
      { zh: "统计结果", en: "Statistical results" },
      { zh: "研究报告", en: "Research report" },
      { zh: "方法 SOP", en: "Analysis guide" },
    ] satisfies Localized[],
  },
  {
    id: "tracking-delivery",
    title: { zh: "追踪研究的核验与更新", en: "Validation and updates for tracking studies" } satisfies Localized,
    context: {
      zh: "同一项研究要在数据表、平台和报告中保持一致，更新一期时还需保留正确的历史结果。",
      en: "Tracking results need to stay consistent across data tables, platforms, and reports while preserving valid historical data.",
    } satisfies Localized,
    decision: {
      zh: "我梳理指标、数据来源与报告位置的对应关系，明确样本范围和更新规则，判断例外与业务影响。",
      en: "I map metrics to their sources and report locations, define sample scope and update rules, and assess exceptions and their implications.",
    } satisfies Localized,
    execution: {
      zh: "将规则转为 Codex 辅助工具，批量比对文件、定位差异并按映射更新表格与图表；保留来源和检查记录。",
      en: "Turn those rules into Codex-assisted tools for batch file comparisons, issue tracing, and mapped table and chart updates, with source and validation records.",
    } satisfies Localized,
    output: {
      zh: "工具已用于正式交付并被同事采用。通过可复用 Skills、脚本与操作手册，把逐份查找和重复复制转为批量处理与重点复核。",
      en: "Tools are used in formal project delivery and adopted by colleagues. Reusable skills, scripts, and guides replace file-by-file searches and repeated copying with batch processing and targeted review.",
    } satisfies Localized,
    inputLabels: [
      { zh: "研究规则", en: "Research rules" },
      { zh: "数据来源", en: "Source data" },
      { zh: "报告模板", en: "Report templates" },
    ] satisfies Localized[],
    outputLabels: [
      { zh: "差异定位", en: "Issue tracing" },
      { zh: "交付更新", en: "Updated deliverables" },
      { zh: "复用工具", en: "Reusable tools" },
    ] satisfies Localized[],
  },
  {
    id: "research-platform",
    title: { zh: "研究数据平台", en: "Research Data Platform" } satisfies Localized,
    context: {
      zh: "个人研究产品原型：把分散的产品资料整理成可查询、可比较的数据库。",
      en: "A personal research-product prototype that brings scattered product information into a searchable, comparable database.",
    } satisfies Localized,
    decision: {
      zh: "我从研究问题出发，确定数据要求、产品分类、指标定义与来源记录，设计查询和比较方式。",
      en: "I define data requirements, product categories, metrics, and source records around research questions, then design the queries and comparisons.",
    } satisfies Localized,
    execution: {
      zh: "借助 Codex 实现 SQLite 数据结构、多维筛选、图表与明细联动及导出，将研究要求落成可操作原型。",
      en: "Use Codex to implement the SQLite structure, filters, linked charts and detail views, and exports, turning research requirements into a working prototype.",
    } satisfies Localized,
    output: {
      zh: "已实现产品查询与比较，减少在分散资料间反复查找；并完成数据来源、采购需求及产品可行性的初步评估。",
      en: "The prototype supports product queries and comparisons without repeatedly searching separate sources. Initial assessments of data sources, procurement needs, and feasibility are also complete.",
    } satisfies Localized,
    inputLabels: [
      { zh: "研究问题", en: "Research questions" },
      { zh: "产品资料", en: "Product sources" },
      { zh: "比较标准", en: "Comparison criteria" },
    ] satisfies Localized[],
    outputLabels: [
      { zh: "研究数据库", en: "Research database" },
      { zh: "交互查询", en: "Interactive queries" },
      { zh: "可用原型", en: "Working prototype" },
    ] satisfies Localized[],
  },
];

export type CreativeItem = {
  title: Localized;
  description: Localized;
  status: Localized;
  liveUrl?: string;
  sourceUrl?: string;
};

export const creativeCategories: {
  id: "video" | "games" | "web";
  title: Localized;
  summary: Localized;
  items: CreativeItem[];
}[] = [
  {
    id: "video",
    title: { zh: "AI 视频", en: "AI-assisted Video" },
    summary: { zh: "从内容编排、视觉方向到代码动效，探索 AI 辅助的影像创作。", en: "Explore AI-assisted storytelling, visual direction, and coded motion." },
    items: [
      {
        title: { zh: "个人介绍动态短片", en: "Motion-graphics Introduction" },
        description: { zh: "将职业经历编排为动态叙事，借助 AI 编写绘制与音效代码，完成 20 秒短片导出。", en: "Shape professional experience into a motion narrative, using AI-assisted animation and sound code to export a 20-second piece." },
        status: { zh: "已导出短片", en: "Exported film" },
      },
      {
        title: { zh: "三维与 AI 视频探索", en: "3D and AI Video Experiments" },
        description: { zh: "围绕场景、材质与镜头效果，借助 AI 开展 Blender、Three.js 及视频创作实验。", en: "Explore scenes, materials, and camera treatments through AI-assisted Blender, Three.js, and video experiments." },
        status: { zh: "创作探索", en: "Creative exploration" },
      },
    ],
  },
  {
    id: "games",
    title: { zh: "游戏", en: "Games" },
    summary: { zh: "把规则设计、用户体验与 AI 辅助开发结合，做出可以实际游玩的原型。", en: "Combine game rules, player experience, and AI-assisted development in playable prototypes." },
    items: [
      {
        title: { zh: "山河策", en: "Shanhe Strategy" },
        description: { zh: "围绕武将养成、配队战斗与策略争城设计玩法，借助 AI 实现可玩流程、存档与战报，持续迭代规则和视觉表现。", en: "Design character progression, team battles, and territorial strategy, using AI-assisted development to implement gameplay, saves, and battle reports while iterating on rules and visuals." },
        status: { zh: "可玩原型 · 持续开发", en: "Playable prototype · In development" },
      },
    ],
  },
  {
    id: "web",
    title: { zh: "个人网站", en: "Web Projects" },
    summary: { zh: "从具体需求出发，设计界面与交互，借助 AI 完成实现并持续打磨。", en: "Design interfaces and interactions around specific needs, then build and refine them with AI." },
    items: [
      {
        title: projects[3].title,
        description: projects[3].contribution,
        status: { zh: "已上线", en: "Live" },
        liveUrl: projects[3].liveUrl,
        sourceUrl: projects[3].sourceUrl,
      },
      {
        title: projects[1].title,
        description: { zh: "设计照片筛选、修图方案对比与版本记录，形成影像处理交互原型。", en: "An interactive photo-workflow prototype for selection, edit comparisons, and version history." },
        status: { zh: "交互原型", en: "Interactive prototype" },
      },
      {
        title: projects[2].title,
        description: { zh: "将口味、预算、距离和历史偏好转为筛选规则，设计餐厅选择与收藏体验。", en: "A restaurant-selection and saving experience built around taste, budget, distance, and preference history." },
        status: { zh: "交互原型", en: "Interactive prototype" },
      },
    ],
  },
];

export const sectionCopy = {
  workTitle: { zh: "重点工作", en: "Selected Work" },
  workIntro: { zh: "从多国追踪到专项用户研究，承担项目推进、分析判断与交付。", en: "Study coordination, analytical judgment, and delivery across tracking programs and focused user research." },
  aiTitle: { zh: "AI 提效实践", en: "AI in Research Practice" },
  aiIntro: { zh: "把研究规则转成可执行、可复用的工具，让重复工作更快完成，让分析结果更便于核对。", en: "Turn research rules into reusable tools to handle repetitive work efficiently and make results easier to verify." },
  creativeTitle: { zh: "个人作品", en: "Personal Projects" },
  creativeIntro: { zh: "在研究之外，把想法做成影像、游戏与交互网站。", en: "Beyond research, I turn ideas into moving images, games, and interactive websites." },
} satisfies Record<string, Localized>;

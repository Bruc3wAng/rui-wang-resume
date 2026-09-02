"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import resumeRelease from "../content/resume-release.json";
import {
  capabilities,
  cases,
  education,
  experiences,
  type Language,
  profile,
  projects,
  workflow,
} from "../content/resume";

const copy = {
  zh: {
    nav: [
      ["经历", "experience"],
      ["研究案例", "work"],
      ["AI 方法", "method"],
      ["个人作品", "projects"],
      ["能力", "capabilities"],
    ],
    availability: "北京 · 市场研究、用户洞察与数据分析",
    viewWork: "查看工作经历",
    download: "下载中文简历",
    profileIndex: "PROFILE / 01",
    profileCurrent: "当前",
    profileFocus: "专业重心",
    profileBuilding: "研究实践",
    profileCurrentValue: "Ipsos · Research Executive",
    profileFocusValue: "定量研究与多市场洞察",
    profileBuildingValue: "AI 工作流与研究数据产品",
    heroFacts: [
      ["研究方法", "定量主导 · 定性补充"],
      ["研究范围", "海外用户 · 品牌 · 产品"],
      ["多市场经验", "Tracking 覆盖 7 个海外市场"],
    ],
    introEyebrow: "HOW I WORK / 工作方式",
    introTitle: "先明确研究问题，再组织数据与分析。",
    introBody:
      "我会先明确客户需要作出什么判断，再确定研究问题、指标和分析方法。在执行过程中协调各方口径，分析时检查数据是否可比，最后把发现整理为有依据的判断与建议。",
    introNote:
      "近期也将这套思路用于数据产品：从研究需求出发设计数据库，保留信息来源，并让查询、比较和导出使用同一套定义。",
    researchChain: ["业务问题", "研究设计", "多市场执行", "分析诊断", "决策支持"],
    chainLabel: "一条完整的研究链路",
    chainOwner: "每个阶段都明确：要回答什么、需要哪些证据、由谁作出判断。",
    experienceEyebrow: "EXPERIENCE / 工作经历",
    experienceTitle: "在益普索的研究经历。",
    clientScope: "客户范围",
    clientScopeValue: "字节跳动与联想",
    researchScope: "研究主题",
    researchScopeValue: "海外用户、品牌 Tracking、人群洞察与产品体验",
    researchMix: "方法组合",
    researchMixValue: "定量为主 · 定性为辅",
    earlierExperience: "EARLIER EXPERIENCE",
    workEyebrow: "SELECTED WORK / 研究案例",
    workTitle: "代表性研究场景与方法。",
    workIntro:
      "从品牌表现到用户体验，围绕具体问题选择研究方法，并把分析结果用于产品与市场判断。",
    role: "我的角色",
    challenge: "研究问题",
    approach: "分析方法",
    value: "决策价值",
    selectCase: "切换研究案例",
    methodEyebrow: "HUMAN × AI / 研究方法",
    methodTitle: "把研究规则做成可复用的工具。",
    methodIntro:
      "我用 Codex 将问卷、样本、数据与分析表之间的检查规则做成工具和 Skills 库。每次使用时，先明确适用范围，再处理例外并复核结果。相关工具已用于正式交付并被同事采用。",
    methodSignal: "正式项目使用 · 同事复用",
    researcher: "研究员负责",
    codex: "Codex 承担",
    methodFoot:
      "随着项目推进，将验证过的规则和处理方式补充进工具库，让后续项目可以复用。",
    projectsEyebrow: "BUILT BY ME / 个人作品",
    projectsTitle: "把研究经验延伸为数据产品。",
    projectsIntro:
      "从研究数据库到网页交互，探索如何让资料更易查询、比较，并用于后续分析。",
    moreProjects: "其他个人作品",
    projectProblem: "解决的问题",
    projectContribution: "我的工作",
    projectOutcome: "当前产出",
    viewLive: "在线体验",
    viewSource: "查看源码",
    commandHint: "按 ⌘K / Ctrl K 快速浏览本站",
    capabilityEyebrow: "CAPABILITIES / 专业能力",
    capabilityTitle: "研究、分析与产品实现。",
    capabilityIntro:
      "以研究方法和数据分析为基础，结合跨团队项目经验、数据库设计与 AI 工作流实践。",
    education: "教育背景",
    languages: "语言",
    languageValue: "普通话（母语）｜英语（TOEFL 110）",
    contactEyebrow: "CONTACT / 联系方式",
    contactTitle: "如果你正在研究用户、市场或产品，我们可以聊聊。",
    contactBody:
      "欢迎就市场研究、用户洞察、数据分析、AI 工作流及相关机会联系我。北京优先，也可接受上海、杭州与深圳。",
    copyEmail: "复制邮箱",
    copyPhone: "复制电话",
    emailCopied: "邮箱已复制",
    phoneCopied: "电话已复制",
    emailLabel: "邮箱",
    phoneLabel: "电话",
    commandEyebrow: "QUICK ACCESS / 快速访问",
    commandTitle: "去哪里？",
    commandClose: "关闭",
    commandNavigate: "浏览页面",
    commandContact: "联系与链接",
    commandGithub: "打开 GitHub",
    updated: `更新于 ${resumeRelease.updatedAt.slice(0, 7).replace("-", ".")}`,
    backTop: "返回顶部",
  },
  en: {
    nav: [
      ["Experience", "experience"],
      ["Selected work", "work"],
      ["AI method", "method"],
      ["Projects", "projects"],
      ["Capabilities", "capabilities"],
    ],
    availability:
      "Beijing · Market research, user insights, and data analytics",
    viewWork: "View experience",
    download: "Download Chinese résumé",
    profileIndex: "PROFILE / 01",
    profileCurrent: "Current",
    profileFocus: "Focus",
    profileBuilding: "Practice",
    profileCurrentValue: "Ipsos · Research Executive",
    profileFocusValue: "Quantitative & multi-market insight",
    profileBuildingValue: "AI workflows & research-data products",
    heroFacts: [
      ["Research mix", "Quantitative-led · Qualitative support"],
      ["Research scope", "International users · Brand · Product"],
      ["Multi-market work", "Tracking across seven international markets"],
    ],
    introEyebrow: "HOW I WORK",
    introTitle:
      "Start with the research question. Then organize the evidence.",
    introBody:
      "I start by understanding the decision a client needs to make, then define the research questions, measures, and analytical approach. I align teams during execution, check comparability during analysis, and turn findings into evidence-backed recommendations.",
    introNote:
      "I also apply this approach to data products: designing a database around research needs, preserving source information, and keeping retrieval, comparison, and exports consistent.",
    researchChain: [
      "Business question",
      "Research design",
      "Multi-market execution",
      "Analytical diagnosis",
      "Decision support",
    ],
    chainLabel: "One connected research chain",
    chainOwner:
      "At each stage: a clear question, the evidence needed, and responsibility for the judgment.",
    experienceEyebrow: "EXPERIENCE",
    experienceTitle: "Research experience at Ipsos.",
    clientScope: "Client scope",
    clientScopeValue: "ByteDance and Lenovo",
    researchScope: "Research themes",
    researchScopeValue:
      "International users, brand tracking, audience insights, and product experience",
    researchMix: "Research mix",
    researchMixValue: "Quantitative-led · Qualitative support",
    earlierExperience: "EARLIER EXPERIENCE",
    workEyebrow: "SELECTED WORK",
    workTitle: "Selected research contexts and methods.",
    workIntro:
      "From brand performance to user experience, I select methods around a specific question and use the findings to inform product and market decisions.",
    role: "My role",
    challenge: "Research question",
    approach: "Analytical approach",
    value: "Decision value",
    selectCase: "Select a research case",
    methodEyebrow: "HUMAN × AI · RESEARCH METHOD",
    methodTitle:
      "Turn research rules into reusable tools.",
    methodIntro:
      "I use Codex to build tools and a Skills library from checking rules across questionnaires, samples, datasets, and analysis tables. Each use starts with a defined scope, followed by exception handling and output review. The tools are used in live delivery and have been adopted by colleagues.",
    methodSignal:
      "Used in live projects · Adopted by colleagues",
    researcher: "Researcher owns",
    codex: "Codex handles",
    methodFoot:
      "As projects progress, tested rules and handling methods become part of the tool library for reuse in future work.",
    projectsEyebrow: "BUILT BY ME",
    projectsTitle:
      "Extending research into data products.",
    projectsIntro:
      "From research databases to web interactions, I explore how information can become easier to retrieve, compare, and use in analysis.",
    moreProjects: "Other personal projects",
    projectProblem: "Problem",
    projectContribution: "My contribution",
    projectOutcome: "Current output",
    viewLive: "View live",
    viewSource: "View source",
    commandHint: "Press ⌘K / Ctrl K to navigate",
    capabilityEyebrow: "CAPABILITIES",
    capabilityTitle:
      "Research, analytics, and product development.",
    capabilityIntro:
      "Research methods and data analysis, supported by cross-team delivery experience, database design, and AI-assisted workflows.",
    education: "Education",
    languages: "Languages",
    languageValue: "Mandarin Chinese (Native) | English (TOEFL 110)",
    contactEyebrow: "CONTACT",
    contactTitle:
      "If you are exploring users, markets, or products, let’s talk.",
    contactBody:
      "Reach out about market research, user insights, data analytics, AI workflows, or relevant opportunities. Beijing is preferred; Shanghai, Hangzhou, and Shenzhen also work.",
    copyEmail: "Copy email",
    copyPhone: "Copy phone",
    emailCopied: "Email copied",
    phoneCopied: "Phone copied",
    emailLabel: "Email",
    phoneLabel: "Phone",
    commandEyebrow: "QUICK ACCESS",
    commandTitle: "Where to?",
    commandClose: "Close",
    commandNavigate: "Navigate",
    commandContact: "Contact & links",
    commandGithub: "Open GitHub",
    updated: `Updated ${resumeRelease.updatedAt}`,
    backTop: "Back to top",
  },
} as const;

type HeaderTheme = "light" | "night" | "teal";
type CopiedField = "email" | "phone" | null;

function Arrow({ direction = "right" }: { direction?: "right" | "up" }) {
  return (
    <svg
      aria-hidden="true"
      className={direction === "up" ? "icon icon-up" : "icon"}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 16h12" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="globe-icon"
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle cx="10" cy="10" r="7.25" />
      <path d="M2.9 10h14.2M10 2.75c2 2.05 3 4.47 3 7.25s-1 5.2-3 7.25c-2-2.05-3-4.47-3-7.25s1-5.2 3-7.25Z" />
    </svg>
  );
}

function ResearchVisual({
  index,
  language,
}: {
  index: string;
  language: Language;
}) {
  if (index === "01") {
    return (
      <div className="research-visual visual-markets" aria-hidden="true">
        <p>{language === "zh" ? "市场信号 → 可比口径" : "MARKET SIGNALS → COMPARABLE VIEW"}</p>
        <div className="market-orbit">
          <span className="market-core">TOTAL</span>
          {["US", "UK", "DE", "JP", "KR", "ID", "BR"].map((market) => (
            <span className="market-node" key={market}>
              {market}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (index === "02") {
    const nodes =
      language === "zh"
        ? ["需求", "搜索", "体验", "心智"]
        : ["NEED", "SEARCH", "EXPERIENCE", "MINDSET"];
    return (
      <div className="research-visual visual-journey" aria-hidden="true">
        <p>{language === "zh" ? "用户路径" : "USER JOURNEY"}</p>
        <div className="journey-line">
          {nodes.map((node, nodeIndex) => (
            <span key={node}>
              <i>0{nodeIndex + 1}</i>
              <b>{node}</b>
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (index === "03") {
    return (
      <div className="research-visual visual-segments" aria-hidden="true">
        <p>{language === "zh" ? "人群 × 内容 × 行为" : "AUDIENCE × CONTENT × BEHAVIOR"}</p>
        <div className="segment-map">
          <span className="segment-circle segment-a">A</span>
          <span className="segment-circle segment-b">B</span>
          <span className="segment-circle segment-c">C</span>
          <div className="segment-bars">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="research-visual visual-context" aria-hidden="true">
      <p>{language === "zh" ? "可比性 × 情境差异" : "COMPARABILITY × CONTEXT"}</p>
      <div className="context-grid">
        <span>01</span>
        <span>02</span>
        <span>03</span>
        <span>04</span>
        <strong>{language === "zh" ? "本地语境" : "LOCAL CONTEXT"}</strong>
      </div>
    </div>
  );
}

function ResearchDataMap({ language }: { language: Language }) {
  const steps = language === "zh"
    ? [
        ["资料与定义", "市场资料 · 商品信息 · 来源与时间"],
        ["研究数据库", "品类 · 渠道 · 商品 · 指标口径"],
        ["查询与分析", "筛选 · 比较 · 明细 · 导出"],
      ]
    : [
        ["Sources & definitions", "Market information · Products · Source dates"],
        ["Research database", "Categories · Channels · Products · Metrics"],
        ["Explore & analyze", "Filter · Compare · Inspect · Export"],
      ];

  return (
    <div className="research-data-map">
      <p className="mini-label">RESEARCH DATA</p>
      <ol>
        {steps.map(([title, detail], index) => (
          <li key={title}>
            <span aria-hidden="true">0{index + 1}</span>
            <div><strong>{title}</strong><p>{detail}</p></div>
            {index < steps.length - 1 ? <span className="data-step-arrow" aria-hidden="true">↓</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProjectCard({ project, language, featured = false }: {
  project: (typeof projects)[number];
  language: Language;
  featured?: boolean;
}) {
  const t = copy[language];
  return (
    <article className={`project-card${featured ? " project-featured" : ""}`}>
      {featured ? <ResearchDataMap language={language} /> : null}
      <div className="project-content">
        <div className="project-meta"><span>{project.index}</span><span>{project.type[language]}</span></div>
        <h3>{project.title[language]}</h3>
        <p className="project-summary">{project.summary[language]}</p>
        <dl className="project-facts">
          <div><dt>{t.projectProblem}</dt><dd>{project.problem[language]}</dd></div>
          <div><dt>{t.projectContribution}</dt><dd>{project.contribution[language]}</dd></div>
          <div><dt>{t.projectOutcome}</dt><dd>{project.outcome[language]}</dd></div>
        </dl>
        <ul className="project-tags" aria-label={language === "zh" ? "技术与方法" : "Technology and methods"}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        {"liveUrl" in project && "sourceUrl" in project ? (
          <div className="project-links">
            <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">{t.viewLive}<Arrow /></a>
            <a className="button button-ghost" href={project.sourceUrl} target="_blank" rel="noreferrer">{t.viewSource}<Arrow /></a>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ResumeSite({ language }: { language: Language }) {
  const [copiedField, setCopiedField] = useState<CopiedField>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>("light");
  const t = copy[language];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const currentExperience = experiences[0];
  const earlierExperience = experiences[1];
  const selectedCase = cases[activeCase];
  const selectedWorkflow = workflow[activeWorkflow];

  useEffect(() => {
    let animationFrame = 0;

    function updateHeaderTheme() {
      animationFrame = 0;
      const header = document.querySelector<HTMLElement>(
        ".site-header-shell",
      );
      const sampleY = header
        ? Math.max(1, header.getBoundingClientRect().bottom + 1)
        : 71;
      let nextTheme: HeaderTheme = "light";

      document
        .querySelectorAll<HTMLElement>("[data-header-theme]")
        .forEach((section) => {
          const bounds = section.getBoundingClientRect();
          if (bounds.top <= sampleY && bounds.bottom > sampleY) {
            const theme = section.dataset.headerTheme;
            if (theme === "night" || theme === "teal") {
              nextTheme = theme;
            }
          }
        });

      setHeaderTheme((current) =>
        current === nextTheme ? current : nextTheme,
      );
    }

    function scheduleHeaderUpdate() {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateHeaderTheme);
      }
    }

    updateHeaderTheme();
    window.addEventListener("scroll", scheduleHeaderUpdate, { passive: true });
    window.addEventListener("resize", scheduleHeaderUpdate);
    window.addEventListener("hashchange", scheduleHeaderUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleHeaderUpdate);
      window.removeEventListener("resize", scheduleHeaderUpdate);
      window.removeEventListener("hashchange", scheduleHeaderUpdate);
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = commandOpen ? "hidden" : "";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [commandOpen]);

  async function copyValue(value: string, field: Exclude<CopiedField, null>) {
    let copied = false;

    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      copied = document.execCommand("copy");
      textArea.remove();
    }

    if (copied) {
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1800);
    }
  }

  function navigateTo(target: string) {
    setCommandOpen(false);
    window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  return (
    <main
      id="top"
      lang={language === "zh" ? "zh-CN" : "en"}
      className={`site-shell language-${language}`}
    >
      <a className="skip-link" href="#content">
        {language === "zh" ? "跳至主要内容" : "Skip to main content"}
      </a>

      <header
        className={`site-header-shell header-${headerTheme}`}
        data-theme={headerTheme}
      >
        <div className="site-header">
          <a
            className="brand"
            href="#top"
            aria-label={profile.namePair[language]}
          >
            <span className="brand-mark">RW</span>
            <span className="brand-name">{profile.namePair[language]}</span>
          </a>
          <nav
            className="desktop-nav"
            aria-label={
              language === "zh" ? "主导航" : "Primary navigation"
            }
          >
            {t.nav.map(([label, target]) => (
              <a key={target} href={`#${target}`}>
                {label}
              </a>
            ))}
          </nav>
          <div
            className="language-switch"
            aria-label={
              language === "zh" ? "语言切换" : "Language switcher"
            }
          >
            <GlobeIcon />
            <a
              className={language === "zh" ? "active" : ""}
              aria-current={language === "zh" ? "page" : undefined}
              href={`${basePath}/`}
            >
              中
            </a>
            <span aria-hidden="true">/</span>
            <a
              className={language === "en" ? "active" : ""}
              aria-current={language === "en" ? "page" : undefined}
              href={`${basePath}/en/`}
            >
              EN
            </a>
            <button
              className="command-trigger"
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label={
                language === "zh"
                  ? "打开快速访问"
                  : "Open quick access"
              }
              title={t.commandHint}
            >
              ⌘K
            </button>
          </div>
        </div>
      </header>

      <section id="content" className="hero section-pad">
        <div className="hero-copy">
          <div className="status-line">
            <span className="status-dot" aria-hidden="true" />
            {profile.role[language]} · {profile.location[language]}
          </div>
          <p className="hero-name">{profile.namePair[language]}</p>
          <h1>{profile.headline[language]}</h1>
          <p className="hero-positioning">{profile.positioning[language]}</p>
          <p className="hero-summary">{profile.summary[language]}</p>
          <dl className="hero-facts">
            {t.heroFacts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="hero-actions">
            <a className="button button-primary" href="#experience">
              {t.viewWork}
              <Arrow />
            </a>
            <a
              className="button button-ghost"
              href={`${basePath}/resume/rui-wang-resume-zh.pdf?v=${resumeRelease.contentVersion}`}
              download={resumeRelease.downloadFileName}
            >
              {t.download}
              <DownloadIcon />
            </a>
          </div>
          <p className="availability">{t.availability}</p>
        </div>

        <aside className="profile-card" aria-label={t.profileCurrentValue}>
          <div className="profile-card-index">
            <span>{t.profileIndex}</span>
            <span>BEIJING · 2026</span>
          </div>
          <div className="profile-card-identity">
            <div className="portrait-crop">
              <Image
                src={`${basePath}/images/rui-wang-portrait.jpg`}
                alt={
                  language === "zh"
                    ? "王睿的职业照片"
                    : "Professional portrait of Rui Wang"
                }
                width={1023}
                height={1144}
                priority
              />
            </div>
            <div>
              <span>RUI WANG</span>
              <strong>王睿</strong>
              <p>Research Executive</p>
            </div>
          </div>
          <dl className="profile-card-facts">
            <div>
              <dt>{t.profileCurrent}</dt>
              <dd>{t.profileCurrentValue}</dd>
            </div>
            <div>
              <dt>{t.profileFocus}</dt>
              <dd>{t.profileFocusValue}</dd>
            </div>
            <div>
              <dt>{t.profileBuilding}</dt>
              <dd>{t.profileBuildingValue}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section id="experience" className="experience-section section-pad">
        <p className="eyebrow">{t.experienceEyebrow}</p>
        <div className="section-heading-grid">
          <h2 className="section-title">{t.experienceTitle}</h2>
          <dl className="role-facts">
            <div>
              <dt>{t.clientScope}</dt>
              <dd>{t.clientScopeValue}</dd>
            </div>
            <div>
              <dt>{t.researchScope}</dt>
              <dd>{t.researchScopeValue}</dd>
            </div>
            <div>
              <dt>{t.researchMix}</dt>
              <dd>{t.researchMixValue}</dd>
            </div>
          </dl>
        </div>

        <article className="featured-role">
          <header className="featured-role-heading">
            <div className="role-index">01</div>
            <div>
              <p>{currentExperience.period[language]}</p>
              <h3>{currentExperience.company[language]}</h3>
              <strong>{currentExperience.title[language]}</strong>
            </div>
            <span>{currentExperience.meta[language]}</span>
          </header>
          <p className="featured-role-summary">
            {currentExperience.summary[language]}
          </p>
          <div className="role-grid">
            {currentExperience.bullets.map((bullet, index) => (
              <div className="role-point" key={bullet.label.en}>
                <span>0{index + 1}</span>
                <h4>{bullet.label[language]}</h4>
                <p>{bullet.text[language]}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="earlier-role">
          <div>
            <span>{t.earlierExperience}</span>
            <strong>02</strong>
          </div>
          <p>{earlierExperience.period[language]}</p>
          <div>
            <h3>{earlierExperience.company[language]}</h3>
            <strong>{earlierExperience.title[language]}</strong>
            <p>{earlierExperience.summary[language]}</p>
          </div>
          <span>{earlierExperience.meta[language]}</span>
        </article>
      </section>

      <section className="about section-pad">
        <p className="eyebrow">{t.introEyebrow}</p>
        <div className="section-intro two-column-intro">
          <h2>{t.introTitle}</h2>
          <div>
            <p className="lead">{t.introBody}</p>
            <p className="supporting-copy">{t.introNote}</p>
          </div>
        </div>
        <div className="research-chain">
          <div className="chain-heading">
            <span>{t.chainLabel}</span>
            <span>01 → 05</span>
          </div>
          <ol>
            {t.researchChain.map((stage, index) => (
              <li key={stage}>
                <span>0{index + 1}</span>
                <strong>{stage}</strong>
              </li>
            ))}
          </ol>
          <p>{t.chainOwner}</p>
        </div>
      </section>

      <section
        id="work"
        className="work-section"
        data-header-theme="night"
      >
        <div className="work-inner">
          <p className="eyebrow eyebrow-light">{t.workEyebrow}</p>
          <div className="work-heading">
            <h2>{t.workTitle}</h2>
            <div>
              <p>{t.workIntro}</p>
            </div>
          </div>

          <div className="case-showcase">
            <div
              className="case-tabs"
              role="tablist"
              aria-label={t.selectCase}
            >
              {cases.map((item, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCase === index}
                  aria-controls="case-panel"
                  className={activeCase === index ? "active" : ""}
                  key={item.index}
                  onClick={() => setActiveCase(index)}
                >
                  <span>{item.index}</span>
                  <span>
                    <strong>{item.title[language]}</strong>
                    <small>{item.scope[language]}</small>
                  </span>
                  <Arrow />
                </button>
              ))}
            </div>

            <article
              id="case-panel"
              className="case-panel"
              role="tabpanel"
              aria-live="polite"
            >
              <ResearchVisual
                index={selectedCase.index}
                language={language}
              />
              <div className="case-panel-heading">
                <span>{selectedCase.index} / 04</span>
                <div>
                  <h3>{selectedCase.title[language]}</h3>
                  <p>{selectedCase.scope[language]}</p>
                </div>
              </div>
              <dl className="case-details">
                <div className="case-role">
                  <dt>{t.role}</dt>
                  <dd>{selectedCase.role[language]}</dd>
                </div>
                <div>
                  <dt>{t.challenge}</dt>
                  <dd>{selectedCase.problem[language]}</dd>
                </div>
                <div>
                  <dt>{t.approach}</dt>
                  <dd>{selectedCase.approach[language]}</dd>
                </div>
                <div>
                  <dt>{t.value}</dt>
                  <dd>{selectedCase.value[language]}</dd>
                </div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      <section id="method" className="method-section section-pad">
        <p className="eyebrow">{t.methodEyebrow}</p>
        <div className="method-heading">
          <h2>{t.methodTitle}</h2>
          <div>
            <p>{t.methodIntro}</p>
            <span>{t.methodSignal}</span>
          </div>
        </div>

        <div className="workflow-system">
          <div
            className="workflow-tabs"
            role="tablist"
            aria-label={
              language === "zh" ? "选择研究阶段" : "Select a research stage"
            }
          >
            {workflow.map((stage, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeWorkflow === index}
                aria-controls="workflow-panel"
                className={activeWorkflow === index ? "active" : ""}
                onClick={() => setActiveWorkflow(index)}
                key={stage.number}
              >
                <span>{stage.number}</span>
                <strong>{stage.title[language]}</strong>
              </button>
            ))}
          </div>
          <div
            id="workflow-panel"
            className="workflow-panel"
            role="tabpanel"
            aria-live="polite"
          >
            <div className="workflow-panel-title">
              <span>{selectedWorkflow.number}</span>
              <h3>{selectedWorkflow.title[language]}</h3>
            </div>
            <div className="human-ai-pair">
              <article>
                <span className="role-tag role-tag-human">{t.researcher}</span>
                <p>{selectedWorkflow.human[language]}</p>
              </article>
              <div className="collaboration-mark" aria-hidden="true">
                <span>×</span>
                <small>HUMAN / AI</small>
              </div>
              <article>
                <span className="role-tag role-tag-ai">{t.codex}</span>
                <p>{selectedWorkflow.ai[language]}</p>
              </article>
            </div>
          </div>
        </div>
        <p className="method-footnote">{t.methodFoot}</p>
      </section>

      <section id="projects" className="projects-section section-pad">
        <p className="eyebrow">{t.projectsEyebrow}</p>
        <div className="projects-heading">
          <h2>{t.projectsTitle}</h2>
          <div>
            <p>{t.projectsIntro}</p>
            <button
              type="button"
              className="shortcut-hint"
              onClick={() => setCommandOpen(true)}
            >
              <span aria-hidden="true">⌘K</span>
              {t.commandHint}
            </button>
          </div>
        </div>

        <div className="project-list">
          <ProjectCard project={projects[0]} language={language} featured />
          <details className="other-projects">
            <summary><span>{t.moreProjects}</span><span className="other-projects-count">{projects.length - 1}</span><Arrow /></summary>
            <div className="secondary-project-list">
              {projects.slice(1).map((project) => <ProjectCard key={project.index} project={project} language={language} />)}
            </div>
          </details>
        </div>
      </section>

      <section id="capabilities" className="capabilities-section section-pad">
        <p className="eyebrow">{t.capabilityEyebrow}</p>
        <div className="capability-heading">
          <h2 className="section-title">{t.capabilityTitle}</h2>
          <p>{t.capabilityIntro}</p>
        </div>
        <div className="capability-list">
          {capabilities.map((capability, index) => (
            <article key={capability.title.en}>
              <span>0{index + 1}</span>
              <h3>{capability.title[language]}</h3>
              <p>{capability.items[language]}</p>
            </article>
          ))}
        </div>

        <div className="education-grid">
          <article>
            <p className="mini-label">{t.education}</p>
            <p className="education-time">{education.period}</p>
            <h3>{education.institution[language]}</h3>
            <p>{education.degree[language]}</p>
            <strong>{education.focus[language]}</strong>
            <span>{education.coursework[language]}</span>
          </article>
          <article className="language-card">
            <p className="mini-label">{t.languages}</p>
            <h3>{t.languageValue}</h3>
            <div aria-hidden="true" className="language-monogram">
              中<span>A</span>
            </div>
          </article>
        </div>
      </section>

      <section
        id="contact"
        className="contact-section"
        data-header-theme="teal"
      >
        <div className="contact-inner">
          <p className="eyebrow eyebrow-light">{t.contactEyebrow}</p>
          <div className="contact-grid">
            <h2>{t.contactTitle}</h2>
            <div>
              <p>{t.contactBody}</p>
              <div className="contact-actions">
                <button
                  className="button button-light"
                  type="button"
                  onClick={() => copyValue(profile.email, "email")}
                  aria-live="polite"
                >
                  {copiedField === "email"
                    ? t.emailCopied
                    : t.copyEmail}
                  <span aria-hidden="true">01</span>
                </button>
                <button
                  className="button button-outline-light"
                  type="button"
                  onClick={() => copyValue(profile.phone.href, "phone")}
                  aria-live="polite"
                >
                  {copiedField === "phone"
                    ? t.phoneCopied
                    : t.copyPhone}
                  <span aria-hidden="true">02</span>
                </button>
              </div>
              <dl className="contact-details">
                <div>
                  <dt>{t.emailLabel}</dt>
                  <dd>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>{t.phoneLabel}</dt>
                  <dd>
                    <a href={`tel:${profile.phone.href}`}>
                      {profile.phone.display}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div>
          <span>{profile.namePair[language]}</span>
          <span>{profile.positioning[language]}</span>
        </div>
        <div>
          <span>{t.updated}</span>
          <a href="#top">
            {t.backTop}
            <Arrow direction="up" />
          </a>
        </div>
      </footer>

      {commandOpen ? (
        <div
          className="command-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setCommandOpen(false);
            }
          }}
        >
          <section
            className="command-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-title"
          >
            <header>
              <div>
                <p>{t.commandEyebrow}</p>
                <h2 id="command-title">{t.commandTitle}</h2>
              </div>
              <button
                type="button"
                onClick={() => setCommandOpen(false)}
                autoFocus
              >
                {t.commandClose}
                <span aria-hidden="true">Esc</span>
              </button>
            </header>
            <div className="command-group">
              <p>{t.commandNavigate}</p>
              <div>
                {t.nav.map(([label, target], index) => (
                  <button
                    type="button"
                    onClick={() => navigateTo(target)}
                    key={target}
                  >
                    <span>0{index + 1}</span>
                    <strong>{label}</strong>
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
                <button type="button" onClick={() => navigateTo("contact")}>
                  <span>0{t.nav.length + 1}</span>
                  <strong>
                    {language === "zh" ? "联系方式" : "Contact"}
                  </strong>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            <div className="command-group command-utilities">
              <p>{t.commandContact}</p>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    void copyValue(profile.email, "email");
                    setCommandOpen(false);
                  }}
                >
                  <span>↗</span>
                  <strong>{t.copyEmail}</strong>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void copyValue(profile.phone.href, "phone");
                    setCommandOpen(false);
                  }}
                >
                  <span>↗</span>
                  <strong>{t.copyPhone}</strong>
                </button>
                <a
                  href="https://github.com/Bruc3wAng/rui-wang-resume"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setCommandOpen(false)}
                >
                  <span>↗</span>
                  <strong>{t.commandGithub}</strong>
                </a>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <div className="copy-toast" role="status" aria-live="polite">
        {copiedField === "email"
          ? t.emailCopied
          : copiedField === "phone"
            ? t.phoneCopied
            : ""}
      </div>
    </main>
  );
}

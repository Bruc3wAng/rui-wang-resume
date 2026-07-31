"use client";

import { useState } from "react";
import Image from "next/image";
import {
  capabilities,
  cases,
  education,
  experiences,
  type Language,
  profile,
  workflow,
} from "../content/resume";

const copy = {
  zh: {
    nav: [
      ["经历", "experience"],
      ["研究案例", "work"],
      ["AI 方法", "method"],
      ["能力", "capabilities"],
    ],
    availability: "现居北京 · 关注市场研究、用户洞察、数据分析与研究策略机会",
    viewWork: "查看脱敏研究案例",
    download: "下载中文简历",
    profileIndex: "PROFILE / 01",
    profileCurrent: "当前",
    profileFocus: "专业重心",
    profileBuilding: "AI 实践",
    profileCurrentValue: "Ipsos · Research Executive",
    profileFocusValue: "定量研究与多市场洞察",
    profileBuildingValue: "正式交付中的人机协作工作流",
    heroFacts: [
      ["研究方法", "定量主导 · 定性补充"],
      ["研究范围", "海外用户 · 品牌 · 产品"],
      ["多市场经验", "Tracking 覆盖 7 个海外市场"],
    ],
    introEyebrow: "HOW I WORK / 工作方式",
    introTitle: "从研究设计到交付审核，完整推进复杂研究项目。",
    introBody:
      "我的核心价值不在于完成某一个执行环节，而在于让整条研究链路保持一致：前期把业务问题转化为可验证的研究设计，中期统筹多市场执行并判断质量风险，后期完成分析诊断、洞察提炼与交付复核。",
    introNote:
      "我负责研究员必须承担的判断：定义口径、处理例外、评估业务影响并对最终输出负责；工具用于批量处理、计算、比对与校验。",
    researchChain: ["业务问题", "研究设计", "多市场执行", "分析诊断", "决策支持"],
    chainLabel: "一条完整的研究链路",
    chainOwner: "贯穿全程：口径定义、例外判断、风险治理与沟通推动",
    experienceEyebrow: "EXPERIENCE / 工作经历",
    experienceTitle: "Ipsos｜Research Executive（数据研究分析）",
    clientScope: "客户范围",
    clientScopeValue: "字节跳动、联想等核心客户",
    researchScope: "研究主题",
    researchScopeValue: "海外用户、品牌 Tracking、人群洞察与产品体验",
    researchMix: "方法组合",
    researchMixValue: "定量为主 · 定性为辅",
    earlierExperience: "EARLIER EXPERIENCE",
    workEyebrow: "SELECTED WORK / 脱敏研究案例",
    workTitle: "代表性研究场景与方法（已脱敏）。",
    workIntro:
      "案例覆盖品牌追踪、搜索体验、内容消费与海外产品用研，重点呈现研究问题、本人角色、分析方法与决策价值。",
    workNote: "公开版本已移除内部项目名、样本明细、业务数据与未公开结论。",
    role: "我的角色",
    challenge: "研究问题",
    approach: "分析方法",
    value: "决策价值",
    selectCase: "切换研究案例",
    methodEyebrow: "HUMAN × AI / 研究方法",
    methodTitle: "AI 研究工作流：覆盖设计、执行、数据质量与交付审核。",
    methodIntro:
      "不是让 AI 代替研究判断，而是把研究规范、校验逻辑、异常处理与结构化留痕做成可复用系统。当前工作流覆盖 4 个核心研究阶段和 7 类关键节点，已经进入正式交付并被同事复用。",
    methodSignal: "4 个研究阶段 · 7 类关键节点 · 正式交付 / 团队复用",
    researcher: "研究员负责",
    codex: "Codex 承担",
    methodFoot:
      "研究员始终负责范围与定义、例外判断、业务影响、客户反馈和最终批准；Codex 负责批量阅读、计算、比对与结构化生成。清晰的人机边界，是效率能够转化为质量的前提。",
    capabilityEyebrow: "CAPABILITY STACK / 能力组合",
    capabilityTitle: "面向市场研究、数据分析与研究运营的能力组合。",
    capabilityIntro:
      "我用研究方法定义问题，用分析能力建立证据，用项目运营推动复杂协作，再用 AI 把可重复的方法沉淀下来。",
    education: "教育背景",
    languages: "语言",
    languageValue: "普通话（母语）｜英语（TOEFL 110）",
    contactEyebrow: "CONTACT / 联系方式",
    contactTitle: "开放市场研究、用户洞察、数据分析与研究策略机会。",
    contactBody:
      "优先考虑北京机会，也可接受上海、杭州与深圳。目标方向包括市场研究、用户洞察、数据分析及研究 / 策略运营。",
    emailMe: "发送邮件",
    copyEmail: "复制邮箱",
    copied: "已复制",
    publicNote: "公开主页 · 客户与案例信息已按披露边界处理",
    updated: "更新于 2026.07",
    backTop: "返回顶部",
  },
  en: {
    nav: [
      ["Experience", "experience"],
      ["Selected work", "work"],
      ["AI method", "method"],
      ["Capabilities", "capabilities"],
    ],
    availability:
      "Based in Beijing · Exploring opportunities in market research, user insights, analytics, and research strategy",
    viewWork: "Explore selected work",
    download: "Download Chinese résumé",
    profileIndex: "PROFILE / 01",
    profileCurrent: "Current",
    profileFocus: "Focus",
    profileBuilding: "AI practice",
    profileCurrentValue: "Ipsos · Research Executive",
    profileFocusValue: "Quantitative & multi-market insight",
    profileBuildingValue: "Human–AI workflows in live delivery",
    heroFacts: [
      ["Research mix", "Quantitative-led · Qualitative support"],
      ["Research scope", "International users · Brand · Product"],
      ["Multi-market work", "Tracking across seven international markets"],
    ],
    introEyebrow: "HOW I WORK",
    introTitle:
      "Moving complex research from study design through to delivery review.",
    introBody:
      "My value is not limited to one execution task. I keep the full research chain coherent: translating business questions into testable designs, coordinating multi-market execution and quality risk, then carrying the evidence through analytical diagnosis, insight synthesis, and delivery review.",
    introNote:
      "I own the judgments a researcher must make: defining metrics, resolving exceptions, assessing business impact, and approving final output. Tools support batch processing, calculation, comparison, and validation.",
    researchChain: [
      "Business question",
      "Research design",
      "Multi-market execution",
      "Analytical diagnosis",
      "Decision support",
    ],
    chainLabel: "One connected research chain",
    chainOwner:
      "Across every stage: definitions, exception judgment, risk governance, and alignment",
    experienceEyebrow: "EXPERIENCE",
    experienceTitle: "Ipsos | Research Executive",
    clientScope: "Client scope",
    clientScopeValue: "Core clients including ByteDance and Lenovo",
    researchScope: "Research themes",
    researchScopeValue:
      "International users, brand tracking, audience insights, and product experience",
    researchMix: "Research mix",
    researchMixValue: "Quantitative-led · Qualitative support",
    earlierExperience: "EARLIER EXPERIENCE",
    workEyebrow: "SELECTED WORK · ANONYMIZED",
    workTitle: "Selected research contexts and methods (anonymized).",
    workIntro:
      "The cases span brand tracking, search experience, content consumption, and overseas product research, focusing on the research question, my role, analytical approach, and decision value.",
    workNote:
      "Internal project names, sample details, business data, and unpublished findings have been removed.",
    role: "My role",
    challenge: "Research question",
    approach: "Analytical approach",
    value: "Decision value",
    selectCase: "Select a research case",
    methodEyebrow: "HUMAN × AI · RESEARCH METHOD",
    methodTitle:
      "An AI research workflow across design, execution, data quality, and delivery review.",
    methodIntro:
      "The goal is not to outsource judgment. I turn research standards, validation logic, exception handling, and traceability into a reusable operating system. The workflow now spans four core stages and seven types of critical nodes, and is used in live delivery and by colleagues.",
    methodSignal:
      "4 research stages · 7 node types · Live delivery / team reuse",
    researcher: "Researcher owns",
    codex: "Codex handles",
    methodFoot:
      "The researcher always owns scope and definitions, exception judgment, business impact, client feedback, and final approval. Codex supports batch reading, calculation, comparison, and structured generation. Clear ownership is what turns speed into research quality.",
    capabilityEyebrow: "CAPABILITY STACK",
    capabilityTitle:
      "A capability stack for market research, analytics, and research operations.",
    capabilityIntro:
      "I use research methods to frame the problem, analytics to build the evidence, project operations to move complex collaboration forward, and AI to make repeatable methods reusable.",
    education: "Education",
    languages: "Languages",
    languageValue: "Mandarin Chinese (Native) | English (TOEFL 110)",
    contactEyebrow: "CONTACT",
    contactTitle:
      "Open to market research, user insights, analytics, and research strategy opportunities.",
    contactBody:
      "Beijing is my preferred base; I am also open to Shanghai, Hangzhou, and Shenzhen. I am interested in market research, user insights, analytics, and research or strategy operations.",
    emailMe: "Email me",
    copyEmail: "Copy email",
    copied: "Copied",
    publicNote:
      "Public profile · Client and case information follows disclosure boundaries",
    updated: "Updated Jul 2026",
    backTop: "Back to top",
  },
} as const;

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

export function ResumeSite({ language }: { language: Language }) {
  const [copied, setCopied] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const t = copy[language];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const currentExperience = experiences[0];
  const earlierExperience = experiences[1];
  const selectedCase = cases[activeCase];
  const selectedWorkflow = workflow[activeWorkflow];

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
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

      <header className="site-header">
        <a className="brand" href="#top" aria-label={profile.namePair[language]}>
          <span className="brand-mark">RW</span>
          <span className="brand-name">{profile.namePair[language]}</span>
        </a>
        <nav
          className="desktop-nav"
          aria-label={language === "zh" ? "主导航" : "Primary navigation"}
        >
          {t.nav.map(([label, target]) => (
            <a key={target} href={`#${target}`}>
              {label}
            </a>
          ))}
        </nav>
        <div
          className="language-switch"
          aria-label={language === "zh" ? "语言切换" : "Language switcher"}
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
            <a className="button button-primary" href="#work">
              {t.viewWork}
              <Arrow />
            </a>
            <a
              className="button button-ghost"
              href={`${basePath}/resume/rui-wang-resume-zh.pdf`}
              download
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

      <section id="work" className="work-section">
        <div className="work-inner">
          <p className="eyebrow eyebrow-light">{t.workEyebrow}</p>
          <div className="work-heading">
            <h2>{t.workTitle}</h2>
            <div>
              <p>{t.workIntro}</p>
              <small>{t.workNote}</small>
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

      <section className="contact-section">
        <div className="contact-inner">
          <p className="eyebrow eyebrow-light">{t.contactEyebrow}</p>
          <div className="contact-grid">
            <h2>{t.contactTitle}</h2>
            <div>
              <p>{t.contactBody}</p>
              <div className="contact-actions">
                <a className="button button-light" href={`mailto:${profile.email}`}>
                  {t.emailMe}
                  <Arrow />
                </a>
                <button
                  className="text-button"
                  type="button"
                  onClick={copyEmail}
                  aria-live="polite"
                >
                  {copied ? t.copied : t.copyEmail}
                </button>
              </div>
              <a className="email-link" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div>
          <span>{profile.namePair[language]}</span>
          <span>{t.publicNote}</span>
        </div>
        <div>
          <span>{t.updated}</span>
          <a href="#top">
            {t.backTop}
            <Arrow direction="up" />
          </a>
        </div>
      </footer>
    </main>
  );
}

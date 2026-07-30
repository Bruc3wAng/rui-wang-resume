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
      ["案例", "work"],
      ["方法", "method"],
      ["能力", "capabilities"],
    ],
    availability: "现居北京 · 开放市场研究、数据分析与研究策略机会",
    viewWork: "查看代表性研究",
    download: "下载中文简历",
    introEyebrow: "ABOUT / 个人定位",
    introTitle: "研究不是信息汇总，\n而是建立可信的决策依据。",
    introBody:
      "我的工作从定义正确的问题开始：厘清业务目标、构建测量方式、组织复杂执行，再把数据转译为可解释、可行动的判断。AI 并不替代研究判断，而是把标准、校验和重复劳动转化为稳定的工作系统。",
    experienceEyebrow: "EXPERIENCE / 工作经历",
    experienceTitle: "把研究问题推进到可交付的业务判断。",
    workEyebrow: "SELECTED WORK / 脱敏案例",
    workTitle: "四类研究问题，贯穿产品、品牌与用户决策。",
    workNote: "以下内容已按公开边界脱敏，不包含客户内部数据、项目代号、样本明细或未公开结论。",
    challenge: "研究问题",
    approach: "分析方法",
    value: "决策价值",
    methodEyebrow: "HUMAN × AI / 研究方法",
    methodTitle: "把 AI 变成研究质量系统，而不是快捷键。",
    methodIntro:
      "我将研究规范、校验逻辑和异常处理沉淀为可复用的 Codex Skills、SOP 与辅助工具。工作流覆盖 4 个核心阶段和 7 类关键节点，已进入正式交付并被同事复用。",
    researcher: "研究员",
    codex: "Codex",
    methodFoot:
      "研究员始终负责定义、例外判断、业务影响、客户反馈和最终批准；Codex 负责批量阅读、计算、比对与结构化生成。两者的边界清晰，产出才可信。",
    capabilityEyebrow: "CAPABILITIES / 专业能力",
    capabilityTitle: "研究判断、分析能力与交付系统的组合。",
    education: "教育背景",
    languages: "语言",
    languageValue: "普通话（母语）｜英语（TOEFL 110）",
    contactEyebrow: "CONTACT / 联系方式",
    contactTitle: "期待与重视研究质量与真实用户价值的团队交流。",
    contactBody:
      "优先考虑北京机会，也可接受上海、杭州与深圳。欢迎就市场研究、用户洞察、数据分析或 AI 研究工作流与我联系。",
    emailMe: "发送邮件",
    copyEmail: "复制邮箱",
    copied: "已复制",
    publicNote: "公开版本 · 案例与客户信息均已脱敏处理",
    updated: "更新于 2026.07",
    backTop: "返回顶部",
  },
  en: {
    nav: [
      ["Experience", "experience"],
      ["Selected work", "work"],
      ["Method", "method"],
      ["Capabilities", "capabilities"],
    ],
    availability:
      "Based in Beijing · Open to market research, analytics, and research strategy opportunities",
    viewWork: "Explore selected work",
    download: "Download Chinese résumé",
    introEyebrow: "ABOUT",
    introTitle: "Research is not information collection.\nIt is decision infrastructure.",
    introBody:
      "My work starts with framing the right question: clarifying the business objective, building the measurement approach, orchestrating complex execution, and translating data into explainable decisions. AI does not replace research judgment—it turns standards, validation, and repeatable work into a reliable operating system.",
    experienceEyebrow: "EXPERIENCE",
    experienceTitle: "Moving research questions through to decision-ready delivery.",
    workEyebrow: "SELECTED WORK · ANONYMIZED",
    workTitle: "Four research problem types across product, brand, and audience decisions.",
    workNote:
      "All examples follow public-disclosure boundaries and exclude internal client data, project codes, sample details, and unpublished findings.",
    challenge: "Research question",
    approach: "Analytical approach",
    value: "Decision value",
    methodEyebrow: "HUMAN × AI · RESEARCH METHOD",
    methodTitle: "Building AI into the research quality system—not treating it as a shortcut.",
    methodIntro:
      "I operationalize research standards, validation logic, and exception handling through reusable Codex Skills, SOPs, and supporting tools. The workflow spans four core stages and seven types of critical nodes, and is already used in live delivery and by colleagues.",
    researcher: "Researcher",
    codex: "Codex",
    methodFoot:
      "The researcher owns definitions, exception judgment, business impact, client feedback, and final approval. Codex supports batch reading, calculation, comparison, and structured generation. Clear ownership is what makes the output trustworthy.",
    capabilityEyebrow: "CAPABILITIES",
    capabilityTitle: "A combination of research judgment, analytical depth, and delivery systems.",
    education: "Education",
    languages: "Languages",
    languageValue: "Mandarin Chinese (Native) | English (TOEFL 110)",
    contactEyebrow: "CONTACT",
    contactTitle: "Let’s talk if your team values rigorous research and genuine user understanding.",
    contactBody:
      "Beijing is my preferred base; I am also open to opportunities in Shanghai, Hangzhou, and Shenzhen. Feel free to reach out about market research, user insights, analytics, or AI-enabled research workflows.",
    emailMe: "Email me",
    copyEmail: "Copy email",
    copied: "Copied",
    publicNote: "Public profile · Client and case information is anonymized",
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
    <svg aria-hidden="true" className="globe-icon" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.25" />
      <path d="M2.9 10h14.2M10 2.75c2 2.05 3 4.47 3 7.25s-1 5.2-3 7.25c-2-2.05-3-4.47-3-7.25s1-5.2 3-7.25Z" />
    </svg>
  );
}

export function ResumeSite({ language }: { language: Language }) {
  const [copied, setCopied] = useState(false);
  const t = copy[language];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
        <nav className="desktop-nav" aria-label={language === "zh" ? "主导航" : "Primary navigation"}>
          {t.nav.map(([label, target]) => (
            <a key={target} href={`#${target}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="language-switch" aria-label={language === "zh" ? "语言切换" : "Language switcher"}>
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
        <div className="portrait-column">
          <div className="portrait-frame">
            <span className="portrait-index">01 / PROFILE</span>
            <Image
              src={`${basePath}/images/rui-wang-portrait.jpg`}
              alt={language === "zh" ? "王睿的职业照片" : "Professional portrait of Rui Wang"}
              width={1023}
              height={1144}
              priority
            />
            <div className="portrait-caption">
              <span>{language === "zh" ? "研究 · 洞察 · 系统" : "Research · Insight · Systems"}</span>
              <span>BEIJING</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about section-pad">
        <p className="eyebrow">{t.introEyebrow}</p>
        <div className="section-intro two-column-intro">
          <h2 className="preserve-linebreaks">{t.introTitle}</h2>
          <div>
            <p className="lead">{t.introBody}</p>
            <div className="principles">
              <span>{language === "zh" ? "问题定义" : "Frame"}</span>
              <i aria-hidden="true" />
              <span>{language === "zh" ? "证据构建" : "Evidence"}</span>
              <i aria-hidden="true" />
              <span>{language === "zh" ? "判断形成" : "Decision"}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="experience-section section-pad">
        <p className="eyebrow">{t.experienceEyebrow}</p>
        <h2 className="section-title">{t.experienceTitle}</h2>
        <div className="timeline">
          {experiences.map((experience, index) => (
            <article className="timeline-item" key={experience.company.en}>
              <div className="timeline-rail">
                <span className="timeline-number">0{index + 1}</span>
                <span className="timeline-line" aria-hidden="true" />
              </div>
              <div className="timeline-period">{experience.period[language]}</div>
              <div className="timeline-content">
                <div className="role-heading">
                  <div>
                    <h3>{experience.company[language]}</h3>
                    <p>{experience.title[language]}</p>
                  </div>
                  <span>{experience.meta[language]}</span>
                </div>
                <p className="role-summary">{experience.summary[language]}</p>
                {experience.bullets.length > 0 && (
                  <div className="role-grid">
                    {experience.bullets.map((bullet) => (
                      <div className="role-point" key={bullet.label.en}>
                        <h4>{bullet.label[language]}</h4>
                        <p>{bullet.text[language]}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="work" className="work-section section-pad">
        <p className="eyebrow eyebrow-light">{t.workEyebrow}</p>
        <div className="work-heading">
          <h2>{t.workTitle}</h2>
          <p>{t.workNote}</p>
        </div>
        <div className="case-list">
          {cases.map((item) => (
            <article className="case-card" key={item.index}>
              <header>
                <span className="case-index">{item.index}</span>
                <div>
                  <h3>{item.title[language]}</h3>
                  <p>{item.scope[language]}</p>
                </div>
              </header>
              <dl>
                <div>
                  <dt>{t.challenge}</dt>
                  <dd>{item.problem[language]}</dd>
                </div>
                <div>
                  <dt>{t.approach}</dt>
                  <dd>{item.approach[language]}</dd>
                </div>
                <div>
                  <dt>{t.value}</dt>
                  <dd>{item.value[language]}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section id="method" className="method-section section-pad">
        <p className="eyebrow">{t.methodEyebrow}</p>
        <div className="method-heading">
          <h2>{t.methodTitle}</h2>
          <p>{t.methodIntro}</p>
        </div>
        <div className="workflow-grid">
          {workflow.map((stage) => (
            <article className="workflow-card" key={stage.number}>
              <header>
                <span>{stage.number}</span>
                <h3>{stage.title[language]}</h3>
              </header>
              <div>
                <p className="role-tag role-tag-human">{t.researcher}</p>
                <p>{stage.human[language]}</p>
              </div>
              <div>
                <p className="role-tag role-tag-ai">{t.codex}</p>
                <p>{stage.ai[language]}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="method-footnote">{t.methodFoot}</p>
      </section>

      <section id="capabilities" className="capabilities-section section-pad">
        <p className="eyebrow">{t.capabilityEyebrow}</p>
        <h2 className="section-title">{t.capabilityTitle}</h2>
        <div className="capability-grid">
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

      <section className="contact-section section-pad">
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

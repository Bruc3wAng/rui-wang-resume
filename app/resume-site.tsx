"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SelectedWork, AIPractice, CreativeWork } from "./ResumeChapters";
import ResumeAtmosphere from "./ResumeAtmosphere";
import "./narrative.css";
import "./chapters.css";
import resumeRelease from "../content/resume-release.json";
import {
  capabilities,
  selectedWork,
  education,
  type Language,
  profile,
} from "../content/resume";

const copy = {
  zh: {
    nav: [
      ["重点工作", "work"],
      ["AI 提效实践", "method"],
      ["个人作品", "projects"],
      ["能力", "capabilities"],
    ],
    availability: "北京 · 市场研究、用户洞察与数据分析",
    viewWork: "查看重点工作",
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
      ["工作实践", "跨市场 Tracking · 满意度与体验研究"],
    ],
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
      ["Selected work", "work"],
      ["AI practice", "method"],
      ["Projects", "projects"],
      ["Capabilities", "capabilities"],
    ],
    availability:
      "Beijing · Market research, user insights, and data analytics",
    viewWork: "Explore selected work",
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
      ["In practice", "Cross-market tracking · Experience research"],
    ],
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

const marketNames: Record<string, { zh: string; en: string; flag: string }> = {
  US: {zh: "美国", en: "United States", flag: "us"}, UK: {zh: "英国", en: "United Kingdom", flag: "gb"},
  DE: {zh: "德国", en: "Germany", flag: "de"}, JP: {zh: "日本", en: "Japan", flag: "jp"},
  ID: {zh: "印度尼西亚", en: "Indonesia", flag: "id"}, BR: {zh: "巴西", en: "Brazil", flag: "br"},
  SA: {zh: "沙特阿拉伯", en: "Saudi Arabia", flag: "sa"}, KR: {zh: "韩国", en: "South Korea", flag: "kr"},
};

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

export function ResumeSite({ language }: { language: Language }) {
  const [copiedField, setCopiedField] = useState<CopiedField>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>("light");
  const t = copy[language];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const selectedCase = selectedWork[activeCase];

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
      <ResumeAtmosphere language={language} activeCase={activeCase} activeWorkflow={activeWorkflow} />
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
          <p className="hero-name">{profile.namePair[language]}{language === "zh" ? <span>RUI WANG</span> : null}<i aria-hidden="true">✳</i></p>
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
              href={`${basePath}/resume/rui-wang-resume-zh.pdf?v=${resumeRelease.contentVersion}`}
              download={resumeRelease.downloadFileName}
            >
              {t.download}
              <DownloadIcon />
            </a>
          </div>
          <p className="availability">{t.availability}</p>
          <div className="hero-market-field">
            <div className="hero-orbit-note">{language === "zh" ? "跨市场，理解不同的用户。" : "Different markets. Different perspectives."}</div>
            <div className="atlas-guide" aria-hidden="true"><span>CONTENT</span><span>SEARCH</span><span>BRAND</span></div>
            <div className="atlas-markets" aria-label={language === "zh" ? "项目涉及市场节选，点击查看案例" : "Selected project markets. Select a flag to explore a study."}>
              {[...new Set(selectedWork.flatMap(item => item.markets))].map(market => {
                const place = marketNames[market];
                return <button type="button" key={market} className={selectedCase?.markets.includes(market) ? "active" : ""} aria-label={language === "zh" ? `${place.zh}：查看相关研究案例` : `${place.en}: view a related study`} title={place[language]} onClick={() => { setActiveCase(selectedWork.findIndex(item => item.markets.includes(market))); navigateTo("work"); }}>
                  <span className="flag-crop"><Image src={`${basePath}/images/flags/${place.flag}.svg`} alt="" width={64} height={48} unoptimized /></span><span className="market-code">{market}</span>
                </button>;
              })}
            </div>
            <div className="atlas-caption"><strong>{language === "zh" ? "项目涉及市场 · 节选" : "SELECTED PROJECT MARKETS"}</strong><span>{language === "zh" ? "从国旗进入相关研究案例 ↗" : "EXPLORE A STUDY THROUGH ITS MARKETS ↗"}</span></div>
          </div>

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
                unoptimized
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

      <SelectedWork language={language} active={activeCase} onSelect={setActiveCase} />
      <AIPractice language={language} active={activeWorkflow} onSelect={setActiveWorkflow} />
      <CreativeWork language={language} />

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

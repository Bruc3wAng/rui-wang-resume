"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type CSSProperties } from "react";
import Image from "next/image";
import { profile, selectedWork, experiences, aiPractice, creativeCategories, capabilities, education, type Language } from "../content/resume";
import details from "../content/ai-details.json";
import release from "../content/resume-release.json";
import PortfolioLight from "./PortfolioLight";
import "./portfolio.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const atlasBase = base || "https://bruc3wang.github.io/rui-wang-resume";
const local = (l: Language, zh: string, en: string) => l === "zh" ? zh : en;
const chapters = ["work", "method", "projects", "capabilities", "contact"];
const markets = [
  ["US", "us", "美国", "United States"], ["UK", "gb", "英国", "United Kingdom"],
  ["DE", "de", "德国", "Germany"], ["JP", "jp", "日本", "Japan"],
  ["ID", "id", "印度尼西亚", "Indonesia"], ["BR", "br", "巴西", "Brazil"],
  ["SA", "sa", "沙特阿拉伯", "Saudi Arabia"], ["KR", "kr", "韩国", "South Korea"],
];
const workNotes = [
  {
    question: { zh: "哪些体验因素，与用户满意度关联更强？", en: "Which experiences matter most to user satisfaction?" },
    judgment: { zh: "确认分组、加权与跨期比较条件，核对分析方法的差异，解释体验因素与满意度的关系。", en: "Define groups, weighting, and wave-comparison criteria; examine methodological differences and interpret relationships with satisfaction." },
    outputs: { zh: ["跨市场分析报告", "跨期比较", "分析方法 SOP"], en: ["Cross-market report", "Wave comparisons", "Analysis guide"] },
    nodes: { zh: ["市场与平台", "用户分组", "体验因素", "满意度分析"], en: ["Markets & platforms", "Audience groups", "Experience factors", "Satisfaction analysis"] },
  },
  {
    question: { zh: "不同客群、品类与期次，如何持续判断品牌表现？", en: "How does brand performance compare across audiences, categories, and waves?" },
    judgment: { zh: "厘清指标定义与历史可比性，追溯数据、平台和报告差异，判断哪些需要修正、哪些应保留。", en: "Align definitions and historical comparisons; trace discrepancies across data, platforms, and reports to distinguish corrections from valid differences." },
    outputs: { zh: ["多期数据与报告", "来源与指标映射", "复用程序"], en: ["Multi-wave reports", "Source & metric mapping", "Reusable tools"] },
    nodes: { zh: ["客群与品类", "指标定义", "历史可比性", "品牌表现"], en: ["Audiences & categories", "Metric definitions", "Historical comparisons", "Brand performance"] },
  },
  {
    question: { zh: "不同用户怎样消费内容，目标人群在哪里？", en: "How do audiences consume content, and where do they overlap?" },
    judgment: { zh: "组织研究执行与用户分层，比较内容偏好、消费习惯及人群重合，为目标用户和内容定位提供依据。", en: "Manage fieldwork and audience segmentation; compare preferences, consumption habits, and overlap to inform positioning." },
    outputs: { zh: ["用户分层", "偏好与习惯比较", "分析交付"], en: ["Audience segments", "Preference comparisons", "Analytical delivery"] },
    nodes: { zh: ["用户分层", "内容偏好", "消费习惯", "人群重合"], en: ["Audience segments", "Content preferences", "Consumption habits", "Audience overlap"] },
  },
  {
    question: { zh: "用户什么时候搜索，又会想到哪些平台？", en: "When do people search, and which platforms come to mind?" },
    judgment: { zh: "通过用户分层、交叉分析与趋势比较，解释不同市场与人群的搜索场景、平台认知和使用习惯。", en: "Use segmentation, cross-tabulation, and trend comparisons to examine search contexts, awareness, and habits across markets." },
    outputs: { zh: ["跨市场比较", "用户与场景分析", "批量核验工具"], en: ["Market comparisons", "Audience & context analysis", "Batch-validation tools"] },
    nodes: { zh: ["平台认知", "搜索场景", "使用习惯", "趋势比较"], en: ["Platform awareness", "Search contexts", "Usage habits", "Trend comparisons"] },
  },
  {
    question: { zh: "使用场景和采购决策背后，有哪些真实需求？", en: "What needs shape product use and purchasing decisions?" },
    judgment: { zh: "结合海外实地访谈与定量资料理解需求，协调跨语言研究执行，将用户场景与产品问题联系起来。", en: "Combine international field interviews and survey evidence, coordinate cross-language research, and connect use cases with product needs." },
    outputs: { zh: ["实地研究资料", "用户画像", "需求与决策分析"], en: ["Field-research evidence", "User profiles", "Needs & decision analysis"] },
    nodes: { zh: ["实地访谈", "用户场景", "产品需求", "采购决策"], en: ["Field interviews", "Use cases", "Product needs", "Purchasing decisions"] },
  },
];

function Arrow({ down = false }: { down?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={down ? "pf-arrow is-down" : "pf-arrow"} fill="none"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

function tabs(e: KeyboardEvent<HTMLButtonElement>, index: number, total: number, set: (i: number) => void) {
  const n = e.key === "Home" ? 0 : e.key === "End" ? total - 1 : ["ArrowRight", "ArrowDown"].includes(e.key) ? (index + 1) % total : ["ArrowLeft", "ArrowUp"].includes(e.key) ? (index + total - 1) % total : -1;
  if (n < 0) return; e.preventDefault(); set(n);
  e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[n]?.focus();
}

function tilt(e: PointerEvent<HTMLElement>, paused: boolean) {
  if (paused || e.pointerType === "touch") return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--rx", `${(.5 - (e.clientY - r.top) / r.height) * 7}deg`);
  e.currentTarget.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - .5) * 9}deg`);
}
function resetTilt(e: PointerEvent<HTMLElement>) { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); }

function ResearchObject({ active, language }: { active: number; language: Language }) {
  const note = workNotes[active];
  return <div className={`pf-research-object object-${active}`}>
    <div className="pf-object-orbit" aria-hidden="true" />
    <div className="pf-report-sheet sheet-back" aria-hidden="true" />
    <div className="pf-report-sheet sheet-middle" aria-hidden="true" />
    <div className="pf-report-cover">
      <div className="pf-report-top"><span>RESEARCH / {selectedWork[active].index}</span><span>RUI WANG</span></div>
      <h4>{selectedWork[active].title[language]}</h4>
      <div className="pf-report-map">
        <svg viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true"><path d="M80 47H320V173H80Z"/><path className="pf-trace" d="M80 47H320V173H80V47"/><path d="M80 47 320 173M320 47 80 173"/></svg>
        {note.nodes[language].map((n, i) => <div key={n} className={`pf-map-node map-node-${i}`}><i aria-hidden="true"/><span>{n}</span></div>)}
        <span className="pf-map-center" aria-hidden="true">+</span>
      </div>
      <div className="pf-report-bottom"><span>{local(language, "分析与研究交付", "ANALYSIS & RESEARCH DELIVERY")}</span><span>↗</span></div>
    </div>
    <div className="pf-object-shadow" aria-hidden="true" />
  </div>;
}

function Work({ language, active, setActive, paused }: { language: Language; active: number; setActive: (n: number) => void; paused: boolean }) {
  const earlier = experiences[1];
  return <section className="pf-work pf-section" id="work" data-tone="light">
    <div className="pf-wrap">
      <div className="pf-section-head"><div><p className="pf-eyebrow">01 / SELECTED WORK</p><h2>{local(language, "重点工作", "Selected work")}</h2></div><p>{local(language, "多国研究、统计分析与研究交付。", "Multi-country studies, statistical analysis, and research delivery.")}</p></div>
      <div className="pf-employment"><div><h3>Ipsos <span>Research Executive</span></h3><p>{experiences[0].period[language]}<span>·</span>{experiences[0].meta[language]}</p></div><div className="pf-clients"><span>{local(language, "服务字节跳动与联想", "Serving ByteDance and Lenovo")}</span><div><Image src={`${base}/images/clients/bytedance.svg`} width={130} height={24} alt="ByteDance" unoptimized/><Image src={`${base}/images/clients/lenovo.svg`} className="pf-lenovo" width={24} height={72} alt="Lenovo" unoptimized/></div></div></div>
      <div className="pf-work-layout">
        <div className="pf-work-nav" role="tablist" aria-label={local(language, "选择研究项目", "Select a research project")} aria-orientation="vertical">
          {selectedWork.map((p, i) => <button role="tab" key={p.id} id={`pf-work-tab-${i}`} aria-controls={`pf-work-panel-${i}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => tabs(e, i, selectedWork.length, setActive)}><span>{p.index}</span><div><strong>{p.title[language]}</strong><small>{p.scope[language]}</small></div><span className="pf-tab-arrow" aria-hidden="true">↗</span></button>)}
        </div>
        {selectedWork.map((item, index) => { const note = workNotes[index]; return <article key={item.id} hidden={active !== index} className="pf-work-panel" id={`pf-work-panel-${index}`} role="tabpanel" aria-labelledby={`pf-work-tab-${index}`}>
          <div className="pf-work-story" key={item.id}><p className="pf-role">{item.role[language]}</p><h3>{note.question[language]}</h3><p className="pf-work-summary">{item.summary[language]}</p><details className="pf-deeper"><summary>{local(language, "我的关键判断", "My analytical contribution")}<span aria-hidden="true">＋</span></summary><p>{note.judgment[language]}</p></details><div className="pf-deliverables"><span>{local(language, "研究交付", "Deliverables")}</span>{note.outputs[language].map(v => <strong key={v}>{v}</strong>)}</div></div>
          <div className="pf-object-stage" onPointerMove={e => tilt(e, paused)} onPointerLeave={resetTilt}><ResearchObject active={index} language={language}/></div>
        </article>; })}
      </div>
      <details className="pf-internship"><summary><span>2024.05 — 2024.08</span><strong>{earlier.company[language]} · {earlier.title[language]}</strong><span>{local(language, "查看实习经历", "Earlier experience")} ＋</span></summary><div>{earlier.bullets.map(b => <article key={b.label.en}><h3>{b.label[language]}</h3><p>{b.text[language]}</p></article>)}</div></details>
    </div>
  </section>;
}

function AIObject({ practice, stage, language }: { practice: number; stage: number; language: Language }) {
  const words = details[practice].stages[stage].visual[language];
  const output = aiPractice[practice].outputLabels;
  return <div className={`pf-ai-object ai-stage-${stage}`}>
    <div className="pf-ai-platform" aria-hidden="true"/>
    {stage === 0 ? <div className="pf-rule-glass"><div className="pf-object-label">RESEARCH JUDGMENT</div><span className="pf-rule-index">01</span><h4>{local(language, "先确定研究规则", "Define the research rules")}</h4><div className="pf-rule-lines">{words.slice(1, 5).map((w, i) => <div key={w}><span>0{i + 1}</span><strong>{w}</strong><i aria-hidden="true">✓</i></div>)}</div><p>{words[5]}</p></div> : stage === 1 ? <div className="pf-ai-engine"><div className="pf-engine-head"><span>RESEARCH × AI</span><i aria-hidden="true"/></div><div className="pf-processor"><span>{local(language, "批量执行", "BATCH EXECUTION")}</span><strong>Codex</strong></div><div className="pf-engine-track">{words.slice(2, 6).map((w, i) => <div key={w}><span>0{i + 1}</span><strong>{w}</strong><i aria-hidden="true"/></div>)}</div><div className="pf-engine-out"><span>{local(language, "研究员复核", "RESEARCHER REVIEW")}</span><span>↗</span></div></div> : <div className="pf-output-library">{output.map((v, i) => <div key={v.en} className={`pf-output-volume volume-${i}`}><span>{["RESEARCH", "COMPARISON", "REUSABLE"][i]}</span><h4>{v[language]}</h4><div className="pf-volume-lines" aria-hidden="true"><i/><i/><i/></div><span className="pf-volume-footer">RUI WANG <i aria-hidden="true">↗</i></span></div>)}</div>}
    <div className="pf-ai-object-caption">{[local(language, "方法与比较条件", "METHODS & COMPARISON CRITERIA"), local(language, "执行、复算与差异定位", "EXECUTION, RECALCULATION & CHECKS"), local(language, "交付与复用", "DELIVERY & REUSE")][stage]}</div>
  </div>;
}

function AIPractice({ language, paused }: { language: Language; paused: boolean }) {
  const [practice, setPractice] = useState(0), [stage, setStage] = useState(0);
  const item = aiPractice[practice], detail = details[practice].stages[stage];
  const labels = [local(language, "我的判断", "My judgment"), local(language, "Codex 执行", "Codex execution"), local(language, "交付与复用", "Delivery & reuse")];
  return <section className="pf-ai pf-section" id="method" data-tone="night"><div className="pf-wrap">
    <div className="pf-section-head"><div><p className="pf-eyebrow">02 / RESEARCH × AI</p><h2>{local(language, "AI 提效实践", "AI in research practice")}</h2></div><p>{local(language, "把研究规则写进工具，让分析、核验与报告更新能够复用。", "Reusable tools for analysis, validation, and reporting, built around research rules.")}</p></div>
    <div className="pf-ai-tabs" role="tablist" aria-label={local(language, "选择AI实践", "Choose an AI practice")}>{aiPractice.map((p, i) => <button key={p.id} role="tab" id={`pf-ai-tab-${i}`} aria-controls="pf-ai-panel" aria-selected={practice === i} tabIndex={practice === i ? 0 : -1} onClick={() => { setPractice(i); setStage(0); }} onKeyDown={e => tabs(e, i, 3, setPractice)}><span>0{i + 1}</span>{p.title[language]}</button>)}</div>
    <article id="pf-ai-panel" role="tabpanel" aria-labelledby={`pf-ai-tab-${practice}`} className="pf-ai-panel">
      <div className="pf-ai-text"><p className="pf-ai-context">{item.context[language]}</p><div className="pf-stage-tabs" role="tablist" aria-label={local(language, "研究工作阶段", "Research workflow stage")}>{labels.map((label, i) => <button type="button" role="tab" key={label} id={`pf-stage-tab-${i}`} aria-controls="pf-stage-panel" aria-selected={stage === i} tabIndex={stage === i ? 0 : -1} onClick={() => setStage(i)} onKeyDown={e => tabs(e, i, 3, setStage)}><span>0{i + 1}</span>{label}</button>)}</div>
        <div id="pf-stage-panel" role="tabpanel" aria-labelledby={`pf-stage-tab-${stage}`} className="pf-stage-content" key={`${practice}-${stage}`}><h3>{detail.title[language]}</h3><p>{item[(["decision", "execution", "output"] as const)[stage]][language]}</p><dl>{detail.points.map(p => <div key={p.label.en}><dt>{p.label[language]}</dt><dd>{p.text[language]}</dd></div>)}</dl></div>
        <div className="pf-stage-footer"><span>{local(language, "研究规则 → 批量处理 → 重点复核", "RESEARCH RULES → BATCH EXECUTION → TARGETED REVIEW")}</span><button type="button" onClick={() => { setStage((stage + 1) % 3); document.getElementById(`pf-stage-tab-${(stage + 1) % 3}`)?.focus(); }} aria-label={local(language, "查看下一个阶段", "View the next stage")}><Arrow/></button></div>
      </div>
      <div className="pf-ai-visual" onPointerMove={e => tilt(e, paused)} onPointerLeave={resetTilt}><AIObject practice={practice} stage={stage} language={language}/></div>
    </article>
    <p className="pf-adoption"><i aria-hidden="true"/>{local(language, "研究工具已用于正式交付并被同事采用；配套手册与团队分享支持持续复用。", "Research tools are used in formal delivery and adopted by colleagues, supported by guides and team sharing.")}</p>
  </div></section>;
}

function Projects({ language }: { language: Language }) {
  const [category, setCategory] = useState("web");
  return <section className="pf-projects pf-section" id="projects" data-tone="light"><div className="pf-wrap"><div className="pf-section-head"><div><p className="pf-eyebrow">03 / PERSONAL PROJECTS</p><h2>{local(language, "把想法做成可以体验的作品。", "Ideas made tangible.")}</h2></div><p>{local(language, "研究之外，继续探索数据、交互与视觉表达。", "Exploring data, interaction, and visual expression beyond research.")}</p></div>
    <a className="pf-atlas-feature" href={`${atlasBase}${language === "en" ? "/en" : ""}/overseas/`}><div className="pf-atlas-copy"><p className="pf-eyebrow">GLOBAL DEVELOPMENT ATLAS</p><h3>{local(language, "全球发展数据查询", "Global Development Atlas")}</h3><p>{local(language, "围绕国家、指标与年份探索世界银行公开数据，进行多国同年比较、年度趋势、来源查看与 CSV 导出。", "Explore World Bank public data with country, indicator, and year filters, same-year comparisons, trends, source references, and CSV exports.")}</p><span className="pf-text-link">{local(language, "进入数据网站", "Explore the data website")}<Arrow/></span></div><div className="pf-atlas-art" aria-hidden="true"><div className="pf-atlas-rings"><i/><i/><i/></div><span className="pf-atlas-word">WORLD<br/>IN VIEW.</span><div className="pf-atlas-coordinates"><span>COUNTRY</span><span>INDICATOR</span><span>YEAR</span></div><span className="pf-atlas-corner">↗</span></div></a>
    <div className="pf-creative-heading"><h3>{local(language, "个人作品", "More personal projects")}</h3><div role="tablist" aria-label={local(language, "作品类型", "Project categories")}>{creativeCategories.map((c, i) => <button role="tab" key={c.id} id={`pf-project-tab-${c.id}`} aria-controls={`pf-project-panel-${c.id}`} aria-selected={c.id === category} tabIndex={c.id === category ? 0 : -1} onClick={() => setCategory(c.id)} onKeyDown={e => tabs(e, i, creativeCategories.length, n => setCategory(creativeCategories[n].id))}>{c.title[language]}</button>)}</div></div>
    {creativeCategories.map(c => <div key={c.id} id={`pf-project-panel-${c.id}`} role="tabpanel" hidden={c.id !== category} aria-labelledby={`pf-project-tab-${c.id}`} className="pf-project-list">{c.items.filter(i => i.title.en !== "Global Development Atlas").map((item, i) => <article key={item.title.en}><span className="pf-project-index">0{i + 1}</span><div><h4>{item.title[language]}</h4><p>{item.description[language]}</p></div><div className="pf-project-meta"><span>{item.status[language]}</span>{item.liveUrl && <a href={item.liveUrl.startsWith("/") ? `${base}${language === "en" ? "/en" : ""}${item.liveUrl}` : item.liveUrl} target="_blank" rel="noreferrer">{local(language, "在线体验", "View live")} ↗</a>}{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}</div></article>)}</div>)}
    <p className="pf-creative-note">{local(language, "AI 辅助设计与创作：交互网站、网页动效与视频；Blender / Three.js 三维视觉探索。本站以 React 与原生 WebGL 实现。", "AI-assisted Design & Creation: interactive websites, motion, and video; 3D exploration with Blender and Three.js. This site uses React and native WebGL.")}</p>
  </div></section>;
}

export function Portfolio({ language }: { language: Language }) {
  const [activeWork, setActiveWork] = useState(0), [paused, setPaused] = useState(false), [activeSection, setActiveSection] = useState("top"), [tone, setTone] = useState("light"), [copied, setCopied] = useState("");
  const [palette, setPalette] = useState(false), [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null), search = useRef<HTMLInputElement>(null), lastFocus = useRef<HTMLElement | null>(null), shell = useRef<HTMLElement>(null);
  const nav = [local(language, "重点工作", "Work"), local(language, "AI 提效实践", "AI practice"), local(language, "个人作品", "Projects"), local(language, "专业能力", "Capabilities")];
  useEffect(() => { document.documentElement.lang = language === "zh" ? "zh-CN" : "en"; }, [language]);
  useEffect(() => { const m = matchMedia("(prefers-reduced-motion: reduce)"); const sync = () => setPaused(m.matches); sync(); m.addEventListener("change", sync); return () => m.removeEventListener("change", sync); }, []);
  useEffect(() => {
    function keyboard(e: globalThis.KeyboardEvent) { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette(v => !v); } }
    window.addEventListener("keydown", keyboard); return () => window.removeEventListener("keydown", keyboard);
  }, []);
  useEffect(() => {
    if (palette) { lastFocus.current = document.activeElement as HTMLElement; dialog.current?.showModal(); search.current?.focus(); }
    else { dialog.current?.close(); lastFocus.current?.focus(); }
  }, [palette]);
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0; const y = (document.querySelector(".pf-header")?.getBoundingClientRect().bottom ?? 74) + 16; let next = "top", nextTone = "light";
      document.querySelectorAll<HTMLElement>(".portfolio-v17 [data-tone]").forEach(el => { const r = el.getBoundingClientRect(); if (r.top <= y && r.bottom > y) { next = el.id || "top"; nextTone = el.dataset.tone || "light"; } });
      setActiveSection(next); setTone(nextTone);
      shell.current?.style.setProperty("--pf-progress", `${Math.min(1, Math.max(0, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)))}`);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule); addEventListener("hashchange", schedule); update();
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); removeEventListener("hashchange", schedule); };
  }, []);
  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); setCopied(label); }
    catch { setCopied(local(language, "请长按或选中下方文字复制", "Select the address below to copy it")); }
    window.setTimeout(() => setCopied(""), 4000);
  }
  function jump(id: string) { setPalette(false); window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: paused ? "auto" : "smooth" }), 0); }
  const commands = [...chapters.map((id, i) => ({ id, label: [...nav, local(language, "联系我", "Contact")][i] })), { id: "top", label: local(language, "返回顶部", "Back to top") }].filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  return <main ref={shell} id="top" lang={language === "zh" ? "zh-CN" : "en"} className={`site-shell portfolio-v17 language-${language}`} data-motion={paused ? "still" : "flowing"}>
    <a className="skip-link" href="#work">{local(language, "跳至工作经历", "Skip to work experience")}</a>
    <header className={`pf-header tone-${tone}`}><div className="pf-wrap pf-header-inner"><a className="pf-brand" href="#top"><Image src={`${base}/images/rui-wang-chibi.png`} alt="" width={34} height={34} unoptimized/><span>{profile.name[language]}</span><small>RESEARCH & AI</small></a><nav aria-label={local(language, "主导航", "Main navigation")}>{nav.map((v, i) => <a href={`#${chapters[i]}`} key={v} aria-current={activeSection === chapters[i] ? "location" : undefined}>{v}</a>)}</nav><div className="pf-header-tools"><a href={`${base}/`} aria-current={language === "zh" ? "page" : undefined}>中</a><span>/</span><a href={`${base}/en/`} aria-current={language === "en" ? "page" : undefined}>EN</a><button type="button" onClick={() => setPalette(true)} aria-label={local(language, "打开快速访问", "Open quick access")}>⌘K</button></div></div><div className="pf-reading-progress" aria-hidden="true"/></header>
    <section className="pf-hero" id="content" data-tone="light"><PortfolioLight paused={paused}/><div className="pf-wrap pf-hero-layout"><div className="pf-hero-copy"><p className="pf-eyebrow"><i/>IPSOS · RESEARCH EXECUTIVE · BEIJING</p><p className="pf-hero-name">{profile.name[language]}<span>{language === "zh" ? "RUI WANG" : "王睿"}</span></p><h1>{profile.headline[language]}</h1><p className="pf-positioning">{profile.positioning[language]}</p><p className="pf-hero-summary">{profile.summary[language]}</p><div className="pf-hero-actions"><a className="pf-button" href="#work">{local(language, "查看重点工作", "Explore selected work")}<Arrow/></a><a className="pf-download" href={`${base}/resume/rui-wang-resume-zh.pdf?v=${release.contentVersion}`} download={release.downloadFileName}>{local(language, "下载中文简历", "Download Chinese résumé")}<span>↓</span></a></div><div className="pf-hero-identity"><Image src={`${base}/images/rui-wang-portrait.jpg`} alt={local(language, "王睿的职业照片", "Portrait of Rui Wang")} width={48} height={54} unoptimized priority/><p>{local(language, "定量研究为主，结合定性证据。", "Quantitative-led, with qualitative perspective.")}<span>{local(language, "多国用户研究 · 品牌追踪 · AI 研究工作流", "Multi-country research · Brand tracking · AI workflows")}</span></p></div></div><div className="pf-hero-world" onPointerMove={e => tilt(e, paused)} onPointerLeave={resetTilt}><div className="pf-world-label"><span>DIFFERENT MARKETS.</span><span>CONNECTED INSIGHTS.</span></div><div className="pf-globe-frame"><div className="pf-globe-orbit orbit-a"/><div className="pf-globe-orbit orbit-b"/><Image src={`${base}/images/research-globe.png`} alt={local(language, "以东亚与北美为主体的研究视野", "Research perspectives centered on East Asia and North America")} width={1254} height={1254} className="pf-globe-image" unoptimized priority/><span className="pf-world-origin">BEIJING</span></div><div className="pf-market-controls" aria-label={local(language, "项目涉及的部分市场", "Selected research markets")}>{markets.map(([code, flag, zh, en], i) => <button type="button" key={code} title={language === "zh" ? zh : en} aria-label={local(language, `查看${zh}相关研究`, `Explore research involving ${en}`)} onClick={() => { setActiveWork(code === "KR" ? 3 : 0); jump("work"); }} style={{ "--market-i": i } as CSSProperties}><Image src={`${base}/images/flags/${flag}.svg`} alt="" width={28} height={21} unoptimized/><span>{code}</span></button>)}</div><p className="pf-world-caption">{local(language, "多国研究经验 · 从市场理解用户", "MULTI-COUNTRY RESEARCH · UNDERSTANDING PEOPLE IN CONTEXT")}</p></div></div><div className="pf-hero-bottom pf-wrap"><span>RESEARCH / ANALYSIS / DELIVERY</span><a href="#work">{local(language, "继续探索", "Continue exploring")}<Arrow down/></a><button type="button" onClick={() => setPaused(v => !v)} aria-pressed={paused}>{paused ? "◌" : "≈"} {local(language, paused ? "开启动效" : "暂停动效", paused ? "Enable motion" : "Pause motion")}</button></div></section>
    <Work language={language} active={activeWork} setActive={setActiveWork} paused={paused}/>
    <AIPractice language={language} paused={paused}/>
    <Projects language={language}/>
    <section className="pf-capabilities pf-section" id="capabilities" data-tone="light"><div className="pf-wrap"><div className="pf-section-head"><div><p className="pf-eyebrow">04 / CAPABILITIES</p><h2>{local(language, "研究方法与实现能力。", "Research methods and practical implementation.")}</h2></div></div><div className="pf-capability-list">{capabilities.map((c, i) => <article key={c.title.en}><span>0{i + 1}</span><h3>{c.title[language]}</h3><p>{c.items[language]}</p></article>)}</div><div className="pf-education"><div><p className="pf-eyebrow">EDUCATION</p><h3>{education.institution[language]}</h3><p>{education.degree[language]}</p><strong>{education.focus[language]}</strong></div><div><span>{education.period}</span><p>{education.coursework[language]}</p><p>{local(language, "英语 TOEFL 110 · 普通话 母语", "English TOEFL 110 · Mandarin Chinese Native")}</p></div></div></div></section>
    <section id="contact" className="pf-contact pf-section" data-tone="teal"><div className="pf-wrap"><p className="pf-eyebrow">05 / CONTACT</p><div className="pf-contact-layout"><div><h2>{local(language, "一起把问题研究清楚。", "Let’s work through the questions.")}</h2><p>{local(language, "欢迎交流市场研究、用户洞察、数据分析与 AI 研究工作流。北京优先，也可接受上海、杭州与深圳。", "Open to conversations about market research, user insights, data analytics, and AI research workflows. Beijing preferred; open to Shanghai, Hangzhou, and Shenzhen.")}</p></div><div className="pf-contact-details"><a href={`mailto:${profile.email}`}>{profile.email}<Arrow/></a><div><button type="button" onClick={() => copy(profile.email, local(language, "邮箱已复制", "Email copied"))}>{local(language, "复制邮箱", "Copy email")}</button><a href={`tel:${profile.phone.href}`}>{profile.phone.display}</a><button type="button" onClick={() => copy(profile.phone.href, local(language, "电话已复制", "Phone copied"))}>{local(language, "复制电话", "Copy phone")}</button></div><p role="status" aria-live="polite" className="pf-copy-status">{copied || " "}</p><a className="pf-contact-resume" href={`${base}/resume/rui-wang-resume-zh.pdf?v=${release.contentVersion}`} download={release.downloadFileName}>{local(language, "下载中文简历", "Download Chinese résumé")} ↓</a></div></div><footer><span>© {new Date(release.updatedAt).getFullYear()} {profile.name[language]}</span><span>{local(language, "定量研究 · 数据分析 · 多市场洞察 · AI 研究工作流", "QUANTITATIVE RESEARCH · DATA ANALYTICS · MULTI-MARKET INSIGHT · AI WORKFLOWS")}</span><a href="#top">{local(language, "返回顶部", "Back to top")} ↑</a></footer></div></section>
    <dialog ref={dialog} className="pf-command" onClose={() => setPalette(false)} aria-labelledby="pf-command-title" onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) setPalette(false); } }}><div className="pf-command-head"><h2 id="pf-command-title">{local(language, "快速访问", "Quick access")}</h2><button type="button" onClick={() => setPalette(false)} aria-label={local(language, "关闭", "Close")}>×</button></div><input ref={search} value={query} onChange={e => setQuery(e.target.value)} placeholder={local(language, "搜索工作、AI、作品或联系", "Search work, AI, projects, or contact")} aria-label={local(language, "搜索页面章节", "Search site sections")}/><div className="pf-command-results">{commands.map(c => <button key={c.id} type="button" onClick={() => jump(c.id)}>{c.label}<Arrow/></button>)}{commands.length === 0 && <p>{local(language, "没有匹配的章节", "No matching section")}</p>}</div></dialog>
  </main>;
}

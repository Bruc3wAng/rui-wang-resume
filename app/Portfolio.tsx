"use client";

import { useEffect, useImperativeHandle, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent, type CSSProperties, type Ref } from "react";
import Image from "next/image";
import NavigationAvatar from "./NavigationAvatar";
import { profile, selectedWork, experiences, aiPractice, creativeCategories, capabilities, education, type CreativeItem, type Language } from "../content/resume";
import details from "../content/ai-details.json";
import release from "../content/resume-release.json";
import ResumeDownload from "./ResumeDownload";
import PortfolioLight from "./PortfolioLight";
import InteractiveGlobe from "./InteractiveGlobe";
import { caseWorkIndices, mapStudyIds, type MarketStudyOrigin } from "./globe-research";
import ShareLocale from "./ShareLocale";
import ResearchLab, { type ResearchLabHandle } from "./ResearchLab";
import { researchExampleFor } from "./research-lab";
import { internshipProjects } from "../content/portfolio-exhibits";
import { folioDescriptionsFor, responsibilityLabel } from "../content/work-folios";
import { atlasProjectPath, personalProjectHref, personalProjectStories, personalProjectStory } from "../content/personal-projects";
import WorkStudyHeader from "./WorkStudyHeader";
import CopyPortfolioLink from "./CopyPortfolioLink";
import { workStudyCopyFor } from "./work-study-copy";
import { heroBrief, heroCases } from "./hero-brief";
import { aiWorkflowProofFor } from "./ai-workflow-proof";
import { browserPortfolioFragment, mapFragment, mapIndexFromFragment, portfolioLocaleHref, practiceFragment, practiceIndexFromFragment, staticPortfolioFragment, studyFragment, studyHistoryInitializer, studyIndexFromFragment, subscribePortfolioFragment, updatePortfolioFragment, type HistoryMode } from "./study-location";
import "./portfolio.css";
import "./portfolio-refinement.css";
import "./work-value.css";
import "./work-navigation.css";
import "./research-folios.css";
import "./personal-projects.css";
import "./hero-brief.css";
import "./ai-workflow-proof.css";
import "./practice-navigation.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const local = (l: Language, zh: string, en: string) => l === "zh" ? zh : en;
const chapters = ["work", "method", "projects", "capabilities", "contact"];
const compactAIQuery = "(max-width: 767px)";
function subscribeCompactAI(onChange: () => void) {
  const media = window.matchMedia(compactAIQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function isCompactAI() { return window.matchMedia(compactAIQuery).matches; }
function serverCompactAI() { return false; }
const compactWorkQuery = "(max-width: 699px)";
function subscribeCompactWork(onChange: () => void) {
  const media = window.matchMedia(compactWorkQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function isCompactWork() { return window.matchMedia(compactWorkQuery).matches; }
const workAIPracticeById: Record<string, string | undefined> = {
  "content-tracking": "research-analysis", "brand-tracking": "tracking-delivery",
};
function relatedStudyForPractice(id: string) { return selectedWork.findIndex(work => workAIPracticeById[work.id] === id); }
function isPlainLinkActivation(event: MouseEvent<HTMLAnchorElement>) { return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey; }
function practiceLanding(index: number) {
  const focus = `pf-ai-tab-${index}`;
  return { focus, scroll: isCompactAI() ? focus : "method" };
}
function Arrow({ down = false }: { down?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={down ? "pf-arrow is-down" : "pf-arrow"} fill="none"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

function HeroCaseIndex({ language, onOpen }: { language: Language; onOpen: (id: string) => void }) {
  return <nav className="pf-hero-index" aria-labelledby="pf-hero-index-title">
    <h2 id="pf-hero-index-title">{local(language, "代表案例", "Selected studies")}</h2>
    <ol role="list">
      {heroCases.map((entry, i) => <li key={entry.id}>
        <a className="pf-hero-case-link" href={studyFragment(entry.id)} onClick={event => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
          event.preventDefault();
          onOpen(entry.id);
        }}>
          <span className="pf-hero-case-number" aria-hidden="true">0{i + 1}</span>
          <span className="pf-hero-case-copy"><strong>{entry.title[language]}</strong><small>{entry.note[language]}</small></span>
          <Arrow/>
        </a>
      </li>)}
    </ol>
  </nav>;
}

function tabs(e: KeyboardEvent<HTMLButtonElement>, index: number, total: number, set: (i: number) => void, selector = '[role="tab"]') {
  const n = e.key === "Home" ? 0 : e.key === "End" ? total - 1 : ["ArrowRight", "ArrowDown"].includes(e.key) ? (index + 1) % total : ["ArrowLeft", "ArrowUp"].includes(e.key) ? (index + total - 1) % total : -1;
  if (n < 0) return; e.preventDefault(); set(n);
  e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(selector)[n]?.focus();
}

type ResearchFolioHandle = { openAt: (output: number, source: HTMLButtonElement) => void };

function ResearchObject({ active, language, paused, ready, ref }: { active: number; language: Language; paused: boolean; ready: boolean; ref: Ref<ResearchFolioHandle> }) {
  const story = workStudyCopyFor(selectedWork[active].id);
  const [open, setOpen] = useState(false), [output, setOutput] = useState<number>(story.output);
  const [focusRequest, setFocusRequest] = useState(0);
  const selectedOutput = useRef<HTMLButtonElement>(null), page = useRef<HTMLDivElement>(null), focusContents = useRef(false);
  const opener = useRef<HTMLButtonElement | null>(null), restore = useRef<HTMLButtonElement | null>(null);
  const description = folioDescriptionsFor(selectedWork[active].id)[output];
  const pageId = `pf-folio-page-${active}`;
  const detailId = `pf-folio-detail-${active}`;
  useEffect(() => {
    if (open && focusContents.current) {
      focusContents.current = false;
      page.current?.scrollIntoView({ behavior: paused ? "instant" : "smooth", block: isCompactWork() ? "start" : "nearest" });
      selectedOutput.current?.focus({ preventScroll: true });
    } else if (!open && restore.current) {
      const target = restore.current;
      restore.current = null;
      // The cover row may be inert while the folio is open. Restore only
      // after the closed view is available again, and never into a hidden case.
      if (!target.isConnected || !target.getClientRects().length) return;
      target.scrollIntoView({ behavior: paused ? "instant" : "smooth", block: "nearest" });
      target.focus({ preventScroll: true });
    }
  }, [open, paused, focusRequest]);
  function openAt(index: number, source: HTMLButtonElement) {
    opener.current = source;
    focusContents.current = true;
    setOutput(index);
    setOpen(true);
    setFocusRequest(value => value + 1);
  }
  useImperativeHandle(ref, () => ({ openAt }));
  function closeFolio() {
    restore.current = opener.current;
    opener.current = null;
    setOpen(false);
  }
  return <div className={`pf-research-object object-${active}`} data-open={open} data-output={output} onKeyDown={e => { if (e.key === "Escape" && open) { e.preventDefault(); e.stopPropagation(); closeFolio(); } }}>
    <div className="pf-folio-page" id={pageId} ref={page} aria-hidden={!open} inert={!open}>
      <div className="pf-folio-page-head"><span className="pf-folio-kicker">{selectedWork[active].index} / RESEARCH</span>
        <button className="pf-folio-toggle" type="button" aria-controls={pageId} onClick={closeFolio}>{local(language, "合上档案", "Close folio")}<span aria-hidden="true">×</span></button>
      </div>
      <h4>{local(language, "研究档案", "Research folio")}</h4>
      <div className="pf-folio-output-tabs" role="tablist" aria-orientation="vertical" aria-label={local(language, "选择研究交付", "Choose a research output")}>{story.outputs.map((title, i) => <button type="button" role="tab" key={title.en} ref={i === output ? selectedOutput : undefined} id={`pf-folio-output-${active}-${i}`} aria-controls={detailId} aria-selected={output === i} tabIndex={output === i ? 0 : -1} onClick={() => setOutput(i)} onKeyDown={e => tabs(e, i, story.outputs.length, setOutput)}><span aria-hidden="true">0{i + 1}</span>{title[language]}<span aria-hidden="true">↗</span></button>)}</div>
      <div className="pf-folio-detail" id={detailId} role="tabpanel" aria-labelledby={`pf-folio-output-${active}-${output}`} key={output}><dl><div><dt>{local(language, "我做的部分", "My contribution")}</dt><dd>{description.content[language]}</dd></div><div><dt>{local(language, "研究用途", "Research purpose")}</dt><dd>{description.purpose[language]}</dd></div></dl></div>
    </div>
    <div className="pf-folio-front" aria-hidden={open} inert={open}>
      <div className="pf-folio-cover">
        <div className="pf-folio-cover-head"><span>{selectedWork[active].index} / RESEARCH</span><span>RUI WANG</span></div>
        <h4>{local(language, "研究档案", "Research folio")}</h4>
        <ul className="pf-folio-cover-index">
          {story.outputs.map((title, i) => <li key={title.en}><button className="pf-folio-cover-link" type="button" disabled={!ready} data-output-index={i} data-representative={i === story.output} aria-controls={pageId} aria-expanded={open && i === output} onClick={event => openAt(i, event.currentTarget)}>
            <span aria-hidden="true">0{i + 1}</span><strong>{title[language]}</strong><Arrow/>
          </button></li>)}
        </ul>
      </div>
    </div>
  </div>;
}

type WorkMarketContext = MarketStudyOrigin & { workIndex: number };

function WorkStudyPanel({ index, selected, ready, compact, language, paused, onReturn, fromMarket, onExploreAI, onViewMap }: {
  index: number; selected: boolean; ready: boolean; compact: boolean; language: Language; paused: boolean;
  onReturn: () => void; fromMarket: WorkMarketContext | null; onExploreAI: (index: number) => void; onViewMap: (index: number) => void;
}) {
  const folio = useRef<ResearchFolioHandle>(null);
  const item = selectedWork[index], story = workStudyCopyFor(item.id);
  const aiPracticeIndex = aiPractice.findIndex(practice => practice.id === workAIPracticeById[item.id]);
  const mapIndex = caseWorkIndices.findIndex(work => work === index);
  const outputName = story.outputs[story.output][language];
  const outputPurpose = folioDescriptionsFor(item.id)[story.output].purpose[language];
  const titleId = `pf-case-output-title-${index}`;
  return <article hidden={ready && !selected} className="pf-work-panel" data-selected={selected} id={`pf-work-panel-${index}`} role={compact ? "region" : "tabpanel"} aria-labelledby={`pf-work-tab-${index}`}>
    <span className="pf-study-anchor" id={studyFragment(item.id).slice(1)} aria-hidden="true"/>
    <div className="pf-work-story">
      <WorkStudyHeader id={item.id} index={index} title={item.title[language]} role={item.role[language]} language={language} returnAction={fromMarket
        ? <button className="pf-market-return" type="button" onClick={onReturn}><Arrow/>{fromMarket.fromMapLink ? local(language, "返回案例地图", "Back to study map") : local(language, "返回市场研究", "Back to market studies")}</button>
        : <button className="pf-work-return" type="button" onClick={onReturn}><Arrow/>{local(language, "返回研究目录", "Back to study index")}</button>}/>
      <p className="pf-work-summary">{story.context[language]}</p>
      <div className="pf-contribution"><h4>{local(language, "我的工作", "What I did")}</h4><p><strong>{story.action[language]}</strong>{local(language, "", " ")}{story.contribution[language]}</p></div>
      <div className="pf-case-result" data-case-output={story.output}>
        <h4>{local(language, "代表性交付", "Selected deliverable")}</h4>
        <strong id={titleId}>{outputName}</strong>
        <p>{outputPurpose}</p>
        <button type="button" className="pf-case-output-action" aria-controls={`pf-folio-page-${index}`} aria-describedby={titleId} onClick={event => folio.current?.openAt(story.output, event.currentTarget)}>
          {local(language, "查看交付说明", "View output details")}<Arrow/>
        </button>
      </div>
      {story.ai && <div className="pf-contribution pf-case-ai-note"><h4>{local(language, "AI 用法", "How I used AI")}</h4><p>{story.ai[language]}</p></div>}
      {(aiPracticeIndex >= 0 || mapIndex >= 0) && <div className="pf-case-paths">
        {aiPracticeIndex >= 0 && <a className="pf-case-ai-link" data-ai-practice={aiPracticeIndex} href={practiceFragment(aiPractice[aiPracticeIndex].id)} onClick={event => {
          if (!isPlainLinkActivation(event)) return;
          event.preventDefault();
          onExploreAI(aiPracticeIndex);
        }}>{aiPractice[aiPracticeIndex].id === "research-analysis" ? local(language, "查看 AI 分析流程", "Explore AI-assisted analysis") : local(language, "查看 AI 更新流程", "Explore AI-assisted reporting")}<Arrow/></a>}
        {mapIndex >= 0 && <a className="pf-case-map-link" href={mapFragment(mapStudyIds[mapIndex])} onClick={event => {
          if (!isPlainLinkActivation(event)) return;
          event.preventDefault();
          onViewMap(mapIndex);
        }}>{local(language, "查看案例地图", "View study map")}<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"/><ellipse cx="12" cy="12" rx="4" ry="8"/><path d="M4 12h16"/></svg></a>}
      </div>}
    </div>
    <div className="pf-object-stage"><ResearchObject ref={folio} active={index} language={language} paused={paused} ready={ready}/></div>
  </article>;
}

function Work({ language, active, setActive, paused, ready, onExploreAI, onViewMap, marketContext, onBackToMarket, onReturnToIndex }: {
  language: Language; active: number; setActive: (n: number, mode?: HistoryMode) => void; paused: boolean; ready: boolean;
  onExploreAI: (index: number) => void; onViewMap: (index: number) => void; marketContext: WorkMarketContext | null; onBackToMarket: (context: WorkMarketContext) => void; onReturnToIndex: () => void;
}) {
  const compact = useSyncExternalStore(subscribeCompactWork, isCompactWork, serverCompactAI);
  const revealTarget = useRef<number | null>(null);
  const [revealRequest, setRevealRequest] = useState(0);
  function chooseWork(index: number) {
    revealTarget.current = compact ? index : null;
    setActive(index, "push");
    setRevealRequest(value => value + 1);
  }
  useEffect(() => {
    if (!compact || revealTarget.current !== active) return;
    revealTarget.current = null;
    document.getElementById(`pf-work-panel-${active}`)?.scrollIntoView({ behavior: paused ? "auto" : "smooth", block: "start" });
    document.getElementById(`pf-work-question-${active}`)?.focus({ preventScroll: true });
  }, [active, compact, paused, revealRequest]);
  function returnToIndex() {
    revealTarget.current = null;
    onReturnToIndex();
    document.getElementById("pf-work-index")?.scrollIntoView({ behavior: paused ? "auto" : "smooth", block: "start" });
    document.getElementById(`pf-work-tab-${active}`)?.focus({ preventScroll: true });
  }
  const earlier = experiences[1];
  return <section className="pf-work pf-section" id="work" data-tone="light">
    <div className="pf-wrap">
      <div className="pf-section-head"><div><p className="pf-eyebrow">01 / SELECTED WORK</p><h2>{local(language, "重点工作", "Selected work")}</h2></div><p>{local(language, "多国研究、统计分析与研究交付。", "Multi-country studies, statistical analysis, and research delivery.")}</p></div>
      <div className="pf-employment"><div><h3>Ipsos <span>Research Executive</span></h3><p>{experiences[0].period[language]}<span>·</span>{experiences[0].meta[language]}</p></div><div className="pf-clients"><span>{local(language, "服务字节跳动与联想", "Serving ByteDance and Lenovo")}</span><div><Image src={`${base}/images/clients/bytedance.svg`} width={130} height={24} alt="ByteDance" unoptimized/><Image src={`${base}/images/clients/lenovo-horizontal.png`} className="pf-lenovo" width={146} height={35} alt="Lenovo" unoptimized/></div></div></div>
      <div className="pf-work-layout" data-study-url-ready={ready}>
        <div className="pf-work-nav" id="pf-work-index" role={compact ? "group" : "tablist"} aria-label={local(language, "选择研究项目", "Select a research project")} aria-orientation={compact ? undefined : "vertical"}>
          {selectedWork.map((p, i) => <button type="button" role={compact ? undefined : "tab"} key={p.id} id={`pf-work-tab-${i}`} aria-controls={`pf-work-panel-${i}`} aria-selected={compact ? undefined : active === i} aria-pressed={compact ? active === i : undefined} tabIndex={compact || active === i ? 0 : -1} onClick={() => chooseWork(i)} onKeyDown={e => tabs(e, i, selectedWork.length, setActive, ":scope > button")}><span>{p.index}</span><div><span className="pf-work-ownership">{responsibilityLabel(p.role[language])}</span><strong>{p.title[language]}</strong><small>{p.scope[language]}</small></div><span className="pf-tab-arrow" aria-hidden="true">↗</span></button>)}
        </div>
        {selectedWork.map((item, index) => {
          const origin = marketContext?.workIndex === index ? marketContext : null;
          return <WorkStudyPanel key={item.id} index={index} selected={active === index} ready={ready} compact={compact} language={language} paused={paused}
            fromMarket={origin} onReturn={origin ? () => onBackToMarket(origin) : returnToIndex} onExploreAI={onExploreAI} onViewMap={onViewMap}/>;
        })}
      </div>
      <section className="pf-internship-expanded"><header><div><p className="pf-eyebrow">EARLIER EXPERIENCE / COMMERCIAL RESEARCH</p><h3>{earlier.company[language]}<span>{earlier.title[language]}</span></h3></div><span>{earlier.period[language]}</span></header><div>{internshipProjects.map((project,i)=><article key={project.title.en}><span className="pf-internship-number">0{i+1}</span><h4>{project.title[language]}</h4><div><p>{project.contribution[language]}</p><p className="pf-internship-output">{project.output[language]}</p></div></article>)}</div></section>
    </div>
  </section>;
}

function PracticeLinkBriefs({ language, labels }: { language: Language; labels: string[] }) {
  const other = language === "zh" ? "en" : "zh";
  return <>
    <nav className="pf-ai-link-directory" aria-label={local(language, "研究实践目录", "Research practice directory")}>
      {aiPractice.map(item => <a key={item.id} href={practiceFragment(item.id)}>{item.title[language]}</a>)}
    </nav>
    {aiPractice.map((item, index) => {
      const fragment = practiceFragment(item.id), related = relatedStudyForPractice(item.id);
      return <section key={item.id} className="pf-ai-link-brief" id={fragment.slice(1)} data-default={index === 0} aria-labelledby={`pf-ai-brief-title-${index}`}>
        <h3 id={`pf-ai-brief-title-${index}`}>{item.title[language]}</h3>
        <p>{item.context[language]}</p>
        <dl>{aiWorkflowProofFor(item.id).map((step, i) => <div key={i}><dt>{labels[i]}</dt><dd>{step[language]}</dd></div>)}</dl>
        <div className="pf-ai-brief-links">
          {related >= 0 && <a href={studyFragment(selectedWork[related].id)}>{local(language, "查看研究案例", "View related study")}<Arrow/></a>}
          <a href={portfolioLocaleHref(base, other, fragment)} hrefLang={other === "zh" ? "zh-CN" : "en"} lang={other === "zh" ? "zh-CN" : "en"}>{language === "zh" ? "Read in English" : "阅读中文版"}<Arrow/></a>
        </div>
      </section>;
    })}
  </>;
}

function AIPractice({ language, practice, stage, ready, setPractice, setStage, onExploreWork }: { language: Language; practice: number; stage: number; ready: boolean; setPractice: (index: number, mode: HistoryMode) => void; setStage: (index: number) => void; onExploreWork: (index: number) => void }) {
  const compact = useSyncExternalStore(subscribeCompactAI, isCompactAI, serverCompactAI);
  const lab = useRef<ResearchLabHandle>(null);
  const example = researchExampleFor(practice);
  const item = aiPractice[practice], detail = details[practice].stages[stage];
  const relatedWorkIndex = relatedStudyForPractice(item.id);
  const proof = aiWorkflowProofFor(item.id);
  const labels = [local(language, "我的判断", "My judgment"), local(language, "Codex 执行", "Codex execution"), local(language, "交付与复用", "Delivery & reuse")];
  const next = (stage + 1) % labels.length;
  return <section className="pf-ai pf-section" id="method" data-tone="night" data-practice-url-ready={ready}><div className="pf-wrap">
    <div className="pf-section-head"><div><p className="pf-eyebrow">02 / RESEARCH × AI</p><h2>{local(language, "AI 提效实践", "AI in research practice")}</h2></div><p>{local(language, "把研究规则写进工具，让分析、核验与报告更新能够复用。", "Reusable tools for analysis, validation, and reporting, built around research rules.")}</p></div>
    <div className="pf-ai-tabs" role="tablist" aria-orientation={compact ? "vertical" : "horizontal"} aria-label={local(language, "选择AI实践", "Choose an AI practice")}>{aiPractice.map((p, i) => <button type="button" key={p.id} role="tab" id={`pf-ai-tab-${i}`} aria-controls="pf-ai-panel" aria-selected={practice === i} tabIndex={practice === i ? 0 : -1} onClick={() => setPractice(i, "push")} onKeyDown={e => tabs(e, i, aiPractice.length, index => setPractice(index, "replace"))}><span>0{i + 1}</span><span className="pf-ai-tab-label">{p.title[language]}</span><svg className="pf-ai-tab-indicator" aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4"/></svg></button>)}</div>
    {!ready && <PracticeLinkBriefs language={language} labels={labels}/>}
    <article id="pf-ai-panel" role="tabpanel" aria-labelledby={`pf-ai-tab-${practice}`} className="pf-ai-panel" data-practice={practice} data-stage={stage}>
      <div className="pf-ai-practice-meta">
        <p className="pf-ai-context">{item.context[language]}</p>
        <div className="pf-ai-practice-links">
          {relatedWorkIndex >= 0
            ? <div className="pf-ai-project" data-work-index={relatedWorkIndex}><div><span>{local(language, "研究项目", "RELATED STUDY")}</span><p>{selectedWork[relatedWorkIndex].title[language]}</p></div><button type="button" aria-controls={`pf-work-panel-${relatedWorkIndex}`} onClick={() => onExploreWork(relatedWorkIndex)}>{local(language, "查看项目", "View study")}<Arrow/></button></div>
            : <span className="pf-ai-prototype">{local(language, "个人研究原型", "Personal research prototype")}</span>}
          <CopyPortfolioLink key={item.id} fragment={practiceFragment(item.id)} kind="practice" language={language}/>
        </div>
      </div>
      <div className="pf-stage-tabs pf-ai-flow" role="tablist" aria-orientation={compact ? "vertical" : "horizontal"} aria-label={local(language, "研究工作阶段", "Research workflow stage")}>
        {labels.map((label, i) => <button type="button" role="tab" key={label} id={`pf-stage-tab-${i}`} aria-labelledby={`pf-stage-label-${i}`} aria-describedby={`pf-stage-proof-${i}`} aria-controls="pf-stage-panel" aria-selected={stage === i} tabIndex={stage === i ? 0 : -1} onClick={() => setStage(i)} onKeyDown={e => tabs(e, i, labels.length, setStage)}>
          <span className="pf-ai-flow-number" aria-hidden="true">0{i + 1}</span>
          <span className="pf-ai-flow-body"><strong id={`pf-stage-label-${i}`}>{label}</strong><small id={`pf-stage-proof-${i}`}>{proof[i][language]}</small></span>
          <Arrow down/>
        </button>)}
      </div>
      <div className="pf-ai-example" data-example={practice}>
        <div className="pf-ai-example-label"><svg className="pf-ai-example-mark" viewBox="0 0 42 42" fill="none" aria-hidden="true"><path d="M8 21h11m4 0 9-12m-9 12 9 12"/><circle cx="6" cy="21" r="2.5"/><circle cx="21" cy="21" r="3"/><circle cx="34" cy="7" r="2.5"/><circle cx="34" cy="35" r="2.5"/></svg><span>{local(language, "方法示例", "EXAMPLE")}</span></div>
        <div className="pf-ai-example-body"><h3 id="pf-ai-example-title">{example.title[language]}</h3><p id="pf-ai-example-summary">{example.prompt[language]}</p></div>
        <button type="button" className="pf-ai-run-example" aria-controls="pf-ai-method-example" aria-describedby="pf-ai-example-title pf-ai-example-summary" onClick={() => lab.current?.runExample()}>{local(language, "运行示例", "Run example")}<Arrow/></button>
      </div>
      <div className="pf-ai-workbench">
        <div className="pf-ai-text">
          <div id="pf-stage-panel" role="tabpanel" aria-labelledby={`pf-stage-tab-${stage}`} className="pf-stage-content" key={`${practice}-${stage}`}><h3>{detail.title[language]}</h3><dl>{detail.points.map(p => <div key={p.label.en}><dt>{p.label[language]}</dt><dd>{p.text[language]}</dd></div>)}</dl></div>
          <div className="pf-stage-footer"><button type="button" onClick={() => { setStage(next); document.getElementById(`pf-stage-tab-${next}`)?.focus(); }}>{stage < labels.length - 1 ? local(language, "下一步", "Next stage") : local(language, "回到第一步", "Back to first stage")}<Arrow/></button></div>
        </div>
        <div className="pf-ai-visual"><ResearchLab ref={lab} key={practice} practice={practice} stage={stage} language={language} onStageChange={setStage}/></div>
      </div>
      {practice < 2 && <p className="pf-adoption"><i aria-hidden="true"/>{local(language, "研究工具已用于正式交付并被同事采用；配套手册与团队分享支持持续复用。", "Research tools are used in formal delivery and adopted by colleagues, supported by guides and team sharing.")}</p>}
    </article>
  </div></section>;
}

function ProjectMark({ kind, index }: { kind: string; index: number }) {
  return <div className={`pf-project-mark mark-${kind}`} aria-hidden="true"><span className="pf-mark-index">0{index + 1}</span>{kind === "video" ? <div className="pf-mark-film"><i/><i/><i/></div> : kind === "games" ? <svg className="pf-mark-land" viewBox="0 0 160 100" fill="none"><path d="m12 57 46-30 48 4 43 27-47 29-49-3z"/><path d="m12 48 46-30 48 4 43 27-47 29-49-3z"/><path d="m58 18 2 37 42 23m-42-23 46-33"/><path d="m37 47 23-14 24 3 19 12-24 15-23-2z"/></svg> : <div className="pf-mark-browser"><span><i/><i/><i/></span><div><b/><i/><i/><i/></div></div>}<span className="pf-mark-type">{kind === "video" ? "MOTION" : kind === "games" ? "PLAY" : "INTERFACE"}</span></div>;
}

function WebProjectPreview({ index, language }: { index: number; language: Language }) {
  return <div className={`pf-web-preview preview-${index}`} aria-hidden="true">{index===0?<div className="pf-preview-resume"><div><span>RUI WANG</span><span>RÉSUMÉ / 01</span></div><strong>王睿<span>Research Executive</span></strong><p>Ipsos · Research & Analysis</p><i/><i/><i/><span className="pf-preview-footer">EXPERIENCE / INSIGHTS / AI</span></div>:index===1?<div className="pf-preview-photo"><Image src={`${base}/images/still-life.svg`} alt="" width={1200} height={900} unoptimized draggable={false}/><span className="pf-preview-photo-grade"/><span className="pf-preview-photo-line"/><span className="pf-preview-photo-label">LIGHT & COLOR</span></div>:<div className="pf-preview-dinner"><strong>Dinner<br/>Notes.</strong><div><span>ParkSide 园景</span><span>CANAL</span><span>一坐一忘</span></div><span className="pf-preview-dinner-note">{local(language,"今晚，吃点什么？","SOMETHING GOOD FOR TONIGHT.")}</span></div>}</div>;
}

const webCategory = creativeCategories.find(category => category.id === "web")!;
const projectCategories = [webCategory, ...creativeCategories.filter(category => category.id !== "web")];
const atlasProject = webCategory.items.find(item => item.liveUrl === atlasProjectPath)!;

function WebProjectCard({ item, language, order }: { item: CreativeItem; language: Language; order: number }) {
  const story = personalProjectStory(item.liveUrl);
  if (!item.liveUrl || !story || story.preview === undefined) return null;
  const titleId = `pf-project-title-${story.id}`;
  const actionId = `pf-project-action-${story.id}`;
  return <article aria-labelledby={titleId} style={{ "--project-order": order } as CSSProperties}>
    <a className="pf-web-preview-link" href={personalProjectHref(item.liveUrl, language, base)} aria-labelledby={actionId} aria-describedby={titleId}>
      <WebProjectPreview index={story.preview} language={language}/>
      <span className="pf-project-action" id={actionId}>{story.action[language]}<Arrow/></span>
    </a>
    <div className="pf-project-body">
      <span className="pf-project-status">{item.status[language]}</span>
      <h4 id={titleId}>{item.title[language]}</h4>
      <p className="pf-project-description">{story.summary[language]}</p>
      <p className="pf-project-contribution">{story.contribution[language]}</p>
      {item.sourceUrl && <a className="pf-project-source" href={item.sourceUrl} target="_blank" rel="noreferrer">{local(language, "查看网站源码", "View site source")} <span aria-hidden="true">↗</span></a>}
    </div>
  </article>;
}

function Projects({ language }: { language: Language }) {
  const [category, setCategory] = useState<(typeof creativeCategories)[number]["id"]>("web");
  const atlasStory = personalProjectStories[atlasProjectPath];
  return <section className="pf-projects pf-section" id="projects" data-tone="light" aria-labelledby="pf-projects-title"><div className="pf-wrap">
    <div className="pf-section-head"><div><p className="pf-eyebrow">03 / PERSONAL PROJECTS</p><h2 id="pf-projects-title">{local(language, "个人作品", "Personal projects")}</h2></div><p>{local(language, "公开数据查询、交互网站与创作实验。", "Data tools, interactive websites, and creative experiments.")}</p></div>
    <article className="pf-atlas-feature" aria-labelledby="pf-atlas-title">
      <div className="pf-atlas-copy">
        <p className="pf-eyebrow pf-project-status">{atlasProject.status[language]}</p>
        <h3 id="pf-atlas-title">{atlasProject.title[language]}</h3>
        <p className="pf-project-description">{atlasStory.summary[language]}</p>
        <p className="pf-project-contribution">{atlasStory.contribution[language]}</p>
        <a className="pf-text-link pf-atlas-entry" href={personalProjectHref(atlasProjectPath, language, base)} id="pf-atlas-action" aria-describedby="pf-atlas-title">{atlasStory.action[language]}<Arrow/></a>
      </div>
      <div className="pf-atlas-art" aria-hidden="true"><div className="pf-atlas-rings"><i/><i/><i/></div><span className="pf-atlas-word">WORLD<br/>IN VIEW.</span><div className="pf-atlas-coordinates"><span>COUNTRY</span><span>INDICATOR</span><span>YEAR</span></div></div>
    </article>
    <div className="pf-creative-heading">
      <h3>{local(language, "作品目录", "Project index")}</h3>
      <div role="tablist" aria-label={local(language, "作品类型", "Project categories")}>
        {projectCategories.map((c, i) => <button type="button" role="tab" key={c.id} id={`pf-project-tab-${c.id}`} aria-controls={`pf-project-panel-${c.id}`} aria-selected={c.id === category} tabIndex={c.id === category ? 0 : -1} onClick={() => setCategory(c.id)} onKeyDown={e => tabs(e, i, projectCategories.length, n => setCategory(projectCategories[n].id))}>{c.title[language]}</button>)}
      </div>
    </div>
    {projectCategories.map(c => <div key={c.id} id={`pf-project-panel-${c.id}`} role="tabpanel" hidden={c.id !== category} tabIndex={c.id === "web" ? undefined : 0} aria-labelledby={`pf-project-tab-${c.id}`} className={`pf-project-list collection-${c.id}`}>
      {c.items.filter(item => item.liveUrl !== atlasProjectPath).map((item, i) => c.id === "web"
        ? <WebProjectCard key={item.liveUrl} item={item} language={language} order={i}/>
        : <article key={item.title.en} style={{ "--project-order": i } as CSSProperties}>
          <ProjectMark kind={c.id} index={i}/>
          <div><h4>{item.title[language]}</h4><p>{item.description[language]}</p></div>
          <div className="pf-project-meta"><span className="pf-project-status">{item.status[language]}</span></div>
        </article>)}
    </div>)}
    <p className="pf-creative-note">{local(language, "AI 辅助设计与创作：交互网站、网页动效与视频；Blender / Three.js 三维视觉探索。本站以 React 与原生 WebGL 实现。", "AI-assisted Design & Creation: interactive websites, motion, and video; 3D exploration with Blender and Three.js. This site uses React and native WebGL.")}</p>
  </div></section>;
}

export function Portfolio({ language }: { language: Language }) {
  const [lastWork, setLastWork] = useState(0), [paused, setPaused] = useState(false), [activeSection, setActiveSection] = useState("top"), [tone, setTone] = useState("light"), [copied, setCopied] = useState("");
  const [marketContext, setMarketContext] = useState<WorkMarketContext | null>(null);
  const [aiView, setAIView] = useState({ practice: 0, stage: 0 });
  const [palette, setPalette] = useState(false), [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null), search = useRef<HTMLInputElement>(null), lastFocus = useRef<HTMLElement | null>(null), shell = useRef<HTMLElement>(null);
  const fragment = useSyncExternalStore<string | null>(subscribePortfolioFragment, browserPortfolioFragment, staticPortfolioFragment);
  const linkedWork = studyIndexFromFragment(fragment, selectedWork);
  const linkedPractice = practiceIndexFromFragment(fragment, aiPractice);
  const linkedMap = mapIndexFromFragment(fragment, mapStudyIds);
  const activeWork = linkedWork < 0 ? lastWork : linkedWork;
  const activeAIPractice = linkedPractice < 0 ? aiView.practice : linkedPractice;
  const aiStage = activeAIPractice === aiView.practice ? aiView.stage : 0;
  const localeFragment = linkedWork >= 0 ? studyFragment(selectedWork[linkedWork].id)
    : linkedPractice >= 0 ? practiceFragment(aiPractice[linkedPractice].id)
    : linkedMap >= 0 ? mapFragment(mapStudyIds[linkedMap])
    : fragment === "#method" ? fragment : "";
  const handledFragment = useRef<string | null>(null);
  const nav = [local(language, "重点工作", "Work"), local(language, "AI 提效实践", "AI practice"), local(language, "个人作品", "Projects"), local(language, "专业能力", "Capabilities")];
  useEffect(() => { const m = matchMedia("(prefers-reduced-motion: reduce)"); const sync = () => setPaused(m.matches); sync(); m.addEventListener("change", sync); return () => m.removeEventListener("change", sync); }, []);
  useEffect(() => {
    const handled = handledFragment.current === fragment;
    handledFragment.current = null;
    if ((linkedWork < 0 && linkedPractice < 0 && linkedMap < 0) || handled) return;
    // Wait for the selected panel to be painted before moving focus.
    const frame = requestAnimationFrame(() => {
      if (window.location.hash !== fragment) return;
      const target = linkedWork >= 0 ? { scroll: `pf-work-panel-${linkedWork}`, focus: `pf-work-question-${linkedWork}` }
        : linkedMap >= 0 ? { scroll: "rg-map-address", focus: "rg-map-title" } : practiceLanding(linkedPractice);
      document.getElementById(target.scroll)?.scrollIntoView({ behavior: "instant", block: "start" });
      document.getElementById(target.focus)?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [fragment, linkedWork, linkedPractice, linkedMap]);
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
  function jump(id: string, focusId?: string) { setPalette(false); window.setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: paused ? "auto" : "smooth" }); if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true }); }, 0); }
  function setWorkLocation(index: number, mode: HistoryMode) {
    const next = studyFragment(selectedWork[index].id);
    setLastWork(index);
    if (window.location.hash !== next) {
      handledFragment.current = next;
      updatePortfolioFragment(next, mode);
    }
  }
  function setSectionLocation(id: string) {
    setLastWork(activeWork);
    updatePortfolioFragment(`#${id}`);
  }
  function goToSection(id: string, focusId?: string) { setSectionLocation(id); jump(id, focusId); }
  function setPracticeLocation(index: number, mode: HistoryMode) {
    setLastWork(activeWork);
    setAIView({ practice: index, stage: 0 });
    const next = practiceFragment(aiPractice[index].id);
    if (window.location.hash !== next) {
      handledFragment.current = next;
      updatePortfolioFragment(next, mode);
    }
  }
  function openAIFromWork(index: number) {
    setPracticeLocation(index, "push");
    const target = practiceLanding(index);
    jump(target.scroll, target.focus);
  }
  function setMapLocation(index: number, mode: HistoryMode = "push") {
    const next = mapFragment(mapStudyIds[index]);
    setLastWork(activeWork);
    if (window.location.hash === next) {
      if (mode === "push") jump("rg-map-address", "rg-map-title");
      return;
    }
    if (mode === "replace") handledFragment.current = next;
    updatePortfolioFragment(next, mode);
  }
  function selectWork(index: number, mode: HistoryMode = "replace") { setMarketContext(null); setWorkLocation(index, mode); }
  function showWork(index: number) { setWorkLocation(index, "push"); jump(`pf-work-panel-${index}`, `pf-work-question-${index}`); }
  function openFeaturedStudy(id: string) {
    const index = selectedWork.findIndex(study => study.id === id);
    if (index < 0) return;
    setMarketContext(null);
    showWork(index);
  }
  function openWorkFromMarket(index: number, origin: MarketStudyOrigin) { setMarketContext({ ...origin, workIndex: index }); showWork(index); }
  function backToMarket(origin: WorkMarketContext) {
    if (origin.fromMapLink) { setMapLocation(origin.studyIndex); return; }
    const market = document.getElementById("rg-market-research")?.dataset.market;
    const study = document.getElementById("rg-study-panel")?.dataset.study;
    const sameStudy = market === origin.market && study === String(origin.studyIndex);
    goToSection("rg-market-research", sameStudy ? `rg-study-tab-${origin.studyIndex}` : "rg-market-heading");
  }
  const commands = [...chapters.map((id, i) => ({ id, label: [...nav, local(language, "联系我", "Contact")][i] })), { id: "top", label: local(language, "返回顶部", "Back to top") }].filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  return <main ref={shell} id="top" lang={language === "zh" ? "zh-CN" : "en"} className={`site-shell portfolio-v17 language-${language}`} data-motion={paused ? "still" : "flowing"}>
    <script id="pf-study-history" dangerouslySetInnerHTML={{ __html: studyHistoryInitializer }}/>
    <ShareLocale language={language}/>
    <a className="skip-link" href="#work">{local(language, "跳至工作经历", "Skip to work experience")}</a>
    <header className={`pf-header tone-${tone}`}><div className="pf-wrap pf-header-inner"><a className="pf-brand" href="#top"><NavigationAvatar/><span>{profile.name[language]}</span><small>RESEARCH & AI</small></a><nav aria-label={local(language, "主导航", "Main navigation")}>{nav.map((v, i) => <a href={`#${chapters[i]}`} key={v} aria-current={activeSection === chapters[i] ? "location" : undefined}>{v}</a>)}</nav><div className="pf-header-tools"><a href={portfolioLocaleHref(base, "zh", localeFragment)} hrefLang="zh-CN" lang="zh-CN" aria-label="中文" aria-current={language === "zh" ? "page" : undefined}>中</a><span>/</span><a href={portfolioLocaleHref(base, "en", localeFragment)} hrefLang="en" lang="en" aria-label="English" aria-current={language === "en" ? "page" : undefined}>EN</a><button type="button" onClick={() => setPalette(true)} aria-label={local(language, "打开快速访问", "Open quick access")}>⌘K</button></div></div><div className="pf-reading-progress" aria-hidden="true"/></header>
    <section className="pf-hero" id="content" data-tone="light">
      <PortfolioLight paused={paused}/>
      <div className="pf-wrap pf-hero-layout">
        <div className="pf-hero-copy">
          <div className="pf-hero-masthead">
            <Image src={`${base}/images/rui-wang-portrait.jpg`} alt={local(language, "王睿的职业照片", "Portrait of Rui Wang")} width={48} height={54} unoptimized priority/>
            <div>
              <p className="pf-masthead-name">{profile.name[language]}<span lang={language === "zh" ? "en" : "zh-CN"}>{language === "zh" ? "RUI WANG" : "王睿"}</span></p>
              <p className="pf-masthead-role">{local(language, "益普索", "Ipsos")} · <span lang="en">{experiences[0].title.en}</span> · {local(language, "北京", "Beijing")}</p>
            </div>
          </div>
          <h1>{heroBrief.headline[language]}</h1>
          <p className="pf-hero-summary">{heroBrief.summary[language]}</p>
          <div className="pf-hero-actions">
            <a className="pf-button" href="#work">{local(language, "全部案例", "All cases")}<Arrow/></a>
            <ResumeDownload language={language} className="pf-download"/>
          </div>
          <HeroCaseIndex language={language} onOpen={openFeaturedStudy}/>
        </div>
        <div className="pf-hero-world">
          <InteractiveGlobe language={language} paused={paused} ready={fragment !== null} linkedStudy={linkedMap >= 0 ? linkedMap : null} onExplore={openWorkFromMarket} onViewMap={setMapLocation}/>
        </div>
      </div>
      <div className="pf-hero-bottom pf-wrap"><span>RESEARCH / ANALYSIS / DELIVERY</span><a href="#work">{local(language, "继续探索", "Continue exploring")}<Arrow down/></a><button type="button" onClick={() => setPaused(v => !v)} aria-pressed={paused}>{paused ? "◌" : "≈"} {local(language, paused ? "开启动效" : "暂停动效", paused ? "Enable motion" : "Pause motion")}</button></div>
    </section>
    <Work language={language} active={activeWork} setActive={selectWork} paused={paused} ready={fragment !== null} marketContext={marketContext} onBackToMarket={backToMarket}
      onReturnToIndex={() => setSectionLocation("pf-work-index")} onExploreAI={openAIFromWork} onViewMap={setMapLocation}/>
    <AIPractice language={language} practice={activeAIPractice} stage={aiStage} ready={fragment !== null} setPractice={setPracticeLocation} setStage={stage => setAIView({ practice: activeAIPractice, stage })} onExploreWork={index => { if (marketContext?.workIndex !== index) setMarketContext(null); showWork(index); }}/>
    <Projects language={language}/>
    <section className="pf-capabilities pf-section" id="capabilities" data-tone="light"><div className="pf-wrap"><div className="pf-section-head"><div><p className="pf-eyebrow">04 / CAPABILITIES</p><h2>{local(language, "研究方法与实现能力。", "Research methods and practical implementation.")}</h2></div></div><div className="pf-capability-list">{capabilities.map((c, i) => <article key={c.title.en}><span>0{i + 1}</span><h3>{c.title[language]}</h3><p>{c.items[language]}</p></article>)}</div><div className="pf-education"><div className="pf-university-image"><Image src={`${base}/images/uoft-signature.webp`} width={690} height={302} alt="University of Toronto" unoptimized/></div><div className="pf-education-body"><p className="pf-eyebrow">EDUCATION</p><h3>{education.institution[language]}</h3><p>{education.degree[language]}</p><strong>{education.focus[language]}</strong><span className="pf-education-period">{education.period}</span><p>{education.coursework[language]}</p><p>{local(language,"英语 TOEFL 110 · 普通话 母语","English TOEFL 110 · Mandarin Chinese Native")}</p></div></div></div></section>
    <section id="contact" className="pf-contact pf-section" data-tone="light"><div className="pf-wrap"><p className="pf-eyebrow">05 / CONTACT</p><div className="pf-contact-layout"><div><h2>{local(language, "一起把问题研究清楚。", "Let’s work through the questions.")}</h2><p>{local(language, "欢迎交流市场研究、用户洞察、数据分析与 AI 研究工作流。北京优先，也可接受上海、杭州与深圳。", "Open to conversations about market research, user insights, data analytics, and AI research workflows. Beijing preferred; open to Shanghai, Hangzhou, and Shenzhen.")}</p></div><div className="pf-contact-details"><a href={`mailto:${profile.email}`}>{profile.email}<Arrow/></a><div><button type="button" onClick={() => copy(profile.email, local(language, "邮箱已复制", "Email copied"))}>{local(language, "复制邮箱", "Copy email")}</button><a href={`tel:${profile.phone.href}`}>{profile.phone.display}</a><button type="button" onClick={() => copy(profile.phone.href, local(language, "电话已复制", "Phone copied"))}>{local(language, "复制电话", "Copy phone")}</button></div><p role="status" aria-live="polite" className="pf-copy-status">{copied || " "}</p><div className="pf-resume-downloads"><ResumeDownload language={language} className="pf-contact-resume"/><ResumeDownload language={language} documentLanguage={language === "zh" ? "en" : "zh"} className="pf-resume-alternative" compact/></div></div></div><footer><span>© {new Date(release.updatedAt).getFullYear()} {profile.name[language]}</span><span>{local(language, "定量研究 · 数据分析 · 多市场洞察 · AI 研究工作流", "QUANTITATIVE RESEARCH · DATA ANALYTICS · MULTI-MARKET INSIGHT · AI WORKFLOWS")}</span><a href="#top">{local(language, "返回顶部", "Back to top")} ↑</a></footer></div></section>
    <dialog ref={dialog} className="pf-command" onClose={() => setPalette(false)} aria-labelledby="pf-command-title" onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) setPalette(false); } }}><div className="pf-command-head"><h2 id="pf-command-title">{local(language, "快速访问", "Quick access")}</h2><button type="button" onClick={() => setPalette(false)} aria-label={local(language, "关闭", "Close")}>×</button></div><input ref={search} value={query} onChange={e => setQuery(e.target.value)} placeholder={local(language, "搜索工作、AI、作品或联系", "Search work, AI, projects, or contact")} aria-label={local(language, "搜索页面章节", "Search site sections")}/><div className="pf-command-results">{commands.map(c => <button key={c.id} type="button" onClick={() => goToSection(c.id)}>{c.label}<Arrow/></button>)}{commands.length === 0 && <p>{local(language, "没有匹配的章节", "No matching section")}</p>}</div></dialog>
  </main>;
}
